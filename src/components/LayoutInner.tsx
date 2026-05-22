"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMenu } from "@/context/MenuContext";
import { useCart } from "@/context/CartContext";

export default function LayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMenuOpen } = useMenu();
  const { isCartOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isCartOpen]);

  let pageClass = "layout-default";
  if (pathname === "/") pageClass = "layout-home";
  else if (pathname.startsWith("/products")) pageClass = "layout-pdp";

  return (
    <div className={`layout-inner ${pageClass}`}>
      {children}
    </div>
  );
}
