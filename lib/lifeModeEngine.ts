/**
 * lib/lifeModeEngine.ts
 * 
 * STEADY Life Mode Engine
 * 
 * PURPOSE:
 * This is THE ICONIC FEATURE that makes STEADY different.
 * Instead of "risk tolerance" or "strategy", we ask:
 * "What's happening in your life right now?"
 * 
 * PHILOSOPHY:
 * Crypto investing happens in the context of HUMAN LIFE.
 * When you're sleeping, studying, working, or panicking,
 * your portfolio needs different levels of protection.
 * 
 * This is NOT AI prediction.
 * This IS adaptive protection that respects your life context.
 */

// ==========================================
// TYPES
// ==========================================

export type LifeMode = "sleep" | "focus" | "growth" | "panic";

export interface LifeModeConfig {
  id: LifeMode;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  
  // Protection parameters (frontend-only, no smart contract changes)
  drawdownThreshold: number; // % drawdown before protection triggers
  riskTolerance: "conservative" | "moderate" | "aggressive";
  alertSensitivity: "high" | "medium" | "low";
  aiAggressiveness: "calm" | "balanced" | "proactive";
  
  // UI behavior
  color: string;
  bgGradient: string;
  textColor: string;
}

// ==========================================
// LIFE MODE DEFINITIONS
// ==========================================

export const LIFE_MODES: Record<LifeMode, LifeModeConfig> = {
  sleep: {
    id: "sleep",
    emoji: "🌙",
    label: "Sleep Mode",
    tagline: "You rest. We watch.",
    description: "Enhanced protection while you're offline. Crypto doesn't sleep — but you can, safely.",
    
    drawdownThreshold: 7, // Trigger at 7% instead of 10%
    riskTolerance: "conservative",
    alertSensitivity: "high",
    aiAggressiveness: "calm",
    
    color: "blue",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    textColor: "text-blue-400",
  },
  
  focus: {
    id: "focus",
    emoji: "📚",
    label: "Focus Mode",
    tagline: "You handle life. We handle risk.",
    description: "Protection while you're busy with work, school, or travel. Capital preservation priority.",
    
    drawdownThreshold: 8, // Trigger at 8%
    riskTolerance: "conservative",
    alertSensitivity: "high",
    aiAggressiveness: "calm",
    
    color: "purple",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    textColor: "text-purple-400",
  },
  
  growth: {
    id: "growth",
    emoji: "⚡",
    label: "Growth Mode",
    tagline: "You're confident. We adapt.",
    description: "Standard protection for when you're actively engaged and ready for calculated growth.",
    
    drawdownThreshold: 10, // Standard 10%
    riskTolerance: "aggressive",
    alertSensitivity: "medium",
    aiAggressiveness: "proactive",
    
    color: "green",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    textColor: "text-green-400",
  },
  
  panic: {
    id: "panic",
    emoji: "🚨",
    label: "Panic Mode",
    tagline: "Everything protected now.",
    description: "Immediate maximum safety. Use when you need peace of mind right now.",
    
    drawdownThreshold: 0, // Immediate protection
    riskTolerance: "conservative",
    alertSensitivity: "high",
    aiAggressiveness: "calm",
    
    color: "red",
    bgGradient: "from-red-500/20 to-orange-500/20",
    textColor: "text-red-400",
  },
};

// ==========================================
// STATE MANAGEMENT (Frontend-only)
// ==========================================

const STORAGE_KEY = "steady_life_mode";

/**
 * Get current Life Mode
 * Defaults to "growth" if not set
 */
export function getCurrentLifeMode(): LifeMode {
  if (typeof window === "undefined") return "growth";
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isValidLifeMode(stored)) {
    return stored as LifeMode;
  }
  
  return "growth";
}

/**
 * Set Life Mode
 * Returns the config for the new mode
 */
export function setLifeMode(mode: LifeMode): LifeModeConfig {
  if (typeof window === "undefined") return LIFE_MODES.growth;
  
  localStorage.setItem(STORAGE_KEY, mode);
  
  console.log(`[LifeMode] Switched to ${LIFE_MODES[mode].label}`);
  
  return LIFE_MODES[mode];
}

/**
 * Get config for current Life Mode
 */
export function getLifeModeConfig(): LifeModeConfig {
  const mode = getCurrentLifeMode();
  return LIFE_MODES[mode];
}

/**
 * Get config for specific Life Mode
 */
export function getConfigForMode(mode: LifeMode): LifeModeConfig {
  return LIFE_MODES[mode];
}

/**
 * Check if string is valid Life Mode
 */
function isValidLifeMode(mode: string): boolean {
  return ["sleep", "focus", "growth", "panic"].includes(mode);
}

// ==========================================
// LIFE-AWARE LOGIC
// ==========================================

/**
 * Determine if alert should be shown based on Life Mode
 * Same market condition → different alert based on life context
 */
export function shouldAlertForLifeMode(
  drawdown: number,
  volatility: number,
  mode: LifeMode
): { shouldAlert: boolean; severity: "info" | "warning" | "critical" } {
  const config = LIFE_MODES[mode];
  
  // Panic mode: Always critical
  if (mode === "panic") {
    return { shouldAlert: true, severity: "critical" };
  }
  
  // Check against life-aware thresholds
  if (drawdown >= config.drawdownThreshold) {
    return { shouldAlert: true, severity: "critical" };
  }
  
  // High sensitivity modes alert earlier
  if (config.alertSensitivity === "high") {
    if (drawdown >= config.drawdownThreshold * 0.7) {
      return { shouldAlert: true, severity: "warning" };
    }
    if (volatility > 2) {
      return { shouldAlert: true, severity: "warning" };
    }
  }
  
  // Medium sensitivity
  if (config.alertSensitivity === "medium") {
    if (drawdown >= config.drawdownThreshold * 0.8) {
      return { shouldAlert: true, severity: "warning" };
    }
  }
  
  return { shouldAlert: false, severity: "info" };
}

/**
 * Get AI suggestion tone based on Life Mode
 */
export function getAISuggestionTone(mode: LifeMode): string {
  const config = LIFE_MODES[mode];
  
  switch (config.aiAggressiveness) {
    case "calm":
      return "reassuring and conservative";
    case "balanced":
      return "balanced and informative";
    case "proactive":
      return "growth-oriented and confident";
    default:
      return "balanced";
  }
}

/**
 * Get human-readable status message for Life Mode
 * These messages provide calm reassurance and context
 */
export function getLifeModeStatusMessage(mode: LifeMode): string {
  const messages = {
    sleep: "Enhanced protection active. Rest peacefully — your portfolio is being monitored 24/7.",
    focus: "Focus on what matters in your life. STEADY is watching your investments with increased care.",
    growth: "Growth-oriented protection active. Protection ready to respond when markets turn.",
    panic: "Maximum protection engaged. All positions safeguarded. You're secure.",
  };
  
  return messages[mode];
}

/**
 * Map Life Mode to Solana program mode
 * This bridges the gap between human context and blockchain
 */
export function lifeModeToContractMode(lifeMode: LifeMode): "Safe" | "Balanced" | "Growth" {
  switch (lifeMode) {
    case "panic":
      return "Safe";
    case "sleep":
      return "Balanced"; // Conservative but not fully safe
    case "focus":
      return "Balanced";
    case "growth":
      return "Growth";
    default:
      return "Balanced";
  }
}

// ==========================================
// EVENT SYSTEM
// ==========================================

type LifeModeChangeCallback = (mode: LifeMode, config: LifeModeConfig) => void;
const lifeModeListeners: LifeModeChangeCallback[] = [];

/**
 * Subscribe to Life Mode changes
 */
export function onLifeModeChange(callback: LifeModeChangeCallback): () => void {
  lifeModeListeners.push(callback);
  
  return () => {
    const index = lifeModeListeners.indexOf(callback);
    if (index > -1) {
      lifeModeListeners.splice(index, 1);
    }
  };
}

/**
 * Emit Life Mode change event
 */
export function emitLifeModeChange(mode: LifeMode) {
  const config = LIFE_MODES[mode];
  
  lifeModeListeners.forEach((listener) => {
    try {
      listener(mode, config);
    } catch (error) {
      console.error("[LifeMode] Listener error:", error);
    }
  });
}

/**
 * Set Life Mode and notify listeners
 */
export function setLifeModeWithNotification(mode: LifeMode): LifeModeConfig {
  const config = setLifeMode(mode);
  emitLifeModeChange(mode);
  return config;
}
