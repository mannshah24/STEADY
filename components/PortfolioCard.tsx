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
import {
  getMarketState,
  onMarketStateUpdate,
  type MarketState,
} from "@/lib/marketLoop";

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
  const [marketState, setMarketState] = useState<MarketState>({
    currentPrice: 210,
    previousPrice: 210,
    peakPrice: 210,
    priceChange: 0,
    drawdown: 0,
    volatility: 0,
    riskLevel: "low",
    lastUpdate: Date.now(),
  });

  // Subscribe to market updates for risk display
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setMarketState(state);
    });
    return unsubscribe;
  }, []);

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
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">What You're Protecting</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400">
            Asset Allocation
          </p>
          <p className="text-[10px] text-gray-500">10% protected</p>
        </div>

        {/* SOL Allocation Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                SOL
              </div>
              <span className="text-xs font-medium text-gray-300">Solana</span>
            </div>
            <span className="text-sm font-bold text-purple-400">
              {portfolio.allocation.sol}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${portfolio.allocation.sol}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/* USDC Allocation Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                USDC
              </div>
              <span className="text-xs font-medium text-gray-300">
                USD Coin
              </span>
            </div>
            <span className="text-sm font-bold text-cyan-400">
              {portfolio.allocation.usdc}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${portfolio.allocation.usdc}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            />
          </div>
        </div>
      </div>

      {/* Market Risk Section */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <p className="text-xs font-semibold text-gray-400 mb-2">
          Market Risk
        </p>

        <div className="space-y-2">
          {/* Risk Level Indicator */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  marketState.riskLevel === "critical"
                    ? "bg-red-500 animate-pulse"
                    : marketState.riskLevel === "high"
                    ? "bg-orange-500"
                    : marketState.riskLevel === "moderate"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
              <span className="text-xs text-gray-300">Risk</span>
            </div>
            <span
              className={`text-xs font-bold ${
                marketState.riskLevel === "critical"
                  ? "text-red-400"
                  : marketState.riskLevel === "high"
                  ? "text-orange-400"
                  : marketState.riskLevel === "moderate"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {marketState.riskLevel === "critical"
                ? "Elevated"
                : marketState.riskLevel === "high"
                ? "Moderate"
                : marketState.riskLevel === "moderate"
                ? "Low"
                : "Calm"}
            </span>
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-gray-800/40">
              <p className="text-[10px] text-gray-500 mb-0.5">SOL Price</p>
              <p className="text-xs font-semibold text-gray-300">
                ${(marketState.currentPrice || 210).toFixed(2)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gray-800/40">
              <p className="text-[10px] text-gray-500 mb-0.5">Volatility</p>
              <p className="text-xs font-semibold text-gray-300">
                {((marketState.volatility || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Protection Floor */}
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Protection Floor</span>
              <span className="text-xs font-bold text-green-400">
                ${(portfolio.totalValue * 0.9).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
