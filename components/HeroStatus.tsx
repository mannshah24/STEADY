/**
 * components/HeroStatus.tsx
 *
 * PRIMARY UI LAYER - The Calm Guardian Display
 *
 * PURPOSE:
 * This is what users see FIRST. It must be:
 * - Emotionally reassuring
 * - Visually calm and premium
 * - Immediately understandable
 *
 * DESIGN PHILOSOPHY:
 * - Maximum whitespace
 * - Minimal visual noise
 * - One clear emotional message
 * - Life Mode + Heartbeat combined elegantly
 *
 * This replaces the cluttered hero with a calm, confident display
 * that makes users feel protected, not overwhelmed.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LIFE_MODES,
  getCurrentLifeMode,
  setLifeModeWithNotification,
  getLifeModeStatusMessage,
  type LifeMode,
} from "@/lib/lifeModeEngine";
import {
  isMarketLoopRunning,
  getMarketState,
  getLoopInterval,
  onMarketStateUpdate,
  type MarketState,
} from "@/lib/marketLoop";

interface Props {
  onModeChange?: (mode: LifeMode) => void;
}

export default function HeroStatus({ onModeChange }: Props) {
  const [currentMode, setCurrentMode] = useState<LifeMode>("growth");
  const [isChanging, setIsChanging] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  // Heartbeat state
  const [isActive, setIsActive] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Load current mode
  useEffect(() => {
    setCurrentMode(getCurrentLifeMode());
  }, []);

  // Subscribe to market state
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      setLastUpdate(state.lastUpdate);
    });
    return unsubscribe;
  }, []);

  // Update heartbeat counter
  useEffect(() => {
    const updateCounters = () => {
      setIsActive(isMarketLoopRunning());
      if (lastUpdate > 0) {
        const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
        setSecondsSinceUpdate(elapsed);
      }
    };
    updateCounters();
    const interval = setInterval(updateCounters, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleModeChange = async (mode: LifeMode) => {
    if (mode === currentMode || isChanging) return;
    setIsChanging(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLifeModeWithNotification(mode);
    setCurrentMode(mode);
    if (onModeChange) onModeChange(mode);
    setIsChanging(false);
    setShowModeSelector(false);
  };

  const config = LIFE_MODES[currentMode];

  // Reassurance messages - calm, confident, human
  const getReassurance = () => {
    if (!isActive) return "Connecting to protection network...";

    switch (currentMode) {
      case "sleep":
        return "Rest easy. STEADY is watching over your portfolio.";
      case "focus":
        return "Focus on what matters. STEADY handles the rest.";
      case "growth":
        return "You're protected while you grow.";
      case "panic":
        return "Maximum protection active. You're safe.";
      default:
        return "STEADY is watching the market for you.";
    }
  };

  return (
    <div className="relative">
      {/* Main Hero Card - Clean, Calm, Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 p-8 md:p-12"
      >
        {/* Top Row: Heartbeat Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Pulsing dot */}
            <div className="relative">
              <motion.div
                className={`w-2.5 h-2.5 rounded-full ${
                  isActive ? "bg-green-400" : "bg-gray-500"
                }`}
                animate={
                  isActive ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400"
                  animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </div>
            <span
              className={`text-sm ${
                isActive ? "text-green-400" : "text-gray-500"
              }`}
            >
              {isActive ? "Monitoring active" : "Connecting..."}
            </span>
          </div>

          {isActive && (
            <span className="text-xs text-gray-500">
              Last check: {secondsSinceUpdate}s ago
            </span>
          )}
        </div>

        {/* Center: Life Mode Display - The Emotional Core */}
        <div className="text-center mb-8">
          {/* Mode Icon - Large, Clear */}
          <motion.div
            key={currentMode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl mb-4"
          >
            {config.emoji}
          </motion.div>

          {/* Mode Label */}
          <motion.h2
            key={`label-${currentMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-4xl font-bold mb-3 ${config.textColor}`}
          >
            {config.label}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            key={`tagline-${currentMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-6 font-medium"
          >
            "{config.tagline}"
          </motion.p>

          {/* Reassurance Line - The Calm Promise */}
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
            {getReassurance()}
          </p>
        </div>

        {/* Mode Change Button - Subtle, Not Loud */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModeSelector(!showModeSelector)}
            className="px-5 py-2.5 rounded-full bg-gray-800/60 border border-gray-700/50 
                       text-gray-300 text-sm hover:bg-gray-700/60 hover:border-gray-600/50 
                       transition-all duration-200"
          >
            {showModeSelector ? "Close" : "Change Life Mode"}
          </button>
        </div>

        {/* Mode Selector - Expandable, Clean */}
        {showModeSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-8 border-t border-gray-800/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(LIFE_MODES) as LifeMode[]).map((modeKey) => {
                const mode = LIFE_MODES[modeKey];
                const isSelected = currentMode === modeKey;

                return (
                  <button
                    key={modeKey}
                    onClick={() => handleModeChange(modeKey)}
                    disabled={isChanging}
                    className={`
                      p-4 rounded-xl text-center transition-all duration-200
                      ${
                        isSelected
                          ? `bg-${mode.color}-500/20 border-2 border-${mode.color}-500/50`
                          : "bg-gray-800/40 border border-gray-700/30 hover:bg-gray-700/40"
                      }
                      ${
                        isChanging
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    <span className="text-2xl block mb-2">{mode.emoji}</span>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? mode.textColor : "text-gray-300"
                      }`}
                    >
                      {mode.label.replace(" Mode", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
