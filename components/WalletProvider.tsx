/**
 * components/WalletProvider.tsx
 *
 * Solana Wallet Adapter Provider wrapper
 * Configures Phantom wallet support for the entire app
 */

"use client";

import { useMemo, useCallback } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletError } from "@solana/wallet-adapter-base";

// Solana Devnet RPC endpoint
const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Configure wallet adapters (Phantom only for MVP)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Better error handling
  const onError = useCallback((error: WalletError) => {
    console.error("[Wallet Error]", error.name, error.message);
    // Don't show alerts for common non-critical errors
    if (error.name === "WalletNotReadyError") {
      console.log("[Wallet] Phantom not installed or not ready");
    }
  }, []);

  return (
    <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={onError}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
