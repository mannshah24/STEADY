/**
 * lib/anchor.ts
 * 
 * Manual Solana program interaction utilities
 * Builds transactions manually to avoid Anchor client issues
 */

import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { connection, PROGRAM_ID } from "./solana";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import type { WalletContextState } from "@solana/wallet-adapter-react";

/**
 * Convert wallet-adapter wallet to AnchorWallet
 */
export function toAnchorWallet(wallet: WalletContextState): AnchorWallet | null {
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    return null;
  }
  
  return {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction.bind(wallet),
    signAllTransactions: wallet.signAllTransactions.bind(wallet),
  };
}

/**
 * Investment modes matching the on-chain enum
 */
export enum InvestmentMode {
  Safe = "Safe",
  Balanced = "Balanced",
  Growth = "Growth",
}

/**
 * Portfolio account structure
 */
export interface Portfolio {
  owner: PublicKey;
  lastPeakValue: number;
  currentMode: InvestmentMode;
  bump: number;
}

/**
 * Calculate Anchor instruction discriminator
 * Anchor uses: sha256("global:<snake_case_name>")[..8]
 */
function getDiscriminator(name: string): Buffer {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(`global:${name}`);
  return hash.digest().slice(0, 8);
}

/**
 * Instruction discriminators
 * Calculated from instruction names in snake_case
 */
const INSTRUCTION_DISCRIMINATORS = {
  initializePortfolio: getDiscriminator("initialize_portfolio"),
  updateMode: getDiscriminator("update_mode"),
  checkAndProtectDownside: getDiscriminator("check_and_protect_downside"),
};

/**
 * Initialize a new portfolio for the connected wallet
 */
export async function initializePortfolio(wallet: AnchorWallet): Promise<string> {
  const [portfolioPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Build instruction manually
  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: portfolioPDA, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    // Instruction data is just the discriminator (no args)
    data: INSTRUCTION_DISCRIMINATORS.initializePortfolio,
  });

  // Build and send transaction with fresh blockhash
  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  
  // Get fresh blockhash with finalized commitment for reliability
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'finalized',
  });
  
  // Wait for confirmation with timeout
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  }, 'confirmed');

  return signature;
}

/**
 * Update investment mode
 */
export async function updateMode(
  wallet: AnchorWallet,
  newMode: InvestmentMode
): Promise<string> {
  const [portfolioPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Encode the mode enum (0 = Safe, 1 = Balanced, 2 = Growth)
  const modeIndex = newMode === InvestmentMode.Safe ? 0 : 
                     newMode === InvestmentMode.Balanced ? 1 : 2;
  
  // Instruction data: discriminator + mode enum index (1 byte)
  const data = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.updateMode,
    Buffer.from([modeIndex])
  ]);

  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: portfolioPDA, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    data,
  });

  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  
  // Get fresh blockhash with finalized commitment
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'finalized',
  });
  
  // Wait for confirmation with timeout
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  }, 'confirmed');

  return signature;
}

/**
 * Check and trigger downside protection
 */
export async function checkAndProtectDownside(
  wallet: AnchorWallet,
  currentValue: number
): Promise<string> {
  const [portfolioPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Encode u64 value (8 bytes, little-endian)
  const valueBuffer = Buffer.alloc(8);
  valueBuffer.writeBigUInt64LE(BigInt(currentValue));

  // Instruction data: discriminator + u64 value
  const data = Buffer.concat([
    INSTRUCTION_DISCRIMINATORS.checkAndProtectDownside,
    valueBuffer
  ]);

  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: portfolioPDA, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    data,
  });

  const transaction = new Transaction().add(instruction);
  transaction.feePayer = wallet.publicKey;
  
  // Get fresh blockhash with finalized commitment
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash;

  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'finalized',
  });
  
  // Wait for confirmation with timeout
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  }, 'confirmed');

  return signature;
}

/**
 * Fetch portfolio account data
 */
export async function fetchPortfolio(
  wallet: AnchorWallet
): Promise<Portfolio | null> {
  try {
    const [portfolioPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const accountInfo = await connection.getAccountInfo(portfolioPDA);
    if (!accountInfo) {
      return null;
    }

    // Deserialize account data manually
    // Layout: 8-byte discriminator + 32-byte owner + 8-byte lastPeakValue + 1-byte mode + 1-byte bump
    const data = accountInfo.data;
    
    // Skip 8-byte discriminator
    const owner = new PublicKey(data.slice(8, 40));
    const lastPeakValue = Number(data.readBigUInt64LE(40));
    const modeIndex = data.readUInt8(48);
    const bump = data.readUInt8(49);

    const mode = modeIndex === 0 ? InvestmentMode.Safe :
                 modeIndex === 1 ? InvestmentMode.Balanced :
                 InvestmentMode.Growth;

    return {
      owner,
      lastPeakValue,
      currentMode: mode,
      bump,
    };
  } catch (error) {
    console.error("Portfolio not found:", error);
    return null;
  }
}

/**
 * Listen to downside protection events
 * Note: Event parsing would require implementing Anchor's event parsing logic
 * For now, this is a placeholder that monitors account changes
 */
export function subscribeToProtectionEvents(
  wallet: AnchorWallet,
  callback: (event: any) => void
) {
  const [portfolioPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Subscribe to account changes
  const subscriptionId = connection.onAccountChange(
    portfolioPDA,
    (accountInfo) => {
      // Simple account change notification
      console.log("Portfolio account updated");
      callback({ accountInfo });
    },
    "confirmed"
  );

  return () => {
    connection.removeAccountChangeListener(subscriptionId);
  };
}
