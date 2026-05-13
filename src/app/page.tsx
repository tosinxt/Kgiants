import React from 'react';
import { getProducts } from '@/lib/supabase';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const products = await getProducts();
  
  return (
    <HomeClient products={products} />
  );
}
