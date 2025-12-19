/**
 * app/page.tsx
 *
 * STEADY - Life-Aware Crypto Protection
 *
 * UI HIERARCHY (Decluttered & Calm):
 *
 * PRIMARY LAYER (Always visible, emotional, clear):
 *   - Hero Status: Life Mode + Heartbeat + Reassurance
 *
 * SECONDARY LAYER (Informational but quiet):
 *   - Status Cards: Portfolio value, Risk state, Recommendation
 *
 * TERTIARY LAYER (Tucked away, expandable):
 *   - Details Tabs: Activity log, Timeline, Transparency, FAQ
 *
 * DESIGN PHILOSOPHY:
 * STEADY should feel like a calm guardian, not a trading terminal.
 * Whitespace is intentional. Silence is valuable.
 * Every element earns its place on screen.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import HeroStatus from "@/components/HeroStatus";
import StatusCards from "@/components/StatusCards";
import DetailsTabs from "@/components/DetailsTabs";
import PanicButton from "@/components/PanicButton";
import PortfolioCard from "@/components/PortfolioCard";
import ActivationFlow from "@/components/ActivationFlow";
import { fetchPortfolio, toAnchorWallet } from "@/lib/anchor";
import { getBalance } from "@/lib/solana";
import { getSolUsdPrice } from "@/lib/pyth";
import { isSteadyActive } from "@/lib/steadyState";
import {
  startMarketLoop,
  stopMarketLoop,
  onMarketEvent,
} from "@/lib/marketLoop";
import { addAlert } from "@/lib/alertEngine";

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);

  // Check activation status on mount
  useEffect(() => {
    const activated = isSteadyActive();
    console.log("Checking activation status:", activated);
    setIsActivated(activated);

    // Listen for storage changes (when reset button is clicked in another component)
    const handleStorageChange = () => {
      const newStatus = isSteadyActive();
      console.log("Activation status changed:", newStatus);
      setIsActivated(newStatus);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event from reset button
    const handleReset = () => {
      console.log("Reset event received");
      setIsActivated(false);
    };

    window.addEventListener("steady-reset", handleReset);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("steady-reset", handleReset);
    };
  }, []);

  // If not activated, show activation flow (Stripe-style onboarding)
  if (!isActivated) {
    return <ActivationFlow />;
  }

  // If activated, show full dashboard
  return <ActivatedDashboard />;
}

function ActivatedDashboard() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;

  const [currentMode, setCurrentMode] = useState<
    "Safe" | "Balanced" | "Growth"
  >("Safe");
  const [currentValue, setCurrentValue] = useState(0);

  // Start market monitoring loop when activated
  useEffect(() => {
    if (isSteadyActive()) {
      startMarketLoop();
      const unsubscribe = onMarketEvent((event) => {
        addAlert(event.type, event.message, event.data);
      });
      return () => {
        stopMarketLoop();
        unsubscribe();
      };
    }
  }, []);

  // Track portfolio state
  useEffect(() => {
    if (!connected || !publicKey) return;

    const loadState = async () => {
      try {
        const solBalance = await getBalance(publicKey);
        const solPrice = await getSolUsdPrice();
        const totalValue = solBalance * (solPrice || 210);

        const anchorWallet = toAnchorWallet(wallet);
        const portfolioAccount = anchorWallet
          ? await fetchPortfolio(anchorWallet)
          : null;

        const mode = (portfolioAccount?.currentMode as any) || "Safe";
        setCurrentMode(mode);
        setCurrentValue(totalValue);
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    };

    loadState();
    const interval = setInterval(loadState, 5000);
    return () => clearInterval(interval);
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 
        BACKGROUND: Subtle, not distracting
        Reduced opacity for calmer feel
      */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* 
        ================================================================
        MAIN CONTENT - Three-Tier Visual Hierarchy
        ================================================================
      */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* 
          ================================================================
          PRIMARY LAYER: Life Mode + Portfolio Side-by-Side
          LEFT: Life Mode selector with heartbeat
          RIGHT: Portfolio card showing assets & market risk + Panic button below
          
          WHY: Life mode context on left, portfolio protection on right
          ================================================================
        */}
        <section id="protection" className="mb-12 scroll-mt-24">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* LEFT: Life Mode Section (3/5 width - 60%) */}
            <div className="lg:col-span-3 space-y-6">
              <HeroStatus />
            </div>

            {/* RIGHT: Portfolio + Panic Button (2/5 width - 40%) */}
            <div className="lg:col-span-2 space-y-6">
              <PortfolioCard />
              <PanicButton
                currentMode={currentMode}
                onModeChange={setCurrentMode}
              />
            </div>
          </div>
        </section>



        {/* 
          ================================================================
          TERTIARY LAYER: Expandable Details
          - Activity log & reasoning
          - Protection timeline
          - Transparency/verification
          - FAQ & about
          
          WHY: All functionality preserved but tucked away.
          Default CLOSED to reduce visual noise.
          Users who want depth can expand.
          ================================================================
        */}
        <section className="mb-16">
          <DetailsTabs currentMode={currentMode} currentValue={currentValue} />
        </section>
      </main>

      {/* 
        FOOTER: Minimal, calm, trustworthy
      */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/30">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="text-center space-y-3">
            <p className="text-xl font-semibold text-gray-300">STEADY</p>
            <p className="text-sm text-gray-500">
              Non-custodial protection • Always transparent • Built on Solana
            </p>
            <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
              STEADY reduces downside risk — it doesn't promise profits. Crypto
              is inherently risky. Invest responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
