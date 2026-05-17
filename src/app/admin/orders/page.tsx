import React from 'react';
import { getOrders } from '@/lib/supabase';
import AdminOrdersClient from './AdminOrdersClient';

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}
