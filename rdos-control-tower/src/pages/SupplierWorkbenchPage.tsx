import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const SupplierWorkbenchPage: React.FC = () => {
  const location = useLocation();
  const initialSupplier = location.state?.supplier || null;
  const [selectedSupplier, setSelectedSupplier] = useState<any>(initialSupplier);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'decisions' | 'comparisons'>(
    initialSupplier ? 'decisions' : 'portfolio'
  );
  const [smeFeedback, setSmeFeedback] = useState<'up' | 'down' | null>(null);
  const [showConfidenceToast, setShowConfidenceToast] = useState(false);

  const portfolio = [
    {
      supplier: 'GlobalClean APAC',
      contract: 'CT-2024-089',
      market: 'APAC',
      category: 'Cleaning',
      perfScore: 87,
      slaAdherence: '87.2%',
      otif: '84.1%',
      ftf: '88.5%',
      leakageFlags: ['Rate Var', 'SLA Breach'],
      valueAtRisk: '£62K',
      potentialRecovery: '£52K',
      recommendation: 'Apply credit + penalty',
      confidence: 93,
      guardrails: 2,
      terms: '24 months',
      rateCards: '3 active',
      volumes: '£2.4M/year',
      indexation: 'CPI + 2%',
      expiry: '2024-12-31'
    },
    {
      supplier: 'MaintenanceExperts EU',
      contract: 'CT-2023-156',
      market: 'EU',
      category: 'Maintenance',
      perfScore: 82,
      slaAdherence: '89.8%',
      otif: '81.3%',
      ftf: '90.2%',
      leakageFlags: ['Rate Var', 'Duplicate'],
      valueAtRisk: '£48K',
      potentialRecovery: '£38K',
      recommendation: 'Create claim',
      confidence: 89,
      guardrails: 1,
      terms: '36 months',
      rateCards: '2 active',
      volumes: '£1.8M/year',
      indexation: 'Fixed',
      expiry: '2025-06-30'
    },
    {
      supplier: 'AssetCare EU',
      contract: 'CT-2024-201',
      market: 'EU',
      category: 'Asset Services',
      perfScore: 91,
      slaAdherence: '91.1%',
      otif: '87.9%',
      ftf: '86.7%',
      leakageFlags: ['Duplicate', 'OOS'],
      valueAtRisk: '£34K',
      potentialRecovery: '£28K',
      recommendation: 'Dispute resolution',
      confidence: 91,
      guardrails: 3,
      terms: '12 months',
      rateCards: '4 active',
      volumes: '£3.1M/year',
      indexation: 'WPI + 1.5%',
      expiry: '2024-09-30'
    },
    {
      supplier: 'FacilityServices UK',
      contract: 'CT-2023-087',
      market: 'UK',
      category: 'Facilities',
      perfScore: 85,
      slaAdherence: '88.5%',
      otif: '88.2%',
      ftf: '85.1%',
      leakageFlags: ['Missed Penalty'],
      valueAtRisk: '£29K',
      potentialRecovery: '£24K',
      recommendation: 'Apply penalty',
      confidence: 87,
      guardrails: 1,
      terms: '24 months',
      rateCards: '5 active',
      volumes: '£4.2M/year',
      indexation: 'CPI',
      expiry: '2025-03-31'
    },
    {
      supplier: 'CleanCo UK',
      contract: 'CT-2024-034',
      market: 'UK',
      category: 'Cleaning',
      perfScore: 94,
      slaAdherence: '94.8%',
      otif: '92.3%',
      ftf: '93.1%',
      leakageFlags: ['Missed Rebate', 'OOS'],
      valueAtRisk: '£18K',
      potentialRecovery: '£16K',
      recommendation: 'Optimize rebate',
      confidence: 92,
      guardrails: 2,
      terms: '24 months',
      rateCards: '2 active',
      volumes: '£1.2M/year',
      indexation: 'CPI + 1%',
      expiry: '2025-08-15'
    }
  ];

  const kpiTrends = [
    { month: 'Sep', otif: 89, ftf: 88, response: 92, defects: 8 },
    { month: 'Oct', otif: 87, ftf: 89, response: 91, defects: 9 },
    { month: 'Nov', otif: 85, ftf: 87, response: 90, defects: 10 },
    { month: 'Dec', otif: 84, ftf: 88, response: 89, defects: 11 },
    { month: 'Jan', otif: 86, ftf: 90, response: 91, defects: 9 }
  ];

  const varianceWaterfall = [
    { name: 'Contracted', value: 2400 },
    { name: 'Rate Var', value: -62 },
    { name: 'Duplicates', value: -28 },
    { name: 'OOS', value: -18 },
    { name: 'Invoiced', value: 2292 }
  ];

  const leakageComposition = [
    { name: 'Rate Variance', value: 42, color: '#ef4444' },
    { name: 'Duplicate Inv', value: 23, color: '#f59e0b' },
    { name: 'Out-of-Scope', value: 18, color: '#eab308' },
    { name: 'Missed Rebate', value: 17, color: '#84cc16' }
  ];

  const disputeHistory = [
    { date: '2024-01', claims: 2, resolved: 2, recovery: 12 },
    { date: '2024-02', claims: 1, resolved: 1, recovery: 8 },
    { date: '2024-03', claims: 3, resolved: 2, recovery: 15 },
    { date: '2024-04', claims: 2, resolved: 2, recovery: 11 },
    { date: '2024-05', claims: 1, resolved: 0, recovery: 0 }
  ];

  // Comparison data
  const comparisonSuppliers = [
    { supplier: 'GlobalClean APAC', perfScore: 87, slaAdherence: 87.2, otif: 84.1, recovery: 52, compliance: 94 },
    { supplier: 'MaintenanceExperts EU', perfScore: 91, slaAdherence: 91.1, otif: 87.9, recovery: 28, compliance: 97 },
    { supplier: 'AssetCare EU', perfScore: 94, slaAdherence: 94.8, otif: 93.5, recovery: 18, compliance: 98 }
  ];

  const handleSmeFeedback = (feedback: 'up' | 'down') => {
    setSmeFeedback(feedback);
    setShowConfidenceToast(true);
    setTimeout(() => setShowConfidenceToast(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl md:text-1xl font-bold mb-2">
            Supplier Strategy Workbench
          </h1>
          <p className="text-green-100 text-xs">
            Advanced analytics and optimization tools for supplier performance, contract compliance, and leakage recovery strategies
          </p>
        </div>
      </div>

      {/* Confidence Toast */}
      {showConfidenceToast && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Confidence Uplift: +2% — Feedback captured</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          <button
            onClick={() => { setActiveTab('portfolio'); setSelectedSupplier(null); }}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'portfolio' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'decisions' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Decisions
          </button>
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'comparisons' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Comparisons
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'portfolio' && !selectedSupplier && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap gap-3">
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Markets</option>
                  <option>UK</option>
                  <option>FR</option>
                  <option>DE</option>
                  <option>EU</option>
                  <option>ES</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Categories</option>
                  <option>Maintenance</option>
                  <option>Cleaning</option>
                  <option>Facilities</option>
                  <option>Security</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Lifecycle</option>
                  <option>Active</option>
                  <option>Expiring Soon</option>
                  <option>Under Review</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Suppliers</option>
                  <option>GlobalClean APAC</option>
                  <option>MaintenanceExperts EU</option>
                  <option>AssetCare EU</option>
                  <option>FacilityServices UK</option>
                  <option>CleanCo UK</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Risk Bands</option>
                  <option>High Risk</option>
                  <option>Medium Risk</option>
                  <option>Low Risk</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Confidence</option>
                  <option>High (&gt;90%)</option>
                  <option>Medium (70-90%)</option>
                  <option>Low (&lt;70%)</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Compliance</option>
                  <option>Compliant</option>
                  <option>At Risk</option>
                  <option>Non-Compliant</option>
                </select>
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Supplier Portfolio</h2>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contract</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Market</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Perf Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SLA</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">OTIF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">FTF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Leakage Flags</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Value @ Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Recovery</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Recommendation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Guardrails</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {portfolio.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-green-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedSupplier(item);
                        setActiveTab('decisions');
                      }}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.supplier}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.contract}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.market}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            item.perfScore >= 90 ? 'text-green-600' :
                            item.perfScore >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.perfScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.slaAdherence}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.otif}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.ftf}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.leakageFlags.map((flag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">{flag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">{item.valueAtRisk}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">{item.potentialRecovery}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.recommendation}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{item.guardrails} rules</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="text-xs font-medium text-green-600">View</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div>
            {!selectedSupplier ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Select a supplier from the Portfolio tab to view decision details</p>
              </div>
            ) : (
              <div>
            <button
              onClick={() => setSelectedSupplier(null)}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Portfolio
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Supplier/Contract Profile */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Profile</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Access: Full</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-600 text-xs">Supplier</div>
                      <div className="font-semibold text-gray-900">{selectedSupplier.supplier}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs">Contract</div>
                      <div className="font-medium text-gray-900">{selectedSupplier.contract}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-600 text-xs">Market</div>
                        <div className="font-medium">{selectedSupplier.market}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Category</div>
                        <div className="font-medium">{selectedSupplier.category}</div>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="text-gray-600 text-xs mb-2">Contract Terms</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Term:</span>
                          <span className="font-medium">{selectedSupplier.terms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate Cards:</span>
                          <span className="font-medium">{selectedSupplier.rateCards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">SLA Adherence:</span>
                          <span className="font-medium">{selectedSupplier.slaAdherence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volumes:</span>
                          <span className="font-medium">{selectedSupplier.volumes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Indexation:</span>
                          <span className="font-medium">{selectedSupplier.indexation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry:</span>
                          <span className="font-medium">{selectedSupplier.expiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Recommendation Card + Visuals */}
              <div className="lg:col-span-6 space-y-4">
                {/* rDOS Recommendation Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">rDOS Recommendation</h3>
                      <p className="text-gray-700">
                        {selectedSupplier.recommendation} — Apply <span className="font-bold text-green-700">{selectedSupplier.potentialRecovery} credit</span> for rate variance; 
                        initiate renegotiation on indexation clause
                      </p>
                      <div className="text-xs text-gray-600 mt-2">
                        Expected Recovery: {selectedSupplier.potentialRecovery} • Confidence: {selectedSupplier.confidence}% • Value at Risk: {selectedSupplier.valueAtRisk}
                      </div>
                    </div>
                  </div>

                  {/* Reasoning Map */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Agent Reasoning Map</h4>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="font-semibold text-blue-900 mb-1">Signal</div>
                        <div className="text-gray-700">Rate variance 2.8%</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div className="font-semibold text-yellow-900 mb-1">Threshold</div>
                        <div className="text-gray-700">&gt; 2.5% policy</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded p-2">
                        <div className="font-semibold text-orange-900 mb-1">Impact</div>
                        <div className="text-gray-700">£62K overcharge</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="font-semibold text-green-900 mb-1">Recommendation</div>
                        <div className="text-gray-700">Credit + renegotiate</div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Chips */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Evidence:</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Rate variance &gt; 2.5%</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Duplicate invoices ×3</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">OOS line items</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Missed SLA penalties</span>
                    </div>
                  </div>

                  {/* Guardrail Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="group relative">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-medium cursor-help">
                        Policy RC-12
                      </span>
                      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        Constrained by Rate-Card Rule (RC-12): Credits require Finance approval over £50K. <span className="underline">View Clause</span>
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded font-medium cursor-help">
                        Approval Threshold
                      </span>
                      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        Requires C&P + Finance sign-off for credits above £50K threshold.
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1 bg-green-600 text-white text-xs rounded font-medium cursor-help">
                        Budget Window
                      </span>
                      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        Must align with Q2 budget allocation and spending window constraints.
                      </div>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Confidence</span>
                        <span className="font-semibold text-green-700">{selectedSupplier.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedSupplier.confidence}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        = (model confidence × evidence strength × data completeness)
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">KPI Trends</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={kpiTrends}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line type="monotone" dataKey="otif" stroke="#2563eb" strokeWidth={2} name="OTIF" />
                        <Line type="monotone" dataKey="ftf" stroke="#10b981" strokeWidth={2} name="FTF" />
                        <Line type="monotone" dataKey="response" stroke="#f59e0b" strokeWidth={2} name="Response" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Variance Waterfall</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={varianceWaterfall}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="value">
                          {varianceWaterfall.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Leakage Composition</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={leakageComposition}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          dataKey="value"
                          label={({ value }) => `${value}%`}
                          labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                        >
                          {leakageComposition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Dispute History</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={disputeHistory}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="claims" fill="#3b82f6" name="Claims" />
                        <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right: Decision Panel */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Decision Panel</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm">
                      ✓ Approve & Create Claim
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors text-sm">
                      🔄 Request Re-analysis
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                      ⚠️ Override (provide reason)
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-colors text-sm">
                      📋 Launch Claim
                    </button>
                    
                    <button className="w-full px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors text-sm">
                      👤 Assign Owner
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Comment:</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                      rows={3}
                      placeholder="Add your notes..."
                    ></textarea>
                  </div>

                  {/* What-if Section */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">What-if Analysis</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-gray-600">Adjust Credit:</label>
                        <input type="number" defaultValue="52000" className="w-full mt-1 px-2 py-1 border rounded text-sm" />
                      </div>
                      <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                        Ask rDOS to Recompute
                      </button>
                    </div>
                  </div>

                  {/* Audit Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Audit Preview</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Decision logged with full lineage</div>
                      <div>• Evidence artifacts attached</div>
                      <div>• Guardrail compliance verified</div>
                    </div>
                  </div>

                  {/* SME Feedback */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">SME Feedback</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSmeFeedback('up')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          smeFeedback === 'up'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        👍 Agree
                      </button>
                      <button
                        onClick={() => handleSmeFeedback('down')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          smeFeedback === 'down'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        👎 Disagree
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Related Documents */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Related Documents & Evidence</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-sm">Invoices</span>
                  </div>
                  <div className="text-xs text-gray-600">32 documents</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-sm">POs</span>
                  </div>
                  <div className="text-xs text-gray-600">28 documents</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-sm">GRNs</span>
                  </div>
                  <div className="text-xs text-gray-600">24 documents</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-sm">Timesheets</span>
                  </div>
                  <div className="text-xs text-gray-600">18 documents</div>
                </div>
              </div>
              
              {/* Attachments Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="font-medium text-gray-700">Attachments:</span>
                  <div className="flex flex-wrap gap-2">
                    <button className="text-blue-600 hover:text-blue-700 hover:underline">Contract_Terms_{selectedSupplier.contract}.pdf</button>
                    <span className="text-gray-400">•</span>
                    <button className="text-blue-600 hover:text-blue-700 hover:underline">Rate_Card_Updates.xlsx</button>
                    <span className="text-gray-400">•</span>
                    <button className="text-blue-600 hover:text-blue-700 hover:underline">SLA_Agreement_{selectedSupplier.market}.pdf</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
              )}
          </div>
        )}

        {activeTab === 'comparisons' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Supplier Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Metric</th>
                    {comparisonSuppliers.map((s, idx) => (
                      <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{s.supplier}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Performance Score</td>
                    {comparisonSuppliers.map((s, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.perfScore}%</span>
                          {idx > 0 && (
                            <span className={`text-xs ${s.perfScore > comparisonSuppliers[0].perfScore ? 'text-green-600' : 'text-red-600'}`}>
                              {s.perfScore > comparisonSuppliers[0].perfScore ? '▲' : '▼'} {Math.abs(s.perfScore - comparisonSuppliers[0].perfScore)}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">SLA Adherence</td>
                    {comparisonSuppliers.map((s, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.slaAdherence}%</span>
                          {idx > 0 && (
                            <span className={`text-xs ${s.slaAdherence > comparisonSuppliers[0].slaAdherence ? 'text-green-600' : 'text-red-600'}`}>
                              {s.slaAdherence > comparisonSuppliers[0].slaAdherence ? '▲' : '▼'} {Math.abs(s.slaAdherence - comparisonSuppliers[0].slaAdherence).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">OTIF</td>
                    {comparisonSuppliers.map((s, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.otif}%</span>
                          {idx > 0 && (
                            <span className={`text-xs ${s.otif > comparisonSuppliers[0].otif ? 'text-green-600' : 'text-red-600'}`}>
                              {s.otif > comparisonSuppliers[0].otif ? '▲' : '▼'} {Math.abs(s.otif - comparisonSuppliers[0].otif).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Potential Recovery</td>
                    {comparisonSuppliers.map((s, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">£{s.recovery}K</span>
                          {idx > 0 && (
                            <span className={`text-xs ${s.recovery < comparisonSuppliers[0].recovery ? 'text-green-600' : 'text-red-600'}`}>
                              {s.recovery < comparisonSuppliers[0].recovery ? '▼' : '▲'} £{Math.abs(s.recovery - comparisonSuppliers[0].recovery)}K
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Compliance</td>
                    {comparisonSuppliers.map((s, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.compliance}%</span>
                          {idx > 0 && (
                            <span className={`text-xs ${s.compliance > comparisonSuppliers[0].compliance ? 'text-green-600' : 'text-red-600'}`}>
                              {s.compliance > comparisonSuppliers[0].compliance ? '▲' : '▼'} {Math.abs(s.compliance - comparisonSuppliers[0].compliance)}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
                Export Comparison
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium">
                Add Supplier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
