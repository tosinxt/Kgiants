"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function DrawPath({
  d,
  stroke,
  strokeWidth,
  delay,
}: {
  d: string;
  stroke: string;
  strokeWidth: number;
  delay: number;
}) {
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        pathLength: { delay, duration: 1.1, ease: "easeInOut" as const },
        opacity: { delay, duration: 0.3 },
      }}
    />
  );
}

/* ── Animated branch that draws itself ─────────────────────── */
export function BotanicalBranch({
  width = 120,
  height = 340,
  color = "#1B5E3B",
  delay = 0,
}: {
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
}) {
  const cx = width / 2;
  const h = height;

  const paths = [
    // Main stem
    { d: `M${cx},${h - 10} C${cx - 5},${h * 0.7} ${cx + 5},${h * 0.4} ${cx},20`, w: 1.5, i: 0 },
    // Left leaf 1
    { d: `M${cx},${h * 0.72} C${cx - 30},${h * 0.65} ${cx - 40},${h * 0.58} ${cx - 22},${h * 0.55}`, w: 1.2, i: 1 },
    // Right leaf 1
    { d: `M${cx},${h * 0.65} C${cx + 28},${h * 0.59} ${cx + 36},${h * 0.52} ${cx + 18},${h * 0.49}`, w: 1.2, i: 2 },
    // Left leaf 2
    { d: `M${cx},${h * 0.5} C${cx - 26},${h * 0.43} ${cx - 34},${h * 0.37} ${cx - 16},${h * 0.34}`, w: 1.1, i: 3 },
    // Right leaf 2
    { d: `M${cx},${h * 0.43} C${cx + 24},${h * 0.37} ${cx + 30},${h * 0.31} ${cx + 14},${h * 0.28}`, w: 1.1, i: 4 },
    // Left leaf 3
    { d: `M${cx},${h * 0.3} C${cx - 20},${h * 0.25} ${cx - 26},${h * 0.2} ${cx - 12},${h * 0.17}`, w: 1.0, i: 5 },
    // Right leaf 3
    { d: `M${cx},${h * 0.24} C${cx + 18},${h * 0.19} ${cx + 22},${h * 0.14} ${cx + 10},${h * 0.11}`, w: 1.0, i: 6 },
    // Top bud
    { d: `M${cx},20 C${cx - 6},12 ${cx - 4},4 ${cx},0 C${cx + 4},4 ${cx + 6},12 ${cx},20`, w: 1.0, i: 7 },
  ];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((p) => (
        <DrawPath
          key={p.i}
          d={p.d}
          stroke={color}
          strokeWidth={p.w}
          delay={delay + p.i * 0.09}
        />
      ))}
    </svg>
  );
}

/* ── Sprig divider ──────────────────────────────────────────── */
export function BotanicalSprig({
  color = "#1B5E3B",
  opacity = 0.55,
}: {
  color?: string;
  opacity?: number;
}) {
  const paths = [
    { d: "M80,38 L80,2", i: 0 },
    { d: "M80,28 C65,22 52,20 44,22", i: 1 },
    { d: "M80,28 C95,22 108,20 116,22", i: 2 },
    { d: "M80,18 C70,14 62,14 58,16", i: 3 },
    { d: "M80,18 C90,14 98,14 102,16", i: 4 },
    { d: "M80,8 C78,4 78,1 80,0 C82,1 82,4 80,8", i: 5 },
  ];

  return (
    <svg
      viewBox="0 0 160 40"
      width="160"
      height="40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {paths.map((p) => (
        <DrawPath key={p.i} d={p.d} stroke={color} strokeWidth={0.9} delay={p.i * 0.1} />
      ))}
    </svg>
  );
}

/* ── Corner leaf ────────────────────────────────────────────── */
export function CornerLeaf({
  size = 60,
  color = "#1B5E3B",
  flip = false,
}: {
  size?: number;
  color?: string;
  flip?: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 0.4, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
    >
      <path
        d="M4,56 C4,56 8,30 28,18 C36,13 44,10 54,8 C52,18 48,28 40,36 C28,48 4,56 4,56Z"
        fill={color}
        opacity={0.2}
      />
      <path
        d="M4,56 C4,56 8,30 28,18 C36,13 44,10 54,8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14,46 C22,36 36,26 50,20"
        stroke={color}
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    </motion.svg>
  );
}

/* ── Floating petal ─────────────────────────────────────────── */
export function FloatingPetal({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 20 32"
      width="14"
      height="22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: 0, rotate: -15 }}
      animate={{ opacity: [0, 0.6, 0], y: [-10, -44], rotate: [-15, 20], x: [0, 14] }}
      transition={{ duration: 1.8, delay, ease: "easeOut" as const }}
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <path d="M10,30 C-2,22 -4,8 10,0 C24,8 22,22 10,30Z" fill="#1B5E3B" opacity={0.5} />
    </motion.svg>
  );
}
