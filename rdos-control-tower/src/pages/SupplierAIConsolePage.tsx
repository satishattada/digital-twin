import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SupplierAgent {
  id: string;
  name: string;
  status: 'OK' | 'Warning' | 'Degraded';
  inputsHealth: number;
  whatChanged: string[];
  outputs: string;
  kpis: Record<string, string | number>;
  guardrails?: string[];
}

const SUPPLIER_AGENTS: SupplierAgent[] = [
  {
    id: 'SBA',
    name: 'Supplier Benchmark Agent',
    status: 'OK',
    inputsHealth: 96,
    whatChanged: ['8 suppliers re-ranked in performance tier', 'EU market category shift detected'],
    outputs: 'Performance rankings, benchmark deltas',
    kpis: {
      benchmarkAccuracy: '97%',
      peerGroupUpdates: 12,
      categoryShifts: 3
    }
  },
  {
    id: 'SQPA',
    name: 'Supplier Quality Performance Agent',
    status: 'OK',
    inputsHealth: 94,
    whatChanged: ['5 SLA breaches detected', '3 quality score improvements'],
    outputs: 'Quality scorecards, SLA compliance reports',
    kpis: {
      slaAdherence: '92%',
      qualityScore: '88%',
      incidentResponse: '4.2 hrs'
    }
  },
  {
    id: 'LDA',
    name: 'Leakage Detection Agent',
    status: 'Warning',
    inputsHealth: 88,
    whatChanged: ['£142k leakage identified across 23 invoices', 'Rate variance in EU contracts'],
    outputs: 'Leakage alerts, credit claim recommendations',
    kpis: {
      leakageDetected: '£142k',
      falsePositiveRate: '6%',
      recoveryRate: '78%'
    },
    guardrails: ['Credit Threshold', 'Dispute Window']
  },
  {
    id: 'COA',
    name: 'Commercial Optimization Agent',
    status: 'OK',
    inputsHealth: 92,
    whatChanged: ['£2.1M optimization opportunity identified', 'Contract renewal recommendations for 4 suppliers'],
    outputs: 'Optimization scenarios, renewal strategies',
    kpis: {
      savingsIdentified: '£2.1M',
      contractOptimizations: 8,
      negotiationReadiness: '91%'
    }
  },
  {
    id: 'GCA',
    name: 'Governance & Claims Agent',
    status: 'OK',
    inputsHealth: 95,
    whatChanged: ['12 claims processed', '6 disputes escalated to finance'],
    outputs: 'Claims audit trail, dispute status',
    kpis: {
      claimResolutionTime: '8.4 days',
      disputeSuccessRate: '84%',
      complianceScore: '96%'
    }
  }
];

export const SupplierAIConsolePage: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-xl font-bold mb-2">
              rDOS — Supplier Agent Intelligence Console
            </h1>
            <p className="text-green-100 text-xs">
              Monitor supplier-focused agents for leakage detection, performance tracking, and commercial optimization
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Markets</option>
              <option>UK</option>
              <option>EU</option>
              <option>APAC</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Cleaning</option>
              <option>Maintenance</option>
              <option>Facilities</option>
              <option>Asset Services</option>
            </select>
            <button className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
              Refresh
            </button>
            <div className="text-xs text-gray-600">
              SLO: <span className="font-mono text-green-600">P95 &lt;3s</span> | Last refresh <span className="font-mono">3m</span> | DF <span className="font-mono">12m</span>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {SUPPLIER_AGENTS.map((agent) => (
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
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="text-xs font-semibold text-gray-900 mb-2">What Changed</div>
                  <div className="text-xs text-gray-700 space-y-1">
                    {agent.whatChanged.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outputs */}
                <div className="p-4 border-b border-gray-200">
                  <div className="text-xs font-semibold text-gray-900 mb-2">Outputs</div>
                  <div className="text-xs text-gray-700">
                    {agent.outputs}
                  </div>
                </div>

                {/* KPIs */}
                <div className="p-4">
                  <div className="text-xs font-semibold text-gray-900 mb-3">KPIs</div>
                  <div className="space-y-2">
                    {Object.entries(agent.kpis).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>

                  {agent.guardrails && agent.guardrails.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-2">Guardrails</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.guardrails.map((guardrail, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                          >
                            {guardrail}
                          </span>
                        ))}
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
  );
};
