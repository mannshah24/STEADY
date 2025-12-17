/**
 * components/WalletProvider.tsx
 *
 * Solana Wallet Adapter Provider wrapper
 * Configures Phantom wallet support for the entire app
 */

"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Solana Devnet RPC endpoint
const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Configure wallet adapters (Phantom only for MVP)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect
        onError={(error) => {
          // Suppress MetaMask detection errors
          if (error.message?.includes("MetaMask")) {
            return;
          }
          console.error("Wallet error:", error);
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
