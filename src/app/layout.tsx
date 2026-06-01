import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { MenuProvider } from "@/context/MenuContext";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartSidebar from "@/components/CartSidebar";
import LayoutInner from "@/components/LayoutInner";
import CookieBanner from "@/components/CookieBanner";
import CheckoutDialog from "@/components/CheckoutDialog";
import Preloader from "@/components/Preloader";
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
              <Preloader>
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
              </Preloader>
              <Toaster
                position="bottom-right"
                gutter={10}
                toastOptions={{
                  duration: 3500,
                  style: {
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 500,
                    background: '#163300',
                    color: '#EFF7EA',
                    borderRadius: 0,
                    padding: '14px 20px',
                    boxShadow: '0 12px 40px rgba(22,51,0,0.35)',
                    border: '1px solid rgba(239,247,234,0.15)',
                    letterSpacing: '0.01em',
                    maxWidth: 360,
                    minWidth: 260,
                  },
                  success: {
                    iconTheme: { primary: '#7DC95E', secondary: '#163300' },
                  },
                  error: {
                    style: {
                      background: '#3D0000',
                      border: '1px solid rgba(255,107,107,0.25)',
                    },
                    iconTheme: { primary: '#FF6B6B', secondary: '#3D0000' },
                  },
                }}
              />
            </MenuProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
