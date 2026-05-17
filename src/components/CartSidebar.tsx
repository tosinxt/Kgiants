'use client';

import React, { useState } from 'react';
import { X, ArrowRight, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
  const { items, isCartOpen, toggleCart, updateQuantity, removeItem, totalPrice, clearCart, toggleCheckout } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    // Close the sidebar and open the high-fidelity checkout dialog!
    toggleCart();
    toggleCheckout();
  };

  return (
    <aside className={`${styles.sidebar} ${isCartOpen ? styles.isOpen : ''}`}>
      <div className={styles.innerContent}>
        <div className={styles.header}>
          <h2>Cart</h2>
          <div className={styles.headerRight}>
            <span className={styles.itemCount}>{items.length} items</span>
            <button onClick={toggleCart} className={styles.closeBtn}>
              <X size={24} strokeWidth={1} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.qtyControl}>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.qtyDisplay}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className={styles.checkoutBtn}
            >
              Checkout
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
