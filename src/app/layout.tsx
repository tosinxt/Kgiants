import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { MenuProvider } from "@/context/MenuContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import MenuSidebar from "@/components/MenuSidebar";
import LayoutInner from "@/components/LayoutInner";
import CookieBanner from "@/components/CookieBanner";
import CheckoutDialog from "@/components/CheckoutDialog";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KGiants | Luxury Diffusers & Fragrance Oils",
  description: "Curated luxury diffusers and fragrance oils. Elevate every space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <MenuProvider>
              {/* Menu is fixed overlay — lives at root, not inside layout-wrapper */}
              <MenuSidebar />

              <Navbar />
              <div className="layout-wrapper">
                <LayoutInner>
                  <main className="main-content">
                    {children}
                  </main>
                  <CartSidebar />
                </LayoutInner>
              </div>
              <CheckoutDialog />
              <CookieBanner />
              <Toaster position="bottom-center" toastOptions={{ style: { fontFamily: 'var(--font-body)', fontSize: 14, background: '#1A1714', color: '#FAFAF7', borderRadius: 2 } }} />
            </MenuProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
