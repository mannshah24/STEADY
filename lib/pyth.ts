/**
 * lib/pyth.ts
 * 
 * Pyth Network price oracle integration for STEADY
 * 
 * ORACLE TRUST MODEL:
 * - Pyth aggregates prices from 90+ first-party data providers (exchanges, market makers)
 * - Multiple providers publish prices → Pyth aggregates → High confidence data
 * - On-chain verification: Anyone can verify price data is signed by Pyth
 * - Decentralized: No single point of failure for price feeds
 * - STEADY uses Pyth for portfolio valuation and downside protection triggers
 * 
 * NOTE: For MVP demo, using mock price data
 * TODO: Integrate real Pyth price feeds after installing @pythnetwork/client
 */

// ============================================================================
// Mock Price Data (for demo)
// ============================================================================

/**
 * Fetch current SOL/USD price
 * 
 * @returns Price in USD or null if fetching fails
 * 
 * Frontend usage:
 * ```
 * const price = await getSolUsdPrice();
 * if (price) {
 *   console.log(`SOL price: $${price}`);
 * }
 * ```
 */
export async function getSolUsdPrice(): Promise<number | null> {
  try {
    // Mock price for demo (in production, fetch from Pyth)
    // TODO: Replace with real Pyth oracle integration
    // const connection = new Connection(DEVNET_RPC);
    // const pythClient = new PythHttpClient(connection, getPythProgramKeyForCluster("devnet"));
    // const data = await pythClient.getData();
    
    // Return mock SOL price for demo
    const mockPrice = 200 + Math.random() * 20; // $200-220 range
    return Number(mockPrice.toFixed(2));
  } catch (error) {
    console.error("Failed to fetch SOL/USD price:", error);
    return null;
  }
}

/**
 * Fetch SOL/USD price with loading state
 * Helper for React components
 * 
 * @returns Object with price, loading, and error states
 */
export async function fetchSolPrice(): Promise<{
  price: number | null;
  error: string | null;
}> {
  try {
    const price = await getSolUsdPrice();
    
    if (price === null) {
      return {
        price: null,
        error: "Failed to fetch price",
      };
    }

    return {
      price,
      error: null,
    };
  } catch (error) {
    return {
      price: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
