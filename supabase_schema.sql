-- Lens&Look Supabase Schema

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    discount_price DECIMAL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    stock INTEGER DEFAULT 0,
    sku TEXT,
    description TEXT,
    has_power BOOLEAN DEFAULT false,
    is_accessory BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    variants JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    total DECIMAL NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Read Policy (Public)
CREATE POLICY "Allow public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access for orders" ON orders FOR SELECT USING (true);

-- CMS Admin Policy (Service Role Key will bypass this, but for extra safety)
-- Usually Service Role Key bypasses RLS entirely, so these aren't strictly needed for the CMS if using Service Key.
-- But you can add specific ones if you use the Anon Key for CMS.

-- 5. Create Storage Buckets
-- Note: Buckets must be created via the Supabase Dashboard UI or API.
-- Bucket Name: "products"
