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
import PanicButton from "@/components/PanicButton";
import PortfolioCard from "@/components/PortfolioCard";
import ActivationFlow from "@/components/ActivationFlow";
import HeartbeatMonitor from "@/components/HeartbeatMonitor";
import GuardianAlerts from "@/components/GuardianAlerts";
import ReasoningStream from "@/components/ReasoningStream";
import WhySteadyExists from "@/components/WhySteadyExists";
import NonCustodialProof from "@/components/NonCustodialProof";
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
        MAIN CONTENT - LIVING GUARDIAN ARCHITECTURE
        ================================================================
        
        DESIGN PHILOSOPHY:
        STEADY must feel ALIVE, not static.
        It must feel like a GUARDIAN, not a dashboard.
        It must build TRUST through transparency.
        It must communicate in HUMAN language.
        
        HIERARCHY:
        PRIMARY - Always visible, emotional, reassuring
        SECONDARY - Quick-glance information cards
        TERTIARY - Deep-dive expandable sections
      */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* 
          ================================================================
          PRIMARY LAYER: Living System Status
          
          PHASE 2: HEARTBEAT - Shows STEADY is alive and watching
          WHY: Builds trust. Makes platform feel like active guardian.
          ================================================================
        */}
        <section className="mb-8">
          <HeartbeatMonitor />
        </section>

        {/* 
          ================================================================
          PRIMARY LAYER: Life Mode + Portfolio + Protection
          
          PHASE 3: Life Modes feel human and unavoidable
          WHY: This is THE core value prop. Life-aware protection.
          ================================================================
        */}
        <section id="protection" className="mb-12 scroll-mt-24">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* LEFT: Life Mode Section (3/5 width) */}
            <div className="lg:col-span-3 space-y-6">
              <HeroStatus onModeChange={setCurrentMode} />
            </div>

            {/* RIGHT: Portfolio + Panic Button (2/5 width) */}
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
          SECONDARY LAYER: Guardian Intelligence
          
          PHASE 4 & 5: Alerts + Reasoning
          WHY: Shows what STEADY sees and thinks. Builds psychological trust.
          ================================================================
        */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* PHASE 4: Guardian Alerts */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <GuardianAlerts />
            </div>

            {/* PHASE 5: Reasoning Stream */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <ReasoningStream />
            </div>
          </div>
        </section>

        {/* 
          ================================================================
          TERTIARY LAYER: Trust & Education
          
          PHASE 7: Competition Crushers
          WHY: Establishes STEADY as inevitable, not experimental
          ================================================================
        */}
        <section className="mb-12 space-y-12">
          {/* Why STEADY Exists */}
          <WhySteadyExists />

          {/* Non-Custodial Proof */}
          <NonCustodialProof />
        </section>
      </main>

      {/* 
        FOOTER: Professional, Trustworthy, Human
      */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              STEADY
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A life-aware, non-custodial crypto protection platform that
              protects users when they're asleep, busy, emotional, or offline.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span>Non-custodial protection</span>
              <span>•</span>
              <span>Always transparent</span>
              <span>•</span>
              <span>Built on Solana</span>
            </div>
            <p className="text-xs text-gray-600 max-w-lg mx-auto pt-4 border-t border-gray-800/50 mt-6">
              STEADY reduces downside risk. It does not guarantee profits.
              Crypto is inherently volatile. Invest responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
