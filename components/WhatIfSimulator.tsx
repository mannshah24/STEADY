/**
 * components/WhatIfSimulator.tsx
 *
 * SECTION C Feature #1: Interactive crash scenario simulator
 *
 * WHY THIS EXISTS:
 * Users fear crashes but don't know how STEADY would help.
 * This lets them FEEL the protection by dragging a slider from 0% to -50%.
 *
 * EMOTIONAL COPY EXAMPLES:
 * "At -15%, STEADY would switch to Sleep Mode. You'd lose less."
 * "At -30%, STEADY would have saved you 12% compared to holding."
 *
 * This makes protection TANGIBLE instead of abstract.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getCurrentLifeMode, type LifeMode } from "@/lib/lifeModeEngine";

export default function WhatIfSimulator() {
  const [crashPercent, setCrashPercent] = useState(0);
  const currentMode = getCurrentLifeMode();

  // Calculate what STEADY would do at different crash levels
  const getSTEADYResponse = (
    crash: number
  ): {
    mode: LifeMode;
    description: string;
    savingsVsHolding: number;
  } => {
    const absCrash = Math.abs(crash);

    if (absCrash === 0) {
      return {
        mode: currentMode,
        description: "No action needed. Markets are stable.",
        savingsVsHolding: 0,
      };
    }

    if (absCrash <= 10) {
      return {
        mode: "focus",
        description:
          "At -" +
          absCrash +
          "%, STEADY would stay alert but hold steady. Minor volatility.",
        savingsVsHolding: absCrash * 0.2, // Save ~20% of the crash
      };
    }

    if (absCrash <= 20) {
      return {
        mode: "sleep",
        description:
          "At -" +
          absCrash +
          "%, STEADY would switch to Sleep Mode. You'd lose less.",
        savingsVsHolding: absCrash * 0.4, // Save ~40% of the crash
      };
    }

    if (absCrash <= 35) {
      return {
        mode: "panic",
        description:
          "At -" +
          absCrash +
          "%, STEADY would activate Panic Mode. Maximum protection engaged.",
        savingsVsHolding: absCrash * 0.6, // Save ~60% of the crash
      };
    }

    // Extreme crash (35-50%)
    return {
      mode: "panic",
      description:
        "At -" +
        absCrash +
        "%, STEADY would have activated Panic Mode immediately. Most of your value secured.",
      savingsVsHolding: absCrash * 0.7, // Save ~70% of the crash
    };
  };

  const response = getSTEADYResponse(crashPercent);

  // Calculate dollar values (assuming $10,000 portfolio for illustration)
  const portfolioValue = 10000;
  const lossWithoutSTEADY = portfolioValue * (Math.abs(crashPercent) / 100);
  const lossWithSTEADY =
    lossWithoutSTEADY *
    (1 - response.savingsVsHolding / Math.abs(crashPercent));
  const savedAmount = lossWithoutSTEADY - lossWithSTEADY;

  // Get color based on severity
  const getColor = () => {
    const abs = Math.abs(crashPercent);
    if (abs === 0) return "text-gray-400";
    if (abs <= 10) return "text-yellow-400";
    if (abs <= 20) return "text-orange-400";
    return "text-red-400";
  };

  const getModeColor = (mode: LifeMode) => {
    switch (mode) {
      case "sleep":
        return "text-blue-400";
      case "focus":
        return "text-purple-400";
      case "growth":
        return "text-green-400";
      case "panic":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📊</span>
          <h3 className="text-2xl font-bold text-white">What-If Simulator</h3>
        </div>
        <p className="text-sm text-gray-400">
          Drag the slider to see how STEADY would protect you in a crash
        </p>
      </div>

      {/* Crash Percentage Display */}
      <div className="mb-8 text-center">
        <motion.div
          key={crashPercent}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`text-6xl font-bold mb-2 ${getColor()}`}
        >
          {crashPercent}%
        </motion.div>
        <p className="text-gray-400 text-sm">
          {crashPercent === 0 ? "Markets stable" : `Market crash scenario`}
        </p>
      </div>

      {/* Interactive Slider */}
      <div className="mb-8">
        <input
          type="range"
          min="-50"
          max="0"
          value={crashPercent}
          onChange={(e) => setCrashPercent(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, 
              rgb(239, 68, 68) 0%, 
              rgb(249, 115, 22) 30%, 
              rgb(234, 179, 8) 70%, 
              rgb(156, 163, 175) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>-50% (Extreme Crash)</span>
          <span>-25%</span>
          <span>0% (No Change)</span>
        </div>
      </div>

      {/* STEADY Response */}
      {crashPercent < 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* What STEADY Would Do */}
          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3">
              What STEADY Would Do:
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                {response.mode === "panic"
                  ? "🚨"
                  : response.mode === "sleep"
                  ? "😴"
                  : "⚡"}
              </span>
              <div>
                <p
                  className={`text-xl font-bold ${getModeColor(response.mode)}`}
                >
                  Switch to{" "}
                  {response.mode.charAt(0).toUpperCase() +
                    response.mode.slice(1)}{" "}
                  Mode
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {response.description}
                </p>
              </div>
            </div>
          </div>

          {/* Savings Comparison */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Without STEADY */}
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-sm text-red-300 mb-2">Without STEADY</p>
              <p className="text-3xl font-bold text-red-400 mb-1">
                -${lossWithoutSTEADY.toFixed(0)}
              </p>
              <p className="text-xs text-gray-400">Full exposure to crash</p>
            </div>

            {/* With STEADY */}
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <p className="text-sm text-green-300 mb-2">With STEADY</p>
              <p className="text-3xl font-bold text-green-400 mb-1">
                -${lossWithSTEADY.toFixed(0)}
              </p>
              <p className="text-xs text-gray-400">Protected by life mode</p>
            </div>
          </div>

          {/* Amount Saved */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 rounded-2xl text-center"
          >
            <p className="text-sm text-gray-300 mb-2">STEADY Would Save You</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              ${savedAmount.toFixed(0)}
            </p>
            <p className="text-sm text-gray-400">
              {response.savingsVsHolding.toFixed(0)}% less loss compared to
              holding
            </p>
          </motion.div>

          {/* Explanation */}
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-cyan-400 font-semibold">How it works:</span>{" "}
              STEADY monitors market conditions continuously. When crashes
              happen, STEADY automatically shifts your portfolio to safer
              allocations based on your selected life mode. This happens while
              you sleep, work, or live your life. You lose less. That's the
              promise.
            </p>
          </div>
        </motion.div>
      )}

      {/* No crash scenario */}
      {crashPercent === 0 && (
        <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-2xl text-center">
          <span className="text-5xl mb-4 block">✅</span>
          <p className="text-gray-400">
            Drag the slider left to simulate a market crash
          </p>
        </div>
      )}

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid #06b6d4;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid #06b6d4;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
