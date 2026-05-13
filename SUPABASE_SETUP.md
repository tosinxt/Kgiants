# Supabase Database Setup

Run the following SQL commands in your Supabase SQL Editor to set up the structure for the e-commerce site.

### 1. Create Products Table

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false
);

-- Set up row level security to let everyone read, but restricted write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);
```

### 2. Insert Initial Data

```sql
INSERT INTO products (name, description, price, image_url, category, stock, featured)
VALUES 
('Eos Dynamic Headphones', 'Immersive spatial audio with active noise cancellation and 40-hour battery life.', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'Audio', 15, true),

('Lucent Mechanical Keyboard', 'Ultra-compact mechanical keyboard with customizable RGB and seamless wireless connectivity.', 149.50, 'https://images.unsplash.com/photo-1587829741301-dc798b83aca5?auto=format&fit=crop&w=800&q=80', 'Accessories', 8, true),

('Vortex Smart Watch', 'Sophisticated design meets advanced health tracking. Track heart rate effortlessly.', 199.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 'Wearables', 24, true),

('Quantum Wireless Mouse', 'Ergonomically engineered for lightning-fast responsiveness. Ultra-lightweight chassis.', 89.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', 'Accessories', 42, false),

('Horizon Curved Monitor', '34-inch ultrawide screen with vibrant 4K resolution for panoramic perspective.', 749.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', 'Display', 5, true),

('Lumina Studio Light', 'High-output cinematic lighting with controllable color temperature.', 129.00, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Video', 12, false);
```

### 3. Add Environment Variables

Create an `.env.local` file in the root of your project with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
