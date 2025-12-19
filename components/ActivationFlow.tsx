/**
 * components/ActivationFlow.tsx
 *
 * Stripe-style onboarding flow for STEADY platform
 * Guides user through 4 steps before activating protection
 *
 * UX Philosophy:
 * - One step at a time (no scrolling)
 * - Clear progress indicator
 * - Calm, confident copy
 * - No blockchain calls until final step
 */

"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import StepIndicator from "./StepIndicator";
import {
  activateSteady,
  setRiskPersonality,
  getDefaultModeForPersonality,
  RiskPersonality,
} from "@/lib/steadyState";
import {
  initializePortfolio,
  toAnchorWallet,
  InvestmentMode,
} from "@/lib/anchor";

const TOTAL_STEPS = 4;

export default function ActivationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPersonality, setSelectedPersonality] =
    useState<RiskPersonality | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationComplete, setActivationComplete] = useState(false);

  const wallet = useWallet();
  const { publicKey, connected, connecting, select, wallets } = wallet;
  const { setVisible } = useWalletModal();

  // Handler for opening wallet modal - defined at component level
  const handleConnect = () => {
    console.log("[ActivationFlow] Connect button clicked");
    console.log("[ActivationFlow] Available wallets:", wallets.map(w => w.adapter.name));
    
    // Try to select Phantom directly if available
    const phantom = wallets.find(w => w.adapter.name === "Phantom");
    if (phantom && phantom.readyState === "Installed") {
      console.log("[ActivationFlow] Phantom found and installed, selecting...");
      select(phantom.adapter.name);
    } else {
      console.log("[ActivationFlow] Opening wallet modal...");
      setVisible(true);
    }
  };

  // Step 1: Wallet Connection
  const renderStep1 = () => {

    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold mb-3 text-white">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-4">
            STEADY is completely non-custodial. Your crypto never leaves your
            wallet. You control everything. Always.
          </p>
          <p className="text-gray-500 text-sm">
            We protect you when you can't watch — asleep, busy, or offline.
          </p>
        </div>

        {!connected ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? "Connecting..." : "Connect Phantom Wallet"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              {connecting
                ? "Check Phantom popup to approve..."
                : "A Phantom popup will appear - approve the connection"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-gray-400 mb-2">✅ Connected</p>
              <p className="text-green-400 font-mono text-sm break-all">
                {publicKey?.toBase58()}
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Continue →
            </button>
          </div>
        )}

        <p className="text-xs text-gray-600 text-center mt-6">
          Non-custodial • Transparent • Life-Aware Protection
        </p>
      </div>
    );
  };

  // Step 2: Protection Profile Selection
  const renderStep2 = () => {
    const personalities: {
      id: RiskPersonality;
      emoji: string;
      label: string;
      description: string;
    }[] = [
      {
        id: "Conservative",
        emoji: "🛡️",
        label: "Maximum Protection",
        description:
          "Prioritize safety over growth. Tighter thresholds, faster response. Best for peace of mind.",
      },
      {
        id: "Adaptive",
        emoji: "⚖️",
        label: "Balanced Protection",
        description:
          "Standard protection with room for growth. Adapts to market conditions. Good default for most people.",
      },
      {
        id: "Aggressive",
        emoji: "⚡",
        label: "Growth-Focused",
        description:
          "Allow more volatility for potential upside. Protection still active but less restrictive.",
      },
    ];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-3">
            Choose Your Protection Profile
          </h2>
          <p className="text-gray-400 text-lg mb-2">
            How much risk are you comfortable with when you're not watching?
          </p>
          <p className="text-gray-500 text-sm">
            You can change this anytime, or switch to Life Modes after
            activation.
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonality(p.id)}
              className={`p-6 rounded-xl text-left transition-all ${
                selectedPersonality === p.id
                  ? "bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30"
                  : "bg-gray-900/50 border border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{p.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{p.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </div>
                {selectedPersonality === p.id && (
                  <div className="text-cyan-400 text-2xl">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => {
              if (selectedPersonality) {
                setRiskPersonality(selectedPersonality);
                setCurrentStep(3);
              }
            }}
            disabled={!selectedPersonality}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Protection Preview
  const renderStep3 = () => (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-3xl font-bold mb-3">How Protection Works</h2>
        <p className="text-gray-400 text-lg">
          STEADY monitors your portfolio 24/7 and reacts automatically.
        </p>
      </div>

      {/* Mini simulation */}
      <div className="space-y-4 mb-8">
        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Scenario</span>
            <span className="text-red-400 font-bold">Market drops 15%</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                1
              </div>
              <p className="text-sm text-gray-300">
                Risk Engine detects drawdown
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                2
              </div>
              <p className="text-sm text-gray-300">
                Protection triggers at -10% threshold
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                3
              </div>
              <p className="text-sm text-gray-300">
                Portfolio moves to safety automatically
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-sm text-green-400 font-semibold mb-1">Result</p>
          <p className="text-xs text-gray-400">
            Your losses are capped. STEADY preserves your capital until markets
            stabilize.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // Step 4: Activate STEADY
  const renderStep4 = () => {
    const handleActivation = async () => {
      if (!publicKey || !selectedPersonality) return;

      setIsActivating(true);

      try {
        // Initialize portfolio on-chain using the actual wallet
        const anchorWallet = toAnchorWallet(wallet);

        if (anchorWallet) {
          await initializePortfolio(anchorWallet);
        }

        // Activate STEADY in local state
        activateSteady();
        setActivationComplete(true);

        // Wait for success animation, then reload page to show dashboard
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error: any) {
        // If portfolio already exists, just activate (user might be re-activating)
        if (error.message?.includes("already in use")) {
          activateSteady();
          setActivationComplete(true);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          console.error("Activation error:", error);
          alert("Activation failed. Please try again.");
          setIsActivating(false);
        }
      }
    };

    if (activationComplete) {
      return (
        <div className="max-w-lg mx-auto text-center">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            STEADY Activated
          </h2>
          <p className="text-gray-400 text-lg">
            Your portfolio is now protected. Redirecting to dashboard...
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-3">Activate STEADY</h2>
          <p className="text-gray-400 text-lg">
            You're ready to activate downside protection for your portfolio.
          </p>
        </div>

        {/* Summary */}
        <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">
            Activation Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Wallet</span>
              <span className="text-cyan-400 font-mono text-sm">
                {publicKey?.toBase58().slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Risk Personality</span>
              <span className="text-purple-400 font-semibold">
                {selectedPersonality}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Protection Threshold</span>
              <span className="text-green-400 font-semibold">10% Drawdown</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(3)}
            disabled={isActivating}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            onClick={handleActivation}
            disabled={isActivating}
            className="flex-1 py-4 px-6 rounded-lg font-semibold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActivating ? "Activating..." : "Activate STEADY"}
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          By activating, you authorize STEADY to monitor your portfolio and
          execute protection strategies.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            STEADY
          </h1>
          <p className="text-gray-500 text-sm">Risk Management Platform</p>
        </div>

        {/* Step Indicator */}
        {!activationComplete && (
          <div className="max-w-md mx-auto mb-12">
            <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        {/* Steps */}
        <div className="relative min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}
