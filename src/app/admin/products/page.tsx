import React from 'react';
import { getAllProductsAdmin } from '@/lib/supabase';
import AdminProductsClient from './AdminProductsClient';

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();
  return <AdminProductsClient initialProducts={products} />;
}
