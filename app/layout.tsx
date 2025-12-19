/**
 * app/layout.tsx
 *
 * Root layout for STEADY MVP
 * Responsibilities:
 * - Provides global HTML structure
 * - Wraps app in Solana Wallet Provider
 * - Applies global styles and fonts
 * - Configures metadata for SEO
 */

import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "STEADY | Life-Aware Crypto Protection",
  description:
    "STEADY protects crypto holders when life gets in the way — when you're asleep, busy, emotional, or offline. Non-custodial protection on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
