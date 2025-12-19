/**
 * components/AIAdvisor.tsx
 *
 * SECTION A - MID LAYER (Secondary)
 *
 * PURPOSE:
 * Plain English recommendations. NO JARGON.
 * Must feel like talking to a calm, smart friend.
 *
 * LANGUAGE RULES:
 * ✅ "Consider switching to Sleep Mode tonight"
 * ❌ "Volatility index suggests conservative rebalancing"
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { onMarketStateUpdate, type MarketState } from "@/lib/marketLoop";
import { getCurrentLifeMode } from "@/lib/lifeModeEngine";

export default function AIAdvisor() {
  const [recommendation, setRecommendation] = useState(
    "Analyzing market conditions..."
  );
  const [confidence, setConfidence] = useState("medium");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initial recommendation on mount
    const initialState: MarketState = {
      currentPrice: 200,
      previousPrice: 200,
      peakPrice: 200,
      priceChange: 0,
      drawdown: 0,
      volatility: 0.15,
      riskLevel: "low",
      lastUpdate: Date.now(),
    };
    generateRecommendation(initialState);

    // Subscribe to market updates
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      generateRecommendation(state);
    });
    return unsubscribe;
  }, []);

  const generateRecommendation = (state: MarketState) => {
    setIsUpdating(true);

    setTimeout(() => {
      const lifeMode = getCurrentLifeMode();
      const hour = new Date().getHours();

      // Generate HUMAN recommendations based on context
      if (state.riskLevel === "critical") {
        setRecommendation(
          "Markets are stressed right now. Consider switching to Sleep Mode if you're stepping away."
        );
        setConfidence("high");
      } else if (state.riskLevel === "high") {
        setRecommendation(
          "Volatility is picking up. STEADY is watching closely for you."
        );
        setConfidence("medium");
      } else if (hour >= 22 || hour <= 6) {
        setRecommendation(
          "It's late. Consider Sleep Mode for enhanced protection overnight."
        );
        setConfidence("medium");
      } else if (lifeMode === "growth" && state.riskLevel === "low") {
        setRecommendation(
          "Market is calm. Growth Mode is working well right now."
        );
        setConfidence("high");
      } else {
        setRecommendation(
          "Everything looks good. No changes needed at the moment."
        );
        setConfidence("low");
      }

      setIsUpdating(false);
    }, 300);
  };

  const confidenceColors = {
    high: "text-green-400 bg-green-500/10 border-green-500/30",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    low: "text-gray-400 bg-gray-500/10 border-gray-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <h3 className="text-lg font-bold text-white">AI Advisor</h3>
        </div>
        {isUpdating && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
          />
        )}
      </div>

      {/* Recommendation */}
      <motion.div
        key={recommendation}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 rounded-lg border ${
          confidenceColors[confidence as keyof typeof confidenceColors]
        }`}
      >
        <p className="text-sm text-gray-200 leading-relaxed">
          {recommendation}
        </p>
      </motion.div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-500"
          />
          <p className="text-xs text-gray-500">Updates every 20-40 seconds</p>
        </div>
      </div>
    </motion.div>
  );
}
