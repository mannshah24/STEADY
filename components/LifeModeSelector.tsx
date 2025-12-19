/**
 * components/LifeModeSelector.tsx
 *
 * THE ICONIC FEATURE of STEADY
 *
 * PURPOSE:
 * This is NOT a risk slider.
 * This is NOT a strategy picker.
 * This IS: "Tell STEADY how your life looks right now."
 *
 * EMOTIONAL IMPACT:
 * When people see this, they should think:
 * "This product understands humans, not just markets."
 *
 * EXPERIENCE:
 * Switching from Growth → Sleep Mode should feel like
 * "STEADY just became my guardian while I rest."
 */

"use client";

import { useState, useEffect } from "react";
import {
  LIFE_MODES,
  getCurrentLifeMode,
  setLifeModeWithNotification,
  getLifeModeStatusMessage,
  type LifeMode,
  type LifeModeConfig,
} from "@/lib/lifeModeEngine";

interface Props {
  onModeChange?: (mode: LifeMode) => void;
}

export default function LifeModeSelector({ onModeChange }: Props) {
  const [currentMode, setCurrentMode] = useState<LifeMode>("growth");
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setCurrentMode(getCurrentLifeMode());
  }, []);

  const handleModeChange = async (mode: LifeMode) => {
    if (mode === currentMode || isChanging) return;

    setIsChanging(true);

    // Visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update Life Mode
    setLifeModeWithNotification(mode);
    setCurrentMode(mode);

    // Callback
    if (onModeChange) {
      onModeChange(mode);
    }

    setIsChanging(false);
  };

  const currentConfig = LIFE_MODES[currentMode];

  return (
    <div className="space-y-6">
      {/* Prominent Banner - EMOTIONAL & CLEAR */}
      <div
        className={`rounded-2xl border-2 border-${currentConfig.color}-500/50 bg-gradient-to-br ${currentConfig.bgGradient} backdrop-blur-sm p-8 text-center shadow-xl shadow-${currentConfig.color}-500/20`}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-6xl drop-shadow-lg">{currentConfig.emoji}</span>
          <div className="text-left">
            <h2
              className={`text-4xl font-bold ${currentConfig.textColor} mb-2 drop-shadow-md`}
            >
              {currentConfig.label}
            </h2>
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full bg-${currentConfig.color}-400 animate-pulse shadow-lg shadow-${currentConfig.color}-500/50`}
              />
              <p className="text-white text-sm font-medium">
                Active & Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* EMOTIONAL TAGLINE - The core of Life Mode */}
        <div className="mt-6 mb-4">
          <p
            className={`text-2xl font-semibold ${currentConfig.textColor} mb-2`}
          >
            "{currentConfig.tagline}"
          </p>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
            {getLifeModeStatusMessage(currentMode)}
          </p>
        </div>
      </div>

      {/* Secondary Explanation */}
      <div className="text-center">
        <p className="text-gray-400 text-base">
          Tell STEADY what's happening in your life, and protection adapts to
          your context.
        </p>
      </div>

      {/* Mode Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {(Object.keys(LIFE_MODES) as LifeMode[]).map((modeKey) => {
          const mode = LIFE_MODES[modeKey];
          const isActive = currentMode === modeKey;
          const isPanic = modeKey === "panic";

          return (
            <button
              key={modeKey}
              onClick={() => handleModeChange(modeKey)}
              disabled={isChanging}
              className={`
                p-6 rounded-xl text-left transition-all
                ${
                  isActive
                    ? `bg-${mode.color}-500/20 border-2 border-${mode.color}-500 shadow-lg shadow-${mode.color}-500/30`
                    : "bg-gray-900/50 border border-gray-800 hover:border-gray-700"
                }
                ${isPanic ? "md:col-span-2" : ""}
                ${
                  isChanging
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl">{mode.emoji}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className={`text-xl font-bold ${
                        isActive ? mode.textColor : "text-white"
                      }`}
                    >
                      {mode.label}
                    </h3>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {mode.description}
                  </p>

                  <p
                    className={`text-sm font-medium ${
                      isActive ? mode.textColor : "text-gray-500"
                    }`}
                  >
                    "{mode.tagline}"
                  </p>

                  {/* Protection Details */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-gray-600">Protection Trigger</span>
                    <span
                      className={isActive ? mode.textColor : "text-gray-500"}
                    >
                      {mode.drawdownThreshold}% drawdown
                    </span>
                  </div>
                </div>

                {/* Checkmark */}
                {isActive && (
                  <div className={`text-2xl ${mode.textColor}`}>✓</div>
                )}
              </div>

              {/* Panic Mode Special CTA */}
              {isPanic && !isActive && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    Use only when you need immediate, full protection
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="rounded-lg bg-gray-900/50 border border-gray-800 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white mb-1">
              Life Modes adapt STEADY to your context
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Same market conditions, different responses. When you're sleeping
              or busy, STEADY becomes more protective. When you're actively
              growing, it gives you room. No backend, no ML—just smart
              thresholds that respect your life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
