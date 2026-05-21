"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

function BloomSvg() {
  const petals8 = [0, 45, 90, 135, 180, 225, 270, 315];
  const petals4 = [22.5, 112.5, 202.5, 292.5];

  return (
    <svg
      viewBox="-72 -72 144 144"
      width="220"
      height="220"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Outer petals */}
      {petals8.map((angle) => (
        <motion.path
          key={`o${angle}`}
          d="M0,0 C-11,-22 -9,-46 0,-58 C9,-46 11,-22 0,0"
          fill="#1B5E3B"
          opacity={0.9}
          transform={`rotate(${angle})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 + angle / 1800 }}
          style={{ transformOrigin: "0 0" }}
        />
      ))}
      {/* Inner petals */}
      {petals4.map((angle) => (
        <motion.path
          key={`i${angle}`}
          d="M0,0 C-7,-14 -6,-30 0,-38 C6,-30 7,-14 0,0"
          fill="#0F3D25"
          opacity={0.85}
          transform={`rotate(${angle})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25, delay: 0.12 }}
          style={{ transformOrigin: "0 0" }}
        />
      ))}
      {/* Brass center */}
      <motion.circle
        cx="0"
        cy="0"
        r="9"
        fill="#B8963E"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.18 }}
      />
      {/* Center dot */}
      <circle cx="0" cy="0" r="4" fill="#D4B87A" />
    </svg>
  );
}

export default function BloomTransition() {
  const pathname = usePathname();
  const [blooming, setBlooming] = useState(true);

  useEffect(() => {
    setBlooming(true);
    const t = setTimeout(() => setBlooming(false), 750);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {blooming && (
        <motion.div
          key={`bloom-${pathname}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            background: "transparent",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.15, 1.0, 0.2, 0],
              opacity: [0, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 0.72,
              times: [0, 0.3, 0.55, 0.8, 1],
              ease: "easeInOut",
            }}
          >
            <BloomSvg />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
