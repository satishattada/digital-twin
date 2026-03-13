# rDOS — Asset Strategy Control Tower (v1.2)

An agent-driven control tower that senses → predicts → optimizes → governs asset strategy across markets and asset classes.

## What is rDOS?

rDOS is an intelligent asset strategy platform that provides:
- **Agent Reasoning Map** - Transparent Signal → Threshold → Impact → Recommendation flow
- **Guardrail Governance** - Policy-aligned decisions with "why" tooltips
- **Stress Testing** - Scenario simulation with demo presets
- **Data Quality Impact** - Confidence scoring based on data completeness
- **Strategy Pack Generation** - One-click executive summaries
- **Time Machine** - Historical and predictive views

## Key Outcomes

- Better timing of interventions (renew/refurb/retire)
- Higher renewal adherence
- Optimized capex/ROI
- Reduced downtime
- Faster approvals
- Consistent, policy-aligned decisions globally

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint
```

The application will open automatically at `http://localhost:3001`

## Architecture

The application consists of 6 main screens:
1. **Control Tower** - Executive dashboard with agent cards and worklist
2. **Strategy Workbench** - Deep-dive asset decisions with reasoning
3. **Simulator** - Guardrails and stress-test scenarios
4. **Governance** - Case management and audit trail
5. **Alerts** - Risk, compliance, data quality monitoring
6. **My Tasks** - Personal worklist and approvals

## Five Core Agents

- **Baseline Intelligence Agent (BIA)** - Asset harmonization
- **Performance & Risk Insight Agent (PRIA)** - Degradation detection
- **Lifecycle Prediction Agent (LPA)** - RUL forecasting
- **Capex Prioritization Agent (CPA)** - Investment optimization
- **Governance & Dossier Agent (GDA)** - Approval automation

## Key Features

### Agent Intelligence Console
Single cockpit to monitor all agents with:
- Status & inputs health
- What changed today
- Outputs & explainability
- Guardrails in effect
- Live controls

### Signature UX Components
- **Agent Reasoning Map** - Step-by-step decision logic
- **Guardrail Badges** - Hover tooltips with "why" + rule drawer
- **Confidence Meter** - Visual confidence scoring
- **Evidence Chips** - Supporting data indicators
- **SLO Ribbon** - Performance metrics always visible
- **rDOS Chat Assistant** - Voice/text command interface

### Demo Stress-Test Preset
Deterministic scenario for reliable on-stage demos:
- "Parts shortage (EU) + 10% Inflation"
- Reprioritizes 7 renewals
- Shows ROI and risk deltas
- Displays guardrail enforcement

### rDOS Strategy Pack
One-click generation/sending with:
- KPI summary
- Risk maps
- Priority assets with reasoning
- Capex plan (ROI/NPV)
- Compliance posture
- Stress-test results

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for visualization
- React Router for navigation
- Jotai for state management

## Project Structure

```
rdos-control-tower/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AgentIntelligenceConsole.tsx
│   │   ├── ReasoningMap.tsx
│   │   ├── GuardrailBadge.tsx
│   │   ├── ConfidenceMeter.tsx
│   │   ├── EvidenceChips.tsx
│   │   ├── SLORibbon.tsx
│   │   ├── ChatAssistant.tsx
│   │   └── Layout.tsx
│   ├── pages/                # Main application screens
│   │   ├── ControlTowerPage.tsx
│   │   ├── StrategyWorkbenchPage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── GovernancePage.tsx
│   │   ├── AlertsPage.tsx
│   │   └── MyTasksPage.tsx
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # Mock data & configuration
│   ├── App.tsx               # Root component
│   ├── index.tsx             # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage Tips

### For Demos
1. Start with **Control Tower** to show overview and agent status
2. Click "Open Agent Intelligence Console" to deep-dive into agents
3. Navigate to **Simulator** and use "Demo Preset" for consistent results
4. Show **Strategy Workbench** to drill into asset-level decisions
5. Use **Governance** to demonstrate approval workflows
6. Interact with **rDOS Chat Assistant** (bottom-right) for natural language queries

### Chat Assistant Examples
- "Why refurb vs renew for Asset 12783?"
- "Show assets with RUL <60 days in APAC"
- "Run demo preset stress-test"
- "Create and send Strategy Pack for EMEA Q2"

## License

Copyright © 2026. All rights reserved.
