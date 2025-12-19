/**
 * components/ProductClarityPanel.tsx
 *
 * PRODUCT CLARITY & EXPECTATIONS PANEL
 *
 * PURPOSE:
 * Remove all confusion about what STEADY is and isn't.
 * Clear, direct communication about:
 * - Not a trading bot
 * - Not custodial
 * - Not a profit promise
 * - Designed for protection and peace of mind
 *
 * TONE:
 * Honest, direct, calm. No marketing fluff.
 * Set realistic expectations. Build trust through clarity.
 */

"use client";

import { motion } from "framer-motion";

interface ClarityPoint {
  icon: string;
  title: string;
  description: string;
  emphasis: string;
}

export default function ProductClarityPanel() {
  const whatWeAreNot: ClarityPoint[] = [
    {
      icon: "🤖",
      title: "NOT a Trading Bot",
      description:
        "We don't trade for profit or try to beat the market. We protect against loss. There's a fundamental difference.",
      emphasis: "We respond to risk, not chase gains.",
    },
    {
      icon: "🔐",
      title: "NOT Custodial",
      description:
        "Your funds never leave your wallet. We have zero ability to withdraw, transfer, or access your crypto. It's mathematically impossible.",
      emphasis: "Your keys, your crypto. Always.",
    },
    {
      icon: "📈",
      title: "NOT a Magic Profit Machine",
      description:
        "We don't promise returns. We don't guarantee gains. We don't claim to make you rich. Crypto is inherently risky.",
      emphasis: "We reduce downside, not predict upside.",
    },
    {
      icon: "🔮",
      title: "NOT Predictive AI",
      description:
        "We don't claim to predict the future. We respond to actual market conditions based on math and your defined rules, not magic.",
      emphasis: "React intelligently, not predict perfectly.",
    },
  ];

  const whatWeAre: ClarityPoint[] = [
    {
      icon: "🛡️",
      title: "Protection System",
      description:
        "STEADY watches your portfolio 24/7 and responds to risk based on the protection rules you define.",
      emphasis: "A guardian, not a guru.",
    },
    {
      icon: "🌙",
      title: "Life-Aware Safety",
      description:
        "Protection adapts to human context — when you're asleep, busy, stressed, or offline. For real people with real lives.",
      emphasis: "Built for humans, not traders.",
    },
    {
      icon: "💡",
      title: "Always Transparent",
      description:
        "Every decision is explained. No black boxes. No silent moves. You always know what STEADY is thinking and why.",
      emphasis: "Clarity creates calm.",
    },
    {
      icon: "🧘",
      title: "Peace of Mind",
      description:
        "One less thing to worry about. Sleep peacefully. Focus on what matters. Let STEADY handle the watching.",
      emphasis: "Protection you can forget about.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">🎯</span>
        <h3 className="text-2xl font-bold text-purple-400 mb-2">
          What STEADY Actually Is
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
          No marketing speak. No confusing jargon. Here's exactly what you're
          getting — and what you're not.
        </p>
      </div>

      {/* What We're NOT */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <span>❌</span>
          <span>What STEADY is NOT</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          {whatWeAreNot.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-black/40 border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{point.icon}</span>
                <div className="flex-1">
                  <h5 className="text-white font-semibold mb-1">
                    {point.title}
                  </h5>
                  <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                    {point.description}
                  </p>
                  <p className="text-red-400 text-xs font-semibold">
                    → {point.emphasis}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What We ARE */}
      <div>
        <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>✅</span>
          <span>What STEADY Actually IS</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          {whatWeAre.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-black/40 border border-green-500/20 hover:border-green-500/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{point.icon}</span>
                <div className="flex-1">
                  <h5 className="text-white font-semibold mb-1">
                    {point.title}
                  </h5>
                  <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                    {point.description}
                  </p>
                  <p className="text-green-400 text-xs font-semibold">
                    → {point.emphasis}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Statement */}
      <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <h5 className="text-purple-300 font-semibold mb-2">
              The Simple Truth
            </h5>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              STEADY never holds your funds. We don't predict markets. We
              enforce your safety rules when you can't respond.
            </p>
            <p className="text-white text-sm font-semibold">
              That's it. Protection and peace of mind. Nothing more, nothing
              less.
            </p>
          </div>
        </div>
      </div>

      {/* Key Questions Answered */}
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>❓</span>
          <span>Questions You Might Have</span>
        </h4>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-black/40 border border-gray-700/30">
            <h5 className="text-purple-300 font-semibold mb-2 text-sm">
              Can STEADY access my funds?
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed">
              No. Your funds stay in your wallet. STEADY uses smart contracts
              that only YOU can authorize. We can't withdraw, transfer, or
              access your crypto. It's mathematically impossible.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/40 border border-gray-700/30">
            <h5 className="text-purple-300 font-semibold mb-2 text-sm">
              Does STEADY guarantee profits?
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed">
              No. We don't predict markets or promise gains. STEADY prevents
              losses by moving to safety when you're down. It's protection, not
              a money printer.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/40 border border-gray-700/30">
            <h5 className="text-purple-300 font-semibold mb-2 text-sm">
              Who decides the protection rules?
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed">
              You do. You choose your Life Mode and risk level. STEADY enforces
              YOUR rules when you can't watch the markets yourself.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/40 border border-gray-700/30">
            <h5 className="text-purple-300 font-semibold mb-2 text-sm">
              Is the code open source?
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed">
              Yes. All smart contract code is public and verifiable on-chain.
              Check the Transparency Panel below for links to verify everything
              yourself.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
