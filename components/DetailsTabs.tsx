/**
 * components/DetailsTabs.tsx
 *
 * TERTIARY UI LAYER - Collapsible Details Section
 *
 * PURPOSE:
 * Houses detailed information that users CAN access but doesn't
 * need to scream for attention. This keeps the main view calm
 * while preserving access to depth.
 *
 * DESIGN PHILOSOPHY:
 * - Default CLOSED to reduce visual noise
 * - Clean accordion pattern
 * - Smooth animations
 * - All functionality preserved, just tucked away
 *
 * Contains:
 * - Reasoning log
 * - Protection timeline
 * - Detailed alerts history
 * - Transparency/verification info
 * - FAQ & Clarity info
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReasoningPanel from "./ReasoningPanel";
import ProtectionTimeline from "./ProtectionTimeline";
import AlertsPanel from "./AlertsPanel";
import TransparencyPanel from "./TransparencyPanel";
import ProductClarityPanel from "./ProductClarityPanel";

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface Props {
  currentMode: "Safe" | "Balanced" | "Growth";
  currentValue: number;
}

export default function DetailsTabs({ currentMode, currentValue }: Props) {
  const [openTab, setOpenTab] = useState<string | null>(null);

  const tabs: TabConfig[] = [
    {
      id: "reasoning",
      label: "Activity Log",
      icon: "📋",
      description: "See what STEADY is thinking",
    },
    {
      id: "timeline",
      label: "Protection History",
      icon: "📈",
      description: "Your protection timeline",
    },
    {
      id: "transparency",
      label: "Verification",
      icon: "🔍",
      description: "On-chain proof & transparency",
    },
    {
      id: "faq",
      label: "About STEADY",
      icon: "❓",
      description: "How it works & FAQ",
    },
  ];

  const toggleTab = (tabId: string) => {
    setOpenTab(openTab === tabId ? null : tabId);
  };

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "reasoning":
        return (
          <div className="space-y-4">
            <ReasoningPanel mode={currentMode} />
            <AlertsPanel />
          </div>
        );
      case "timeline":
        return (
          <ProtectionTimeline mode={currentMode} currentValue={currentValue} />
        );
      case "transparency":
        return <TransparencyPanel />;
      case "faq":
        return <ProductClarityPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Section Header - Minimal */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm">Tap to explore details</p>
      </div>

      {/* Accordion Tabs */}
      {tabs.map((tab) => {
        const isOpen = openTab === tab.id;

        return (
          <div key={tab.id} className="overflow-hidden">
            {/* Tab Header - Clickable */}
            <button
              onClick={() => toggleTab(tab.id)}
              className={`
                w-full px-5 py-4 rounded-xl flex items-center justify-between
                transition-all duration-300 group
                ${
                  isOpen
                    ? "bg-gray-800/60 border border-purple-500/30"
                    : "bg-gray-900/40 border border-gray-800/50 hover:bg-gray-800/40 hover:border-gray-700/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  {tab.icon}
                </span>
                <div className="text-left">
                  <p
                    className={`font-medium ${
                      isOpen ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </p>
                  <p className="text-xs text-gray-500">{tab.description}</p>
                </div>
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            {/* Tab Content - Animated */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2">{renderTabContent(tab.id)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
