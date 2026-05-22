import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { MenuProvider } from "@/context/MenuContext";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartSidebar from "@/components/CartSidebar";
import MenuSidebar from "@/components/MenuSidebar";
import LayoutInner from "@/components/LayoutInner";
import CookieBanner from "@/components/CookieBanner";
import CheckoutDialog from "@/components/CheckoutDialog";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" className={outfit.variable}>
      <body>
        <AuthProvider>
          <CartProvider>
            <MenuProvider>
              {/* Menu is fixed overlay — lives at root, not inside layout-wrapper */}
              <MenuSidebar />

              {/* Cart is fixed overlay — lives at root, not inside layout-wrapper */}
              <CartSidebar />

              <AnnouncementBar />
              <Navbar />
              <div className="layout-wrapper">
                <LayoutInner>
                  <main className="main-content">
                    {children}
                  </main>
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
