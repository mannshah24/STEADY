/**
 * app/page.tsx
 *
 * STEADY - Life-Aware Crypto Protection
 *
 * MANDATORY UI HIERARCHY (SECTION A from spec):
 *
 * TOP LAYER (Always visible, VERY emotional, life-focused):
 *   - Life Mode Panel: Huge, emotional, human language
 *   - Heartbeat Status: Shows STEADY is alive and watching
 *   - Panic Button: One-click emergency protection
 *
 * MID LAYER (Secondary info, quick-glance):
 *   - AI Advisor Card: Plain English recommendations (NO jargon)
 *   - Risk Summary Card: Human language risk state (NOT "volatility 0.23")
 *
 * BOTTOM LAYER (Expandable/Collapsible tertiary details):
 *   - Guardian Alerts History
 *   - Reasoning Stream (what STEADY is thinking)
 *   - Protection Timeline
 *   - Transparency Panel (non-custodial proof)
 *   - Why STEADY Exists
 *   - Life Insights
 *   - Crash Replay Simulator
 *
 * DESIGN RULES (SECTION F from spec):
 * - Dark, premium UI with neon accents
 * - Calm guardian tone (not hyper/shouty)
 * - Human language ONLY (no "algorithmic", "backtest", "MVP", "demo")
 * - Must feel ALIVE with continuous updates
 * - Must NOT feel boring, empty, or static
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import AIAdvisor from "@/components/AIAdvisor";
import RiskSummary from "@/components/RiskSummary";
import LifeInsights from "@/components/LifeInsights";
import CrashReplay from "@/components/CrashReplay";
import WhatIfSimulator from "@/components/WhatIfSimulator";
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
import { getCurrentLifeMode, type LifeMode } from "@/lib/lifeModeEngine";

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

  const [currentMode, setCurrentMode] = useState<LifeMode>("growth");
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

        // Get current life mode from lifeModeEngine
        const mode = getCurrentLifeMode();
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
        EXACT HIERARCHY from SECTION A
        ================================================================
        
        TOP: Life Mode Panel + Heartbeat (Always visible, emotional)
        MID: AI Advisor + Risk Summary (Secondary, 2-column grid)
        BOTTOM: Expandable sections (Tertiary, collapsible)
        
        WHY THIS STRUCTURE:
        - TOP grabs attention, communicates core value instantly
        - MID provides actionable intelligence without overwhelming
        - BOTTOM allows curious users to dive deep without cluttering
        
        This hierarchy makes STEADY feel:
        ✅ ALIVE (continuous heartbeat updates)
        ✅ EXCITING (new features: What-If, Insights, Crash Replay)
        ✅ TRUSTWORTHY (transparency panel, reasoning stream)
        ❌ NOT boring, empty, static, or generic
      */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* ============================================================
            TOP LAYER: Life Mode + Heartbeat + Panic Button
            WHY: This is THE experience. Life-aware protection is the 
            entire reason STEADY exists. Must be huge and emotional.
            ============================================================ */}
        <section className="mb-12">
          {/* Heartbeat Status - Shows STEADY is alive and watching */}
          <div className="mb-6">
            <HeartbeatMonitor />
          </div>

          {/* Life Mode + Portfolio (3:2 ratio as per original design) */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* LEFT: Life Mode Panel (3/5 width) - VERY BIG, VERY EMOTIONAL */}
            <div className="lg:col-span-3">
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

        {/* ============================================================
            MID LAYER: AI Advisor + Risk Summary
            WHY: Quick-glance intelligence. Plain English answers to 
            "What should I do?" and "Am I safe?" without jargon.
            ============================================================ */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Advisor Card - Plain English recommendations */}
            <AIAdvisor />

            {/* Risk Summary Card - Human language risk state */}
            <RiskSummary />
          </div>
        </section>

        {/* ============================================================
            BOTTOM LAYER: Expandable/Collapsible Sections
            WHY: Power users want details. Casual users want simplicity.
            This gives both without cluttering the main experience.
            ============================================================ */}
        <ExpandableSections />

      </main>

      {/* 
        FOOTER: Professional, Trustworthy, Human
        WHY: Reinforces legitimacy and sets responsible expectations.
      */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              STEADY
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Life-aware crypto protection. Sleep peacefully while STEADY watches for you.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span>Non-custodial</span>
              <span>•</span>
              <span>Always transparent</span>
              <span>•</span>
              <span>Built on Solana</span>
            </div>
            <p className="text-xs text-gray-600 max-w-lg mx-auto pt-4 border-t border-gray-800/50 mt-6">
              STEADY reduces downside risk. It does not guarantee profits.
              Crypto is volatile. Invest responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * ExpandableSections - Collapsible BOTTOM LAYER
 * 
 * WHY THIS EXISTS:
 * Some users want to dive deep. Others just want to see their protection status.
 * This collapsible section gives power users access to details without cluttering
 * the main experience. Each section expands individually.
 * 
 * INCLUDES:
 * - Guardian Alerts History
 * - Reasoning Stream (what STEADY is thinking)
 * - Life Insights (emotional intelligence about usage patterns)
 * - What-If Simulator (test scenarios)
 * - Crash Replay (storytelling: what STEADY saved you from)
 * - Why STEADY Exists (problem statement)
 * - Transparency Panel (non-custodial proof)
 */
function ExpandableSections() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: "alerts",
      title: "Guardian Alerts",
      icon: "🔔",
      description: "See what STEADY has noticed",
      component: <GuardianAlerts />,
    },
    {
      id: "reasoning",
      title: "AI Thinking",
      icon: "🧠",
      description: "What STEADY is evaluating right now",
      component: <ReasoningStream />,
    },
    {
      id: "insights",
      title: "Life Insights",
      icon: "💡",
      description: "How you've been using STEADY",
      component: <LifeInsights />,
    },
    {
      id: "whatif",
      title: "What-If Simulator",
      icon: "📊",
      description: "Test different crash scenarios",
      component: <WhatIfSimulator />,
    },
    {
      id: "crash",
      title: "Crash Replay",
      icon: "⏮️",
      description: "See how STEADY would have protected you",
      component: <CrashReplay />,
    },
    {
      id: "why",
      title: "Why STEADY Exists",
      icon: "❓",
      description: "The problem we're solving",
      component: <WhySteadyExists />,
    },
    {
      id: "proof",
      title: "Transparency",
      icon: "🔍",
      description: "Verify everything is non-custodial",
      component: <NonCustodialProof />,
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <section className="mb-12 space-y-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Dive Deeper
        </h2>
        <p className="text-gray-400 text-sm">
          Curious about the details? Expand any section below.
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden"
          >
            {/* Section Header - Clickable */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{section.icon}</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
              >
                ▼
              </motion.div>
            </button>

            {/* Section Content - Expandable */}
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-800/50"
                >
                  <div className="p-6">
                    {section.component}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
