/**
 * components/AlertsPanel.tsx
 *
 * STEADY Alerts Display Panel
 *
 * Purpose:
 * Shows recent alerts from the market monitoring loop.
 * Makes users feel informed without overwhelming them.
 *
 * Features:
 * - Shows last 10 alerts
 * - Color-coded by severity
 * - Timestamps
 * - Auto-scrolls to newest
 *
 * Tone: Clear, informative, not alarming
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAlerts,
  onNewAlert,
  getAlertIcon,
  getAlertColor,
  getAlertBgColor,
  formatAlertTime,
  type Alert,
} from "@/lib/alertEngine";

const MAX_VISIBLE_ALERTS = 10;

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load initial alerts
  useEffect(() => {
    setAlerts(getAlerts().slice(0, MAX_VISIBLE_ALERTS));
  }, []);

  // Subscribe to new alerts
  useEffect(() => {
    const unsubscribe = onNewAlert((newAlert: Alert) => {
      setAlerts((prev) => [newAlert, ...prev].slice(0, MAX_VISIBLE_ALERTS));
    });

    return unsubscribe;
  }, []);

  // Update relative timestamps every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdateTrigger((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-400">Activity Log</h2>
          <p className="text-gray-600 text-sm text-center py-8">
            No activity yet. Alerts will appear here once monitoring begins.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📢</span>
            <span>What STEADY is Thinking</span>
          </h2>
          <span className="text-xs text-gray-500">
            Recent activity
          </span>
        </div>

        <div
          ref={containerRef}
          className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border ${getAlertBgColor(
                  alert.type
                )} p-4`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <span className="text-xl flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed ${getAlertColor(
                        alert.type
                      )}`}
                    >
                      {alert.message}
                    </p>
                    <p
                      className="text-xs text-gray-600 mt-1"
                      key={timeUpdateTrigger}
                    >
                      {formatAlertTime(alert.timestamp)}
                    </p>
                  </div>

                  {/* Type badge */}
                  <span
                    className={`text-xs uppercase font-bold ${getAlertColor(
                      alert.type
                    )} flex-shrink-0`}
                  >
                    {alert.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary footer */}
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {alerts.filter((a) => a.type === "info").length} info •{" "}
                {alerts.filter((a) => a.type === "warning").length} warnings •{" "}
                {alerts.filter((a) => a.type === "critical").length} critical
              </span>
              <span>Updated continuously</span>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
