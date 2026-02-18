import React, { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';

interface AssetStrategyControlTowerProps {
  selectedStore?: string;
  selectedCategory?: string;
}

// KPI Data
const TOP_KPIS = [
  { label: 'Lifecycle Readiness Index', value: '87.5%', trend: +5.2, target: '90%', status: 'good', icon: '📊' },
  { label: 'Renew/Refurb Forecast Accuracy', value: '94.3%', trend: +2.1, target: '95%', status: 'excellent', icon: '🎯' },
  { label: 'High-Risk Assets This Quarter', value: '23', trend: -15, target: '<20', status: 'warning', icon: '⚠️' },
  { label: 'Projected Capex Required', value: '£12.4M', trend: +8.5, target: '£15M', status: 'good', icon: '💰' },
  { label: 'Compliance Obligations At Risk', value: '3', trend: -40, target: '0', status: 'improving', icon: '📋' },
  { label: 'Energy/Cost Efficiency Delta YoY', value: '+12.3%', trend: +12.3, target: '+10%', status: 'excellent', icon: '⚡' }
];

// Asset Age Distribution Data
const ASSET_AGE_DATA = [
  { range: '0-5 years', count: 234, percentage: 42 },
  { range: '5-10 years', count: 187, percentage: 34 },
  { range: '10-15 years', count: 98, percentage: 18 },
  { range: '15+ years', count: 35, percentage: 6 }
];

// Lifecycle Stage Data
const LIFECYCLE_STAGES = [
  { stage: 'New', count: 234, color: 'emerald', percentage: 42 },
  { stage: 'Mid-life', count: 187, color: 'blue', percentage: 34 },
  { stage: 'End-of-life', count: 133, color: 'amber', percentage: 24 }
];

// Asset Classes Data
const ASSET_CLASSES = [
  { class: 'EV Chargers', replacementValue: '£3.2M', criticality: 'High', count: 156, status: 'Good' },
  { class: 'HVAC Systems', replacementValue: '£2.8M', criticality: 'Critical', count: 98, status: 'Monitor' },
  { class: 'Refrigeration', replacementValue: '£4.1M', criticality: 'High', count: 187, status: 'Good' },
  { class: 'Lighting', replacementValue: '£1.2M', criticality: 'Medium', count: 423, status: 'Excellent' },
  { class: 'Security Systems', replacementValue: '£890K', criticality: 'High', count: 67, status: 'Good' }
];

// Compliance Obligations
const COMPLIANCE_TAGS = [
  'Energy Performance Certificate',
  'Fire Safety Compliance',
  'Electrical Safety Testing',
  'Gas Safety Certification',
  'Accessibility Standards',
  'Environmental Regulations'
];

// Diagnostic Insights
const DIAGNOSTIC_INSIGHTS = [
  { type: 'warning', title: 'Underperforming Asset Class', description: 'HVAC systems showing 23% higher failure rate', region: 'North Region' },
  { type: 'alert', title: 'Rising Cost Cluster', description: 'Refrigeration maintenance costs up 34% YoY', region: 'South Region' },
  { type: 'info', title: 'Lifecycle Anomalies', description: '12 assets operating beyond optimal replacement window', region: 'Multiple' }
];

// Failure Trend Data
const FAILURE_TRENDS = [
  { month: 'Jan', failures: 12 },
  { month: 'Feb', failures: 15 },
  { month: 'Mar', failures: 18 },
  { month: 'Apr', failures: 14 },
  { month: 'May', failures: 11 },
  { month: 'Jun', failures: 9 },
  { month: 'Jul', failures: 13 },
  { month: 'Aug', failures: 16 },
  { month: 'Sep', failures: 12 },
  { month: 'Oct', failures: 10 },
  { month: 'Nov', failures: 8 },
  { month: 'Dec', failures: 7 }
];

// Predictive Renewals
const RENEWAL_FORECAST = [
  { quarter: 'Q1 2026', assets: 23, capex: '£2.1M', risk: 'Low' },
  { quarter: 'Q2 2026', assets: 45, capex: '£4.3M', risk: 'Medium' },
  { quarter: 'Q3 2026', assets: 67, capex: '£6.8M', risk: 'High' },
  { quarter: 'Q4 2026', assets: 34, capex: '£3.2M', risk: 'Medium' }
];

// AI Recommendations
const AI_RECOMMENDATIONS = [
  { id: 1, priority: 'High', asset: 'HVAC - Building 12', action: 'Replace', timeline: 'Q2 2026', capex: '£145K', reason: 'Operating 18 months beyond optimal lifecycle' },
  { id: 2, priority: 'High', asset: 'EV Chargers - Site 34', action: 'Upgrade', timeline: 'Q1 2026', capex: '£89K', reason: 'Technology obsolescence risk' },
  { id: 3, priority: 'Medium', asset: 'Refrigeration - Store 56', action: 'Refurbish', timeline: 'Q3 2026', capex: '£67K', reason: 'Preventive cost optimization' },
  { id: 4, priority: 'Medium', asset: 'Lighting - Multiple Sites', action: 'LED Retrofit', timeline: 'Q2 2026', capex: '£234K', reason: 'Energy efficiency improvement' },
  { id: 5, priority: 'Low', asset: 'Security - Building 8', action: 'Monitor', timeline: 'Q4 2026', capex: '£0', reason: 'No action required this period' }
];

// AI Insights & Alerts
const AI_INSIGHTS = [
  { severity: 'high', title: '5 Assets Past Optimal Replacement Window', description: 'Immediate action required to prevent failures', count: 5 },
  { severity: 'medium', title: 'Region B at 3× Energy Cost Benchmark', description: 'Significant cost optimization opportunity', savings: '£450K/yr' },
  { severity: 'high', title: 'Predicted Capex Shortfall in Q3', description: 'Budget reallocation needed', amount: '£2.3M' },
  { severity: 'warning', title: 'Compliance Deadline Approaching', description: '3 obligations due within 30 days', deadline: 'Mar 15, 2026' }
];

const AssetStrategyControlTower: React.FC<AssetStrategyControlTowerProps> = ({}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Asset Classes');
  const [selectedScenario, setSelectedScenario] = useState('Base Case');

  const navigationTabs = [
    'Asset Classes',
    'Lifecycle Twin',
    'Cost Twin',
    'Predictive Models',
    'Portfolio Scenarios',
    'AI Strategy Agent',
    'Governance & Approvals'
  ];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 space-y-6">
      
      {/* PDF Export Button - Hidden in Print */}
      <button
        onClick={handleExportPDF}
        className="print:hidden fixed top-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-2xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export to PDF
      </button>

      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 rounded-3xl shadow-2xl p-8 border-2 border-green-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.3),transparent_50%)]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-2xl flex items-center justify-center">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg">Asset Strategy Digital Twin – Control Tower</h1>
                  <p className="text-green-200 text-sm mt-1">Portfolio • Lifecycle • Cost • Risk • Predictive Planning</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {TOP_KPIS.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{kpi.icon}</div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                kpi.status === 'excellent' ? 'bg-green-100 text-green-700' :
                kpi.status === 'good' ? 'bg-blue-100 text-blue-700' :
                kpi.status === 'improving' ? 'bg-cyan-100 text-cyan-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-xs text-gray-600 mb-2">{kpi.label}</div>
            <div className="text-xs text-gray-500">Target: {kpi.target}</div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT PANEL - Navigation */}
        <div className="col-span-12 lg:col-span-2 print:hidden">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-100 sticky top-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Navigation</h3>
            <div className="space-y-2">
              {navigationTabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CANVAS - Four Quadrants */}
        <div className="col-span-12 lg:col-span-8 print:col-span-12 space-y-6">
          
          {/* Top Row: Descriptive & Diagnostic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* STAGE 1 - DESCRIPTIVE TWIN */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">

                <div>
                  <h3 className="text-lg font-black text-gray-900">Asset Strategy Baseline Twin</h3>
                  <p className="text-xs text-gray-600">DESCRIPTIVE</p>
                </div>
              </div>

              {/* Asset Age Distribution Bar Chart */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Asset Age Distribution</h4>
                <div className="space-y-2">
                  {ASSET_AGE_DATA.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700">{item.range}</span>
                        <span className="font-bold text-gray-900">{item.count} assets</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-3 bg-gradient-to-r from-green-400 to-emerald-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifecycle Stage Pie */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Assets by Lifecycle Stage</h4>
                <div className="grid grid-cols-3 gap-2">
                  {LIFECYCLE_STAGES.map((stage, idx) => (
                    <div key={idx} className={`bg-${stage.color}-100 rounded-lg p-3 text-center`}>
                      <div className={`text-2xl font-black text-${stage.color}-700`}>{stage.count}</div>
                      <div className="text-xs text-gray-700">{stage.stage}</div>
                      <div className="text-xs text-gray-600">{stage.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Tags */}
              <div className="mb-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Top Compliance Obligations</h4>
                <div className="flex flex-wrap gap-2">
                  {COMPLIANCE_TAGS.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white rounded-lg text-xs font-semibold text-gray-700 border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-600 italic mt-4">
                "Unified baseline of asset classes, lifecycle, cost, compliance, criticality."
              </p>
            </div>

            {/* STAGE 2 - DIAGNOSTIC TWIN */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">

                <div>
                  <h3 className="text-lg font-black text-gray-900">Performance & Cost Diagnostics</h3>
                  <p className="text-xs text-gray-600">DIAGNOSTIC</p>
                </div>
              </div>

              {/* Failure Trend Chart */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Failure Trend (Last 12 Months)</h4>
                <div className="flex items-end justify-between h-24 gap-1">
                  {FAILURE_TRENDS.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t"
                        style={{ height: `${(item.failures / 20) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-1">{item.month.slice(0, 1)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Insights */}
              <div className="space-y-2 mb-4">
                {DIAGNOSTIC_INSIGHTS.map((insight, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border-2 ${
                    insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                    insight.type === 'alert' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="text-sm font-bold text-gray-900">{insight.title}</div>
                        <div className="text-xs text-gray-700 mt-1">{insight.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Region: {insight.region}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        insight.type === 'warning' ? 'bg-amber-200 text-amber-800' :
                        insight.type === 'alert' ? 'bg-red-200 text-red-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {insight.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600 italic mt-4">
                "Identify lifecycle inefficiencies, cost spikes, and root causes."
              </p>
            </div>
          </div>

          {/* Bottom Row: Predictive & Autonomous */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* STAGE 3 - PREDICTIVE TWIN */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">

                <div>
                  <h3 className="text-lg font-black text-gray-900">Renew / Refurb / Retire Predictions</h3>
                  <p className="text-xs text-gray-600">PREDICTIVE</p>
                </div>
              </div>

              {/* ML-driven Renewal Forecast */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Next 12-Month Capex Projection</h4>
                <div className="space-y-2">
                  {RENEWAL_FORECAST.map((forecast, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">{forecast.quarter}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          forecast.risk === 'High' ? 'bg-red-100 text-red-700' :
                          forecast.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {forecast.risk} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Assets:</span>
                          <span className="font-bold text-gray-900 ml-1">{forecast.assets}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Capex:</span>
                          <span className="font-bold text-amber-700 ml-1">{forecast.capex}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What-If Scenarios */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">What-If Scenarios</h4>
                <select 
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option>Base Case</option>
                  <option>Accelerated Replacement</option>
                  <option>Cost Optimization</option>
                  <option>Risk Mitigation</option>
                </select>
              </div>

              <p className="text-xs text-gray-600 italic mt-4">
                "Predict lifecycle transitions, budget needs, risk exposure."
              </p>
            </div>

            {/* STAGE 4 - AUTONOMOUS TWIN */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">

                <div>
                  <h3 className="text-lg font-black text-gray-900">Strategy AI Agent – Autonomous Capex Planner</h3>
                  <p className="text-xs text-gray-600">AUTONOMOUS</p>
                </div>
              </div>

              {/* Auto-generated Recommendations */}
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {AI_RECOMMENDATIONS.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-lg p-3 border-2 border-purple-200 hover:border-purple-400 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority}
                          </span>
                          <span className="text-xs font-bold text-gray-900">{rec.asset}</span>
                        </div>
                        <div className="text-xs text-gray-700">{rec.action} • {rec.timeline} • {rec.capex}</div>
                        <div className="text-xs text-gray-500 mt-1 italic">{rec.reason}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm hover:from-purple-700 hover:to-pink-700 transition-all">
                  Generate Capex Pack
                </button>
                <button className="px-4 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all">
                  Submit for Approval
                </button>
                <button className="px-4 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all">
                  Trigger Workflow
                </button>
              </div>

              <p className="text-xs text-gray-600 italic mt-4">
                "AI Agent auto-generates strategy cases, recommendations, and workflows."
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Insights & Actions */}
        <div className="col-span-12 lg:col-span-2 print:hidden">
          <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Insights & Alerts
            </h3>
            
            <div className="space-y-3">
              {AI_INSIGHTS.map((insight, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-2 ${
                  insight.severity === 'high' ? 'bg-red-50 border-red-200' :
                  insight.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className={`text-sm font-bold mb-1 ${
                    insight.severity === 'high' ? 'text-red-800' :
                    insight.severity === 'medium' ? 'text-amber-800' :
                    'text-blue-800'
                  }`}>
                    {insight.title}
                  </div>
                  <div className="text-xs text-gray-700">{insight.description}</div>
                  {insight.count && <div className="text-xs font-bold text-gray-900 mt-1">Count: {insight.count}</div>}
                  {insight.savings && <div className="text-xs font-bold text-green-700 mt-1">Potential Savings: {insight.savings}</div>}
                  {insight.amount && <div className="text-xs font-bold text-red-700 mt-1">Amount: {insight.amount}</div>}
                  {insight.deadline && <div className="text-xs font-bold text-amber-700 mt-1">Deadline: {insight.deadline}</div>}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
              View Recommended Actions
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Last updated: <span className="font-bold text-gray-900">Feb 18, 2026 14:32 GMT</span>
            </span>
            <span className="text-sm text-gray-600">via Digital Twin Sync</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Integrations:</span>
            <div className="flex gap-2">
              {['CMMS', 'eM+', 'IoT', 'BIM/CDE'].map((integration, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200">
                  {integration}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />

      {/* Comprehensive Print Styles */}
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
          .bg-gradient-to-br.from-slate-900.via-green-900.to-emerald-900 {
            background: linear-gradient(to bottom right, #0f172a, #14532d, #064e3b) !important;
          }
          .bg-gradient-to-br.from-emerald-400.to-green-500 {
            background: linear-gradient(to bottom right, #34d399, #22c55e) !important;
          }
          .bg-gradient-to-br.from-green-50.to-emerald-50 {
            background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5) !important;
          }
          .bg-gradient-to-br.from-blue-50.to-cyan-50 {
            background: linear-gradient(to bottom right, #eff6ff, #ecfeff) !important;
          }
          .bg-gradient-to-br.from-amber-50.to-orange-50 {
            background: linear-gradient(to bottom right, #fffbeb, #fff7ed) !important;
          }
          .bg-gradient-to-br.from-purple-50.to-pink-50 {
            background: linear-gradient(to bottom right, #faf5ff, #fdf2f8) !important;
          }
          .bg-gradient-to-br.from-green-500.to-emerald-600 {
            background: linear-gradient(to bottom right, #22c55e, #059669) !important;
          }
          .bg-gradient-to-br.from-blue-500.to-cyan-600 {
            background: linear-gradient(to bottom right, #3b82f6, #0891b2) !important;
          }
          .bg-gradient-to-br.from-amber-500.to-orange-600 {
            background: linear-gradient(to bottom right, #f59e0b, #ea580c) !important;
          }
          .bg-gradient-to-br.from-purple-500.to-pink-600 {
            background: linear-gradient(to bottom right, #a855f7, #db2777) !important;
          }
          .bg-gradient-to-r.from-green-400.to-emerald-500 {
            background: linear-gradient(to right, #4ade80, #10b981) !important;
          }
          .bg-gradient-to-r.from-green-500.to-emerald-600 {
            background: linear-gradient(to right, #22c55e, #059669) !important;
          }
          .bg-gradient-to-r.from-green-600.to-emerald-600 {
            background: linear-gradient(to right, #16a34a, #059669) !important;
          }
          .bg-gradient-to-r.from-purple-600.to-pink-600 {
            background: linear-gradient(to right, #9333ea, #db2777) !important;
          }
          .bg-gradient-to-t.from-blue-500.to-cyan-400 {
            background: linear-gradient(to top, #3b82f6, #22d3ee) !important;
          }

          /* Radial gradient overlays */
          .bg-\\[radial-gradient\\(circle_at_30\\%_20\\%\\,rgba\\(16\\,185\\,129\\,0\\.3\\)\\,transparent_50\\%\\)\\,radial-gradient\\(circle_at_70\\%_80\\%\\,rgba\\(5\\,150\\,105\\,0\\.3\\)\\,transparent_50\\%\\)\\] {
            background: radial-gradient(circle at 30% 20%, rgba(16,185,129,0.3), transparent 50%), 
                        radial-gradient(circle at 70% 80%, rgba(5,150,105,0.3), transparent 50%) !important;
          }

          /* Force grid columns to maintain structure - prevent row stacking */
          * { box-sizing: border-box !important; }
          
          .grid { display: grid !important; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
          .grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
          .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }

          /* Force responsive grids to display in columns */
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .xl\\:grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
          
          /* Column spans */
          .col-span-12 { grid-column: span 12 / span 12 !important; }
          .lg\\:col-span-2 { grid-column: span 2 / span 2 !important; }
          .lg\\:col-span-8 { grid-column: span 8 / span 8 !important; }
          
          /* Print-specific column adjustments - full width without sidebars */
          .print\\:col-span-12 { 
            grid-column: span 12 / span 12 !important; 
            width: 100% !important;
            max-width: 100% !important;
          }
          .print\\:hidden { 
            display: none !important; 
            visibility: hidden !important;
          }

          /* Force main content to full width when sidebars are hidden */
          @media print {
            .grid.grid-cols-12 > .print\\:col-span-12 {
              grid-column: 1 / -1 !important;
            }
          }

          /* Background colors - complete set */
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .bg-green-50 { background-color: #f0fdf4 !important; }
          .bg-green-100 { background-color: #d1fae5 !important; }
          .bg-green-200 { background-color: #a7f3d0 !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-emerald-100 { background-color: #d1fae5 !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .bg-cyan-50 { background-color: #ecfeff !important; }
          .bg-cyan-100 { background-color: #cffafe !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
          .bg-amber-100 { background-color: #fef3c7 !important; }
          .bg-amber-200 { background-color: #fde68a !important; }
          .bg-orange-50 { background-color: #fff7ed !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .bg-red-100 { background-color: #fee2e2 !important; }
          .bg-red-200 { background-color: #fecaca !important; }
          .bg-purple-50 { background-color: #faf5ff !important; }
          .bg-pink-50 { background-color: #fdf2f8 !important; }
          .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
          .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2) !important; }

          /* Border colors - complete set */
          .border { border-width: 1px !important; border-style: solid !important; }
          .border-2 { border-width: 2px !important; border-style: solid !important; }
          .border-gray-100 { border-color: #f3f4f6 !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-green-200 { border-color: #a7f3d0 !important; }
          .border-green-500\\/30 { border-color: rgba(34, 197, 94, 0.3) !important; }
          .border-blue-200 { border-color: #bfdbfe !important; }
          .border-cyan-200 { border-color: #a5f3fc !important; }
          .border-amber-200 { border-color: #fde68a !important; }
          .border-orange-200 { border-color: #fed7aa !important; }
          .border-red-200 { border-color: #fecaca !important; }
          .border-purple-200 { border-color: #e9d5ff !important; }
          .border-purple-300 { border-color: #d8b4fe !important; }
          .border-pink-200 { border-color: #fbcfe8 !important; }
          .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2) !important; }

          /* Text colors */
          .text-white { color: #ffffff !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-green-200 { color: #a7f3d0 !important; }
          .text-green-700 { color: #15803d !important; }
          .text-emerald-700 { color: #047857 !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-cyan-700 { color: #0e7490 !important; }
          .text-amber-700 { color: #b45309 !important; }
          .text-amber-800 { color: #92400e !important; }
          .text-red-700 { color: #b91c1c !important; }
          .text-red-800 { color: #991b1b !important; }
          .text-purple-700 { color: #7e22ce !important; }

          /* Font sizes */
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
          .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
          .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }

          /* Font weights */
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }
          .font-black { font-weight: 900 !important; }

          /* Layout */
          .flex { display: flex !important; }
          .grid { display: grid !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .items-end { align-items: flex-end !important; }
          .justify-between { justify-content: space-between !important; }
          .justify-center { justify-content: center !important; }
          .flex-grow { flex-grow: 1 !important; }
          .flex-1 { flex: 1 1 0% !important; }
          .flex-col { flex-direction: column !important; }

          /* Spacing - exact gap values */
          .gap-1 { gap: 0.25rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-3 { gap: 0.75rem !important; }
          .gap-4 { gap: 1rem !important; }
          .gap-6 { gap: 1.5rem !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
          .space-y-3 > * + * { margin-top: 0.75rem !important; }
          .space-y-4 > * + * { margin-top: 1rem !important; }
          .space-y-6 > * + * { margin-top: 1.5rem !important; }

          /* Padding - exact values */
          .p-1 { padding: 0.25rem !important; }
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

          /* Borders */
          .border { border-width: 1px !important; }
          .border-2 { border-width: 2px !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          .rounded-2xl { border-radius: 1rem !important; }
          .rounded-3xl { border-radius: 1.5rem !important; }
          .rounded-full { border-radius: 9999px !important; }
          .rounded-t { border-top-left-radius: 0.25rem !important; border-top-right-radius: 0.25rem !important; }

          /* Shadows - preserve for print */
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
          .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }

          /* Position */
          .relative { position: relative !important; }
          .absolute { position: absolute !important; }
          .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }

          /* Z-index */
          .z-10 { z-index: 10 !important; }

          /* Overflow */
          .overflow-hidden { overflow: hidden !important; }
          .overflow-y-auto { overflow-y: auto !important; }

          /* Width & Height - exact values */
          .w-full { width: 100% !important; }
          .w-5 { width: 1.25rem !important; }
          .w-6 { width: 1.5rem !important; }
          .w-9 { width: 2.25rem !important; }
          .w-10 { width: 2.5rem !important; }
          .w-16 { width: 4rem !important; }
          .h-3 { height: 0.75rem !important; }
          .h-5 { height: 1.25rem !important; }
          .h-6 { height: 1.5rem !important; }
          .h-9 { height: 2.25rem !important; }
          .h-10 { height: 2.5rem !important; }
          .h-16 { height: 4rem !important; }
          .h-24 { height: 6rem !important; }
          .max-h-64 { max-height: 16rem !important; }
          .min-h-screen { min-height: auto !important; }

          /* Margin - exact values */
          .mb-1 { margin-bottom: 0.25rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-3 { margin-bottom: 0.75rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mt-1 { margin-top: 0.25rem !important; }
          .mt-2 { margin-top: 0.5rem !important; }
          .mt-4 { margin-top: 1rem !important; }
          .ml-1 { margin-left: 0.25rem !important; }

          /* Borders & Radius - exact values */
          .border { border-width: 1px !important; }
          .border-2 { border-width: 2px !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          .rounded-2xl { border-radius: 1rem !important; }
          .rounded-3xl { border-radius: 1.5rem !important; }
          .rounded-full { border-radius: 9999px !important; }
          .rounded-t { border-top-left-radius: 0.25rem !important; border-top-right-radius: 0.25rem !important; }

          /* Shadows - preserve for print */
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
          .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }

          /* Backdrop effects */
          .backdrop-blur-md { backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }

          /* Transitions */
          .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }

          /* Opacity */
          .opacity-0 { opacity: 0 !important; }

          /* Misc */
          .italic { font-style: italic !important; }
          .drop-shadow-lg { filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1)) !important; }

          /* Page breaks */
          .break-inside-avoid { break-inside: avoid !important; }
        }
      `}</style>
    </div>
  );
};

export default AssetStrategyControlTower;
