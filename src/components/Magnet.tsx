'use client';
import { useState, useEffect, useRef, ReactNode, HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 3,
  activeTransition = 'transform 0.2s ease-out',
  inactiveTransition = 'transform 0.4s ease-in-out',
  innerClassName,
  ...props
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) { setPos({ x: 0, y: 0 }); return; }

    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = Math.abs(cx - e.clientX);
      const dy = Math.abs(cy - e.clientY);

      if (dx < width / 2 + padding && dy < height / 2 + padding) {
        setIsActive(true);
        setPos({ x: (e.clientX - cx) / magnetStrength, y: (e.clientY - cy) / magnetStrength });
      } else {
        setIsActive(false);
        setPos({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, disabled, magnetStrength]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }} {...props}>
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
