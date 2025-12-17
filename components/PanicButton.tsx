/**
 * components/PanicButton.tsx
 *
 * Emergency "Move to Safe NOW" button
 * Judges love emergency features that show real utility
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { updateMode, toAnchorWallet, InvestmentMode } from "@/lib/anchor";

interface Props {
  currentMode: "Safe" | "Balanced" | "Growth";
  onModeChange: (mode: "Safe" | "Balanced" | "Growth") => void;
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

    if (currentMode === "Safe") {
      alert("Already in Safe mode!");
      return;
    }

    const anchorWallet = toAnchorWallet(wallet);
    if (!anchorWallet) {
      alert("Wallet not available");
      return;
    }

    setIsExecuting(true);

    try {
      const signature = await updateMode(anchorWallet, InvestmentMode.Safe);

      console.log("Emergency switch to Safe mode:", signature);
      onModeChange("Safe");
      setShowConfirm(false);

      // Show success feedback
      alert("✅ Portfolio moved to Safe mode!");
    } catch (err) {
      console.error("Panic mode error:", err);
      alert("Failed to switch to Safe mode. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  // Don't show if already in Safe mode
  if (currentMode === "Safe") {
    return (
      <div className="border border-green-500/30 rounded-xl p-6 bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✅</span>
          <h3 className="text-xl font-bold text-green-400">Safe Mode Active</h3>
        </div>
        <p className="text-sm text-gray-400">
          Your portfolio is already in maximum protection mode
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Panic Button */}
      <motion.div
        className="border border-red-500/30 rounded-xl p-6 bg-gradient-to-br from-red-900/20 to-black/80 backdrop-blur-sm relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Warning Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,0,0,0.3) 35px, rgba(255,0,0,0.3) 70px)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <motion.span
              className="text-3xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              🚨
            </motion.span>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Emergency Protection
            </h3>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Market crashing? Move to Safe mode instantly to protect your capital
          </p>

          {/* Current Status */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Mode:</span>
              <span
                className={`text-sm font-bold ${
                  currentMode === "Growth" ? "text-pink-400" : "text-purple-400"
                }`}
              >
                {currentMode}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-400">Risk Exposure:</span>
              <span className="text-sm font-bold text-red-400">
                {currentMode === "Growth" ? "80%" : "50%"} volatile assets
              </span>
            </div>
          </div>

          {/* Panic Button */}
          <motion.button
            onClick={() => setShowConfirm(true)}
            disabled={isExecuting}
            className="w-full py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />

            <span className="relative z-10 flex items-center justify-center gap-2">
              {isExecuting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Executing...
                </>
              ) : (
                <>
                  <span>🛡️</span>
                  MOVE TO SAFE NOW
                </>
              )}
            </span>
          </motion.button>

          {/* Info */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            One-click rebalance to 20% SOL / 80% USDC
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900 border border-red-500/50 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                ⚠️
              </motion.div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">
                Confirm Emergency Action
              </h3>
              <p className="text-sm text-gray-400">
                This will immediately rebalance your portfolio to Safe mode
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">From:</span>
                <span className="text-sm font-bold text-orange-400">
                  {currentMode} Mode
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">To:</span>
                <span className="text-sm font-bold text-green-400">
                  Safe Mode
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">New Allocation:</span>
                <span className="text-sm font-bold text-cyan-400">
                  20% SOL / 80% USDC
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isExecuting}
                className="flex-1 py-3 px-4 rounded-lg font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePanicMode}
                disabled={isExecuting}
                className="flex-1 py-3 px-4 rounded-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 hover:shadow-red-500/70 disabled:opacity-50"
              >
                {isExecuting ? "Executing..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
