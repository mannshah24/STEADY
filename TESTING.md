# STEADY - Testing & Troubleshooting Guide

## ✅ What's Been Fixed

1. **Program ID Updated**

   - Rust program: `5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc`
   - TypeScript: Updated in `lib/solana.ts`
   - IDL: Updated with correct address field

2. **Anchor Integration**

   - Created `lib/anchor.ts` with all program methods
   - Added `toAnchorWallet()` helper for wallet conversion
   - Fixed Program instantiation with proper types

3. **Components Updated**
   - `ModeSelector.tsx` - Uses real Anchor calls
   - `PortfolioCard.tsx` - Fetches real data
   - `InitializeButton.tsx` - New component for first-time setup

## 🔍 Current Status

### TypeScript Compilation

- ✅ No TypeScript errors (using `any` for Program type to avoid Anchor version conflicts)
- ✅ All imports resolved
- ✅ Wallet adapter properly configured

### Features Status

#### 1. Wallet Connection

**Expected:** ✅ Should work

- Uses standard @solana/wallet-adapter-react
- PhantomWalletAdapter configured
- WalletProvider wrapping the app

**Test:** Connect Phantom wallet and verify address displays

---

#### 2. Portfolio Initialization

**Expected:** ⚠️ Needs testing

- Button shows when portfolio doesn't exist
- Calls `initializePortfolio()` instruction
- Creates PDA account with seeds ["portfolio", owner]

**Potential Issues:**

- Need SOL in wallet for transaction fees
- Program must be deployed to correct address
- Account size calculation must match (50 bytes)

**Test Steps:**

1. Connect wallet
2. Click "Initialize Portfolio" button
3. Approve transaction in Phantom
4. Check transaction on Solana Explorer

---

#### 3. Mode Selection

**Expected:** ⚠️ Needs portfolio initialized first

- Shows 3 modes: Safe, Balanced, Growth
- Calls `updateMode()` instruction
- Updates on-chain portfolio account

**Potential Issues:**

- Portfolio must be initialized first
- Enum format: `{ safe: {} }`, `{ balanced: {} }`, `{ growth: {} }`
- Must sign transaction

**Test Steps:**

1. Initialize portfolio (if not done)
2. Click on a mode (e.g., Balanced)
3. Approve transaction
4. Verify mode changed in PortfolioCard

---

#### 4. Portfolio Display

**Expected:** ✅ Partially works

- Shows wallet SOL balance (works without portfolio)
- Shows current mode (needs portfolio initialized)
- Shows mock allocation data

**Current Behavior:**

- Will show wallet balance even if portfolio not initialized
- Falls back to "Safe" mode if no portfolio

---

#### 5. Downside Protection

**Expected:** ⚠️ Not triggered automatically (needs manual call)

- Would need off-chain monitoring service
- Or manual trigger via `checkAndProtectDownside()`

**Note:** Automatic protection requires a crank/keeper service that monitors portfolio values and calls the instruction when needed.

---

## 🐛 Common Errors & Solutions

### Error: "Cannot read properties of undefined (reading '\_bn')"

**Cause:** Program not instantiated correctly
**Fix:** ✅ Fixed by using proper AnchorWallet conversion

### Error: "Portfolio not found"

**Cause:** Portfolio account doesn't exist yet
**Fix:** Click "Initialize Portfolio" button

### Error: "Account does not exist"

**Cause:** Trying to update mode before initializing
**Fix:** Initialize portfolio first

### Error: "Transaction failed"

**Possible Causes:**

1. Insufficient SOL for fees (need ~0.002 SOL)
2. Program not deployed to correct address
3. Network issues (devnet can be slow)

---

## 🧪 Testing Checklist

### Prerequisites

- [ ] Phantom wallet installed
- [ ] Wallet connected to Devnet
- [ ] Wallet has SOL (get from faucet: https://faucet.solana.com/)
- [ ] Program deployed to `5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc`

### Test Flow

1. **Start Dev Server**

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

2. **Connect Wallet**

   - [ ] Click "Connect Wallet"
   - [ ] Approve in Phantom
   - [ ] Verify address shows in navbar

3. **Initialize Portfolio**

   - [ ] Yellow warning banner appears
   - [ ] Click "Initialize Portfolio"
   - [ ] Approve transaction in Phantom
   - [ ] Wait for confirmation
   - [ ] Banner disappears

4. **Select Mode**

   - [ ] Click on Balanced mode
   - [ ] Approve transaction
   - [ ] Verify PortfolioCard shows "Balanced"

5. **Check Portfolio Display**
   - [ ] Verify SOL balance shows
   - [ ] Verify current mode displays
   - [ ] Check allocation bars render

---

## 🔧 Debugging Steps

### 1. Check Program Deployment

```bash
solana program show 5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc --url devnet
```

### 2. Monitor Program Logs

```bash
solana logs 5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc --url devnet
```

### 3. Check Account Exists

```bash
solana account <PORTFOLIO_PDA> --url devnet
```

To get PDA:

```javascript
// In browser console
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("portfolio"), wallet.publicKey.toBuffer()],
  new PublicKey("5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc")
);
console.log(pda.toString());
```

### 4. Browser Console

Press F12 and check for errors. Common patterns:

- Network errors → Check devnet connection
- Transaction errors → Check SOL balance
- Account errors → Initialize portfolio

---

## 📝 Manual Testing Commands

### In Browser Console (after connecting wallet):

```javascript
// Import helpers
import { toAnchorWallet, initializePortfolio } from "./lib/anchor";

// Get wallet from React context (already connected)
const wallet = window.solana; // Or from useWallet hook

// Test initialization
const anchorWallet = toAnchorWallet(wallet);
const tx = await initializePortfolio(anchorWallet);
console.log("Transaction:", tx);
```

---

## 🚀 What Should Work

1. ✅ **Visual UI** - All components render
2. ✅ **Wallet Connection** - Standard Phantom integration
3. ✅ **Balance Display** - Shows real wallet SOL
4. ⚠️ **Portfolio Init** - Needs testing with real transaction
5. ⚠️ **Mode Updates** - Needs portfolio initialized first
6. ✅ **Animations** - Rebalance demo (mock data)

---

## 🎯 Known Limitations

1. **No Automatic Protection**
   - Downside protection requires manual trigger
   - Would need off-chain keeper service for automation
2. **Mock Price Data**

   - Using hardcoded prices instead of Pyth oracles
   - For demo purposes only

3. **No Real Asset Management**

   - UI shows mock allocations
   - Actual token swaps not implemented

4. **Devnet Only**
   - All transactions on Solana Devnet
   - Not production-ready

---

## 💡 Next Steps for Full Functionality

1. **Deploy & Verify Program**

   ```bash
   anchor build
   anchor deploy
   ```

2. **Test Each Instruction**

   - Initialize portfolio ✓
   - Update mode ✓
   - Check downside protection ✓

3. **Add Real Price Feeds**

   - Integrate Pyth Network
   - Replace mock `getSolUsdPrice()`

4. **Build Keeper Service**

   - Monitor portfolio values
   - Auto-trigger protection
   - Could use Clockwork for scheduling

5. **Add Asset Management**
   - Integrate Jupiter for swaps
   - Implement actual rebalancing
   - Track real asset allocations

---

## 📞 Support

If features still don't work, please provide:

1. Specific error message from browser console
2. Transaction signature (if any)
3. Which feature isn't working
4. Wallet public key (for checking account state)

**View deployed program:**
https://explorer.solana.com/address/5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc?cluster=devnet
