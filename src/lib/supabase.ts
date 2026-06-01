import { createClient } from '@supabase/supabase-js';

export type ProductVariant = {
  title: string;
  price: number;
};

export type ScentNotes = {
  top: string[];
  middle: string[];
  base: string[];
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  visible: boolean;
  weight_oz: number;
  scent?: string;
  inspired_by?: string;
  scent_notes?: ScentNotes;
  features?: string[];
  compatible_with?: string[];
  caution?: string;
  variants?: ProductVariant[];
  low_stock_threshold: number;
};

export type Order = {
  id: string;
  created_at: string;
  customer_email: string;
  stripe_payment_intent_id: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'refunded';
  subtotal: number;
  vat: number;
  shipping_fee: number;
  total: number;
  shipping_address: {
    zip: string;
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
  };
  shipping_service?: string;
  estimated_delivery?: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, signal: AbortSignal.timeout(8000) }),
    },
  }
);

export function getStockStatus(product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (product.stock === 0) return 'out_of_stock';
  if (product.stock <= product.low_stock_threshold) return 'low_stock';
  return 'in_stock';
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('category', category)
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('visible', true);
  if (error) throw error;
  return Array.from(new Set((data as { category: string }[]).map(p => p.category).filter(Boolean)));
}

export async function updateProductStock(id: string, stock: number): Promise<void> {
  await supabase.from('products').update({ stock }).eq('id', id);
}

export async function updateProductVisibility(id: string, visible: boolean): Promise<void> {
  await supabase.from('products').update({ visible }).eq('id', id);
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Order;
}
