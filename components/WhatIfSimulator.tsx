/**
 * components/WhatIfSimulator.tsx
 *
 * Interactive "What-If" market scenario simulator
 * Shows how portfolio would react to market movements
 * WITHOUT touching blockchain (pure frontend simulation)
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SimulationResult {
  originalValue: number;
  newValue: number;
  change: number;
  drawdown: number;
  protectionTriggered: boolean;
  finalMode: "Safe" | "Balanced" | "Growth";
  originalMode: "Safe" | "Balanced" | "Growth";
}

interface Props {
  currentValue: number;
  currentMode?: "Safe" | "Balanced" | "Growth";
  allocation?: { sol: number; usdc: number };
}

export default function WhatIfSimulator({
  currentValue,
  currentMode = "Safe",
  allocation = { sol: 20, usdc: 80 },
}: Props) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = [
    { label: "SOL -10%", change: -10, color: "from-red-500 to-orange-500" },
    { label: "SOL -20%", change: -20, color: "from-red-600 to-red-500" },
    { label: "SOL +10%", change: 10, color: "from-green-500 to-emerald-500" },
    { label: "SOL +30%", change: 30, color: "from-green-600 to-green-500" },
  ];

  const runSimulation = (changePercent: number) => {
    setIsSimulating(true);

    setTimeout(() => {
      // Calculate SOL portion impact
      const solImpact = (allocation.sol / 100) * (changePercent / 100);
      const totalChange = currentValue * solImpact;
      const newValue = currentValue + totalChange;

      // Calculate drawdown from peak (assume current is peak for simulation)
      const drawdown = ((currentValue - newValue) / currentValue) * 100;

      // Check if protection triggers (10% drawdown)
      const protectionTriggered = drawdown >= 10;

      // Determine final mode
      let finalMode = currentMode;
      if (protectionTriggered) {
        finalMode = "Safe";
      }

      setSimulation({
        originalValue: currentValue,
        newValue: Math.max(0, newValue),
        change: totalChange,
        drawdown: Math.max(0, drawdown),
        protectionTriggered,
        finalMode,
        originalMode: currentMode,
      });

      setIsSimulating(false);
    }, 800);
  };

  const handleScenarioClick = (index: number, changePercent: number) => {
    setSelectedScenario(index);
    runSimulation(changePercent);
  };

  const resetSimulation = () => {
    setSelectedScenario(null);
    setSimulation(null);
  };

  return (
    <div className="border border-purple-500/30 rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔮</span>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            What-If Simulator
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          See how your portfolio reacts to market movements
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Simulation only - No blockchain interaction</span>
        </p>
      </div>

      {/* Scenario Buttons */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3">Select a scenario:</p>
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => handleScenarioClick(index, scenario.change)}
              disabled={isSimulating}
              className={`
                relative p-4 rounded-lg font-semibold
                bg-gradient-to-r ${scenario.color}
                text-white
                transform transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
                ${selectedScenario === index ? "ring-2 ring-white" : ""}
                ${isSimulating ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Results */}
      {isSimulating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-cyan-400 text-sm">Running simulation...</p>
          </div>
        </div>
      )}

      {simulation && !isSimulating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Before vs After */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-500 mb-1">Before</p>
              <p className="text-2xl font-bold text-gray-300">
                ${simulation.originalValue.toFixed(2)}
              </p>
              <p className="text-xs text-purple-400 mt-1">
                {simulation.originalMode} Mode
              </p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-500 mb-1">After</p>
              <p className="text-2xl font-bold text-cyan-400">
                ${simulation.newValue.toFixed(2)}
              </p>
              <p className="text-xs text-cyan-400 mt-1">
                {simulation.finalMode} Mode
              </p>
            </div>
          </div>

          {/* Change Amount */}
          <div className="p-4 bg-black/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Value Change</p>
            <p
              className={`text-3xl font-bold ${
                simulation.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {simulation.change >= 0 ? "+" : ""}${simulation.change.toFixed(2)}
            </p>
            <p
              className={`text-sm mt-1 ${
                simulation.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {simulation.change >= 0 ? "+" : ""}
              {((simulation.change / simulation.originalValue) * 100).toFixed(
                2
              )}
              %
            </p>
          </div>

          {/* Drawdown Info */}
          {simulation.drawdown > 0 && (
            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <p className="text-sm text-orange-400 mb-2">Drawdown Detected</p>
              <p className="text-2xl font-bold text-orange-400">
                {simulation.drawdown.toFixed(2)}%
              </p>
            </div>
          )}

          {/* Protection Status */}
          <div
            className={`p-4 rounded-lg border ${
              simulation.protectionTriggered
                ? "bg-red-500/10 border-red-500/30"
                : "bg-green-500/10 border-green-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {simulation.protectionTriggered ? "🛡️" : "✅"}
              </span>
              <div>
                <p
                  className={`font-bold ${
                    simulation.protectionTriggered
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {simulation.protectionTriggered
                    ? "⚠️ Downside Protection TRIGGERED"
                    : "✓ Portfolio Safe"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {simulation.protectionTriggered
                    ? "Automatic rebalance to Safe Mode would execute"
                    : "No protection needed - drawdown below 10% threshold"}
                </p>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSimulation}
            className="w-full py-3 rounded-lg border border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
          >
            Run Another Simulation
          </button>
        </motion.div>
      )}
    </div>
  );
}
