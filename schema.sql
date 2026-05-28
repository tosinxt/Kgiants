-- ============================================================
-- KGiants — Supabase Schema + Seed Data
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Products ────────────────────────────────────────────────
create table if not exists products (
  id                 text        primary key default 'AP-' || floor(random() * 9000 + 1000)::text,
  sku                text        not null unique,
  name               text        not null,
  description        text,
  price              numeric(10,2) not null,
  image_url          text,
  images             text[]      default '{}',
  category           text        not null,
  stock              integer     not null default 0,
  featured           boolean     not null default false,
  visible            boolean     not null default true,
  weight_oz          numeric(6,2),
  scent              text,
  inspired_by        text,
  scent_notes        jsonb,
  features           text[]      default '{}',
  compatible_with    text[]      default '{}',
  caution            text,
  variants           jsonb,
  low_stock_threshold integer    not null default 2,
  created_at         timestamptz not null default now()
);

-- ── Orders ──────────────────────────────────────────────────
create table if not exists orders (
  id                        text        primary key,
  created_at                timestamptz not null default now(),
  customer_email            text        not null,
  stripe_payment_intent_id  text,
  status                    text        not null check (status in ('pending','paid','fulfilled','refunded')),
  subtotal                  numeric(10,2) not null,
  vat                       numeric(10,2) not null default 0,
  shipping_fee              numeric(10,2) not null default 0,
  total                     numeric(10,2) not null,
  shipping_address          jsonb,
  shipping_service          text,
  estimated_delivery        text
);

-- ── Order Items ─────────────────────────────────────────────
create table if not exists order_items (
  id           text        primary key default uuid_generate_v4()::text,
  order_id     text        not null references orders(id) on delete cascade,
  product_id   text        not null references products(id),
  product_name text        not null,
  quantity     integer     not null,
  unit_price   numeric(10,2) not null
);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_products_visible   on products(visible);
create index if not exists idx_products_category  on products(category);
create index if not exists idx_orders_created_at  on orders(created_at desc);
create index if not exists idx_order_items_order  on order_items(order_id);

-- ── RLS (enable row-level security) ─────────────────────────
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Public read for visible products
create policy "public can read visible products"
  on products for select
  using (visible = true);

-- Service role has full access (used by API routes)
create policy "service role full access on products"
  on products for all
  using (auth.role() = 'service_role');

create policy "service role full access on orders"
  on orders for all
  using (auth.role() = 'service_role');

create policy "service role full access on order_items"
  on order_items for all
  using (auth.role() = 'service_role');

-- ── Seed: Products ───────────────────────────────────────────
insert into products (id, sku, name, description, price, image_url, images, category, stock, featured, visible, weight_oz, features, compatible_with, low_stock_threshold)
values
  (
    'AP-3001', 'AP-3001', 'Aromar+ Diffuser — White',
    'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    79.99,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001LIFESTYLE.jpg?v=1709699818'
    ],
    'Waterless Diffuser', 2, true, true, 24,
    array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],
    array['Aromar+ fragrance oils','Essential oils','Water-based scents'],
    1
  ),
  (
    'AP-3002', 'AP-3002', 'Aromar+ Diffuser — Black',
    'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    79.99,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002LIFESTYLE.jpg?v=1709831029'
    ],
    'Waterless Diffuser', 2, true, true, 24,
    array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],
    array['Aromar+ fragrance oils','Essential oils','Water-based scents'],
    1
  ),
  (
    'AP-3003', 'AP-3003', 'Aromar+ Diffuser — Silver',
    'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    79.99,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003LIFESTYLE.jpg?v=1709830864'
    ],
    'Waterless Diffuser', 2, false, true, 24,
    array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],
    array['Aromar+ fragrance oils','Essential oils','Water-based scents'],
    1
  ),
  (
    'AP-3004', 'AP-3004', 'Aromar+ Diffuser — Gold',
    'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    79.99,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004LIFESTYLE.jpg?v=1709831060'
    ],
    'Waterless Diffuser', 2, false, true, 24,
    array['Innovative ultrasonic technology','Sleek minimalist design','Ambient mood lighting (multiple colors)','Whisper-quiet operation','Auto shut-off when water level is low','Easy to use and clean'],
    array['Aromar+ fragrance oils','Essential oils','Water-based scents'],
    1
  ),
  (
    'AP-1006', 'AP-1006', 'Fragrance Oil — Dubai',
    'Waterless Fragrance Oil Dubai by Aromar epitomizes the luxury and opulence of the Middle Eastern jewel city. Infusing your space with the rich and exotic aromas of Dubai, this fragrance oil is a celebration of grandeur and elegance. Crafted using the finest ingredients, Dubai fragrance oil is perfect for candles, air fresheners, and diffusion.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006LIFESTYLE.jpg?v=1709694654'
    ],
    'Fragrance Oil', 12, true, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  ),
  (
    'AP-1018', 'AP-1018', 'Fragrance Oil — Prague',
    'Waterless Fragrance Oil Prague by Aromar captures the mystical and historical essence of the Czech capital. This oil brings the unique charm of Prague''s cobbled streets, ancient architecture, and vibrant cultural life into your space, offering a scent as enchanting and complex as the city itself.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018LIFESTYLE.jpg?v=1709699257'
    ],
    'Fragrance Oil', 6, true, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  ),
  (
    'AP-1021', 'AP-1021', 'Fragrance Oil — Napa',
    'Aromar+ Waterless Fragrance Oil inspired by the wine country of Napa Valley. A sophisticated, warm fragrance designed for use in waterless and ultrasonic diffusers.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654'
    ],
    'Fragrance Oil', 12, false, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  ),
  (
    'AP-1032', 'AP-1032', 'Fragrance Oil — Wild Citrus Grove',
    'Bring the outdoors into your home with Wild Citrus Grove Diffuser Oil, a refreshing blend designed to energize your space. Combines the sparkling brightness of orange, the herbal spice of bay leaf, and the grounding richness of cedarwood.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_-_V2_Wild_Citrus_Grove.jpg?v=1769721702',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/A_LINESNaturals1_2_67ae23e5-f7ef-4844-bd2e-8c70c97496ac.jpg?v=1769615566'
    ],
    'Fragrance Oil', 6, true, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  ),
  (
    'AP-1033', 'AP-1033', 'Fragrance Oil — Violet Air',
    'Violet Air brings a refreshing yet sophisticated balance to your space with its calming floral and herbal blend. The timeless serenity of lavender pairs with the crisp vitality of rosemary, while sandalwood grounds the fragrance with smooth, woody warmth.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_-_Violet_Air.jpg?v=1769614205',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/A_LuxuryPlugIn.jpg?v=1769614213'
    ],
    'Fragrance Oil', 6, false, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  ),
  (
    'AP-1036', 'AP-1036', 'Fragrance Oil — Golden Sage',
    'Golden Sage is an earthy, herbal diffuser oil crafted to soothe, ground, and restore balance to your space. The cleansing aroma of sage blends harmoniously with the savory vibrancy of wild thyme, while vetiver provides a smoky, woody base.',
    35.00,
    'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043',
    array[
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036-V2GoldenSage.jpg?v=1769621050',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/goldensagelifestyle.jpg?v=1769720006'
    ],
    'Fragrance Oil', 18, true, true, 2,
    array[]::text[],
    array['Waterless diffusers','Plug-in diffusers','Ultrasonic diffusers','Candles','Air fresheners'],
    3
  )
on conflict (id) do nothing;

-- Set scent, inspired_by, scent_notes, caution, variants for oil products
update products set
  scent = 'Dubai', inspired_by = 'W Hotel®',
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1006';

update products set
  scent = 'Prague', inspired_by = 'Baccarat Rouge®',
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1018';

update products set
  scent = 'Napa',
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1021';

update products set
  scent = 'Wild Citrus Grove',
  scent_notes = '{"top":["Orange"],"middle":["Bay Leaf"],"base":["Cedarwood"]}'::jsonb,
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1032';

update products set
  scent = 'Violet Air',
  scent_notes = '{"top":["Lavender"],"middle":["Rosemary"],"base":["Sandalwood"]}'::jsonb,
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1033';

update products set
  scent = 'Golden Sage',
  scent_notes = '{"top":["Sage"],"middle":["Wild Thyme"],"base":["Vetiver"]}'::jsonb,
  caution = 'Not safe for skin, bath, or cream purposes.',
  variants = '[{"title":"Single (60ml)","price":35.00},{"title":"2-Pack (120ml)","price":50.00},{"title":"3-Pack (180ml)","price":70.00}]'::jsonb
where id = 'AP-1036';

-- ── Seed: Orders ─────────────────────────────────────────────
insert into orders (id, created_at, customer_email, stripe_payment_intent_id, status, subtotal, vat, shipping_fee, total, shipping_address, shipping_service, estimated_delivery)
values
  ('ord-a7f2d3', now() - interval '2 hours',   'sarah.jones@gmail.com',      'pi_3Mx123', 'paid',      114.99, 23.00, 0.00,  137.99, '{"zip":"10012","name":"Sarah Jones","line1":"245 Mercer St","city":"New York","state":"NY"}'::jsonb,        'Standard Shipping', null),
  ('ord-b8c9d1', now() - interval '1 day 4 hours',  'marcus.vance@yahoo.com',     'pi_3Mx456', 'fulfilled', 70.00,  14.00, 5.99,  89.99,  '{"zip":"94105","name":"Marcus Vance","line1":"101 Howard St","city":"San Francisco","state":"CA"}'::jsonb,  'Express Delivery',  null),
  ('ord-c3d4e5', now() - interval '2 days 6 hours', 'elena.rodriguez@outlook.com','pi_3Mx789', 'paid',      114.99, 23.00, 0.00,  137.99, '{"zip":"33139","name":"Elena Rodriguez","line1":"1200 Ocean Dr","city":"Miami Beach","state":"FL"}'::jsonb, 'Standard Shipping', null),
  ('ord-d4e5f6', now() - interval '4 days 1 hour',  'james.milligan@gmail.com',   'pi_3Mx101', 'fulfilled', 150.00, 30.00, 0.00,  180.00, '{"zip":"60611","name":"James Milligan","line1":"700 N Michigan Ave","city":"Chicago","state":"IL"}'::jsonb,  'Free Standard',     null),
  ('ord-e5f6g7', now() - interval '6 days 12 hours','chloe.tan@gmail.com',        'pi_3Mx102', 'refunded',  79.99,  16.00, 8.50,  104.49, '{"zip":"90025","name":"Chloe Tan","line1":"11200 Santa Monica Blvd","city":"Los Angeles","state":"CA"}'::jsonb,'Express Delivery',  null),
  ('ord-f6g7h8', now() - interval '8 days 3 hours', 'robert.chen@yahoo.com',      'pi_3Mx103', 'fulfilled', 219.97, 44.00, 0.00,  263.97, '{"zip":"02108","name":"Robert Chen","line1":"45 Beacon St","city":"Boston","state":"MA"}'::jsonb,           'Free Standard',     null),
  ('ord-g7h8i9', now() - interval '10 days 8 hours','emma.watson@gmail.com',      'pi_3Mx104', 'fulfilled', 105.00, 21.00, 0.00,  126.00, '{"zip":"75201","name":"Emma Watson","line1":"2001 Flora St","city":"Dallas","state":"TX"}'::jsonb,           'Standard Shipping', null),
  ('ord-h8i9j0', now() - interval '13 days 2 hours','nathan.wood@icloud.com',     'pi_3Mx105', 'fulfilled', 149.99, 30.00, 0.00,  179.99, '{"zip":"98101","name":"Nathan Wood","line1":"1301 Pike St","city":"Seattle","state":"WA"}'::jsonb,           'Free Standard',     null),
  ('ord-i9j0k1', now() - interval '16 days 5 hours','linda.hamilton@aol.com',     'pi_3Mx106', 'fulfilled', 35.00,  7.00,  5.99,  47.99,  '{"zip":"30303","name":"Linda Hamilton","line1":"250 Peachtree St","city":"Atlanta","state":"GA"}'::jsonb,    'Standard Shipping', null),
  ('ord-j0k1l2', now() - interval '20 days 1 hour', 'william.taylor@gmail.com',   'pi_3Mx107', 'fulfilled', 184.99, 37.00, 0.00,  221.99, '{"zip":"78701","name":"William Taylor","line1":"110 E 2nd St","city":"Austin","state":"TX"}'::jsonb,          'Free Standard',     null),
  ('ord-k1l2m3', now() - interval '24 days 18 hours','sophia.gomez@gmail.com',    'pi_3Mx108', 'fulfilled', 70.00,  14.00, 5.99,  89.99,  '{"zip":"80202","name":"Sophia Gomez","line1":"1701 Wynkoop St","city":"Denver","state":"CO"}'::jsonb,         'Standard Shipping', null),
  ('ord-l2m3n4', now() - interval '27 days 4 hours','david.smith@hotmail.com',    'pi_3Mx109', 'fulfilled', 114.99, 23.00, 0.00,  137.99, '{"zip":"20001","name":"David Smith","line1":"800 F St NW","city":"Washington","state":"DC"}'::jsonb,          'Standard Shipping', null),
  ('ord-m3n4o5', now() - interval '30 days 2 hours','anna.bakstad@gmail.com',     'pi_3Mx110', 'fulfilled', 224.99, 45.00, 0.00,  269.99, '{"zip":"07030","name":"Anna Bakstad","line1":"95 River St","city":"Hoboken","state":"NJ"}'::jsonb,            'Free Standard',     null)
on conflict (id) do nothing;

-- ── Seed: Order Items ────────────────────────────────────────
insert into order_items (id, order_id, product_id, product_name, quantity, unit_price)
values
  ('oi-1',  'ord-a7f2d3', 'AP-1006', 'Fragrance Oil — Dubai',            1, 35.00),
  ('oi-2',  'ord-a7f2d3', 'AP-3001', 'Aromar+ Diffuser — White',         1, 79.99),
  ('oi-3',  'ord-b8c9d1', 'AP-1018', 'Fragrance Oil — Prague',           2, 35.00),
  ('oi-4',  'ord-c3d4e5', 'AP-1036', 'Fragrance Oil — Golden Sage',      1, 35.00),
  ('oi-5',  'ord-c3d4e5', 'AP-3002', 'Aromar+ Diffuser — Black',         1, 79.99),
  ('oi-6',  'ord-d4e5f6', 'AP-1006', 'Fragrance Oil — Dubai',            2, 35.00),
  ('oi-7',  'ord-d4e5f6', 'AP-1018', 'Fragrance Oil — Prague',           1, 35.00),
  ('oi-8',  'ord-d4e5f6', 'AP-1021', 'Fragrance Oil — Napa',             1, 35.00),
  ('oi-9',  'ord-d4e5f6', 'AP-1032', 'Fragrance Oil — Wild Citrus Grove',1, 35.00),
  ('oi-10', 'ord-e5f6g7', 'AP-3003', 'Aromar+ Diffuser — Silver',        1, 79.99),
  ('oi-11', 'ord-f6g7h8', 'AP-3004', 'Aromar+ Diffuser — Gold',          1, 79.99),
  ('oi-12', 'ord-f6g7h8', 'AP-1036', 'Fragrance Oil — Golden Sage',      4, 35.00),
  ('oi-13', 'ord-g7h8i9', 'AP-1006', 'Fragrance Oil — Dubai',            3, 35.00),
  ('oi-14', 'ord-h8i9j0', 'AP-3001', 'Aromar+ Diffuser — White',         1, 79.99),
  ('oi-15', 'ord-h8i9j0', 'AP-1018', 'Fragrance Oil — Prague',           2, 35.00),
  ('oi-16', 'ord-i9j0k1', 'AP-1033', 'Fragrance Oil — Violet Air',       1, 35.00),
  ('oi-17', 'ord-j0k1l2', 'AP-3002', 'Aromar+ Diffuser — Black',         1, 79.99),
  ('oi-18', 'ord-j0k1l2', 'AP-1036', 'Fragrance Oil — Golden Sage',      3, 35.00),
  ('oi-19', 'ord-k1l2m3', 'AP-1032', 'Fragrance Oil — Wild Citrus Grove',2, 35.00),
  ('oi-20', 'ord-l2m3n4', 'AP-3001', 'Aromar+ Diffuser — White',         1, 79.99),
  ('oi-21', 'ord-l2m3n4', 'AP-1006', 'Fragrance Oil — Dubai',            1, 35.00),
  ('oi-22', 'ord-m3n4o5', 'AP-3001', 'Aromar+ Diffuser — White',         1, 79.99),
  ('oi-23', 'ord-m3n4o5', 'AP-3002', 'Aromar+ Diffuser — Black',         1, 79.99),
  ('oi-24', 'ord-m3n4o5', 'AP-1006', 'Fragrance Oil — Dubai',            1, 35.00),
  ('oi-25', 'ord-m3n4o5', 'AP-1018', 'Fragrance Oil — Prague',           1, 35.00)
on conflict (id) do nothing;
