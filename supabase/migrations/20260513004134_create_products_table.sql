/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key, auto-generated)
      - `created_at` (timestamptz, default now())
      - `name` (text, not null)
      - `description` (text)
      - `price` (numeric(10,2), not null)
      - `image_url` (text)
      - `category` (text)
      - `stock` (integer, default 0)
      - `featured` (boolean, default false)

  2. Security
    - Enable RLS on `products` table
    - Add SELECT policy for everyone (products are publicly viewable)
    - No write policies — product management is handled server-side only

  3. Notes
    - Products are read-only from the client perspective
    - The public SELECT policy allows unauthenticated users to browse the shop
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  image_url text,
  category text,
  stock integer DEFAULT 0,
  featured boolean DEFAULT false
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured);
