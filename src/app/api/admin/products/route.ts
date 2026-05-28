import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      sku,
      price,
      category,
      description,
      stock,
      low_stock_threshold,
      featured,
      visible,
      image_url,
      scent,
      inspired_by,
      weight_oz
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (sku !== undefined) updates.sku = sku;
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (stock !== undefined) updates.stock = Number(stock);
    if (low_stock_threshold !== undefined) updates.low_stock_threshold = Number(low_stock_threshold);
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (visible !== undefined) updates.visible = Boolean(visible);
    if (image_url !== undefined) updates.image_url = image_url;
    if (scent !== undefined) updates.scent = scent;
    if (inspired_by !== undefined) updates.inspired_by = inspired_by;
    if (weight_oz !== undefined) updates.weight_oz = Number(weight_oz);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('products').update(updates).eq('id', id);

    if (error) {
      console.error('Product update error:', error);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      sku,
      price,
      category,
      description,
      stock = 0,
      low_stock_threshold = 2,
      featured = false,
      visible = true,
      image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      scent,
      inspired_by,
      weight_oz = 2
    } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const generatedSku = sku || 'SKU-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const product = {
      name,
      sku: generatedSku,
      price: Number(price),
      category,
      description,
      stock: Number(stock),
      low_stock_threshold: Number(low_stock_threshold),
      featured: Boolean(featured),
      visible: Boolean(visible),
      image_url,
      scent,
      inspired_by,
      weight_oz: Number(weight_oz)
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      return NextResponse.json({ error: 'Creation failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

