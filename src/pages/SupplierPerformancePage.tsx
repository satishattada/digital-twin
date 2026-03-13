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
    { metric: 'WO Response Time', value: '2.3 hrs', target: '4 hrs', status: 'excellent', percentage: 92 },
    { metric: 'Resolution Time', value: '8.5 hrs', target: '12 hrs', status: 'good', percentage: 88 },
    { metric: 'System Uptime', value: '99.2%', target: '98%', status: 'excellent', percentage: 99 },
    { metric: 'First-Time Fix Rate', value: '87%', target: '85%', status: 'good', percentage: 87 },
    { metric: 'Callback Rate', value: '5%', target: '8%', status: 'excellent', percentage: 95 }
  ],
  quality: [
    { metric: 'Repeat Failures', value: '8%', target: '10%', status: 'good', percentage: 92 },
    { metric: 'Punch-list Age (Avg)', value: '3.2 days', target: '5 days', status: 'excellent', percentage: 94 },
    { metric: 'Installation Defects', value: '4%', target: '6%', status: 'good', percentage: 90 },
    { metric: 'Commissioning Accept Rate', value: '94%', target: '90%', status: 'excellent', percentage: 94 }
  ],
  cost: [
    { metric: 'Parts Usage Variance', value: '3%', target: '5%', status: 'excellent', percentage: 96 },
    { metric: 'Hourly Rate Leakage', value: '2.1%', target: '3%', status: 'good', percentage: 93 },
    { metric: 'Contract Compliance', value: '96%', target: '95%', status: 'excellent', percentage: 96 }
  ],
  safety: [
    { metric: 'HSSE Violations', value: '2', target: '< 5', status: 'excellent', percentage: 95 },
    { metric: 'Training Compliance', value: '98%', target: '95%', status: 'excellent', percentage: 98 },
    { metric: 'Unsafe Acts Reported', value: '3', target: '< 10', status: 'excellent', percentage: 97 }
  ],
  compliance: [
    { metric: 'Permit Delays', value: '1.2 days', target: '< 2 days', status: 'excellent', percentage: 94 },
    { metric: 'Documentation Complete', value: '92%', target: '90%', status: 'good', percentage: 92 },
    { metric: 'Evidence Availability', value: '95%', target: '93%', status: 'excellent', percentage: 95 }
  ]
};

// Supplier 360° View
const VENDOR_SCORECARDS = [
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
    trend: 'Improving',
    status: 'Active',
    riskScore: 18
  },
  { 
    name: 'Cleaning Services Plus', 
    category: 'Facility Management',
    region: 'Wales',
    score: 68, 
    contracts: 20,
    slaCompliance: 71,
    trend: 'At Risk',
    status: 'Review Required'
  }
];

const BASELINE_KPIS = [
  { kpi: 'On-Time Delivery', target: 95, current: 92, unit: '%' },
  { kpi: 'Quality Score', target: 90, current: 88, unit: '%' },
  { kpi: 'SLA Compliance', target: 98, current: 89, unit: '%' },
  { kpi: 'Cost Adherence', target: 95, current: 97, unit: '%' },
  { kpi: 'Response Time', target: 4, current: 6, unit: 'hrs' }
];

const SLA_MISSES = [
  {
    id: 1,
    vendor: 'Building Contractors Pro',
    issue: 'Delayed project completion',
    slaType: 'Delivery Timeline',
    impact: 'High',
    missedBy: '5 days',
    occurrences: 3,
    rootCause: 'Resource allocation issues'
  },
  {
    id: 2,
    vendor: 'Cleaning Services Plus',
    issue: 'Incomplete cleaning checklist',
    slaType: 'Quality Standards',
    impact: 'Medium',
    missedBy: '12%',
    occurrences: 8,
    rootCause: 'Staff turnover, inadequate training'
  },
  {
    id: 3,
    vendor: 'Refrigeration Services UK',
    issue: 'Late response to emergency call',
    slaType: 'Response Time',
    impact: 'High',
    missedBy: '2 hours',
    occurrences: 2,
    rootCause: 'Weekend coverage gaps'
  }
];

const QUALITY_DEFECTS = [
  { category: 'Installation Errors', count: 12, trend: '+15%' },
  { category: 'Documentation Gaps', count: 8, trend: '-5%' },
  { category: 'Safety Violations', count: 3, trend: '+50%' },
  { category: 'Material Defects', count: 6, trend: '-10%' }
];

const ML_PREDICTIONS = [
  {
    id: 1,
    vendor: 'Cleaning Services Plus',
    prediction: 'SLA Breach Likely',
    probability: 87,
    timeframe: '30 days',
    indicators: ['Declining quality scores', 'Increased complaint rate', 'Staff turnover spike'],
    recommendation: 'Immediate intervention required'
  },
  {
    id: 2,
    vendor: 'Building Contractors Pro',
    prediction: 'Performance Decline',
    probability: 74,
    timeframe: '45 days',
    indicators: ['Consistent delays', 'Budget overruns', 'Communication gaps'],
    recommendation: 'Schedule corrective action meeting'
  },
  {
    id: 3,
    vendor: 'Refrigeration Services UK',
    prediction: 'Response Time Issues',
    probability: 62,
    timeframe: '60 days',
    indicators: ['Weekend coverage weakness', 'Seasonal demand peaks'],
    recommendation: 'Review service coverage model'
  }
];

const QBR_ACTIVITIES = [
  {
    vendor: 'HVAC Solutions Ltd',
    status: 'Completed',
    date: '2026-02-10',
    score: 94,
    actions: 2,
    outcome: 'Continue partnership'
  },
  {
    vendor: 'Electrical Systems Inc',
    status: 'Scheduled',
    date: '2026-02-25',
    score: 91,
    actions: 0,
    outcome: 'Pending'
  },
  {
    vendor: 'Building Contractors Pro',
    status: 'In Progress',
    date: '2026-02-20',
    score: 72,
    actions: 5,
    outcome: 'Performance Improvement Plan'
  }
];

const CONTRACT_DELIVERABLES = [
  { deliverable: 'Monthly Performance Reports', compliance: 98, dueDate: '1st of month' },
  { deliverable: 'Safety Certifications', compliance: 100, dueDate: 'Quarterly' },
  { deliverable: 'Insurance Documentation', compliance: 95, dueDate: 'Annually' },
  { deliverable: 'Emergency Response Plan', compliance: 88, dueDate: 'Semi-annually' }
];

const SOURCING_REPOSITORY = [
  { type: 'Contracts', count: 147, status: 'Active', lastUpdated: '2 days ago' },
  { type: 'Scopes', count: 89, status: 'Active', lastUpdated: '1 week ago' },
  { type: 'Templates', count: 34, status: 'Active', lastUpdated: '3 days ago' },
  { type: 'Rate Cards', count: 56, status: 'Active', lastUpdated: '5 days ago' },
  { type: 'Commercial Terms', count: 212, status: 'Active', lastUpdated: '1 day ago' }
];

const SOURCING_ANALYTICS = [
  { metric: 'Sourcing Cycle Time', value: '14 days', target: '21 days', status: 'Ahead' },
  { metric: 'Negotiation Defects', value: '3%', target: '5%', status: 'Good' },
  { metric: 'Contract Leakage', value: '2.1%', target: '3%', status: 'Good' },
  { metric: 'Category Coverage', value: '94%', target: '90%', status: 'Excellent' }
];

const COST_PREDICTIONS = [
  { category: 'HVAC Services', currentCost: '$125k', predictedCost: '$132k', change: '+5.6%', confidence: 89 },
  { category: 'Electrical Work', currentCost: '$98k', predictedCost: '$95k', change: '-3.1%', confidence: 82 },
  { category: 'Cleaning Services', currentCost: '$76k', predictedCost: '$81k', change: '+6.6%', confidence: 91 },
  { category: 'Refrigeration', currentCost: '$54k', predictedCost: '$57k', change: '+5.5%', confidence: 85 }
];

const AUTONOMOUS_SOURCING_TASKS = [
  { task: 'SoW Draft for HVAC Maintenance', status: 'Completed', vendor: 'HVAC Solutions Ltd', automationScore: 95 },
  { task: 'Contract Clause Comparison', status: 'In Progress', vendor: 'Multiple Vendors', automationScore: 88 },
  { task: 'Vendor Recommendation - Electrical', status: 'Scheduled', vendor: 'TBD', automationScore: 0 },
  { task: 'RFP Cycle Initiation - Cleaning', status: 'In Progress', vendor: 'Multiple Vendors', automationScore: 72 }
];

export const SupplierPerformancePage: React.FC<SupplierPerformancePageProps> = ({
  selectedStore,
  selectedCategory,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 overflow-y-auto">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Supplier Performance Dashboard
              </h1>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Vendor Management & Contract Performance Analytics
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="group text-center bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">45</div>
              <div className="text-xs font-medium opacity-90">Active Vendors</div>
              <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="group text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">87%</div>
              <div className="text-xs font-medium opacity-90">Avg Performance</div>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                <span>+3.2%</span>
              </div>
            </div>
            <div className="group text-center bg-gradient-to-br from-orange-500 to-red-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-xs font-medium opacity-90">At Risk</div>
              <div className="mt-2 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Supplier Performance Framework</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        <div className="h-px flex-grow bg-gradient-to-l from-transparent via-purple-300 to-transparent"></div>
      </div>

      {/* Supplier Performance Framework - Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Baseline KPIs & Vendor Scorecards - Enhanced */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-indigo-100">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-50"></div>
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">Baseline KPIs & Vendor Scorecards</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Real-time Monitoring</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border-l-4 border-indigo-500">
              Establishes baseline KPIs, penalties, vendor scorecards, and contract deliverables. 
              Ensures consistency across vendor engagements.
            </p>

            {/* Baseline KPIs */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                </svg>
                Baseline Performance KPIs
              </h3>
              <div className="space-y-3">
                {BASELINE_KPIS.map((kpi, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-3 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">{kpi.kpi}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          kpi.current >= kpi.target ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpi.current}{kpi.unit}
                        </span>
                        <span className="text-xs text-gray-400">/</span>
                        <span className="text-xs text-gray-600">{kpi.target}{kpi.unit}</span>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          kpi.current >= kpi.target 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : 'bg-gradient-to-r from-red-400 to-orange-600'
                        } shadow-md`}
                        style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                      >
                        <div className="h-full w-full bg-gradient-to-t from-transparent to-white/30"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Scorecards */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Vendor Performance Scorecards
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {VENDOR_SCORECARDS.map((vendor, idx) => (
                  <div 
                    key={idx} 
                    className={`relative bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-4 transition-all cursor-pointer transform hover:scale-[1.02] ${
                      selectedVendor === vendor.name 
                        ? 'border-indigo-500 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50' 
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedVendor(vendor.name)}
                  >
                    {/* Status Indicator Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      vendor.score >= 90 ? 'bg-gradient-to-b from-green-400 to-green-600' : 
                      vendor.score >= 75 ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' : 
                      'bg-gradient-to-b from-red-400 to-red-600'
                    }`}></div>
                    
                    <div className="ml-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{vendor.name}</h4>
                          <p className="text-xs text-gray-500">{vendor.category}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-2xl font-bold ${
                            vendor.score >= 90 ? 'text-green-600' : 
                            vendor.score >= 75 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {vendor.score}
                          </span>
                          <span className="text-xs text-gray-500">Score</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div className="bg-blue-50 rounded p-1 text-center">
                          <div className="font-bold text-blue-700">{vendor.contracts}</div>
                          <div className="text-gray-600">Contracts</div>
                        </div>
                        <div className="bg-purple-50 rounded p-1 text-center">
                          <div className="font-bold text-purple-700">{vendor.slaCompliance}%</div>
                          <div className="text-gray-600">SLA</div>
                        </div>
                        <div className={`rounded p-1 text-center ${
                          vendor.trend === 'Excellent' || vendor.trend === 'Improving' ? 'bg-green-50' :
                          vendor.trend === 'Good' ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                          <div className={`font-bold ${
                            vendor.trend === 'Excellent' || vendor.trend === 'Improving' ? 'text-green-700' :
                            vendor.trend === 'Good' ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {vendor.trend}
                          </div>
                          <div className="text-gray-600">Trend</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${
                            vendor.slaCompliance >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                            vendor.slaCompliance >= 75 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${vendor.slaCompliance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Deliverables */}
            <div className="mt-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Contract Deliverables Compliance</h3>
              <div className="space-y-2">
                {CONTRACT_DELIVERABLES.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex-grow">
                      <div className="font-medium text-gray-700">{item.deliverable}</div>
                      <div className="text-gray-500">{item.dueDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            item.compliance >= 95 ? 'bg-green-500' : 
                            item.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.compliance}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 w-8">{item.compliance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Diagnostic Analysis - SLA Misses & Quality Defects */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-orange-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">Diagnostic Analysis & Issue Tracking</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Active Monitoring</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-orange-50/50 p-3 rounded-lg border-l-4 border-orange-500">
              Performs diagnostic analysis of SLA misses, quality defects and repeat contractor issues. 
              Reduces governance blind spots.
            </p>

            {/* SLA Misses */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                SLA Misses & Breaches
              </h3>
              <div className="space-y-3">
                {SLA_MISSES.map((miss) => (
                  <div key={miss.id} className={`bg-gradient-to-r from-white to-gray-50 border-l-4 rounded-lg p-3 ${
                    miss.impact === 'High' ? 'border-red-500' : 'border-orange-500'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{miss.vendor}</h4>
                        <p className="text-xs text-gray-600">{miss.issue}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        miss.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {miss.impact}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 text-gray-800 font-medium">{miss.slaType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Missed By:</span>
                        <span className="ml-1 text-red-600 font-bold">{miss.missedBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Occurrences:</span>
                        <span className="ml-1 text-gray-800 font-medium">{miss.occurrences}x</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs bg-yellow-50 p-2 rounded">
                      <span className="text-yellow-800">
                        <strong>Root Cause:</strong> {miss.rootCause}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Defects */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Quality Defects Analysis
              </h3>
              <div className="space-y-3">
                {QUALITY_DEFECTS.map((defect, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        defect.count > 10 ? 'bg-red-100' : 
                        defect.count > 5 ? 'bg-orange-100' : 'bg-yellow-100'
                      }`}>
                        <span className={`text-lg font-bold ${
                          defect.count > 10 ? 'text-red-600' : 
                          defect.count > 5 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {defect.count}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{defect.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${
                        defect.trend.startsWith('+') 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {defect.trend.startsWith('+') ? '↑' : '↓'}
                        {defect.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repeat Contractor Issues */}
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-sm font-bold text-red-800">Repeat Contractor Issues</h3>
              </div>
              <div className="space-y-2 text-xs text-red-700">
                <p>• Building Contractors Pro: 3 consecutive project delays</p>
                <p>• Cleaning Services Plus: Quality checklist failures in 40% of sites</p>
                <p>• Refrigeration Services UK: Weekend emergency response gaps recurring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - ML Predictions & QBR Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. ML Predictions - Performance Decline & SLA Breaches */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-cyan-100">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">ML-Powered Performance Predictions</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">AI Analysis Active</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-cyan-50/50 p-3 rounded-lg border-l-4 border-cyan-500">
              Predicts vendor performance decline or SLA breaches in future cycles using ML.
            </p>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-sm font-semibold text-cyan-800">Machine Learning Predictions</h3>
              </div>
              <p className="text-xs text-cyan-700">
                AI models analyze historical performance data, seasonal patterns, and early warning indicators 
                to predict vendor issues 30-90 days in advance.
              </p>
            </div>

            {/* ML Predictions */}
            <div className="space-y-4">
              {ML_PREDICTIONS.map((prediction) => (
                <div key={prediction.id} className="bg-white border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{prediction.vendor}</h3>
                      <p className="text-xs text-gray-500 mt-1">{prediction.prediction}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{prediction.probability}%</div>
                      <div className="text-xs text-gray-500">Probability</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Confidence Level</span>
                      <span className="text-orange-600 font-bold">{prediction.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 bg-gradient-to-r from-orange-400 to-red-600 rounded-full"
                        style={{ width: `${prediction.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="text-xs font-semibold text-blue-800 mb-2">Early Warning Indicators:</div>
                    <ul className="space-y-1">
                      {prediction.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-xs text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-600">Timeframe: <strong>{prediction.timeframe}</strong></span>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Take Action
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                      <strong>Recommendation:</strong> {prediction.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. QBR Agent - Autonomous Performance Reviews */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-purple-100">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">QBR Agent - Autonomous Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">AI Agent Active</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-purple-50/50 p-3 rounded-lg border-l-4 border-purple-500">
              QBR Agent automates performance reviews, drafts QBR decks and initiates corrective actions with vendors.
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-sm font-semibold text-purple-800">Autonomous QBR Automation</h3>
              </div>
              <p className="text-xs text-purple-700 mb-2">
                AI agent automatically prepares quarterly business reviews, generates presentation decks, 
                and schedules vendor meetings based on performance data.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-600 font-medium">Processing 12 QBRs this quarter</span>
              </div>
            </div>

            {/* QBR Activities */}
            <div className="space-y-3 mb-4">
              {QBR_ACTIVITIES.map((qbr, idx) => (
                <div key={idx} className={`bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-4 ${
                  qbr.status === 'Completed' ? 'border-green-200' :
                  qbr.status === 'In Progress' ? 'border-blue-200' : 'border-purple-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{qbr.vendor}</h4>
                      <p className="text-xs text-gray-500">QBR Date: {qbr.date}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      qbr.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      qbr.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {qbr.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-indigo-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-indigo-700">{qbr.score}</div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-orange-700">{qbr.actions}</div>
                      <div className="text-xs text-gray-600">Actions</div>
                    </div>
                    <div className={`rounded-lg p-2 text-center ${
                      qbr.score >= 90 ? 'bg-green-50' : qbr.score >= 75 ? 'bg-yellow-50' : 'bg-red-50'
                    }`}>
                      <div className={`text-xs font-bold ${
                        qbr.score >= 90 ? 'text-green-700' : qbr.score >= 75 ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {qbr.outcome}
                      </div>
                    </div>
                  </div>

                  {qbr.status === 'In Progress' && (
                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                      <strong>Auto-Generated Actions:</strong> Performance improvement plan drafted, 
                      follow-up meeting scheduled, metrics tracking initiated
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Agent Capabilities */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">QBR Agent Capabilities</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Auto-generates QBR presentation decks</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Schedules vendor meetings automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Initiates corrective action workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Tracks action items and follows up</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Sends automated performance notifications</span>
                </div>
              </div>
            </div>

            {/* Active Automation Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-600">QBRs Automated</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">28</div>
                <div className="text-xs text-gray-600">Actions Initiated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Sourcing(2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5. Sourcing - Repository & Analytics */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-teal-200 hover:border-teal-400">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-transparent rounded-bl-full transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full"></div>
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-white font-bold text-xl">5</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                </div>
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-teal-400 animate-ping opacity-20"></div>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Sourcing Repository & Analytics</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-xs font-semibold text-teal-600">Centralized Management Active</span>
                </div>
              </div>
            </div>
            
            <div className="relative mb-5 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-xl border-l-4 border-teal-500 shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400/5 rounded-full -mr-10 -mt-10"></div>
              <p className="text-sm text-gray-700 leading-relaxed relative z-10">
                <span className="font-bold text-teal-700">Creates centralized repository</span> of contracts, scopes, templates, rates and commercial terms. 
                Enables <span className="font-semibold text-emerald-700">consistent sourcing</span> and reduces negotiation defects. 
                <span className="font-semibold text-cyan-700">Diagnoses sourcing bottlenecks</span>, identifies leakage, and analyses cycle inefficiencies.
              </p>
            </div>

            {/* Centralized Repository */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Centralized Repository</span>
                </h3>
                <div className="bg-teal-100 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-teal-700">538 Total Items</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {SOURCING_REPOSITORY.map((item, idx) => (
                  <div key={idx} className="group/item relative bg-gradient-to-br from-white via-white to-teal-50/30 border-2 border-teal-100 rounded-xl p-3.5 hover:border-teal-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Hover Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-emerald-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-md">
                            <span className="text-xl font-black bg-gradient-to-br from-teal-600 to-emerald-600 bg-clip-text text-transparent">{item.count}</span>
                          </div>
                          {/* Animated Ring */}
                          <div className="absolute inset-0 rounded-xl border-2 border-teal-400 opacity-0 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all duration-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 group-hover/item:text-teal-700 transition-colors">{item.type}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-xs text-gray-500">Updated {item.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
                          ✓ {item.status}
                        </span>
                        <svg className="w-4 h-4 text-teal-400 opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sourcing Analytics */}
            <div className="relative bg-gradient-to-br from-white to-teal-50/50 border-2 border-teal-200 rounded-2xl p-5 shadow-lg overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-300/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Performance Analytics</span>
                  </h3>
                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700">All Systems Go</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {SOURCING_ANALYTICS.map((item, idx) => (
                    <div key={idx} className="group/metric bg-white border-2 border-teal-100 rounded-xl p-4 hover:border-teal-400 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-800 group-hover/metric:text-teal-700 transition-colors">{item.metric}</span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1.5 ${
                          item.status === 'Excellent' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                          item.status === 'Good' || item.status === 'Ahead' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' : 
                          'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700'
                        }`}>
                          {item.status === 'Excellent' && '⭐'}
                          {(item.status === 'Good' || item.status === 'Ahead') && '✓'}
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{item.value}</span>
                        <div className="h-px flex-grow bg-gradient-to-r from-teal-200 to-transparent"></div>
                        <span className="text-xs text-gray-500 font-medium">Target: <span className="font-bold text-gray-700">{item.target}</span></span>
                      </div>
                      {/* Progress Visualization */}
                      <div className="relative h-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full transition-all duration-1000 shadow-lg"
                             style={{width: item.status === 'Excellent' ? '100%' : item.status === 'Good' || item.status === 'Ahead' ? '90%' : '75%'}}>
                          <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mt-5 relative bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-2 border-teal-300 rounded-2xl p-4 shadow-lg overflow-hidden">
              {/* Animated Sparkle Effect */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 right-8 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-sm font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Key Benefits & Impact</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-lg">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span className="text-teal-800 font-medium">Consistent sourcing across categories</span>
                </div>
                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-lg">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span className="text-emerald-800 font-medium">Reduced negotiation defects by <span className="font-bold">40%</span></span>
                </div>
                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-lg">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span className="text-cyan-800 font-medium">Transparency in procurement cycles</span>
                </div>
                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-lg">
                  <span className="text-teal-500 font-bold">✓</span>
                  <span className="text-teal-800 font-medium">Centralized knowledge base</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Sourcing - Predictions & Autonomous Agent */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-amber-200 hover:border-amber-400">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 opacity-70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.15),transparent_50%)]"></div>
          
          {/* Animated Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-orange-300/10 to-transparent rounded-full"></div>
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <span className="text-white font-bold text-xl drop-shadow-lg">6</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                </div>
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-ping opacity-20"></div>
                {/* Sparkle Effect */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Cost Predictions & Autonomous Sourcing</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-xs font-semibold text-amber-600">AI-Powered Automation Active</span>
                </div>
              </div>
            </div>
            
            <div className="relative mb-5 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border-l-4 border-amber-500 shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/5 rounded-full -mr-10 -mt-10"></div>
              <p className="text-sm text-gray-700 leading-relaxed relative z-10">
                <span className="font-bold text-amber-700">Predicts cost, TCO, market rate changes</span> and identifies vendor risk exposure based on historical 
                procurement datasets. <span className="font-semibold text-yellow-700">Autonomous Sourcing Agent</span> drafts SoWs, compares contract clauses, 
                <span className="font-semibold text-orange-700"> recommends vendors and initiates RFP cycles</span>.
              </p>
            </div>

            {/* Cost Predictions */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Cost & TCO Predictions</span>
                </h3>
                <div className="bg-amber-100 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-amber-700">ML-Powered</span>
                </div>
              </div>
              <div className="space-y-3">
                {COST_PREDICTIONS.map((pred, idx) => (
                  <div key={idx} className="group/pred relative bg-gradient-to-br from-white via-white to-amber-50/30 border-2 border-amber-100 rounded-xl p-4 hover:border-amber-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-yellow-500/0 opacity-0 group-hover/pred:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow">
                          <div className="text-sm font-bold text-gray-800 group-hover/pred:text-amber-700 transition-colors mb-2">{pred.category}</div>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-100 px-2 py-1 rounded-lg">
                              <span className="text-xs text-gray-600">Current: <span className="font-bold text-gray-800">{pred.currentCost}</span></span>
                            </div>
                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1 rounded-lg">
                              <span className="text-xs text-amber-700">Predicted: <span className="font-bold text-amber-800">{pred.predictedCost}</span></span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className={`text-lg font-black ${
                            pred.change.startsWith('+') ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'
                          } bg-clip-text text-transparent`}>
                            {pred.change}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">{pred.confidence}% confidence</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 font-medium">Prediction Confidence</span>
                          <span className="text-xs font-bold text-amber-600">{pred.confidence}%</span>
                        </div>
                        <div className="relative h-2.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-full transition-all duration-1000 shadow-lg"
                            style={{ width: `${pred.confidence}%` }}
                          >
                            <div className="h-full w-full bg-gradient-to-r from-white/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Autonomous Sourcing Agent */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                Autonomous Sourcing Agent
              </h3>
              <div className="space-y-2 mb-3">
                {AUTONOMOUS_SOURCING_TASKS.map((task, idx) => (
                  <div key={idx} className={`bg-white border-2 rounded-lg p-3 ${
                    task.status === 'Completed' ? 'border-green-200' :
                    task.status === 'In Progress' ? 'border-blue-200' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-grow">
                        <div className="text-sm font-semibold text-gray-800">{task.task}</div>
                        <div className="text-xs text-gray-500 mt-1">{task.vendor}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    {task.automationScore > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-grow bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-1.5 bg-gradient-to-r from-amber-400 to-green-600 rounded-full"
                            style={{ width: `${task.automationScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{task.automationScore}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agent Capabilities */}
              <div className="bg-amber-50 rounded-lg p-3">
                <h4 className="text-xs font-bold text-amber-800 mb-2">Agent Capabilities:</h4>
                <div className="space-y-1 text-xs text-amber-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Drafts Statements of Work (SoWs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Compares contract clauses across vendors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Recommends optimal vendors by category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Initiates RFP cycles automatically</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="group/stat relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-300/10 rounded-full -mr-8 -mt-8"></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl font-black bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover/stat:scale-110 transition-transform">4</div>
                  <div className="text-xs font-bold text-gray-600">Active RFPs</div>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-2 rounded-full"></div>
                </div>
              </div>
              <div className="group/stat relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-300/10 rounded-full -mr-8 -mt-8"></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl font-black bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 group-hover/stat:scale-110 transition-transform">$2.3M</div>
                  <div className="text-xs font-bold text-gray-600">Cost Savings Identified</div>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent mt-2 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insight Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Supplier Performance Framework Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              The Supplier Performance framework provides comprehensive vendor management through baseline KPIs (1), 
              diagnostic analysis of issues (2), ML-powered predictions (3), autonomous QBR automation (4), 
              centralized sourcing repository (5), and AI-powered cost predictions with autonomous sourcing agent (6). 
              This data-driven approach reduces governance blind spots and enables proactive vendor management.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-600">87%</div>
                <div className="text-xs text-gray-600">Avg Vendor Performance</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">13</div>
                <div className="text-xs text-gray-600">Issues Identified</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200">
                <div className="text-2xl font-bold text-cyan-600">82%</div>
                <div className="text-xs text-gray-600">Prediction Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-colors z-40 group"
      >
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full blink-live-data"></div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Supplier Performance AI Assistant
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
