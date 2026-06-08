#!/usr/bin/env node
/**
 * Full Supabase account migration script.
 *
 * Before running, add these to .env.local:
 *   NEW_SUPABASE_URL=https://<new-ref>.supabase.co
 *   NEW_SUPABASE_ANON_KEY=eyJ...
 *   NEW_SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *
 * Then run:
 *   node scripts/migrate-supabase.mjs
 *
 * The script will:
 *   1. Apply schema to the new project
 *   2. Export all data from old project and import to new
 *   3. Copy all Storage files (assets bucket) to new project
 *   4. Update .env.local to point to the new project
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, '..');

// ── Load env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function require_var(env, key) {
  if (!env[key]) {
    console.error(`✗ Missing ${key} in .env.local`);
    process.exit(1);
  }
  return env[key];
}

// ── Schema (mirrors schema.sql without seed data) ───────────────────────────
const SCHEMA_SQL = `
create extension if not exists "uuid-ossp";

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

create table if not exists order_items (
  id           text        primary key default uuid_generate_v4()::text,
  order_id     text        not null references orders(id) on delete cascade,
  product_id   text        not null references products(id),
  product_name text        not null,
  quantity     integer     not null,
  unit_price   numeric(10,2) not null
);

create index if not exists idx_products_visible   on products(visible);
create index if not exists idx_products_category  on products(category);
create index if not exists idx_orders_created_at  on orders(created_at desc);
create index if not exists idx_order_items_order  on order_items(order_id);

alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='products' and policyname='public can read visible products'
  ) then
    create policy "public can read visible products" on products for select using (visible = true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename='products' and policyname='service role full access on products'
  ) then
    create policy "service role full access on products" on products for all using (auth.role() = 'service_role');
  end if;
  if not exists (
    select 1 from pg_policies where tablename='orders' and policyname='service role full access on orders'
  ) then
    create policy "service role full access on orders" on orders for all using (auth.role() = 'service_role');
  end if;
  if not exists (
    select 1 from pg_policies where tablename='order_items' and policyname='service role full access on order_items'
  ) then
    create policy "service role full access on order_items" on order_items for all using (auth.role() = 'service_role');
  end if;
end $$;
`;

const BUCKET = 'assets';

// ── Helpers ──────────────────────────────────────────────────────────────────
function log(msg) { console.log(msg); }
function ok(msg)  { console.log(`  ✓ ${msg}`); }
function warn(msg){ console.warn(`  ⚠ ${msg}`); }
function fail(msg){ console.error(`  ✗ ${msg}`); }

async function applySchema(newSupa) {
  log('\n[1/4] Applying schema to new project…');

  // Use the Supabase pg REST endpoint (requires service role key)
  const url = newSupa.supabaseUrl;
  const key = newSupa.supabaseKey;

  const resp = await fetch(`${url}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Prefer': 'return=minimal',
    },
  });

  // The JS client doesn't expose raw SQL — use the pg endpoint via fetch
  // Supabase exposes /pg/query for service-role SQL execution
  const pgResp = await fetch(`${url}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ query: SCHEMA_SQL }),
  });

  if (pgResp.ok) {
    ok('Schema applied via /pg/query');
    return;
  }

  // Fall back: prompt the user to apply manually
  warn('Auto-apply not available for this project.');
  warn('Please apply the schema manually:');
  warn('  1. Open your new project dashboard');
  warn('  2. Go to SQL Editor');
  warn('  3. Paste the contents of schema.sql and click Run');
  log('\nPress Enter once you have applied the schema, or Ctrl+C to abort.');
  process.stdin.resume();
  await new Promise(r => process.stdin.once('data', r));
  process.stdin.pause();
  ok('Schema step acknowledged');
}

async function migrateTable(oldSupa, newSupa, table, { orderBy } = {}) {
  log(`\n  Migrating table: ${table}`);
  let query = oldSupa.from(table).select('*');
  if (orderBy) query = query.order(orderBy);
  const { data, error } = await query;
  if (error) { fail(`Could not read ${table}: ${error.message}`); return 0; }
  if (!data?.length) { warn(`${table} is empty — skipping`); return 0; }

  // Upsert in batches of 200
  const BATCH = 200;
  let inserted = 0;
  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH);
    const { error: upsertErr } = await newSupa.from(table).upsert(batch, { onConflict: 'id' });
    if (upsertErr) { fail(`Upsert batch failed (${table}): ${upsertErr.message}`); break; }
    inserted += batch.length;
  }
  ok(`${inserted} rows → ${table}`);
  return inserted;
}

async function listAllStorageFiles(supa, prefix = '') {
  const { data, error } = await supa.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) return [];
  const files = [];
  for (const item of data ?? []) {
    if (item.id === null) {
      // folder
      const sub = await listAllStorageFiles(supa, prefix ? `${prefix}/${item.name}` : item.name);
      files.push(...sub);
    } else {
      files.push(prefix ? `${prefix}/${item.name}` : item.name);
    }
  }
  return files;
}

async function migrateStorage(oldSupa, newSupa) {
  log('\n[3/4] Migrating Storage (assets bucket)…');

  // Ensure bucket exists on new project
  const { data: buckets } = await newSupa.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  if (!exists) {
    const { error } = await newSupa.storage.createBucket(BUCKET, { public: true });
    if (error) { fail(`Could not create bucket: ${error.message}`); return; }
    ok(`Created bucket "${BUCKET}"`);
  }

  const files = await listAllStorageFiles(oldSupa);
  if (!files.length) { warn('No files found in assets bucket'); return; }
  log(`  Found ${files.length} files to copy…`);

  let copied = 0, skipped = 0;
  for (const path of files) {
    const { data: blob, error: dlErr } = await oldSupa.storage.from(BUCKET).download(path);
    if (dlErr) { warn(`Could not download ${path}: ${dlErr.message}`); skipped++; continue; }

    const buf = await blob.arrayBuffer();

    // Check if already exists
    const folder = path.split('/').slice(0, -1).join('/');
    const filename = path.split('/').pop();
    const { data: existing } = await newSupa.storage.from(BUCKET).list(folder, { search: filename });
    const alreadyExists = existing?.some(f => f.name === filename);

    const method = alreadyExists ? 'update' : 'upload';
    const { error: upErr } = await newSupa.storage.from(BUCKET)[method](path, buf, {
      contentType: blob.type,
      upsert: true,
    });
    if (upErr) { warn(`Could not upload ${path}: ${upErr.message}`); skipped++; }
    else { copied++; process.stdout.write(`\r    ${copied}/${files.length} copied…`); }
  }
  process.stdout.write('\n');
  ok(`${copied} files copied, ${skipped} skipped`);
}

function updateEnvFile(env, newUrl, newAnonKey, newServiceKey) {
  log('\n[4/4] Updating .env.local…');
  const envPath = resolve(ROOT, '.env.local');
  let raw = readFileSync(envPath, 'utf8');

  raw = raw
    .replace(/^NEXT_PUBLIC_SUPABASE_URL=.*/m,       `NEXT_PUBLIC_SUPABASE_URL=${newUrl}`)
    .replace(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/m,  `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newAnonKey}`)
    .replace(/^SUPABASE_SERVICE_ROLE_KEY=.*/m,       `SUPABASE_SERVICE_ROLE_KEY=${newServiceKey}`);

  // Remove the NEW_ vars so they don't linger
  raw = raw
    .replace(/^NEW_SUPABASE_URL=.*\n?/m, '')
    .replace(/^NEW_SUPABASE_ANON_KEY=.*\n?/m, '')
    .replace(/^NEW_SUPABASE_SERVICE_ROLE_KEY=.*\n?/m, '');

  writeFileSync(envPath, raw);
  ok('.env.local updated — old keys replaced with new ones');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  log('KGiants — Supabase Migration Script');
  log('=====================================');

  const env = loadEnv();

  // Old credentials
  const OLD_URL  = require_var(env, 'NEXT_PUBLIC_SUPABASE_URL');
  const OLD_KEY  = require_var(env, 'SUPABASE_SERVICE_ROLE_KEY');

  // New credentials (must be in .env.local before running)
  const NEW_URL  = require_var(env, 'NEW_SUPABASE_URL');
  const NEW_ANON = require_var(env, 'NEW_SUPABASE_ANON_KEY');
  const NEW_KEY  = require_var(env, 'NEW_SUPABASE_SERVICE_ROLE_KEY');

  log(`\nOld project: ${OLD_URL}`);
  log(`New project: ${NEW_URL}`);

  const oldSupa = createClient(OLD_URL, OLD_KEY);
  const newSupa = createClient(NEW_URL, NEW_KEY);

  // 1. Schema
  await applySchema(newSupa);

  // 2. Data — order matters due to FK constraints
  log('\n[2/4] Migrating table data…');
  await migrateTable(oldSupa, newSupa, 'products', { orderBy: 'created_at' });
  await migrateTable(oldSupa, newSupa, 'orders',   { orderBy: 'created_at' });
  await migrateTable(oldSupa, newSupa, 'order_items');

  // 3. Storage
  await migrateStorage(oldSupa, newSupa);

  // 4. Swap env vars
  updateEnvFile(env, NEW_URL, NEW_ANON, NEW_KEY);

  log('\n✅ Migration complete!');
  log('   Restart your dev server: npm run dev');
  log('   Verify: open http://localhost:3000 and check products + images load');
}

main().catch(err => { console.error('\nFatal:', err.message); process.exit(1); });
