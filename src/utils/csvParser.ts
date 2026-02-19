export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    return obj;
  });
};

export const mapAssetToEquipment = (asset: any, index: number): any => {
  const statusMap: { [key: string]: 'operational' | 'warning' | 'critical' | 'offline' } = {
    'T1': Math.random() > 0.7 ? 'warning' : 'operational',
    'T2': Math.random() > 0.8 ? 'warning' : 'operational',
    'T3': Math.random() > 0.9 ? 'offline' : 'operational'
  };
  
  const getStatus = (criticality: string): 'operational' | 'warning' | 'critical' | 'offline' => {
    const rand = Math.random();
    if (criticality === 'T1') {
      if (rand > 0.9) return 'critical';
      if (rand > 0.7) return 'warning';
      return 'operational';
    } else if (criticality === 'T2') {
      if (rand > 0.85) return 'warning';
      if (rand > 0.95) return 'offline';
      return 'operational';
    } else {
      if (rand > 0.9) return 'offline';
      return 'operational';
    }
  };

  const typeMap: { [key: string]: any } = {
    'Refrigeration': 'refrigerator',
    'HVAC': 'hvac',
    'POS & Kiosks': 'pos-terminal',
    'Security': 'security-camera',
    'Store Equipment': 'freezer',
    'Forecourt': 'pos-terminal',
    'Energy': 'lighting',
    'Electrical': 'lighting'
  };

  const zoneMap: { [key: string]: string } = {
    'Refrigeration': 'Dairy & Eggs',
    'Store Equipment': 'Bakery',
    'POS & Kiosks': 'Fresh Produce',
    'HVAC': 'Meat & Seafood',
    'Security': 'Fresh Produce',
    'Forecourt': 'Fresh Produce',
    'Energy': 'Dairy & Eggs',
    'Electrical': 'Bakery'
  };

  const status = getStatus(asset.Criticality);
  const alerts: string[] = [];
  
  if (status === 'warning') {
    alerts.push('Scheduled maintenance approaching');
  } else if (status === 'critical') {
    alerts.push('Immediate attention required', 'Performance degradation detected');
  } else if (status === 'offline') {
    alerts.push('System offline', 'Service required');
  }

  const hasTemperature = ['refrigerator', 'freezer', 'hvac'].includes(typeMap[asset.Category] || '');
  
  return {
    id: `ASSET-${String(index + 1).padStart(3, '0')}`,
    name: asset.Asset,
    type: typeMap[asset.Category] || 'pos-terminal',
    location: `${asset.Category} Section`,
    zone: zoneMap[asset.Category] || 'Fresh Produce',
    status,
    temperature: hasTemperature ? (Math.random() * 5 + 2).toFixed(1) : undefined,
    targetTemp: hasTemperature ? 4.0 : undefined,
    lastMaintenance: getRandomPastDate(30, 90),
    nextMaintenance: getRandomFutureDate(30, 120),
    alerts,
    category: asset.Category,
    criticality: asset.Criticality,
    maintenanceMode: asset['Maintenance Mode'],
    serviceFrequency: asset['Typical Service Frequency'],
    replacementCycle: asset['Typical Replacement Cycle'],
    compliance: asset.Compliance,
    kpis: asset['Primary KPIs']
  };
};

const getRandomPastDate = (minDaysAgo: number, maxDaysAgo: number): string => {
  const daysAgo = Math.floor(Math.random() * (maxDaysAgo - minDaysAgo)) + minDaysAgo;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getRandomFutureDate = (minDaysFromNow: number, maxDaysFromNow: number): string => {
  const daysFromNow = Math.floor(Math.random() * (maxDaysFromNow - minDaysFromNow)) + minDaysFromNow;
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};
