/**
 * upload-images-to-supabase.mjs
 *
 * Downloads all product + static images and pushes them to Supabase Storage.
 * Then updates product records with the new public URLs.
 *
 * Run: node scripts/upload-images-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Load .env manually ───────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, '.env');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && !key.startsWith('#') && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = 'assets';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────

function ext(url) {
  const clean = url.split('?')[0];
  const m = clean.match(/\.(\w{2,4})$/);
  return m ? `.${m[1].toLowerCase()}` : '.jpg';
}

function mimeFor(extension) {
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
  return map[extension] || 'image/jpeg';
}

async function downloadUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KGiants/1.0)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function readLocal(relativePath) {
  const abs = join(ROOT, 'public', relativePath);
  if (!existsSync(abs)) throw new Error(`Local file not found: ${abs}`);
  return readFileSync(abs);
}

async function uploadToSupabase(storagePath, data, mimeType) {
  // Check if already exists
  const { data: existing } = await supabase.storage.from(BUCKET).list(
    storagePath.split('/').slice(0, -1).join('/'),
    { search: storagePath.split('/').pop() }
  );
  if (existing && existing.length > 0) {
    // Overwrite
    const { error } = await supabase.storage.from(BUCKET).update(storagePath, data, {
      contentType: mimeType, upsert: true,
    });
    if (error) throw error;
  } else {
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, data, {
      contentType: mimeType, upsert: true,
    });
    if (error) throw error;
  }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function processImage(url, storagePath) {
  const extension = ext(url);
  const mime = mimeFor(extension);
  const fullPath = `${storagePath}${extension}`;

  let data;
  if (url.startsWith('/')) {
    // Local file
    data = readLocal(url);
  } else {
    data = await downloadUrl(url);
  }

  const publicUrl = await uploadToSupabase(fullPath, data, mime);
  return publicUrl;
}

// ── Ensure bucket exists ─────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Could not create bucket: ${error.message}`);
    console.log(`✓ Created bucket "${BUCKET}"`);
  } else {
    console.log(`✓ Bucket "${BUCKET}" ready`);
  }
}

// ── Static landing page images ───────────────────────────────────────

const STATIC_IMAGES = [
  { local: '/images/new-hero.png',                  path: 'static/new-hero' },
  { local: '/images/hero.png',                       path: 'static/hero' },
  { local: '/images/products/white-plugin.png',      path: 'static/white-plugin' },
  { local: '/images/products/black-plugin.png',      path: 'static/black-plugin' },
  { local: '/images/products/diffuser-2.jpeg',       path: 'static/diffuser-2' },
  { local: '/images/products/diffuser-3.jpeg',       path: 'static/diffuser-3' },
];

async function uploadStaticImages() {
  console.log('\n── Static images ───────────────────────────────────');
  const map = {};
  for (const { local, path } of STATIC_IMAGES) {
    try {
      const url = await processImage(local, path);
      map[local] = url;
      console.log(`  ✓ ${local.split('/').pop()}`);
    } catch (err) {
      console.error(`  ✗ ${local}: ${err.message}`);
    }
  }
  return map;
}

// ── Product images ───────────────────────────────────────────────────

async function uploadProductImages() {
  console.log('\n── Product images ──────────────────────────────────');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, sku, image_url, images');

  if (error) throw error;

  // Build deduplicated URL list
  const urlToPath = new Map();
  for (const p of products) {
    const allUrls = [p.image_url, ...(p.images || [])].filter(Boolean);
    for (const url of allUrls) {
      if (!urlToPath.has(url)) {
        // Derive a clean storage path from SKU + index
        const idx = urlToPath.size;
        const slug = url.split('/').pop().split('?')[0].replace(/\.[^.]+$/, '').slice(0, 60);
        urlToPath.set(url, `products/${slug}_${idx}`);
      }
    }
  }

  console.log(`  Downloading ${urlToPath.size} unique images…`);

  // Download + upload in batches of 5
  const entries = [...urlToPath.entries()];
  const urlMap = new Map(); // original url → supabase url

  for (let i = 0; i < entries.length; i += 5) {
    const batch = entries.slice(i, i + 5);
    await Promise.all(batch.map(async ([url, path]) => {
      try {
        const newUrl = await processImage(url, path);
        urlMap.set(url, newUrl);
        process.stdout.write(`  ✓ ${url.split('/').pop().slice(0, 50)}\n`);
      } catch (err) {
        console.error(`  ✗ ${url.split('/').pop()}: ${err.message}`);
        urlMap.set(url, url); // keep original on failure
      }
    }));
  }

  return urlMap;
}

// ── Update product records ───────────────────────────────────────────

async function updateProducts(urlMap) {
  console.log('\n── Updating product records ────────────────────────');
  const { data: products } = await supabase.from('products').select('id, sku, image_url, images');

  let updated = 0;
  for (const p of products) {
    const newImageUrl = urlMap.get(p.image_url) || p.image_url;
    const newImages = (p.images || []).map(u => urlMap.get(u) || u);

    const { error } = await supabase
      .from('products')
      .update({ image_url: newImageUrl, images: newImages })
      .eq('id', p.id);

    if (error) {
      console.error(`  ✗ ${p.sku}: ${error.message}`);
    } else {
      console.log(`  ✓ ${p.sku}`);
      updated++;
    }
  }
  console.log(`\n  Updated ${updated}/${products.length} products`);
}

// ── Update code references to static images ──────────────────────────

function printCodeUpdates(staticMap) {
  if (Object.keys(staticMap).length === 0) return;
  console.log('\n── Static image URLs for your code ─────────────────');
  console.log('  Update these references in HomeClient.tsx / layout:\n');
  for (const [local, url] of Object.entries(staticMap)) {
    console.log(`  ${local}`);
    console.log(`  → ${url}\n`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('KGiants Image Migration → Supabase Storage');
  console.log('===========================================\n');

  await ensureBucket();

  const staticMap   = await uploadStaticImages();
  const productUrlMap = await uploadProductImages();
  await updateProducts(productUrlMap);
  printCodeUpdates(staticMap);

  console.log('\n✅ Done! All images are now served from Supabase Storage.');
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
