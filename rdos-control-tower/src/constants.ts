import { Agent, Asset, KPI, MarketData, Case, Alert, Task, DataQualityMetric, Guardrail } from './types';

// Agent data
export const AGENTS: Agent[] = [
  {
    id: 'bia',
    name: 'Baseline Intelligence Agent',
    status: 'OK',
    inputsHealth: 94,
    whatChanged: ['12 assets reclassified', '2 criticality upgraded'],
    outputs: 'Baseline table, lifecycle map',
    kpis: {
      baselineCompleteness: '94%',
      reclassificationAccuracy: '97%',
      dqIssuesResolved: 24
    }
  },
  {
    id: 'pria',
    name: 'Performance & Risk Insight Agent',
    status: 'Warning',
    inputsHealth: 91,
    whatChanged: ['EU HVAC cost drift detected', '3 market hotspots identified'],
    outputs: 'Risk heatmap, hotspot list',
    kpis: {
      leadTime: '4.2 days',
      falsePositiveRate: '8%',
      complianceAdherence: '96%'
    },
    guardrails: ['Country Cap', 'Safety Min']
  },
  {
    id: 'lpa',
    name: 'Lifecycle Prediction Agent',
    status: 'OK',
    inputsHealth: 88,
    whatChanged: ['47 assets need action (12 mo window)', '6 widened intervals (DQ impact)'],
    outputs: 'Recommendation list + timing windows',
    kpis: {
      avgConfidence: '92%',
      forecastAccuracy: '89%',
      downtimeAvoided: '340 hrs'
    }
  },
  {
    id: 'cpa',
    name: 'Capex Prioritization Agent',
    status: 'OK',
    inputsHealth: 93,
    whatChanged: ['FY27 plan -£2.4M vs baseline'],
    outputs: 'Ranked plan, ROI/NPV, change log',
    kpis: {
      capexOptimization: '12%',
      roiUplift: '8.4%',
      riskReduction: '0.7 pts'
    },
    guardrails: ['Country Cap', 'Supplier Capacity', 'Budget Window']
  },
  {
    id: 'gda',
    name: 'Governance & Dossier Agent',
    status: 'Warning',
    inputsHealth: 97,
    whatChanged: ['3 cases approved', '1 rejected', '2 over SLA'],
    outputs: 'Dossiers, audits, policy refs',
    kpis: {
      cycleTime: '5.2 days',
      slaAdherence: '94%',
      dossierCompleteness: '98%'
    }
  }
];

// KPIs for Control Tower
export const CONTROL_TOWER_KPIS: KPI[] = [
  {
    label: 'Strategy Health',
    value: '94%',
    target: '90%',
    trend: 'up',
    sparkline: [88, 89, 91, 90, 92, 93, 94]
  },
  {
    label: 'Capex Optimization',
    value: '-£2.4M',
    target: '0',
    trend: 'up',
    sparkline: [-1.2, -1.5, -1.8, -2.0, -2.2, -2.3, -2.4]
  },
  {
    label: 'Predicted Interventions (12mo)',
    value: 47,
    target: 50,
    trend: 'down',
    sparkline: [52, 51, 50, 49, 48, 48, 47]
  },
  {
    label: 'Forecast Accuracy',
    value: '89%',
    target: '85%',
    trend: 'up',
    sparkline: [85, 86, 87, 87, 88, 88, 89]
  },
  {
    label: 'Renewal Adherence',
    value: '92%',
    target: '90%',
    trend: 'up',
    sparkline: [89, 90, 90, 91, 91, 91, 92]
  },
  {
    label: 'Risk Reduction Index',
    value: '0.7',
    target: '0.5',
    trend: 'up',
    sparkline: [0.3, 0.4, 0.5, 0.5, 0.6, 0.6, 0.7]
  }
];

// Market data
export const MARKET_DATA: MarketData[] = [
  {
    market: 'UK',
    risk: 0.65,
    budget: 0.85,
    alignment: 0.92,
    maintenance: 0.88,
    performanceStability: 0.91,
    dataQuality: 0.94,
    compliance: 0.96,
    predictability: 0.89
  },
  {
    market: 'EU',
    risk: 0.78,
    budget: 0.72,
    alignment: 0.85,
    maintenance: 0.82,
    performanceStability: 0.84,
    dataQuality: 0.91,
    compliance: 0.93,
    predictability: 0.86
  },
  {
    market: 'APAC',
    risk: 0.55,
    budget: 0.91,
    alignment: 0.88,
    maintenance: 0.85,
    performanceStability: 0.87,
    dataQuality: 0.88,
    compliance: 0.89,
    predictability: 0.84
  },
  {
    market: 'Americas',
    risk: 0.62,
    budget: 0.88,
    alignment: 0.90,
    maintenance: 0.86,
    performanceStability: 0.89,
    dataQuality: 0.92,
    compliance: 0.94,
    predictability: 0.87
  }
];

// Guardrail definitions
export const GUARDRAIL_RULES: Record<string, Guardrail> = {
  'Country Cap': {
    type: 'Country Cap',
    rule: 'UK capex cannot exceed £12M per fiscal year',
    reason: 'Financial policy constraint to maintain regional balance',
    policyRef: 'FIN-2025-003'
  },
  'Safety Min': {
    type: 'Safety Min',
    rule: 'Critical safety assets must maintain 95% uptime',
    reason: 'Regulatory and operational safety requirement',
    policyRef: 'SAF-2024-012'
  },
  'Budget Window': {
    type: 'Budget Window',
    rule: 'Capex deployment must occur within approved fiscal windows',
    reason: 'Alignment with financial planning cycles',
    policyRef: 'FIN-2025-007'
  },
  'Supplier Capacity': {
    type: 'Supplier Capacity',
    rule: 'Single supplier cannot handle >40% of regional volume',
    reason: 'Risk mitigation and supplier diversification',
    policyRef: 'SCM-2024-018'
  }
};

// Sample assets
export const SAMPLE_ASSETS: Asset[] = [
  {
    id: 'AST-12783',
    name: 'HVAC Unit 3B',
    market: 'UK',
    assetClass: 'HVAC',
    lifecycle: 'Mature',
    criticality: 8,
    health: 72,
    risk: 0.68,
    rul: 180,
    recommendedAction: 'Refurbish',
    timingWindow: 'Q2 2026',
    confidence: 'High',
    confidenceScore: 93,
    capexDelta: -85000,
    npvDelta: 120000,
    guardrails: [GUARDRAIL_RULES['Country Cap'], GUARDRAIL_RULES['Budget Window']],
    reasoningMap: {
      signal: 'MTBF declining 15% vs baseline; cost curve trending up',
      threshold: 'Health < 75%; RUL < 12 months',
      impact: '£85K refurb avoids £240K replacement; 12-week lead time',
      recommendation: 'Refurbish in Q2 2026 (optimal cost/risk window)'
    },
    evidenceChips: ['↑ failures', '↑ cost curve', 'compliance risk'],
    supplier: 'CoolTech Ltd',
    installDate: '2018-03-15',
    lastMaintenance: '2025-11-20'
  },
  {
    id: 'AST-14592',
    name: 'Coffee Machine Pro',
    market: 'EU',
    assetClass: 'Food Service',
    lifecycle: 'End of Life',
    criticality: 6,
    health: 58,
    risk: 0.82,
    rul: 45,
    recommendedAction: 'Renew',
    timingWindow: 'Q1 2026',
    confidence: 'Med',
    confidenceScore: 78,
    capexDelta: 22000,
    npvDelta: 35000,
    guardrails: [GUARDRAIL_RULES['Supplier Capacity']],
    reasoningMap: {
      signal: 'Multiple subsystem failures; parts obsolete',
      threshold: 'Health < 60%; RUL < 60 days; criticality > 5',
      impact: 'Downtime risk = £1.2K/day; customer satisfaction impact',
      recommendation: 'Renew in Q1 2026 before critical failure'
    },
    evidenceChips: ['↑ failures', 'parts obsolete', 'peer gap'],
    supplier: 'EspressoTech GmbH',
    installDate: '2016-09-01',
    lastMaintenance: '2025-12-10'
  },
  {
    id: 'AST-16341',
    name: 'Industrial Oven A2',
    market: 'APAC',
    assetClass: 'Cooking',
    lifecycle: 'Prime',
    criticality: 9,
    health: 91,
    risk: 0.22,
    rul: 720,
    recommendedAction: 'Monitor',
    timingWindow: 'Q4 2027',
    confidence: 'High',
    confidenceScore: 96,
    capexDelta: 0,
    npvDelta: 15000,
    guardrails: [],
    reasoningMap: {
      signal: 'Performance stable; minimal degradation',
      threshold: 'Health > 90%; RUL > 18 months',
      impact: 'Continue monitoring; preventive maintenance on schedule',
      recommendation: 'Monitor with biannual inspections'
    },
    evidenceChips: ['stable performance'],
    supplier: 'HeatMasters APAC',
    installDate: '2022-01-10',
    lastMaintenance: '2026-01-05'
  },
  {
    id: 'AST-17829',
    name: 'Walk-in Freezer Unit 5',
    market: 'Americas',
    assetClass: 'Refrigeration',
    lifecycle: 'Mature',
    criticality: 10,
    health: 68,
    risk: 0.74,
    rul: 120,
    recommendedAction: 'Renew',
    timingWindow: 'Q1 2026',
    confidence: 'High',
    confidenceScore: 91,
    capexDelta: 145000,
    npvDelta: 220000,
    guardrails: [GUARDRAIL_RULES['Safety Min'], GUARDRAIL_RULES['Budget Window']],
    reasoningMap: {
      signal: 'Energy efficiency dropped 22%; compressor stress',
      threshold: 'Health < 70%; criticality = 10 (safety)',
      impact: 'Food safety risk; regulatory compliance; £3.5K/day downtime',
      recommendation: 'Urgent renewal Q1 2026 (safety + compliance)'
    },
    evidenceChips: ['↑ energy cost', 'compliance risk', 'safety critical'],
    supplier: 'ChillPro Inc',
    installDate: '2017-06-22',
    lastMaintenance: '2025-10-15'
  }
];

// Cases
export const SAMPLE_CASES: Case[] = [
  {
    id: 'CASE-2026-047',
    title: 'Q2 2026 HVAC Refurbishment - UK Region',
    assets: ['AST-12783', 'AST-12791', 'AST-12808'],
    amount: 247000,
    evidenceScore: 94,
    status: 'Pending',
    owner: 'Sarah Johnson',
    sla: '2 days',
    lastActivity: '2026-02-20T14:30:00Z'
  },
  {
    id: 'CASE-2026-051',
    title: 'Emergency Coffee Machine Renewal - EU',
    assets: ['AST-14592'],
    amount: 22000,
    evidenceScore: 78,
    status: 'In Review',
    owner: 'Marcus Schmidt',
    sla: 'Over SLA (1 day)',
    lastActivity: '2026-02-19T09:15:00Z'
  },
  {
    id: 'CASE-2026-039',
    title: 'Freezer Fleet Renewal - Americas',
    assets: ['AST-17829', 'AST-17831', 'AST-17845', 'AST-17852'],
    amount: 580000,
    evidenceScore: 91,
    status: 'Approved',
    owner: 'Jennifer Martinez',
    sla: 'Completed',
    lastActivity: '2026-02-18T16:45:00Z'
  }
];

// Alerts
export const SAMPLE_ALERTS: Alert[] = [
  {
    id: 'ALT-1024',
    severity: 'Critical',
    type: 'Risk',
    market: 'Americas',
    asset: 'AST-17829',
    detail: 'Freezer unit health dropped below safety threshold',
    policyRef: 'SAF-2024-012',
    decisionImpact: 'Blocks approval until safety review',
    timestamp: '2026-02-21T08:00:00Z'
  },
  {
    id: 'ALT-1025',
    severity: 'High',
    type: 'Compliance',
    market: 'EU',
    asset: 'AST-14592',
    detail: 'Maintenance interval exceeded regulatory window',
    policyRef: 'COMP-2025-008',
    decisionImpact: 'Requires expedited approval',
    timestamp: '2026-02-21T06:30:00Z'
  },
  {
    id: 'ALT-1026',
    severity: 'Medium',
    type: 'Data',
    market: 'APAC',
    asset: 'Multiple',
    detail: 'Telemetry data gaps detected (6 assets)',
    decisionImpact: 'Confidence reduced 93% → 81%; intervals widened',
    timestamp: '2026-02-20T22:15:00Z'
  },
  {
    id: 'ALT-1027',
    severity: 'High',
    type: 'Budget',
    market: 'UK',
    asset: 'Multiple',
    detail: 'UK region approaching capex limit (£11.2M of £12M)',
    policyRef: 'FIN-2025-003',
    decisionImpact: 'Country Cap guardrail active',
    timestamp: '2026-02-20T14:00:00Z'
  }
];

// Tasks
export const SAMPLE_TASKS: Task[] = [
  {
    id: 'TSK-501',
    title: 'Review HVAC refurbishment case CASE-2026-047',
    type: 'Approval',
    status: 'Due Today',
    dueDate: '2026-02-21',
    assignedBy: 'rDOS Governance Agent',
    relatedAsset: 'AST-12783'
  },
  {
    id: 'TSK-502',
    title: 'Fix telemetry data gaps for APAC assets',
    type: 'Data Fix',
    status: 'Over SLA',
    dueDate: '2026-02-20',
    assignedBy: 'rDOS Data Quality Monitor'
  },
  {
    id: 'TSK-503',
    title: 'Validate supplier capacity for EU renewals',
    type: 'Review',
    status: 'Pending',
    dueDate: '2026-02-23',
    assignedBy: 'Sarah Johnson',
    relatedAsset: 'AST-14592'
  }
];

// Data Quality Metrics
export const DATA_QUALITY_METRICS: DataQualityMetric[] = [
  {
    dimension: 'Completeness',
    score: 92,
    impact: 'Medium',
    issuesCount: 47,
    fixActions: ['Import missing install dates', 'Update asset classifications']
  },
  {
    dimension: 'Timeliness',
    score: 85,
    impact: 'High',
    issuesCount: 12,
    fixActions: ['Re-ingest APAC telemetry', 'Sync CMMS updates']
  },
  {
    dimension: 'Consistency',
    score: 90,
    impact: 'Low',
    issuesCount: 23,
    fixActions: ['Reconcile duplicate records', 'Standardize supplier names']
  }
];

// Demo Stress Test Preset
export const DEMO_STRESS_TEST_PRESET = {
  name: 'Parts Shortage (EU) + 10% Inflation',
  description: 'Simulates supply chain disruption in EU region with cost increase',
  parameters: {
    region: 'EU',
    partsAvailability: 0.6,
    inflationRate: 0.10,
    supplierCapacityReduction: 0.25
  },
  expectedImpact: {
    assetsReprioritized: 7,
    roiDelta: -1.2,
    riskDelta: -0.6,
    narrative: 'Stress-test applied → reprioritized 7 renewals; ROI –1.2% vs base; risk –0.6.'
  }
};

export const TIME_MACHINE_OPTIONS = [
  { label: 'Now', value: 'now' },
  { label: '3 months ago', value: '-3m' },
  { label: '6 months ago', value: '-6m' },
  { label: '12 months ago', value: '-12m' },
  { label: '12 months ahead', value: '+12m' }
];

export const PERSONAS = [
  { label: 'Leadership', value: 'leadership' },
  { label: 'Asset Manager', value: 'asset' },
  { label: 'Finance', value: 'finance' },
  { label: 'Compliance', value: 'compliance' }
];
