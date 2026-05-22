'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './product.module.css';

export default function ScrollGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.imageColumn}>
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className={styles.thumbStrip}>
          {images.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${active === i ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Main image well */}
      <div className={styles.mainWell}>
        <div className={styles.mainRecess}>
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${name} — view ${active + 1}`}
              className={styles.mainImg}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
