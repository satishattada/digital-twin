import React, { useState, useEffect } from 'react';

interface EnergyAssetData {
  category: string;
  asset: string;
  criticality: string;
  energyConsumption: number;
  peakDemand: number;
  efficiencyRating: string;
  trend: string;
}

interface EnergyMetricsAnalysisProps {
  selectedCategory?: string;
}

export const EnergyMetricsAnalysis: React.FC<EnergyMetricsAnalysisProps> = ({ selectedCategory = 'All Categories' }) => {
  const [energyData, setEnergyData] = useState<EnergyAssetData[]>([]);

  useEffect(() => {
    loadEnergyData();
  }, []);

  const loadEnergyData = async () => {
    try {
      const response = await fetch('/Retail_Assets_Maintenance_Mapping.csv');
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1);
      
      const parsedData: EnergyAssetData[] = rows
        .filter(row => row.trim())
        .map(row => {
          const cols = parseCSVRow(row);
          const energyValue = parseFloat(cols[8]);
          const peakValue = parseFloat(cols[9]);
          
          return {
            category: cols[0] || '',
            asset: cols[1] || '',
            criticality: cols[2] || '',
            energyConsumption: isNaN(energyValue) ? 0 : energyValue,
            peakDemand: isNaN(peakValue) ? 0 : peakValue,
            efficiencyRating: cols[10] || 'N/A',
            trend: cols[11] || '0%',
          };
        })
        .filter(item => item.asset && item.category);

      setEnergyData(parsedData);
    } catch (error) {
      console.error('Error loading energy data:', error);
    }
  };

  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const filteredData = selectedCategory === 'All Categories' 
    ? energyData 
    : energyData.filter(item => item.category === selectedCategory);

  const topConsumers = [...filteredData]
    .sort((a, b) => Math.abs(b.energyConsumption) - Math.abs(a.energyConsumption))
    .slice(0, 20);

  const getEfficiencyColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">⚡ Energy Consumption Analysis</h2>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700">Real-time Metrics</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔥 Top Energy Consumers</h3>
          <span className="text-sm text-gray-600">{topConsumers.length} assets</span>
        </div>
        
        <div className="space-y-3">
          {topConsumers.map((asset, index) => {
            const isGenerator = asset.energyConsumption < 0;
            const consumption = Math.abs(asset.energyConsumption);
            const maxConsumption = Math.max(...topConsumers.map(a => Math.abs(a.energyConsumption)));
            const barWidth = (consumption / maxConsumption) * 100;

            return (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                      <span className="text-sm font-semibold text-gray-800">{asset.asset}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        asset.criticality === 'T1' ? 'bg-red-100 text-red-700' :
                        asset.criticality === 'T2' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {asset.criticality}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${getEfficiencyColor(asset.efficiencyRating)}`}></span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{asset.category}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isGenerator ? 'text-green-600' : 'text-gray-900'}`}>
                      {isGenerator ? '+' : ''}{asset.energyConsumption.toFixed(1)} kWh/day
                    </div>
                    <div className="text-xs text-gray-600">{asset.peakDemand.toFixed(1)} kW peak</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isGenerator ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
