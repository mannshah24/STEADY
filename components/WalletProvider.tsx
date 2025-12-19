/**
 * components/WalletProvider.tsx
 *
 * Solana Wallet Adapter Provider wrapper
 * Configures multi-wallet support with robust connection handling
 */

"use client";

import { useMemo, useCallback, useEffect, useState, FC, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletError } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Solana Devnet RPC endpoint with fallback
const DEVNET_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet");

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContextProvider: FC<WalletProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (prevents hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure multiple wallet adapters for better compatibility
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  // Comprehensive error handling
  const onError = useCallback((error: WalletError, adapter?: any) => {
    console.error("[Wallet Error]", error.name, error.message, adapter?.name);
    
    // Handle specific error types
    switch (error.name) {
      case "WalletNotReadyError":
        console.log(`[Wallet] ${adapter?.name || "Wallet"} not installed or not ready`);
        break;
      case "WalletConnectionError":
        console.log("[Wallet] Connection failed. Please try again.");
        // Clear any stale connection state
        if (typeof window !== "undefined") {
          localStorage.removeItem("walletName");
        }
        break;
      case "WalletDisconnectedError":
        console.log("[Wallet] Wallet disconnected");
        break;
      case "WalletSignTransactionError":
        console.log("[Wallet] Transaction signing failed or was rejected");
        break;
      case "WalletTimeoutError":
        console.log("[Wallet] Connection timeout. Please check your wallet.");
        break;
      default:
        // Only show generic error for unexpected issues
        if (error.message && !error.message.includes("User rejected")) {
          console.warn("[Wallet] Unexpected error:", error.message);
        }
    }
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider 
      endpoint={DEVNET_ENDPOINT}
      config={{
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      }}
    >
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={onError}
        localStorageKey="steady-wallet"
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
