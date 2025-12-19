/**
 * components/WalletConnect.tsx
 *
 * Premium Phantom wallet connection component
 * Clean, modern, and professional interface
 */

"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState, useCallback } from "react";
import { getBalance } from "@/lib/solana";
import { resetSteady } from "@/lib/steadyState";

export default function WalletConnect() {
  const { publicKey, connected, disconnect, connecting, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch balance when wallet connects
  useEffect(() => {
    let isSubscribed = true;
    
    const fetchBalance = async () => {
      if (connected && publicKey && isSubscribed) {
        try {
          const bal = await getBalance(publicKey);
          if (isSubscribed) {
            setBalance(bal);
          }
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          if (isSubscribed) {
            setBalance(null);
          }
        }
      } else if (!connected && isSubscribed) {
        setBalance(null);
      }
    };

    fetchBalance();
    
    // Refresh balance every 30 seconds when connected
    const interval = connected ? setInterval(fetchBalance, 30000) : undefined;

    return () => {
      isSubscribed = false;
      if (interval) clearInterval(interval);
    };
  }, [connected, publicKey]);

  // Manual balance refresh
  const refreshBalance = useCallback(async () => {
    if (connected && publicKey && !isRefreshing) {
      setIsRefreshing(true);
      try {
        const bal = await getBalance(publicKey);
        setBalance(bal);
      } catch (error) {
        console.error("Failed to refresh balance:", error);
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    }
  }, [connected, publicKey, isRefreshing]);

  // Handle disconnect with cleanup
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setBalance(null);
      // Clear wallet from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("steady-wallet");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnect]);

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
          disabled={connecting}
          className="
            relative px-6 py-2.5 rounded-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-purple-600
            text-white
            transform transition-all duration-500 ease-in-out
            hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]
            active:scale-95
            shadow-[0_0_15px_rgba(0,217,255,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <span className="relative z-10 flex items-center gap-2">
            {connecting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </span>

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
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg group hover:border-cyan-500/60 transition-all">
              <span className="text-cyan-400 font-mono text-sm font-semibold">
                {balance.toFixed(3)} SOL
              </span>
              <button
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="text-cyan-500/50 hover:text-cyan-400 transition-colors disabled:opacity-50"
                title="Refresh balance"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Address Display with Controls */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-purple-500/30 rounded-lg group hover:border-purple-500/60 transition-all duration-500">
            {/* Connected indicator */}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

            {/* Address */}
            <span className="text-gray-300 font-mono text-sm">
              {publicKey && shortenAddress(publicKey.toString())}
            </span>

            {/* Change Account button */}
            <button
              onClick={() => setVisible(true)}
              className="ml-2 text-gray-500 hover:text-cyan-400 transition-colors duration-300"
              title="Change Account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </button>

            {/* Disconnect button */}
            <button
              onClick={handleDisconnect}
              className="ml-1 text-gray-500 hover:text-red-400 transition-colors duration-300"
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

          {/* Reset Activation Button */}
          <button
            onClick={() => {
              if (confirm("Reset STEADY and go back to setup?")) {
                resetSteady();
                window.dispatchEvent(new Event("steady-reset"));
                window.location.reload();
              }
            }}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-300"
            title="Reset and go back to setup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
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
