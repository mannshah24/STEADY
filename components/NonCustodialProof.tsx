/**
 * components/NonCustodialProof.tsx
 *
 * PHASE 7: COMPETITION CRUSHER - Trust Through Transparency
 *
 * PURPOSE:
 * Prove beyond doubt that STEADY never has custody.
 * Show the program, show the code, show the math.
 *
 * PSYCHOLOGICAL IMPACT:
 * - Eliminates "rug pull" fear
 * - Builds technical credibility
 * - Shows we have nothing to hide
 *
 * TARGET AUDIENCE:
 * - Skeptical users
 * - Technical evaluators
 * - Security-conscious investors
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NonCustodialProof() {
  const [copied, setCopied] = useState(false);

  const programId = "5VHQzWjXK9nrKKqyFqTZ5nSEcfjvdVVfp6jxQRvT3pXF"; // STEADY Solana Program ID

  const handleCopy = () => {
    navigator.clipboard.writeText(programId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const proofPoints = [
    {
      icon: "🔐",
      title: "Your keys, your crypto",
      description:
        "STEADY never touches your private keys. Ever. It's mathematically impossible for us to withdraw your funds.",
    },
    {
      icon: "📝",
      title: "Smart contract verified",
      description:
        "All logic runs on-chain via Solana program. No backend servers. No hidden code. Fully auditable.",
    },
    {
      icon: "🔍",
      title: "Open source architecture",
      description:
        "Every line of protection logic is visible. Check the code yourself. Verify the math.",
    },
    {
      icon: "⚡",
      title: "Non-custodial by design",
      description:
        "Protection happens through program-controlled swaps, not custody transfers. You stay in control.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-3"
        >
          Non-Custodial Confidence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          STEADY protects you, but never controls your funds. Here's the proof.
        </motion.p>
      </div>

      {/* Program ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-300">
            Solana Program ID
          </p>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 transition-colors"
          >
            {copied ? "Copied! ✓" : "Copy"}
          </button>
        </div>
        <code className="block w-full p-3 bg-black/40 rounded-lg text-cyan-400 text-xs font-mono break-all">
          {programId}
        </code>
        <div className="mt-3 flex gap-3">
          <a
            href={`https://explorer.solana.com/address/${programId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View on Solana Explorer →
          </a>
          <a
            href="https://github.com/mannshah24/STEADY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            View Source Code →
          </a>
        </div>
      </motion.div>

      {/* Proof Points Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {proofPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl"
          >
            <div className="text-3xl mb-3">{point.icon}</div>
            <h3 className="text-base font-semibold text-white mb-2">
              {point.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {point.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Technical Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
          <span>✓</span>
          <span>How It Works (Non-Custodial)</span>
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            1. <strong>Your wallet</strong> signs transactions that interact
            with Jupiter aggregator
          </p>
          <p>
            2. <strong>STEADY program</strong> calculates optimal protection
            parameters
          </p>
          <p>
            3. <strong>Swaps execute</strong> through decentralized liquidity
            pools
          </p>
          <p>
            4. <strong>Assets remain</strong> in your wallet at all times
          </p>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          At no point do funds enter a STEADY-controlled address. The program is
          a coordinator, not a custodian.
        </p>
      </motion.div>
    </div>
  );
}
