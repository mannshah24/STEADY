/**
 * components/RebalanceAnimation.tsx
 *
 * 🚨 DOWNSIDE PROTECTION ANIMATION 🚨
 * The hackathon WOW moment - shows automatic protection triggering
 * When portfolio drops 10%, the system switches to Safe mode
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Allocation {
  sol: number;
  usdc: number;
}

export default function RebalanceAnimation() {
  const [isProtecting, setIsProtecting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "detecting" | "switching" | "complete"
  >("idle");

  // Before: Risky allocation (Growth mode)
  const beforeAllocation: Allocation = { sol: 80, usdc: 20 };

  // After: Safe allocation (Safe mode)
  const afterAllocation: Allocation = { sol: 30, usdc: 70 };

  // Trigger downside protection animation
  const triggerProtection = async () => {
    setIsProtecting(true);

    // Phase 1: Red flash + detection
    setShowFlash(true);
    setPhase("detecting");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowFlash(false);

    // Phase 2: Switching mode
    setPhase("switching");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Phase 3: Complete
    setPhase("complete");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset
    setIsProtecting(false);
    setPhase("idle");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Demo Trigger Button */}
      {!isProtecting && (
        <motion.button
          onClick={triggerProtection}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-5 rounded-xl transition-all mb-8 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          🚨 Simulate Downside Protection (Demo)
        </motion.button>
      )}

      {/* Red Flash Overlay - The WOW moment starts here */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="fixed inset-0 bg-red-600 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Animation Container */}
      <AnimatePresence mode="wait">
        {isProtecting && (
          <motion.div
            key="protection-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="border-2 border-red-500 rounded-2xl p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-[0_0_50px_rgba(239,68,68,0.4)] relative overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(239,68,68,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(239,68,68,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 80%, rgba(239,68,68,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(239,68,68,0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Alert Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                <span className="text-4xl">⚠️</span>
              </div>
            </motion.div>

            {/* Status Message */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              {phase === "detecting" && (
                <>
                  <h3 className="text-3xl font-bold text-red-400 mb-3">
                    Downside Detected!
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Portfolio dropped{" "}
                    <span className="text-red-400 font-bold">10%</span> from
                    peak
                  </p>
                </>
              )}

              {phase === "switching" && (
                <>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-3">
                    Activating Protection...
                  </h3>
                  <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
                    <span>Switching to</span>
                    <span className="text-green-400 font-bold">Safe Mode</span>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      🔄
                    </motion.span>
                  </p>
                </>
              )}

              {phase === "complete" && (
                <>
                  <h3 className="text-3xl font-bold text-green-400 mb-3">
                    ✅ Protected!
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Successfully switched to Safe Mode
                  </p>
                </>
              )}
            </motion.div>

            {/* Allocation Bars Animation */}
            <div className="space-y-6">
              {/* Before Label */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {phase === "detecting"
                    ? "Risky Allocation"
                    : phase === "complete"
                    ? "Previous"
                    : "Rebalancing..."}
                </span>
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {phase === "complete" ? "Protected" : "Target"}
                </span>
              </div>

              {/* SOL Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">SOL</span>
                  <motion.span
                    key={`sol-${phase}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-bold text-purple-400"
                  >
                    {phase === "idle" || phase === "detecting"
                      ? beforeAllocation.sol
                      : afterAllocation.sol}
                    %
                  </motion.span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${beforeAllocation.sol}%` }}
                    animate={{
                      width:
                        phase === "idle" || phase === "detecting"
                          ? `${beforeAllocation.sol}%`
                          : `${afterAllocation.sol}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  />
                </div>
              </div>

              {/* USDC Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">
                    USDC (Stablecoin)
                  </span>
                  <motion.span
                    key={`usdc-${phase}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-bold text-green-400"
                  >
                    {phase === "idle" || phase === "detecting"
                      ? beforeAllocation.usdc
                      : afterAllocation.usdc}
                    %
                  </motion.span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${beforeAllocation.usdc}%` }}
                    animate={{
                      width:
                        phase === "idle" || phase === "detecting"
                          ? `${beforeAllocation.usdc}%`
                          : `${afterAllocation.usdc}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                  />
                </div>
              </div>
            </div>

            {/* Protection Explanation */}
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-sm text-gray-300 text-center">
                  🛡️ Your capital is now protected with a stable USDC-heavy
                  allocation
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Box */}
      {!isProtecting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
        >
          <h4 className="text-lg font-bold text-cyan-400 mb-3">
            How Downside Protection Works:
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>System monitors your portfolio value continuously</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>
                If value drops 10% from peak → Automatic protection triggers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>
                Portfolio rebalances to Safe mode (more stablecoins, less
                volatile assets)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>All automatic - no manual intervention needed</span>
            </li>
          </ul>
        </motion.div>
      )}

      {/* TODO: Subscribe to Solana program events for real-time protection triggers */}
      {/* TODO: Listen for DownsideProtectionTriggered event from smart contract */}
      {/* TODO: Fetch actual allocation changes from on-chain data */}
    </div>
  );
}
