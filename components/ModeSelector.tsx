/**
 * components/ModeSelector.tsx
 *
 * Investment mode selection component for STEADY
 * Allows users to choose between Safe, Balanced, and Growth strategies
 * Triggers on-chain transaction to update mode in Solana program
 */

"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  updateMode,
  fetchPortfolio,
  InvestmentMode,
  toAnchorWallet,
} from "@/lib/anchor";

type Mode = "Safe" | "Balanced" | "Growth";

interface ModeConfig {
  id: Mode;
  name: string;
  color: string;
  borderColor: string;
  glowColor: string;
  icon: string;
  description: string;
  protection: string;
}

const MODES: ModeConfig[] = [
  {
    id: "Safe",
    name: "Safe Mode",
    color: "text-green-400",
    borderColor: "border-green-500",
    glowColor: "shadow-[0_0_20px_rgba(52,211,153,0.4)]",
    icon: "🛡️",
    description: "Maximum capital protection. Lowest risk, stable returns.",
    protection: "10% drawdown protection",
  },
  {
    id: "Balanced",
    name: "Balanced Mode",
    color: "text-blue-400",
    borderColor: "border-blue-500",
    glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    icon: "⚖️",
    description: "Balanced growth with moderate risk. Best for most users.",
    protection: "10% drawdown protection",
  },
  {
    id: "Growth",
    name: "Growth Mode",
    color: "text-pink-400",
    borderColor: "border-pink-500",
    glowColor: "shadow-[0_0_20px_rgba(236,72,153,0.4)]",
    icon: "🚀",
    description: "Aggressive growth strategy. Higher risk, higher rewards.",
    protection: "10% drawdown protection",
  },
];

export default function ModeSelector() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const [activeMode, setActiveMode] = useState<Mode>("Safe");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current mode from blockchain on load
  useEffect(() => {
    if (connected && publicKey) {
      const anchorWallet = toAnchorWallet(wallet);
      if (!anchorWallet) return;

      fetchPortfolio(anchorWallet)
        .then((portfolio) => {
          if (portfolio) {
            setActiveMode(portfolio.currentMode as Mode);
          }
        })
        .catch((error) => {
          // Portfolio doesn't exist yet - keep default mode
          console.log("Portfolio not initialized yet, using default mode");
        });
    }
  }, [connected, publicKey]);

  // Handle mode change with Solana transaction
  const handleModeChange = async (newMode: Mode) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const anchorWallet = toAnchorWallet(wallet);
    if (!anchorWallet) {
      alert("Wallet not ready. Please try again.");
      return;
    }

    if (activeMode === newMode) return;

    setIsUpdating(true);

    try {
      // Call Anchor program to update mode on-chain
      const tx = await updateMode(anchorWallet, newMode as InvestmentMode);
      console.log(`✅ Mode updated to ${newMode}. Transaction: ${tx}`);

      setActiveMode(newMode);
    } catch (error: any) {
      console.error("Failed to update mode:", error);

      // Check if portfolio needs to be initialized first
      if (error?.message?.includes("Account does not exist")) {
        alert(
          "Portfolio not initialized. Please initialize your portfolio first."
        );
      } else {
        alert(`Transaction failed: ${error?.message || "Unknown error"}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Choose Your Strategy
        </h2>
        <p className="text-gray-400">
          Select an investment mode. Protected by automatic 10% downside
          protection.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              disabled={isUpdating}
              className={`
                relative p-6 rounded-xl border-2 
                bg-black/50 backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:scale-105
                ${
                  isActive
                    ? `${mode.borderColor} ${mode.glowColor}`
                    : "border-gray-700 hover:border-gray-600"
                }
                ${
                  isUpdating
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-black">✓</span>
                </div>
              )}

              {/* Mode Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="text-5xl mb-3">{mode.icon}</div>

                {/* Name */}
                <h3 className={`text-xl font-bold mb-2 ${mode.color}`}>
                  {mode.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {mode.description}
                </p>

                {/* Protection Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700">
                  <span className="text-xs text-gray-300 font-medium">
                    {mode.protection}
                  </span>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Status Message */}
      {isUpdating && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-400 font-medium">
              Updating mode on Solana...
            </span>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          <span className="text-cyan-400 font-semibold">All modes</span> are
          protected by automatic downside protection. If your portfolio drops
          10% from its peak, the system automatically switches to Safe mode.
        </p>
      </div>
    </div>
  );
}
