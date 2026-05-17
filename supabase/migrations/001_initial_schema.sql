-- KGiants E-Commerce Schema — run this in your Supabase SQL editor

create table if not exists products (
  id text primary key,
  sku text,
  created_at timestamptz default now(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  images text[] default '{}',
  category text,
  stock int not null default 0,
  featured boolean default false,
  visible boolean default true,
  weight_oz numeric(6, 2) default 4.0,
  scent text,
  inspired_by text,
  scent_notes jsonb,
  features text[],
  compatible_with text[],
  caution text,
  variants jsonb,
  low_stock_threshold int default 3
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_email text not null,
  stripe_payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending','paid','fulfilled','refunded')),
  subtotal numeric(10, 2) not null,
  vat numeric(10, 2) not null,
  shipping_fee numeric(10, 2) not null,
  total numeric(10, 2) not null,
  shipping_address jsonb,
  shipping_service text,
  estimated_delivery text
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity int not null,
  unit_price numeric(10, 2) not null
);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public read visible products" on products for select using (visible = true);

alter publication supabase_realtime add table products;

-- Seed real Aromar+ inventory
insert into products (id, sku, name, description, price, image_url, images, category, stock, featured, visible, weight_oz, features, compatible_with, low_stock_threshold) values
  ('AP-3001','AP-3001','Aromar+ Diffuser — White','Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. High-frequency ultrasonic waves transform water and essential oils into a fine mist.',79.99,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001LIFESTYLE.jpg?v=1709699818'],'Waterless Diffuser',2,true,true,24,array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],array['Aromar+ fragrance oils','Essential oils','Water-based scents'],1),
  ('AP-3002','AP-3002','Aromar+ Diffuser — Black','Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. High-frequency ultrasonic waves transform water and essential oils into a fine mist.',79.99,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002LIFESTYLE.jpg?v=1709831029'],'Waterless Diffuser',2,true,true,24,array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],array['Aromar+ fragrance oils','Essential oils','Water-based scents'],1),
  ('AP-3003','AP-3003','Aromar+ Diffuser — Silver','Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. High-frequency ultrasonic waves transform water and essential oils into a fine mist.',79.99,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003LIFESTYLE.jpg?v=1709830864'],'Waterless Diffuser',2,false,true,24,array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],array['Aromar+ fragrance oils','Essential oils','Water-based scents'],1),
  ('AP-3004','AP-3004','Aromar+ Diffuser — Gold','Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. High-frequency ultrasonic waves transform water and essential oils into a fine mist.',79.99,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004LIFESTYLE.jpg?v=1709831060'],'Waterless Diffuser',2,false,true,24,array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],array['Aromar+ fragrance oils','Essential oils','Water-based scents'],1),
  ('AP-1006','AP-1006','Fragrance Oil — Dubai','Waterless Fragrance Oil Dubai epitomizes the luxury and opulence of the Middle Eastern jewel city. Crafted using the finest ingredients, ideal for candles, air fresheners, and diffusion.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006LIFESTYLE.jpg?v=1709694654'],'Fragrance Oil',12,true,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],3),
  ('AP-1018','AP-1018','Fragrance Oil — Prague','Waterless Fragrance Oil Prague captures the mystical and historical essence of the Czech capital. Inspired by Baccarat Rouge®. Rich and mesmerizing aroma perfect for diffusion.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018LIFESTYLE.jpg?v=1709699257'],'Fragrance Oil',6,true,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],3),
  ('AP-1021','AP-1021','Fragrance Oil — Napa','Aromar+ Waterless Fragrance Oil inspired by the wine country of Napa Valley. A sophisticated, warm fragrance designed for use in waterless and ultrasonic diffusers.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654'],'Fragrance Oil',12,false,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers'],3),
  ('AP-1032','AP-1032','Fragrance Oil — Wild Citrus Grove','Combines the sparkling brightness of orange, the herbal spice of bay leaf, and the grounding richness of cedarwood. Creates a long-lasting fragrance that feels uplifting and balanced.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_-_V2_Wild_Citrus_Grove.jpg?v=1769721702','https://cdn.shopify.com/s/files/1/1531/8467/files/A_LINESNaturals1_2_67ae23e5-f7ef-4844-bd2e-8c70c97496ac.jpg?v=1769615566'],'Fragrance Oil',6,true,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],3),
  ('AP-1033','AP-1033','Fragrance Oil — Violet Air','The timeless serenity of lavender pairs with the crisp vitality of rosemary, while sandalwood grounds the fragrance with smooth, woody warmth. Transforms any room into a calm sanctuary.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_-_Violet_Air.jpg?v=1769614205','https://cdn.shopify.com/s/files/1/1531/8467/files/A_LuxuryPlugIn.jpg?v=1769614213'],'Fragrance Oil',6,false,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],3),
  ('AP-1036','AP-1036','Fragrance Oil — Golden Sage','The cleansing aroma of sage blends with the savory vibrancy of wild thyme, while vetiver provides a smoky, woody base. Ideal for meditation and cultivating a calm home environment.',35.00,'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043',array['https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043','https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036-V2GoldenSage.jpg?v=1769621050','https://cdn.shopify.com/s/files/1/1531/8467/files/goldensagelifestyle.jpg?v=1769720006'],'Fragrance Oil',18,true,true,2,null,array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],3);

-- Update scent notes for oils that have them
update products set scent_notes = '{"top":["Orange"],"middle":["Bay Leaf"],"base":["Cedarwood"]}'::jsonb, scent='Wild Citrus Grove', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1032';
update products set scent_notes = '{"top":["Lavender"],"middle":["Rosemary"],"base":["Sandalwood"]}'::jsonb, scent='Violet Air', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1033';
update products set scent_notes = '{"top":["Sage"],"middle":["Wild Thyme"],"base":["Vetiver"]}'::jsonb, scent='Golden Sage', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1036';
update products set scent='Dubai', inspired_by='W Hotel®', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1006';
update products set scent='Prague', inspired_by='Baccarat Rouge®', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1018';
update products set scent='Napa', caution='Not safe for skin, bath, or cream purposes.', variants='[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb where id='AP-1021';
