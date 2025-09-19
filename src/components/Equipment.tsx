import React, { useState, useMemo } from 'react';

interface Equipment {
  id: string;
  name: string;
  type: 'refrigerator' | 'coffee-machine' | 'freezer' | 'pos-terminal' | 'scanner' | 'oven' | 'microwave' | 'display-cooler';
  location: string;
  status: 'operational' | 'warning' | 'critical' | 'offline';
  temperature?: number;
  targetTemp?: number;
  lastMaintenance: string;
  nextMaintenance: string;
  powerConsumption?: number;
  alerts: string[];
}

const mockEquipmentData: Equipment[] = [
  {
    id: 'REF-001',
    name: 'Dairy Refrigerator #1',
    type: 'refrigerator',
    location: 'Dairy Section - Aisle 3',
    status: 'operational',
    temperature: 4.2,
    targetTemp: 4.0,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    powerConsumption: 2.4,
    alerts: []
  },
  {
    id: 'REF-002',
    name: 'Beverage Cooler #2',
    type: 'display-cooler',
    location: 'Beverage Section - Front',
    status: 'warning',
    temperature: 6.8,
    targetTemp: 5.0,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    powerConsumption: 1.8,
    alerts: ['Temperature above target', 'Door seal needs inspection']
  },
  {
    id: 'COFFEE-001',
    name: 'Coffee Machine - Premium',
    type: 'coffee-machine',
    location: 'Customer Service Area',
    status: 'critical',
    lastMaintenance: '2023-12-20',
    nextMaintenance: '2024-03-20',
    alerts: ['Descaling required', 'Water filter expired', 'Service overdue']
  },
  {
    id: 'FRZ-001',
    name: 'Frozen Foods Freezer',
    type: 'freezer',
    location: 'Frozen Section - Back',
    status: 'operational',
    temperature: -18.5,
    targetTemp: -18.0,
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    powerConsumption: 3.2,
    alerts: []
  },
  {
    id: 'POS-001',
    name: 'Self-Checkout #1',
    type: 'pos-terminal',
    location: 'Checkout Area',
    status: 'offline',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-04-25',
    alerts: ['System offline', 'Network connectivity issue']
  },
  {
    id: 'COFFEE-002',
    name: 'Coffee Machine - Express',
    type: 'coffee-machine',
    location: 'Entrance Area',
    status: 'operational',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05',
    alerts: []
  }
];

const EquipmentStatusBadge: React.FC<{status: Equipment['status']}> = ({status}) => {
  const statusConfig = {
    operational: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Operational' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⚠️', label: 'Warning' },
    critical: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚨', label: 'Critical' },
    offline: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🔌', label: 'Offline' }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

const EquipmentTypeIcon: React.FC<{type: Equipment['type']}> = ({type}) => {
  const iconMap = {
    refrigerator: '❄️',
    'coffee-machine': '☕',
    freezer: '🧊',
    'pos-terminal': '💳',
    scanner: '📱',
    oven: '🔥',
    microwave: '📡',
    'display-cooler': '🥤'
  };
  
  return <span className="text-lg">{iconMap[type]}</span>;
};

const EquipmentCard: React.FC<{equipment: Equipment}> = ({equipment}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isTemperatureAlert = equipment.temperature && equipment.targetTemp && 
    Math.abs(equipment.temperature - equipment.targetTemp) > 1;
  
  const daysSinceLastMaintenance = Math.floor(
    (new Date().getTime() - new Date(equipment.lastMaintenance).getTime()) / (1000 * 3600 * 24)
  );
  
  const daysToNextMaintenance = Math.floor(
    (new Date(equipment.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${
      equipment.status === 'critical' ? 'border-red-300 bg-red-50' :
      equipment.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
      equipment.status === 'offline' ? 'border-gray-300 bg-gray-50' :
      'border-green-300 bg-green-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <EquipmentTypeIcon type={equipment.type} />
          <div>
            <h4 className="font-semibold text-sm text-gray-800">{equipment.name}</h4>
            <p className="text-xs text-gray-500">{equipment.id} • {equipment.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EquipmentStatusBadge status={equipment.status} />
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Temperature Display (if applicable) */}
      {equipment.temperature !== undefined && (
        <div className="mb-2 p-2 bg-white rounded border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Temperature:</span>
            <div className={`text-sm font-semibold ${
              isTemperatureAlert ? 'text-red-600' : 'text-green-600'
            }`}>
              {equipment.temperature}°C
              <span className="text-gray-500 ml-1">(Target: {equipment.targetTemp}°C)</span>
            </div>
          </div>
        </div>
      )}

      {/* Power Consumption (if applicable) */}
      {equipment.powerConsumption && (
        <div className="mb-2 p-2 bg-white rounded border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Power Usage:</span>
            <span className="text-sm font-semibold text-blue-600">
              {equipment.powerConsumption} kW/h
            </span>
          </div>
        </div>
      )}

      {/* Alerts */}
      {equipment.alerts.length > 0 && (
        <div className="mb-2">
          {equipment.alerts.map((alert, index) => (
            <div key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded mb-1 flex items-center gap-1">
              <span>🚨</span>
              {alert}
            </div>
          ))}
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-2 rounded border">
              <span className="text-gray-500">Last Service:</span>
              <div className="font-semibold text-gray-800">
                {new Date(equipment.lastMaintenance).toLocaleDateString()}
                <div className="text-gray-500">({daysSinceLastMaintenance} days ago)</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded border">
              <span className="text-gray-500">Next Service:</span>
              <div className={`font-semibold ${
                daysToNextMaintenance < 7 ? 'text-red-600' : 
                daysToNextMaintenance < 30 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {new Date(equipment.nextMaintenance).toLocaleDateString()}
                <div className="text-gray-500">
                  ({daysToNextMaintenance > 0 ? `${daysToNextMaintenance} days` : 'Overdue'})
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition-colors">
              📊 View Details
            </button>
            <button className="flex-1 text-xs bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors">
              🔧 Schedule Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const EquipmentMonitor: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'operational'>('all');
  
  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockEquipmentData.length;
    const operational = mockEquipmentData.filter(e => e.status === 'operational').length;
    const warning = mockEquipmentData.filter(e => e.status === 'warning').length;
    const critical = mockEquipmentData.filter(e => e.status === 'critical').length;
    const offline = mockEquipmentData.filter(e => e.status === 'offline').length;
    
    return { total, operational, warning, critical, offline };
  }, []);

  const filteredEquipment = mockEquipmentData.filter(equipment => {
    if (filter === 'all') return true;
    return equipment.status === filter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3 shrink-0">
        <div className="bg-green-50 border border-green-200 rounded-md p-2 text-center">
          <div className="text-sm font-bold text-green-700">{stats.operational}</div>
          <div className="text-xs text-green-600">Operational</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-center">
          <div className="text-sm font-bold text-yellow-700">{stats.warning}</div>
          <div className="text-xs text-yellow-600">Warning</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-center">
          <div className="text-sm font-bold text-red-700">{stats.critical}</div>
          <div className="text-xs text-red-600">Critical</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
          <div className="text-sm font-bold text-gray-700">{stats.offline}</div>
          <div className="text-xs text-gray-600">Offline</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-1 mb-3 shrink-0">
        {(['all', 'critical', 'warning', 'operational'] as const).map(filterType => (
          <button 
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              filter === filterType 
                ? 'bg-[#005BAC] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Equipment List */}
      <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
        {filteredEquipment.map(equipment => 
          <EquipmentCard key={equipment.id} equipment={equipment} />
        )}
        
        {filteredEquipment.length === 0 && (
          <div className="text-center text-gray-400 pt-8 h-full flex flex-col justify-center items-center">
            <span className="text-4xl mb-2">🔧</span>
            <p className="text-sm font-medium">No {filter !== 'all' ? filter : ''} equipment found.</p>
            <p className="text-xs text-gray-400 mt-1">All systems running smoothly</p>
          </div>
        )}
      </div>
    </div>
  );
};