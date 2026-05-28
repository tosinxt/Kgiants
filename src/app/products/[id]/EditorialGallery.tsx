'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './product.module.css';

export default function EditorialGallery({ images, name }: { images: string[]; name: string }) {
  return (
    <div className={styles.imageColumn}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          className={styles.editorialImageWrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${name} — view ${i + 1}`}
            className={styles.editorialImage}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      ))}
    </div>
  );
}
