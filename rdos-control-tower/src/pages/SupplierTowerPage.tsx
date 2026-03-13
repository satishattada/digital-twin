import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { KPIDetailModal } from '../components/KPIDetailModal';

interface SupplierItem {
  id: string;
  supplier: string;
  contract: string;
  market: string;
  category: string;
  leakageFlags: string[];
  valueAtRisk: string;
  recommendation: string;
  confidence: number;
  guardrails: number;
}

interface KPI {
  label: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];
}

const SUPPLIER_KPIS: KPI[] = [
  {
    label: 'Leakage Detected (YTD)',
    value: '£310k',
    target: '<£250k',
    trend: 'down',
    sparkline: [180, 210, 245, 280, 310]
  },
  {
    label: 'Recovery Realized',
    value: '£180k',
    target: '>£200k',
    trend: 'up',
    sparkline: [95, 120, 145, 165, 180]
  },
  {
    label: 'SLA Adherence',
    value: '89.2%',
    target: '>92%',
    trend: 'up',
    sparkline: [87, 87.5, 88, 88.5, 89.2]
  },
  {
    label: 'OTIF',
    value: '86.4%',
    target: '>90%',
    trend: 'down',
    sparkline: [88, 87.5, 87, 86.5, 86.4]
  },
  {
    label: 'FTF',
    value: '88.7%',
    target: '>85%',
    trend: 'up',
    sparkline: [86, 87, 87.5, 88, 88.7]
  },
  {
    label: 'Dispute Cycle Time',
    value: '14.2d',
    target: '<12d',
    trend: 'down',
    sparkline: [16, 15.5, 15, 14.5, 14.2]
  },
  {
    label: 'Duplicate Invoice Rate',
    value: '1.8%',
    target: '<1%',
    trend: 'down',
    sparkline: [2.5, 2.2, 2, 1.9, 1.8]
  },
  {
    label: 'Rate Variance %',
    value: '3.2%',
    target: '<2%',
    trend: 'stable',
    sparkline: [3.4, 3.3, 3.2, 3.2, 3.2]
  }
];

const SUPPLIER_AGENTS = [
  { id: 'SBA', name: 'Supplier Benchmark Agent', status: 'OK', inputsHealth: 96 },
  { id: 'SQPA', name: 'Supplier Quality Performance Agent', status: 'OK', inputsHealth: 94 },
  { id: 'LDA', name: 'Leakage Detection Agent', status: 'Warning', inputsHealth: 88 },
  { id: 'COA', name: 'Commercial Optimization Agent', status: 'OK', inputsHealth: 92 },
  { id: 'GCA', name: 'Governance & Claims Agent', status: 'OK', inputsHealth: 95 }
];

const SUPPLIERS: SupplierItem[] = [
  {
    id: 'S-001',
    supplier: 'GlobalClean APAC',
    contract: 'CT-2024-089',
    market: 'APAC',
    category: 'Cleaning',
    leakageFlags: ['Rate Var', 'SLA Breach'],
    valueAtRisk: '£62k',
    recommendation: 'Apply credit + penalty',
    confidence: 93,
    guardrails: 2
  },
  {
    id: 'S-002',
    supplier: 'MaintenanceExperts EU',
    contract: 'CT-2023-156',
    market: 'EU',
    category: 'Maintenance',
    leakageFlags: ['Rate Var', 'Duplicate'],
    valueAtRisk: '£48k',
    recommendation: 'Create claim',
    confidence: 89,
    guardrails: 1
  },
  {
    id: 'S-003',
    supplier: 'AssetCare EU',
    contract: 'CT-2024-201',
    market: 'EU',
    category: 'Asset Services',
    leakageFlags: ['Duplicate', 'OOS'],
    valueAtRisk: '£34k',
    recommendation: 'Dispute resolution',
    confidence: 91,
    guardrails: 3
  },
  {
    id: 'S-004',
    supplier: 'FacilityServices UK',
    contract: 'CT-2023-087',
    market: 'UK',
    category: 'Facilities',
    leakageFlags: ['Missed Penalty'],
    valueAtRisk: '£29k',
    recommendation: 'Apply penalty',
    confidence: 87,
    guardrails: 1
  },
  {
    id: 'S-005',
    supplier: 'CleanCo UK',
    contract: 'CT-2024-034',
    market: 'UK',
    category: 'Cleaning',
    leakageFlags: ['Missed Rebate', 'OOS'],
    valueAtRisk: '£18k',
    recommendation: 'Optimize rebate',
    confidence: 92,
    guardrails: 2
  }
];

const LEAKAGE_COMPOSITION = [
  { name: 'Rate Variance', value: 42, color: '#ef4444' },
  { name: 'Duplicate', value: 23, color: '#f59e0b' },
  { name: 'OOS', value: 18, color: '#eab308' },
  { name: 'Missed Rebate', value: 12, color: '#84cc16' },
  { name: 'Missed Penalty', value: 5, color: '#22c55e' }
];

const MARKET_CATEGORY_DATA = [
  { market: 'APAC', category: 'Cleaning', risk: 0.6, cost: 0.4, perf: 0.7 },
  { market: 'EU', category: 'Maintenance', risk: 0.4, cost: 0.3, perf: 0.8 },
  { market: 'EU', category: 'Asset Services', risk: 0.5, cost: 0.5, perf: 0.6 },
  { market: 'UK', category: 'Facilities', risk: 0.3, cost: 0.2, perf: 0.9 },
  { market: 'UK', category: 'Cleaning', risk: 0.2, cost: 0.2, perf: 0.95 }
];

const UNDERPERFORMING_SUPPLIERS = [
  { supplier: 'MaintenanceExperts EU', sla: '81%', kpi: 'FTF Rate', variance: '-9%' },
  { supplier: 'FacilityServices UK', sla: '84%', kpi: 'OTIF', variance: '-6%' },
  { supplier: 'GlobalClean APAC', sla: '78%', kpi: 'Response Time', variance: '-12%' }
];

const SUPPLIER_ALERTS = [
  { id: 'A-001', severity: 'Critical', type: 'SLA Breach', detail: 'MaintenanceExperts EU 48h response exceeded' },
  { id: 'A-002', severity: 'High', type: 'Rate Variance', detail: 'GlobalClean APAC +20.8% over contract rate' },
  { id: 'A-003', severity: 'High', type: 'Duplicate Invoice', detail: 'AssetCare EU potential duplicate £24.5k' }
];

export const SupplierTowerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [showKPIModal, setShowKPIModal] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl md:text-1xl font-bold mb-2">
            rDOS — Supplier Performance & Contract Leakage Control Tower
          </h1>
          <p className="text-green-100 text-xs">
            Monitor supplier performance, detect leakage, optimize commercial actions, and govern disputes with auditability
          </p>
        </div>
      </div>

      {/* KPI Band */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {SUPPLIER_KPIS.map((kpi, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-lg p-3 md:p-4 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all"
                onClick={() => {
                  setSelectedKPI(kpi);
                  setShowKPIModal(true);
                }}
              >
                <div className="text-xs text-gray-600 mb-1">{kpi.label}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{kpi.value}</div>
                    {kpi.target && (
                      <div className="text-xs text-gray-500">Target: {kpi.target}</div>
                    )}
                  </div>
                  {kpi.sparkline && (
                    <div className="w-16 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpi.sparkline.map((v) => ({ value: v }))}>
                          <Bar dataKey="value" fill={kpi.trend === 'up' ? '#10b981' : kpi.trend === 'down' ? '#ef4444' : '#6b7280'} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Panels */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Category/Market Heatmap */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Category/Market Heatmap</h3>
            <div className="space-y-2">
              {MARKET_CATEGORY_DATA.map((data, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2">
                  <div className="col-span-2 font-medium text-sm text-gray-900">
                    {data.market} / {data.category}
                  </div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${
                    data.risk > 0.6 ? 'bg-red-100 text-red-800' : 
                    data.risk > 0.4 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    Risk
                  </div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${
                    data.cost > 0.5 ? 'bg-red-100 text-red-800' : 
                    data.cost > 0.3 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    Cost
                  </div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${
                    data.perf < 0.6 ? 'bg-red-100 text-red-800' : 
                    data.perf < 0.8 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    Perf
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Underperforming Suppliers */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top Underperforming Suppliers</h3>
            <div className="space-y-3">
              {UNDERPERFORMING_SUPPLIERS.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-gray-900 text-sm mb-1">{item.supplier}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">SLA: <span className="font-medium text-orange-700">{item.sla}</span></span>
                    <span className="text-gray-600">KPI: {item.kpi}</span>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-medium">{item.variance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leakage Composition */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Leakage Composition</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={LEAKAGE_COMPOSITION}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {LEAKAGE_COMPOSITION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {LEAKAGE_COMPOSITION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-gray-900">Agent Status</h3>
            <button
              onClick={() => navigate('/supplier/ai-console')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Open Agent Intelligence Console →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {SUPPLIER_AGENTS.map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-gray-900">{agent.id}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'OK' ? 'bg-green-500' : 
                    agent.status === 'Warning' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}></span>
                </div>
                <div className="text-xs text-gray-600">Health: {agent.inputsHealth}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After Delta */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 md:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div>
              <div className="font-semibold text-gray-900">This Month: Before/After Delta</div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-medium text-green-700">£310k leakage detected</span> • 
                <span className="font-medium text-green-700 ml-2">£180k recovery realized</span> • 
                <span className="font-medium text-green-700 ml-2">SLA adherence +2.1pp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Worklist */}
        <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Priority Worklist</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leakage Flags</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value @ Risk</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guardrails</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SUPPLIERS.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{supplier.supplier}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.contract}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.market}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {supplier.leakageFlags.map((flag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-red-700">{supplier.valueAtRisk}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        {supplier.recommendation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${
                        supplier.confidence >= 90 ? 'text-green-700' :
                        supplier.confidence >= 80 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {supplier.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {Array.from({ length: supplier.guardrails }).map((_, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">G</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate('/supplier/workbench', { state: { supplier } })}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Open
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Optimize
                        </button>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Rail Summary */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Critical Alerts</h4>
            <div className="space-y-3">
              {SUPPLIER_ALERTS.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${
                    alert.severity === 'Critical' ? 'bg-red-500' :
                    alert.severity === 'High' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{alert.type}</div>
                    <div className="text-xs text-gray-600 mt-1">{alert.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">rDOS Data Quality Index</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Invoice Matching</span>
                  <span className="font-semibold text-yellow-700">84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Contract Alignment</span>
                  <span className="font-semibold text-green-700">91%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">GRN Completeness</span>
                  <span className="font-semibold text-yellow-700">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
              Fix Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Integration Health</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Procurement System</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Invoice OCR</span>
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">AP/Finance</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Contract Repository</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Degraded Mode Banner */}
        <div className="mt-4 md:mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-yellow-900 text-sm">Degraded Mode: Active - OCR Processing Lag</div>
              <div className="text-sm text-yellow-800 mt-1">
                OCR processing experiencing delays. Duplicate detection confidence reduced from 95% to 78%. Alert intervals widened to 6-hour batches. Invoice matching fallback to PO references only.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-6 flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            Explain in rDOS
          </button>
          <button 
            onClick={() => navigate('/supplier/workbench')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Open in Workbench
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Generate rDOS Commercial Recovery Pack
          </button>
        </div>
      </div>

      {/* KPI Detail Modal */}
      <KPIDetailModal
        kpi={selectedKPI}
        isOpen={showKPIModal}
        onClose={() => setShowKPIModal(false)}
      />
    </div>
  );
};
