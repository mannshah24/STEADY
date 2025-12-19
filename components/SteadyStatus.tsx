/**
 * components/SteadyStatus.tsx
 *
 * STEADY Status Heartbeat Display
 *
 * Purpose:
 * Shows users that STEADY is ALIVE and actively monitoring.
 * This makes the platform feel like a living system, not a static page.
 *
 * Displays:
 * - 🟢 Status indicator (pulsing when active)
 * - "Last evaluation: X seconds ago"
 * - "Next evaluation in: X seconds"
 *
 * Updates every second for real-time feel.
 *
 * Tone: Calm, reassuring, professional
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  isMarketLoopRunning,
  getMarketState,
  getLoopInterval,
  type MarketState,
  onMarketStateUpdate,
} from "@/lib/marketLoop";

export default function SteadyStatus() {
  const [isActive, setIsActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(0);
  const [riskLevel, setRiskLevel] = useState<string>("low");

  // Subscribe to market state updates
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setLastUpdate(state.lastUpdate);
      setRiskLevel(state.riskLevel);
    });

    return unsubscribe;
  }, []);

  // Update counters every second
  useEffect(() => {
    const updateCounters = () => {
      const now = Date.now();
      const loopInterval = getLoopInterval();

      // Check if loop is running
      setIsActive(isMarketLoopRunning());

      if (lastUpdate > 0) {
        // Time since last update
        const elapsed = Math.floor((now - lastUpdate) / 1000);
        setSecondsSinceUpdate(elapsed);

        // Time until next update
        const remaining = Math.max(
          0,
          Math.floor(loopInterval / 1000) - elapsed
        );
        setSecondsUntilNext(remaining);
      } else {
        // Initial state
        const marketState = getMarketState();
        if (marketState.lastUpdate > 0) {
          setLastUpdate(marketState.lastUpdate);
        }
      }
    };

    updateCounters();
    const interval = setInterval(updateCounters, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Get reassuring status message based on risk level
  // CRITICAL: Human-focused language that provides calm and context
  const getReassuranceMessage = (risk: string): string => {
    switch (risk) {
      case "critical":
        return "Elevated risk detected. Protection protocols evaluating response.";
      case "high":
        return "Increased volatility observed. Monitoring closely. Protection ready.";
      case "moderate":
        return "Minor volatility present. Protection armed and ready if needed.";
      default:
        return "Market stable. No action needed. You're safe.";
    }
  };

  // Status indicator color based on risk
  const getStatusColor = () => {
    if (!isActive) return "text-gray-500";

    switch (riskLevel) {
      case "critical":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "moderate":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  const getStatusBgColor = () => {
    if (!isActive) return "bg-gray-500/20";

    switch (riskLevel) {
      case "critical":
        return "bg-red-500/20";
      case "high":
        return "bg-orange-500/20";
      case "moderate":
        return "bg-yellow-500/20";
      default:
        return "bg-green-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div
        className={`rounded-xl border ${
          isActive ? "border-green-500/30" : "border-gray-700/30"
        } ${getStatusBgColor()} backdrop-blur-sm p-6`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            {/* Pulsing dot */}
            <div className="relative">
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  isActive
                    ? getStatusColor().replace("text-", "bg-")
                    : "bg-gray-500"
                }`}
                animate={
                  isActive
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounded-full ${getStatusColor().replace(
                    "text-",
                    "bg-"
                  )}`}
                  animate={{
                    scale: [1, 2, 2],
                    opacity: [0.4, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </div>

            {/* Status text with CALM REASSURANCE */}
            <div className="flex-1">
              <p className={`font-semibold text-lg ${getStatusColor()}`}>
                {isActive
                  ? "STEADY is alive and watching"
                  : "Monitoring paused"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isActive
                  ? getReassuranceMessage(riskLevel)
                  : "Connect wallet to activate monitoring"}
              </p>
            </div>
          </div>

          {/* Timing Info */}
          {isActive && lastUpdate > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Last evaluation</p>
                <p className="text-white font-mono">
                  {secondsSinceUpdate}s ago
                </p>
              </div>

              <div className="h-8 w-px bg-gray-700" />

              <div>
                <p className="text-gray-500 text-xs">Next check in</p>
                <p className={`font-mono ${getStatusColor()}`}>
                  {secondsUntilNext}s
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
