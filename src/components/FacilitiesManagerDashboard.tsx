import React, { useState, useEffect } from 'react';
import Store3DLayout from './Store3DLayout';
import { RetailFacilityLayout } from './RetailFacilityLayout';
import { HeatmapZoneData } from '../types';
import { parseCSV, mapAssetToEquipment } from '../utils/csvParser';

interface Equipment {
  id: string;
  name: string;
  type: 'refrigerator' | 'freezer' | 'hvac' | 'pos-terminal' | 'security-camera' | 'lighting' | 'door-sensor' | 'fuel-pump' | 'fuel-tank' | 'ev-charger' | 'solar-panel' | 'vacuum' | 'atm' | 'fire-alarm' | 'building' | 'structure' | 'emergency-system';
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
  // Buildings
  {
    id: 'store-main',
    name: 'Main Convenience Store',
    type: 'building',
    location: 'Main Facility',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-07-01',
    alerts: [],
    category: 'buildings'
  },
  {
    id: 'carwash-building',
    name: 'Automated Car Wash',
    type: 'building',
    location: 'West Side',
    zone: 'Car Wash',
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    alerts: [],
    category: 'buildings'
  },
  {
    id: 'storage-building',
    name: 'Storage Building',
    type: 'building',
    location: 'South Side',
    zone: 'Storage',
    status: 'operational',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    alerts: [],
    category: 'buildings'
  },

  // Structures
  {
    id: 'forecourt-canopy',
    name: 'Fuel Forecourt Canopy',
    type: 'structure',
    location: 'Fuel Forecourt',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-06-15',
    alerts: [],
    category: 'infrastructure'
  },

  // HVAC Systems
  {
    id: 'hvac-store',
    name: 'Store HVAC Unit 15 Ton',
    type: 'hvac',
    location: 'Convenience Store Roof',
    zone: 'Convenience Store',
    status: 'critical',
    temperature: 28.5,
    targetTemp: 22.0,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    alerts: ['Compressor failure - temperature rising', 'Refrigerant leak suspected'],
    category: 'energy',
    criticality: 'T1'
  },
  {
    id: 'hvac-carwash',
    name: 'Car Wash HVAC 8 Ton',
    type: 'hvac',
    location: 'Car Wash Building',
    zone: 'Car Wash',
    status: 'operational',
    temperature: 20.8,
    targetTemp: 21.0,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    alerts: [],
    category: 'energy'
  },
  
  // Fuel Pumps
  {
    id: 'pump-1a',
    name: 'Diesel Pump 1A',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 1',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    alerts: [],
    category: 'fuel'
  },
  {
    id: 'pump-1b',
    name: 'Diesel Pump 1B',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 1',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    alerts: [],
    category: 'fuel'
  },
  {
    id: 'pump-2a',
    name: 'Regular Pump 2A',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 2',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-28',
    nextMaintenance: '2024-04-28',
    alerts: [],
    category: 'fuel'
  },
  {
    id: 'pump-2b',
    name: 'Regular Pump 2B',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 2',
    zone: 'Fuel Station',
    status: 'critical',
    lastMaintenance: '2024-01-28',
    nextMaintenance: '2024-04-28',
    alerts: ['Fuel leak detected - immediate shutdown required', 'Display flicker detected'],
    category: 'fuel',
    criticality: 'T1'
  },
  {
    id: 'pump-3a',
    name: 'Premium Pump 3A',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 3',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05',
    alerts: [],
    category: 'fuel'
  },
  {
    id: 'pump-3b',
    name: 'Premium Pump 3B',
    type: 'fuel-pump',
    location: 'Fuel Forecourt - Island 3',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05',
    alerts: [],
    category: 'fuel'
  },

  // Underground Storage Tanks
  {
    id: 'fuel-tank-diesel',
    name: 'UST - Diesel 40,000L',
    type: 'fuel-tank',
    location: 'Underground - Forecourt',
    zone: 'Fuel Station',
    status: 'warning',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    alerts: ['Pressure sensor reading anomaly'],
    category: 'fuel',
    criticality: 'T1'
  },
  {
    id: 'fuel-tank-regular',
    name: 'UST - Regular 40,000L',
    type: 'fuel-tank',
    location: 'Underground - Forecourt',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    alerts: [],
    category: 'fuel'
  },
  {
    id: 'fuel-tank-premium',
    name: 'UST - Premium 30,000L',
    type: 'fuel-tank',
    location: 'Underground - Forecourt',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    alerts: [],
    category: 'fuel'
  },

  // EV Chargers
  {
    id: 'ev-level2-1',
    name: 'Level 2 Charger 7kW',
    type: 'ev-charger',
    location: 'Parking Area - Bay 1',
    zone: 'EV Charging',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    alerts: [],
    category: 'ev-charging'
  },
  {
    id: 'ev-level2-2',
    name: 'Level 2 Charger 7kW',
    type: 'ev-charger',
    location: 'Parking Area - Bay 2',
    zone: 'EV Charging',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    alerts: [],
    category: 'ev-charging'
  },
  {
    id: 'ev-level2-3',
    name: 'Level 2 Charger 7kW',
    type: 'ev-charger',
    location: 'Parking Area - Bay 3',
    zone: 'EV Charging',
    status: 'offline',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    alerts: ['Charging cable wear detected', 'Circuit breaker tripped - unit offline'],
    category: 'ev-charging',
    criticality: 'T2'
  },

  // Solar Panels
  {
    id: 'solar-panel-1',
    name: 'Solar Panel Array',
    type: 'solar-panel',
    location: 'Store Roof - Section A',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    alerts: [],
    category: 'energy'
  },

  // Security Cameras
  {
    id: 'cctv-store',
    name: 'CCTV - Store Entrance',
    type: 'security-camera',
    location: 'Store Main Entrance',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: [],
    category: 'security'
  },
  {
    id: 'cctv-forecourt-1',
    name: 'CCTV - Forecourt East',
    type: 'security-camera',
    location: 'Forecourt East Side',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: [],
    category: 'security'
  },
  {
    id: 'cctv-forecourt-2',
    name: 'CCTV - Forecourt West',
    type: 'security-camera',
    location: 'Forecourt West Side',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: [],
    category: 'security'
  },
  {
    id: 'cctv-carwash',
    name: 'CCTV - Car Wash',
    type: 'security-camera',
    location: 'Car Wash Entrance',
    zone: 'Car Wash',
    status: 'warning',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: ['Lens cleaning required'],
    category: 'security'
  },
  {
    id: 'cctv-parking',
    name: 'CCTV - Parking Area',
    type: 'security-camera',
    location: 'Main Parking Lot',
    zone: 'Parking',
    status: 'operational',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    alerts: [],
    category: 'security'
  },

  // Fire Safety
  {
    id: 'fire-alarm-1',
    name: 'Fire Alarm Panel',
    type: 'fire-alarm',
    location: 'Store Interior Wall',
    zone: 'Convenience Store',
    status: 'warning',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    alerts: ['Battery backup at 15% capacity'],
    category: 'security',
    criticality: 'T1'
  },

  // Emergency Systems
  {
    id: 'emergency-shutoff',
    name: 'Emergency Fuel Shutoff',
    type: 'emergency-system',
    location: 'Forecourt Control Station',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    alerts: [],
    category: 'security'
  },

  // Service Equipment
  {
    id: 'vacuum-1',
    name: 'Vacuum Station 1',
    type: 'vacuum',
    location: 'Car Wash Exit Area',
    zone: 'Car Wash',
    status: 'operational',
    lastMaintenance: '2024-01-30',
    nextMaintenance: '2024-04-30',
    alerts: [],
    category: 'service'
  },
  {
    id: 'atm',
    name: 'ATM Machine',
    type: 'atm',
    location: 'Store Exterior Wall',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05',
    alerts: [],
    category: 'service'
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
    // Use mock data directly instead of loading from CSV
    // This ensures IDs match with assets in RetailFacilityLayout
    setEquipmentData(mockEquipmentData);
    setIsLoading(false);
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
                // Find equipment matching this asset by ID
                const matchingEquipment = equipmentData.find(eq => eq.id === asset.id);
                if (matchingEquipment) {
                  setSelectedEquipment(matchingEquipment);
                } else {
                  console.log(`No equipment found for asset: ${asset.id} (${asset.name})`);
                }
              }}
              selectedAssetId={selectedEquipment?.id}
              viewMode={viewMode}
              visibleAssetTypes={visibleAssetTypes}
              equipmentData={equipmentData.map(eq => ({ id: eq.id, status: eq.status }))}
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
