/**
 * components/InitializeButton.tsx
 *
 * Button to initialize portfolio for first-time users
 * Only shown when wallet is connected but portfolio doesn't exist
 */

"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import {
  initializePortfolio,
  fetchPortfolio,
  toAnchorWallet,
} from "@/lib/anchor";

export default function InitializeButton() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [isInitializing, setIsInitializing] = useState(false);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if portfolio exists
  useEffect(() => {
    if (connected && publicKey) {
      setChecking(true);
      const anchorWallet = toAnchorWallet(wallet);
      if (anchorWallet) {
        fetchPortfolio(anchorWallet)
          .then((portfolio) => {
            setPortfolioExists(portfolio !== null);
          })
          .catch(() => {
            setPortfolioExists(false);
          })
          .finally(() => {
            setChecking(false);
          });
      } else {
        setChecking(false);
      }
    } else {
      setChecking(false);
      setPortfolioExists(false);
    }
  }, [connected, publicKey]);

  const handleInitialize = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const anchorWallet = toAnchorWallet(wallet);
    if (!anchorWallet) {
      alert("Wallet not ready. Please try again.");
      return;
    }

    setIsInitializing(true);

    try {
      const tx = await initializePortfolio(anchorWallet);
      console.log("✅ Portfolio initialized! Transaction:", tx);
      alert(
        `Portfolio initialized successfully!\n\nTransaction: ${tx.slice(
          0,
          8
        )}...`
      );

      // Refresh to show portfolio exists
      setPortfolioExists(true);
    } catch (error: any) {
      console.error("Failed to initialize portfolio:", error);
      alert(
        `Failed to initialize portfolio: ${error?.message || "Unknown error"}`
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Don't show if not connected or portfolio already exists
  if (!connected || portfolioExists || checking) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 p-6 border-2 border-yellow-500/50 rounded-xl bg-yellow-500/5">
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Portfolio Not Initialized
          </h3>
          <p className="text-gray-300 mb-4">
            Your portfolio needs to be initialized before you can use STEADY
            features. This is a one-time setup that creates your on-chain
            portfolio account.
          </p>
          <button
            onClick={handleInitialize}
            disabled={isInitializing}
            className={`
              px-6 py-3 rounded-lg font-semibold
              bg-gradient-to-r from-yellow-500 to-orange-500
              text-black
              transition-all duration-300
              ${
                isInitializing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              }
            `}
          >
            {isInitializing ? "Initializing..." : "Initialize Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}
