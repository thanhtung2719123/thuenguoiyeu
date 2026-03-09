-- Supabase SQL Schema for Rent-a-Date (Production Ready)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (Base for all users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  province TEXT,
  gender TEXT,
  birthday DATE,
  email TEXT,
  balance DECIMAL(15,2) DEFAULT 0,
  is_partner BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist in profiles (in case table was created earlier)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday DATE;

-- Partners Table (Extension for partner users)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  skills TEXT[] DEFAULT '{}',
  game_tags TEXT[] DEFAULT '{}',
  location TEXT,
  gallery TEXT[] DEFAULT '{}',
  price_per_hour DECIMAL(15,2),
  is_online BOOLEAN DEFAULT false,
  availability_status TEXT DEFAULT 'available', -- available, busy, offline
  availability_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist in partners
ALTER TABLE partners ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS game_tags TEXT[] DEFAULT '{}';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(15,2);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{}';

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  renter_id UUID REFERENCES profiles(id),
  partner_id UUID REFERENCES partners(id),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_hours INTEGER NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  escrow_status TEXT DEFAULT 'hold', -- hold, released, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure receiver_id exists in messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS receiver_id UUID REFERENCES profiles(id);

-- Transactions Table (Wallet History)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL, -- deposit, withdrawal, payment, earning
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('galleries', 'galleries', true) ON CONFLICT (id) DO NOTHING;

-- Policies (Relaxed for Firebase Auth compatibility)
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON partners;
CREATE POLICY "Partners are viewable by everyone" ON partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Partners can insert their own details" ON partners;
CREATE POLICY "Partners can insert their own details" ON partners FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Partners can update their own details" ON partners;
CREATE POLICY "Partners can update their own details" ON partners FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can see their own bookings" ON bookings;
CREATE POLICY "Users can see their own bookings" ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can see their own messages" ON messages;
CREATE POLICY "Users can see their own messages" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can see their own transactions" ON transactions;
CREATE POLICY "Users can see their own transactions" ON transactions FOR SELECT USING (true);

-- Storage Objects Policies (Relaxed for Firebase Auth)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can update their own avatar" ON storage.objects;
CREATE POLICY "Anyone can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can delete their own avatar" ON storage.objects;
CREATE POLICY "Anyone can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
CREATE POLICY "Gallery images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Only partners can upload to gallery" ON storage.objects;
CREATE POLICY "Only partners can upload to gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Only partners can update their gallery" ON storage.objects;
CREATE POLICY "Only partners can update their gallery" ON storage.objects FOR UPDATE USING (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Only partners can delete their gallery" ON storage.objects;
CREATE POLICY "Only partners can delete their gallery" ON storage.objects FOR DELETE USING (bucket_id = 'galleries');


-- Trigger to prevent users from bypassing restrictions by manually updating 'is_partner' or 'balance'
CREATE OR REPLACE FUNCTION check_profile_updates()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_partner IS DISTINCT FROM OLD.is_partner OR NEW.balance IS DISTINCT FROM OLD.balance THEN
    -- If the role is just authenticated (a normal user), they cannot change these columns
    IF current_setting('role') = 'authenticated' THEN
      RAISE EXCEPTION 'Users cannot update their own balance or partner status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_check_profile_updates ON profiles;
CREATE TRIGGER tr_check_profile_updates
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION check_profile_updates();


