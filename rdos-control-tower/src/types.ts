// Agent types
export type AgentStatus = 'OK' | 'Warning' | 'Degraded';
export type ConfidenceLevel = 'Low' | 'Med' | 'High';
export type GuardrailType = 'Country Cap' | 'Safety Min' | 'Budget Window' | 'Supplier Capacity';
export type AssetAction = 'Renew' | 'Refurbish' | 'Retire' | 'Monitor' | 'Inspect';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'In Review';
export type TaskStatus = 'Due Today' | 'Over SLA' | 'Pending' | 'Completed';
export type AlertType = 'Risk' | 'Compliance' | 'Data' | 'Policy' | 'Budget' | 'SLA';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  inputsHealth: number;
  whatChanged: string[];
  outputs: string;
  kpis: Record<string, string | number>;
  guardrails?: string[];
}

export interface ReasoningMapStep {
  signal: string;
  threshold: string;
  impact: string;
  recommendation: string;
}

export interface Guardrail {
  type: GuardrailType;
  rule: string;
  reason: string;
  policyRef: string;
}

export interface Asset {
  id: string;
  name: string;
  market: string;
  assetClass: string;
  lifecycle: string;
  criticality: number;
  health: number;
  risk: number;
  rul: number; // Remaining Useful Life (days)
  recommendedAction: AssetAction;
  timingWindow: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  capexDelta: number;
  npvDelta: number;
  guardrails: Guardrail[];
  reasoningMap: ReasoningMapStep;
  evidenceChips: string[];
  supplier?: string;
  installDate?: string;
  lastMaintenance?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  target?: string | number;
  trend: 'up' | 'down' | 'stable';
  sparkline?: number[];
}

export interface MarketData {
  market: string;
  risk: number;
  budget: number;
  alignment: number;
  maintenance: number;
  performanceStability: number;
  dataQuality: number;
  compliance: number;
  predictability: number;
}

export interface Case {
  id: string;
  title: string;
  assets: string[];
  amount: number;
  evidenceScore: number;
  status: CaseStatus;
  owner: string;
  sla: string;
  lastActivity: string;
  justification?: string;
  policyRefs?: string[];
}

export interface Alert {
  id: string;
  severity: Severity;
  type: AlertType;
  market: string;
  asset: string;
  detail: string;
  policyRef?: string;
  decisionImpact?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
  dueDate: string;
  assignedBy?: string;
  relatedAsset?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  budgetDelta: number;
  riskDelta: number;
  roiDelta: number;
  assetsAffected: number;
  guardrailsApplied: string[];
  narrative: string;
}

export interface StrategyPack {
  id: string;
  title: string;
  createdAt: string;
  market: string;
  kpiSummary: KPI[];
  priorityAssets: Asset[];
  capexPlan: {
    total: number;
    roiUplift: number;
    npvUplift: number;
  };
  scenariosIncluded: string[];
}

export interface DataQualityMetric {
  dimension: string;
  score: number;
  impact: string;
  issuesCount: number;
  fixActions: string[];
}
