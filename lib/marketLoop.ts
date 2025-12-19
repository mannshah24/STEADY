/**
 * lib/marketLoop.ts
 * 
 * STEADY Market Monitoring Loop (LIFE-AWARE)
 * 
 * Purpose:
 * This is the HEARTBEAT of STEADY. Runs continuously (every 30-60s) to:
 * - Monitor SOL price changes
 * - Calculate volatility and drawdown
 * - Update risk state (LIFE-AWARE)
 * - Generate reasoning messages (LIFE-CONTEXTUAL)
 * - Trigger alerts when needed (LIFE-SENSITIVE)
 * 
 * Philosophy:
 * Even when no action is needed, we log "all clear" messages.
 * This makes STEADY feel ALIVE and ACTIVELY MONITORING.
 * 
 * LIFE-AWARE LOGIC:
 * Same market conditions → different responses based on Life Mode.
 * When you're sleeping, STEADY is more protective.
 * When you're growing, STEADY gives you room.
 * 
 * Frontend-only: No backend servers. Uses Pyth oracle or mocked data.
 */

import { getSolUsdPrice } from "./pyth";
import {
  getCurrentLifeMode,
  getLifeModeConfig,
  shouldAlertForLifeMode,
  getLifeModeStatusMessage,
  type LifeMode,
} from "./lifeModeEngine";

// ==========================================
// TYPES
// ==========================================

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface MarketState {
  currentPrice: number;
  previousPrice: number;
  peakPrice: number;
  priceChange: number; // % change since last check
  drawdown: number; // % down from peak
  volatility: number; // Simple rolling volatility
  riskLevel: RiskLevel;
  lastUpdate: number; // timestamp
}

export interface MarketEvent {
  timestamp: number;
  type: "info" | "warning" | "critical" | "action";
  message: string;
  data?: any;
}

// ==========================================
// GLOBAL STATE (Frontend-only)
// ==========================================

let marketState: MarketState = {
  currentPrice: 0,
  previousPrice: 0,
  peakPrice: 0,
  priceChange: 0,
  drawdown: 0,
  volatility: 0,
  riskLevel: "low",
  lastUpdate: 0,
};

let priceHistory: number[] = []; // Rolling window for volatility
const HISTORY_SIZE = 10; // Keep last 10 prices

// Event listeners (components subscribe to get updates)
type EventCallback = (event: MarketEvent) => void;
type StateCallback = (state: MarketState) => void;

const eventListeners: EventCallback[] = [];
const stateListeners: StateCallback[] = [];

// ==========================================
// LOOP CONTROL
// ==========================================

let loopInterval: NodeJS.Timeout | null = null;
let isRunning = false;
const LOOP_INTERVAL_MS = 45000; // 45 seconds (between 30-60s)

/**
 * Start the market monitoring loop
 * Call this when STEADY is activated
 */
export function startMarketLoop() {
  if (isRunning) {
    console.log("[MarketLoop] Already running");
    return;
  }

  console.log("[MarketLoop] 🚀 Starting market monitoring...");
  isRunning = true;

  // Initialize state immediately
  evaluateMarket();

  // Then run on interval
  loopInterval = setInterval(() => {
    evaluateMarket();
  }, LOOP_INTERVAL_MS);

  emitEvent({
    timestamp: Date.now(),
    type: "info",
    message: "Market monitoring activated",
  });
}

/**
 * Stop the market monitoring loop
 * Call this when STEADY is deactivated
 */
export function stopMarketLoop() {
  if (!isRunning) return;

  console.log("[MarketLoop] ⏸️ Stopping market monitoring...");
  isRunning = false;

  if (loopInterval) {
    clearInterval(loopInterval);
    loopInterval = null;
  }

  emitEvent({
    timestamp: Date.now(),
    type: "info",
    message: "Market monitoring paused",
  });
}

/**
 * Check if loop is currently running
 */
export function isMarketLoopRunning(): boolean {
  return isRunning;
}

/**
 * Get current loop interval in milliseconds
 */
export function getLoopInterval(): number {
  return LOOP_INTERVAL_MS;
}

// ==========================================
// CORE EVALUATION LOGIC
// ==========================================

/**
 * Main evaluation function - runs on each loop cycle
 * This is where STEADY "thinks"
 */
async function evaluateMarket() {
  const startTime = Date.now();
  console.log("[MarketLoop] 🔍 Evaluating market...");

  try {
    // 1. Fetch current SOL price
    const currentPrice = await fetchCurrentPrice();

    // 2. Update price history
    priceHistory.push(currentPrice);
    if (priceHistory.length > HISTORY_SIZE) {
      priceHistory.shift(); // Remove oldest
    }

    // 3. Calculate metrics
    const previousPrice = marketState.currentPrice || currentPrice;
    const peakPrice = Math.max(marketState.peakPrice, currentPrice);
    const priceChange = previousPrice > 0 
      ? ((currentPrice - previousPrice) / previousPrice) * 100 
      : 0;
    const drawdown = peakPrice > 0 
      ? ((peakPrice - currentPrice) / peakPrice) * 100 
      : 0;
    const volatility = calculateVolatility();

    // 4. Determine risk level
    const riskLevel = determineRiskLevel(drawdown, volatility);

    // 5. Update state
    marketState = {
      currentPrice,
      previousPrice,
      peakPrice,
      priceChange,
      drawdown,
      volatility,
      riskLevel,
      lastUpdate: Date.now(),
    };

    // 6. Emit state update to listeners
    emitStateUpdate(marketState);

    // 7. Generate reasoning and alerts
    generateReasoningMessages(marketState);
    evaluateAlerts(marketState);

    const duration = Date.now() - startTime;
    console.log(`[MarketLoop] ✅ Evaluation complete (${duration}ms)`);

  } catch (error) {
    console.error("[MarketLoop] ❌ Evaluation failed:", error);
    emitEvent({
      timestamp: Date.now(),
      type: "warning",
      message: "Market evaluation failed. Retrying next cycle.",
    });
  }
}

/**
 * Fetch current SOL price
 * Try Pyth oracle, fallback to mock data for demo
 */
async function fetchCurrentPrice(): Promise<number> {
  try {
    const price = await getSolUsdPrice();
    if (price && price > 0) {
      return price;
    }
  } catch (error) {
    console.warn("[MarketLoop] Pyth fetch failed, using mock data");
  }

  // Fallback: Generate realistic mock price with slight volatility
  const basePrice = 210; // SOL baseline
  const volatility = (Math.random() - 0.5) * 10; // ±$5 movement
  return basePrice + volatility;
}

/**
 * Calculate volatility based on recent price history
 * Simple standard deviation of % changes
 */
function calculateVolatility(): number {
  if (priceHistory.length < 2) return 0;

  const changes: number[] = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const change = ((priceHistory[i] - priceHistory[i - 1]) / priceHistory[i - 1]) * 100;
    changes.push(change);
  }

  const mean = changes.reduce((sum, val) => sum + val, 0) / changes.length;
  const variance = changes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / changes.length;
  const stdDev = Math.sqrt(variance);

  return Math.abs(stdDev);
}

/**
 * Determine risk level based on drawdown and volatility
 * LIFE-AWARE: Uses Life Mode thresholds instead of fixed values
 */
function determineRiskLevel(drawdown: number, volatility: number): RiskLevel {
  const lifeMode = getCurrentLifeMode();
  const config = getLifeModeConfig();
  
  // Use Life Mode specific threshold
  const threshold = config.drawdownThreshold;
  
  // Critical: At or above threshold
  if (drawdown >= threshold) return "critical";
  
  // High: Approaching threshold (80% of threshold)
  if (drawdown >= threshold * 0.8) return "high";
  
  // Moderate: Some movement detected (50% of threshold)
  if (drawdown >= threshold * 0.5 || volatility >= 1.5) return "moderate";
  
  // Low: All clear
  return "low";
}

/**
 * Generate reasoning messages for the Reasoning Panel
 * These are the "thoughts" of STEADY (LIFE-AWARE)
 */
function generateReasoningMessages(state: MarketState) {
  const messages: string[] = [];
  const lifeMode = getCurrentLifeMode();
  const config = getLifeModeConfig();

  // Always start with life-aware evaluation
  messages.push(`Monitoring market in ${config.label}...`);
  messages.push(getLifeModeStatusMessage(lifeMode));

  // Price change commentary (human-first language)
  if (Math.abs(state.priceChange) < 0.5) {
    messages.push("Markets are stable. You're covered.");
  } else if (state.priceChange > 0) {
    messages.push(`Markets moving up ${state.priceChange.toFixed(2)}%. No action needed.`);
  } else {
    messages.push(`Markets down ${Math.abs(state.priceChange).toFixed(2)}%. Watching closely.`);
  }

  // Drawdown commentary (life-contextual)
  const threshold = config.drawdownThreshold;
  if (state.drawdown < threshold * 0.3) {
    messages.push("Portfolio healthy. Protection ready if needed.");
  } else if (state.drawdown < threshold * 0.7) {
    messages.push(`Drawdown at ${state.drawdown.toFixed(1)}%. Within ${config.label} tolerance.`);
  } else if (state.drawdown < threshold) {
    if (lifeMode === "sleep" || lifeMode === "focus") {
      messages.push(`Drawdown at ${state.drawdown.toFixed(1)}%. Preparing protective measures.`);
    } else {
      messages.push(`Drawdown at ${state.drawdown.toFixed(1)}%. Monitoring for your comfort.`);
    }
  } else {
    messages.push(`Protection threshold reached for ${config.label}.`);
  }

  // Final reassurance (always)
  if (state.drawdown < threshold) {
    messages.push("No action needed. You're protected.");
  }

  // Emit each message with slight delay for realistic feel
  messages.forEach((msg, index) => {
    setTimeout(() => {
      emitEvent({
        timestamp: Date.now(),
        type: "info",
        message: msg,
      });
    }, index * 200); // Stagger messages by 200ms
  });
}

/**
 * Evaluate if any alerts should be triggered (LIFE-AWARE)
 * Same market → different alerts based on Life Mode
 */
function evaluateAlerts(state: MarketState) {
  const lifeMode = getCurrentLifeMode();
  const config = getLifeModeConfig();
  const threshold = config.drawdownThreshold;
  
  // Use Life Mode logic to determine alert
  const alertDecision = shouldAlertForLifeMode(
    state.drawdown,
    state.volatility,
    lifeMode
  );
  
  // CRITICAL: At threshold
  if (state.drawdown >= threshold) {
    emitEvent({
      timestamp: Date.now(),
      type: "critical",
      message: `Protection activated for ${config.label}. You're safe.`,
    });
    return;
  }
  
  // WARNING: Approaching threshold (based on Life Mode sensitivity)
  if (alertDecision.shouldAlert && alertDecision.severity === "warning") {
    const proximityPercent = Math.round((state.drawdown / threshold) * 100);
    emitEvent({
      timestamp: Date.now(),
      type: "warning",
      message: `Drawdown at ${state.drawdown.toFixed(1)}% (${proximityPercent}% of your ${config.label} threshold). Watching for you.`,
    });
    return;
  }
  
  // INFO: All clear (life-contextual message)
  if (state.riskLevel === "low" && state.drawdown < threshold * 0.5) {
    const messages = {
      sleep: "Markets calm while you rest. Sleep peacefully.",
      focus: "All clear. Focus on what matters.",
      growth: "Markets stable. Growth mode active.",
      panic: "Full protection active. You're completely safe.",
    };
    
    emitEvent({
      timestamp: Date.now(),
      type: "info",
      message: messages[lifeMode],
    });
  }
}

// ==========================================
// EVENT SYSTEM (PubSub Pattern)
// ==========================================

/**
 * Subscribe to market events (alerts, messages)
 */
export function onMarketEvent(callback: EventCallback): () => void {
  eventListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  };
}

/**
 * Subscribe to market state updates
 */
export function onMarketStateUpdate(callback: StateCallback): () => void {
  stateListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = stateListeners.indexOf(callback);
    if (index > -1) {
      stateListeners.splice(index, 1);
    }
  };
}

/**
 * Emit event to all listeners
 */
function emitEvent(event: MarketEvent) {
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error("[MarketLoop] Event listener error:", error);
    }
  });
}

/**
 * Emit state update to all listeners
 */
function emitStateUpdate(state: MarketState) {
  stateListeners.forEach((listener) => {
    try {
      listener(state);
    } catch (error) {
      console.error("[MarketLoop] State listener error:", error);
    }
  });
}

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Get current market state (for components that need it immediately)
 */
export function getMarketState(): MarketState {
  return { ...marketState };
}

/**
 * Manually trigger a market evaluation (for testing)
 */
export function triggerEvaluation() {
  if (!isRunning) {
    console.warn("[MarketLoop] Cannot trigger evaluation - loop not running");
    return;
  }
  evaluateMarket();
}
