/**
 * components/GuardianAlerts.tsx
 *
 * PHASE 4: ALERTS THAT TALK LIKE A GUARDIAN
 *
 * PURPOSE:
 * This is NOT a boring activity log.
 * This is STEADY speaking directly to you like a calm, protective advisor.
 *
 * LANGUAGE RULES:
 * - Human, never robotic
 * - Always reassuring
 * - Never silent (show "all clear" messages)
 * - Calm even during volatility
 *
 * EXAMPLES:
 * ✅ "Market calm. No action needed. You're safe."
 * ✅ "Volatility rising. Monitoring closely."
 * ❌ "SOL price dropped 3.2%"
 * ❌ "Alert triggered at 14:23:41"
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAlerts, onNewAlert, type Alert } from "@/lib/alertEngine";

export default function GuardianAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Load existing alerts
    setAlerts(getAlerts().slice(0, 5)); // Show first 5 (newest)

    // Subscribe to new alerts
    const unsubscribe = onNewAlert((alert: Alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 4)]);
    });

    return unsubscribe;
  }, []);

  // Add default "all clear" message if no alerts
  useEffect(() => {
    if (alerts.length === 0) {
      const timer = setTimeout(() => {
        setAlerts([
          {
            id: "default-1",
            timestamp: Date.now(),
            type: "info",
            message: "Market calm. No action needed. You're safe.",
            read: false,
          },
        ]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alerts.length]);

  // Convert alert to human language if needed
  const getHumanMessage = (alert: Alert): string => {
    // Alert already has human message
    return alert.message || "STEADY is watching the market for you.";
  };

  const getAlertIcon = (type: string): string => {
    switch (type) {
      case "action":
        return "🛡️";
      case "critical":
        return "⚠️";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "✓";
    }
  };

  const getAlertColor = (type: string): string => {
    switch (type) {
      case "action":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "critical":
        return "text-orange-400 border-orange-500/30 bg-orange-500/10";
      case "warning":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      default:
        return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    }
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Guardian Messages
        </h3>
        <span className="text-xs text-gray-500">STEADY is always watching</span>
      </div>

      <AnimatePresence mode="popLayout">
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 text-sm"
          >
            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💤</span>
            </div>
            Initializing protection system...
          </motion.div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id || index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border ${getAlertColor(
                alert.type
              )} backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{getAlertIcon(alert.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200">
                    {getHumanMessage(alert)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
