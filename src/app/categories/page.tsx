import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Shop Collections | Moonli',
};

// Mapping generic image themes so categories look rich
const getCatImage = (cat: string) => {
  const maps: any = {
    'audio': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'accessories': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    'wearables': 'https://images.unsplash.com/photo-1575311373937-040b8e3fd54c?auto=format&fit=crop&w=800&q=80',
    'display': 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80',
    'video': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
  };
  return maps[cat.toLowerCase()] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div style={{ background: 'var(--color-canvas-white)', minHeight: '100vh', padding: '120px 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-midnight-ink)' }}>
            Browse Collections
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-muted-stone)', marginTop: '0.5rem' }}>
            Segmented by discipline and digital utility.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {categories.map((category) => (
            <Link 
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              style={{
                position: 'relative',
                height: '260px',
                borderRadius: '30px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '2rem',
                border: '1px solid var(--color-light-steel)',
                textDecoration: 'none',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={getCatImage(category)} 
                alt={category}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)'
                }}
              />
              <div style={{
                position: 'relative',
                zIndex: 1,
                color: 'var(--color-canvas-white)',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {category}
                </span>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-canvas-white)'
                }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
