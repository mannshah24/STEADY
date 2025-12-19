/**
 * components/HeartbeatMonitor.tsx
 *
 * PHASE 2: MAKE STEADY FEEL ALIVE
 *
 * PURPOSE:
 * This component makes STEADY feel like a living guardian, not a static dashboard.
 * It shows users that their protection is ACTIVE and WATCHING.
 *
 * PSYCHOLOGICAL IMPACT:
 * - Builds trust through transparency
 * - Creates sense of active protection
 * - Makes the platform feel alive
 *
 * DISPLAYS:
 * - 🟢 Live monitoring status with pulse animation
 * - Last market evaluation timestamp
 * - Next evaluation countdown
 * - Current monitoring state
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  isMarketLoopRunning,
  getMarketState,
  getLoopInterval,
  onMarketStateUpdate,
  type MarketState,
} from "@/lib/marketLoop";

export default function HeartbeatMonitor() {
  const [isActive, setIsActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(30);

  // Subscribe to market updates
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setLastUpdate(state.lastUpdate);
    });
    return unsubscribe;
  }, []);

  // Update counters every second
  useEffect(() => {
    const updateCounters = () => {
      const now = Date.now();
      const loopInterval = getLoopInterval();
      setIsActive(isMarketLoopRunning());

      if (lastUpdate > 0) {
        const elapsed = Math.floor((now - lastUpdate) / 1000);
        setSecondsSinceUpdate(elapsed);
        const remaining = Math.max(
          0,
          Math.floor(loopInterval / 1000) - elapsed
        );
        setSecondsUntilNext(remaining);
      }
    };

    updateCounters();
    const interval = setInterval(updateCounters, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        {/* LEFT: Status Indicator */}
        <div className="flex items-center gap-3">
          {/* Animated pulse dot */}
          <div className="relative">
            {isActive ? (
              <>
                {/* Pulsing outer ring */}
                <motion.div
                  className="absolute inset-0 w-3 h-3 rounded-full bg-green-500/30"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Solid center dot */}
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              </>
            ) : (
              <div className="w-3 h-3 rounded-full bg-gray-600" />
            )}
          </div>

          {/* Status Text */}
          <div>
            <p className="text-sm font-semibold text-gray-200">
              {isActive
                ? "STEADY is actively monitoring"
                : "Connecting to monitoring system..."}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isActive
                ? `Last check: ${formatTime(secondsSinceUpdate)} ago`
                : "Initializing protection network"}
            </p>
          </div>
        </div>

        {/* RIGHT: Next Evaluation Countdown */}
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-right"
            >
              <p className="text-xs text-gray-500 mb-0.5">Next evaluation</p>
              <motion.p
                key={secondsUntilNext}
                initial={{ scale: 1.1, color: "#10b981" }}
                animate={{ scale: 1, color: "#9ca3af" }}
                className="text-sm font-mono font-bold"
              >
                {formatTime(secondsUntilNext)}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
