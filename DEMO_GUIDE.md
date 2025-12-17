# 🚀 QUICK START - Hackathon Demo

## Run the App (30 seconds)

```powershell
# 1. Install dependencies (if not done)
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Visit: http://localhost:3000
```

## Demo Flow (2 minutes)

### 1. **Connect Wallet** (15 sec)

- Click "Connect Wallet" in navbar
- Select Phantom
- Approve connection

### 2. **Initialize Portfolio** (15 sec)

- Click "Initialize Your Portfolio" button
- Sign transaction
- Wait for confirmation

### 3. **Explore Dashboard** (30 sec)

Scroll down to see:

- ✅ **Portfolio Card** - Real-time value with animated allocations
- ✅ **Risk Meter** - Circular gauge showing Low/Medium/High risk
- ✅ **Panic Button** - Emergency "Move to Safe" action
- ✅ **Reasoning Panel** - Terminal showing AI thinking
- ✅ **Protection Timeline** - Event history with timestamps
- ✅ **What-If Simulator** - Test market scenarios

### 4. **Test What-If Scenarios** (20 sec)

- Click "SOL -20%" in simulator
- See drawdown calculation
- Notice "WILL TRIGGER" protection warning
- Click "SOL +30%" to see gains

### 5. **Watch AI Reasoning** (15 sec)

- Observe terminal messages in ReasoningPanel
- See periodic monitoring logs
- Notice color-coded messages (green/blue/yellow/red)

### 6. **Change Mode** (20 sec)

- Scroll to "Choose Your Investment Mode"
- Click "Balanced" or "Growth"
- Sign transaction
- Watch:
  - AI Reasoning reacts
  - Timeline adds new event
  - Allocation bars morph
  - Risk Meter updates

### 7. **Emergency Action** (30 sec)

If in Growth/Balanced:

- Scroll back to Panic Button
- Click "MOVE TO SAFE NOW"
- Review confirmation modal
- Click "Confirm"
- Sign transaction
- Watch everything update

---

## Judge Q&A Prep

### Q: "Is this actually on-chain?"

**A**: Yes! Open browser console (F12) to see transaction signatures. Copy any signature and paste it into Solana Explorer (devnet) to verify.

### Q: "How does downside protection work?"

**A**: The smart contract tracks your portfolio's peak value. When current value drops 10% below peak, it automatically switches to Safe mode (20% SOL / 80% USDC). This limits further losses.

### Q: "Is it custodial?"

**A**: No! Your funds stay in your wallet. You sign every transaction. The smart contract only tracks state (mode, peak value). No one can access your funds.

### Q: "What's innovative here?"

**A**:

1. **Technical**: Manual transaction building to bypass Anchor client bugs
2. **UX**: What-If simulator lets users test scenarios without risk
3. **Transparency**: AI Reasoning Panel shows system thinking
4. **Utility**: Panic Button for emergency protection

### Q: "Can I see the smart contract?"

**A**: Yes! Program ID: `5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc`  
View on Solana Explorer: https://explorer.solana.com/address/5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc?cluster=devnet

### Q: "What if I don't have SOL?"

**A**:

1. Visit https://solfaucet.com
2. Paste your Phantom wallet address
3. Request devnet SOL (free)
4. Wait 30 seconds
5. Refresh app

### Q: "How did you build this so fast?"

**A**:

1. **Anchor framework** for smart contracts
2. **Next.js 14** for frontend
3. **Framer Motion** for animations
4. **TailwindCSS** for styling
5. **Manual transaction building** (workaround Anchor client issues)

---

## Key Features to Highlight

### 🔬 WhatIfSimulator

> "Test market scenarios without risking real funds"

- Shows judges you thought about UX
- Interactive = memorable

### 🤖 ReasoningPanel

> "Transparency into system logic"

- Builds trust with users
- Judges love seeing "AI reasoning"

### 📊 RiskMeter

> "Instant portfolio health check"

- Visual = judges understand immediately
- Green/Yellow/Red = universal

### 🚨 PanicButton

> "Emergency protection in one click"

- Shows real utility
- Judges remember "panic features"

### ⏱️ ProtectionTimeline

> "Full audit trail of portfolio events"

- Transparency = trust
- Every action logged

---

## Common Issues & Fixes

### Issue: "Wallet not connecting"

**Fix**:

1. Install Phantom wallet extension
2. Create/import wallet
3. Switch to Devnet in Phantom settings
4. Refresh page

### Issue: "Transaction failing"

**Fix**:

1. Ensure you have devnet SOL (>0.1 SOL)
2. Check Phantom is on Devnet (not Mainnet)
3. Try again (network congestion)

### Issue: "Portfolio not showing value"

**Fix**:

1. Wait 3 seconds (auto-refresh)
2. Check you clicked "Initialize Portfolio"
3. Verify transaction confirmed in Phantom

### Issue: "Animations not smooth"

**Fix**:

1. Close other browser tabs
2. Use Chrome/Edge (best performance)
3. Disable browser extensions temporarily

---

## Pro Tips for Demo

1. **Pre-initialize portfolio** before demo starts (saves time)
2. **Have Solana Explorer open** in another tab (show on-chain proof)
3. **Zoom browser to 125%** so judges can see clearly
4. **Use light mode** on Solana Explorer for projector visibility
5. **Have console open** to show transaction signatures
6. **Practice the 2-minute flow** 3 times before judging

---

## Architecture Diagram (For Technical Judges)

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌────────────┬──────────────┬─────────────────────┐   │
│  │ Dashboard  │  Components  │   Animations        │   │
│  │ - Grid     │  - WhatIf    │   - Framer Motion   │   │
│  │ - Scroll   │  - Reasoning │   - Spring Physics  │   │
│  │ - State    │  - RiskMeter │   - Glow Effects    │   │
│  └────────────┴──────────────┴─────────────────────┘   │
│                          ↕                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Wallet Adapter (Phantom)                  │   │
│  │         - Sign Transactions                       │   │
│  │         - Send to Solana                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│              SOLANA BLOCKCHAIN (Devnet)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Smart Contract (Anchor Program)                │   │
│  │   - initialize_portfolio                         │   │
│  │   - update_mode                                  │   │
│  │   - check_and_protect_downside                   │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↕                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Portfolio Account (PDA)                        │   │
│  │   - owner: PublicKey                             │   │
│  │   - current_mode: InvestmentMode                 │   │
│  │   - peak_value: u64                              │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↕                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Pyth Price Oracle                              │   │
│  │   - SOL/USD price feed                           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Checklist

- [x] Smart contract deployed to devnet
- [x] Program ID updated in frontend
- [x] All components created
- [x] Animations working
- [x] TypeScript errors fixed
- [x] Mobile responsive
- [x] README updated
- [x] Demo flow documented
- [ ] Test on fresh wallet (do this before demo!)
- [ ] Practice 2-minute demo
- [ ] Prepare for Q&A

---

## Contact

**Program ID**: `5wDgh1rWWGb4ug1d6yZ81BySCVUct2X5MATR3JiCDCBc`  
**Network**: Solana Devnet  
**Demo URL**: http://localhost:3000

---

**Status**: ✅ READY TO DEMO  
**Last Updated**: 2024 (Hackathon Version)
