'use client';
import { useRef, useLayoutEffect, useState, ReactNode, RefObject } from 'react';
import {
  motion, useScroll, useSpring, useTransform,
  useMotionValue, useVelocity, useAnimationFrame,
} from 'framer-motion';

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const update = () => { if (ref.current) setWidth(ref.current.offsetWidth); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref]);
  return width;
}

interface VelocityTextProps {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}

function VelocityText({ children, baseVelocity = 80, className = '', damping = 50, stiffness = 400, numCopies = 6 }: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const wrap = (min: number, max: number, v: number) => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  };

  const x = useTransform(baseX, v => copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, v)}px`);
  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <motion.div style={{ x, display: 'flex', whiteSpace: 'nowrap' }}>
        {Array.from({ length: numCopies }, (_, i) => (
          <span key={i} ref={i === 0 ? copyRef : null} className={className}>
            {children}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}

export default function ScrollVelocity({ texts, velocity = 80, className = '', damping = 50, stiffness = 400, numCopies = 6 }: ScrollVelocityProps) {
  return (
    <>
      {texts.map((text, i) => (
        <VelocityText
          key={i}
          baseVelocity={i % 2 !== 0 ? -velocity : velocity}
          className={className}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
        >
          {text}
        </VelocityText>
      ))}
    </>
  );
}
