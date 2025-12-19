/**
 * components/TransparencyPanel.tsx
 *
 * NON-CUSTODIAL TRANSPARENCY PANEL
 *
 * PURPOSE:
 * Prove to users that STEADY is truly non-custodial.
 * Show exactly what's happening on-chain.
 * Build trust through radical transparency.
 *
 * DISPLAYS:
 * - Smart contract Program ID (verifiable on Solana Explorer)
 * - User's Portfolio PDA (Program Derived Address)
 * - Recent transaction history with Explorer links
 * - Current on-chain state
 *
 * TONE:
 * Technical but accessible. Facts, not marketing.
 * "Don't trust, verify."
 */

"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import { STEADY_PROGRAM_ID } from "@/lib/constants";

interface TransactionRecord {
  signature: string;
  timestamp: Date;
  type: string;
}

export default function TransparencyPanel() {
  const { publicKey, connected } = useWallet();
  const [portfolioPDA, setPortfolioPDA] = useState<string | null>(null);
  const [recentTxs, setRecentTxs] = useState<TransactionRecord[]>([]);

  // Calculate user's Portfolio PDA
  useEffect(() => {
    if (publicKey) {
      try {
        const programId = new PublicKey(STEADY_PROGRAM_ID);
        const [pda] = PublicKey.findProgramAddressSync(
          [Buffer.from("portfolio"), publicKey.toBuffer()],
          programId
        );
        setPortfolioPDA(pda.toBase58());
      } catch (error) {
        console.error("[TransparencyPanel] Failed to derive PDA:", error);
      }
    } else {
      setPortfolioPDA(null);
    }
  }, [publicKey]);

  // Load recent transactions from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("steady_transactions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentTxs(
          parsed.map((tx: any) => ({
            ...tx,
            timestamp: new Date(tx.timestamp),
          }))
        );
      } catch (error) {
        console.error(
          "[TransparencyPanel] Failed to parse transactions:",
          error
        );
      }
    }
  }, []);

  const openExplorer = (address: string, type: "address" | "tx") => {
    const baseUrl = "https://explorer.solana.com";
    const cluster = "devnet";
    const url =
      type === "address"
        ? `${baseUrl}/address/${address}?cluster=${cluster}`
        : `${baseUrl}/tx/${address}?cluster=${cluster}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <span className="text-3xl">🔒</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">
            Non-Custodial Proof
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your funds never leave your wallet. Here's the cryptographic proof.
            Every detail is verifiable on Solana blockchain.
          </p>
        </div>
      </div>

      {/* Program ID */}
      <div className="mb-4 p-4 rounded-lg bg-black/40 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Smart Contract Program ID
          </p>
          <button
            onClick={() =>
              openExplorer(
                typeof STEADY_PROGRAM_ID === "string"
                  ? STEADY_PROGRAM_ID
                  : STEADY_PROGRAM_ID.toBase58(),
                "address"
              )
            }
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View on Explorer →
          </button>
        </div>
        <p className="text-white font-mono text-xs break-all">
          {typeof STEADY_PROGRAM_ID === "string"
            ? STEADY_PROGRAM_ID
            : STEADY_PROGRAM_ID.toBase58()}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Open-source Rust program deployed on Solana. Zero withdrawal
          permissions.
        </p>
      </div>

      {/* User's Portfolio PDA */}
      {connected && portfolioPDA ? (
        <div className="mb-4 p-4 rounded-lg bg-black/40 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Your Portfolio Account (PDA)
            </p>
            <button
              onClick={() => openExplorer(portfolioPDA, "address")}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View on Explorer →
            </button>
          </div>
          <p className="text-white font-mono text-xs break-all">
            {portfolioPDA}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Program Derived Address (PDA) — derived mathematically from your
            wallet. Stores your mode and peak value. Cannot hold or transfer
            funds.
          </p>
        </div>
      ) : (
        <div className="mb-4 p-4 rounded-lg bg-black/40 border border-gray-700/20">
          <p className="text-gray-500 text-sm text-center">
            Connect wallet to view your portfolio account
          </p>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/20">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
          Recent Transactions
        </p>

        {recentTxs.length > 0 ? (
          <div className="space-y-2">
            {recentTxs.slice(0, 5).map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-white text-xs font-mono truncate max-w-[200px]">
                    {tx.signature.slice(0, 20)}...
                  </p>
                  <p className="text-gray-500 text-xs">
                    {tx.type} • {tx.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => openExplorer(tx.signature, "tx")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No transactions yet. Activate STEADY to see your transaction
            history.
          </p>
        )}
      </div>

      {/* Trust Statement */}
      <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <div className="flex items-start gap-2">
          <span className="text-xl">✓</span>
          <div>
            <p className="text-cyan-300 text-sm font-semibold mb-1">
              Don't trust. Verify.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Click any Explorer link to verify on Solana blockchain. The smart
              contract source code is publicly available. STEADY has{" "}
              <span className="text-white font-semibold">zero ability</span> to
              withdraw, transfer, or access your funds. Mathematically
              impossible.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
