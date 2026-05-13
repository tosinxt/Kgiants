'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/images/katalon-icon.svg" 
          alt="KGiants Logo" 
          style={{ height: '28px', objectFit: 'contain' }} 
        />
        <span>KGIANTS</span>
      </Link>

      <nav className={styles.navLinks}>
        <Link href="/" className={styles.link}>Shop</Link>
        <Link href="/categories" className={styles.link}>Categories</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
      </nav>

      <div className={styles.actions}>
        {user ? (
          <Link href="/auth" className={styles.actionBtn} aria-label="Profile">
            <User size={18} />
            <span className={styles.usernameText}>
              {user.name}
            </span>
          </Link>
        ) : (
          <Link href="/auth" className={styles.actionBtn} aria-label="Login">
            <LogIn size={18} />
          </Link>
        )}

        <button 
          onClick={toggleCart} 
          className={styles.cartButton} 
          aria-label="Open cart"
        >
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}
