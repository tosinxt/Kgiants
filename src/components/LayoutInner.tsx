"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function LayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCartOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  let pageClass = "layout-default";
  if (pathname === "/") pageClass = "layout-home";
  else if (pathname.startsWith("/products")) pageClass = "layout-pdp";

  return (
    <div className={`layout-inner ${pageClass}`}>
      {children}
    </div>
  );
}
