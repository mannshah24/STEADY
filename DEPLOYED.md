# STEADY - Deployed Program Guide

## Program Information

**Program ID:** `5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc`

**Network:** Solana Devnet

**IDL Location:** `target/idl/steady.json`

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Program Instructions

### Initialize Portfolio

Creates a new portfolio account for a user.

```typescript
import { initializePortfolio } from "@/lib/anchor";

const tx = await initializePortfolio(wallet);
console.log("Portfolio initialized:", tx);
```

**Accounts:**

- `portfolio` (PDA): Seeds = ["portfolio", owner]
- `owner` (signer): The wallet creating the portfolio
- `systemProgram`: Solana system program

**State:**

- Initial mode: Safe
- Last peak value: 0
- Owner: Connected wallet

---

### Update Mode

Changes the investment mode (Safe/Balanced/Growth).

```typescript
import { updateMode, InvestmentMode } from "@/lib/anchor";

const tx = await updateMode(wallet, InvestmentMode.Balanced);
console.log("Mode updated:", tx);
```

**Accounts:**

- `portfolio` (PDA): Must be owned by signer
- `owner` (signer): Portfolio owner

**Arguments:**

- `newMode`: `InvestmentMode` enum (Safe | Balanced | Growth)

---

### Check Downside Protection

Monitors portfolio value and triggers automatic protection at 10% drawdown.

```typescript
import { checkAndProtectDownside } from "@/lib/anchor";

const currentValue = 5000; // in lamports or base units
const tx = await checkAndProtectDownside(wallet, currentValue);
console.log("Downside check complete:", tx);
```

**Accounts:**

- `portfolio` (PDA): Portfolio to monitor
- `caller` (signer): Can be anyone (allows automated monitoring)

**Arguments:**

- `currentValue`: Current portfolio value (u64)

**Logic:**

1. If `currentValue > lastPeakValue` → Update peak (portfolio growing)
2. If `currentValue < lastPeakValue` → Calculate drawdown
3. If drawdown ≥ 10% → Auto-switch to Safe mode + emit event

---

## Fetching Portfolio Data

```typescript
import { fetchPortfolio } from "@/lib/anchor";

const portfolio = await fetchPortfolio(wallet);

if (portfolio) {
  console.log("Owner:", portfolio.owner.toString());
  console.log("Mode:", portfolio.currentMode);
  console.log("Peak Value:", portfolio.lastPeakValue);
  console.log("Bump:", portfolio.bump);
}
```

## Events

### DownsideProtectionTriggered

Emitted when the 10% drawdown threshold is hit.

```typescript
import { subscribeToProtectionEvents } from "@/lib/anchor";

const unsubscribe = subscribeToProtectionEvents(wallet, (event) => {
  console.log("🚨 Protection triggered!");
  console.log("Owner:", event.owner);
  console.log("Drawdown:", event.drawdownPercentage + "%");
  console.log("Peak:", event.peakValue);
  console.log("Current:", event.currentValue);
  console.log("Old Mode:", event.oldMode);
});

// Later: unsubscribe()
```

## Account Structure

### Portfolio Account

**Size:** 50 bytes

```rust
pub struct Portfolio {
    pub owner: Pubkey,           // 32 bytes
    pub last_peak_value: u64,    // 8 bytes
    pub current_mode: InvestmentMode, // 1 byte (enum)
    pub bump: u8,                // 1 byte
}
// + 8 bytes discriminator
```

**PDA Seeds:** `["portfolio", owner_pubkey]`

## Investment Modes

```typescript
enum InvestmentMode {
  Safe, // Conservative - capital preservation
  Balanced, // Moderate risk/reward
  Growth, // Aggressive growth strategy
}
```

**All modes include 10% automatic downside protection.**

## Error Codes

| Code | Name         | Message                                      |
| ---- | ------------ | -------------------------------------------- |
| 6000 | Unauthorized | Only portfolio owner can perform this action |
| 6001 | InvalidValue | Value must be greater than 0                 |
| 6002 | MathOverflow | Calculation overflow                         |

## Development Workflow

### Test on Devnet

```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy

# Run tests
anchor test
```

### View Logs

```bash
solana logs 5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc
```

### Check Program Account

```bash
solana program show 5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc
```

## Integration Checklist

- ✅ Program deployed to Devnet
- ✅ Program ID updated in code
- ✅ IDL generated at `target/idl/steady.json`
- ✅ Anchor utilities in `lib/anchor.ts`
- ✅ Components integrated with on-chain calls
- ✅ Wallet adapter configured
- ⏳ Initialize portfolio for first-time users
- ⏳ Test mode switching on Devnet
- ⏳ Test downside protection logic

## Next Steps

1. **Connect Phantom Wallet** on the frontend
2. **Initialize Portfolio** for your wallet (one-time setup)
3. **Test Mode Selection** - Switch between Safe/Balanced/Growth
4. **Trigger Protection** - Test with mock value drops to see auto-protection
5. **Monitor Events** - Watch for DownsideProtectionTriggered events

## Support

- Program ID: `BfP88RADU3yTpcqZzwfA3NFHGGtAC55ec19Ei4QabUbG`
- Network: Devnet
- Explorer: https://explorer.solana.com/address/BfP88RADU3yTpcqZzwfA3NFHGGtAC55ec19Ei4QabUbG?cluster=devnet
