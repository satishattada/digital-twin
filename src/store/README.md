# Jotai State Management - Facilities Manager Dashboard

This directory contains the global state management for the Facilities Manager Dashboard using Jotai.

## Overview

Jotai is a primitive and flexible state management library for React. It provides atomic state management with minimal boilerplate.

## Store Structure

### Equipment Interface
```typescript
interface Equipment {
  id: string;
  name: string;
  type: string;
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
```

## Atoms

### Base Atoms (Direct State)
- `equipmentDataAtom` - Array of all equipment
- `selectedZoneAtom` - Currently selected zone filter
- `selectedAssetCategoryAtom` - Currently selected asset category filter
- `selectedEquipmentAtom` - Currently selected equipment for detail view
- `hoveredZoneAtom` - Currently hovered zone in the layout
- `mousePositionAtom` - Current mouse position for tooltips
- `isLoadingAtom` - Loading state for data fetching
- `viewModeAtom` - 3D or 2D view mode (persisted to localStorage)
- `visibleAssetTypesAtom` - Set of visible asset types (persisted to localStorage)
- `isChatOpenAtom` - Chat interface open/close state

### Derived Atoms (Computed Values)
- `filteredEquipmentAtom` - Equipment filtered by zone and category
- `assetCategoriesAtom` - List of all available asset categories
- `statusCountsAtom` - Count of equipment by status (operational, warning, critical, offline)
- `complianceCountsAtom` - Count of compliant, non-compliant, and maintenance due equipment
- `zonesAtom` - List of all available zones

## Usage Example

```typescript
import { useAtom, useAtomValue } from 'jotai';
import { equipmentDataAtom, statusCountsAtom } from '../store/facilitiesStore';

function MyComponent() {
  // Read and write
  const [equipment, setEquipment] = useAtom(equipmentDataAtom);
  
  // Read only
  const statusCounts = useAtomValue(statusCountsAtom);
  
  return (
    <div>
      <p>Total Equipment: {equipment.length}</p>
      <p>Operational: {statusCounts.operational}</p>
    </div>
  );
}
```

## Benefits

1. **Minimal Boilerplate** - No need for reducers, actions, or complex setup
2. **Atomic Updates** - Only components using specific atoms re-render when those atoms change
3. **TypeScript Support** - Full type safety out of the box
4. **Derived State** - Computed values automatically update when dependencies change
5. **Persistence** - `atomWithStorage` automatically syncs with localStorage
6. **DevTools** - Compatible with Redux DevTools for debugging

## Computed Logic

### Compliance Counts
- **Compliant**: Equipment with future maintenance scheduled and not in critical/offline status
- **Non-Compliant**: Equipment overdue for maintenance or in critical/offline status
- **Maintenance Due**: Equipment requiring maintenance within the next 30 days

### Status Counts
Counts equipment by operational status: operational, warning, critical, offline

### Filtered Equipment
Applies zone and category filters to the equipment list
