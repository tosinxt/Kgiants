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

  const vat = totalPrice * 0.075;
  const estimatedTotal = totalPrice + vat;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isCartOpen ? styles.backdropVisible : ""}`}
        onClick={toggleCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}
        aria-label="Shopping cart"
      >
        <div className={styles.inner}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={styles.title}>Your Bag</h2>
              {items.length > 0 && (
                <span className={styles.count}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            <button
              className={styles.closeBtn}
              onClick={toggleCart}
              aria-label="Close cart"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {items.length === 0 ? (
              <div className={styles.empty}>
                <ShoppingBag size={36} strokeWidth={1} className={styles.emptyIcon} />
                <p className={styles.emptyHeading}>Your bag is empty</p>
                <p className={styles.emptyDesc}>
                  Add something beautiful to get started.
                </p>
                <button className={styles.emptyBtn} onClick={toggleCart}>
                  Explore the collection
                  <ArrowRight size={13} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className={styles.itemImg}
                    />

                    <div className={styles.itemBody}>
                      <div className={styles.itemRow}>
                        <p className={styles.itemName}>{item.name}</p>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <X size={13} strokeWidth={1.5} />
                        </button>
                      </div>

                      <p className={styles.itemPrice}>
                        ${item.price.toFixed(2)}
                      </p>

                      <div className={styles.itemFooter}>
                        <div className={styles.qty}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease"
                          >
                            <Minus size={11} strokeWidth={1.5} />
                          </button>
                          <span className={styles.qtyNum}>{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            <Plus size={11} strokeWidth={1.5} />
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
              <div className={styles.ledger}>
                <div className={styles.ledgerRow}>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className={styles.ledgerRow}>
                  <span>Tax (7.5%)</span>
                  <span>${vat.toFixed(2)}</span>
                </div>
                <div className={styles.ledgerRow}>
                  <span>Shipping</span>
                  <span className={styles.muted}>At checkout</span>
                </div>
              </div>

              <div className={styles.total}>
                <span>Estimated Total</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>

              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to Checkout
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>

              <p className={styles.secureNote}>
                Secure checkout · Free returns
              </p>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
