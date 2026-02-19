import React from 'react';
import { Equipment } from '../store/facilitiesStore';

interface AssetDetailsPageProps {
  equipment: Equipment;
  onClose: () => void;
}

const AssetDetailsPage: React.FC<AssetDetailsPageProps> = ({ equipment, onClose }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <span className="text-red-500">🔴</span>;
      case 'warning': return <span className="text-yellow-500">🟡</span>;
      case 'operational': return <span className="text-green-500">🟢</span>;
      case 'maintenance': return <span className="text-blue-500">🔵</span>;
      default: return <span className="text-gray-500">⚪</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'operational': return 'bg-green-50 border-green-200';
      case 'maintenance': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <span className="text-3xl">🔧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{equipment.name}</h1>
              <p className="text-blue-100 text-sm mt-1">Asset ID: {equipment.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Banner */}
          <div className={`rounded-lg border-2 p-4 mb-6 ${getStatusColor(equipment.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(equipment.status)}
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Status</p>
                  <p className="text-xl font-bold capitalize">{equipment.status}</p>
                </div>
              </div>
              {equipment.criticality && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Criticality Level</p>
                  <p className="text-xl font-bold text-red-600">{equipment.criticality}</p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Equipment Type</p>
                <p className="font-semibold text-gray-900 capitalize">{equipment.type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-semibold text-gray-900">{equipment.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Zone</p>
                <p className="font-semibold text-gray-900">{equipment.zone}</p>
              </div>
              {equipment.category && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">{equipment.category}</p>
                </div>
              )}
              {equipment.maintenanceMode && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Maintenance Mode</p>
                  <p className="font-semibold text-gray-900">{equipment.maintenanceMode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔧</span>
              Maintenance Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Last Maintenance</p>
                <p className="font-semibold text-gray-900">{equipment.lastMaintenance}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 mb-1">Next Maintenance</p>
                <p className="font-semibold text-gray-900">{equipment.nextMaintenance}</p>
              </div>
              {equipment.serviceFrequency && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 mb-1">Service Frequency</p>
                  <p className="font-semibold text-gray-900">{equipment.serviceFrequency}</p>
                </div>
              )}
              {equipment.replacementCycle && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 mb-1">Replacement Cycle</p>
                  <p className="font-semibold text-gray-900">{equipment.replacementCycle}</p>
                </div>
              )}
            </div>
          </div>

          {/* Operational Metrics */}
          {equipment.temperature !== undefined && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span>
                Operational Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 mb-1">Current Temperature</p>
                  <p className="text-3xl font-bold text-red-700">{equipment.temperature}°C</p>
                </div>
                {equipment.targetTemp !== undefined && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Target Temperature</p>
                    <p className="text-3xl font-bold text-green-700">{equipment.targetTemp}°C</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compliance & KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {equipment.compliance && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✅</span>
                  Compliance Requirements
                </h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">{equipment.compliance}</p>
                </div>
              </div>
            )}
            {equipment.kpis && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span>
                  Key Performance Indicators
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">{equipment.kpis}</p>
                </div>
              </div>
            )}
          </div>

          {/* Active Alerts */}
          {equipment.alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Active Alerts ({equipment.alerts.length})
              </h2>
              <div className="space-y-3">
                {equipment.alerts.map((alert, idx) => (
                  <div 
                    key={idx} 
                    className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3"
                  >
                    <span className="text-2xl">🚨</span>
                    <div className="flex-1">
                      <p className="text-red-800 font-medium">{alert}</p>
                      <p className="text-xs text-red-600 mt-1">Priority: High • Requires immediate attention</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📝</span>
              Additional Details
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Installation Date</p>
                  <p className="font-medium text-gray-900">Estimated: {equipment.lastMaintenance}</p>
                </div>
                <div>
                  <p className="text-gray-600">Warranty Status</p>
                  <p className="font-medium text-gray-900">Under Review</p>
                </div>
                <div>
                  <p className="text-gray-600">Vendor</p>
                  <p className="font-medium text-gray-900">Information Not Available</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Inspection</p>
                  <p className="font-medium text-gray-900">{equipment.lastMaintenance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Maintenance
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsPage;
