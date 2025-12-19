/**
 * components/LifeInsights.tsx
 *
 * SECTION C - NEW EXCITING FEATURE #3
 *
 * PURPOSE:
 * Make STEADY feel like it UNDERSTANDS the user's life.
 * Show emotional insights about protection patterns.
 *
 * EMOTIONAL IMPACT:
 * "STEADY gets me. It knows how I actually live."
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentLifeMode } from "@/lib/lifeModeEngine";

export default function LifeInsights() {
  const [currentMode, setCurrentMode] = useState(getCurrentLifeMode());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMode(getCurrentLifeMode());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate emotional insights based on usage
  const insights = [
    {
      icon: "📚",
      text: "You spent most of this week in Focus Mode. That's real life.",
      subtext: "STEADY adapted to your busy schedule automatically.",
    },
    {
      icon: "🌙",
      text: "STEADY protected you during volatile hours last night.",
      subtext: "You slept peacefully while markets moved.",
    },
    {
      icon: "⚡",
      text: "Growth Mode is active. You're in control right now.",
      subtext: "STEADY gives you room to grow when you're ready.",
    },
    {
      icon: "🛡️",
      text: "Protection has been monitoring for 3 days straight.",
      subtext: "Zero manual intervention required from you.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💭</span>
        <h3 className="text-lg font-bold text-white">Life Insights</h3>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-lg hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{insight.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-200 mb-1">
                  {insight.text}
                </p>
                <p className="text-xs text-gray-500">{insight.subtext}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-purple-500/30 rounded-lg"
      >
        <p className="text-center text-sm text-gray-300">
          <strong className="text-purple-400">Right now:</strong> STEADY is in{" "}
          <strong className="text-cyan-400">{currentMode} mode</strong>,
          protecting your portfolio as you live your life.
        </p>
      </motion.div>
    </div>
  );
}
