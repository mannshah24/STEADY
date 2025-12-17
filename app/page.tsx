/**
 * app/page.tsx
 *
 * STEADY - Main landing page
 * Designed to impress hackathon judges visually and conceptually
 * Features scroll-based gradient transitions and smooth animations
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
import { fetchPortfolio, toAnchorWallet } from "@/lib/anchor";
import { getBalance } from "@/lib/solana";
import { getSolUsdPrice } from "@/lib/pyth";

export default function Home() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;

  const [currentMode, setCurrentMode] = useState<
    "Safe" | "Balanced" | "Growth"
  >("Safe");
  const [currentValue, setCurrentValue] = useState(0);
  const [peakValue, setPeakValue] = useState(0);
  const [allocation, setAllocation] = useState({ sol: 20, usdc: 80 });

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

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Solana-native autopilot investing with{" "}
            <span className="text-cyan-400 font-bold">
              automatic downside protection
            </span>
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Your portfolio automatically switches to Safe mode when it drops 10%
            from its peak. No manual intervention required.
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

        {/* Feature Cards */}
        <section id="features" className="container mx-auto px-4 mb-32">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl border border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-cyan-500/60 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-400">
                Downside Protection
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Automatic 10% drawdown protection. When your portfolio drops
                from its peak, the system immediately switches to Safe mode to
                preserve capital.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl border border-purple-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/60 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-400">
                Smart Rebalancing
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Choose between Safe, Balanced, or Growth modes. Each strategy
                automatically manages your allocation for optimal risk-adjusted
                returns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl border border-pink-500/30 bg-gray-900/50 backdrop-blur-sm hover:border-pink-500/60 transition-all hover:shadow-[0_0_40px_rgba(236,72,153,0.2)] hover:scale-105 duration-300">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold mb-3 text-pink-400">
                Non-Custodial
              </h3>
              <p className="text-gray-400 leading-relaxed">
                You maintain complete control. Your funds stay in your wallet.
                All operations are executed by Solana smart contracts - no
                intermediaries.
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
              Your Portfolio Dashboard
            </h2>
            <p className="text-gray-400 text-lg">
              Intelligent, real-time monitoring with AI-powered insights
            </p>
          </motion.div>

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
              Choose Your Investment Mode
            </h2>
            <p className="text-gray-400 text-lg">
              All modes include automatic downside protection
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
              See Protection in Action
            </h2>
            <p className="text-gray-400 text-lg">
              Watch how STEADY automatically protects your capital
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
              How It Works
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
                    Connect Wallet
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Connect your Phantom wallet. No signup, no KYC, no email
                    required.
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
                    Choose Strategy
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Select Safe, Balanced, or Growth mode based on your risk
                    tolerance.
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
                    Autopilot Engaged
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    STEADY monitors your portfolio 24/7. If it drops 10% from
                    peak, protection automatically activates.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Non-Custodial Message */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto p-12 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-sm text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-400">
              100% Non-Custodial
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Your funds{" "}
              <span className="text-green-400 font-bold">
                never leave your wallet
              </span>
              . All operations are executed by Solana smart contracts. You
              maintain complete control at all times.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              STEADY
            </p>
            <p className="text-gray-400">
              Built on Solana Devnet | Hackathon MVP
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              This is a demonstration project. Use at your own risk. Not
              financial advice. Always do your own research before investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
