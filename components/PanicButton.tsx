/**
 * components/PanicButton.tsx
 *
 * Emergency Protection Button
 *
 * DESIGN: Calm but accessible. Not screaming for attention,
 * but clearly available when needed. A safety net, not an alarm.
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { updateMode, toAnchorWallet, InvestmentMode } from "@/lib/anchor";
import { setLifeModeWithNotification, type LifeMode } from "@/lib/lifeModeEngine";

interface Props {
  currentMode: LifeMode;
  onModeChange: (mode: LifeMode) => void;
}

export default function PanicButton({ currentMode, onModeChange }: Props) {
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;
  const { connection } = useConnection();
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePanicMode = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    if (currentMode === "panic") {
      alert("Already in Panic mode - maximum protection active!");
      return;
    }

    setIsExecuting(true);

    try {
      // Set panic mode using life mode engine
      setLifeModeWithNotification("panic");
      onModeChange("panic");
      setShowConfirm(false);

      // Show success feedback
      alert("✅ Panic mode activated! Maximum protection enabled.");
    } catch (err) {
      console.error("Panic mode error:", err);
      alert("Failed to activate panic mode. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  // Don't show if already in panic mode - show calm confirmation instead
  if (currentMode === "panic") {
    return (
      <div className="rounded-xl p-5 bg-gray-900/40 border border-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p className="text-sm text-gray-400">Maximum protection active</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Emergency Button - Calm but Clear */}
      <motion.div
        className="rounded-xl p-5 bg-gray-900/40 border border-gray-800/40 hover:border-red-500/30 transition-colors"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Content - Simplified, Calm */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="text-sm font-medium text-gray-300">
                Need immediate protection?
              </p>
              <p className="text-xs text-gray-500">
                Currently in {currentMode} mode
              </p>
            </div>
          </div>

          {/* Panic Button - Subdued until hovered */}
          <motion.button
            onClick={() => setShowConfirm(true)}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800/60 border border-gray-700/50 
                       text-gray-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 
                       transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExecuting ? "Activating..." : "Activate Panic Mode"}
          </motion.button>
        </div>
      </motion.div>

      {/* Confirmation Modal - Clean and Clear */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <span className="text-4xl mb-3 block">🚨</span>
              <h3 className="text-xl font-bold text-white mb-2">
                Activate Panic Mode?
              </h3>
              <p className="text-sm text-gray-400">
                This will switch to maximum protection immediately. Everything secured.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isExecuting}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePanicMode}
                disabled={isExecuting}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
              >
                {isExecuting ? "Protecting..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
