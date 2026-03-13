import React, { useState } from 'react';

interface SupplierCase {
  id: string;
  supplier: string;
  type: 'Credit' | 'Penalty' | 'Renegotiation';
  amount: number;
  evidenceScore: number;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  owner: string;
  sla: string;
  lastActivity: string;
  category: string;
  market: string;
}

const SUPPLIER_CASES: SupplierCase[] = [
  {
    id: 'SC-2026-018',
    supplier: 'GlobalClean APAC',
    type: 'Credit',
    amount: 62000,
    evidenceScore: 94,
    status: 'Pending',
    owner: 'Sarah Johnson',
    sla: '2 days left',
    lastActivity: '2026-02-20 14:30',
    category: 'Cleaning',
    market: 'APAC'
  },
  {
    id: 'SC-2026-019',
    supplier: 'MaintenanceExperts EU',
    type: 'Penalty',
    amount: 48000,
    evidenceScore: 89,
    status: 'In Review',
    owner: 'Michael Chen',
    sla: '1 day left',
    lastActivity: '2026-02-21 09:15',
    category: 'Maintenance',
    market: 'EU'
  },
  {
    id: 'SC-2026-020',
    supplier: 'AssetCare EU',
    type: 'Renegotiation',
    amount: 340000,
    evidenceScore: 92,
    status: 'Approved',
    owner: 'Emma Wilson',
    sla: 'Completed',
    lastActivity: '2026-02-19 16:45',
    category: 'Asset Services',
    market: 'EU'
  },
  {
    id: 'SC-2026-021',
    supplier: 'FacilityServices UK',
    type: 'Credit',
    amount: 29000,
    evidenceScore: 78,
    status: 'Pending',
    owner: 'David Martinez',
    sla: '3 days left',
    lastActivity: '2026-02-20 11:20',
    category: 'Facilities',
    market: 'UK'
  }
];

export const SupplierGovernancePage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<SupplierCase | null>(null);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — Supplier Governance & Compliance
          </h1>
          <p className="text-green-100 text-xs">
            Manage supplier claims, disputes, track audit trail, and enforce commercial policy compliance
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
        {!selectedCase ? (
          <div className="space-y-4 md:space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="text-lg font-semibold text-gray-900">Claims & Disputes</div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    Bulk Approve
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    Bulk Assign
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                    Merge Cases
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {SUPPLIER_CASES.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{caseItem.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{caseItem.supplier}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            caseItem.type === 'Credit' ? 'bg-green-100 text-green-800' :
                            caseItem.type === 'Penalty' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {caseItem.type}
                          </span>
                        </td>
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
                            caseItem.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{caseItem.owner}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${
                            caseItem.sla.includes('left') && parseInt(caseItem.sla) <= 1 ? 'text-red-700 font-medium' :
                            caseItem.sla === 'Completed' ? 'text-green-700' :
                            'text-gray-700'
                          }`}>
                            {caseItem.sla}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{caseItem.lastActivity}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedCase(caseItem)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Override Rate</div>
                  <div className="text-2xl font-bold text-gray-900">12.3%</div>
                  <div className="text-xs text-gray-500 mt-1">of all decisions</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Top Reason</div>
                  <div className="text-sm font-medium text-gray-900">Supplier negotiation</div>
                  <div className="text-xs text-gray-500 mt-1">48% of overrides</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Savings Impact</div>
                  <div className="text-2xl font-bold text-red-700">−£180K</div>
                  <div className="text-xs text-gray-500 mt-1">vs agent plan</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Service Risk Δ</div>
                  <div className="text-2xl font-bold text-yellow-700">+0.4</div>
                  <div className="text-xs text-gray-500 mt-1">vs agent plan</div>
                </div>
              </div>
              
              {/* By Supplier/Market/Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">By Supplier</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">MaintenanceExperts EU</span>
                      <span className="font-medium text-gray-900">18.2%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">FacilityServices UK</span>
                      <span className="font-medium text-gray-900">14.1%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">GlobalClean APAC</span>
                      <span className="font-medium text-gray-900">9.8%</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">By Market</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">EU</span>
                      <span className="font-medium text-gray-900">15.4%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">UK</span>
                      <span className="font-medium text-gray-900">11.2%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">FR</span>
                      <span className="font-medium text-gray-900">10.5%</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">By Category</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Multi-Service</span>
                      <span className="font-medium text-gray-900">16.8%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Maintenance</span>
                      <span className="font-medium text-gray-900">11.9%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cleaning</span>
                      <span className="font-medium text-gray-900">9.3%</span>
                    </div>
                  </div>
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

            {/* Case Detail - Auto Dossier */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-mono text-gray-600 mb-1">{selectedCase.id}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCase.type} — {selectedCase.supplier}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedCase.market} • {selectedCase.category}</span>
                    <span>•</span>
                    <span>£{selectedCase.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>Owner: {selectedCase.owner}</span>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  selectedCase.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  selectedCase.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedCase.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedCase.status}
                </span>
              </div>

              {/* Calculations & Variance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Calculations & Variance Exhibits</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Contracted Amount</div>
                    <div className="text-xl font-bold text-gray-900">£{(selectedCase.amount * 1.15).toLocaleString()}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">Actual/Invoiced</div>
                    <div className="text-xl font-bold text-gray-900">£{(selectedCase.amount + (selectedCase.amount * 1.15)).toLocaleString()}</div>
                  </div>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="text-xs text-red-600 mb-1">Variance</div>
                    <div className="text-xl font-bold text-red-700">+£{selectedCase.amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Contractual Clauses & Impacted SLAs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Contractual Clauses & Impacted SLAs</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">Contract Clause 8.3 — Rate Card Adherence</div>
                        <div className="text-xs text-blue-700 mt-1">Supplier exceeded agreed rate card by 12.5% without prior approval</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">SLA-04 — OTIF Performance</div>
                        <div className="text-xs text-blue-700 mt-1">On-Time-In-Full dropped to 84.1% (target: 90%) — penalty applicable</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">Contract Clause 12.1 — Duplicate Billing Protection</div>
                        <div className="text-xs text-blue-700 mt-1">Duplicate invoices detected (INV-2024-1823, INV-2024-1891)</div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <div className="text-xs text-gray-600 mb-2">Documents</div>
                    <div className="text-3xl font-bold text-gray-900">18</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">Rate Card Rules</div>
                    <div className="text-3xl font-bold text-gray-900">7</div>
                  </div>
                </div>
              </div>

              {/* Approval Route */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Approval Route</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="text-xs text-green-700 font-medium mb-1">C&P (Commercial & Procurement)</div>
                    <div className="text-sm text-green-900">✓ Approved</div>
                    <div className="text-xs text-green-600 mt-1">2026-02-19</div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                    <div className="text-xs text-yellow-700 font-medium mb-1">Finance</div>
                    <div className="text-sm text-yellow-900">Pending Review</div>
                    <div className="text-xs text-yellow-600 mt-1">Due: 2026-02-22</div>
                  </div>
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-4">
                    <div className="text-xs text-gray-600 font-medium mb-1">Legal</div>
                    <div className="text-sm text-gray-700">Waiting</div>
                    <div className="text-xs text-gray-500 mt-1">—</div>
                  </div>
                </div>
              </div>

              {/* rDOS Policy Enforcement */}
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  rDOS Policy Enforcement — Rate Card Rule References
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-blue-900">RC-12: Rate Card Ceiling Enforcement</div>
                      <div className="text-xs text-blue-700">UK Maintenance rate cap £85/hr — actual: £96/hr (violation)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-blue-900">RC-18: Out-of-Scope Detection</div>
                      <div className="text-xs text-blue-700">Line items not in approved scope of work — auto-flagged</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-900">Invoice.pdf</div>
                      <div className="text-xs text-gray-500">248KB</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-900">RateCard.xlsx</div>
                      <div className="text-xs text-gray-500">84KB</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-900">Contract.pdf</div>
                      <div className="text-xs text-gray-500">1.2MB</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-900">SLAReport.pdf</div>
                      <div className="text-xs text-gray-500">156KB</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Approve Case
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Reject (with reason)
                </button>
                <button className="px-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Ask rDOS
                </button>
                <button className="px-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Generate Recovery Pack
                </button>
                <button className="px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors">
                  Send Pack
                </button>
              </div>

              {/* Ask rDOS Options */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Ask rDOS to:</div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-300 hover:border-green-500 rounded text-xs font-medium text-gray-700">
                    Recompute variance
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 hover:border-green-500 rounded text-xs font-medium text-gray-700">
                    Find alternatives
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 hover:border-green-500 rounded text-xs font-medium text-gray-700">
                    Rebuild evidence pack
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 hover:border-green-500 rounded text-xs font-medium text-gray-700">
                    Check similar cases
                  </button>
                </div>
              </div>
            </div>

            {/* rDOS Audit Mode */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">rDOS Audit Mode (Immutable)</h3>
                </div>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Export Audit Bundle
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 space-y-1 max-h-48 overflow-y-auto">
                <div>[2026-02-19 10:15] Case auto-created by rDOS Leakage Detection Agent</div>
                <div>[2026-02-19 10:15] Evidence pack generated (18 documents, 7 rate card rules)</div>
                <div>[2026-02-19 10:16] Rate variance calculated: +£62,000 (12.5% over)</div>
                <div>[2026-02-19 11:30] Assigned to Sarah Johnson (C&P)</div>
                <div>[2026-02-19 14:45] C&P approval by Sarah Johnson</div>
                <div>[2026-02-19 14:46] Routed to Finance for secondary review</div>
                <div>[2026-02-20 09:12] Additional evidence added: SLA breach report</div>
                <div>[2026-02-20 14:30] Finance review pending (SLA: 2 days remaining)</div>
                <div>[2026-02-21 08:00] Automated reminder sent to finance reviewer</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
