import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock data for testing when Supabase is not configured yet
export const MOCK_PRODUCTS = [
  {
    id: 'oil_1',
    name: 'Obsidian Mist',
    description: 'A deeply meditative blend of smokey vetiver, patchouli, and rich black pepper. Designed to ground the sensory space.',
    price: 55.00,
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d029cb5?auto=format&fit=crop&w=800&q=80',
    category: 'Oils',
    stock: 12,
    featured: true
  },
  {
    id: 'diffuser_1',
    name: 'Monolith Diffuser',
    description: 'Carved from a single block of architectural concrete, this stone diffuser silently disperses therapeutic vapor via high-frequency vibration.',
    price: 185.00,
    image_url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
    category: 'Diffusers',
    stock: 5,
    featured: true
  },
  {
    id: 'oil_2',
    name: 'White Santal',
    description: 'Bright, woody Australian sandalwood layered over subtle creamy coconut milk and violet petals. An airy, uplifting aura.',
    price: 62.00,
    image_url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    category: 'Oils',
    stock: 20,
    featured: true
  },
  {
    id: 'diffuser_2',
    name: 'Eclipse Glass Node',
    description: 'A hand-blown smoked glass enclosure with a matte black base. Features persistent cool-mist technology and subtle amber lighting.',
    price: 140.00,
    image_url: 'https://images.unsplash.com/photo-1570554886111-900cd33d5114?auto=format&fit=crop&w=800&q=80',
    category: 'Diffusers',
    stock: 8,
    featured: false
  },
  {
    id: 'oil_3',
    name: 'Amber Dusk',
    description: 'A warm embrace of golden amber resin, cardamom pods, and smooth cedarwood. The perfect balance of depth and comforting warmth.',
    price: 58.00,
    image_url: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=800&q=80',
    category: 'Oils',
    stock: 15,
    featured: true
  },
  {
    id: 'oil_4',
    name: 'Nirvana Rain',
    description: 'Aquatic notes meet fresh rain on damp earth, mixed with bright bergamot and refreshing eucalyptus leaves.',
    price: 48.00,
    image_url: 'https://images.unsplash.com/photo-1547684102-e63372b3d90c?auto=format&fit=crop&w=800&q=80',
    category: 'Oils',
    stock: 30,
    featured: false
  }
];

export type Product = typeof MOCK_PRODUCTS[0];

// Singleton client setup
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    // Simulate latency for premium feel
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PRODUCTS;
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching products:', error);
    return MOCK_PRODUCTS;
  }
  
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Try mock lookup as fallback
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
  
  return data as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('category', category)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching category ${category}:`, error);
    return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  return data as Product[];
}

export async function getCategories(): Promise<string[]> {
  if (!supabase) {
    const cats = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
    return cats;
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('category');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
  }
  
  const categories = data.map((p: any) => p.category as string);
  return Array.from(new Set(categories.filter(Boolean)));
}
