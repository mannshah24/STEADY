"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { setLifeModeWithNotification, type LifeMode } from "@/lib/lifeModeEngine";

interface Props {
  currentMode: LifeMode;
  onModeChange: (mode: LifeMode) => void;
}

export default function PanicButton({ currentMode, onModeChange }: Props) {
  const wallet = useWallet();
  const { publicKey } = wallet;
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
      setLifeModeWithNotification("panic");
      onModeChange("panic");
      setShowConfirm(false);
      alert("✅ Panic mode activated! Maximum protection enabled.");
    } catch (err) {
      console.error("Panic mode error:", err);
      alert("Failed to activate panic mode. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

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
    <div>
      <motion.div
        className="rounded-xl p-5 bg-gray-900/40 border border-gray-800/40 hover:border-red-500/30 transition-colors"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
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

          <motion.button
            onClick={() => setShowConfirm(true)}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExecuting ? "Activating..." : "Activate Panic Mode"}
          </motion.button>
        </div>
      </motion.div>

      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[9999] flex items-center justify-center p-4"
          onClick={() => !isExecuting && setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🚨
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-white mb-6"
              >
                Activate Panic Mode?
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-gray-300 mb-4"
              >
                Maximum protection. Immediate action.
              </motion.p>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-400"
              >
                Everything will be secured in the next evaluation cycle.
              </motion.p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isExecuting}
                className="flex-1 py-6 px-8 rounded-2xl font-bold text-xl bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-all border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePanicMode}
                disabled={isExecuting}
                className="flex-1 py-6 px-8 rounded-2xl font-bold text-xl bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 disabled:opacity-50 transition-all shadow-[0_0_40px_rgba(239,68,68,0.4)] border border-red-500/50"
              >
                {isExecuting ? "ACTIVATING..." : "YES, PROTECT NOW"}
              </button>
            </motion.div>

            {isExecuting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-green-500/20 border-2 border-green-500/50 rounded-2xl"
              >
                <p className="text-center text-2xl font-bold text-green-400">
                  Protection engaged. You're safe now.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
