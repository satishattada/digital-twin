import React, { useState } from 'react';

type AlertType = 'SLA Breach' | 'KPI Dip' | 'Rate Variance' | 'Duplicate Invoice' | 'OOS' | 'Missed Rebate' | 'Missed Penalty' | 'OCR Low Confidence' | 'Missing GRN';

interface SupplierAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: AlertType;
  supplier: string;
  contract: string;
  detail: string;
  policyRef?: string;
  decisionImpact?: string;
  timestamp: string;
}

interface DataQualityMetric {
  dimension: string;
  score: number;
  issuesCount: number;
  impact: 'High' | 'Medium' | 'Low';
  fixActions: string[];
}

const SUPPLIER_ALERTS: SupplierAlert[] = [
  {
    id: 'SA-001',
    severity: 'Critical',
    type: 'SLA Breach',
    supplier: 'GlobalClean APAC',
    contract: 'CT-2024-089',
    detail: 'Response time SLA breached: 48h actual vs 24h contracted',
    policyRef: 'POL-SLA-003',
    decisionImpact: 'Penalty claim of £12,000 applicable; contract renewal risk elevated',
    timestamp: '2026-02-21T10:30:00'
  },
  {
    id: 'SA-002',
    severity: 'High',
    type: 'Rate Variance',
    supplier: 'MaintenanceExperts EU',
    contract: 'CT-2023-156',
    detail: 'Unit rate variance detected: £145/hr actual vs £120/hr contracted (+20.8%)',
    policyRef: 'POL-RATE-002',
    decisionImpact: 'Leakage of £8,400 detected over 6 invoices; credit claim recommended',
    timestamp: '2026-02-21T09:15:00'
  },
  {
    id: 'SA-003',
    severity: 'High',
    type: 'Duplicate Invoice',
    supplier: 'AssetCare EU',
    contract: 'CT-2024-201',
    detail: 'Potential duplicate: INV-4421 matches INV-4398 (95% similarity)',
    policyRef: 'POL-DUP-001',
    decisionImpact: 'Duplicate payment risk of £24,500; payment hold initiated',
    timestamp: '2026-02-21T08:45:00'
  },
  {
    id: 'SA-004',
    severity: 'Medium',
    type: 'KPI Dip',
    supplier: 'FacilityServices UK',
    contract: 'CT-2023-087',
    detail: 'First-time fix rate dropped to 78% (below 85% threshold)',
    policyRef: 'POL-KPI-005',
    timestamp: '2026-02-20T16:20:00'
  },
  {
    id: 'SA-005',
    severity: 'Critical',
    type: 'Missing GRN',
    supplier: 'CleanCo UK',
    contract: 'CT-2024-034',
    detail: 'GRN missing for invoice INV-5512 (£18,200) - payment blocked',
    policyRef: 'POL-GRN-001',
    decisionImpact: 'Payment cycle delayed; supplier escalation risk',
    timestamp: '2026-02-20T14:10:00'
  },
  {
    id: 'SA-006',
    severity: 'High',
    type: 'Missed Rebate',
    supplier: 'MaintenanceExperts EU',
    contract: 'CT-2023-156',
    detail: 'Volume rebate threshold met but not applied: 10% on £120k',
    policyRef: 'POL-REB-002',
    decisionImpact: 'Potential recovery of £12,000 via credit claim',
    timestamp: '2026-02-20T11:30:00'
  },
  {
    id: 'SA-007',
    severity: 'Medium',
    type: 'OCR Low Confidence',
    supplier: 'AssetCare EU',
    contract: 'CT-2024-201',
    detail: 'OCR confidence 62% for invoice INV-4556 (threshold: 75%)',
    policyRef: 'POL-OCR-001',
    timestamp: '2026-02-19T15:45:00'
  },
  {
    id: 'SA-008',
    severity: 'High',
    type: 'OOS',
    supplier: 'GlobalClean APAC',
    contract: 'CT-2024-089',
    detail: 'Out-of-scope charges detected: £4,200 for services not in contract',
    policyRef: 'POL-SCOPE-001',
    decisionImpact: 'Credit claim recommended; supplier dispute likely',
    timestamp: '2026-02-19T10:20:00'
  },
  {
    id: 'SA-009',
    severity: 'Medium',
    type: 'Missed Penalty',
    supplier: 'FacilityServices UK',
    contract: 'CT-2023-087',
    detail: 'SLA breach penalty not auto-applied: £3,500 for Jan 2026',
    policyRef: 'POL-PEN-003',
    decisionImpact: 'Manual penalty claim required',
    timestamp: '2026-02-18T13:00:00'
  }
];

const DATA_QUALITY_METRICS: DataQualityMetric[] = [
  {
    dimension: 'GRN Matching',
    score: 78,
    issuesCount: 23,
    impact: 'High',
    fixActions: [
      'Auto-match PO references',
      'Request missing GRNs from suppliers',
      'Enable manual override workflow'
    ]
  },
  {
    dimension: 'OCR Confidence',
    score: 84,
    issuesCount: 12,
    impact: 'Medium',
    fixActions: [
      'Re-scan low confidence invoices',
      'Train OCR model with supplier templates',
      'Flag for manual validation'
    ]
  },
  {
    dimension: 'Rate Consistency',
    score: 91,
    issuesCount: 8,
    impact: 'Medium',
    fixActions: [
      'Update rate cards from contracts',
      'Reconcile variance with suppliers',
      'Lock rates for next period'
    ]
  },
  {
    dimension: 'Duplicate Detection',
    score: 95,
    issuesCount: 3,
    impact: 'High',
    fixActions: [
      'Review flagged invoices',
      'Cross-check PO numbers',
      'Confirm with AP team'
    ]
  },
  {
    dimension: 'Contract Mapping',
    score: 88,
    issuesCount: 15,
    impact: 'Low',
    fixActions: [
      'Link unmapped suppliers to contracts',
      'Validate contract periods',
      'Update supplier master data'
    ]
  },
  {
    dimension: 'Feed Timeliness',
    score: 82,
    issuesCount: 18,
    impact: 'Medium',
    fixActions: [
      'Check API connection status',
      'Escalate stale feeds to IT',
      'Enable backup data sources'
    ]
  }
];

export const SupplierAlertsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<AlertType | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'alerts' | 'dataQuality'>('alerts');

  const filteredAlerts = filterType === 'All'
    ? SUPPLIER_ALERTS
    : SUPPLIER_ALERTS.filter(alert => alert.type === filterType);

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
            rDOS — Supplier Alerts & Monitoring
          </h1>
          <p className="text-green-100 text-xs">
            SLA breaches, leakage detection, data quality issues, and contract compliance monitoring
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Alert Management</h1>
              <p className="text-gray-600">SLA breaches, leakage detection, data quality issues, and contract compliance</p>
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as AlertType | 'All')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="All">All Types</option>
                <option value="SLA Breach">SLA Breach</option>
                <option value="KPI Dip">KPI Dip</option>
                <option value="Rate Variance">Rate Variance</option>
                <option value="Duplicate Invoice">Duplicate Invoice</option>
                <option value="OOS">OOS</option>
                <option value="Missed Rebate">Missed Rebate</option>
                <option value="Missed Penalty">Missed Penalty</option>
                <option value="OCR Low Confidence">OCR Low Confidence</option>
                <option value="Missing GRN">Missing GRN</option>
              </select>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Mark All Read
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeTab === 'alerts'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Alerts
            </button>
            <button
              onClick={() => setActiveTab('dataQuality')}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeTab === 'dataQuality'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Data Quality Hub
            </button>
          </div>
        </div>

        {/* Degraded Mode Banner */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-yellow-900 text-sm">Degraded Mode: Active - OCR Processing Lag</div>
              <div className="text-sm text-yellow-800 mt-1">
                OCR processing experiencing 4-hour lag. Duplicate detection confidence reduced from 95% to 78%. Alert intervals widened to 6-hour batches. Invoice matching fallback to PO references only.
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'alerts' && (
          <>
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
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                {alert.type}
                              </span>
                              <span className="text-xs text-gray-600">{alert.supplier}</span>
                              <span className="text-xs font-mono text-gray-600">{alert.contract}</span>
                              {alert.policyRef && (
                                <span className="text-xs font-mono text-blue-600">{alert.policyRef}</span>
                              )}
                            </div>
                            <div className="font-medium text-gray-900">{alert.detail}</div>
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {alert.decisionImpact && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                            <div className="text-xs font-medium text-purple-900 mb-1">Decision Impact</div>
                            <div className="text-sm text-purple-800">{alert.decisionImpact}</div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4 flex-wrap">
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                            Acknowledge
                          </button>
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                            Assign
                          </button>
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                            Create Claim
                          </button>
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                            Request Re-check
                          </button>
                          {(alert.type === 'Missing GRN' || alert.type === 'OCR Low Confidence') && (
                            <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
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
          </>
        )}

        {activeTab === 'dataQuality' && (
          <>
            {/* Data Quality Hub */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">rDOS Data Quality Hub</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Data Debt Burndown →
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
                          <span className="text-green-500 text-xs">•</span>
                          <span className="text-xs text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-4 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conflict</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">GlobalClean APAC</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Contract Rate</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Contract: £85/hr vs Invoice: £92/hr</td>
                      <td className="px-6 py-4 text-sm text-orange-700">Leakage risk</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resolve</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">MaintenanceExperts EU</td>
                      <td className="px-6 py-4 text-sm text-gray-700">GRN Date</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Invoice date before GRN date (suspicious)</td>
                      <td className="px-6 py-4 text-sm text-yellow-700">Audit flag</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resolve</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">AssetCare EU</td>
                      <td className="px-6 py-4 text-sm text-gray-700">SLA Tier</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Contract: Tier 1 vs System: Tier 2</td>
                      <td className="px-6 py-4 text-sm text-yellow-700">KPI mismatch</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resolve</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Debt Burndown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">rDOS Data Debt Burndown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Total Issues</div>
                  <div className="text-2xl font-bold text-gray-900">79</div>
                  <div className="text-xs text-red-600 mt-1">↑ 6 this week</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Fixed This Month</div>
                  <div className="text-2xl font-bold text-green-700">43</div>
                  <div className="text-xs text-green-600 mt-1">↑ 12 vs last month</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Avg Fix Time</div>
                  <div className="text-2xl font-bold text-gray-900">2.3d</div>
                  <div className="text-xs text-green-600 mt-1">↓ 0.4d improvement</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Quality Score</div>
                  <div className="text-2xl font-bold text-yellow-700">86%</div>
                  <div className="text-xs text-yellow-600 mt-1">Target: 92%</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Focus areas:</strong> GRN matching backlog (23 items), OCR confidence improvement (12 items), stale feed resolution (18 items)
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};
