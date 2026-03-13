import React, { useState } from 'react';

export const SupplierSimulatorPage: React.FC = () => {
  const [savingsTarget, setSavingsTarget] = useState(1100000);
  const [volumeTier, setVolumeTier] = useState(2);
  const [indexationBasis, setIndexationBasis] = useState('CPI');
  const [paymentTerms, setPaymentTerms] = useState(30);
  const [rebatePolicy, setRebatePolicy] = useState(3);
  const [horizon, setHorizon] = useState(24);
  const [stressTestActive, setStressTestActive] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [bundlingEU, setBundlingEU] = useState(false);
  const [bundlingUK, setBundlingUK] = useState(false);

  const runStressTest = () => {
    setStressTestActive(true);
    // Simulate stress test results
    setTimeout(() => {
      setResults({
        savingsByLever: {
          rateCorrection: 620000,
          penalties: 180000,
          credits: 95000,
          tiering: 140000,
          bundling: bundlingEU ? 185000 : 0,
          terms: 80000
        },
        roiDelta: 18.5,
        npvDelta: 1350000,
        serviceRiskDelta: -0.3,
        supplierScoreDelta: 0,
        narrative: `Scenario applied → ${bundlingEU ? 'Tiering + Bundling EU' : 'Tiering + Rate Correction'}; potential savings +£${(savingsTarget / 1000000).toFixed(1)}M, service risk ${-0.3}, MaintenanceExperts EU performance neutral.`
      });
    }, 1500);
  };

  const totalSavings = results ? Object.values(results.savingsByLever).reduce((a: number, b: any) => a + (b as number), 0) : 0;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — Supplier Commercial Optimizer
          </h1>
          <p className="text-green-100 text-xs">
            Stress-test commercial optimization scenarios: bundling, rate correction, penalties, credits, and payment terms
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">rDOS Supplier Performance Simulator — Commercial Optimization</h1>
          <p className="text-gray-600">Configure commercial levers, bundling strategies, and run stress-tests to model supplier performance and leakage recovery impact</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Simulation Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Savings Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Target (£M)
              </label>
              <input
                type="range"
                min="500000"
                max="3000000"
                step="100000"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>£0.5M</span>
                <span className="font-medium text-gray-900">£{(savingsTarget / 1000000).toFixed(1)}M</span>
                <span>£3.0M</span>
              </div>
            </div>

            {/* Volume Tiers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume Tier
              </label>
              <select 
                value={volumeTier}
                onChange={(e) => setVolumeTier(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={1}>Tier 1: £0-£1M</option>
                <option value={2}>Tier 2: £1M-£3M</option>
                <option value={3}>Tier 3: £3M-£5M</option>
                <option value={4}>Tier 4: £5M+</option>
              </select>
            </div>

            {/* Indexation Basis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indexation Basis
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIndexationBasis('CPI')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    indexationBasis === 'CPI' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  CPI
                </button>
                <button
                  onClick={() => setIndexationBasis('WPI')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    indexationBasis === 'WPI' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  WPI
                </button>
                <button
                  onClick={() => setIndexationBasis('Fixed')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    indexationBasis === 'Fixed' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  Fixed
                </button>
              </div>
            </div>

            {/* Payment Terms Delta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms (days)
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>15</span>
                <span className="font-medium text-gray-900">{paymentTerms} days</span>
                <span>90</span>
              </div>
            </div>

            {/* Bundling Toggles */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bundling Strategies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <input 
                    type="checkbox" 
                    checked={bundlingEU}
                    onChange={(e) => setBundlingEU(e.target.checked)}
                    className="rounded" 
                  />
                  <span className="text-sm text-gray-700">Cleaning + Maintenance (EU)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <input 
                    type="checkbox"
                    checked={bundlingUK}
                    onChange={(e) => setBundlingUK(e.target.checked)}
                    className="rounded" 
                  />
                  <span className="text-sm text-gray-700">Security + Facilities (UK)</span>
                </label>
              </div>
            </div>

            {/* Rebate Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rebate Policy (%)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rebatePolicy}
                onChange={(e) => setRebatePolicy(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0%</span>
                <span className="font-medium text-gray-900">{rebatePolicy}%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Horizon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planning Horizon
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setHorizon(12)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    horizon === 12 ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  12 mo
                </button>
                <button
                  onClick={() => setHorizon(24)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    horizon === 24 ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  24 mo
                </button>
                <button
                  onClick={() => setHorizon(36)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    horizon === 36 ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  36 mo
                </button>
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
                <h3 className="font-semibold text-gray-900 mb-1">Commercial Recovery Scenario</h3>
                <p className="text-sm text-gray-700 mb-2">Multi-lever optimization with bundling + tiering</p>
                <p className="text-xs text-gray-600">Test impact of commercial strategy changes on supplier performance and recovery potential</p>
              </div>
              <button
                onClick={runStressTest}
                disabled={stressTestActive}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  stressTestActive
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {stressTestActive ? 'Running...' : 'Run Scenario'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              FX Volatility
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              Price Index Shock
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              Volume Surge/Drop
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              Supplier Outage
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              Regulatory Fee Δ
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Total Savings</div>
                <div className="text-2xl font-bold text-green-700">+£{(totalSavings / 1000).toFixed(0)}K</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">ROI / NPV Delta</div>
                <div className="text-2xl font-bold text-blue-700">{results.roiDelta}% / +£{(results.npvDelta / 1000).toFixed(0)}K</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Service Risk Δ</div>
                <div className="text-2xl font-bold text-green-700">{results.serviceRiskDelta}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Supplier Score Δ</div>
                <div className="text-2xl font-bold text-gray-700">{results.supplierScoreDelta === 0 ? 'Neutral' : results.supplierScoreDelta}</div>
              </div>
            </div>

            {/* Savings by Lever */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Savings by Lever</h3>
              <div className="space-y-3">
                {Object.entries(results.savingsByLever).map(([lever, value]: [string, any]) => (
                  value > 0 && (
                    <div key={lever} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">{lever.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-sm font-bold text-green-700">+£{(value / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(value / totalSavings) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Market/Category Impact */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Market / Category Impact</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-xs text-gray-600">UK Market</div>
                  <div className="text-sm font-bold text-green-700">+£280K</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-xs text-gray-600">EU Market</div>
                  <div className="text-sm font-bold text-green-700">+£420K</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-xs text-gray-600">Maintenance</div>
                  <div className="text-sm font-bold text-green-700">+£385K</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-xs text-gray-600">Cleaning</div>
                  <div className="text-sm font-bold text-green-700">+£215K</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Save rDOS Scenario
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Compare Scenarios
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Export Results
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Submit to Governance
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                Generate rDOS Commercial Recovery Pack
              </button>
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                Send Recovery Pack
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
            <p className="text-gray-600 mb-6">Configure commercial levers above and run a scenario to see optimization results</p>
            <button
              onClick={runStressTest}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Run Commercial Recovery Scenario
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
