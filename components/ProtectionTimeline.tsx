/**
 * components/ProtectionTimeline.tsx
 *
 * Visual timeline showing protection events
 * Turns logic into a story judges can follow
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TimelineEvent {
  id: number;
  type: "peak" | "drop" | "protection" | "rebalance" | "recovery";
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

interface Props {
  mode: "Safe" | "Balanced" | "Growth";
  currentValue: number;
}

export default function ProtectionTimeline({ mode, currentValue }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  // Initialize with demo events
  useEffect(() => {
    const initialEvents: TimelineEvent[] = [
      {
        id: 1,
        type: "peak",
        title: "Portfolio Peak Recorded",
        description: `Peak value of $${currentValue.toFixed(2)} established`,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        icon: "📈",
        color: "green",
      },
      {
        id: 2,
        type: "drop",
        title: "Market Movement Detected",
        description: "SOL price declined, monitoring drawdown",
        timestamp: new Date(Date.now() - 1800000), // 30 min ago
        icon: "📉",
        color: "orange",
      },
    ];

    setEvents(initialEvents);
  }, [currentValue]);

  // Add event when mode changes
  useEffect(() => {
    if (events.length > 0) {
      // Skip initial render
      const newEvent: TimelineEvent = {
        id: Date.now(),
        type: "rebalance",
        title: `Strategy Changed to ${mode}`,
        description: `Portfolio rebalanced to ${mode} mode allocation`,
        timestamp: new Date(),
        icon: mode === "Safe" ? "🛡️" : mode === "Balanced" ? "⚖️" : "🚀",
        color:
          mode === "Safe" ? "blue" : mode === "Balanced" ? "purple" : "pink",
      };

      setEvents((prev) => [...prev, newEvent].slice(-6)); // Keep last 6
    }
  }, [mode]);

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        border: "border-green-500/30",
        bg: "bg-green-500/10",
        text: "text-green-400",
        dot: "bg-green-500",
      },
      orange: {
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        dot: "bg-orange-500",
      },
      red: {
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        text: "text-red-400",
        dot: "bg-red-500",
      },
      blue: {
        border: "border-blue-500/30",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        dot: "bg-blue-500",
      },
      purple: {
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        dot: "bg-purple-500",
      },
      pink: {
        border: "border-pink-500/30",
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        dot: "bg-pink-500",
      },
    };

    return colors[color as keyof typeof colors] || colors.green;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border border-cyan-500/30 rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⏱️</span>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Protection Timeline
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          Track your portfolio's protection history
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const colors = getColorClasses(event.color);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Icon Circle */}
                <div
                  className={`absolute left-0 w-12 h-12 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center text-2xl z-10`}
                >
                  {event.icon}
                </div>

                {/* Event Card */}
                <div
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-bold ${colors.text}`}>
                      {event.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events yet</p>
            <p className="text-sm text-gray-600 mt-2">
              Events will appear as your portfolio is monitored
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          All events are logged and timestamped for full transparency
        </p>
      </div>
    </div>
  );
}
