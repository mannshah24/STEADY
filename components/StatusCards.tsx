/**
 * components/StatusCards.tsx
 *
 * SECONDARY UI LAYER - Informational but Not Overwhelming
 *
 * PURPOSE:
 * Display key information compactly without cluttering the view.
 * Max 2-3 cards, clean design, gentle accents.
 *
 * DESIGN PHILOSOPHY:
 * - Compact and scannable
 * - No loud borders or excessive decorations
 * - Information-rich but visually quiet
 * - Subtle neon accents only
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBalance } from "@/lib/solana";
import { getSolUsdPrice } from "@/lib/pyth";
import {
  getMarketState,
  onMarketStateUpdate,
  type MarketState,
} from "@/lib/marketLoop";

interface Props {
  currentMode: "Safe" | "Balanced" | "Growth";
  currentValue: number;
}

export default function StatusCards({ currentMode, currentValue }: Props) {
  const { connected, publicKey } = useWallet();
  const [portfolioValue, setPortfolioValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState<string>("low");
  const [solBalance, setSolBalance] = useState(0);

  // Subscribe to market updates
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setRiskLevel(state.riskLevel);
    });
    return unsubscribe;
  }, []);

  // Fetch portfolio value
  useEffect(() => {
    if (!connected || !publicKey) {
      setIsLoading(false);
      setPortfolioValue(currentValue || 0);
      return;
    }

    const loadValue = async () => {
      try {
        setIsLoading(true);
        const balance = await getBalance(publicKey);
        const solPrice = await getSolUsdPrice();
        setSolBalance(balance);
        setPortfolioValue(balance * (solPrice || 210));
      } catch (e) {
        console.error("Failed to load value:", e);
        setPortfolioValue(currentValue || 0);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
    const interval = setInterval(loadValue, 5000);
    return () => clearInterval(interval);
  }, [connected, publicKey, currentValue]);

  // Risk display config - calm language
  const getRiskConfig = () => {
    switch (riskLevel) {
      case "critical":
        return {
          label: "Elevated",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          message: "Protection may act soon",
        };
      case "high":
        return {
          label: "Moderate",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          message: "Watching closely",
        };
      case "moderate":
        return {
          label: "Low",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          message: "Minor volatility",
        };
      default:
        return {
          label: "Calm",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          message: "Markets stable",
        };
    }
  };

  // AI recommendation - simple, human
  const getRecommendation = () => {
    switch (riskLevel) {
      case "critical":
      case "high":
        return "Consider reviewing your protection settings.";
      case "moderate":
        return "Your current settings look appropriate.";
      default:
        return "No changes recommended right now.";
    }
  };

  const risk = getRiskConfig();

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Card 1: Portfolio Value - Clean, Minimal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/40"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Protected Value
        </p>
        {isLoading ? (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-neon-cyan rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        ) : !connected ? (
          <>
            <p className="text-lg font-semibold text-gray-400 mb-1">
              Connect Wallet
            </p>
            <p className="text-xs text-gray-500">To view your portfolio</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-white mb-1">
              $
              {portfolioValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500">
              {solBalance.toFixed(4)} SOL • {currentMode} mode
            </p>
          </>
        )}
      </motion.div>

      {/* Card 2: Risk State - Calm Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`p-5 rounded-2xl ${risk.bgColor} border border-gray-800/40`}
      >
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Market Conditions
        </p>
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-2 h-2 rounded-full ${risk.color.replace(
              "text-",
              "bg-"
            )}`}
          />
          <p className={`text-xl font-bold ${risk.color}`}>{risk.label}</p>
        </div>
        <p className="text-xs text-gray-400">{risk.message}</p>
      </motion.div>

      {/* Card 3: Simple Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/40"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Recommendation
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {getRecommendation()}
        </p>
      </motion.div>
    </div>
  );
}
