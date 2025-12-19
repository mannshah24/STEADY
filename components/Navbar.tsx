/**
 * components/Navbar.tsx
 *
 * Top navigation bar for STEADY
 * Responsibilities:
 * - Display STEADY logo/branding
 * - Show wallet connection status
 * - Navigation links (if multiple pages)
 * - Responsive mobile menu
 */

"use client";

import WalletConnect from "./WalletConnect";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient-neon">
              STEADY
            </span>
            <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
              Life-Aware Crypto Protection
            </span>
          </div>
        </div>

        {/* Navigation Links - Clean, Simple */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            className="text-gray-300 hover:text-neon-blue transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#protection"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("protection")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="text-gray-300 hover:text-neon-blue transition-colors cursor-pointer"
          >
            Protection
          </a>
        </div>

        {/* Wallet Connection */}
        <div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
