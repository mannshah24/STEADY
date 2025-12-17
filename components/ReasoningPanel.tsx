/**
 * components/ReasoningPanel.tsx
 *
 * Terminal-style AI reasoning display
 * Shows "intelligent" system messages with typing animation
 * Creates the feeling of an autopilot monitoring the portfolio
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  type: "info" | "warning" | "success" | "action";
  timestamp: string;
}

interface Props {
  mode: "Safe" | "Balanced" | "Growth";
  isProtectionTriggered?: boolean;
  onEvent?: (event: string) => void;
}

export default function ReasoningPanel({
  mode,
  isProtectionTriggered,
  onEvent,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  // Generate timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Add new message with typing effect
  const addMessage = (text: string, type: Message["type"]) => {
    setIsTyping(true);

    setTimeout(() => {
      setMessageIdCounter((prev) => prev + 1);
      const newMessage: Message = {
        id: Date.now() + messageIdCounter,
        text,
        type,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, newMessage].slice(-8)); // Keep last 8 messages
      setIsTyping(false);
    }, 300);
  };

  // Initial boot message
  useEffect(() => {
    addMessage("STEADY Autopilot System v1.0 initialized", "success");

    setTimeout(() => {
      addMessage("Connecting to Solana Devnet...", "info");
    }, 1000);

    setTimeout(() => {
      addMessage("Portfolio monitoring active", "success");
    }, 2000);
  }, []);

  // React to mode changes
  useEffect(() => {
    if (messages.length > 0) {
      // Skip initial render
      setTimeout(() => {
        const modeMessages = {
          Safe: "Conservative strategy activated - Capital preservation priority",
          Balanced: "Balanced strategy activated - Moderate risk/reward ratio",
          Growth:
            "Aggressive growth strategy activated - Maximum upside potential",
        };

        addMessage(`Mode change detected: ${mode}`, "action");
        setTimeout(() => {
          addMessage(modeMessages[mode], "info");
        }, 500);
      }, 300);
    }
  }, [mode]);

  // React to protection trigger
  useEffect(() => {
    if (isProtectionTriggered) {
      addMessage("⚠️ ALERT: Drawdown threshold reached", "warning");
      setTimeout(() => {
        addMessage("Executing downside protection protocol...", "action");
      }, 800);
      setTimeout(() => {
        addMessage("Portfolio rebalanced to Safe Mode", "success");
      }, 1600);
    }
  }, [isProtectionTriggered]);

  // Periodic monitoring messages
  useEffect(() => {
    const interval = setInterval(() => {
      const monitoringMessages = [
        "Scanning market volatility...",
        "Calculating drawdown metrics...",
        "Monitoring portfolio health...",
        "Checking risk parameters...",
        "Analyzing asset allocation...",
      ];

      const randomMessage =
        monitoringMessages[
          Math.floor(Math.random() * monitoringMessages.length)
        ];
      addMessage(randomMessage, "info");
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getMessageColor = (type: Message["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-orange-400";
      case "action":
        return "text-cyan-400";
      default:
        return "text-gray-400";
    }
  };

  const getMessagePrefix = (type: Message["type"]) => {
    switch (type) {
      case "success":
        return "[OK]";
      case "warning":
        return "[WARN]";
      case "action":
        return "[EXEC]";
      default:
        return "[INFO]";
    }
  };

  return (
    <div className="border border-green-500/30 rounded-xl bg-black overflow-hidden">
      {/* Terminal Header */}
      <div className="px-4 py-2 bg-gradient-to-r from-green-900/30 to-blue-900/30 border-b border-green-500/30 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-green-400 text-sm font-mono ml-2">
          steady@autopilot:~$ monitor
        </span>
      </div>

      {/* Terminal Body */}
      <div className="p-4 h-80 overflow-y-auto font-mono text-sm">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mb-2 flex items-start gap-2"
            >
              <span className="text-gray-600 text-xs shrink-0">
                [{message.timestamp}]
              </span>
              <span className={`${getMessageColor(message.type)} shrink-0`}>
                {getMessagePrefix(message.type)}
              </span>
              <span className={getMessageColor(message.type)}>
                {message.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cursor */}
        {isTyping && (
          <motion.div
            className="inline-block w-2 h-4 bg-green-400 ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Blinking Cursor when idle */}
        {!isTyping && (
          <motion.span
            className="inline-block w-2 h-4 bg-green-400/50"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-green-900/20 border-t border-green-500/30 flex items-center justify-between text-xs font-mono">
        <span className="text-green-400">
          STATUS: <span className="text-green-300">MONITORING</span>
        </span>
        <span className="text-green-400">
          MODE: <span className="text-cyan-300">{mode.toUpperCase()}</span>
        </span>
        <span className="text-green-400">
          NETWORK: <span className="text-purple-300">DEVNET</span>
        </span>
      </div>
    </div>
  );
}
