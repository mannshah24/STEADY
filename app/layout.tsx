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
  title: "STEADY | Solana Autopilot Investing",
  description:
    "Non-custodial crypto investing with downside protection on Solana",
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
