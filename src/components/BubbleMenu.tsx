'use client';

import { useState, useRef, useEffect, CSSProperties, ReactNode } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

interface HoverStyles {
  bgColor?: string;
  textColor?: string;
}

interface MenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: HoverStyles;
  onClick?: () => void;
}

interface BubbleMenuProps {
  logo?: ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  /* Controlled mode — pass to sync with external state */
  controlledOpen?: boolean;
  onControlledToggle?: () => void;
  hideNav?: boolean;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: 'home',     href: '/',     ariaLabel: 'Home',     rotation: -8, hoverStyles: { bgColor: '#9FE870', textColor: '#163300' } },
  { label: 'shop all', href: '/shop', ariaLabel: 'Shop all', rotation:  8, hoverStyles: { bgColor: '#B8D98A', textColor: '#163300' } },
  { label: 'diffusers',href: '/shop?category=Waterless+Diffuser', ariaLabel: 'Diffusers', rotation: -5, hoverStyles: { bgColor: '#C8E8A8', textColor: '#163300' } },
  { label: 'oils',     href: '/shop?category=Fragrance+Oil',      ariaLabel: 'Oils',      rotation:  6, hoverStyles: { bgColor: '#B8D98A', textColor: '#163300' } },
  { label: 'contact',  href: '/contact', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#163300', textColor: '#DDE8D0' } },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#DDE8D0',
  menuContentColor = '#163300',
  useFixedPosition = true,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.45,
  staggerDelay = 0.1,
  controlledOpen,
  onControlledToggle,
  hideNav = false,
}: BubbleMenuProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const isMenuOpen = isControlled ? controlledOpen : internalOpen;

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const posClass = useFixedPosition ? 'fixed' : 'absolute';
  const containerClass = ['bubble-menu', posClass, className].filter(Boolean).join(' ');

  const handleToggle = () => {
    if (isControlled) {
      onControlledToggle?.();
    } else {
      const next = !internalOpen;
      if (next) setShowOverlay(true);
      setInternalOpen(next);
      onMenuClick?.(next);
    }
  };

  // Sync showOverlay when controlled open changes to true
  useEffect(() => {
    if (isControlled && controlledOpen && !showOverlay) {
      setShowOverlay(true);
    }
  }, [isControlled, controlledOpen, showOverlay]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLElement[];

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.04, 0.04);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) {
          tl.to(labels[i], { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' }, `-=${animationDuration * 0.9}`);
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.18, ease: 'power3.in' });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.18,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      <nav className={containerClass} style={hideNav ? { display: 'none' } : style} aria-label="Main navigation">
        {logo && (
          <div className="bubble logo-bubble" aria-label="Logo" style={{ background: menuBg }}>
            <span className="logo-content">
              {typeof logo === 'string'
                ? <img src={logo} alt="Logo" className="bubble-logo" />
                : logo}
            </span>
          </div>
        )}

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${posClass}`}
          aria-hidden={!isMenuOpen}
          onClick={(e) => { if (e.target === e.currentTarget) handleToggle(); }}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={{
                    '--item-rot': `${item.rotation ?? 0}deg`,
                    '--pill-bg': menuBg,
                    '--pill-color': menuContentColor,
                    '--hover-bg': item.hoverStyles?.bgColor ?? '#C8E8A8',
                    '--hover-color': item.hoverStyles?.textColor ?? menuContentColor,
                  } as CSSProperties}
                  ref={el => { bubblesRef.current[idx] = el; }}
                  onClick={() => { item.onClick?.(); handleToggle(); }}
                >
                  <span
                    className="pill-label"
                    ref={el => { labelRefs.current[idx] = el; }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
