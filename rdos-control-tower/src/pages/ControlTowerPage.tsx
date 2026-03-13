import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTROL_TOWER_KPIS, AGENTS, SAMPLE_ASSETS, MARKET_DATA, SAMPLE_ALERTS } from '../constants';
import { GuardrailBadges } from '../components/GuardrailBadge';
import { AgentIntelligenceConsole } from '../components/AgentIntelligenceConsole';
import { KPIDetailModal } from '../components/KPIDetailModal';
import { KPI } from '../types';
import { BarChart, Bar, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export const ControlTowerPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAgentConsole, setShowAgentConsole] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [showKPIModal, setShowKPIModal] = useState(false);

  const radarData = MARKET_DATA.map(m => ({
    market: m.market,
    Maintenance: m.maintenance * 100,
    Performance: m.performanceStability * 100,
    'Data Quality': m.dataQuality * 100,
    Compliance: m.compliance * 100,
    Predictability: m.predictability * 100
  }));

  const heatmapData = MARKET_DATA.map(m => ({
    market: m.market,
    risk: m.risk,
    cost: 1 - m.budget,
    compliance: 1 - m.compliance
  }));

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl md:text-1xl font-bold mb-2">
            rDOS — Asset Strategy Control Tower
          </h1>
          <p className="text-green-100 text-xs">
            Strategic asset lifecycle optimization with agent-driven insights, risk modeling, and predictive analytics for maintenance, performance, and budgeting decisions
          </p>
        </div>
      </div>

      {/* KPI Band */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {CONTROL_TOWER_KPIS.map((kpi, idx) => (
            <div 
              key={idx} 
              className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-3 md:p-4 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all"
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
          {/* RAG World Map */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">RAG World Map</h3>
            <div className="space-y-3">
              {MARKET_DATA.map((market) => {
                const avgScore = (market.risk + (1 - market.budget) + (1 - market.alignment)) / 3;
                const color = avgScore < 0.4 ? 'bg-green-500' : avgScore < 0.7 ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={market.market} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="font-medium text-gray-900 w-24">{market.market}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${color}`} style={{ width: `${(1 - avgScore) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600">{Math.round((1 - avgScore) * 100)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Risk • Budget • Alignment composite score
            </div>
          </div>

          {/* Market Maturity Radar */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Market Maturity Radar</h3>
            <ResponsiveContainer width="100%" height={200} className="md:h-[250px]">
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="market" tick={false} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="UK" dataKey="Maintenance" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                <Radar name="UK" dataKey="Performance" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Radar name="UK" dataKey="Data Quality" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                <Radar name="UK" dataKey="Compliance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Radar name="UK" dataKey="Predictability" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Heatmap */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Market Heatmap</h3>
            <div className="space-y-2">
              {heatmapData.map((data) => (
                <div key={data.market} className="grid grid-cols-4 gap-2">
                  <div className="font-medium text-sm text-gray-900">{data.market}</div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${data.risk > 0.7 ? 'bg-red-100 text-red-800' : data.risk > 0.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    Risk
                  </div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${data.cost > 0.3 ? 'bg-red-100 text-red-800' : data.cost > 0.15 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    Cost
                  </div>
                  <div className={`p-2 rounded text-center text-xs font-medium ${data.compliance > 0.15 ? 'bg-red-100 text-red-800' : data.compliance > 0.08 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    Comp
                  </div>
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
              onClick={() => navigate('/ai-console')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Open Agent Intelligence Console →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-gray-900">{agent.name.split(' ')[0]}</span>
                  <span className={`w-2 h-2 rounded-full ${agent.status === 'OK' ? 'bg-green-500' : agent.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
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
              <div className="font-semibold text-gray-900">This Week: Before/After Delta</div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-medium text-green-700">–£420k lifecycle cost</span> • 
                <span className="font-medium text-green-700 ml-2">+3% adherence</span> • 
                <span className="font-medium text-green-700 ml-2">APAC risk –0.7</span>
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
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Class</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">RUL</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Confidence</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Capex Δ</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">Guardrails</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SAMPLE_ASSETS.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{asset.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{asset.market}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{asset.assetClass}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{asset.rul}d</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        asset.recommendedAction === 'Renew' ? 'bg-green-100 text-green-800' :
                        asset.recommendedAction === 'Refurbish' ? 'bg-purple-100 text-purple-800' :
                        asset.recommendedAction === 'Monitor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.recommendedAction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${
                        asset.confidence === 'High' ? 'text-green-700' :
                        asset.confidence === 'Med' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {asset.confidence} ({asset.confidenceScore}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={asset.capexDelta < 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {asset.capexDelta < 0 ? '−' : '+'}£{Math.abs(asset.capexDelta).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <GuardrailBadges guardrails={asset.guardrails} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate('/workbench', { state: { asset } })}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Open
                      </button>
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
              {SAMPLE_ALERTS.slice(0, 3).map((alert) => (
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
                  <span className="text-gray-600">Completeness</span>
                  <span className="font-semibold text-green-700">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Timeliness</span>
                  <span className="font-semibold text-yellow-700">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Consistency</span>
                  <span className="font-semibold text-green-700">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Integration Health</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">CMMS/EAM</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">IoT Telemetry</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Finance</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Supplier APIs</span>
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgentIntelligenceConsole isOpen={showAgentConsole} onClose={() => setShowAgentConsole(false)} />
      <KPIDetailModal kpi={selectedKPI} isOpen={showKPIModal} onClose={() => setShowKPIModal(false)} />
    </div>
  );
};
