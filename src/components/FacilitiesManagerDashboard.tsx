import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Store3DLayout from './Store3DLayout';
import { RetailFacilityLayout } from './RetailFacilityLayout';
import { HeatmapZoneData } from '../types';
import { parseCSV, mapAssetToEquipment } from '../utils/csvParser';
import ChatInterface from './ChatInterface';
import AssetDetailsFullPage from './AssetDetailsFullPage';
import { EnergyMetricsAnalysis } from './EnergyMetricsAnalysis';
import {
  equipmentDataAtom,
  selectedZoneAtom,
  selectedAssetCategoryAtom,
  selectedEquipmentAtom,
  hoveredZoneAtom,
  mousePositionAtom,
  isLoadingAtom,
  viewModeAtom,
  visibleAssetTypesAtom,
  isChatOpenAtom,
  filteredEquipmentAtom,
  assetCategoriesAtom,
  statusCountsAtom,
  complianceCountsAtom,
  zonesAtom,
  Equipment,
  downloadEquipmentCSV
} from '../store/facilitiesStore';

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
  {
    id: 'price-list-pillar',
    name: 'Fuel Price Display',
    type: 'structure',
    location: 'Fuel Forecourt Entrance',
    zone: 'Fuel Station',
    status: 'operational',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-07-05',
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
  },

  // Store Equipment - Food Service
  {
    id: 'coffee-machine-1',
    name: 'Coffee Machine',
    type: 'coffee-machine',
    location: 'Store - Food Service Area',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    alerts: [],
    category: 'food-service',
    criticality: 'T2',
    maintenanceMode: 'Preventive + Consumables',
    serviceFrequency: 'Monthly descaling; quarterly service',
    replacementCycle: '5–7 yrs',
    compliance: 'Food safety; water quality',
    kpis: 'Availability, Temperature/taste variance'
  },
  {
    id: 'beverage-dispenser-1',
    name: 'Beverage Dispenser',
    type: 'beverage-dispenser',
    location: 'Store - Beverage Station',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    alerts: [],
    category: 'food-service',
    criticality: 'T2',
    maintenanceMode: 'Preventive',
    serviceFrequency: 'Quarterly',
    replacementCycle: '5–7 yrs',
    compliance: 'Food safety',
    kpis: 'Dispense accuracy'
  },
  {
    id: 'oven-1',
    name: 'Bakery Oven',
    type: 'oven',
    location: 'Store - Bakery Section',
    zone: 'Convenience Store',
    status: 'warning',
    temperature: 185,
    targetTemp: 180,
    lastMaintenance: '2023-12-20',
    nextMaintenance: '2024-03-20',
    alerts: ['Temperature calibration needed'],
    category: 'food-service',
    criticality: 'T2',
    maintenanceMode: 'Preventive + Compliance',
    serviceFrequency: 'Quarterly cleaning & safety',
    replacementCycle: '7–10 yrs',
    compliance: 'Electrical & food safety',
    kpis: 'Temperature accuracy, Energy use'
  },
  {
    id: 'microwave-1',
    name: 'Customer Microwave',
    type: 'microwave',
    location: 'Store - Customer Area',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2023-12-01',
    nextMaintenance: '2024-06-01',
    alerts: [],
    category: 'food-service',
    criticality: 'T3',
    maintenanceMode: 'Reactive + Light preventive',
    serviceFrequency: 'Semi-annual checks',
    replacementCycle: '5–7 yrs',
    compliance: 'Electrical safety',
    kpis: 'Availability'
  },
  {
    id: 'hot-food-cabinet-1',
    name: 'Hot Food Display Cabinet',
    type: 'hot-food-cabinet',
    location: 'Store - Food Service Area',
    zone: 'Convenience Store',
    status: 'operational',
    temperature: 65,
    targetTemp: 63,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    alerts: [],
    category: 'food-service',
    criticality: 'T2',
    maintenanceMode: 'Preventive',
    serviceFrequency: 'Quarterly',
    replacementCycle: '6–8 yrs',
    compliance: 'Food safety',
    kpis: 'Holding temp compliance'
  },

  // Refrigeration Equipment
  {
    id: 'chiller-1',
    name: 'Open Chiller - Beverages',
    type: 'refrigerator',
    location: 'Store - Beverage Section',
    zone: 'Convenience Store',
    status: 'operational',
    temperature: 3.8,
    targetTemp: 4.0,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    alerts: [],
    category: 'refrigeration',
    criticality: 'T1',
    maintenanceMode: 'Condition-based + Predictive',
    serviceFrequency: 'Remote temp monitoring; quarterly PM',
    replacementCycle: '8–10 yrs (compressors 5–7)',
    compliance: 'F-gas/leak logs; HACCP',
    kpis: 'Product temp compliance, Energy/kWh'
  },
  {
    id: 'freezer-1',
    name: 'Open Freezer - Ice Cream',
    type: 'freezer',
    location: 'Store - Frozen Section',
    zone: 'Convenience Store',
    status: 'operational',
    temperature: -18.2,
    targetTemp: -18.0,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    alerts: [],
    category: 'refrigeration',
    criticality: 'T1',
    maintenanceMode: 'Condition-based + Predictive',
    serviceFrequency: 'Remote temp monitoring; quarterly PM',
    replacementCycle: '8–10 yrs (compressors 5–7)',
    compliance: 'F-gas/leak logs; HACCP',
    kpis: 'Product temp compliance, Energy/kWh'
  },
  {
    id: 'chiller-2',
    name: 'Walk-in Cooler',
    type: 'refrigerator',
    location: 'Store - Back Room',
    zone: 'Convenience Store',
    status: 'warning',
    temperature: 5.5,
    targetTemp: 4.0,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    alerts: ['Temperature slightly elevated', 'Door seal inspection needed'],
    category: 'refrigeration',
    criticality: 'T1',
    maintenanceMode: 'Condition-based + Predictive',
    serviceFrequency: 'Remote temp monitoring; quarterly PM',
    replacementCycle: '8–10 yrs (compressors 5–7)',
    compliance: 'F-gas/leak logs; HACCP',
    kpis: 'Product temp compliance, Energy/kWh'
  },
  {
    id: 'compressor-1',
    name: 'Refrigeration Compressor Unit',
    type: 'hvac',
    location: 'Store - Equipment Room',
    zone: 'Convenience Store',
    status: 'operational',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    alerts: [],
    category: 'refrigeration',
    criticality: 'T1',
    maintenanceMode: 'Condition-based + Predictive',
    serviceFrequency: 'Quarterly',
    replacementCycle: '5–7 yrs',
    compliance: 'Refrigerant management',
    kpis: 'MTBF, Energy efficiency'
  },

  // Car Wash Equipment
  {
    id: 'carwash-automatic',
    name: 'Automatic Car Wash System',
    type: 'car-wash',
    location: 'Car Wash Building',
    zone: 'Car Wash',
    status: 'operational',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    alerts: [],
    category: 'car-wash',
    criticality: 'T2',
    maintenanceMode: 'Preventive + Condition-based',
    serviceFrequency: 'Monthly consumables; quarterly mechanical',
    replacementCycle: '10–12 yrs',
    compliance: 'Water discharge permits',
    kpis: 'Throughput, Downtime'
  },
  {
    id: 'pressure-wash-1',
    name: 'Jet/Pressure Wash System',
    type: 'pressure-washer',
    location: 'Car Wash - Bay 1',
    zone: 'Car Wash',
    status: 'operational',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    alerts: [],
    category: 'car-wash',
    criticality: 'T2',
    maintenanceMode: 'Preventive',
    serviceFrequency: 'Quarterly',
    replacementCycle: '8–10 yrs',
    compliance: 'Electrical & water regulations',
    kpis: 'Availability'
  },
  {
    id: 'water-recycler-1',
    name: 'Water Recycling System',
    type: 'water-recycler',
    location: 'Car Wash - Utility Room',
    zone: 'Car Wash',
    status: 'warning',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    alerts: ['Monthly water quality check due'],
    category: 'car-wash',
    criticality: 'T2',
    maintenanceMode: 'Preventive + Compliance',
    serviceFrequency: 'Monthly water quality checks',
    replacementCycle: '10–12 yrs',
    compliance: 'Water quality/effluent standards',
    kpis: 'Reuse %, Water quality score'
  }
];



interface FacilitiesManagerDashboardProps {
  selectedStore: string;
  selectedCategory: string;
  onNavigateToAssetDetails?: () => void;
}

export const FacilitiesManagerDashboard: React.FC<FacilitiesManagerDashboardProps> = ({
  selectedStore,
  selectedCategory,
  onNavigateToAssetDetails
}) => {
  const navigate = useNavigate();
  
  // Jotai atoms for state management
  const [selectedZone, setSelectedZone] = useAtom(selectedZoneAtom);
  const [hoveredZone, setHoveredZone] = useAtom(hoveredZoneAtom);
  const [mousePosition, setMousePosition] = useAtom(mousePositionAtom);
  const [selectedEquipment, setSelectedEquipment] = useAtom(selectedEquipmentAtom);
  const [equipmentData, setEquipmentData] = useAtom(equipmentDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [selectedAssetCategory, setSelectedAssetCategory] = useAtom(selectedAssetCategoryAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [visibleAssetTypes, setVisibleAssetTypes] = useAtom(visibleAssetTypesAtom);
  const [isChatOpen, setIsChatOpen] = useAtom(isChatOpenAtom);
  const [dashboardView, setDashboardView] = useState<'facility' | 'energy'>('facility');
  const [statusModalFilter, setStatusModalFilter] = useState<{
    type: 'status' | 'compliance' | 'maintenance';
    value: string;
    label: string;
  } | null>(null);
  
  // Derived values from atoms
  const filteredEquipment = useAtomValue(filteredEquipmentAtom);
  const assetCategories = useAtomValue(assetCategoriesAtom);
  const statusCounts = useAtomValue(statusCountsAtom);
  const complianceCounts = useAtomValue(complianceCountsAtom);
  const zones = useAtomValue(zonesAtom);

  useEffect(() => {
    // Initialize with mock data only if localStorage is empty
    // This allows changes from the simulator to persist
    if (equipmentData.length === 0) {
      setEquipmentData(mockEquipmentData);
    }
    setIsLoading(false);
  }, []);

  const handleExportCSV = () => {
    downloadEquipmentCSV(equipmentData);
  };

  const handleMouseEnter = (zone: HeatmapZoneData, event: React.MouseEvent) => {
    setHoveredZone(zone);
  };

  const handleMouseLeave = () => {
    setHoveredZone(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
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

  const getFilteredAssets = () => {
    if (!statusModalFilter) return [];
    
    if (statusModalFilter.type === 'status') {
      return equipmentData.filter(eq => eq.status === statusModalFilter.value);
    } else if (statusModalFilter.type === 'compliance') {
      const today = new Date();
      if (statusModalFilter.value === 'compliant') {
        return equipmentData.filter(eq => {
          const nextMaint = new Date(eq.nextMaintenance);
          return nextMaint > today;
        });
      } else {
        return equipmentData.filter(eq => {
          const nextMaint = new Date(eq.nextMaintenance);
          return nextMaint <= today;
        });
      }
    } else if (statusModalFilter.type === 'maintenance') {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return equipmentData.filter(eq => {
        const nextMaint = new Date(eq.nextMaintenance);
        return nextMaint <= thirtyDaysFromNow && nextMaint > today;
      });
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dashboard View Tabs */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-3">
        <div className="flex gap-2">
          <button
            onClick={() => setDashboardView('facility')}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              dashboardView === 'facility'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>🏗️</span>
            Assets
          </button>
          <button
            onClick={() => setDashboardView('energy')}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              dashboardView === 'energy'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>⚡</span>
            Energy Metrics
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full blink-slow"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      {/* Energy Metrics View */}
      {dashboardView === 'energy' && (
        <EnergyMetricsAnalysis selectedCategory={selectedAssetCategory} />
      )}

      {/* Facility Assets View */}
      {dashboardView === 'facility' && (
        <>
      {/* Data Source Info with Export Button */}
      {/* <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-600">ℹ️</span>
            <p className="text-sm text-green-800">
              <strong>Data Source:</strong> Retail_Assets_Maintenance_Mapping.csv | 
              <strong className="ml-2">Total Assets:</strong> {equipmentData.length} | 
              <strong className="ml-2">Categories:</strong> {assetCategories.length - 1}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div> */}

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div 
          onClick={() => setStatusModalFilter({ type: 'status', value: 'operational', label: 'Operational Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-green-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.operational}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'status', value: 'warning', label: 'Warning Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-yellow-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'status', value: 'critical', label: 'Critical Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-red-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.critical}</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'status', value: 'offline', label: 'Offline Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.offline}</p>
            </div>
            <span className="text-4xl">⭕</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'compliance', value: 'compliant', label: 'Compliant Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-blue-600">{complianceCounts.compliant}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'compliance', value: 'non-compliant', label: 'Non-Compliant Assets' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non-Compliant</p>
              <p className="text-2xl font-bold text-orange-600">{complianceCounts.nonCompliant}</p>
            </div>
            <span className="text-4xl">⚡</span>
          </div>
        </div>
        <div 
          onClick={() => setStatusModalFilter({ type: 'maintenance', value: 'due', label: 'Maintenance Due (Next 30 Days)' })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-purple-600">{complianceCounts.maintenanceChecks}</p>
            </div>
            <span className="text-4xl">🔧</span>
          </div>
        </div>
      </div>

      {/* 3D Retail Facility Layout and Equipment List */}
      <div className="grid grid-cols-12 gap-4">
        {/* Retail Facility Layout - 9 columns */}
        <div className="col-span-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
                    className={`px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r   rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 lg:w-auto ${
                      viewMode === '3d'
                        ? 'from-green-600 to-green-700 text-white shadow-sm'
                        : ' hover:text-gray-900'
                    }`}
                  >
                    🎲 3D View
                  </button>

                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2  lg:w-auto ${
                      viewMode === '2d'
                        ? 'from-green-600 to-green-700 text-white shadow-sm'
                        : ' hover:text-gray-900'
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
                { key: 'buildings', label: '🏢 Buildings', color: 'teal' },
                { key: 'fuel', label: '⛽ Fuel', color: 'orange' },
                { key: 'ev-charging', label: '🔌 EV', color: 'green' },
                { key: 'energy', label: '🔋 Energy', color: 'yellow' },
                { key: 'security', label: '📹 Security', color: 'red' },
                { key: 'service', label: '🛠️ Service', color: 'purple' },
                { key: 'food-service', label: '🍽️ Food Service', color: 'pink' },
                { key: 'refrigeration', label: '❄️ Refrigeration', color: 'cyan' },
                { key: 'car-wash', label: '🚗 Car Wash', color: 'blue' },
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
                  const allCategories = new Set(['buildings', 'fuel', 'ev-charging', 'energy', 'security', 'service', 'infrastructure', 'food-service', 'refrigeration', 'car-wash', 'other']);
                  setVisibleAssetTypes(visibleAssetTypes.size === allCategories.size ? new Set() : allCategories);
                }}
                className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-white hover:bg-gray-800 transition-all"
              >
                {visibleAssetTypes.size === 11 ? 'Hide All' : 'Show All'}
              </button>
            </div>
          </div>
          <div className="relative h-[700px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner">
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
        {/* <div className="col-span-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    ? 'border-green-500 bg-green-50'
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
        </div> */}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/asset/${selectedEquipment.id}`)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2 group"
        title="AI Facility Assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">
          AI Assistant
        </span>
      </button>

      {/* Asset List Modal */}
      {statusModalFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {statusModalFilter.label}
                </h2>
                <button
                  onClick={() => setStatusModalFilter(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total: {getFilteredAssets().length} asset{getFilteredAssets().length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {getFilteredAssets().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No assets found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredAssets().map(asset => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setSelectedEquipment(asset);
                        setStatusModalFilter(null);
                      }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(asset.status)}
                            <h3 className="font-semibold text-sm">{asset.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600">{asset.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                        {asset.category && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                            {asset.category}
                          </span>
                        )}
                        {asset.criticality && (
                          <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                            asset.criticality === 'T1' ? 'bg-red-100 text-red-700' :
                            asset.criticality === 'T2' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {asset.criticality}
                          </span>
                        )}
                      </div>

                      {asset.alerts.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {asset.alerts[0]}
                          </p>
                          {asset.alerts.length > 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                              +{asset.alerts.length - 1} more alert{asset.alerts.length - 1 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Next Maint:</span>
                          <span className="font-medium">{asset.nextMaintenance}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setStatusModalFilter(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface Modal */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
    </div>
  );
};

// Wrapper component to handle page navigation
export const FacilitiesManagerDashboardWrapper: React.FC<FacilitiesManagerDashboardProps> = (props) => {
  const [selectedEquipment] = useAtom(selectedEquipmentAtom);
  const [showAssetDetailsPage, setShowAssetDetailsPage] = useState(false);

  // Listen to changes in selectedEquipment to control page visibility
  useEffect(() => {
    // This allows programmatic navigation to asset details page
  }, [selectedEquipment]);

  if (showAssetDetailsPage && selectedEquipment) {
    return (
      <AssetDetailsFullPage 
        equipment={selectedEquipment} 
        onBack={() => setShowAssetDetailsPage(false)} 
      />
    );
  }

  return <FacilitiesManagerDashboard {...props} onNavigateToAssetDetails={() => setShowAssetDetailsPage(true)} />;
};
