import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SAMPLE_ASSETS } from '../constants';
import { Asset } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export const StrategyWorkbenchPage: React.FC = () => {
  const location = useLocation();
  const initialAsset = location.state?.asset || null;
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(initialAsset);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'decisions' | 'comparisons'>(
    initialAsset ? 'decisions' : 'portfolio'
  );
  const [showConfidenceToast, setShowConfidenceToast] = useState(false);
  const [smeFeedback, setSmeFeedback] = useState<'up' | 'down' | null>(null);

  // Enhanced portfolio data
  const portfolio = SAMPLE_ASSETS.map(asset => ({
    ...asset,
    lifecycle: asset.rul < 180 ? 'End-of-Life' : asset.rul < 365 ? 'Mature' : 'Mid-Life',
    criticalityLabel: asset.criticality > 7 ? 'Critical' : asset.criticality > 4 ? 'High' : 'Medium',
    health: Math.round((1 - asset.risk) * 100),
    timingWindow: asset.rul < 90 ? 'Immediate' : asset.rul < 180 ? 'Q1 2024' : 'Q2-Q3 2024',
    npvDelta: Math.round(Math.abs(asset.capexDelta) * 1.2),
    supplier: asset.supplier || ('OEM-' + (asset.market === 'UK' ? 'A' : 'B')),
    installDate: asset.installDate || '2018-03-15'
  }));

  // Comparison data
  const comparisonAssets = [
    { asset: 'HVAC-UK-001', rul: 120, roi: 18.5, risk: 0.72, compliance: 94 },
    { asset: 'HVAC-UK-002', rul: 245, roi: 22.1, risk: 0.45, compliance: 97 },
    { asset: 'HVAC-FR-001', rul: 310, roi: 19.8, risk: 0.38, compliance: 96 }
  ];

  // Chart data
  const failureTimeline = [
    { month: 'Jan', failures: 1, predicted: 1 },
    { month: 'Feb', failures: 1, predicted: 2 },
    { month: 'Mar', failures: 2, predicted: 2 },
    { month: 'Apr', failures: 1, predicted: 3 },
    { month: 'May', failures: 3, predicted: 3 },
    { month: 'Jun', failures: 4, predicted: 4 }
  ];

  const costTrajectory = [
    { month: 'Jan', actual: 1200, projected: 1200 },
    { month: 'Feb', actual: 1350, projected: 1300 },
    { month: 'Mar', actual: 1500, projected: 1450 },
    { month: 'Apr', actual: 1850, projected: 1650 },
    { month: 'May', actual: 2100, projected: 1900 },
    { month: 'Jun', actual: 2650, projected: 2200 }
  ];

  const peerBenchmark = [
    { peer: 'Asset A', score: 92 },
    { peer: 'Asset B', score: 88 },
    { peer: 'Current', score: 76 },
    { peer: 'Asset C', score: 85 },
    { peer: 'Asset D', score: 79 }
  ];

  const riskContribution = [
    { category: 'Age', value: 35 },
    { category: 'Failures', value: 28 },
    { category: 'Performance', value: 22 },
    { category: 'Supplier', value: 15 }
  ];

  const handleSMEFeedback = (type: 'up' | 'down') => {
    setSmeFeedback(type);
    setShowConfidenceToast(true);
    setTimeout(() => setShowConfidenceToast(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl md:text-1xl font-bold mb-2">
            Asset Strategy Workbench
          </h1>
          <p className="text-green-100 text-xs ">
            Advanced decision support for asset lifecycle optimization, maintenance planning, and strategic investment allocation
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
            onClick={() => { setActiveTab('portfolio'); setSelectedAsset(null); }}
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
        {activeTab === 'portfolio' && !selectedAsset && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap gap-3">
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Markets</option>
                  <option>UK</option>
                  <option>APAC</option>
                  <option>EU</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Classes</option>
                  <option>HVAC</option>
                  <option>Chiller</option>
                  <option>Elevator</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Lifecycle</option>
                  <option>End-of-Life</option>
                  <option>Mature</option>
                  <option>Mid-Life</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Suppliers</option>
                  <option>OEM-A</option>
                  <option>OEM-B</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Risk Bands</option>
                  <option>Critical (&gt;0.7)</option>
                  <option>High (0.4-0.7)</option>
                  <option>Medium (&lt;0.4)</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Confidence</option>
                  <option>High (&gt;85%)</option>
                  <option>Med (70-85%)</option>
                  <option>Low (&lt;70%)</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>Compliance Flag</option>
                  <option>Compliant</option>
                  <option>Non-Compliant</option>
                </select>
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Asset Portfolio</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Asset</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Market</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lifecycle</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Criticality</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">RUL (pred)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Recommended Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timing Window</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Confidence</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Capex/NPV Δ</th>
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
                          setSelectedAsset(item as Asset);
                          setActiveTab('decisions');
                        }}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.market}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.assetClass}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.lifecycle === 'End-of-Life' ? 'bg-red-100 text-red-800' :
                            item.lifecycle === 'Mature' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.lifecycle}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.criticalityLabel === 'Critical' ? 'bg-red-100 text-red-800' :
                            item.criticalityLabel === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.criticalityLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${
                            item.health > 70 ? 'text-green-700' :
                            item.health > 50 ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {item.health}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${
                            item.risk > 0.7 ? 'text-red-700' :
                            item.risk > 0.4 ? 'text-orange-700' :
                            'text-green-700'
                          }`}>
                            {(item.risk * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.rul}d</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.recommendedAction === 'Renew' ? 'bg-green-100 text-green-800' :
                            item.recommendedAction === 'Refurbish' ? 'bg-purple-100 text-purple-800' :
                            item.recommendedAction === 'Monitor' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.recommendedAction}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.timingWindow}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${
                            item.confidence === 'High' ? 'text-green-700' :
                            item.confidence === 'Med' ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {item.confidence} ({item.confidenceScore}%)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className={item.capexDelta < 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                            {item.capexDelta < 0 ? '−' : '+'}£{Math.abs(item.capexDelta).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            NPV: +£{item.npvDelta.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {item.guardrails.slice(0, 2).map((_g, i) => (
                              <span key={i} className="w-2 h-2 rounded-full bg-purple-500"></span>
                            ))}
                          </div>
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
            {!selectedAsset ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Select an asset from the Portfolio tab to view decision details</p>
              </div>
            ) : (
          <div className="space-y-4">
            {/* Back Button */}
            <button
              onClick={() => { setSelectedAsset(null); setActiveTab('portfolio'); }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Portfolio
            </button>

            {/* Strategy Drift Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <div className="font-semibold text-orange-900">Strategy Drift Detected</div>
                  <div className="text-sm text-orange-800 mt-1">Current plan 8% below policy-aligned target for Safety weight</div>
                  <button className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                    Auto-Correct Now
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Asset Profile */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Asset Profile</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Access: Standard</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-600 text-xs">Asset ID</div>
                      <div className="font-mono text-gray-900">{selectedAsset.id}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs">Name</div>
                      <div className="font-semibold text-gray-900">{selectedAsset.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-600 text-xs">Market</div>
                        <div className="font-medium">{selectedAsset.market}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Class</div>
                        <div className="font-medium">{selectedAsset.assetClass}</div>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="text-gray-600 text-xs mb-2">Metadata</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Install Date:</span>
                          <span className="font-medium">{selectedAsset.installDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">OEM:</span>
                          <span className="font-medium">{selectedAsset.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium">{selectedAsset.supplier}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                      Request Broader Access
                    </button>
                  </div>
                </div>

                {/* Supplier Performance Mini */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Supplier Performance</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SLA Adherence</span>
                      <span className="font-medium text-green-700">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KPI Score</span>
                      <span className="font-medium text-gray-900">88/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract Risk</span>
                      <span className="font-medium text-yellow-700">Medium</span>
                    </div>
                  </div>
                </div>

                {/* Finance Calendar Nudge */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-xs font-semibold text-green-900">Finance Calendar</div>
                      <div className="text-xs text-blue-800 mt-1">Q2 2026 window closes in 45 days (March 15)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Recommendation & Visuals */}
              <div className="lg:col-span-6 space-y-4">
                {/* rDOS Recommendation Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">rDOS Recommendation</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          selectedAsset.recommendedAction === 'Renew' ? 'bg-green-100 text-green-800' :
                          selectedAsset.recommendedAction === 'Refurbish' ? 'bg-purple-100 text-purple-800' :
                          selectedAsset.recommendedAction === 'Monitor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedAsset.recommendedAction}
                        </span>
                        <span className="text-sm text-gray-600">{selectedAsset.timingWindow}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Reasoning Map */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Agent Reasoning Map</h4>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="font-semibold text-blue-900 mb-1">Signal</div>
                        <div className="text-gray-700">RUL {selectedAsset.rul}d</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div className="font-semibold text-yellow-900 mb-1">Threshold</div>
                        <div className="text-gray-700">&lt; 180d policy</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded p-2">
                        <div className="font-semibold text-orange-900 mb-1">Impact</div>
                        <div className="text-gray-700">High failure risk</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="font-semibold text-green-900 mb-1">Recommendation</div>
                        <div className="text-gray-700">{selectedAsset.recommendedAction}</div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Chips */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Evidence:</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">RUL &lt; 180d</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Failure rate +40%</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Cost trajectory up</span>
                    </div>
                  </div>

                  {/* Guardrail Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="group relative">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-medium cursor-help">
                        Budget Cap
                      </span>
                      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        Investment must align with Q2 budget allocation limits
                      </div>
                    </div>
                    <div className="group relative">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded font-medium cursor-help">
                        Compliance AC-8
                      </span>
                      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        Requires environmental impact assessment per AC-8
                      </div>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Confidence</span>
                        <span className="font-semibold text-gray-900">{selectedAsset.confidenceScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            selectedAsset.confidenceScore >= 85 ? 'bg-green-500' :
                            selectedAsset.confidenceScore >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedAsset.confidenceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visuals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Failure Timeline</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={failureTimeline}>
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Cost Trajectory</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={costTrajectory}>
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} />
                        <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Peer Benchmark</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={peerBenchmark}>
                        <XAxis dataKey="peer" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="score">
                          {peerBenchmark.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.peer === 'Current' ? '#ef4444' : '#60a5fa'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Risk Contribution</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={riskContribution} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right: Decision Panel */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Decision Panel</h3>
                  
                  <div className="space-y-2 mb-4">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
                      Approve & Create rDOS Case
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                      Request Re-analysis
                    </button>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm font-medium">
                      Override (with reason)
                    </button>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium">
                      Assign to Team Member
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Comment / Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={3}
                      placeholder="Add decision notes..."
                    ></textarea>
                  </div>

                  {/* What-if Analysis */}
                  <div className="border-t pt-4 mb-4">
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">What-if Analysis</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2">
                      <option>Extend RUL by 90 days</option>
                      <option>Reduce budget by 20%</option>
                      <option>Change to Refurbish</option>
                    </select>
                    <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                      Ask rDOS to Recompute
                    </button>
                  </div>

                  {/* Audit Preview */}
                  <div className="border-t pt-4 mb-4">
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Audit Preview</label>
                    <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                      Lineage: CMMS → Asset DB → RUL Model → Policy Engine → Decision
                    </div>
                  </div>

                  {/* SME Feedback */}
                  <div className="border-t pt-4">
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">SME Feedback</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSMEFeedback('up')}
                        className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                          smeFeedback === 'up'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        👍 Agree
                      </button>
                      <button
                        onClick={() => handleSMEFeedback('down')}
                        className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
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

            {/* Footer: Related Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Related Items & Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium text-sm">Work Orders</span>
                  </div>
                  <div className="text-xs text-gray-600">18 related work orders</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-sm">Prior Decisions</span>
                  </div>
                  <div className="text-xs text-gray-600">3 previous decisions</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="font-medium text-sm">Attachments</span>
                  </div>
                  <div className="text-xs text-gray-600">Manuals, warranties, specs</div>
                </div>
              </div>
            </div>
          </div>
            )}
          </div>
        )}

        {activeTab === 'comparisons' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Side-by-Side Asset Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Asset</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">RUL (days)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">RUL Delta</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ROI %</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ROI Delta</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Risk Delta</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Compliance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Compliance Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonAssets.map((item, idx) => {
                      const baseline = comparisonAssets[0];
                      const rulDelta = item.rul - baseline.rul;
                      const roiDelta = item.roi - baseline.roi;
                      const riskDelta = item.risk - baseline.risk;
                      const compDelta = item.compliance - baseline.compliance;
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.asset}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.rul}d</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={rulDelta >= 0 ? 'text-green-700' : 'text-red-700'}>
                              {rulDelta >= 0 ? '+' : ''}{rulDelta}d
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.roi}%</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={roiDelta >= 0 ? 'text-green-700' : 'text-red-700'}>
                              {roiDelta >= 0 ? '+' : ''}{roiDelta.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{(item.risk * 100).toFixed(0)}%</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={riskDelta <= 0 ? 'text-green-700' : 'text-red-700'}>
                              {riskDelta >= 0 ? '+' : ''}{(riskDelta * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.compliance}%</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={compDelta >= 0 ? 'text-green-700' : 'text-red-700'}>
                              {compDelta >= 0 ? '+' : ''}{compDelta}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
