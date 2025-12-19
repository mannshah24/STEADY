/**
 * components/PlatformModules.tsx
 *
 * Display of STEADY platform features
 * Shows active features and coming soon capabilities
 * Creates sense of scale and comprehensive protection
 */

"use client";

import { motion } from "framer-motion";

interface Module {
  icon: string;
  name: string;
  description: string;
  status: "active" | "coming-soon";
}

const modules: Module[] = [
  {
    icon: "🧠",
    name: "Risk Engine",
    description: "Real-time portfolio risk analysis and monitoring",
    status: "active",
  },
  {
    icon: "🛡️",
    name: "Downside Protection",
    description: "Automatic 10% drawdown protection with mode switching",
    status: "active",
  },
  {
    icon: "🔮",
    name: "AI Strategy Advisor",
    description: "Intelligent reasoning and market condition analysis",
    status: "active",
  },
  {
    icon: "📊",
    name: "What-If Simulator",
    description: "Test market scenarios before they happen",
    status: "active",
  },
  {
    icon: "📦",
    name: "Multi-Asset Baskets",
    description: "Diversified portfolio strategies across multiple tokens",
    status: "coming-soon",
  },
  {
    icon: "⚙️",
    name: "Advanced Strategies",
    description: "Custom protection rules and automated rebalancing",
    status: "coming-soon",
  },
];

export default function PlatformModules() {
  return (
    <div className="mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Platform Features
        </h2>
        <p className="text-gray-400 text-lg">
          Comprehensive risk management for Solana
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modules.map((module, index) => (
          <motion.div
            key={module.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border transition-all ${
              module.status === "active"
                ? "bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                : "bg-gray-900/30 border-gray-800/50 opacity-70"
            }`}
          >
            {/* Status Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{module.icon}</div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  module.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {module.status === "active" ? "ACTIVE" : "COMING SOON"}
              </span>
            </div>

            {/* Module Info */}
            <h3 className="text-xl font-bold mb-2">{module.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {module.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Powered by Solana badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <p className="text-sm text-gray-500">
          Built on <span className="text-purple-400 font-semibold">Solana</span>{" "}
          • Non-custodial • Open Source
        </p>
      </motion.div>
    </div>
  );
}
