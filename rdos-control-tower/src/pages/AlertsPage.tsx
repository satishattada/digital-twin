import React, { useState } from 'react';
import { SAMPLE_ALERTS, DATA_QUALITY_METRICS } from '../constants';
import { AlertType } from '../types';

export const AlertsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<AlertType | 'All'>('All');

  const filteredAlerts = filterType === 'All'
    ? SAMPLE_ALERTS
    : SAMPLE_ALERTS.filter(alert => alert.type === filterType);

  const getSeverityColor = (severity: string) => {
    if (severity === 'Critical') return 'bg-red-100 text-red-800 border-red-300';
    if (severity === 'High') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (severity === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getSeverityDot = (severity: string) => {
    if (severity === 'Critical') return 'bg-red-500';
    if (severity === 'High') return 'bg-orange-500';
    if (severity === 'Medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — Asset Strategy Alerts
          </h1>
          <p className="text-green-100 text-xs">
            Monitor asset health anomalies, lifecycle thresholds, and data quality issues
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Alerts & Monitoring</h1>
              <p className="text-gray-600">Risk, compliance, data quality, and policy violations</p>
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as AlertType | 'All')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="All">All Types</option>
                <option value="Risk">Risk</option>
                <option value="Compliance">Compliance</option>
                <option value="Data">Data</option>
                <option value="Policy">Policy</option>
                <option value="Budget">Budget</option>
                <option value="SLA">SLA</option>
              </select>
              <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* Degraded Mode Banner */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-gray-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Degraded Mode: OFF</div>
              <div className="text-sm text-gray-600 mt-1">
                All systems operational. When degraded mode is active, rDOS uses last known baseline with widened confidence intervals. Impact metrics will be displayed here.
              </div>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Active Alerts ({filteredAlerts.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityDot(alert.severity)}`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {alert.type}
                          </span>
                          <span className="text-xs text-gray-600">{alert.market}</span>
                          {alert.policyRef && (
                            <span className="text-xs font-mono text-gray-600">{alert.policyRef}</span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{alert.detail}</div>
                        <div className="text-sm text-gray-600 mt-1">Asset: {alert.asset}</div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {alert.decisionImpact && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                        <div className="text-xs font-medium text-purple-900 mb-1">Decision Impact</div>
                        <div className="text-sm text-purple-800">{alert.decisionImpact}</div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                        Acknowledge
                      </button>
                      <button className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                        Assign
                      </button>
                      <button className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                        Create Case
                      </button>
                      {alert.type === 'Data' && (
                        <button className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                          Fix Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality Hub */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">rDOS Data Quality Hub</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Data Debt Burndown
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {DATA_QUALITY_METRICS.map((metric) => (
              <div key={metric.dimension} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{metric.dimension}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    metric.impact === 'High' ? 'bg-red-100 text-red-800' :
                    metric.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {metric.impact} Impact
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Score</span>
                    <span className="font-semibold text-gray-900">{metric.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.score >= 90 ? 'bg-green-500' :
                        metric.score >= 75 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {metric.issuesCount} issues detected
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700 mb-1">Fix Actions:</div>
                  {metric.fixActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 text-xs">•</span>
                      <span className="text-xs text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-3 py-2 text-white rounded text-xs font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                  Fix Issues
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Conflicts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Data Conflicts Requiring Attention</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conflict</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">AST-12783</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Install Date</td>
                  <td className="px-6 py-4 text-sm text-gray-700">CMMS: 2018-03-15 vs EAM: 2018-04-01</td>
                  <td className="px-6 py-4 text-sm text-yellow-700">Confidence -5%</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resolve</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">AST-14592</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Criticality</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Manual: 6 vs Calculated: 7</td>
                  <td className="px-6 py-4 text-sm text-yellow-700">Recommendation affected</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resolve</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
