import React, { useState } from 'react';
import { DEMO_STRESS_TEST_PRESET, SAMPLE_ASSETS } from '../constants';
import { GuardrailBadges } from '../components/GuardrailBadge';

export const SimulatorPage: React.FC = () => {
  const [budget, setBudget] = useState(12000000);
  const [riskAppetite, setRiskAppetite] = useState(50);
  const [stressTestActive, setStressTestActive] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runStressTest = () => {
    setStressTestActive(true);
    // Simulate stress test results
    setTimeout(() => {
      setResults({
        assetsReprioritized: 7,
        roiDelta: -1.2,
        riskDelta: -0.6,
        capexDelta: -180000,
        narrative: DEMO_STRESS_TEST_PRESET.expectedImpact.narrative
      });
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — Asset Strategy Simulator
          </h1>
          <p className="text-green-100 text-xs">
            Stress-test asset strategies under varied budget, risk, and timeline scenarios
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Simulator Controls</h2>
          <p className="text-gray-600">Configure guardrails, adjust parameters, and run stress-tests to optimize your capital plan</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Simulation Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Global Budget (£M)
              </label>
              <input
                type="range"
                min="8000000"
                max="16000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>£8M</span>
                <span className="font-medium text-gray-900">£{(budget / 1000000).toFixed(1)}M</span>
                <span>£16M</span>
              </div>
            </div>

            {/* Risk Appetite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Appetite
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Conservative</span>
                <span className="font-medium text-gray-900">{riskAppetite}%</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Priority Weights */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority Weights
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <label className="text-xs text-gray-600">Safety</label>
                  <input type="number" defaultValue={40} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Uptime</label>
                  <input type="number" defaultValue={30} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Revenue</label>
                  <input type="number" defaultValue={20} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">ESG</label>
                  <input type="number" defaultValue={10} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Active Constraints
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Country Caps</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Supplier Capacity Limits</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Regulatory Windows</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Emergency Reserve (15%)</span>
                </label>
              </div>
            </div>

            {/* Horizon */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planning Horizon
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#036b38' }}>12 months</button>
                <button className="flex-1 px-4 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>24 months</button>
                <button className="flex-1 px-4 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>36 months</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stress-Test Mode */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Stress-Test Mode
          </h2>
          
          <div className="bg-white rounded-lg border border-orange-300 p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Demo Preset (Recommended for Demos)</h3>
                <p className="text-sm text-gray-700 mb-2">{DEMO_STRESS_TEST_PRESET.name}</p>
                <p className="text-xs text-gray-600">{DEMO_STRESS_TEST_PRESET.description}</p>
              </div>
              <button
                onClick={runStressTest}
                disabled={stressTestActive}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  stressTestActive
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-white'
                }`}
                style={!stressTestActive ? { backgroundColor: '#036b38' } : undefined}
                onMouseOver={(e) => !stressTestActive && (e.currentTarget.style.backgroundColor = '#094a46')}
                onMouseOut={(e) => !stressTestActive && (e.currentTarget.style.backgroundColor = '#036b38')}
              >
                {stressTestActive ? 'Running...' : 'Run Preset'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
              Supplier Outage
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
              Weather Event
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
              Regulatory Acceleration
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
              Demand Spike
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Simulation Results</h2>
            
            {/* Narrative */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900">{results.narrative}</p>
            </div>

            {/* KPI Deltas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Assets Reprioritized</div>
                <div className="text-2xl font-bold text-gray-900">{results.assetsReprioritized}</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">ROI Delta</div>
                <div className="text-2xl font-bold text-red-700">{results.roiDelta}%</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Risk Reduction</div>
                <div className="text-2xl font-bold text-green-700">{Math.abs(results.riskDelta)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Capex Delta</div>
                <div className="text-2xl font-bold text-blue-700">−£{Math.abs(results.capexDelta).toLocaleString()}</div>
              </div>
            </div>

            {/* Revised Plan */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Revised Ranked Plan</h3>
              <div className="space-y-3">
                {SAMPLE_ASSETS.slice(0, 4).map((asset, idx) => (
                  <div key={asset.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="text-sm font-bold text-gray-500 w-6">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-600">{asset.market} • {asset.assetClass}</div>
                    </div>
                    <div className="text-sm text-gray-700">£{Math.abs(asset.capexDelta).toLocaleString()}</div>
                    <GuardrailBadges guardrails={asset.guardrails} />
                  </div>
                ))}
              </div>
            </div>

            {/* Change Log */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Change Log</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">Country Cap (UK) applied - reprioritized 3 assets to Q3</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">Supplier Capacity constraint triggered - delayed EU renewals</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">Budget Window adjusted - moved 2 assets to align with FY windows</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                Save rDOS Scenario
              </button>
              <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                Submit to Governance
              </button>
              <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                Export Results
              </button>
              <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                Generate rDOS Strategy Pack
              </button>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Simulation Running</h3>
            <p className="text-gray-600 mb-6">Configure parameters above and run a stress-test to see results</p>
            <button
              onClick={runStressTest}
              className="px-6 py-3 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#036b38' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
            >
              Run Demo Preset
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
