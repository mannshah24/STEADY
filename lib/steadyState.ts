/**
 * lib/steadyState.ts
 * 
 * Global state management for STEADY platform activation
 * Tracks whether user has completed onboarding and activated the platform
 * 
 * Uses localStorage for persistence (client-side only, no backend)
 */

const STEADY_ACTIVE_KEY = "steady_activated";
const RISK_PERSONALITY_KEY = "steady_risk_personality";

export type RiskPersonality = "Conservative" | "Adaptive" | "Aggressive";

/**
 * Check if STEADY platform is activated for current user
 */
export function isSteadyActive(): boolean {
  if (typeof window === "undefined") return false; // SSR safety
  const stored = localStorage.getItem(STEADY_ACTIVE_KEY);
  return stored === "true";
}

/**
 * Activate STEADY platform
 * Called after user completes activation flow
 */
export function activateSteady(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STEADY_ACTIVE_KEY, "true");
  console.log("✅ STEADY platform activated");
}

/**
 * Reset STEADY activation (for demo/testing purposes)
 */
export function resetSteady(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STEADY_ACTIVE_KEY);
  localStorage.removeItem(RISK_PERSONALITY_KEY);
  console.log("🔄 STEADY platform reset");
}

/**
 * Store user's selected risk personality
 */
export function setRiskPersonality(personality: RiskPersonality): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RISK_PERSONALITY_KEY, personality);
}

/**
 * Get stored risk personality
 */
export function getRiskPersonality(): RiskPersonality | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(RISK_PERSONALITY_KEY);
  return stored as RiskPersonality | null;
}

/**
 * Map risk personality to investment mode
 * Used to initialize portfolio with user's preferred strategy
 */
export function getDefaultModeForPersonality(personality: RiskPersonality): "Safe" | "Balanced" | "Growth" {
  switch (personality) {
    case "Conservative":
      return "Safe";
    case "Adaptive":
      return "Balanced";
    case "Aggressive":
      return "Growth";
  }
}
