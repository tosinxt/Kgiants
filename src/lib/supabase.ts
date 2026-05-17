import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

const DIFFUSER_FEATURES = [
  'Innovative ultrasonic technology',
  'Sleek minimalist design',
  'Ambient mood lighting (multiple colors)',
  'Whisper-quiet operation',
  'Auto shut-off when water level is low',
  'Easy to use and clean',
];

const DIFFUSER_COMPATIBLE = ['Aromar+ fragrance oils', 'Essential oils', 'Water-based scents'];

const OIL_COMPATIBLE = [
  'Waterless diffusers',
  'Plug-in diffusers',
  'Ultrasonic diffusers',
  'Candles',
  'Air fresheners',
];

const OIL_VARIANTS: ProductVariant[] = [
  { title: 'Single (60ml)', price: 35.00 },
  { title: '2-Pack (120ml)', price: 50.00 },
  { title: '3-Pack (180ml)', price: 70.00 },
];

export const MOCK_PRODUCTS: Product[] = [
  // ── Diffusers ──────────────────────────────────────────────────────────────
  {
    id: 'AP-3001',
    sku: 'AP-3001',
    name: 'Aromar+ Diffuser — White',
    description: 'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    price: 79.99,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001LIFESTYLE.jpg?v=1709699818',
    ],
    category: 'Waterless Diffuser',
    stock: 2,
    featured: true,
    visible: true,
    weight_oz: 24,
    features: DIFFUSER_FEATURES,
    compatible_with: DIFFUSER_COMPATIBLE,
    low_stock_threshold: 1,
  },
  {
    id: 'AP-3002',
    sku: 'AP-3002',
    name: 'Aromar+ Diffuser — Black',
    description: 'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    price: 79.99,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002-BlackDiffuser.jpg?v=1709831029',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3002LIFESTYLE.jpg?v=1709831029',
    ],
    category: 'Waterless Diffuser',
    stock: 2,
    featured: true,
    visible: true,
    weight_oz: 24,
    features: DIFFUSER_FEATURES,
    compatible_with: DIFFUSER_COMPATIBLE,
    low_stock_threshold: 1,
  },
  {
    id: 'AP-3003',
    sku: 'AP-3003',
    name: 'Aromar+ Diffuser — Silver',
    description: 'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    price: 79.99,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003-SilverDiffuser.jpg?v=1709830691',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3003LIFESTYLE.jpg?v=1709830864',
    ],
    category: 'Waterless Diffuser',
    stock: 2,
    featured: false,
    visible: true,
    weight_oz: 24,
    features: DIFFUSER_FEATURES,
    compatible_with: DIFFUSER_COMPATIBLE,
    low_stock_threshold: 1,
  },
  {
    id: 'AP-3004',
    sku: 'AP-3004',
    name: 'Aromar+ Diffuser — Gold',
    description: 'Introducing the Aromar+ Waterless Advanced Ultrasonic Diffuser — a fusion of elegance and innovation. Utilizing high-frequency ultrasonic waves, this diffuser transforms water and Aromar+ essential oils into a fine mist, delivering a continuous stream of your chosen fragrance.',
    price: 79.99,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004-GoldDiffuser.jpg?v=1709831060',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3004LIFESTYLE.jpg?v=1709831060',
    ],
    category: 'Waterless Diffuser',
    stock: 2,
    featured: false,
    visible: true,
    weight_oz: 24,
    features: DIFFUSER_FEATURES,
    compatible_with: DIFFUSER_COMPATIBLE,
    low_stock_threshold: 1,
  },
  // ── Fragrance Oils ─────────────────────────────────────────────────────────
  {
    id: 'AP-1006',
    sku: 'AP-1006',
    name: 'Fragrance Oil — Dubai',
    description: 'Waterless Fragrance Oil Dubai by Aromar epitomizes the luxury and opulence of the Middle Eastern jewel city. Infusing your space with the rich and exotic aromas of Dubai, this fragrance oil is a celebration of grandeur and elegance. Crafted using the finest ingredients, Dubai fragrance oil is perfect for candles, air fresheners, and diffusion.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006LIFESTYLE.jpg?v=1709694654',
    ],
    category: 'Fragrance Oil',
    stock: 12,
    featured: true,
    visible: true,
    weight_oz: 2,
    scent: 'Dubai',
    inspired_by: 'W Hotel®',
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
  {
    id: 'AP-1018',
    sku: 'AP-1018',
    name: 'Fragrance Oil — Prague',
    description: 'Waterless Fragrance Oil Prague by Aromar captures the mystical and historical essence of the Czech capital. This oil brings the unique charm of Prague\'s cobbled streets, ancient architecture, and vibrant cultural life into your space, offering a scent as enchanting and complex as the city itself.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018-PRAGUE.jpg?v=1709699256',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1018LIFESTYLE.jpg?v=1709699257',
    ],
    category: 'Fragrance Oil',
    stock: 6,
    featured: true,
    visible: true,
    weight_oz: 2,
    scent: 'Prague',
    inspired_by: 'Baccarat Rouge®',
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
  {
    id: 'AP-1021',
    sku: 'AP-1021',
    name: 'Fragrance Oil — Napa',
    description: 'Aromar+ Waterless Fragrance Oil inspired by the wine country of Napa Valley. A sophisticated, warm fragrance designed for use in waterless and ultrasonic diffusers.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1006-DUBAI.jpg?v=1709694654',
    ],
    category: 'Fragrance Oil',
    stock: 12,
    featured: false,
    visible: true,
    weight_oz: 2,
    scent: 'Napa',
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
  {
    id: 'AP-1032',
    sku: 'AP-1032',
    name: 'Fragrance Oil — Wild Citrus Grove',
    description: 'Bring the outdoors into your home with Wild Citrus Grove Diffuser Oil, a refreshing blend designed to energize your space. Combines the sparkling brightness of orange, the herbal spice of bay leaf, and the grounding richness of cedarwood.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_2.jpg?v=1769721694',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1032_-_V2_Wild_Citrus_Grove.jpg?v=1769721702',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/A_LINESNaturals1_2_67ae23e5-f7ef-4844-bd2e-8c70c97496ac.jpg?v=1769615566',
    ],
    category: 'Fragrance Oil',
    stock: 6,
    featured: true,
    visible: true,
    weight_oz: 2,
    scent: 'Wild Citrus Grove',
    scent_notes: { top: ['Orange'], middle: ['Bay Leaf'], base: ['Cedarwood'] },
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
  {
    id: 'AP-1033',
    sku: 'AP-1033',
    name: 'Fragrance Oil — Violet Air',
    description: 'Violet Air brings a refreshing yet sophisticated balance to your space with its calming floral and herbal blend. The timeless serenity of lavender pairs with the crisp vitality of rosemary, while sandalwood grounds the fragrance with smooth, woody warmth.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_1.jpg?v=1769614182',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1033_-_Violet_Air.jpg?v=1769614205',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/A_LuxuryPlugIn.jpg?v=1769614213',
    ],
    category: 'Fragrance Oil',
    stock: 6,
    featured: false,
    visible: true,
    weight_oz: 2,
    scent: 'Violet Air',
    scent_notes: { top: ['Lavender'], middle: ['Rosemary'], base: ['Sandalwood'] },
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
  {
    id: 'AP-1036',
    sku: 'AP-1036',
    name: 'Fragrance Oil — Golden Sage',
    description: 'Golden Sage is an earthy, herbal diffuser oil crafted to soothe, ground, and restore balance to your space. The cleansing aroma of sage blends harmoniously with the savory vibrancy of wild thyme, while vetiver provides a smoky, woody base.',
    price: 35.00,
    image_url: 'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043',
    images: [
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036_1.jpg?v=1769621043',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/AP-1036-V2GoldenSage.jpg?v=1769621050',
      'https://cdn.shopify.com/s/files/1/1531/8467/files/goldensagelifestyle.jpg?v=1769720006',
    ],
    category: 'Fragrance Oil',
    stock: 18,
    featured: true,
    visible: true,
    weight_oz: 2,
    scent: 'Golden Sage',
    scent_notes: { top: ['Sage'], middle: ['Wild Thyme'], base: ['Vetiver'] },
    compatible_with: OIL_COMPATIBLE,
    caution: 'Not safe for skin, bath, or cream purposes.',
    variants: OIL_VARIANTS,
    low_stock_threshold: 3,
  },
];

const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getStockStatus(product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (product.stock === 0) return 'out_of_stock';
  if (product.stock <= product.low_stock_threshold) return 'low_stock';
  return 'in_stock';
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.filter(p => p.visible);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return MOCK_PRODUCTS.filter(p => p.visible); }
  return data as Product[];
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_PRODUCTS;
  }
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return MOCK_PRODUCTS; }
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) { return MOCK_PRODUCTS.find(p => p.id === id) || null; }
  return data as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!supabase) {
    return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase() && p.visible);
  }
  const { data, error } = await supabase
    .from('products').select('*')
    .ilike('category', category)
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (error) { return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase()); }
  return data as Product[];
}

export async function getCategories(): Promise<string[]> {
  if (!supabase) {
    return Array.from(new Set(MOCK_PRODUCTS.filter(p => p.visible).map(p => p.category)));
  }
  const { data, error } = await supabase.from('products').select('category').eq('visible', true);
  if (error) { return Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))); }
  return Array.from(new Set((data as any[]).map(p => p.category).filter(Boolean)));
}

export async function updateProductStock(id: string, stock: number): Promise<void> {
  if (!supabase) return;
  await supabase.from('products').update({ stock }).eq('id', id);
}

export async function updateProductVisibility(id: string, visible: boolean): Promise<void> {
  if (!supabase) return;
  await supabase.from('products').update({ visible }).eq('id', id);
}

export async function getOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders').select('*, items:order_items(*)')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders').select('*, items:order_items(*)').eq('id', id).single();
  if (error) { return null; }
  return data as Order;
}
