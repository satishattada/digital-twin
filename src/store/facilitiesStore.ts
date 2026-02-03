import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { HeatmapZoneData } from '../types';

// Equipment Interface
export interface Equipment {
  id: string;
  name: string;
  type: 'refrigerator' | 'freezer' | 'hvac' | 'pos-terminal' | 'security-camera' | 'lighting' | 'door-sensor' | 'fuel-pump' | 'fuel-tank' | 'ev-charger' | 'solar-panel' | 'vacuum' | 'atm' | 'fire-alarm' | 'building' | 'structure' | 'emergency-system' | 'coffee-machine' | 'beverage-dispenser' | 'oven' | 'microwave' | 'hot-food-cabinet' | 'car-wash' | 'pressure-washer' | 'water-recycler';
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

// Base atoms for state management
// Using atomWithStorage to persist equipment data changes across page refreshes
export const equipmentDataAtom = atomWithStorage<Equipment[]>('equipmentData', []);
export const selectedZoneAtom = atom<string>('All Zones');
export const selectedAssetCategoryAtom = atom<string>('All Categories');
export const selectedEquipmentAtom = atom<Equipment | null>(null);
export const hoveredZoneAtom = atom<HeatmapZoneData | null>(null);
export const mousePositionAtom = atom({ x: 0, y: 0 });
export const isLoadingAtom = atom<boolean>(true);
export const viewModeAtom = atomWithStorage<'3d' | '2d'>('viewMode', '3d');

// Store as array for atomWithStorage, convert to Set for usage
const visibleAssetTypesArrayAtom = atomWithStorage<string[]>(
  'visibleAssetTypes',
  ['buildings', 'fuel', 'ev-charging', 'energy', 'security', 'service', 'infrastructure', 'food-service', 'refrigeration', 'car-wash', 'other']
);

// Derived atom that converts array to Set for easier usage
export const visibleAssetTypesAtom = atom(
  (get) => new Set(get(visibleAssetTypesArrayAtom)),
  (get, set, newSet: Set<string>) => {
    set(visibleAssetTypesArrayAtom, Array.from(newSet));
  }
);

export const isChatOpenAtom = atom<boolean>(false);

// Derived atoms (computed values)
export const filteredEquipmentAtom = atom((get) => {
  const equipmentData = get(equipmentDataAtom);
  const selectedZone = get(selectedZoneAtom);
  const selectedAssetCategory = get(selectedAssetCategoryAtom);

  return equipmentData.filter(eq => {
    const zoneMatch = selectedZone === 'All Zones' || eq.zone === selectedZone;
    const categoryMatch = selectedAssetCategory === 'All Categories' || eq.category === selectedAssetCategory;
    return zoneMatch && categoryMatch;
  });
});

export const assetCategoriesAtom = atom((get) => {
  const equipmentData = get(equipmentDataAtom);
  return ['All Categories', ...Array.from(new Set(equipmentData.map(eq => eq.category).filter(Boolean)))];
});

export const statusCountsAtom = atom((get) => {
  const equipmentData = get(equipmentDataAtom);
  return {
    operational: equipmentData.filter(e => e.status === 'operational').length,
    warning: equipmentData.filter(e => e.status === 'warning').length,
    critical: equipmentData.filter(e => e.status === 'critical').length,
    offline: equipmentData.filter(e => e.status === 'offline').length,
  };
});

export const complianceCountsAtom = atom((get) => {
  const equipmentData = get(equipmentDataAtom);
  const today = new Date();
  
  return {
    compliant: equipmentData.filter(e => {
      const nextMaint = new Date(e.nextMaintenance);
      return nextMaint > today && e.status !== 'critical' && e.status !== 'offline';
    }).length,
    nonCompliant: equipmentData.filter(e => {
      const nextMaint = new Date(e.nextMaintenance);
      return nextMaint <= today || e.status === 'critical' || e.status === 'offline';
    }).length,
    maintenanceChecks: equipmentData.filter(e => {
      const nextMaint = new Date(e.nextMaintenance);
      const daysUntilMaint = Math.ceil((nextMaint.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilMaint <= 30 && daysUntilMaint > 0; // Due within 30 days
    }).length,
  };
});

export const zonesAtom = atom((get) => {
  const equipmentData = get(equipmentDataAtom);
  return ['All Zones', ...Array.from(new Set(equipmentData.map(eq => eq.zone)))];
});

// Helper atom to get equipment by ID
export const getEquipmentByIdAtom = atom(
  null,
  (get, _set, id: string) => {
    const equipmentData = get(equipmentDataAtom);
    return equipmentData.find(eq => eq.id === id) || null;
  }
);

// Utility function to export equipment data as CSV
export const exportEquipmentToCSV = (equipmentData: Equipment[]): string => {
  const headers = [
    'Asset ID',
    'Asset Name',
    'Asset Type',
    'Location',
    'Zone',
    'Status',
    'Temperature',
    'Target Temperature',
    'Last Maintenance',
    'Next Maintenance',
    'Alerts',
    'Category',
    'Criticality',
    'Maintenance Mode',
    'Service Frequency',
    'Replacement Cycle',
    'Compliance',
    'KPIs'
  ];

  const rows = equipmentData.map(eq => [
    eq.id,
    eq.name,
    eq.type,
    eq.location,
    eq.zone,
    eq.status,
    eq.temperature?.toString() || '',
    eq.targetTemp?.toString() || '',
    eq.lastMaintenance,
    eq.nextMaintenance,
    eq.alerts.join('; '),
    eq.category || '',
    eq.criticality || '',
    eq.maintenanceMode || '',
    eq.serviceFrequency || '',
    eq.replacementCycle || '',
    eq.compliance || '',
    eq.kpis || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells containing commas, quotes, or newlines
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  return csvContent;
};

// Utility function to download CSV file
export const downloadEquipmentCSV = (equipmentData: Equipment[], filename: string = 'Retail_Assets_Maintenance_Mapping.csv') => {
  const csvContent = exportEquipmentToCSV(equipmentData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
