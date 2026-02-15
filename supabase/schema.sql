-- Database Schema for GuestHouse Management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guest Houses Table
CREATE TABLE IF NOT EXISTS guest_houses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gh_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    tin_no VARCHAR(100),
    permit_no VARCHAR(100),
    company_name VARCHAR(255),
    company_reg_no VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Room Types Table (belongs to Guest House)
CREATE TABLE IF NOT EXISTS room_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gh_id UUID REFERENCES guest_houses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table (belongs to Room Type)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_no VARCHAR(20) NOT NULL,
    room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    size VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_no, room_type_id)
);

-- Insert default guest house (for testing)
INSERT INTO guest_houses (
    gh_name, 
    contact_number, 
    email, 
    website, 
    address, 
    tin_no, 
    permit_no, 
    company_name, 
    company_reg_no, 
    is_active
) VALUES (
    'Grand Guest House',
    '+1 234 567 8900',
    'info@grandguesthouse.com',
    'www.grandguesthouse.com',
    '123 Main Street, City Center, State - 123456',
    'TIN123456789',
    'PERMIT2024001',
    'Grand Hospitality Pvt Ltd',
    'REG2024001',
    true
) ON CONFLICT DO NOTHING;

-- Insert default room types for the guest house
INSERT INTO room_types (gh_id, name, size)
SELECT id, 'Standard AC', '250 sqft' FROM guest_houses LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO room_types (gh_id, name, size)
SELECT id, 'Deluxe AC', '350 sqft' FROM guest_houses LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO room_types (gh_id, name, size)
SELECT id, 'Suite', '500 sqft' FROM guest_houses LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (room_no, room_type_id, size)
SELECT '101', id, '250 sqft' FROM room_types WHERE name = 'Standard AC' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO rooms (room_no, room_type_id, size)
SELECT '102', id, '250 sqft' FROM room_types WHERE name = 'Standard AC' LIMIT 1
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_types_gh_id ON room_types(gh_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_no ON rooms(room_no);

-- Enable Row Level Security
ALTER TABLE guest_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (adjust as needed for your security requirements)
CREATE POLICY "Allow anon read guest_houses" ON guest_houses FOR SELECT USING (true);
CREATE POLICY "Allow anon insert guest_houses" ON guest_houses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update guest_houses" ON guest_houses FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete guest_houses" ON guest_houses FOR DELETE USING (true);

CREATE POLICY "Allow anon read room_types" ON room_types FOR SELECT USING (true);
CREATE POLICY "Allow anon insert room_types" ON room_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update room_types" ON room_types FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete room_types" ON room_types FOR DELETE USING (true);

CREATE POLICY "Allow anon read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow anon insert rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update rooms" ON rooms FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete rooms" ON rooms FOR DELETE USING (true);
