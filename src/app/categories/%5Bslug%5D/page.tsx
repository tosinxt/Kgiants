import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductsByCategory } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import homeStyles from '@/app/page.module.css';

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  if (!params?.slug) return { title: 'Essentials | Moonli' };
  const formatted = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return { title: `${formatted} Essentials | Moonli` };
}

export default async function CategoryDetailPage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.slug) return <div>Category not specified.</div>;
  
  const products = await getProductsByCategory(params.slug);
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', padding: '120px 0 6rem' }}>
      <div className="container">
        <Link 
          href="/categories" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--color-muted-stone)',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--font-dm-sans)',
            marginBottom: '2.5rem',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
        >
          <ArrowLeft size={16} />
          Back to Collections
        </Link>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-midnight-ink)' }}>
            {categoryName}
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-muted-stone)', marginTop: '0.5rem' }}>
            Showing {products.length} curated item{products.length === 1 ? '' : 's'}.
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 0', 
            border: '1px dashed var(--color-light-steel)', 
            borderRadius: '30px',
            background: 'var(--color-soft-cloud)'
          }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-muted-stone)' }}>No products available in this category yet.</p>
          </div>
        ) : (
          <div className={homeStyles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
