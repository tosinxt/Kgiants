import React from 'react';
import { getOrders, getAllProductsAdmin } from '@/lib/supabase';
import AdminOverviewClient from './AdminOverviewClient';

export const metadata = {
  title: 'Admin Overview | KGiants',
};

export default async function AdminOverviewPage() {
  const [orders, products] = await Promise.all([getOrders(), getAllProductsAdmin()]);

  return <AdminOverviewClient initialOrders={orders} initialProducts={products} />;
}
