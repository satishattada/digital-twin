import React, { useState } from 'react';
import { SAMPLE_CASES } from '../constants';
import { Case } from '../types';

export const GovernancePage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — Asset Strategy Governance & Cases
          </h1>
          <p className="text-green-100 text-xs">
            Manage approvals, track audit trail, and enforce policy compliance for asset lifecycle decisions
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
        {!selectedCase ? (
          <div className="space-y-4 md:space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="text-lg font-semibold text-gray-900">Case Management</div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                    Bulk Approve
                  </button>
                  <button className="px-4 py-2 text-white rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                    New Case
                  </button>
                </div>
              </div>
            </div>

            {/* Case List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {SAMPLE_CASES.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{caseItem.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{caseItem.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{caseItem.assets.length} assets</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">£{caseItem.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                              <div
                                className={`h-2 rounded-full ${
                                  caseItem.evidenceScore >= 90 ? 'bg-green-500' :
                                  caseItem.evidenceScore >= 75 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${caseItem.evidenceScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{caseItem.evidenceScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            caseItem.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            caseItem.status === 'In Review' ? 'bg-green-100 text-green-800' :
                            caseItem.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{caseItem.owner}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${
                            caseItem.sla.includes('Over') ? 'text-red-700 font-medium' :
                            caseItem.sla === 'Completed' ? 'text-green-700' :
                            'text-gray-700'
                          }`}>
                            {caseItem.sla}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedCase(caseItem)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Override Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Override Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Override Rate</div>
                  <div className="text-2xl font-bold text-gray-900">8.4%</div>
                  <div className="text-xs text-gray-500 mt-1">of all decisions</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Top Reason</div>
                  <div className="text-sm font-medium text-gray-900">Local context</div>
                  <div className="text-xs text-gray-500 mt-1">42% of overrides</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Impact on ROI</div>
                  <div className="text-2xl font-bold text-yellow-700">−0.8%</div>
                  <div className="text-xs text-gray-500 mt-1">vs agent plan</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">By Market</div>
                  <div className="text-sm font-medium text-gray-900">EU highest</div>
                  <div className="text-xs text-gray-500 mt-1">12.1% override rate</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedCase(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cases
            </button>

            {/* Case Detail */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-mono text-gray-600 mb-1">{selectedCase.id}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCase.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedCase.assets.length} assets</span>
                    <span>•</span>
                    <span>£{selectedCase.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>Owner: {selectedCase.owner}</span>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  selectedCase.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  selectedCase.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedCase.status === 'In Review' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCase.status}
                </span>
              </div>

              {/* Justification */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Justification</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm"
                  rows={4}
                  placeholder="Edit justification..."
                  defaultValue="Strategic refurbishment program to extend asset lifecycle and reduce lifecycle costs. Analysis shows £420k savings vs replacement scenario while maintaining operational continuity."
                />
              </div>

              {/* Evidence Pack */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Evidence Pack</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">Evidence Score</div>
                    <div className="text-3xl font-bold text-green-700">{selectedCase.evidenceScore}%</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">Charts Included</div>
                    <div className="text-3xl font-bold text-gray-900">12</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">Policy References</div>
                    <div className="text-3xl font-bold text-gray-900">5</div>
                  </div>
                </div>
              </div>

              {/* Approval Route */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Approval Route</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-green-100 border border-green-300 rounded-lg p-4 relative">
                    <div className="text-xs text-green-700 font-medium mb-1">Finance</div>
                    <div className="text-sm text-green-900">✓ Approved</div>
                    <div className="text-xs text-green-600 mt-1">2026-02-18</div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                    <div className="text-xs text-yellow-700 font-medium mb-1">Engineering</div>
                    <div className="text-sm text-yellow-900">Pending</div>
                    <div className="text-xs text-yellow-600 mt-1">Due: 2026-02-23</div>
                  </div>
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-4">
                    <div className="text-xs text-gray-600 font-medium mb-1">Compliance</div>
                    <div className="text-sm text-gray-700">Waiting</div>
                  </div>
                </div>
              </div>

              {/* rDOS Policy Enforcement */}
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-3">rDOS Policy Enforcement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-blue-900">FIN-2025-003: Country Cap</div>
                      <div className="text-xs text-blue-700">UK capex limit £12M - compliant (£11.2M allocated)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-blue-900">FIN-2025-007: Budget Window</div>
                      <div className="text-xs text-blue-700">Q2 2026 window - compliant</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 text-white py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                  Approve Case
                </button>
                <button className="flex-1 text-white py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                  Reject (with reason)
                </button>
                <button className="px-6 text-white py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                  Ask rDOS
                </button>
                <button className="px-6 text-white py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#036b38' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}>
                  Generate Pack
                </button>
              </div>
            </div>

            {/* Audit Mode */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">rDOS Audit Mode</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Export Audit Bundle
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 space-y-1">
                <div>[2026-02-18 14:22] Case created by rDOS Governance Agent</div>
                <div>[2026-02-18 14:30] Justification added by Sarah Johnson</div>
                <div>[2026-02-18 15:45] Finance approval by Michael Chen</div>
                <div>[2026-02-20 09:12] Evidence pack updated (score: 94%)</div>
                <div>[2026-02-20 14:30] Routed to Engineering for review</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
