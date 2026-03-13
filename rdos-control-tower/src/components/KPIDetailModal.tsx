import React from 'react';
import { KPI } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface KPIDetailModalProps {
  kpi: KPI | null;
  isOpen: boolean;
  onClose: () => void;
}

export const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ kpi, isOpen, onClose }) => {
  if (!isOpen || !kpi) return null;

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getProgressPercentage = () => {
    const valueNum = typeof kpi.value === 'string' 
      ? parseFloat(kpi.value.replace(/[^0-9.-]/g, ''))
      : kpi.value;
    const targetNum = typeof kpi.target === 'string'
      ? parseFloat(kpi.target.replace(/[^0-9.-]/g, ''))
      : kpi.target;
    
    if (isNaN(valueNum) || !targetNum || isNaN(targetNum) || targetNum === 0) return 50;
    
    const percentage = (valueNum / targetNum) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const chartData = kpi.sparkline?.map((value, index) => ({
    index,
    value: typeof value === 'string' ? parseFloat(value) : value
  })) || [];

  const getKPIInsight = (label: string) => {
    switch (label) {
      case 'Strategy Health':
        return {
          description: 'Measures overall asset strategy effectiveness across markets and asset classes',
          reasoning: 'Aggregates baseline quality, prediction accuracy, renewal adherence, and compliance posture',
          impact: 'Strategy Health > 90% indicates strong alignment with policy and optimal asset lifecycle management',
          recommendation: 'Continue monitoring. Maintain current trajectory through proactive interventions.'
        };
      case 'Capex Optimization':
        return {
          description: 'Delta vs baseline capital expenditure through optimized intervention timing',
          reasoning: 'Compares agent-optimized plan vs traditional time-based renewal schedule',
          impact: '£2.4M savings achieved by right-timing refurbishments instead of premature renewals',
          recommendation: 'Sustain optimization through continued guardrail adherence and stress-testing.'
        };
      case 'Predicted Interventions (12mo)':
        return {
          description: 'Number of assets requiring action (renew/refurbish/retire) in next 12 months',
          reasoning: 'Lifecycle Prediction Agent identifies assets crossing health/RUL thresholds',
          impact: '47 interventions vs 50 target shows effective preventive maintenance reducing emergency actions',
          recommendation: 'Monitor trending assets approaching thresholds. Prepare supplier capacity.'
        };
      case 'Forecast Accuracy':
        return {
          description: 'Accuracy of RUL predictions vs actual asset lifecycle outcomes',
          reasoning: 'Measures model performance through comparison with historical intervention data',
          impact: '89% accuracy enables confident planning and optimal timing windows',
          recommendation: 'Target 90%+ through enhanced telemetry coverage and SME feedback loops.'
        };
      case 'Renewal Adherence':
        return {
          description: 'Percentage of recommendations followed within timing windows',
          reasoning: 'Tracks alignment between agent recommendations and executed decisions',
          impact: '92% adherence drives lifecycle cost reduction and downtime avoidance',
          recommendation: 'Address remaining 8% through governance review and resource allocation.'
        };
      case 'Risk Reduction Index':
        return {
          description: 'Composite measure of risk mitigation through proactive interventions',
          reasoning: 'Combines failure probability reduction, compliance improvement, and downtime avoidance',
          impact: '0.7 index (vs 0.5 target) shows significant risk reduction across portfolio',
          recommendation: 'Maintain through continued stress-testing and guardrail enforcement.'
        };
      default:
        return {
          description: 'Key performance indicator for rDOS Asset Strategy Control Tower',
          reasoning: 'Tracks system-level performance and decision quality',
          impact: 'Provides visibility into agent effectiveness and strategy outcomes',
          recommendation: 'Monitor trends and respond to threshold breaches proactively.'
        };
    }
  };

  const insight = getKPIInsight(kpi.label);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50000] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{kpi.label}</h2>
            <p className="text-green-200 text-sm mt-1">rDOS KPI Detail & Agent Reasoning</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Current Value</div>
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              <div className={`text-sm font-medium mt-1 ${getTrendColor(kpi.trend)}`}>
                {getTrendIcon(kpi.trend)} {kpi.trend === 'up' ? 'Trending Up' : kpi.trend === 'down' ? 'Trending Down' : 'Stable'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Target</div>
              <div className="text-3xl font-bold text-gray-900">{kpi.target}</div>
              <div className="text-sm text-gray-600 mt-1">Goal threshold</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Performance</div>
              <div className="text-3xl font-bold text-green-600">{getProgressPercentage().toFixed(0)}%</div>
              <div className="text-sm text-gray-600 mt-1">Of target achieved</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Target</span>
              <span>{getProgressPercentage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Historical Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="index" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Time Period (Last 10 Weeks)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  label={{ value: kpi.label, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#036b38" 
                  strokeWidth={2}
                  dot={{ fill: '#036b38', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Reasoning Map */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-green-900 text-sm">Agent Reasoning Map</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-green-700 mb-1">Description</div>
                <div className="text-sm text-gray-700">{insight.description}</div>
              </div>
              <div className="h-px bg-green-200"></div>
              <div>
                <div className="text-xs font-medium text-green-700 mb-1">Reasoning</div>
                <div className="text-sm text-gray-700">{insight.reasoning}</div>
              </div>
              <div className="h-px bg-green-200"></div>
              <div>
                <div className="text-xs font-medium text-green-700 mb-1">Impact</div>
                <div className="text-sm text-gray-700">{insight.impact}</div>
              </div>
              <div className="h-px bg-green-200"></div>
              <div>
                <div className="text-xs font-medium text-green-700 mb-1">Recommendation</div>
                <div className="text-sm text-gray-700">{insight.recommendation}</div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-blue-900 mb-1">Data Sources</div>
                  <div className="text-xs text-blue-700">CMMS, WO History, Telemetry, Finance Ledgers, Compliance Events</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-purple-900 mb-1">Confidence</div>
                  <div className="text-xs text-purple-700">High (94%) - Strong evidence × complete data × validated model</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-wrap gap-3 justify-end">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#036b38' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
          >
            Explain in rDOS
          </button>
          <button
            className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#036b38' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
          >
            Generate Strategy Pack
          </button>
        </div>
      </div>
    </div>
  );
};
