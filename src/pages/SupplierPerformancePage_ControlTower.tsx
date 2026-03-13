import React, { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';

type SupplierPerformancePageProps = {
  selectedStore: string;
  selectedCategory: string;
};

// SUPPLIER PERFORMANCE CONTROL TOWER DATA

// Real-time KPI Layer
const REALTIME_KPIS = {
  slaUptime: [
    { metric: 'WO Response Time', value: '2.3 hrs', target: '4 hrs', status: 'excellent', percentage: 92, trend: -15 },
    { metric: 'Resolution Time', value: '8.5 hrs', target: '12 hrs', status: 'good', percentage: 88, trend: -8 },
    { metric: 'System Uptime', value: '99.2%', target: '98%', status: 'excellent', percentage: 99, trend: +2 },
    { metric: 'First-Time Fix Rate', value: '87%', target: '85%', status: 'good', percentage: 87, trend: +5 },
    { metric: 'Callback Rate', value: '5%', target: '8%', status: 'excellent', percentage: 95, trend: -12 }
  ],
  quality: [
    { metric: 'Repeat Failures', value: '8%', target: '10%', status: 'good', percentage: 92, trend: -3 },
    { metric: 'Punch-list Age', value: '3.2 days', target: '5 days', status: 'excellent', percentage: 94, trend: -18 },
    { metric: 'Installation Defects', value: '4%', target: '6%', status: 'good', percentage: 90, trend: -7 },
    { metric: 'Commissioning Accept', value: '94%', target: '90%', status: 'excellent', percentage: 94, trend: +4 }
  ],
  cost: [
    { metric: 'Parts Usage Variance', value: '3%', target: '5%', status: 'excellent', percentage: 96, trend: -2 },
    { metric: 'Hourly Rate Leakage', value: '2.1%', target: '3%', status: 'good', percentage: 93, trend: -1 },
    { metric: 'Contract Compliance', value: '96%', target: '95%', status: 'excellent', percentage: 96, trend: +3 }
  ],
  safety: [
    { metric: 'HSSE Violations', value: '2', target: '< 5', status: 'excellent', percentage: 95, trend: -40 },
    { metric: 'Training Compliance', value: '98%', target: '95%', status: 'excellent', percentage: 98, trend: +2 },
    { metric: 'Unsafe Acts', value: '3', target: '< 10', status: 'excellent', percentage: 97, trend: -25 }
  ],
  compliance: [
    { metric: 'Permit Delays', value: '1.2 days', target: '< 2 days', status: 'excellent', percentage: 94, trend: -30 },
    { metric: 'Documentation Complete', value: '92%', target: '90%', status: 'good', percentage: 92, trend: +5 },
    { metric: 'Evidence Availability', value: '95%', target: '93%', status: 'excellent', percentage: 95, trend: +8 }
  ]
};

// Predictive Risk Scores
const PREDICTIVE_RISKS = [
  {
    vendor: 'Building Contractors Pro',
    riskType: 'SLA Breach Risk',
    probability: 67,
    timeframe: 'Next 30 days',
    indicators: ['27% higher repeat failures', 'Installation delays increasing', 'Resource allocation issues'],
    impact: 'High',
    recommendation: 'Immediate intervention - reduce workload allocation by 30%'
  },
  {
    vendor: 'Cleaning Services Plus',
    riskType: 'Quality Degradation',
    probability: 54,
    timeframe: 'Next 45 days',
    indicators: ['Staff turnover spike', 'Training compliance dropping', 'Customer complaints up 15%'],
    impact: 'Medium',
    recommendation: 'Schedule emergency training session and quality audit'
  },
  {
    vendor: 'Refrigeration Services UK',
    riskType: 'Cost Overrun',
    probability: 48,
    timeframe: 'Next 60 days',
    indicators: ['Parts usage variance trending up', 'Weekend coverage gaps', 'Overtime increasing'],
    impact: 'Medium',
    recommendation: 'Review pricing model and coverage schedule'
  }
];

// Supplier 360° View
const VENDOR_360 = [
  { 
    name: 'HVAC Solutions Ltd', 
    category: 'HVAC Maintenance',
    region: 'UK North',
    score: 94, 
    contracts: 12,
    slaCompliance: 96,
    uptime: 99.2,
    repeatFailures: 5,
    costVariance: 2.1,
    hsseScore: 98,
    workload: 145,
    capacity: 200,
    technicianScore: 4.7,
    coverage: ['London', 'Manchester', 'Leeds'],
    assetClasses: ['EV Chargers', 'HVAC', 'Refrigeration'],
    trend: 'Excellent',
    status: 'Active',
    riskScore: 12
  },
  { 
    name: 'Refrigeration Services UK', 
    category: 'Refrigeration',
    region: 'UK South',
    score: 87, 
    contracts: 8,
    slaCompliance: 89,
    uptime: 97.8,
    repeatFailures: 12,
    costVariance: 5.3,
    hsseScore: 94,
    workload: 98,
    capacity: 150,
    technicianScore: 4.3,
    coverage: ['Bristol', 'Southampton', 'Brighton'],
    assetClasses: ['Refrigeration', 'Wetstock'],
    trend: 'Good',
    status: 'Active',
    riskScore: 28
  },
  { 
    name: 'Building Contractors Pro', 
    category: 'Construction',
    region: 'UK Central',
    score: 72, 
    contracts: 5,
    slaCompliance: 78,
    uptime: 94.2,
    repeatFailures: 27,
    costVariance: 12.4,
    hsseScore: 88,
    workload: 156,
    capacity: 120,
    technicianScore: 3.8,
    coverage: ['Birmingham', 'Coventry', 'Nottingham'],
    assetClasses: ['Build', 'Install', 'Commission'],
    trend: 'Declining',
    status: 'Warning',
    riskScore: 67
  },
  { 
    name: 'Electrical Systems Inc', 
    category: 'Electrical',
    region: 'Scotland',
    score: 91, 
    contracts: 15,
    slaCompliance: 93,
    uptime: 98.5,
    repeatFailures: 8,
    costVariance: 3.2,
    hsseScore: 96,
    workload: 187,
    capacity: 250,
    technicianScore: 4.6,
    coverage: ['Edinburgh', 'Glasgow', 'Aberdeen'],
    assetClasses: ['Electrical', 'EV Chargers', 'ATG'],
    trend: 'Improving',
    status: 'Active',
    riskScore: 18
  }
];

// Automated Actions
const AUTOMATED_ACTIONS = [
  {
    action: 'QBR Generation',
    vendor: 'All Vendors',
    status: 'Scheduled',
    date: '2026-02-25',
    automation: 98,
    description: 'Auto-generating quarterly business review packs'
  },
  {
    action: 'Penalty Assessment',
    vendor: 'Building Contractors Pro',
    status: 'In Progress',
    date: '2026-02-20',
    automation: 85,
    description: 'Digital penalty engine calculating SLA breach penalties'
  },
  {
    action: 'Corrective Action',
    vendor: 'Cleaning Services Plus',
    status: 'Triggered',
    date: '2026-02-18',
    automation: 92,
    description: 'Auto-initiated quality improvement workflow'
  },
  {
    action: 'Workload Reallocation',
    vendor: 'Building Contractors Pro',
    status: 'Pending',
    date: '2026-02-22',
    automation: 75,
    description: 'AI recommends redistributing work to higher performers'
  }
];

// Control Tower Insights
const CONTROL_TOWER_INSIGHTS = [
  {
    insight: 'Supplier X has 27% higher repeat failures on EV chargers in Region A',
    severity: 'high',
    category: 'Quality',
    action: 'Root cause analysis initiated'
  },
  {
    insight: 'Installation vendor Y causing 40% of commissioning delays — incomplete documentation',
    severity: 'high',
    category: 'Process',
    action: 'Training program scheduled'
  },
  {
    insight: 'Wetstock vendor Z repeatedly fails calibration in 3 markets',
    severity: 'medium',
    category: 'Quality',
    action: 'Equipment audit in progress'
  },
  {
    insight: 'Predictive model indicates 17% SLA breach risk next month for Vendor Q',
    severity: 'medium',
    category: 'Predictive',
    action: 'Preventive measures deployed'
  },
  {
    insight: 'Vendor A\'s average costing variance is 12% above contract rate',
    severity: 'high',
    category: 'Cost',
    action: 'Contract renegotiation initiated'
  }
];

// Field Technician Feedback
const FIELD_FEEDBACK = [
  { technician: 'John Smith', vendor: 'HVAC Solutions Ltd', rating: 4.8, comment: 'Excellent response time, well-equipped', date: '2 hours ago' },
  { technician: 'Sarah Johnson', vendor: 'Electrical Systems Inc', rating: 4.6, comment: 'Knowledgeable team, good documentation', date: '5 hours ago' },
  { technician: 'Mike Peters', vendor: 'Building Contractors Pro', rating: 3.2, comment: 'Frequent delays, communication issues', date: '1 day ago' },
  { technician: 'Emma Wilson', vendor: 'Refrigeration Services UK', rating: 4.4, comment: 'Good technical skills, needs better parts availability', date: '1 day ago' }
];

// Regional Performance Data
const REGIONAL_PERFORMANCE = [
  { 
    region: 'UK North', 
    countries: ['England North', 'Scotland'],
    score: 92, 
    vendors: 8,
    sites: 145,
    uptime: 98.5,
    costEfficiency: 94,
    slaCompliance: 96,
    color: 'emerald',
    trend: +5
  },
  { 
    region: 'UK South', 
    countries: ['England South', 'Wales'],
    score: 88, 
    vendors: 12,
    sites: 178,
    uptime: 97.2,
    costEfficiency: 89,
    slaCompliance: 91,
    color: 'blue',
    trend: +2
  },
  { 
    region: 'UK Central', 
    countries: ['England Midlands'],
    score: 75, 
    vendors: 6,
    sites: 98,
    uptime: 94.8,
    costEfficiency: 78,
    slaCompliance: 82,
    color: 'amber',
    trend: -3
  },
  { 
    region: 'Scotland', 
    countries: ['Scotland'],
    score: 91, 
    vendors: 10,
    sites: 134,
    uptime: 98.1,
    costEfficiency: 92,
    slaCompliance: 94,
    color: 'cyan',
    trend: +4
  },
  { 
    region: 'Wales', 
    countries: ['Wales'],
    score: 82, 
    vendors: 7,
    sites: 87,
    uptime: 96.3,
    costEfficiency: 85,
    slaCompliance: 88,
    color: 'purple',
    trend: +1
  }
];

// Work Type Performance
const WORK_TYPE_PERFORMANCE = [
  {
    workType: 'Build',
    score: 86,
    vendors: 5,
    activeProjects: 23,
    onTime: 78,
    qualityScore: 92,
    avgCost: '£145k',
    completionRate: 88
  },
  {
    workType: 'Install',
    score: 91,
    vendors: 8,
    activeProjects: 67,
    onTime: 89,
    qualityScore: 94,
    avgCost: '£45k',
    completionRate: 93
  },
  {
    workType: 'Commission',
    score: 89,
    vendors: 6,
    activeProjects: 45,
    onTime: 87,
    qualityScore: 91,
    avgCost: '£28k',
    completionRate: 90
  },
  {
    workType: 'Maintain',
    score: 94,
    vendors: 12,
    activeProjects: 234,
    onTime: 96,
    qualityScore: 96,
    avgCost: '£12k',
    completionRate: 97
  },
  {
    workType: 'Repair',
    score: 92,
    vendors: 10,
    activeProjects: 156,
    onTime: 93,
    qualityScore: 94,
    avgCost: '£8k',
    completionRate: 95
  }
];

// Asset Class Performance
const ASSET_PERFORMANCE = [
  {
    asset: 'EV Chargers',
    score: 93,
    vendors: 6,
    units: 456,
    uptime: 98.7,
    mttr: '3.2 hrs',
    repeatFailures: 4,
    costPerUnit: '£450'
  },
  {
    asset: 'HVAC Systems',
    score: 91,
    vendors: 8,
    units: 234,
    uptime: 97.8,
    mttr: '5.1 hrs',
    repeatFailures: 7,
    costPerUnit: '£680'
  },
  {
    asset: 'Refrigeration',
    score: 88,
    vendors: 7,
    units: 312,
    uptime: 96.5,
    mttr: '6.3 hrs',
    repeatFailures: 9,
    costPerUnit: '£520'
  },
  {
    asset: 'ATG/Wetstock',
    score: 85,
    vendors: 5,
    units: 187,
    uptime: 95.2,
    mttr: '8.7 hrs',
    repeatFailures: 12,
    costPerUnit: '£780'
  },
  {
    asset: 'Electrical Systems',
    score: 92,
    vendors: 9,
    units: 398,
    uptime: 98.2,
    mttr: '4.5 hrs',
    repeatFailures: 5,
    costPerUnit: '£390'
  },
  {
    asset: 'Building/Fabric',
    score: 79,
    vendors: 4,
    units: 145,
    uptime: 93.4,
    mttr: '12.3 hrs',
    repeatFailures: 18,
    costPerUnit: '£1250'
  }
];

// Country-Level Drill Down
const COUNTRY_DRILLDOWN = {
  'England North': { score: 93, sites: 87, vendors: 5, uptime: 98.6, sla: 96, cost: 94 },
  'Scotland': { score: 91, sites: 134, vendors: 10, uptime: 98.1, sla: 94, cost: 92 },
  'England South': { score: 89, sites: 112, vendors: 8, uptime: 97.5, sla: 92, cost: 90 },
  'Wales': { score: 82, sites: 87, vendors: 7, uptime: 96.3, sla: 88, cost: 85 },
  'England Midlands': { score: 75, sites: 98, vendors: 6, uptime: 94.8, sla: 82, cost: 78 }
};

export const SupplierPerformancePage: React.FC<SupplierPerformancePageProps> = ({
  selectedStore,
  selectedCategory,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [activeKPICategory, setActiveKPICategory] = useState('slaUptime');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [drillDownView, setDrillDownView] = useState<'overview' | 'region' | 'country' | 'vendor'>('overview');
  const [activeOverviewTab, setActiveOverviewTab] = useState<'suppliers' | 'region' | 'value' | 'worktype' | 'assets'>('suppliers');

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      
      {/* Header - Control Tower */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden p-8 border-2 border-indigo-500/30">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full -mr-48 -mt-48"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">Supplier Performance Control Tower</h1>
                  <p className="text-indigo-200 text-sm mt-1">Real-time, Predictive, AI-Driven Autonomous Governance</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-xs text-indigo-200">Active Vendors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-white">98.5%</div>
                <div className="text-xs text-indigo-200">Avg Performance</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-green-400">Live</div>
                <div className="text-xs text-indigo-200">System Status</div>
              </div>
            </div>
          </div>

          {/* Control Tower Layers Indicator */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { layer: 'Real-time KPI', icon: '📊', color: 'from-blue-500 to-cyan-500', status: 'Active' },
              { layer: 'Predictive Analytics', icon: '🔮', color: 'from-purple-500 to-pink-500', status: 'Running' },
              { layer: 'Action & Governance', icon: '⚡', color: 'from-amber-500 to-orange-500', status: 'Automated' },
              { layer: 'Operations Feedback', icon: '💬', color: 'from-green-500 to-emerald-500', status: 'Live' }
            ].map((layer, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{layer.icon}</span>
                  <div className="flex-grow">
                    <div className="text-xs font-bold text-white">{layer.layer}</div>
                    <div className="text-xs text-indigo-200">{layer.status}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 1: REAL-TIME KPI LAYER */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-xl">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-black text-white">LAYER 1: REAL-TIME KPI MONITORING</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-cyan-300 to-transparent"></div>
        </div>

        {/* KPI Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'slaUptime', label: 'SLA/Uptime', icon: '⏱️', color: 'blue' },
            { key: 'quality', label: 'Quality', icon: '✓', color: 'green' },
            { key: 'cost', label: 'Cost', icon: '💰', color: 'amber' },
            { key: 'safety', label: 'Safety/HSSE', icon: '🛡️', color: 'red' },
            { key: 'compliance', label: 'Compliance', icon: '📋', color: 'purple' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveKPICategory(cat.key)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeKPICategory === cat.key
                  ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {REALTIME_KPIS[activeKPICategory as keyof typeof REALTIME_KPIS].map((kpi, idx) => (
            <div key={idx} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">{kpi.metric}</div>
                    <div className="text-2xl font-black text-gray-900">{kpi.value}</div>
                    <div className="text-xs text-gray-500 mt-1">Target: {kpi.target}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    kpi.status === 'excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {kpi.status === 'excellent' ? '⭐' : '✓'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        kpi.status === 'excellent' 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                      }`}
                      style={{ width: `${kpi.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    kpi.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend > 0 ? '↑' : '↓'}
                    {Math.abs(kpi.trend)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2: PREDICTIVE ANALYTICS LAYER */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl">
            <span className="text-2xl">🔮</span>
            <span className="text-sm font-black text-white">LAYER 2: PREDICTIVE ANALYTICS</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-pink-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PREDICTIVE_RISKS.map((risk, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">{risk.riskType}</div>
                    <div className="text-lg font-bold text-gray-900">{risk.vendor}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    risk.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {risk.impact} Impact
                  </div>
                </div>

                {/* Probability Gauge */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Risk Probability</span>
                    <span className="text-2xl font-black text-orange-600">{risk.probability}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full"
                      style={{ width: `${risk.probability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Indicators */}
                <div className="mb-4 bg-blue-50 rounded-lg p-3">
                  <div className="text-xs font-bold text-blue-800 mb-2">Early Warning Indicators:</div>
                  <ul className="space-y-1">
                    {risk.indicators.map((indicator, i) => (
                      <li key={i} className="text-xs text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs font-bold text-green-800 mb-1">AI Recommendation:</div>
                  <div className="text-xs text-green-700">{risk.recommendation}</div>
                </div>

                {/* Timeframe */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">{risk.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: ACTION & GOVERNANCE LAYER */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-xl">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-black text-white">LAYER 3: ACTION & GOVERNANCE AUTOMATION</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-orange-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automated Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Automated Actions</h3>
                <p className="text-xs text-gray-500">AI-driven governance in action</p>
              </div>
            </div>

            <div className="space-y-3">
              {AUTOMATED_ACTIONS.map((action, idx) => (
                <div key={idx} className={`bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-4 ${
                  action.status === 'Scheduled' ? 'border-blue-200' :
                  action.status === 'In Progress' ? 'border-amber-200' :
                  action.status === 'Triggered' ? 'border-green-200' : 'border-purple-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{action.action}</div>
                      <div className="text-xs text-gray-600">{action.vendor}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      action.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      action.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      action.status === 'Triggered' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {action.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 mb-3">{action.description}</div>

                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        style={{ width: `${action.automation}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{action.automation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Tower Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Control Tower Insights</h3>
                <p className="text-xs text-gray-500">AI-generated intelligence</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {CONTROL_TOWER_INSIGHTS.map((insight, idx) => (
                <div key={idx} className={`bg-gradient-to-r from-white to-gray-50 border-l-4 rounded-lg p-3 ${
                  insight.severity === 'high' ? 'border-red-500' : 'border-orange-500'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {insight.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      insight.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {insight.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 mb-2">{insight.insight}</div>
                  <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    ✓ {insight.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layer 4: OPERATIONS FEEDBACK LAYER */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-xl">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-black text-white">LAYER 4: OPERATIONS FEEDBACK</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-emerald-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field Technician Feedback */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">👷</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Field Technician Feedback</h3>
                <p className="text-xs text-gray-500">Real-time quality insights</p>
              </div>
            </div>

            <div className="space-y-3">
              {FIELD_FEEDBACK.map((feedback, idx) => (
                <div key={idx} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{feedback.technician}</div>
                      <div className="text-xs text-gray-600">{feedback.vendor}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-amber-500">{feedback.rating}</span>
                      <span className="text-amber-500">⭐</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mb-2 italic">"{feedback.comment}"</div>

                  <div className="text-xs text-gray-500">{feedback.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier 360° View */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-cyan-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Supplier 360° View</h3>
                <p className="text-xs text-gray-500">Comprehensive vendor profiles</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {VENDOR_360.map((vendor, idx) => (
                <div 
                  key={idx} 
                  className={`relative bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedVendor === vendor.name 
                      ? 'border-cyan-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                  onClick={() => setSelectedVendor(vendor.name)}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                    vendor.score >= 90 ? 'bg-green-500' : vendor.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>

                  <div className="ml-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-900">{vendor.name}</div>
                        <div className="text-xs text-gray-600">{vendor.category} • {vendor.region}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-black ${
                          vendor.score >= 90 ? 'text-green-600' : vendor.score >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {vendor.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-blue-700">{vendor.uptime}%</div>
                        <div className="text-xs text-gray-600">Uptime</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-purple-700">{vendor.hsseScore}%</div>
                        <div className="text-xs text-gray-600">HSSE</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-green-700">{vendor.technicianScore}</div>
                        <div className="text-xs text-gray-600">Tech Score</div>
                      </div>
                    </div>

                    {selectedVendor === vendor.name && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-500">Coverage:</span>
                          <span className="ml-2 font-semibold text-gray-700">{vendor.coverage.join(', ')}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Asset Classes:</span>
                          <span className="ml-2 font-semibold text-gray-700">{vendor.assetClasses.join(', ')}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Workload:</span>
                          <span className="ml-2 font-semibold text-gray-700">{vendor.workload}/{vendor.capacity}</span>
                          <span className="ml-1 text-gray-500">({Math.round((vendor.workload/vendor.capacity)*100)}% capacity)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Risk Score:</span>
                          <div className="flex-grow bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                vendor.riskScore < 30 ? 'bg-green-500' : vendor.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${vendor.riskScore}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-700">{vendor.riskScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VISUALIZATION ANALYTICS SECTION */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-black text-white">PERFORMANCE ANALYTICS & DRILL-DOWN</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-purple-300 to-transparent"></div>
        </div>

        {/* Regional Performance Heatmap */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🗺️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Regional Performance by Country</h3>
                <p className="text-xs text-gray-500">Geographic performance heatmap</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Click region for drill-down →
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {REGIONAL_PERFORMANCE.map((region, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setSelectedRegion(region.region);
                  setDrillDownView('region');
                }}
                className={`group cursor-pointer relative bg-gradient-to-br from-${region.color}-50 to-${region.color}-100 rounded-2xl p-5 border-2 border-${region.color}-200 hover:border-${region.color}-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Score Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-full border-4 border-${region.color}-300 flex items-center justify-center shadow-lg">
                  <div className={`text-2xl font-black text-${region.color}-600`}>{region.score}</div>
                </div>

                <div className="mb-4">
                  <h4 className={`text-lg font-bold text-${region.color}-900 mb-1`}>{region.region}</h4>
                  <div className="text-xs text-gray-600">
                    {region.countries.join(' • ')}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/70 rounded-lg p-2">
                      <div className={`font-bold text-${region.color}-700`}>{region.vendors}</div>
                      <div className="text-gray-600">Vendors</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2">
                      <div className={`font-bold text-${region.color}-700`}>{region.sites}</div>
                      <div className="text-gray-600">Sites</div>
                    </div>
                  </div>

                  {/* Performance Bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Uptime</span>
                        <span className={`font-bold text-${region.color}-700`}>{region.uptime}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 bg-gradient-to-r from-${region.color}-400 to-${region.color}-600 rounded-full`}
                          style={{ width: `${region.uptime}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">SLA</span>
                        <span className={`font-bold text-${region.color}-700`}>{region.slaCompliance}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 bg-gradient-to-r from-${region.color}-400 to-${region.color}-600 rounded-full`}
                          style={{ width: `${region.slaCompliance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className={`flex items-center gap-2 text-xs font-bold ${
                    region.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {region.trend > 0 ? '↑' : '↓'}
                    {Math.abs(region.trend)}% vs last month
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Type Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Performance by Work Type</h3>
              <p className="text-xs text-gray-500">Build • Install • Commission • Maintain • Repair</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {WORK_TYPE_PERFORMANCE.map((work, idx) => (
              <div key={idx} className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="mb-3">
                  <div className="text-sm font-bold text-gray-800 mb-1">{work.workType}</div>
                  <div className="text-3xl font-black text-blue-600">{work.score}</div>
                  <div className="text-xs text-gray-500">Performance Score</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendors:</span>
                    <span className="font-bold text-gray-800">{work.vendors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span className="font-bold text-gray-800">{work.activeProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-Time:</span>
                    <span className="font-bold text-blue-700">{work.onTime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <span className="font-bold text-green-700">{work.qualityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Cost:</span>
                    <span className="font-bold text-amber-700">{work.avgCost}</span>
                  </div>
                </div>

                {/* Completion Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-bold text-blue-700">{work.completionRate}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-2.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                      style={{ width: `${work.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Class Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Performance by Asset Class</h3>
              <p className="text-xs text-gray-500">Asset-level supplier performance tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSET_PERFORMANCE.map((asset, idx) => (
              <div key={idx} className="relative bg-gradient-to-br from-white to-emerald-50 rounded-xl p-5 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all">
                {/* Score Badge */}
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <div className="text-xl font-black text-white">{asset.score}</div>
                </div>

                <div className="mb-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">{asset.asset}</div>
                  <div className="text-xs text-gray-500">{asset.units} units • {asset.vendors} vendors</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Uptime</div>
                    <div className="text-lg font-bold text-blue-700">{asset.uptime}%</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600">MTTR</div>
                    <div className="text-lg font-bold text-amber-700">{asset.mttr}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Repeat Failures:</span>
                    <span className={`font-bold px-2 py-1 rounded ${
                      asset.repeatFailures < 8 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {asset.repeatFailures}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Unit:</span>
                    <span className="font-bold text-gray-800">{asset.costPerUnit}</span>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${
                        asset.score >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        asset.score >= 80 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                        'bg-gradient-to-r from-amber-400 to-orange-500'
                      }`}
                      style={{ width: `${asset.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scorecard Drill-Down */}
        {selectedRegion && drillDownView === 'region' && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-2xl p-6 border-2 border-indigo-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Regional Drill-Down: {selectedRegion}</h3>
                  <p className="text-xs text-gray-600">Country-level performance breakdown</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedRegion(null);
                  setDrillDownView('overview');
                }}
                className="px-4 py-2 bg-white rounded-lg border-2 border-gray-300 hover:border-indigo-400 text-sm font-semibold text-gray-700 hover:text-indigo-700 transition-all"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(COUNTRY_DRILLDOWN).map(([country, data], idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedCountry(country);
                    setDrillDownView('country');
                  }}
                  className="cursor-pointer bg-white rounded-xl p-4 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="mb-3">
                    <div className="text-sm font-bold text-gray-900 mb-1">{country}</div>
                    <div className="text-3xl font-black text-indigo-600">{data.score}</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sites:</span>
                      <span className="font-bold text-gray-800">{data.sites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendors:</span>
                      <span className="font-bold text-gray-800">{data.vendors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-bold text-green-700">{data.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SLA:</span>
                      <span className="font-bold text-blue-700">{data.sla}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Eff:</span>
                      <span className="font-bold text-amber-700">{data.cost}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all z-40 group"
      >
        <div className="w-6 h-6 relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Control Tower AI Assistant
        </div>
      </button>

      {/* Chat Interface Modal */}
      {isChatOpen && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};
