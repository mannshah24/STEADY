/**
 * lib/solana.ts
 * 
 * Solana connection utilities for STEADY
 * 
 * NON-CUSTODIAL DESIGN:
 * - Users sign transactions with their own wallet (Phantom)
 * - Funds are controlled by user's private keys, not by STEADY
 * - Smart contract uses PDAs for program-controlled accounts
 * - Users can withdraw funds at any time
 */

import { Connection, PublicKey, Commitment } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

// ============================================================================
// Network Configuration
// ============================================================================

// Solana Devnet RPC endpoint
const DEVNET_RPC = "https://api.devnet.solana.com";

// Transaction confirmation commitment level
const COMMITMENT: Commitment = "confirmed";

// Deployed program ID
export const PROGRAM_ID = new PublicKey("5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc");

// ============================================================================
// Solana Connection
// ============================================================================

/**
 * Create and export Solana connection to Devnet
 * This connection is used for all on-chain interactions
 */
export const connection = new Connection(DEVNET_RPC, COMMITMENT);

// ============================================================================
// Anchor Provider Setup
// ============================================================================

/**
 * Create Anchor provider from Phantom wallet
 * 
 * The provider combines:
 * 1. Connection - RPC endpoint to Solana
 * 2. Wallet - User's Phantom wallet (signs transactions)
 * 3. Options - Commitment level for confirmations
 * 
 * NON-CUSTODIAL: The wallet passed here is the user's Phantom wallet.
 * Users sign all transactions themselves - we never have access to private keys.
 */
export function getProvider(wallet: any): AnchorProvider {
  return new AnchorProvider(connection, wallet, {
    commitment: COMMITMENT,
    preflightCommitment: COMMITMENT,
  });
}

// ============================================================================
// PDA Helpers (Program Derived Addresses)
// ============================================================================

/**
 * Derive Portfolio PDA for a user
 * 
 * PDAs are deterministic addresses controlled by the program.
 * Seeds: ["portfolio", user_pubkey]
 * 
 * This allows each user to have their own portfolio account
 * without needing to create a keypair.
 */
export function getPortfolioPDA(userPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("portfolio"), userPubkey.toBuffer()],
    PROGRAM_ID
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

/**
 * Get wallet SOL balance
 */
export async function getBalance(pubkey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(pubkey);
    return lamportsToSol(balance);
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return 0;
  }
}
