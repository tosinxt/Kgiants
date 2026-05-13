'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    if (!user) {
      toast('Security authorization required to procure.', { icon: '🔒' });
      toggleCart(); // Close drawer
      router.push('/auth?redirect=/'); // Redirect to gate
      return;
    }
    
    setIsCheckingOut(true);
    const toastId = toast.loading('Processing secure payment...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Order placed successfully!', { id: toastId });
      clearCart();
      setIsCheckingOut(false);
      toggleCart();
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`${styles.overlay} ${isCartOpen ? styles.isOpen : ''}`} 
        onClick={toggleCart}
      />

      {/* Drawer */}
      <aside className={`${styles.drawer} ${isCartOpen ? styles.isOpen : ''}`}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <button onClick={toggleCart} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your cart is empty.</p>
              <button onClick={toggleCart} style={{textDecoration: 'underline', fontSize: '0.9rem'}}>
                Go Shopping
              </button>
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
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyDisplay}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
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
              disabled={isCheckingOut}
            >
              {!user ? (
                <>
                  Sign in to Secure Checkout
                  <LogIn size={20} />
                </>
              ) : (
                <>
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                  {!isCheckingOut && <ArrowRight size={20} />}
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
