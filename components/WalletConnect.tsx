/**
 * components/WalletConnect.tsx
 *
 * Premium Phantom wallet connection component
 * Designed for hackathon judges - clean, modern, and professional
 */

"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { getBalance } from "@/lib/solana";

export default function WalletConnect() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      getBalance(publicKey).then(setBalance);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey]);

  // Format wallet address (first 4 and last 4 characters)
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-3">
      {!connected ? (
        // Connect Button - Premium neon glow design with smooth transitions
        <button
          onClick={() => setVisible(true)}
          className="
            relative px-6 py-2.5 rounded-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-purple-600
            text-white
            transform transition-all duration-500 ease-in-out
            hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]
            active:scale-95
            shadow-[0_0_15px_rgba(0,217,255,0.3)]
          "
        >
          <span className="relative z-10">Connect Wallet</span>

          {/* Animated border glow */}
          <div
            className="
              absolute inset-0 rounded-lg 
              bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500
              opacity-0 blur-xl transition-opacity duration-500
              hover:opacity-70
            "
          />
        </button>
      ) : (
        // Connected State - Show address and balance
        <div className="flex items-center gap-3">
          {/* Balance Display */}
          {balance !== null && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg">
              <span className="text-cyan-400 font-mono text-sm font-semibold">
                {balance.toFixed(3)} SOL
              </span>
            </div>
          )}

          {/* Address Display with Disconnect */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-purple-500/30 rounded-lg group hover:border-purple-500/60 transition-all duration-500">
            {/* Connected indicator */}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

            {/* Address */}
            <span className="text-gray-300 font-mono text-sm">
              {publicKey && shortenAddress(publicKey.toString())}
            </span>

            {/* Disconnect button */}
            <button
              onClick={disconnect}
              className="ml-2 text-gray-500 hover:text-red-400 transition-colors duration-300"
              title="Disconnect"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Network Badge */}
      <div className="hidden lg:flex items-center px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full">
        <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">
          Devnet
        </span>
      </div>
    </div>
  );
}
