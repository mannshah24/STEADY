/**
 * components/RiskSummary.tsx
 *
 * SECTION A - MID LAYER (Secondary)
 *
 * PURPOSE:
 * Show current risk in HUMAN LANGUAGE.
 * NO technical jargon. Plain English only.
 *
 * LANGUAGE:
 * ✅ "Calm" / "Moderate risk" / "High stress mode"
 * ❌ "Volatility: 0.23" / "Beta: 1.4"
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  onMarketStateUpdate,
  type MarketState,
} from "@/lib/marketLoop";

export default function RiskSummary() {
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

  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setMarketState(state);
    });
    return unsubscribe;
  }, []);

  // Convert technical risk to HUMAN language
  const getRiskDisplay = () => {
    switch (marketState.riskLevel) {
      case "critical":
        return {
          label: "High stress mode",
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: "🔴",
          description: "Markets are very volatile right now",
        };
      case "high":
        return {
          label: "Moderate risk",
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: "🟠",
          description: "Some turbulence detected",
        };
      case "moderate":
        return {
          label: "Minor movement",
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: "🟡",
          description: "Market showing slight activity",
        };
      default:
        return {
          label: "Calm",
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: "🟢",
          description: "All systems normal",
        };
    }
  };

  const risk = getRiskDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-bold text-white">Market Conditions</h3>
      </div>

      {/* Risk Status */}
      <div className={`p-5 rounded-lg border ${risk.border} ${risk.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale: marketState.riskLevel === "critical" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: marketState.riskLevel === "critical" ? Infinity : 0,
              }}
              className="text-3xl"
            >
              {risk.icon}
            </motion.span>
            <div>
              <h4 className={`text-xl font-bold ${risk.color}`}>
                {risk.label}
              </h4>
              <p className="text-xs text-gray-400">{risk.description}</p>
            </div>
          </div>
        </div>

        {/* Simple Metrics in Human Language */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-800/50">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price Movement</p>
            <p className="text-sm font-semibold text-gray-300">
              {Math.abs(marketState.priceChange) < 2
                ? "Minimal"
                : Math.abs(marketState.priceChange) < 5
                ? "Moderate"
                : "Significant"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Your Protection</p>
            <p className="text-sm font-semibold text-green-400">Active</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-800/50">
        <p className="text-xs text-gray-500 text-center">
          STEADY is monitoring every 20-30 seconds
        </p>
      </div>
    </motion.div>
  );
}
