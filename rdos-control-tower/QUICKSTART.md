# rDOS Asset Strategy Control Tower - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd rdos-control-tower
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will automatically open at `http://localhost:3001`

### 3. Explore the Platform

Start with these screens in order:

1. **Control Tower** (default landing page)
   - View KPIs, market health, and agent status
   - Click "Open Agent Intelligence Console" to see detailed agent monitoring
   
2. **Strategy Workbench**
   - Click any asset in the worklist to see detailed decision analysis
   - Review Agent Reasoning Map and evidence
   - Try the SME Feedback buttons (thumbs up/down)

3. **Simulator**
   - Click "Run Preset" for the demo stress-test
   - Watch guardrails apply and plan adjust in real-time
   - Generate and export scenarios

4. **Governance**
   - View approval workflows
   - Click "View" on any case to see dossier details
   - Check audit trail and policy enforcement

5. **Alerts**
   - Monitor risk, compliance, and data quality issues
   - Explore Data Quality Hub
   - Test "Fix Now" actions

6. **My Tasks**
   - See personal worklist
   - Filter by status (Due Today, Over SLA, etc.)

## 💬 Try the rDOS Chat Assistant

Click the blue chat icon in the bottom-right corner and try:
- "Show assets with RUL <60 days in APAC"
- "Why refurb vs renew for Asset 12783?"
- "Run demo preset stress-test"
- "Generate Strategy Pack for UK market"

## 🎯 Demo Flow for Presentations

1. Start at Control Tower - show overview
2. Open Agent Intelligence Console - explain agent architecture
3. Navigate to asset in Workbench - show reasoning transparency
4. Run Simulator stress-test - demonstrate guardrails
5. Check Governance - show approval workflow
6. Use Chat Assistant - show AI interaction

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # Code quality check
```

## 🏗️ Tech Stack Summary

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router v7
- **State**: Jotai
- **Build**: Vite

## 📚 Key Concepts

### Agent Reasoning Map
Shows transparent decision flow: Signal → Threshold → Impact → Recommendation

### Guardrail Badges
Click any amber badge to see the rule, reason, and policy reference

### Confidence Meter
Color-coded (green/yellow/red) with percentage based on:
- Model confidence × Evidence strength × Data completeness

### Time Machine
Top-right dropdown: view historical or projected states

### Strategy Pack
One-click generation of executive summary with all key metrics

## 🔧 Customization

Edit `src/constants.ts` to modify:
- Agent definitions and KPIs
- Sample assets and cases
- Market data
- Demo stress-test presets

## 🐛 Troubleshooting

**Port 3001 already in use?**
Edit `vite.config.ts` and change the port number.

**Charts not rendering?**
Ensure window is wide enough. Recharts require minimum dimensions.

**Types errors?**
Run `npm run type-check` to see full error details.

## 📞 Support

For questions or issues, refer to the main README.md for detailed documentation.

---

**Built with ❤️ for asset strategy optimization**
