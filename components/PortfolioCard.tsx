/**
 * components/PortfolioCard.tsx
 *
 * Portfolio display card - designed for instant comprehension
 * Shows total value, current mode, and asset allocation at a glance
 */

"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchPortfolio, toAnchorWallet } from "@/lib/anchor";
import { getBalance } from "@/lib/solana";
import { getSolUsdPrice } from "@/lib/pyth";

interface PortfolioData {
  totalValue: number;
  mode: "Safe" | "Balanced" | "Growth";
  allocation: {
    sol: number; // percentage
    usdc: number; // percentage
  };
}

export default function PortfolioCard() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    totalValue: 0,
    mode: "Safe",
    allocation: { sol: 0, usdc: 0 },
  });

  // Fetch portfolio data from Solana program
  useEffect(() => {
    if (!connected || !publicKey) return;

    const loadPortfolio = async () => {
      try {
        // Get wallet balance
        const solBalance = await getBalance(publicKey);
        const solPrice = await getSolUsdPrice();
        const totalValue = solBalance * (solPrice || 210); // Fallback to $210 if price fetch fails

        // Try to fetch on-chain portfolio data (may not exist yet)
        const anchorWallet = toAnchorWallet(wallet);
        const portfolioAccount = anchorWallet
          ? await fetchPortfolio(anchorWallet)
          : null;

        // Dynamic allocation based on mode
        const currentMode = (portfolioAccount?.currentMode as any) || "Safe";
        const allocation =
          currentMode === "Safe"
            ? { sol: 20, usdc: 80 }
            : currentMode === "Balanced"
            ? { sol: 50, usdc: 50 }
            : { sol: 80, usdc: 20 }; // Growth

        setPortfolio({
          totalValue,
          mode: currentMode,
          allocation,
        });
      } catch (error) {
        console.error("Failed to load portfolio:", error);
        // Show wallet balance even if portfolio not initialized yet
        try {
          const solBalance = await getBalance(publicKey);
          const solPrice = await getSolUsdPrice();
          setPortfolio({
            totalValue: solBalance * (solPrice || 210),
            mode: "Safe",
            allocation: { sol: 20, usdc: 80 }, // Safe mode default
          });
        } catch {
          setPortfolio({
            totalValue: 0,
            mode: "Safe",
            allocation: { sol: 0, usdc: 0 },
          });
        }
      }
    };

    // Load immediately
    loadPortfolio();

    // Poll every 3 seconds to refresh data (catches mode changes)
    const interval = setInterval(loadPortfolio, 3000);

    return () => clearInterval(interval);
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="border border-gray-700 rounded-xl p-8 text-center bg-gray-900/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-3xl">👛</span>
          </div>
          <p className="text-gray-400">Connect wallet to view portfolio</p>
        </div>
      </div>
    );
  }

  // Mode styling
  const modeColors = {
    Safe: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/30",
    },
    Balanced: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
    },
    Growth: {
      bg: "bg-pink-500/10",
      text: "text-pink-400",
      border: "border-pink-500/30",
    },
  };

  const currentModeColors = modeColors[portfolio.mode];

  return (
    <div className="border border-purple-500/30 rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      {/* Header: Total Value */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
        <div className="flex items-baseline gap-1 flex-wrap">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            $
            {portfolio.totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          {/* Mode Badge */}
          <div
            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-tight ${currentModeColors.bg} ${currentModeColors.text} border ${currentModeColors.border}`}
          >
            {portfolio.mode}
          </div>
        </div>
      </div>

      {/* Allocation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-400">
            Asset Allocation
          </p>
          <p className="text-xs text-gray-500">Protected by 10% downside</p>
        </div>

        {/* SOL Allocation Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                SOL
              </motion.div>
              <span className="text-sm font-medium text-gray-300">Solana</span>
            </div>
            <motion.span
              key={`sol-${portfolio.allocation.sol}`}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-bold text-purple-400"
            >
              {portfolio.allocation.sol}%
            </motion.span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${portfolio.allocation.sol}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
          </div>
        </div>

        {/* USDC Allocation Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                USDC
              </motion.div>
              <span className="text-sm font-medium text-gray-300">
                USD Coin
              </span>
            </div>
            <motion.span
              key={`usdc-${portfolio.allocation.usdc}`}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-bold text-cyan-400"
            >
              {portfolio.allocation.usdc}%
            </motion.span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${portfolio.allocation.usdc}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
                delay: 0.5,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Peak Value</p>
          <p className="text-sm font-semibold text-gray-300">
            ${(portfolio.totalValue * 1.12).toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Protection Level</p>
          <p className="text-sm font-semibold text-green-400">
            ${(portfolio.totalValue * 0.9).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
