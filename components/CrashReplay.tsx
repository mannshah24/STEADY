/**
 * components/CrashReplay.tsx
 *
 * SECTION C - NEW EXCITING FEATURE #4
 *
 * PURPOSE:
 * Let users EXPERIENCE a crash scenario without risk.
 * MUST FEEL LIKE A STORY, not a boring simulation.
 *
 * EMOTIONAL IMPACT:
 * "Holy shit, STEADY actually works. I need this."
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addAlert } from "@/lib/alertEngine";

export default function CrashReplay() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const crashStory = [
    {
      time: "11:43 PM",
      event: "Market opens in Asia",
      price: "$210",
      status: "calm",
      message: "All systems normal. You're asleep.",
    },
    {
      time: "12:18 AM",
      event: "Sudden sell-off begins",
      price: "$198",
      status: "warning",
      message: "Price drops 5.7%. STEADY is watching.",
    },
    {
      time: "12:31 AM",
      event: "Panic selling accelerates",
      price: "$185",
      status: "critical",
      message: "12% drawdown detected. Protection threshold reached!",
    },
    {
      time: "12:32 AM",
      event: "STEADY ACTIVATES",
      price: "$184",
      status: "protected",
      message: "🛡️ Protection triggered! Converting to USDC now.",
    },
    {
      time: "12:33 AM",
      event: "Position secured",
      price: "$181",
      status: "safe",
      message: "✅ Portfolio locked at $4,500. You lost only 10%, not 18%.",
    },
    {
      time: "7:15 AM",
      event: "You wake up",
      price: "$176",
      status: "safe",
      message:
        "☕ Good morning. STEADY saved you $400 while you slept peacefully.",
    },
  ];

  const playCrashScenario = async () => {
    setIsPlaying(true);
    setStep(0);

    for (let i = 0; i < crashStory.length; i++) {
      setStep(i);

      // Add alert for each step
      const event = crashStory[i];
      if (event.status === "warning") {
        addAlert("warning", event.message);
      } else if (event.status === "critical") {
        addAlert("critical", event.message);
      } else if (event.status === "protected") {
        addAlert("action", event.message);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setIsPlaying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "calm":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "warning":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "critical":
        return "text-orange-400 border-orange-500/30 bg-orange-500/10";
      case "protected":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "safe":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">📖</span>
          <h2 className="text-2xl font-bold text-white">
            Crash Scenario Replay
          </h2>
        </div>
        <p className="text-gray-400">
          Experience how STEADY protects you during a real crash — without
          risking actual money.
        </p>
      </div>

      {/* Play Button */}
      {!isPlaying && step === 0 && (
        <motion.button
          onClick={playCrashScenario}
          className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 text-red-300 hover:border-red-500/60 hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ▶️ Replay a 12% Crash Scenario
        </motion.button>
      )}

      {/* Timeline Story */}
      <AnimatePresence mode="wait">
        {(isPlaying || step > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {crashStory.slice(0, step + 1).map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${getStatusColor(
                  event.status
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{event.time}</p>
                    <h4 className="text-base font-semibold text-white">
                      {event.event}
                    </h4>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      getStatusColor(event.status).split(" ")[0]
                    }`}
                  >
                    {event.price}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{event.message}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay Again */}
      {!isPlaying && step === crashStory.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
            <p className="text-center text-sm text-gray-200">
              <strong className="text-green-400">The Result:</strong> STEADY
              protected you while you slept. You lost only 10% instead of 18%.
              That's $400 saved in one night.
            </p>
          </div>
          <button
            onClick={() => {
              setStep(0);
              playCrashScenario();
            }}
            className="w-full py-3 px-6 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            🔄 Replay Scenario
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {isPlaying && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-cyan-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
          />
          <span>Story playing...</span>
        </div>
      )}
    </div>
  );
}
