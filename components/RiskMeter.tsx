/**
 * components/RiskMeter.tsx
 *
 * Visual risk indicator (Green/Yellow/Red)
 * Gives instant "health check" vibe
 *
 * UPDATED: Now shows live monitoring indicator with subtle pulse
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isMarketLoopRunning } from "@/lib/marketLoop";

interface Props {
  mode: "Safe" | "Balanced" | "Growth";
  currentValue: number;
  peakValue: number;
}

export default function RiskMeter({ mode, currentValue, peakValue }: Props) {
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  const [drawdown, setDrawdown] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Check if market loop is actively monitoring
  useEffect(() => {
    const checkMonitoring = () => {
      setIsMonitoring(isMarketLoopRunning());
    };

    checkMonitoring();
    const interval = setInterval(checkMonitoring, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate risk based on drawdown and mode
  useEffect(() => {
    const dd =
      peakValue > 0 ? ((peakValue - currentValue) / peakValue) * 100 : 0;
    setDrawdown(dd);

    // Risk logic:
    // Growth mode: high risk by nature
    // Balanced: medium risk
    // Safe: low risk
    // Also factor in actual drawdown
    if (mode === "Growth" || dd > 8) {
      setRiskLevel("high");
    } else if (mode === "Balanced" || dd > 5) {
      setRiskLevel("medium");
    } else {
      setRiskLevel("low");
    }
  }, [mode, currentValue, peakValue]);

  const getRiskConfig = () => {
    switch (riskLevel) {
      case "low":
        return {
          label: "VERY SAFE",
          color: "green",
          icon: "🛡️",
          gradient: "from-green-500 to-emerald-500",
          glow: "shadow-[0_0_30px_rgba(34,197,94,0.4)]",
          description: "You're well protected. No worries.",
          percentage: 33,
        };
      case "medium":
        return {
          label: "MODERATE",
          color: "yellow",
          icon: "⚠️",
          gradient: "from-yellow-500 to-orange-500",
          glow: "shadow-[0_0_30px_rgba(234,179,8,0.4)]",
          description: "Some volatility. Protection is ready.",
          percentage: 66,
        };
      case "high":
        return {
          label: "NEEDS ATTENTION",
          color: "red",
          icon: "🔥",
          gradient: "from-red-500 to-pink-500",
          glow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
          description: "Higher exposure. Protection may act soon.",
          percentage: 100,
        };
    }
  };

  const config = getRiskConfig();

  return (
    <div className="border border-purple-500/30 rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm relative">
      {/* Live Monitoring Indicator */}
      {isMonitoring && (
        <div className="absolute top-3 right-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{
              opacity: [1, 0.4, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <motion.span
            className="text-3xl"
            animate={{
              rotate: riskLevel === "high" ? [0, -10, 10, -10, 0] : 0,
            }}
            transition={{
              repeat: riskLevel === "high" ? Infinity : 0,
              duration: 0.5,
            }}
          >
            {config.icon}
          </motion.span>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Peace of Mind Score
          </h3>
        </div>
        <p className="text-sm text-gray-400">How protected you are right now</p>
      </div>

      {/* Circular Risk Meter */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-800"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#riskGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 553 }}
              animate={{
                strokeDashoffset: 553 - (553 * config.percentage) / 100,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                strokeDasharray: "553",
              }}
              className={config.glow}
            />
            <defs>
              <linearGradient
                id="riskGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  className={`text-${config.color}-500`}
                  stopColor="currentColor"
                />
                <stop
                  offset="100%"
                  className={`text-${config.color}-400`}
                  stopColor="currentColor"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={riskLevel}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div
                className={`text-4xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-1`}
              >
                {config.percentage}%
              </div>
              <div
                className={`text-xs font-bold text-${config.color}-400 tracking-wider`}
              >
                {config.label}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 text-center mt-4">
          {config.description}
        </p>
      </div>

      {/* Risk Breakdown */}
      <div className="space-y-3">
        {/* Current Mode Risk */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <span className="text-sm text-gray-400">Mode Risk</span>
          <span className={`text-sm font-bold text-${config.color}-400`}>
            {mode}
          </span>
        </div>

        {/* Drawdown Risk */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <span className="text-sm text-gray-400">Current Drawdown</span>
          <span
            className={`text-sm font-bold ${
              drawdown > 8
                ? "text-red-400"
                : drawdown > 5
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {drawdown.toFixed(2)}%
          </span>
        </div>

        {/* Protection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <span className="text-sm text-gray-400">Protection</span>
          <span
            className={`text-sm font-bold ${
              drawdown >= 10 ? "text-green-400" : "text-blue-400"
            }`}
          >
            {drawdown >= 10 ? "TRIGGERED" : "ARMED"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-500">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-500">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
