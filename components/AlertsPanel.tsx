/**
 * components/AlertsPanel.tsx
 *
 * Activity Log - Part of TERTIARY UI Layer
 *
 * PURPOSE:
 * Shows recent activity in a calm, non-spammy way.
 * Used inside the collapsible details section.
 *
 * DESIGN:
 * - Minimal borders and decorations
 * - Easy to scan
 * - No alarming visuals unless truly critical
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

const MAX_VISIBLE_ALERTS = 8;

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
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No activity yet. Events will appear here as STEADY monitors.
        </p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <div className="space-y-2 max-h-72 overflow-y-auto">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30"
            >
              <span className="text-sm flex-shrink-0 opacity-70">
                {getAlertIcon(alert.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {alert.message}
                </p>
                <p
                  className="text-xs text-gray-600 mt-1"
                  key={timeUpdateTrigger}
                >
                  {formatAlertTime(alert.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
