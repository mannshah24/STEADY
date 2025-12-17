/**
 * lib/constants.ts
 * 
 * Constants and configuration for STEADY
 * Responsibilities:
 * - Solana network configuration (devnet endpoints)
 * - Program IDs and addresses
 * - Investment mode parameters
 * - UI configuration (colors, thresholds)
 * - Token mint addresses
 */

import { PublicKey } from "@solana/web3.js";

// ============================================================================
// Network Configuration
// ============================================================================

export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

// TODO: Replace with actual deployed program ID after `anchor deploy`
export const STEADY_PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111" // Placeholder
);

// ============================================================================
// Token Addresses (Devnet)
// ============================================================================

export const TOKEN_MINTS = {
  SOL: "So11111111111111111111111111111111111111112", // Wrapped SOL
  USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC
  // TODO: Add other token mints as needed
};

// ============================================================================
// Investment Modes Configuration
// ============================================================================

export const INVESTMENT_MODES = {
  CONSERVATIVE: {
    id: 0,
    name: "Conservative",
    stopLossPercentage: 5, // 5% stop-loss
    rebalanceIntervalDays: 1, // Daily rebalancing
    riskScore: 1,
  },
  BALANCED: {
    id: 1,
    name: "Balanced",
    stopLossPercentage: 10, // 10% stop-loss
    rebalanceIntervalDays: 7, // Weekly rebalancing
    riskScore: 2,
  },
  AGGRESSIVE: {
    id: 2,
    name: "Aggressive",
    stopLossPercentage: 15, // 15% stop-loss
    rebalanceIntervalDays: 14, // Bi-weekly rebalancing
    riskScore: 3,
  },
};

// ============================================================================
// Program Account Seeds
// ============================================================================

export const SEEDS = {
  VAULT: "vault",
  USER_ACCOUNT: "user_account",
  AUTHORITY: "authority",
};

// ============================================================================
// UI Configuration
// ============================================================================

export const NEON_COLORS = {
  pink: "#FF006E",
  blue: "#00D9FF",
  green: "#39FF14",
  purple: "#BF40BF",
  orange: "#FF6B35",
};

export const TRANSACTION_CONFIRMATION_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// Pyth Price Feeds (Devnet)
// ============================================================================

export const PYTH_PRICE_FEEDS = {
  SOL_USD: new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"), // SOL/USD on devnet
  // TODO: Add more price feeds as needed
};

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURE_FLAGS = {
  ENABLE_AUTOPILOT: true,
  ENABLE_DOWNSIDE_PROTECTION: true,
  ENABLE_NOTIFICATIONS: false, // Future feature
};
