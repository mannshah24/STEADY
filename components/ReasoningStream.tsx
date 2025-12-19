/**
 * components/ReasoningStream.tsx
 *
 * PHASE 5: REASONING PANEL (TRUST ENGINE)
 *
 * PURPOSE:
 * Show users "What STEADY is thinking" in real-time.
 * This creates psychological trust by revealing the decision-making process.
 *
 * DESIGN PHILOSOPHY:
 * - Like watching a guardian's thought process
 * - Calm, professional language
 * - Updates continuously
 * - Never alarming, always reassuring
 *
 * EXAMPLES:
 * "Evaluating price stability..."
 * "Checking volatility trend..."
 * "No action needed right now."
 * "Protection readiness confirmed."
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onMarketStateUpdate, type MarketState } from "@/lib/marketLoop";
import { getCurrentLifeMode } from "@/lib/lifeModeEngine";

interface ReasoningLog {
  id: string;
  timestamp: number;
  message: string;
  type: "evaluation" | "check" | "decision" | "confirmation";
}

export default function ReasoningStream() {
  const [logs, setLogs] = useState<ReasoningLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate reasoning logs based on market updates
  useEffect(() => {
    const unsubscribe = onMarketStateUpdate((state: MarketState) => {
      simulateReasoning(state);
    });
    return unsubscribe;
  }, []);

  const simulateReasoning = async (state: MarketState) => {
    setIsProcessing(true);

    // Add evaluation log
    addLog("Evaluating current market conditions...", "evaluation");
    await delay(800);

    // Price analysis
    const priceChange = Math.abs(state.priceChange);
    if (priceChange < 2) {
      addLog("Price stability confirmed. Market calm.", "check");
    } else if (priceChange < 5) {
      addLog(
        `Price movement: ${priceChange.toFixed(1)}%. Within normal range.`,
        "check"
      );
    } else {
      addLog(
        `Elevated price movement detected: ${priceChange.toFixed(1)}%`,
        "check"
      );
    }
    await delay(800);

    // Volatility analysis
    const volatilityPct = (state.volatility * 100).toFixed(1);
    addLog(
      `Volatility check: ${volatilityPct}% - ${state.riskLevel} risk`,
      "check"
    );
    await delay(800);

    // Life mode context
    const lifeMode = getCurrentLifeMode();
    addLog(`Life context: ${lifeMode} mode active`, "check");
    await delay(800);

    // Decision
    if (state.riskLevel === "critical" || state.riskLevel === "high") {
      addLog("Monitoring closely. Ready to protect if needed.", "decision");
    } else {
      addLog("No action required. Protection standing by.", "decision");
    }
    await delay(600);

    // Confirmation
    addLog("Protection readiness confirmed. ✓", "confirmation");

    setIsProcessing(false);
  };

  const addLog = (message: string, type: ReasoningLog["type"]) => {
    const newLog: ReasoningLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      message,
      type,
    };

    setLogs((prev) => {
      const updated = [...prev, newLog];
      // Keep last 8 logs
      return updated.slice(-8);
    });
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getLogIcon = (type: ReasoningLog["type"]): string => {
    switch (type) {
      case "evaluation":
        return "🔍";
      case "check":
        return "📊";
      case "decision":
        return "🧠";
      case "confirmation":
        return "✅";
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          What STEADY is Thinking
        </h3>
        {isProcessing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
          />
        )}
      </div>

      <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-500 text-sm"
            >
              <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🧠</span>
              </div>
              Waiting for first market evaluation...
            </motion.div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2 text-xs"
              >
                <span className="text-base flex-shrink-0 mt-0.5">
                  {getLogIcon(log.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 leading-relaxed">{log.message}</p>
                  <p className="text-gray-600 text-[10px] mt-0.5 font-mono">
                    {formatTime(log.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
}
