-- Supabase SQL Schema for Rent-a-Date

-- Partners Table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  location TEXT,
  price_per_hour DECIMAL(10,2),
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  renter_id UUID NOT NULL, -- Link to Auth User
  partner_id UUID REFERENCES partners(id),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_hours INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  escrow_status TEXT DEFAULT 'hold', -- hold, released, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Mock Data
INSERT INTO partners (name, avatar_url, rating, review_count, bio, skills, location, price_per_hour, is_online)
VALUES 
('Linh Nguyen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 4.9, 128, 'Friendly and outgoing. Love cafe hopping and deep conversations.', ARRAY['Cafe Buddy', 'Movie Partner', 'Photography'], 'Hanoi', 35.00, true),
('Minh Hoang', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', 4.8, 92, 'Expert tour guide for local spots. Can drive and speak English fluently.', ARRAY['Tour Guide', 'Driving', 'Fluent English'], 'HCMC', 45.00, false);
