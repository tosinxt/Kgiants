'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMenu } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';

export default function LayoutInner({ children }: { children: React.ReactNode }) {
  const { isMenuOpen, closeMenu } = useMenu();
  const { isCartOpen, toggleCart } = useCart();
  const pathname = usePathname();

  // Lock background scroll when sidebars are active
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isCartOpen]);

  let pageClass = 'layout-default';
  if (pathname === '/') pageClass = 'layout-home';
  else if (pathname.startsWith('/products')) pageClass = 'layout-pdp';

  // Only cart causes layout push — menu is now a fixed overlay
  const slideClass = isCartOpen ? 'cart-open' : '';

  return (
    <div className={`layout-inner ${pageClass} ${slideClass}`}>
      {children}
      <div
        className={`sidebar-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={isCartOpen ? toggleCart : undefined}
        aria-hidden="true"
      />
    </div>
  );
}
