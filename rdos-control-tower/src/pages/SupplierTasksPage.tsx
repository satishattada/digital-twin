import React, { useState } from 'react';
import { SAMPLE_TASKS } from '../constants';
import { TaskStatus } from '../types';

type TaskType = 'Approval' | 'Review' | 'Data Fix' | 'Claim' | 'Mention';

interface SupplierTask {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  dueDate: string;
  assignedBy?: string;
  relatedEntity?: string;
  needsContext?: boolean;
}

// Supplier-specific tasks
const SUPPLIER_TASKS: SupplierTask[] = [
  {
    id: 'TSK-504',
    title: 'Approve credit claim for CleanCo UK (£4,200)',
    type: 'Approval',
    status: 'Due Today',
    dueDate: '2026-02-21',
    assignedBy: 'rDOS Governance Agent',
    relatedEntity: 'CLAIM-2026-089',
    needsContext: false
  },
  {
    id: 'TSK-505',
    title: 'Review rate variance alert for MaintenanceExperts EU',
    type: 'Review',
    status: 'Due Today',
    dueDate: '2026-02-21',
    assignedBy: 'Contract Manager',
    relatedEntity: 'SA-002',
    needsContext: true
  },
  {
    id: 'TSK-506',
    title: 'Fix missing GRN data for AssetCare EU invoice',
    type: 'Data Fix',
    status: 'Over SLA',
    dueDate: '2026-02-20',
    assignedBy: 'rDOS Data Quality Monitor',
    relatedEntity: 'INV-4421',
    needsContext: false
  },
  {
    id: 'TSK-507',
    title: 'Process penalty claim for FacilityServices UK',
    type: 'Claim',
    status: 'Pending',
    dueDate: '2026-02-23',
    assignedBy: 'Finance Team',
    relatedEntity: 'CLAIM-2026-092',
    needsContext: false
  },
  {
    id: 'TSK-508',
    title: '@You mentioned in duplicate invoice discussion',
    type: 'Mention',
    status: 'Pending',
    dueDate: '2026-02-22',
    assignedBy: 'David Chen',
    relatedEntity: 'SA-003',
    needsContext: false
  },
  {
    id: 'TSK-509',
    title: 'Review SLA breach for GlobalClean APAC',
    type: 'Review',
    status: 'Over SLA',
    dueDate: '2026-02-19',
    assignedBy: 'Operations Manager',
    relatedEntity: 'SA-001',
    needsContext: true
  },
  ...SAMPLE_TASKS.map(t => ({
    id: t.id,
    title: t.title,
    type: ('Review' as TaskType),
    status: t.status,
    dueDate: t.dueDate,
    assignedBy: t.assignedBy,
    relatedEntity: t.relatedAsset,
    needsContext: false
  }))
];

export const SupplierTasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setActiveChips(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  let filteredTasks = filterStatus === 'All'
    ? SUPPLIER_TASKS
    : SUPPLIER_TASKS.filter(task => task.status === filterStatus);

  // Apply chip filters
  if (activeChips.includes('Due today')) {
    filteredTasks = filteredTasks.filter(t => t.status === 'Due Today');
  }
  if (activeChips.includes('Over SLA')) {
    filteredTasks = filteredTasks.filter(t => t.status === 'Over SLA');
  }
  if (activeChips.includes('Assigned by me')) {
    filteredTasks = filteredTasks.filter(t => t.assignedBy === 'You');
  }
  if (activeChips.includes('Needs context')) {
    filteredTasks = filteredTasks.filter(t => t.needsContext);
  }

  const getStatusColor = (status: TaskStatus) => {
    if (status === 'Due Today') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (status === 'Over SLA') return 'bg-red-100 text-red-800 border-red-300';
    if (status === 'Completed') return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getTypeColor = (type: TaskType) => {
    if (type === 'Approval') return 'bg-purple-100 text-purple-800';
    if (type === 'Review') return 'bg-blue-100 text-blue-800';
    if (type === 'Data Fix') return 'bg-yellow-100 text-yellow-800';
    if (type === 'Claim') return 'bg-green-100 text-green-800';
    if (type === 'Mention') return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-xl font-bold mb-2">
            rDOS — My Supplier Tasks
          </h1>
          <p className="text-green-100 text-xs">
            Track approvals, reviews, data fixes, claims, and mentions for supplier performance and commercial actions
          </p>
        </div>
      </div>

      <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Management</h1>
              <p className="text-gray-600">Approvals, reviews, data fixes, claims, and mentions</p>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'All')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="All">All Status</option>
                <option value="Due Today">Due Today</option>
                <option value="Over SLA">Over SLA</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                New Task
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Due today', 'Over SLA', 'Assigned by me', 'Needs context'].map((chip) => (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeChips.includes(chip)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {chip}
              </button>
            ))}
            {activeChips.length > 0 && (
              <button
                onClick={() => setActiveChips([])}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg shadow-sm p-6">
            <div className="text-xs text-gray-600 mb-1">Due Today</div>
            <div className="text-3xl font-bold text-orange-700">
              {SUPPLIER_TASKS.filter(t => t.status === 'Due Today').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-lg shadow-sm p-6">
            <div className="text-xs text-gray-600 mb-1">Over SLA</div>
            <div className="text-3xl font-bold text-red-700">
              {SUPPLIER_TASKS.filter(t => t.status === 'Over SLA').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg shadow-sm p-6">
            <div className="text-xs text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-blue-700">
              {SUPPLIER_TASKS.filter(t => t.status === 'Pending').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg shadow-sm p-6">
            <div className="text-xs text-gray-600 mb-1">Needs Context</div>
            <div className="text-3xl font-bold text-purple-700">
              {SUPPLIER_TASKS.filter(t => t.needsContext).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg shadow-sm p-6">
            <div className="text-xs text-gray-600 mb-1">Completed (7d)</div>
            <div className="text-3xl font-bold text-green-700">28</div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">All Tasks ({filteredTasks.length})</h3>
              {activeChips.length > 0 && (
                <span className="text-xs text-gray-600">
                  Filtered by: {activeChips.join(', ')}
                </span>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <input type="checkbox" className="mt-1 rounded" />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(task.type)}`}>
                            {task.type}
                          </span>
                          {task.needsContext && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Needs Context
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{task.title}</div>
                        {task.relatedEntity && (
                          <div className="text-sm text-gray-600 mt-1">
                            Related: <span className="font-mono text-green-700">{task.relatedEntity}</span>
                            {' '}
                            <a href={`#${task.relatedEntity}`} className="text-blue-600 hover:text-blue-700 text-xs">
                              [Deep link →]
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-900">Due: {task.dueDate}</div>
                        {task.assignedBy && (
                          <div className="text-xs text-gray-600 mt-1">By: {task.assignedBy}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                        Open
                      </button>
                      <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors">
                        Complete
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors">
                        Reassign
                      </button>
                      {task.type === 'Claim' && (
                        <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors">
                          Review Claim
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned by Me */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Assigned by Me</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Verify supplier contract amendment</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Review</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Legal Team</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded text-xs font-medium">Pending</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">2026-02-24</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Reconcile invoice discrepancy</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Data Fix</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Finance Ops</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded text-xs font-medium">Due Today</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">2026-02-21</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Completed <span className="font-medium">Credit claim CLAIM-2026-087 approval</span></div>
                  <div className="text-xs text-gray-600 mt-1">2 hours ago • Deep link preserved filters & snapshot</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Opened <span className="font-medium">Rate variance review for EU supplier</span></div>
                  <div className="text-xs text-gray-600 mt-1">5 hours ago • Snapshot saved with context</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Mentioned in <span className="font-medium">SLA breach discussion for CleanCo</span></div>
                  <div className="text-xs text-gray-600 mt-1">Yesterday • Filters preserved in notification</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Assigned <span className="font-medium">Missing GRN data fix to Finance Ops</span></div>
                  <div className="text-xs text-gray-600 mt-1">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
