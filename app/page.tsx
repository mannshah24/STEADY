/**
 * app/page.tsx
 *
 * STEADY - Risk Management Platform
 *
 * Dashboard Gating Logic:
 * - If not activated → show ActivationFlow
 * - If activated → show full dashboard with protection modules
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/Navbar";
import ModeSelector from "@/components/ModeSelector";
import PortfolioCard from "@/components/PortfolioCard";
import RebalanceAnimation from "@/components/RebalanceAnimation";
import InitializeButton from "@/components/InitializeButton";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import ReasoningPanel from "@/components/ReasoningPanel";
import ProtectionTimeline from "@/components/ProtectionTimeline";
import RiskMeter from "@/components/RiskMeter";
import PanicButton from "@/components/PanicButton";
import ActivationFlow from "@/components/ActivationFlow";
import PlatformModules from "@/components/PlatformModules";
import SteadyStatus from "@/components/SteadyStatus";
import AlertsPanel from "@/components/AlertsPanel";
import LifeModeSelector from "@/components/LifeModeSelector";
import TransparencyPanel from "@/components/TransparencyPanel";
import ProductClarityPanel from "@/components/ProductClarityPanel";
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
  const [peakValue, setPeakValue] = useState(0);
  const [allocation, setAllocation] = useState({ sol: 20, usdc: 80 });

  // Start market monitoring loop when activated
  useEffect(() => {
    if (isSteadyActive()) {
      console.log("[Dashboard] Starting market loop...");
      startMarketLoop();

      // Subscribe to market events and convert to alerts
      const unsubscribe = onMarketEvent((event) => {
        addAlert(event.type, event.message, event.data);
      });

      return () => {
        console.log("[Dashboard] Stopping market loop...");
        stopMarketLoop();
        unsubscribe();
      };
    }
  }, []);

  // Track portfolio state for all components
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
        setPeakValue(totalValue * 1.12); // Mock peak (12% above current)

        // Set allocation based on mode
        const newAllocation =
          mode === "Safe"
            ? { sol: 20, usdc: 80 }
            : mode === "Balanced"
            ? { sol: 50, usdc: 50 }
            : { sol: 80, usdc: 20 }; // Growth
        setAllocation(newAllocation);
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    };

    loadState();
    const interval = setInterval(loadState, 3000);
    return () => clearInterval(interval);
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px] animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center">
          {/* Logo/Title */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                <span className="text-4xl font-bold">S</span>
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              STEADY
            </h1>
          </div>

          {/* Tagline - EMOTIONAL VALUE PROMISE */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            <span className="text-cyan-400 font-bold">
              Protection that understands you have a life
            </span>
          </p>

          <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto font-medium">
            When you're asleep, busy, stressed, or just living your life.
          </p>

          <p className="text-base text-gray-500 mb-12 max-w-2xl mx-auto">
            STEADY watches the markets so you don't have to. Non-custodial. Always transparent.
          </p>

          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-1">10%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Protection Trigger
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-1">0%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Platform Fees
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-1">100%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Non-Custodial
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards - HUMAN-FOCUSED LANGUAGE */}
        <section id="features" className="container mx-auto px-4 mb-32">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl border border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-cyan-500/60 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">🌙</div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-400">
                Protection That Gets It
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Sleep Mode when you rest. Focus Mode when you're busy. Growth Mode when you're confident. Panic Mode for emergencies. Protection that understands you're human.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl border border-purple-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/60 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-400">
                No Black Boxes
              </h3>
              <p className="text-gray-400 leading-relaxed">
                STEADY explains every decision in human language. No silent moves. No surprises. You always know what's happening and why.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl border border-pink-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-pink-500/60 transition-all hover:shadow-[0_0_40px_rgba(236,72,153,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-pink-400">
                Your Keys, Always
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your crypto never leaves your wallet. STEADY can't access, withdraw, or touch your funds. Ever. It's mathematically impossible.
              </p>
            </div>
          </div>
        </section>

        {/* Initialize Portfolio Button (shown if needed) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-12"
        >
          <InitializeButton />
        </motion.section>

        {/* MAIN DASHBOARD - Grid Layout */}
        <section className="container mx-auto px-4 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Protection Dashboard
            </h2>
            <p className="text-gray-400 text-lg">
              Real-time monitoring and clear explanations, always
            </p>
          </motion.div>

          {/* Life Mode Selector - THE ICONIC FEATURE - MOST PROMINENT */}
          <div className="max-w-7xl mx-auto mb-8">
            <LifeModeSelector />
          </div>

          {/* Live Monitoring Status - HEARTBEAT - SHOWS STEADY IS ALIVE */}
          <div className="max-w-7xl mx-auto mb-8">
            <SteadyStatus />
          </div>

          {/* Activity Log - WHAT STEADY IS THINKING */}
          <div className="max-w-7xl mx-auto mb-12">
            <AlertsPanel />
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-8"
            >
              <PortfolioCard />
              <RiskMeter
                mode={currentMode}
                currentValue={currentValue}
                peakValue={peakValue}
              />
              <PanicButton
                currentMode={currentMode}
                onModeChange={setCurrentMode}
              />
            </motion.div>

            {/* Middle Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-8"
            >
              <ReasoningPanel mode={currentMode} />
              <ProtectionTimeline
                mode={currentMode}
                currentValue={currentValue}
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 space-y-8"
            >
              <WhatIfSimulator
                currentValue={currentValue}
                currentMode={currentMode}
                allocation={allocation}
              />
            </motion.div>
          </div>
        </section>

        {/* Mode Selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Set Your Risk Comfort Zone
            </h2>
            <p className="text-gray-400 text-lg">
              All modes protect you from major losses. Choose what feels right.
            </p>
          </div>
          <ModeSelector />
        </motion.section>

        {/* Rebalance Animation - The WOW Moment */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              How Protection Works
            </h2>
            <p className="text-gray-400 text-lg">
              See exactly how STEADY protects you when losses start
            </p>
          </div>
          <RebalanceAnimation />
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-32"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Getting Started Is Simple
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Just connect with Phantom. No signup. No email. No personal info needed.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">
                    Set Your Life Mode
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Tell STEADY what's happening in your life. Sleeping? Busy? Confident? Choose the mode that fits.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-2">
                    STEADY Starts Watching
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    That's it. STEADY monitors 24/7. If you start losing more than you're comfortable with, protection kicks in automatically. You're covered.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Product Clarity Panel - CRITICAL FOR TRUST */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="protection"
          className="container mx-auto px-4 mb-32"
        >
          <div className="max-w-6xl mx-auto">
            <ProductClarityPanel />
          </div>
        </motion.section>

        {/* Transparency Panel - BUILD TRUST */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 mb-32"
        >
          <div className="max-w-4xl mx-auto">
            <TransparencyPanel />
          </div>
        </motion.section>

        {/* Platform Modules */}
        <section className="container mx-auto px-4 mb-32">
          <PlatformModules />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              STEADY
            </p>
            <p className="text-gray-400 text-lg">
              Life-Aware Crypto Protection
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Non-custodial • Transparent • Built on Solana
            </p>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
              STEADY is a protection tool, not financial advice. Crypto is risky. STEADY reduces downside — it doesn't promise profits. Always invest what you can afford to lose.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
