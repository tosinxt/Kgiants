'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/auth?redirect=/admin');
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-stone)', fontWeight: 300, background: 'var(--color-cream)' }}>
        Verifying access...
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: 200,
        background: 'var(--color-white)',
        padding: '80px 0 40px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
      }}>
        <div style={{ padding: '0 24px 32px', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-stone)', fontWeight: 500 }}>
          KGiants Admin
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/products', label: 'Products' },
            { href: '/admin/orders', label: 'Orders' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '12px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 300,
                color: 'var(--color-ink)',
                textDecoration: 'none',
                borderLeft: '2px solid transparent',
                transition: 'border-color 150ms ease-out, color 150ms ease-out',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderLeftColor = 'var(--color-gold)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderLeftColor = 'transparent'; }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: 'var(--color-stone)', wordBreak: 'break-all', fontFamily: 'var(--font-body)', fontWeight: 300 }}>{user.email}</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 200, flex: 1, padding: '80px 40px 60px', background: 'var(--color-cream)' }}>
        {children}
      </main>
    </div>
  );
}
