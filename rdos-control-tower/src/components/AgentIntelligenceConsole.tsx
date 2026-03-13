import React from 'react';
import { AGENTS } from '../constants';

interface AgentIntelligenceConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentIntelligenceConsole: React.FC<AgentIntelligenceConsoleProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    if (status === 'OK') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'Warning') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">rDOS — Agent Intelligence Console</h2>
            <p className="text-green-200 text-sm mt-1">Single cockpit to monitor all agents</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Markets</option>
            <option>UK</option>
            <option>EU</option>
            <option>APAC</option>
            <option>Americas</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Asset Classes</option>
            <option>HVAC</option>
            <option>Food Service</option>
            <option>Refrigeration</option>
          </select>
          <button className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            Refresh
          </button>
          <div className="text-xs text-gray-600">
            SLO: <span className="font-mono text-green-600">P95 &lt;2s</span> | Last refresh <span className="font-mono">4m</span> | DF <span className="font-mono">15m</span>
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Agent Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{agent.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  {/* Inputs Health */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Inputs Health</span>
                      <span className={`text-xs font-semibold ${getHealthColor(agent.inputsHealth)}`}>
                        {agent.inputsHealth}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${agent.inputsHealth >= 90 ? 'bg-green-500' : agent.inputsHealth >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${agent.inputsHealth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* What Changed */}
                <div className="p-4 border-b border-gray-200">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">What Changed Today</label>
                  <ul className="space-y-1">
                    {agent.whatChanged.map((change, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs */}
                <div className="p-4 border-b border-gray-200">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Outputs</label>
                  <p className="text-sm text-gray-700">{agent.outputs}</p>
                </div>

                {/* KPIs */}
                <div className="p-4 border-b border-gray-200">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Key Metrics</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(agent.kpis).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guardrails */}
                {agent.guardrails && agent.guardrails.length > 0 && (
                  <div className="p-4 border-b border-gray-200">
                    <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Guardrails in Effect</label>
                    <div className="flex flex-wrap gap-2">
                      {agent.guardrails.map((g, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-100 border border-amber-300 rounded text-xs font-medium text-amber-800">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs font-medium transition-colors">
                    Explain in rDOS
                  </button>
                  <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors">
                    Open Workbench
                  </button>
                  <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors">
                    Refresh
                  </button>
                  <button className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs font-medium transition-colors">
                    Generate Pack
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Data Quality Summary */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">Overall Data Quality</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-blue-700 mb-1">Complete</div>
                <div className="text-2xl font-bold text-blue-900">92%</div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">Timely</div>
                <div className="text-2xl font-bold text-blue-900">85%</div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">Consistent</div>
                <div className="text-2xl font-bold text-blue-900">90%</div>
              </div>
            </div>
          </div>

          {/* Degraded Mode Notice */}
          <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-medium text-gray-900 text-sm">Degraded Mode: OFF</div>
                <div className="text-xs text-gray-600 mt-1">
                  All agents operating normally. When active, degraded mode shows impact on forecasts and decisions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
