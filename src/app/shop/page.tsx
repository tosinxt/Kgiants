import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/supabase';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop | KGiants',
  description: 'Browse our full collection of premium Aromar+ diffusers and fragrance oils.',
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Suspense fallback={null}>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
