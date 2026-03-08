-- Supabase SQL Schema for Rent-a-Date (Production Ready)

-- Profiles Table (Base for all users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  email TEXT,
  balance DECIMAL(15,2) DEFAULT 0,
  is_partner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners Table (Extension for partner users)
CREATE TABLE partners (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  skills TEXT[] DEFAULT '{}',
  location TEXT,
  gallery TEXT[] DEFAULT '{}',
  price_per_hour DECIMAL(15,2),
  is_online BOOLEAN DEFAULT false,
  availability_status TEXT DEFAULT 'available', -- available, busy, offline
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
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
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table (Wallet History)
CREATE TABLE transactions (
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

-- Basic Policies (Public read for partners, private for everything else)
CREATE POLICY "Partners are viewable by everyone" ON partners FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can see their own bookings" ON bookings FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = (SELECT id FROM partners WHERE id = partner_id));
CREATE POLICY "Users can see their own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can see their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
