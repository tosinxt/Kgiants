import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KGiants | Cinematic Digital Collections",
  description: "Experience the immersive, cinematic digital collections of KGiants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
              {children}
            </main>
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
