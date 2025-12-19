/**
 * components/WhySteadyExists.tsx
 *
 * PHASE 7: COMPETITION CRUSHER - The Problem Statement
 *
 * PURPOSE:
 * Make it CRYSTAL CLEAR why STEADY needs to exist.
 * This isn't a "nice to have" — it's solving REAL PAIN.
 *
 * EMOTIONAL IMPACT:
 * Every reader should think:
 * "Yes, that's exactly my problem. I need this."
 *
 * POSITIONING:
 * This establishes STEADY as inevitable, not experimental.
 */

"use client";

import { motion } from "framer-motion";

export default function WhySteadyExists() {
  const problems = [
    {
      emoji: "😴",
      title: "People lose money while asleep",
      description:
        "Crypto never sleeps. Markets crash at 3 AM. You wake up to losses you couldn't prevent.",
    },
    {
      emoji: "😰",
      title: "People panic trade emotionally",
      description:
        "Fear takes over during crashes. You sell at the bottom, locking in maximum loss.",
    },
    {
      emoji: "⏰",
      title: "People can't watch crypto 24/7",
      description:
        "You have a job. A life. Family. School. You can't stare at charts constantly.",
    },
    {
      emoji: "🔐",
      title: "Existing solutions require custody",
      description:
        "Traditional protection means giving control to someone else. That's not acceptable.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-3"
        >
          Why STEADY Exists
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          STEADY protects humans when life happens. Because crypto markets don't
          care about your sleep, your job, or your emotions.
        </motion.p>
      </div>

      {/* Problems Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors duration-300"
          >
            <div className="text-4xl mb-4">{problem.emoji}</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {problem.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Solution Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl text-center"
      >
        <p className="text-lg text-gray-200 font-medium mb-2">
          STEADY solves all of this.
        </p>
        <p className="text-sm text-gray-400 max-w-3xl mx-auto">
          A life-aware, non-custodial protection system that watches the market
          24/7, adapts to your life context, and protects your downside — all
          while you maintain complete control of your assets.
        </p>
      </motion.div>
    </div>
  );
}
