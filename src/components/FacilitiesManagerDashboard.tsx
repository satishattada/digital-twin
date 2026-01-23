import React, { useState, useEffect } from 'react';
import Store3DLayout from './Store3DLayout';
import { RetailFacilityLayout } from './RetailFacilityLayout';
import { HeatmapZoneData } from '../types';
import { parseCSV, mapAssetToEquipment } from '../utils/csvParser';

interface Equipment {
  id: string;
  name: string;
  type: 'refrigerator' | 'freezer' | 'hvac' | 'pos-terminal' | 'security-camera' | 'lighting' | 'door-sensor';
  location: string;
  status: 'operational' | 'warning' | 'critical' | 'offline';
  temperature?: number;
  targetTemp?: number;
  lastMaintenance: string;
  nextMaintenance: string;
  alerts: string[];
  zone: string;
  category?: string;
  criticality?: string;
  maintenanceMode?: string;
  serviceFrequency?: string;
  replacementCycle?: string;
  compliance?: string;
  kpis?: string;
}

const mockEquipmentData: Equipment[] = [
  {
    id: 'HVAC-001',
    name: 'HVAC Unit - Zone A',
    type: 'hvac',
    location: 'Fresh Produce Section',
    zone: 'Fresh Produce',
    status: 'operational',
    temperature: 21.5,
    targetTemp: 22.0,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    alerts: []
  },
  {
    id: 'REF-001',
    name: 'Walk-in Refrigerator',
    type: 'refrigerator',
    location: 'Meat & Seafood Section',
    zone: 'Meat & Seafood',
    status: 'operational',
    temperature: 3.8,
    targetTemp: 4.0,
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    alerts: []
  },
  {
    id: 'FRZ-001',
    name: 'Display Freezer #1',
    type: 'freezer',
    location: 'Dairy & Eggs Section',
    zone: 'Dairy & Eggs',
    status: 'warning',
    temperature: -16.5,
    targetTemp: -18.0,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    alerts: ['Temperature above target', 'Compressor noise detected']
  },
  {
    id: 'POS-001',
    name: 'Self-Checkout Terminal #1',
    type: 'pos-terminal',
    location: 'Checkout Area',
    zone: 'Bakery',
    status: 'operational',
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-05-10',
    alerts: []
  },
  {
    id: 'CAM-001',
    name: 'Security Camera - Entrance',
    type: 'security-camera',
    location: 'Main Entrance',
    zone: 'Fresh Produce',
    status: 'operational',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: []
  },
  {
    id: 'HVAC-002',
    name: 'HVAC Unit - Zone B',
    type: 'hvac',
    location: 'Bakery Section',
    zone: 'Bakery',
    status: 'critical',
    temperature: 26.2,
    targetTemp: 22.0,
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-03-15',
    alerts: ['Temperature significantly above target', 'Service overdue', 'Filter replacement needed']
  },
  {
    id: 'LIGHT-001',
    name: 'LED Panel - Aisle 1',
    type: 'lighting',
    location: 'Fresh Produce Aisle',
    zone: 'Fresh Produce',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    alerts: []
  },
  {
    id: 'DOOR-001',
    name: 'Auto Door Sensor',
    type: 'door-sensor',
    location: 'Main Entrance',
    zone: 'Fresh Produce',
    status: 'offline',
    lastMaintenance: '2024-01-30',
    nextMaintenance: '2024-04-30',
    alerts: ['Sensor not responding', 'Manual operation required']
  }
];

const mockZoneData: HeatmapZoneData[] = [
  {
    id: "1",
    name: "Fresh Produce",
    engagement: "high",
    gridClass: "zone-1",
    insights: {
      topSku: "ORG-APPL-001",
      lowPerformer: "BAN-002",
      layoutSuggestion: "Optimize produce placement",
      aiRationale: "High traffic zone with 78% conversion rate"
    }
  },
  {
    id: "2",
    name: "Meat & Seafood",
    engagement: "medium",
    gridClass: "zone-2",
    insights: {
      topSku: "CHKN-BRS-001",
      lowPerformer: "FISH-003",
      layoutSuggestion: "Expand seafood section",
      aiRationale: "Medium engagement with 65% conversion"
    }
  },
  {
    id: "3",
    name: "Bakery",
    engagement: "low",
    gridClass: "zone-3",
    insights: {
      topSku: "BRED-WHT-001",
      lowPerformer: "CAKE-004",
      layoutSuggestion: "Relocate to high-traffic area",
      aiRationale: "Low traffic with 42% conversion rate"
    }
  },
  {
    id: "4",
    name: "Dairy & Eggs",
    engagement: "high",
    gridClass: "zone-4",
    insights: {
      topSku: "MILK-WHL-001",
      lowPerformer: "YOGURT-005",
      layoutSuggestion: "Maintain current layout",
      aiRationale: "High engagement with 82% conversion"
    }
  }
];

interface FacilitiesManagerDashboardProps {
  selectedStore: string;
  selectedCategory: string;
}

export const FacilitiesManagerDashboard: React.FC<FacilitiesManagerDashboardProps> = ({
  selectedStore,
  selectedCategory
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [hoveredZone, setHoveredZone] = useState<HeatmapZoneData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentData, setEquipmentData] = useState<Equipment[]>(mockEquipmentData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [visibleAssetTypes, setVisibleAssetTypes] = useState<Set<string>>(new Set([
    'buildings', 'fuel', 'ev-charging', 'energy', 'security', 'service', 'infrastructure', 'other'
  ]));

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/Retail_Assets_Maintenance_Mapping.csv');
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        const mappedEquipment = parsedData.map((asset, index) => mapAssetToEquipment(asset, index));
        setEquipmentData(mappedEquipment);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        // Fall back to mock data if CSV load fails
        setEquipmentData(mockEquipmentData);
      } finally {
        setIsLoading(false);
      }
    };

    loadCSVData();
  }, []);

  const handleMouseEnter = (zone: HeatmapZoneData, event: React.MouseEvent) => {
    setHoveredZone(zone);
  };

  const handleMouseLeave = () => {
    setHoveredZone(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const filteredEquipment = equipmentData.filter(eq => {
    const zoneMatch = selectedZone === 'All Zones' || eq.zone === selectedZone;
    const categoryMatch = selectedAssetCategory === 'All Categories' || eq.category === selectedAssetCategory;
    return zoneMatch && categoryMatch;
  });

  const assetCategories = ['All Categories', ...Array.from(new Set(equipmentData.map(eq => eq.category).filter(Boolean)))];

  const statusCounts = {
    operational: equipmentData.filter(e => e.status === 'operational').length,
    warning: equipmentData.filter(e => e.status === 'warning').length,
    critical: equipmentData.filter(e => e.status === 'critical').length,
    offline: equipmentData.filter(e => e.status === 'offline').length,
  };

  const storeBlocksWithZones = [
    {
      className: "block0",
      cubes: [
        { className: "cube0", zone: mockZoneData[0], faces: { front: "Fresh Produce" } },
        { className: "cube1", zone: mockZoneData[0], faces: { front: "Fresh Produce" } },
        { className: "cube2", zone: mockZoneData[0], faces: { front: "Fresh Produce" } },
      ],
    },
    {
      className: "block1",
      cubes: [
        { className: "cube0", zone: mockZoneData[1], faces: { front: "Meat & Seafood" } },
        { className: "cube1", zone: mockZoneData[1], faces: { front: "Meat & Seafood" } },
        { className: "cube2", zone: mockZoneData[1], faces: { front: "Meat & Seafood" } },
      ],
    },
    {
      className: "block2",
      cubes: [
        { className: "cube0", zone: mockZoneData[2], faces: { front: "Bakery" } },
        { className: "cube1", zone: mockZoneData[2], faces: { front: "Bakery" } },
        { className: "cube2", zone: mockZoneData[2], faces: { front: "Bakery" } },
      ],
    },
    {
      className: "block3",
      cubes: [
        { className: "cube0", zone: mockZoneData[3], faces: { front: "Dairy & Eggs" } },
        { className: "cube1", zone: mockZoneData[3], faces: { front: "Dairy & Eggs" } },
        { className: "cube2", zone: mockZoneData[3], faces: { front: "Dairy & Eggs" } },
        { className: "cube3", zone: mockZoneData[3], faces: { front: "Dairy & Eggs" } },
      ],
    },
  ];

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return <span className="text-green-600">✅</span>;
      case 'warning': return <span className="text-yellow-600">⚠️</span>;
      case 'critical': return <span className="text-red-600">❌</span>;
      case 'offline': return <span className="text-gray-600">⭕</span>;
    }
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Data Source Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">ℹ️</span>
          <p className="text-sm text-blue-800">
            <strong>Data Source:</strong> Retail_Assets_Maintenance_Mapping.csv | 
            <strong className="ml-2">Total Assets:</strong> {equipmentData.length} | 
            <strong className="ml-2">Categories:</strong> {assetCategories.length - 1}
          </p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.operational}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.critical}</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.offline}</p>
            </div>
            <span className="text-4xl">⭕</span>
          </div>
        </div>
      </div>

      {/* 3D Retail Facility Layout and Equipment List */}
      <div className="grid grid-cols-12 gap-4">
        {/* Retail Facility Layout - 9 columns */}
        <div className="col-span-9 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>🏗️</span>
                Retail Facility Layout - {viewMode === '3d' ? '3D Isometric' : '2D Top'} View
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === '3d'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🎲 3D View
                  </button>
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === '2d'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🗺️ 2D View
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Click on assets for details
                </div>
              </div>
            </div>
            
            {/* Asset Category Toggles */}
            <div className="flex items-center gap-2 flex-wrap bg-gray-50 p-2 rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-700 mr-1">Show:</span>
              {[
                { key: 'buildings', label: '🏢 Buildings', color: 'blue' },
                { key: 'fuel', label: '⛽ Fuel', color: 'orange' },
                { key: 'ev-charging', label: '🔌 EV', color: 'green' },
                { key: 'energy', label: '🔋 Energy', color: 'yellow' },
                { key: 'security', label: '📹 Security', color: 'red' },
                { key: 'service', label: '🛠️ Service', color: 'purple' },
                { key: 'infrastructure', label: '💡 Infrastructure', color: 'indigo' },
                { key: 'other', label: '🌲 Other', color: 'emerald' },
              ].map(category => {
                const isVisible = visibleAssetTypes.has(category.key);
                return (
                  <button
                    key={category.key}
                    onClick={() => {
                      const newVisible = new Set(visibleAssetTypes);
                      if (isVisible) {
                        newVisible.delete(category.key);
                      } else {
                        newVisible.add(category.key);
                      }
                      setVisibleAssetTypes(newVisible);
                    }}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      isVisible
                        ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-300`
                        : 'bg-gray-200 text-gray-500 border border-gray-300 opacity-50 hover:opacity-75'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  const allCategories = new Set(['buildings', 'fuel', 'ev-charging', 'energy', 'security', 'service', 'infrastructure', 'other']);
                  setVisibleAssetTypes(visibleAssetTypes.size === allCategories.size ? new Set() : allCategories);
                }}
                className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-white hover:bg-gray-800 transition-all"
              >
                {visibleAssetTypes.size === 8 ? 'Hide All' : 'Show All'}
              </button>
            </div>
          </div>
          <div className="relative h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner">
            <RetailFacilityLayout 
              onAssetClick={(asset) => {
                // Find equipment matching this asset
                const matchingEquipment = equipmentData.find(eq => 
                  eq.name.toLowerCase().includes(asset.name.toLowerCase()) ||
                  asset.name.toLowerCase().includes(eq.name.toLowerCase())
                );
                if (matchingEquipment) {
                  setSelectedEquipment(matchingEquipment);
                }
              }}
              selectedAssetId={selectedEquipment?.id}
              viewMode={viewMode}
              visibleAssetTypes={visibleAssetTypes}
            />
          </div>
        </div>

        {/* Equipment Assets List - 3 columns */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>⚙️</span>
              Equipment
            </h2>
            <span className="text-sm font-normal text-gray-500">
              {filteredEquipment.length}
            </span>
          </div>
          <div className="mb-3">
            <select
              value={selectedAssetCategory}
              onChange={(e) => setSelectedAssetCategory(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {assetCategories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-[540px] overflow-y-auto">
            {filteredEquipment.map(equipment => (
              <div
                key={equipment.id}
                onClick={() => setSelectedEquipment(equipment)}
                className={`p-2 border rounded-lg cursor-pointer transition-all ${
                  selectedEquipment?.id === equipment.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {getStatusIcon(equipment.status)}
                      <h3 className="font-medium text-xs line-clamp-1">{equipment.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{equipment.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {equipment.category && (
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                      {equipment.category}
                    </span>
                  )}
                  {equipment.criticality && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                      equipment.criticality === 'T1' ? 'bg-red-100 text-red-700' :
                      equipment.criticality === 'T2' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {equipment.criticality}
                    </span>
                  )}
                </div>
                {equipment.alerts.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-gray-200">
                    <p className="text-xs text-red-600 flex items-center gap-1 line-clamp-1">
                      <span>⚠️</span>
                      {equipment.alerts[0]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Details Panel */}
      {selectedEquipment && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>🔧</span>
                Equipment Details: {selectedEquipment.name}
              </h2>
              <p className="text-sm text-gray-600">{selectedEquipment.id}</p>
            </div>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{selectedEquipment.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Zone</p>
              <p className="font-medium">{selectedEquipment.zone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedEquipment.status)}
                <span className="font-medium capitalize">{selectedEquipment.status}</span>
              </div>
            </div>
            {selectedEquipment.criticality && (
              <div>
                <p className="text-sm text-gray-600">Criticality</p>
                <p className="font-medium">{selectedEquipment.criticality}</p>
              </div>
            )}
            {selectedEquipment.category && (
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{selectedEquipment.category}</p>
              </div>
            )}
            {selectedEquipment.maintenanceMode && (
              <div>
                <p className="text-sm text-gray-600">Maintenance Mode</p>
                <p className="font-medium text-xs">{selectedEquipment.maintenanceMode}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Last Maintenance</p>
              <p className="font-medium">{selectedEquipment.lastMaintenance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Maintenance</p>
              <p className="font-medium">{selectedEquipment.nextMaintenance}</p>
            </div>
            {selectedEquipment.serviceFrequency && (
              <div>
                <p className="text-sm text-gray-600">Service Frequency</p>
                <p className="font-medium text-xs">{selectedEquipment.serviceFrequency}</p>
              </div>
            )}
            {selectedEquipment.temperature !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Current Temperature</p>
                <p className="font-medium">{selectedEquipment.temperature}°C</p>
              </div>
            )}
            {selectedEquipment.replacementCycle && (
              <div>
                <p className="text-sm text-gray-600">Replacement Cycle</p>
                <p className="font-medium text-xs">{selectedEquipment.replacementCycle}</p>
              </div>
            )}
          </div>
          {selectedEquipment.compliance && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">Compliance Requirements</p>
              <p className="text-sm text-gray-600">{selectedEquipment.compliance}</p>
            </div>
          )}
          {selectedEquipment.kpis && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">Primary KPIs</p>
              <p className="text-sm text-gray-600">{selectedEquipment.kpis}</p>
            </div>
          )}
          {selectedEquipment.alerts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Active Alerts</p>
              <div className="space-y-1">
                {selectedEquipment.alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-red-600">
                    <span>⚠️</span>
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
