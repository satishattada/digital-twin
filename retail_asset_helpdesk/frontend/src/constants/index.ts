import { AssetCategory, AssetStatus, Priority } from '@/types';

export const ASSET_CATEGORIES: Record<AssetCategory, { label: string; icon: string }> = {
  coffee_machine: { label: 'Coffee Machine', icon: '☕' },
  oven: { label: 'Oven', icon: '🔥' },
  refrigerator: { label: 'Refrigerator', icon: '🧊' },
  freezer: { label: 'Freezer', icon: '❄️' },
  dishwasher: { label: 'Dishwasher', icon: '🍽️' },
  microwave: { label: 'Microwave', icon: '📡' },
  pos_terminal: { label: 'POS Terminal', icon: '💳' },
  display_cooler: { label: 'Display Cooler', icon: '🥤' },
  ice_machine: { label: 'Ice Machine', icon: '🧊' },
  hvac: { label: 'HVAC System', icon: '🌡️' },
};

export const ASSET_STATUS: Record<AssetStatus, { label: string; color: string }> = {
  operational: { label: 'Operational', color: '#48bb78' },
  maintenance: { label: 'Under Maintenance', color: '#ecc94b' },
  faulty: { label: 'Faulty', color: '#f56565' },
  offline: { label: 'Offline', color: '#a0aec0' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#48bb78' },
  medium: { label: 'Medium', color: '#ecc94b' },
  high: { label: 'High', color: '#ed8936' },
  critical: { label: 'Critical', color: '#f56565' },
};

export const CHAT_SUGGESTIONS = [
  {
    category: 'Troubleshooting',
    suggestions: [
      'Coffee machine not heating water',
      'Oven temperature inconsistent',
      'Refrigerator making loud noise',
      'POS terminal not connecting',
    ],
  },
  {
    category: 'Maintenance',
    suggestions: [
      'How to clean the coffee machine?',
      'Oven maintenance schedule',
      'How to defrost the freezer?',
      'Filter replacement procedure',
    ],
  },
  {
    category: 'Error Codes',
    suggestions: [
      'Error code E01 on coffee machine',
      'What does F5 mean on the oven?',
      'Refrigerator showing H1 error',
      'Ice machine error code C3',
    ],
  },
];