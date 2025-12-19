/**
 * components/ReasoningPanel.tsx
 *
 * Terminal-style AI reasoning display
 * Shows "intelligent" system messages with typing animation
 * Creates the feeling of an autopilot monitoring the portfolio
 *
 * UPDATED: Now receives live messages from market monitoring loop
 * This is the "thinking voice" of STEADY
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onMarketEvent, type MarketEvent } from "@/lib/marketLoop";

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
  const messageIdRef = useRef(0);

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
      messageIdRef.current += 1;
      const newMessage: Message = {
        id: messageIdRef.current,
        text,
        type,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, newMessage].slice(-8)); // Keep last 8 messages
      setIsTyping(false);
    }, 300);
  };

  // Initial boot message - CALM, HUMAN, AND REASSURING
  useEffect(() => {
    addMessage("STEADY protection is now active and watching", "success");

    setTimeout(() => {
      addMessage("Connecting to market data...", "info");
    }, 1000);

    setTimeout(() => {
      addMessage(
        "Market connection established. Monitoring begins now.",
        "success"
      );
    }, 2000);

    setTimeout(() => {
      addMessage(
        "Evaluating current risk conditions. You can rest easy.",
        "info"
      );
    }, 3000);

    setTimeout(() => {
      addMessage(
        "Everything looks stable. No action needed at this time.",
        "info"
      );
    }, 4500);
  }, []);

  // React to mode changes - ALWAYS EXPLAIN WHY AND WHAT
  useEffect(() => {
    if (messages.length > 0) {
      // Skip initial render
      setTimeout(() => {
        // Mode-specific explanations that are CALM and HUMAN-FOCUSED
        const modeMessages = {
          Safe: {
            action: "Safety-first mode is now active",
            reasoning:
              "Your protection is set to maximum. Peace of mind is the priority.",
            context:
              "STEADY will act sooner to protect you from downside. You're safe.",
          },
          Balanced: {
            action: "Balanced mode is now active",
            reasoning:
              "You get growth potential with strong downside protection.",
            context:
              "STEADY watches for 10% losses before acting. Good for most situations.",
          },
          Growth: {
            action: "Growth mode is now active",
            reasoning:
              "You have more room to grow, but protection is still watching.",
            context:
              "STEADY gives you space for upside while still preventing major losses.",
          },
        };

        const msg = modeMessages[mode];
        addMessage(`Mode change: ${msg.action}`, "action");
        setTimeout(() => {
          addMessage(`WHY: ${msg.reasoning}`, "info");
        }, 600);
        setTimeout(() => {
          addMessage(`CONTEXT: ${msg.context}`, "info");
        }, 1200);
      }, 300);
    }
  }, [mode]);

  // React to protection trigger - CLEAR HUMAN EXPLANATION
  useEffect(() => {
    if (isProtectionTriggered) {
      addMessage(
        "⚠️ Protection triggered — your portfolio needs help",
        "warning"
      );
      setTimeout(() => {
        addMessage("Your value dropped beyond your comfort zone", "warning");
      }, 600);
      setTimeout(() => {
        addMessage("STEADY is stepping in to protect you right now", "action");
      }, 1200);
      setTimeout(() => {
        addMessage("Moving assets to safety to prevent more loss", "action");
      }, 1800);
      setTimeout(() => {
        addMessage(
          "Protection complete. Loss prevented. You're safe.",
          "success"
        );
      }, 2400);
    }
  }, [isProtectionTriggered]);

  // Subscribe to live market events from the monitoring loop
  useEffect(() => {
    const unsubscribe = onMarketEvent((event: MarketEvent) => {
      // Convert market event to reasoning message
      const messageType: Message["type"] =
        event.type === "critical"
          ? "warning"
          : event.type === "action"
          ? "action"
          : event.type === "warning"
          ? "warning"
          : "info";

      addMessage(event.message, messageType);
    });

    return unsubscribe;
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
