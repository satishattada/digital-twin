import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

interface EnergyAssetData {
  category: string;
  asset: string;
  criticality: string;
  energyConsumption: number; // kWh/day
  peakDemand: number; // kW
  efficiencyRating: string; // A, B, C, D, N/A
  trend: string; // percentage change
}

interface EnergyMetricsAnalysisProps {
  selectedCategory?: string;
}

export const EnergyMetricsAnalysis: React.FC<EnergyMetricsAnalysisProps> = ({ selectedCategory = 'All Categories' }) => {
  const [energyData, setEnergyData] = useState<EnergyAssetData[]>([]);
  const [sortBy, setSortBy] = useState<'consumption' | 'trend' | 'efficiency'>('consumption');
  const [viewMode, setViewMode] = useState<'top-consumers' | 'efficiency' | 'trends' | 'analytics'>('top-consumers');

  useEffect(() => {
    // Load energy data from CSV
    loadEnergyData();
  }, []);

  const loadEnergyData = async () => {
    try {
      const response = await fetch('/Retail_Assets_Maintenance_Mapping.csv');
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1); // Skip header
      
      const parsedData: EnergyAssetData[] = rows
        .filter(row => row.trim())
        .map(row => {
          const cols = parseCSVRow(row);
          return {
            category: cols[0] || '',
            asset: cols[1] || '',
            criticality: cols[2] || '',
            energyConsumption: parseFloat(cols[8]) || 0,
            peakDemand: parseFloat(cols[9]) || 0,
            efficiencyRating: cols[10] || 'N/A',
            trend: cols[11] || '0%',
          };
        })
        .filter(item => item.asset && !isNaN(item.energyConsumption));

      setEnergyData(parsedData);
    } catch (error) {
      console.error('Error loading energy data:', error);
    }
  };

  // Helper function to parse CSV rows correctly (handles commas in quotes)
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, '')); // Remove surrounding quotes
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

  // Calculate summary statistics
  const totalEnergyConsumption = filteredData.reduce((sum, item) => sum + item.energyConsumption, 0);
  const totalPeakDemand = filteredData.reduce((sum, item) => sum + item.peakDemand, 0);
  const avgEfficiency = filteredData.filter(item => ['A', 'B', 'C', 'D'].includes(item.efficiencyRating)).length;
  
  // Top consumers
  const topConsumers = [...filteredData]
    .sort((a, b) => Math.abs(b.energyConsumption) - Math.abs(a.energyConsumption))
    .slice(0, 10);

  // Assets by efficiency rating
  const efficiencyBreakdown = {
    A: filteredData.filter(item => item.efficiencyRating === 'A').length,
    B: filteredData.filter(item => item.efficiencyRating === 'B').length,
    C: filteredData.filter(item => item.efficiencyRating === 'C').length,
    D: filteredData.filter(item => item.efficiencyRating === 'D').length,
  };

  // Trend analysis - assets with increasing consumption
  const increasingConsumption = filteredData
    .filter(item => {
      const trendValue = parseFloat(item.trend.replace('%', ''));
      return trendValue > 0;
    })
    .sort((a, b) => {
      const aVal = parseFloat(a.trend.replace('%', ''));
      const bVal = parseFloat(b.trend.replace('%', ''));
      return bVal - aVal;
    })
    .slice(0, 10);

  // Energy generation (negative consumption)
  const energyGenerators = filteredData.filter(item => item.energyConsumption < 0);
  const totalGeneration = Math.abs(energyGenerators.reduce((sum, item) => sum + item.energyConsumption, 0));

  const getEfficiencyColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    const value = parseFloat(trend.replace('%', ''));
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    const value = parseFloat(trend.replace('%', ''));
    if (value > 10) return 'text-red-600';
    if (value > 0) return 'text-orange-600';
    if (value < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">⚡ Energy Metrics Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('top-consumers')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'top-consumers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Top Consumers
          </button>
          <button
            onClick={() => setViewMode('efficiency')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'efficiency'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Efficiency
          </button>
          <button
            onClick={() => setViewMode('trends')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'trends'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'analytics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-semibold">Total Consumption</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {totalEnergyConsumption.toFixed(1)} <span className="text-sm font-normal">kWh/day</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">{(totalEnergyConsumption * 365 / 1000).toFixed(1)} MWh/year</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-semibold">Peak Demand</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {totalPeakDemand.toFixed(1)} <span className="text-sm font-normal">kW</span>
              </p>
              <p className="text-xs text-orange-600 mt-1">Maximum load</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-semibold">Energy Generation</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {totalGeneration.toFixed(1)} <span className="text-sm font-normal">kWh/day</span>
              </p>
              <p className="text-xs text-green-600 mt-1">From solar & storage</p>
            </div>
            <div className="text-4xl">🌞</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-semibold">Net Consumption</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {(totalEnergyConsumption - totalGeneration).toFixed(1)} <span className="text-sm font-normal">kWh/day</span>
              </p>
              <p className="text-xs text-purple-600 mt-1">{((totalGeneration / totalEnergyConsumption) * 100).toFixed(1)}% offset</p>
            </div>
            <div className="text-4xl">🔋</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'top-consumers' && (
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
                  
                  {/* Energy Bar */}
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
      )}

      {viewMode === 'efficiency' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Efficiency Breakdown */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ Efficiency Rating Distribution</h3>
            <div className="space-y-4">
              {Object.entries(efficiencyBreakdown).map(([rating, count]) => {
                const total = Object.values(efficiencyBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={rating}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${getEfficiencyColor(rating)}`}></div>
                        <span className="text-sm font-semibold text-gray-800">Rating {rating}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count} assets ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getEfficiencyColor(rating)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{efficiencyBreakdown.A + efficiencyBreakdown.B}</div>
                  <div className="text-xs text-gray-600">High Efficiency (A-B)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{efficiencyBreakdown.C + efficiencyBreakdown.D}</div>
                  <div className="text-xs text-gray-600">Low Efficiency (C-D)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Efficiency Assets - Improvement Opportunities */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Improvement Opportunities</h3>
            <p className="text-sm text-gray-600 mb-4">Assets with C/D efficiency ratings consuming the most energy</p>
            
            <div className="space-y-3">
              {filteredData
                .filter(asset => ['C', 'D'].includes(asset.efficiencyRating))
                .sort((a, b) => Math.abs(b.energyConsumption) - Math.abs(a.energyConsumption))
                .slice(0, 5)
                .map((asset, index) => (
                  <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{asset.asset}</div>
                        <div className="text-xs text-gray-600">{asset.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-700">
                          {Math.abs(asset.energyConsumption).toFixed(1)} kWh/day
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${
                          asset.efficiencyRating === 'C' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          Rating {asset.efficiencyRating}
                        </div>
                      </div>
                    </div>
                    
                    {/* Potential savings estimate */}
                    <div className="mt-2 pt-2 border-t border-orange-200">
                      <div className="text-xs text-green-700 font-semibold">
                        💡 Potential savings: {(Math.abs(asset.energyConsumption) * 0.15).toFixed(1)} kWh/day with upgrade
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'trends' && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📈 Energy Consumption Trends (30 Days)</h3>
            <span className="text-sm text-gray-600">{increasingConsumption.length} assets trending up</span>
          </div>
          
          <div className="space-y-3">
            {increasingConsumption.map((asset, index) => {
              const trendValue = parseFloat(asset.trend.replace('%', ''));
              
              return (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTrendIcon(asset.trend)}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{asset.asset}</div>
                          <div className="text-xs text-gray-500">{asset.category}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {Math.abs(asset.energyConsumption).toFixed(1)} kWh/day
                        </div>
                        <div className="text-xs text-gray-600">Current</div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getTrendColor(asset.trend)}`}>
                          {asset.trend}
                        </div>
                        <div className="text-xs text-gray-600">Change</div>
                      </div>
                      
                      {trendValue > 10 && (
                        <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                          ⚠️ Alert
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Trend explanation */}
                  {trendValue > 10 && (
                    <div className="mt-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                      ⚠️ High increase detected. Recommend inspection for efficiency issues or increased load.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredData.filter(a => parseFloat(a.trend.replace('%', '')) > 10).length}
              </div>
              <div className="text-xs text-gray-600">Critical Trends (&gt;10%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter(a => parseFloat(a.trend.replace('%', '')) < 0).length}
              </div>
              <div className="text-xs text-gray-600">Improving Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {filteredData.filter(a => parseFloat(a.trend.replace('%', '')) === 0).length}
              </div>
              <div className="text-xs text-gray-600">Stable</div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {/* Monthly Energy Consumption */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Monthly Energy Consumption (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={[
                  { month: 'Feb 25', consumption: 481.4, trend: 0.4 },
                  { month: 'Mar 25', consumption: 477.1, trend: -0.9 },
                  { month: 'Apr 25', consumption: 485.6, trend: 1.8 },
                  { month: 'May 25', consumption: 478.2, trend: -1.5 },
                  { month: 'Jun 25', consumption: 488.4, trend: 2.1 },
                  { month: 'Jul 25', consumption: 482.5, trend: -1.2 },
                  { month: 'Aug 25', consumption: 486.6, trend: 0.8 },
                  { month: 'Sep 25', consumption: 484.2, trend: -0.5 },
                  { month: 'Oct 25', consumption: 499.3, trend: 3.2 },
                  { month: 'Nov 25', consumption: 490.1, trend: -1.8 },
                  { month: 'Dec 25', consumption: 497.8, trend: 1.5 },
                  { month: 'Jan 26', consumption: 487.3, trend: -2.1 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'kWh/day', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'consumption' && value !== undefined) {
                      const trend = props.payload.trend;
                      const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
                      const trendColor = trend > 0 ? '#ef4444' : trend < 0 ? '#10b981' : '#6b7280';
                      return [
                        <span key="value">
                          {value.toFixed(1)} kWh/day <span style={{ color: trendColor }}>{trendIcon} {Math.abs(trend)}%</span>
                        </span>,
                        'Consumption'
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Bar dataKey="consumption" radius={[8, 8, 0, 0]}>
                  {[
                    { month: 'Feb 25', consumption: 481.4, trend: 0.4 },
                    { month: 'Mar 25', consumption: 477.1, trend: -0.9 },
                    { month: 'Apr 25', consumption: 485.6, trend: 1.8 },
                    { month: 'May 25', consumption: 478.2, trend: -1.5 },
                    { month: 'Jun 25', consumption: 488.4, trend: 2.1 },
                    { month: 'Jul 25', consumption: 482.5, trend: -1.2 },
                    { month: 'Aug 25', consumption: 486.6, trend: 0.8 },
                    { month: 'Sep 25', consumption: 484.2, trend: -0.5 },
                    { month: 'Oct 25', consumption: 499.3, trend: 3.2 },
                    { month: 'Nov 25', consumption: 490.1, trend: -1.8 },
                    { month: 'Dec 25', consumption: 497.8, trend: 1.5 },
                    { month: 'Jan 26', consumption: 487.3, trend: -2.1 },
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.trend > 0 ? '#f59e0b' : entry.trend < 0 ? '#10b981' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Monthly Summary Stats */}
            <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">487.3</div>
                <div className="text-xs text-gray-600">Avg kWh/day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">477.1</div>
                <div className="text-xs text-gray-600">Lowest (Mar)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">499.3</div>
                <div className="text-xs text-gray-600">Highest (Oct)</div>
              </div>
            </div>
          </div>

          {/* Daily Energy Consumption */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Daily Energy Consumption (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={[
                  { day: 1, consumption: 485, isWeekend: false },
                  { day: 2, consumption: 492, isWeekend: false },
                  { day: 3, consumption: 488, isWeekend: false },
                  { day: 4, consumption: 495, isWeekend: false },
                  { day: 5, consumption: 490, isWeekend: false },
                  { day: 6, consumption: 487, isWeekend: true },
                  { day: 7, consumption: 483, isWeekend: true },
                  { day: 8, consumption: 491, isWeekend: false },
                  { day: 9, consumption: 489, isWeekend: false },
                  { day: 10, consumption: 493, isWeekend: false },
                  { day: 11, consumption: 486, isWeekend: false },
                  { day: 12, consumption: 494, isWeekend: false },
                  { day: 13, consumption: 488, isWeekend: true },
                  { day: 14, consumption: 490, isWeekend: true },
                  { day: 15, consumption: 492, isWeekend: false },
                  { day: 16, consumption: 487, isWeekend: false },
                  { day: 17, consumption: 485, isWeekend: false },
                  { day: 18, consumption: 491, isWeekend: false },
                  { day: 19, consumption: 489, isWeekend: false },
                  { day: 20, consumption: 495, isWeekend: true },
                  { day: 21, consumption: 488, isWeekend: true },
                  { day: 22, consumption: 492, isWeekend: false },
                  { day: 23, consumption: 490, isWeekend: false },
                  { day: 24, consumption: 486, isWeekend: false },
                  { day: 25, consumption: 493, isWeekend: false },
                  { day: 26, consumption: 489, isWeekend: false },
                  { day: 27, consumption: 491, isWeekend: true },
                  { day: 28, consumption: 487, isWeekend: true },
                  { day: 29, consumption: 494, isWeekend: false },
                  { day: 30, consumption: 490, isWeekend: false },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Day', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  domain={[475, 500]}
                  label={{ value: 'kWh/day', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'consumption') {
                      const dayType = props.payload.isWeekend ? 'Weekend' : 'Weekday';
                      return [`${value} kWh/day (${dayType})`, 'Consumption'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorConsumption)"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Daily Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">489.8</div>
                <div className="text-xs text-gray-600">Avg Daily</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">483</div>
                <div className="text-xs text-gray-600">Min Daily</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">495</div>
                <div className="text-xs text-gray-600">Max Daily</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">±2.4%</div>
                <div className="text-xs text-gray-600">Variation</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Weekdays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded"></div>
                <span className="text-gray-600">Weekends</span>
              </div>
            </div>
          </div>

          {/* Peak Hours Analysis */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ Peak Demand Hours (24-Hour Cycle)</h3>
            <div className="grid grid-cols-12 gap-2">
              {[
                { hour: '12AM', demand: 45 },
                { hour: '1AM', demand: 42 },
                { hour: '2AM', demand: 40 },
                { hour: '3AM', demand: 38 },
                { hour: '4AM', demand: 41 },
                { hour: '5AM', demand: 48 },
                { hour: '6AM', demand: 65 },
                { hour: '7AM', demand: 82 },
                { hour: '8AM', demand: 95 },
                { hour: '9AM', demand: 88 },
                { hour: '10AM', demand: 85 },
                { hour: '11AM', demand: 87 },
                { hour: '12PM', demand: 92 },
                { hour: '1PM', demand: 90 },
                { hour: '2PM', demand: 93 },
                { hour: '3PM', demand: 96 },
                { hour: '4PM', demand: 100 },
                { hour: '5PM', demand: 98 },
                { hour: '6PM', demand: 88 },
                { hour: '7PM', demand: 78 },
                { hour: '8PM', demand: 70 },
                { hour: '9PM', demand: 62 },
                { hour: '10PM', demand: 55 },
                { hour: '11PM', demand: 48 },
              ].map((data, index) => {
                const isPeak = data.demand >= 90;
                
                return (
                  <div key={index} className="flex flex-col items-center group relative">
                    <div className="w-full h-24 bg-gray-100 rounded flex items-end p-1">
                      <div
                        className={`w-full rounded transition-all ${
                          isPeak ? 'bg-red-500' : data.demand >= 70 ? 'bg-orange-400' : 'bg-green-400'
                        }`}
                        style={{ height: `${data.demand}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          {data.hour}: {data.demand}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">{data.hour}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-gray-600">Low (&lt;70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span className="text-gray-600">Medium (70-90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600">Peak (≥90%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Energy by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(
            filteredData.reduce((acc, asset) => {
              const category = asset.category;
              if (!acc[category]) {
                acc[category] = { total: 0, count: 0 };
              }
              acc[category].total += Math.abs(asset.energyConsumption);
              acc[category].count += 1;
              return acc;
            }, {} as Record<string, { total: number; count: number }>)
          )
          .sort(([, a], [, b]) => b.total - a.total)
          .map(([category, data]) => (
            <div key={category} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border">
              <div className="text-xs text-gray-600 font-semibold mb-1">{category}</div>
              <div className="text-xl font-bold text-gray-900">{data.total.toFixed(1)}</div>
              <div className="text-xs text-gray-500">kWh/day ({data.count} assets)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
