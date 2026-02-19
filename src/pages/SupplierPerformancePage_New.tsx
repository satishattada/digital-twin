import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';

// Data Structures
const REALTIME_KPIS = {
  slaUptime: [
    { metric: 'Overall SLA', value: '96.5%', target: '95%', status: 'excellent', trend: 2, percentage: 96 },
    { metric: 'Uptime', value: '99.2%', target: '99%', status: 'excellent', trend: 0.5, percentage: 99 },
    { metric: 'Response Time', value: '2.1h', target: '<3h', status: 'good', trend: -15, percentage: 88 },
    { metric: 'First-Time Fix', value: '89%', target: '85%', status: 'excellent', trend: 4, percentage: 89 },
    { metric: 'Availability', value: '98.7%', target: '98%', status: 'excellent', trend: 1, percentage: 98 }
  ],
  quality: [
    { metric: 'Work Quality', value: '94.2%', target: '90%', status: 'excellent', trend: 3, percentage: 94 },
    { metric: 'Customer Satisfaction', value: '4.7/5', target: '4.5/5', status: 'excellent', trend: 5, percentage: 94 },
    { metric: 'Defect Rate', value: '1.2%', target: '<2%', status: 'excellent', trend: -25, percentage: 40 },
    { metric: 'Rework Rate', value: '3.1%', target: '<5%', status: 'good', trend: -10, percentage: 62 },
    { metric: 'Compliance', value: '97.8%', target: '95%', status: 'excellent', trend: 2, percentage: 97 }
  ],
  cost: [
    { metric: 'Cost Per Service', value: '£142', target: '£150', status: 'excellent', trend: -5, percentage: 95 },
    { metric: 'Budget Adherence', value: '96.3%', target: '95%', status: 'excellent', trend: 2, percentage: 96 },
    { metric: 'Invoice Accuracy', value: '98.9%', target: '98%', status: 'excellent', trend: 1, percentage: 98 },
    { metric: 'Cost Savings', value: '£1.2M', target: '£1M', status: 'excellent', trend: 15, percentage: 120 },
    { metric: 'ROI', value: '18.5%', target: '15%', status: 'excellent', trend: 10, percentage: 123 }
  ],
  safety: [
    { metric: 'TRIR', value: '0.3', target: '<0.5', status: 'excellent', trend: -40, percentage: 60 },
    { metric: 'Near Misses', value: '2', target: '<5', status: 'excellent', trend: -33, percentage: 40 },
    { metric: 'Safety Training', value: '100%', target: '100%', status: 'excellent', trend: 0, percentage: 100 },
    { metric: 'PPE Compliance', value: '99.8%', target: '99%', status: 'excellent', trend: 0.5, percentage: 99 },
    { metric: 'Incident Response', value: '<1h', target: '<2h', status: 'excellent', trend: 20, percentage: 95 }
  ],
  compliance: [
    { metric: 'Regulatory', value: '100%', target: '100%', status: 'excellent', trend: 0, percentage: 100 },
    { metric: 'Documentation', value: '98.5%', target: '95%', status: 'excellent', trend: 3, percentage: 98 },
    { metric: 'Audits Passed', value: '24/24', target: '100%', status: 'excellent', trend: 0, percentage: 100 },
    { metric: 'Certifications', value: '100%', target: '100%', status: 'excellent', trend: 0, percentage: 100 },
    { metric: 'Policy Adherence', value: '97.2%', target: '95%', status: 'excellent', trend: 2, percentage: 97 }
  ]
};

const REGIONAL_PERFORMANCE = [
  { region: 'North America', countries: ['USA', 'Canada'], vendors: 12, sites: 187, score: 92, color: 'blue', uptime: 98.5, costEfficiency: 94, slaCompliance: 96, trend: 5 },
  { region: 'Europe', countries: ['UK', 'Germany', 'France'], vendors: 15, sites: 243, score: 89, color: 'emerald', uptime: 97.2, costEfficiency: 89, slaCompliance: 91, trend: 2 },
  { region: 'Asia Pacific', countries: ['China', 'Japan', 'Australia'], vendors: 8, sites: 94, score: 88, color: 'purple', uptime: 96.8, costEfficiency: 87, slaCompliance: 90, trend: 4 },
  { region: 'Latin America', countries: ['Brazil', 'Mexico'], vendors: 5, sites: 21, score: 84, color: 'amber', uptime: 95.5, costEfficiency: 82, slaCompliance: 86, trend: -1 },
  { region: 'Middle East', countries: ['UAE', 'Saudi Arabia'], vendors: 3, sites: 9, score: 87, color: 'rose', uptime: 97.1, costEfficiency: 88, slaCompliance: 89, trend: 3 }
];

const WORK_TYPE_PERFORMANCE = [
  { workType: 'Build', vendors: 8, activeProjects: 24, score: 91, qualityScore: 94, onTime: 87, avgCost: '£145k', completionRate: 88 },
  { workType: 'Install', vendors: 12, activeProjects: 156, score: 89, qualityScore: 92, onTime: 89, avgCost: '£45k', completionRate: 93 },
  { workType: 'Commission', vendors: 6, activeProjects: 43, score: 93, qualityScore: 96, onTime: 87, avgCost: '£28k', completionRate: 90 },
  { workType: 'Maintain', vendors: 18, activeProjects: 312, score: 88, qualityScore: 90, onTime: 96, avgCost: '£12k', completionRate: 97 },
  { workType: 'Repair', vendors: 15, activeProjects: 89, score: 86, qualityScore: 88, onTime: 93, avgCost: '£8k', completionRate: 95 }
];

const ASSET_PERFORMANCE = [
  { asset: 'EV Chargers', units: 1247, vendors: 8, score: 94, uptime: 98.7, mttr: '2.1h', repeatFailures: 4, costPerUnit: '£450' },
  { asset: 'HVAC Systems', units: 554, vendors: 5, score: 91, uptime: 97.2, mttr: '3.5h', repeatFailures: 7, costPerUnit: '£680' },
  { asset: 'Refrigeration', units: 1893, vendors: 6, score: 89, uptime: 96.8, mttr: '2.8h', repeatFailures: 9, costPerUnit: '£520' },
  { asset: 'Lighting', units: 3421, vendors: 4, score: 93, uptime: 99.1, mttr: '1.2h', repeatFailures: 5, costPerUnit: '£390' },
  { asset: 'Security Systems', units: 687, vendors: 3, score: 92, uptime: 98.5, mttr: '1.8h', repeatFailures: 5, costPerUnit: '£580' },
  { asset: 'Building Management', units: 234, vendors: 2, score: 90, uptime: 97.6, mttr: '4.1h', repeatFailures: 8, costPerUnit: '£1250' }
];

const TOP_VENDORS_BY_REGION = [
  {
    region: 'North America',
    top: [
      { name: 'TechServe Pro', score: 96, workOrders: 1247, invoices: 982, trend: 'up' },
      { name: 'Global Maintenance Inc', score: 94, workOrders: 1089, invoices: 865, trend: 'up' }
    ],
    bottom: [
      { name: 'Quick Fix Solutions', score: 78, workOrders: 234, invoices: 312, trend: 'down' },
      { name: 'Standard Services', score: 81, workOrders: 456, invoices: 389, trend: 'stable' }
    ]
  },
  {
    region: 'Europe',
    top: [
      { name: 'Euro Maintenance Group', score: 95, workOrders: 1534, invoices: 1203, trend: 'up' },
      { name: 'Continental Services', score: 93, workOrders: 1192, invoices: 945, trend: 'up' }
    ],
    bottom: [
      { name: 'Basic Fix Ltd', score: 76, workOrders: 198, invoices: 267, trend: 'down' },
      { name: 'Regional Solutions', score: 80, workOrders: 389, invoices: 421, trend: 'down' }
    ]
  },
  {
    region: 'Asia Pacific',
    top: [
      { name: 'Asia Tech Services', score: 94, workOrders: 892, invoices: 734, trend: 'up' },
      { name: 'Pacific Maintenance Co', score: 92, workOrders: 756, invoices: 612, trend: 'up' }
    ],
    bottom: [
      { name: 'Budget Services APAC', score: 77, workOrders: 167, invoices: 203, trend: 'down' },
      { name: 'Local Fix Solutions', score: 79, workOrders: 289, invoices: 298, trend: 'stable' }
    ]
  }
];

const PREDICTIVE_INSIGHTS = [
  { 
    title: 'High Risk: Quality Degradation',
    vendor: 'Quick Fix Solutions',
    region: 'North America',
    prediction: 'Quality score likely to drop below 75% in next 30 days',
    confidence: 87,
    impact: 'High',
    recommendation: 'Initiate performance review and corrective action plan'
  },
  {
    title: 'Medium Risk: Cost Overrun',
    vendor: 'Basic Fix Ltd',
    region: 'Europe',
    prediction: 'Project costs trending 15% over budget',
    confidence: 78,
    impact: 'Medium',
    recommendation: 'Review contract terms and implement cost controls'
  },
  {
    title: 'Opportunity: Expand Scope',
    vendor: 'TechServe Pro',
    region: 'North America',
    prediction: 'Vendor capacity available for 25% more work orders',
    confidence: 92,
    impact: 'Positive',
    recommendation: 'Consider consolidating work from lower-performing vendors'
  }
];

const AUTOMATED_ACTIONS = [
  { action: 'Auto-escalation triggered for delayed work orders', vendor: 'Standard Services', status: 'In Progress', time: '2 mins ago' },
  { action: 'Performance improvement plan initiated', vendor: 'Quick Fix Solutions', status: 'Active', time: '15 mins ago' },
  { action: 'Bonus incentive calculation completed', vendor: 'TechServe Pro', status: 'Completed', time: '1 hour ago' },
  { action: 'Contract renewal recommendation generated', vendor: 'Euro Maintenance Group', status: 'Pending Review', time: '3 hours ago' }
];

// Vendor 360° View
const VENDOR_360 = [
  { 
    name: 'TechServe Pro', 
    category: 'Multi-Service',
    region: 'North America',
    score: 96, 
    contracts: 24,
    slaCompliance: 98,
    uptime: 99.5,
    repeatFailures: 3,
    costVariance: 1.2,
    hsseScore: 99,
    workload: 1247,
    capacity: 1500,
    technicianScore: 4.9,
    coverage: ['USA', 'Canada'],
    assetClasses: ['EV Chargers', 'HVAC', 'Electrical', 'Refrigeration'],
    trend: 'Excellent',
    status: 'Active',
    riskScore: 8
  },
  { 
    name: 'Euro Maintenance Group', 
    category: 'Facilities Management',
    region: 'Europe',
    score: 95, 
    contracts: 32,
    slaCompliance: 97,
    uptime: 99.2,
    repeatFailures: 4,
    costVariance: 1.8,
    hsseScore: 98,
    workload: 1534,
    capacity: 1800,
    technicianScore: 4.8,
    coverage: ['UK', 'Germany', 'France'],
    assetClasses: ['HVAC', 'Refrigeration', 'Building Management'],
    trend: 'Excellent',
    status: 'Active',
    riskScore: 10
  },
  { 
    name: 'Quick Fix Solutions', 
    category: 'Repair Services',
    region: 'North America',
    score: 78, 
    contracts: 8,
    slaCompliance: 82,
    uptime: 95.8,
    repeatFailures: 18,
    costVariance: 8.5,
    hsseScore: 86,
    workload: 234,
    capacity: 180,
    technicianScore: 3.6,
    coverage: ['USA East Coast'],
    assetClasses: ['Lighting', 'Basic Electrical'],
    trend: 'Declining',
    status: 'Warning',
    riskScore: 58
  },
  { 
    name: 'Asia Tech Services', 
    category: 'Technology Installation',
    region: 'Asia Pacific',
    score: 94, 
    contracts: 18,
    slaCompliance: 96,
    uptime: 98.8,
    repeatFailures: 5,
    costVariance: 2.1,
    hsseScore: 97,
    workload: 892,
    capacity: 1100,
    technicianScore: 4.7,
    coverage: ['China', 'Japan', 'Australia'],
    assetClasses: ['EV Chargers', 'Security Systems', 'Building Management'],
    trend: 'Improving',
    status: 'Active',
    riskScore: 12
  }
];

// Field Technician Feedback
const FIELD_FEEDBACK = [
  { technician: 'John Martinez', vendor: 'TechServe Pro', rating: 4.9, comment: 'Outstanding service, always on time with excellent documentation', date: '1 hour ago', region: 'North America' },
  { technician: 'Emma Schmidt', vendor: 'Euro Maintenance Group', rating: 4.8, comment: 'Professional team, great communication and technical expertise', date: '3 hours ago', region: 'Europe' },
  { technician: 'David Chen', vendor: 'Asia Tech Services', rating: 4.7, comment: 'Highly skilled technicians, well-equipped and efficient', date: '5 hours ago', region: 'Asia Pacific' },
  { technician: 'Sarah Johnson', vendor: 'Quick Fix Solutions', rating: 3.4, comment: 'Frequent delays, poor communication, needs improvement', date: '1 day ago', region: 'North America' },
  { technician: 'Michael Roberts', vendor: 'Standard Services', rating: 3.8, comment: 'Average service quality, documentation could be better', date: '2 days ago', region: 'North America' },
  { technician: 'Lisa Wong', vendor: 'Pacific Maintenance Co', rating: 4.6, comment: 'Good technical skills, responsive to urgent requests', date: '2 days ago', region: 'Asia Pacific' }
];

// Control Tower AI Insights
const CONTROL_TOWER_INSIGHTS = [
  {
    insight: 'TechServe Pro has capacity for 25% more work orders - recommend workload increase',
    severity: 'opportunity',
    category: 'Capacity',
    action: 'Workload reallocation in progress',
    vendor: 'TechServe Pro',
    impact: 'High'
  },
  {
    insight: 'Quick Fix Solutions shows 27% higher repeat failures on electrical systems',
    severity: 'high',
    category: 'Quality',
    action: 'Root cause analysis initiated',
    vendor: 'Quick Fix Solutions',
    impact: 'High'
  },
  {
    insight: 'Euro Maintenance Group cost efficiency improving 15% quarter-over-quarter',
    severity: 'positive',
    category: 'Cost',
    action: 'Best practice documentation scheduled',
    vendor: 'Euro Maintenance Group',
    impact: 'Medium'
  },
  {
    insight: 'Regional Services shows declining safety compliance - dropped from 95% to 88%',
    severity: 'high',
    category: 'Safety',
    action: 'Emergency safety audit triggered',
    vendor: 'Regional Services',
    impact: 'Critical'
  },
  {
    insight: 'Asia Pacific region overall performance trending up 8% - strong vendor collaboration',
    severity: 'positive',
    category: 'Regional',
    action: 'Success factors analysis underway',
    vendor: 'Multiple',
    impact: 'Medium'
  }
];

// Country-Level Drill Down
const COUNTRY_DRILLDOWN: { [key: string]: { score: number; sites: number; vendors: number; uptime: number; sla: number; cost: number } } = {
  'USA': { score: 93, sites: 134, vendors: 8, uptime: 98.7, sla: 96, cost: 95 },
  'Canada': { score: 90, sites: 53, vendors: 4, uptime: 98.2, sla: 94, cost: 92 },
  'UK': { score: 91, sites: 98, vendors: 7, uptime: 97.8, sla: 93, cost: 91 },
  'Germany': { score: 88, sites: 87, vendors: 5, uptime: 97.1, sla: 90, cost: 88 },
  'France': { score: 87, sites: 58, vendors: 3, uptime: 96.5, sla: 89, cost: 87 },
  'China': { score: 89, sites: 45, vendors: 4, uptime: 97.2, sla: 91, cost: 88 },
  'Japan': { score: 87, sites: 32, vendors: 3, uptime: 96.8, sla: 90, cost: 86 },
  'Australia': { score: 88, sites: 17, vendors: 1, uptime: 96.5, sla: 89, cost: 87 },
  'Brazil': { score: 84, sites: 14, vendors: 3, uptime: 95.8, sla: 87, cost: 83 },
  'Mexico': { score: 83, sites: 7, vendors: 2, uptime: 95.1, sla: 85, cost: 81 },
  'UAE': { score: 88, sites: 6, vendors: 2, uptime: 97.5, sla: 90, cost: 89 },
  'Saudi Arabia': { score: 85, sites: 3, vendors: 1, uptime: 96.6, sla: 88, cost: 87 }
};

interface SupplierPerformancePageProps {
  initialTab?: string;
  selectedStore?: string;
  selectedCategory?: string;
}

const SupplierPerformancePage_New: React.FC<SupplierPerformancePageProps> = ({}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeKPICategory, setActiveKPICategory] = useState('slaUptime');
  const [activeOverviewTab, setActiveOverviewTab] = useState<'suppliers' | 'region' | 'value' | 'worktype' | 'assets'>('suppliers');
  const [selectedRegion, setSelectedRegion] = useState<string | null>('North America');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [drillDownView, setDrillDownView] = useState<'overview' | 'region' | 'country' | 'vendor'>('overview');

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      
      {/* PDF Export Button - Hidden in Print */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-xl font-bold transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to PDF
        </button>
      </div>

      {/* Header - Control Tower */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden p-8 border-2 border-indigo-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-lg">Supplier Performance Control Tower</h1>
                <p className="text-indigo-200 text-sm mt-1">Real-time • Predictive • Autonomous</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-white">43</div>
                <div className="text-xs text-indigo-200">Total Suppliers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-white">88.5%</div>
                <div className="text-xs text-indigo-200">Avg Performance</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-green-400">Live</div>
                <div className="text-xs text-indigo-200">System Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW WITH TABS */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Supplier Overview
          </h2>
          <p className="text-sm text-gray-600">Comprehensive supplier distribution across dimensions</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'suppliers' as const, label: 'Number of Suppliers', icon: '👥' },
            { key: 'region' as const, label: 'By Region', icon: '🗺️' },
            { key: 'value' as const, label: 'By Value', icon: '💰' },
            { key: 'worktype' as const, label: 'By Work Type', icon: '⚙️' },
            { key: 'assets' as const, label: 'By Assets', icon: '🔧' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveOverviewTab(tab.key)}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeOverviewTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {/* Suppliers Tab */}
          {activeOverviewTab === 'suppliers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Suppliers', value: 43, icon: '👥', color: 'indigo', trend: +5 },
                { label: 'Active Contracts', value: 127, icon: '📄', color: 'blue', trend: +8 },
                { label: 'Total Sites Covered', value: 554, icon: '🏪', color: 'emerald', trend: +12 },
                { label: 'Avg Supplier Score', value: '88.5', icon: '⭐', color: 'amber', trend: +3 }
              ].map((stat, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border-2 border-indigo-200 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{stat.icon}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      stat.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                    </span>
                  </div>
                  <div className="text-4xl font-black text-indigo-700 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Region Tab */}
          {activeOverviewTab === 'region' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {REGIONAL_PERFORMANCE.map((region, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-blue-900 mb-1">{region.region}</h4>
                    <div className="text-xs text-gray-600">{region.countries.join(' • ')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white/70 rounded-lg p-2 text-center">
                      <div className="text-2xl font-black text-blue-700">{region.vendors}</div>
                      <div className="text-xs text-gray-600">Vendors</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2 text-center">
                      <div className="text-2xl font-black text-blue-700">{region.sites}</div>
                      <div className="text-xs text-gray-600">Sites</div>
                    </div>
                  </div>
                  <div className="text-center text-3xl font-black text-blue-600">{region.score}</div>
                  <div className="text-center text-xs text-gray-500">Performance Score</div>
                </div>
              ))}
            </div>
          )}

          {/* Value Tab */}
          {activeOverviewTab === 'value' && (
            <div className="space-y-4">
              {[
                { range: '£1M - £5M', vendors: 18, totalValue: '£42.5M', avgScore: 92, color: 'emerald' },
                { range: '£500K - £1M', vendors: 12, totalValue: '£8.7M', avgScore: 88, color: 'blue' },
                { range: '£100K - £500K', vendors: 8, totalValue: '£2.1M', avgScore: 85, color: 'cyan' },
                { range: '< £100K', vendors: 5, totalValue: '£320K', avgScore: 79, color: 'amber' }
              ].map((bracket, idx) => (
                <div key={idx} className="bg-gradient-to-r from-white to-emerald-50 rounded-xl p-5 border-2 border-emerald-200 hover:shadow-lg transition-all">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Value Range</div>
                      <div className="text-xl font-black text-emerald-700">{bracket.range}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Vendors</div>
                      <div className="text-2xl font-bold text-gray-900">{bracket.vendors}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Total Value</div>
                      <div className="text-2xl font-bold text-gray-900">{bracket.totalValue}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Avg Score</div>
                      <div className="text-2xl font-bold text-emerald-600">{bracket.avgScore}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Work Type Tab */}
          {activeOverviewTab === 'worktype' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {WORK_TYPE_PERFORMANCE.map((work, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all">
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-900 mb-1">{work.workType}</div>
                    <div className="text-4xl font-black text-blue-600">{work.score}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendors:</span>
                      <span className="font-bold text-gray-800">{work.vendors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Projects:</span>
                      <span className="font-bold text-blue-700">{work.activeProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-bold text-green-700">{work.qualityScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assets Tab */}
          {activeOverviewTab === 'assets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSET_PERFORMANCE.map((asset, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200 hover:shadow-xl transition-all">
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <div className="text-xl font-black text-white">{asset.score}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-900">{asset.asset}</div>
                    <div className="text-xs text-gray-600">{asset.units} units • {asset.vendors} vendors</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-xs text-gray-600">Uptime</div>
                      <div className="text-lg font-bold text-emerald-700">{asset.uptime}%</div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-xs text-gray-600">MTTR</div>
                      <div className="text-lg font-bold text-amber-700">{asset.mttr}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: SUPPLIER PERFORMANCE BASED ON KPIs */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-xl">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-black text-white">SUPPLIER PERFORMANCE BY KPIs</span>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-cyan-300 to-transparent"></div>
        </div>

        {/* KPI Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'slaUptime', label: 'SLA/Uptime', icon: '⏱️' },
            { key: 'quality', label: 'Quality', icon: '✓' },
            { key: 'cost', label: 'Cost', icon: '💰' },
            { key: 'safety', label: 'Safety/HSSE', icon: '🛡️' },
            { key: 'compliance', label: 'Compliance', icon: '📋' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveKPICategory(cat.key)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeKPICategory === cat.key
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
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

      {/* SECTION 3: INSIGHTS - TOP & BOTTOM PERFORMERS */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-black text-white">PERFORMANCE INSIGHTS</span>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-pink-300 to-transparent"></div>
        </div>

        {/* Region Selector for Insights */}
        <div className="flex gap-2 flex-wrap">
          {REGIONAL_PERFORMANCE.map((region) => (
            <button
              key={region.region}
              onClick={() => setSelectedRegion(region.region)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                selectedRegion === region.region
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {region.region}
            </button>
          ))}
        </div>

        {/* Top & Bottom Vendors */}
        {TOP_VENDORS_BY_REGION.filter(r => r.region === selectedRegion).map((regionData, idx) => (
          <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🏆</span>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Top 2 Performers</h3>
                  <p className="text-sm text-gray-600">{regionData.region}</p>
                </div>
              </div>
              <div className="space-y-4">
                {regionData.top.map((vendor, vIdx) => (
                  <div key={vIdx} className="bg-white rounded-xl p-5 shadow-md border-2 border-green-300 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xl font-black text-gray-900 mb-1">{vendor.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            #{vIdx + 1} Ranked
                          </span>
                          {vendor.trend === 'up' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                              ↑ Improving
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-green-600">{vendor.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Work Orders</div>
                        <div className="text-2xl font-bold text-blue-700">{vendor.workOrders.toLocaleString()}</div>
                      </div>
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Invoices</div>
                        <div className="text-2xl font-bold text-amber-700">{vendor.invoices.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Performers */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Bottom 2 Performers</h3>
                  <p className="text-sm text-gray-600">{regionData.region} - Needs Attention</p>
                </div>
              </div>
              <div className="space-y-4">
                {regionData.bottom.map((vendor, vIdx) => (
                  <div key={vIdx} className="bg-white rounded-xl p-5 shadow-md border-2 border-red-300 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xl font-black text-gray-900 mb-1">{vendor.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                            Underperforming
                          </span>
                          {vendor.trend === 'down' && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                              ↓ Declining
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-red-600">{vendor.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Work Orders</div>
                        <div className="text-2xl font-bold text-gray-700">{vendor.workOrders.toLocaleString()}</div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Invoices</div>
                        <div className="text-2xl font-bold text-gray-700">{vendor.invoices.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 4: PREDICTIVE INSIGHTS & AUTOMATED ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Insights */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔮</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Predictive Insights</h3>
              <p className="text-sm text-gray-600">AI-powered risk & opportunity analysis</p>
            </div>
          </div>
          <div className="space-y-4">
            {PREDICTIVE_INSIGHTS.map((insight, idx) => (
              <div key={idx} className={`bg-white rounded-xl p-4 border-2 ${
                insight.impact === 'High' ? 'border-red-300' : 
                insight.impact === 'Medium' ? 'border-amber-300' : 'border-green-300'
              } hover:shadow-lg transition-all`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
                    <div className="text-xs text-gray-600">{insight.vendor} • {insight.region}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.prediction}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">Confidence:</div>
                    <div className="font-bold text-purple-600">{insight.confidence}%</div>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">
                    View Details
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-700 mb-1">Recommendation:</div>
                  <div className="text-xs text-gray-600">{insight.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Actions */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">⚡</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Automated Actions</h3>
              <p className="text-sm text-gray-600">AI-driven autonomous interventions</p>
            </div>
          </div>
          <div className="space-y-4">
            {AUTOMATED_ACTIONS.map((action, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border-2 border-amber-300 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 mb-2">{action.action}</h4>
                    <div className="text-xs text-gray-600 mb-1">Vendor: {action.vendor}</div>
                    <div className="text-xs text-gray-500">{action.time}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    action.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    action.status === 'In Progress' || action.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {action.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-amber-300">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-gray-700">Total Actions (30 days):</div>
              <div className="text-2xl font-black text-amber-600">127</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: VENDOR 360° VIEW */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-xl">
            <span className="text-2xl">👁️</span>
            <span className="text-sm font-black text-white">VENDOR 360° SCORECARD</span>
          </div>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-teal-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {VENDOR_360.map((vendor, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-2xl cursor-pointer ${
                vendor.status === 'Warning' ? 'border-red-300 bg-red-50/30' : 
                vendor.score >= 95 ? 'border-green-300 bg-green-50/30' : 'border-blue-200'
              }`}
              onClick={() => setSelectedVendor(vendor.name)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-gray-900">{vendor.name}</h3>
                    {vendor.status === 'Warning' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        ⚠️ Warning
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold">{vendor.category}</span>
                    <span>•</span>
                    <span>{vendor.region}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-black ${
                    vendor.score >= 95 ? 'text-green-600' :
                    vendor.score >= 85 ? 'text-blue-600' :
                    vendor.score >= 75 ? 'text-amber-600' : 'text-red-600'
                  }`}>{vendor.score}</div>
                  <div className="text-xs text-gray-500 mt-1">Overall Score</div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                  <div className="text-xs text-gray-600 mb-1">SLA Compliance</div>
                  <div className="text-2xl font-bold text-blue-700">{vendor.slaCompliance}%</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3">
                  <div className="text-xs text-gray-600 mb-1">Uptime</div>
                  <div className="text-2xl font-bold text-emerald-700">{vendor.uptime}%</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                  <div className="text-xs text-gray-600 mb-1">HSSE Score</div>
                  <div className="text-2xl font-bold text-purple-700">{vendor.hsseScore}%</div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Contracts</span>
                  <span className="text-sm font-bold text-gray-900">{vendor.contracts}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Technician Rating</span>
                  <span className="text-sm font-bold text-gray-900">⭐ {vendor.technicianScore}/5</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Repeat Failures</span>
                  <span className={`text-sm font-bold ${vendor.repeatFailures > 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {vendor.repeatFailures}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Cost Variance</span>
                  <span className={`text-sm font-bold ${vendor.costVariance > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {vendor.costVariance}%
                  </span>
                </div>
              </div>

              {/* Capacity Utilization */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Capacity Utilization</span>
                  <span className="font-bold text-gray-900">{vendor.workload} / {vendor.capacity}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      (vendor.workload / vendor.capacity * 100) > 90 ? 'bg-red-500' :
                      (vendor.workload / vendor.capacity * 100) > 75 ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(vendor.workload / vendor.capacity * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Coverage & Asset Classes */}
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-bold text-gray-600 mb-1">Coverage Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.coverage.map((area, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-600 mb-1">Asset Classes</div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.assetClasses.map((asset, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Risk Score</span>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      vendor.riskScore < 20 ? 'bg-green-100 text-green-700' :
                      vendor.riskScore < 40 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {vendor.riskScore}
                    </div>
                    <span className={`text-xs font-bold ${
                      vendor.trend === 'Excellent' || vendor.trend === 'Improving' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {vendor.trend === 'Improving' || vendor.trend === 'Excellent' ? '↑' : '↓'} {vendor.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: FIELD FEEDBACK & AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Technician Feedback */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">💬</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Field Technician Feedback</h3>
              <p className="text-sm text-gray-600">Real-time insights from the ground</p>
            </div>
          </div>
          <div className="space-y-4">
            {FIELD_FEEDBACK.map((feedback, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border-2 border-indigo-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="font-bold text-gray-900">{feedback.technician}</div>
                    <div className="text-xs text-gray-600">{feedback.region} • {feedback.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      feedback.rating >= 4.5 ? 'bg-green-100 text-green-700' :
                      feedback.rating >= 4.0 ? 'bg-blue-100 text-blue-700' :
                      feedback.rating >= 3.5 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      ⭐ {feedback.rating}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-semibold text-indigo-700 mb-1">{feedback.vendor}</div>
                  <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Tower AI Insights */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🤖</span>
            <div>
              <h3 className="text-2xl font-black text-gray-900">AI Control Tower Insights</h3>
              <p className="text-sm text-gray-600">Automated intelligence & recommendations</p>
            </div>
          </div>
          <div className="space-y-4">
            {CONTROL_TOWER_INSIGHTS.map((insight, idx) => (
              <div key={idx} className={`bg-white rounded-xl p-4 border-2 hover:shadow-lg transition-all ${
                insight.severity === 'high' || insight.severity === 'critical' ? 'border-red-300' :
                insight.severity === 'opportunity' || insight.severity === 'positive' ? 'border-green-300' :
                'border-amber-300'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        insight.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        insight.severity === 'high' ? 'bg-red-100 text-red-700' :
                        insight.severity === 'opportunity' || insight.severity === 'positive' ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {insight.category}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        insight.impact === 'Critical' ? 'bg-red-200 text-red-800' :
                        insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-2">{insight.insight}</p>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">Vendor:</span> {insight.vendor}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      <span className="font-bold text-gray-700">Action:</span> {insight.action}
                    </div>
                    <button className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PERFORMANCE ANALYTICS & DRILL-DOWN */}
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
                className="group cursor-pointer relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Score Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-full border-4 border-blue-300 flex items-center justify-center shadow-lg">
                  <div className="text-2xl font-black text-blue-600">{region.score}</div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-bold text-blue-900 mb-1">{region.region}</h4>
                  <div className="text-xs text-gray-600">
                    {region.countries.join(' • ')}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/70 rounded-lg p-2">
                      <div className="font-bold text-blue-700">{region.vendors}</div>
                      <div className="text-gray-600">Vendors</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2">
                      <div className="font-bold text-blue-700">{region.sites}</div>
                      <div className="text-gray-600">Sites</div>
                    </div>
                  </div>

                  {/* Performance Bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Uptime</span>
                        <span className="font-bold text-blue-700">{region.uptime}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          style={{ width: `${region.uptime}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">SLA</span>
                        <span className="font-bold text-blue-700">{region.slaCompliance}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
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

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Comprehensive Print Styles - Matching AssetStrategyControlTower */}
      <style>{`
        @media print {
          /* Page Setup */
          @page {
            size: A3 landscape;
            margin: 0.5cm;
          }

          /* Reset body styles for print */
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          /* Force hide sidebars and navigation */
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }

          /* Complete gradient combinations - preserve exact UI appearance */
          .bg-gradient-to-br.from-gray-50.via-white.to-gray-100 {
            background: linear-gradient(to bottom right, #f9fafb, #ffffff, #f3f4f6) !important;
          }
          .bg-gradient-to-br.from-slate-900.via-indigo-900.to-purple-900 {
            background: linear-gradient(to bottom right, #0f172a, #312e81, #581c87) !important;
          }
          .bg-gradient-to-br.from-indigo-400.to-purple-500 {
            background: linear-gradient(to bottom right, #818cf8, #a855f7) !important;
          }
          .bg-gradient-to-br.from-indigo-50.to-indigo-100 {
            background: linear-gradient(to bottom right, #eef2ff, #e0e7ff) !important;
          }
          .bg-gradient-to-br.from-blue-50.to-blue-100 {
            background: linear-gradient(to bottom right, #eff6ff, #dbeafe) !important;
          }
          .bg-gradient-to-r.from-white.to-emerald-50 {
            background: linear-gradient(to right, #ffffff, #ecfdf5) !important;
          }
          .bg-gradient-to-br.from-blue-50.to-cyan-50 {
            background: linear-gradient(to bottom right, #eff6ff, #ecfeff) !important;
          }
          .bg-gradient-to-br.from-emerald-50.to-teal-50 {
            background: linear-gradient(to bottom right, #ecfdf5, #f0fdfa) !important;
          }
          .bg-gradient-to-br.from-emerald-400.to-teal-500 {
            background: linear-gradient(to bottom right, #34d399, #14b8a6) !important;
          }
          .bg-gradient-to-r.from-indigo-500.to-purple-600 {
            background: linear-gradient(to right, #6366f1, #9333ea) !important;
          }
          .bg-gradient-to-r.from-blue-500.to-cyan-500 {
            background: linear-gradient(to right, #3b82f6, #06b6d4) !important;
          }
          .bg-gradient-to-r.from-blue-500.to-cyan-600 {
            background: linear-gradient(to right, #3b82f6, #0891b2) !important;
          }
          .bg-gradient-to-r.from-green-400.to-emerald-500 {
            background: linear-gradient(to right, #4ade80, #10b981) !important;
          }
          .bg-gradient-to-r.from-blue-400.to-cyan-500 {
            background: linear-gradient(to right, #60a5fa, #06b6d4) !important;
          }
          .bg-gradient-to-r.from-purple-500.to-pink-500 {
            background: linear-gradient(to right, #a855f7, #ec4899) !important;
          }
          .bg-gradient-to-r.from-red-600.to-pink-600 {
            background: linear-gradient(to right, #dc2626, #db2777) !important;
          }
          .bg-gradient-to-r.from-transparent.via-blue-300.to-transparent {
            background: linear-gradient(to right, transparent, #93c5fd, transparent) !important;
          }
          .bg-gradient-to-l.from-transparent.via-cyan-300.to-transparent {
            background: linear-gradient(to left, transparent, #67e8f9, transparent) !important;
          }
          .bg-gradient-to-r.from-transparent.via-purple-300.to-transparent {
            background: linear-gradient(to right, transparent, #d8b4fe, transparent) !important;
          }
          .bg-gradient-to-l.from-transparent.via-pink-300.to-transparent {
            background: linear-gradient(to left, transparent, #f9a8d4, transparent) !important;
          }

          /* Radial gradient overlays */
          .bg-\\[radial-gradient\\(circle_at_30\\%_20\\%\\,rgba\\(99\\,102\\,241\\,0\\.3\\)\\,transparent_50\\%\\)\\,radial-gradient\\(circle_at_70\\%_80\\%\\,rgba\\(168\\,85\\,247\\,0\\.3\\)\\,transparent_50\\%\\)\\] {
            background: radial-gradient(circle at 30% 20%, rgba(99,102,241,0.3), transparent 50%), 
                        radial-gradient(circle at 70% 80%, rgba(168,85,247,0.3), transparent 50%) !important;
          }

          /* AGGRESSIVE GRID COLUMN FORCING - Override all responsive breakpoints */
          * { box-sizing: border-box !important; }
          
          /* Force display grid on all grid elements */
          .grid,
          [class*="grid"] { 
            display: grid !important; 
          }
          
          /* CRITICAL: Override grid-cols-1 with highest specificity */
          /* Pattern: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 -> Force 4 columns */
          [class~="grid"][class*="lg:grid-cols-4"] {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          
          /* Pattern: grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 -> Force 5 columns */
          [class~="grid"][class*="lg:grid-cols-5"] {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          
          /* Pattern: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -> Force 3 columns */
          [class~="grid"][class*="lg:grid-cols-3"]:not([class*="lg:grid-cols-5"]) {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          
          /* Pattern: grid grid-cols-1 lg:grid-cols-2 -> Force 2 columns */
          [class~="grid"][class*="lg:grid-cols-2"]:not([class*="lg:grid-cols-3"]):not([class*="lg:grid-cols-4"]):not([class*="lg:grid-cols-5"]) {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          /* Pattern: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 -> Force 5 columns (XL) */
          [class~="grid"][class*="xl:grid-cols-5"] {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          
          /* Fallback MD breakpoints if no LG is present */
          [class~="grid"][class*="md:grid-cols-2"]:not([class*="lg:grid-cols"]):not([class*="xl:grid-cols"]) {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          [class~="grid"][class*="md:grid-cols-3"]:not([class*="lg:grid-cols"]):not([class*="xl:grid-cols"]) {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          
          [class~="grid"][class*="md:grid-cols-5"]:not([class*="lg:grid-cols"]):not([class*="xl:grid-cols"]) {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          
          /* Ensure grid items don't wrap */
          .grid > * {
            min-width: 0 !important;
            max-width: 100% !important;
          }
          
          /* Base grid columns for non-responsive grids */
          .grid-cols-1:not([class*="md:grid-cols"]):not([class*="lg:grid-cols"]):not([class*="xl:grid-cols"]) { 
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important; 
          }
          .grid-cols-2:not([class*="md:grid-cols"]):not([class*="lg:grid-cols"]) { 
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important; 
          }
          .grid-cols-3:not([class*="md:grid-cols"]):not([class*="lg:grid-cols"]) { 
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important; 
          }
          .grid-cols-12 { 
            grid-template-columns: repeat(12, minmax(0, 1fr)) !important; 
          }
          
          /* Column spans */
          .col-span-12 { grid-column: span 12 / span 12 !important; }
          .lg\\\\:col-span-2 { grid-column: span 2 / span 2 !important; }
          .lg\\\\:col-span-8 { grid-column: span 8 / span 8 !important; }
          
          /* Print-specific column adjustments - full width without sidebars */
          .print\\\\:col-span-12 { 
            grid-column: span 12 / span 12 !important; 
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Force main content to full width when sidebars are hidden */
          @media print {
            .grid.grid-cols-12 > .print\\\\:col-span-12 {
              grid-column: 1 / -1 !important;
            }
          }

          /* Background colors - complete set */
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .bg-blue-200 { background-color: #bfdbfe !important; }
          .bg-cyan-50 { background-color: #ecfeff !important; }
          .bg-cyan-100 { background-color: #cffafe !important; }
          .bg-indigo-50 { background-color: #eef2ff !important; }
          .bg-indigo-100 { background-color: #e0e7ff !important; }
          .bg-indigo-200 { background-color: #c7d2fe !important; }
          .bg-purple-50 { background-color: #faf5ff !important; }
          .bg-purple-100 { background-color: #f3e8ff !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-emerald-100 { background-color: #d1fae5 !important; }
          .bg-green-50 { background-color: #f0fdf4 !important; }
          .bg-green-100 { background-color: #dcfce7 !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
          .bg-amber-100 { background-color: #fef3c7 !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .bg-red-100 { background-color: #fee2e2 !important; }
          .bg-orange-50 { background-color: #fff7ed !important; }
          .bg-pink-50 { background-color: #fdf2f8 !important; }
          .bg-teal-50 { background-color: #f0fdfa !important; }
          .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
          .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2) !important; }
          .bg-white\\/70 { background-color: rgba(255, 255, 255, 0.7) !important; }

          /* Border colors - complete set */
          .border { border-width: 1px !important; border-style: solid !important; }
          .border-2 { border-width: 2px !important; border-style: solid !important; }
          .border-4 { border-width: 4px !important; border-style: solid !important; }
          .border-gray-100 { border-color: #f3f4f6 !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
          .border-blue-200 { border-color: #bfdbfe !important; }
          .border-blue-300 { border-color: #93c5fd !important; }
          .border-indigo-200 { border-color: #c7d2fe !important; }
          .border-indigo-300 { border-color: #a5b4fc !important; }
          .border-indigo-400 { border-color: #818cf8 !important; }
          .border-purple-200 { border-color: #e9d5ff !important; }
          .border-emerald-200 { border-color: #a7f3d0 !important; }
          .border-green-200 { border-color: #bbf7d0 !important; }
          .border-amber-200 { border-color: #fde68a !important; }
          .border-red-200 { border-color: #fecaca !important; }
          .border-pink-200 { border-color: #fbcfe8 !important; }
          .border-cyan-200 { border-color: #a5f3fc !important; }
          .border-indigo-500\\/30 { border-color: rgba(99, 102, 241, 0.3) !important; }
          .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2) !important; }
          .border-white { border-color: #ffffff !important; }

          /* Text colors */
          .text-white { color: #ffffff !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-blue-200 { color: #bfdbfe !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-blue-900 { color: #1e3a8a !important; }
          .text-cyan-700 { color: #0e7490 !important; }
          .text-indigo-200 { color: #c7d2fe !important; }
          .text-indigo-600 { color: #4f46e5 !important; }
          .text-indigo-700 { color: #4338ca !important; }
          .text-indigo-800 { color: #3730a3 !important; }
          .text-emerald-600 { color: #059669 !important; }
          .text-emerald-700 { color: #047857 !important; }
          .text-green-400 { color: #4ade80 !important; }
          .text-green-600 { color: #16a34a !important; }
          .text-green-700 { color: #15803d !important; }
          .text-amber-600 { color: #d97706 !important; }
          .text-amber-700 { color: #b45309 !important; }
          .text-amber-800 { color: #92400e !important; }
          .text-red-600 { color: #dc2626 !important; }
          .text-red-700 { color: #b91c1c !important; }
          .text-red-800 { color: #991b1b !important; }
          .text-purple-700 { color: #7e22ce !important; }
          .text-pink-700 { color: #be185d !important; }

          /* Font sizes */
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
          .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
          .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
          .text-5xl { font-size: 3rem !important; line-height: 1 !important; }

          /* Font weights */
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }
          .font-black { font-weight: 900 !important; }

          /* Layout */
          .flex { display: flex !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .items-end { align-items: flex-end !important; }
          .justify-between { justify-content: space-between !important; }
          .justify-center { justify-content: center !important; }
          .flex-grow { flex-grow: 1 !important; }
          .flex-1 { flex: 1 1 0% !important; }
          .flex-col { flex-direction: column !important; }
          .flex-wrap { flex-wrap: wrap !important; }

          /* Spacing - exact gap values */
          .gap-1 { gap: 0.25rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-3 { gap: 0.75rem !important; }
          .gap-4 { gap: 1rem !important; }
          .gap-6 { gap: 1.5rem !important; }
          .space-x-2 > * + * { margin-left: 0.5rem !important; }
          .space-y-1 > * + * { margin-top: 0.25rem !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
          .space-y-3 > * + * { margin-top: 0.75rem !important; }
          .space-y-4 > * + * { margin-top: 1rem !important; }
          .space-y-6 > * + * { margin-top: 1.5rem !important; }

          /* Padding - exact values */
          .p-1 { padding: 0.25rem !important; }
          .p-2 { padding: 0.5rem !important; }
          .p-3 { padding: 0.75rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-5 { padding: 1.25rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .p-8 { padding: 2rem !important; }
          .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
          .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
          .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .pb-1 { padding-bottom: 0.25rem !important; }

          /* Width & Height - exact values */
          .w-full { width: 100% !important; }
          .w-5 { width: 1.25rem !important; }
          .w-6 { width: 1.5rem !important; }
          .w-8 { width: 2rem !important; }
          .w-10 { width: 2.5rem !important; }
          .w-12 { width: 3rem !important; }
          .w-14 { width: 3.5rem !important; }
          .w-16 { width: 4rem !important; }
          .h-3 { height: 0.75rem !important; }
          .h-5 { height: 1.25rem !important; }
          .h-6 { height: 1.5rem !important; }
          .h-8 { height: 2rem !important; }
          .h-10 { height: 2.5rem !important; }
          .h-12 { height: 3rem !important; }
          .h-14 { height: 3.5rem !important; }
          .h-16 { height: 4rem !important; }
          .h-px { height: 1px !important; }
          .max-h-64 { max-height: 16rem !important; }
          .min-h-screen { min-height: auto !important; }

          /* Margin - exact values */
          .mb-1 { margin-bottom: 0.25rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-3 { margin-bottom: 0.75rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-6 { margin-bottom: 1.5rem !important; }
          .mt-1 { margin-top: 0.25rem !important; }
          .mt-2 { margin-top: 0.5rem !important; }
          .mt-4 { margin-top: 1rem !important; }
          .ml-1 { margin-left: 0.25rem !important; }
          .ml-2 { margin-left: 0.5rem !important; }

          /* Borders & Radius - exact values */
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          .rounded-2xl { border-radius: 1rem !important; }
          .rounded-3xl { border-radius: 1.5rem !important; }
          .rounded-full { border-radius: 9999px !important; }
          .rounded-t { border-top-left-radius: 0.25rem !important; border-top-right-radius: 0.25rem !important; }

          /* Shadows - preserve for print */
          .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
          .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }

          /* Backdrop effects */
          .backdrop-blur-md { backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }

          /* Transitions */
          .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }

          /* Position */
          .relative { position: relative !important; }
          .absolute { position: absolute !important; }
          .sticky { position: relative !important; }
          .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
          .top-0 { top: 0 !important; }
          .-top-3 { top: -0.75rem !important; }
          .-right-3 { right: -0.75rem !important; }

          /* Z-index */
          .z-10 { z-index: 10 !important; }

          /* Overflow */
          .overflow-hidden { overflow: hidden !important; }
          .overflow-y-auto { overflow-y: visible !important; }
          .overflow-x-auto { overflow-x: visible !important; }

          /* Opacity */
          .opacity-0 { opacity: 0 !important; }

          /* Misc */
          .italic { font-style: italic !important; }
          .uppercase { text-transform: uppercase !important; }
          .text-center { text-align: center !important; }
          .drop-shadow-lg { filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1)) !important; }
          .cursor-pointer { cursor: default !important; }
          .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }

          /* Page breaks */
          .break-inside-avoid { break-inside: avoid !important; }
          
          /* Remove hover effects */
          *:hover {
            transform: none !important;
            box-shadow: inherit !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SupplierPerformancePage_New;
