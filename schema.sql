-- ============================================================
-- KGiants — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- Data is migrated separately via scripts/migrate-supabase.mjs
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Products ────────────────────────────────────────────────
create table if not exists products (
  id                  text          primary key default 'AP-' || floor(random() * 9000 + 1000)::text,
  sku                 text          not null unique,
  name                text          not null,
  description         text,
  price               numeric(10,2) not null,
  image_url           text,
  images              text[]        default '{}',
  category            text          not null,
  stock               integer       not null default 0,
  featured            boolean       not null default false,
  visible             boolean       not null default true,
  weight_oz           numeric(6,2),
  scent               text,
  inspired_by         text,
  scent_notes         jsonb,
  features            text[]        default '{}',
  compatible_with     text[]        default '{}',
  caution             text,
  variants            jsonb,
  low_stock_threshold integer       not null default 2,
  created_at          timestamptz   not null default now()
);

-- ── Orders ──────────────────────────────────────────────────
create table if not exists orders (
  id                       text          primary key default 'ord-' || substr(md5(random()::text), 1, 8),
  created_at               timestamptz   not null default now(),
  customer_email           text          not null,
  stripe_payment_intent_id text,
  status                   text          not null check (status in ('pending','paid','fulfilled','refunded')),
  subtotal                 numeric(10,2) not null,
  vat                      numeric(10,2) not null default 0,
  shipping_fee             numeric(10,2) not null default 0,
  total                    numeric(10,2) not null,
  shipping_address         jsonb,
  shipping_service         text,
  estimated_delivery       text,
  tracking_number          text,
  label_url                text,
  shippo_transaction_id    text
);

-- ── Order Items ─────────────────────────────────────────────
create table if not exists order_items (
  id           text          primary key default uuid_generate_v4()::text,
  order_id     text          not null references orders(id) on delete cascade,
  product_id   text          not null references products(id),
  product_name text          not null,
  quantity     integer       not null,
  unit_price   numeric(10,2) not null
);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_products_visible   on products(visible);
create index if not exists idx_products_category  on products(category);
create index if not exists idx_orders_created_at  on orders(created_at desc);
create index if not exists idx_order_items_order  on order_items(order_id);

-- ── Row Level Security ───────────────────────────────────────
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'products' and policyname = 'public can read visible products'
  ) then
    create policy "public can read visible products"
      on products for select using (visible = true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'products' and policyname = 'service role full access on products'
  ) then
    create policy "service role full access on products"
      on products for all using (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'orders' and policyname = 'service role full access on orders'
  ) then
    create policy "service role full access on orders"
      on orders for all using (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'order_items' and policyname = 'service role full access on order_items'
  ) then
    create policy "service role full access on order_items"
      on order_items for all using (auth.role() = 'service_role');
  end if;
end $$;
