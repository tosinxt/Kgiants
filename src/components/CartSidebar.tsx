"use client";

import React from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    totalPrice,
    toggleCheckout,
  } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    toggleCart();
    toggleCheckout();
  };

  const shipping = totalPrice >= 75 ? 0 : 8.99;
  const tax = totalPrice * 0.075;
  const total = totalPrice + tax + shipping;

  return (
    <>
      <div
        className={`${styles.backdrop} ${isCartOpen ? styles.backdropVisible : ""}`}
        onClick={toggleCart}
        aria-hidden="true"
      />

      <aside
        className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Your bag</h2>
            {items.length > 0 && (
              <span className={styles.countBadge}>{items.length}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={toggleCart} aria-label="Close cart">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            /* ── Empty ── */
            <div className={styles.empty}>
              <div className={styles.emptyIconWrap}>
                <ShoppingBag size={32} strokeWidth={1.25} />
              </div>
              <p className={styles.emptyHeading}>Nothing here yet</p>
              <p className={styles.emptyDesc}>Add a scent and your bag will come to life.</p>
              <button className={styles.emptyBtn} onClick={toggleCart}>
                Browse collection
                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </div>
          ) : (
            /* ── Items ── */
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>

                  {/* Image */}
                  <div className={styles.imgWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url} alt={item.name} className={styles.itemImg} />
                  </div>

                  {/* Info */}
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <p className={styles.itemName}>{item.name}</p>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={12} strokeWidth={2} />
                      </button>
                    </div>

                    <p className={styles.itemUnit}>${item.price.toFixed(2)} each</p>

                    <div className={styles.itemBottom}>
                      {/* Qty stepper */}
                      <div className={styles.stepper}>
                        <button
                          className={styles.stepBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={10} strokeWidth={2.5} />
                        </button>
                        <span className={styles.stepNum}>{item.quantity}</span>
                        <button
                          className={styles.stepBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={10} strokeWidth={2.5} />
                        </button>
                      </div>

                      <span className={styles.itemTotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>

            {/* Ledger — inset well */}
            <div className={styles.ledger}>
              <div className={styles.ledgerRow}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.ledgerRow}>
                <span>Tax (7.5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className={styles.ledgerRow}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.free : ""}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Total row */}
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>${total.toFixed(2)}</span>
            </div>

            {/* Free shipping nudge */}
            {totalPrice < 75 && (
              <p className={styles.nudge}>
                Add ${(75 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}

            {/* Checkout */}
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
              <ArrowRight size={15} strokeWidth={2} />
            </button>

            <p className={styles.secureNote}>Secure checkout · Free returns</p>
          </div>
        )}
      </aside>
    </>
  );
}
