"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Product, getStockStatus } from "@/lib/supabase";
import styles from "./ProductCard.module.css";

const FALLBACK =
  "https://cdn.shopify.com/s/files/1/1531/8467/files/AP-3001-WhiteDiffuser.jpg?v=1709699706";

export default function ProductCard({
  product,
  minimal = false,
}: {
  product: Product;
  minimal?: boolean;
}) {
  const images = product.images?.length ? product.images : [product.image_url];
  const hasMultiple = images.length > 1;
  const isOOS = getStockStatus(product) === "out_of_stock";
  const [activeIdx, setActiveIdx] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 400, damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 400, damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveIdx(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isOOS ? styles.oos : ""}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/products/${product.id}`} style={{ display: "block" }}>
        <div className={styles.imageWrapper}>
          <div className={styles.serialCode}>{product.sku}</div>

          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={i === 0 ? product.name : `${product.name} — view ${i + 1}`}
              className={`${styles.image} ${i === 0 ? styles.imageBase : styles.imageAlt}`}
              style={i > 0 ? { opacity: activeIdx === i ? 1 : 0 } : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK;
              }}
            />
          ))}

          {hasMultiple && images.length === 2 && (
            <div className={styles.hoverZone} onMouseEnter={() => setActiveIdx(1)} />
          )}
          {hasMultiple && images.length >= 3 && images.map((_, i) => (
            <div
              key={i}
              className={styles.hoverZoneSegment}
              style={{ left: `${(i / images.length) * 100}%`, width: `${100 / images.length}%` }}
              onMouseEnter={() => setActiveIdx(i)}
            />
          ))}

          {hasMultiple && (
            <div className={styles.dots}>
              {images.map((_, i) => (
                <span key={i} className={`${styles.dot} ${activeIdx === i ? styles.dotActive : ""}`} />
              ))}
            </div>
          )}

          {isOOS && <div className={styles.soldOut}>Sold Out</div>}
        </div>

        {!minimal && (
          <div className={styles.content}>
            <h3 className={styles.name}>{product.name}</h3>
            {product.scent && <div className={styles.scent}>{product.scent}</div>}
            {product.inspired_by && (
              <div className={styles.inspiredBy}>Inspired by {product.inspired_by}</div>
            )}
            <div className={styles.price}>
              {product.variants
                ? `From $${product.variants[0].price.toFixed(2)}`
                : `$${product.price.toFixed(2)}`}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
