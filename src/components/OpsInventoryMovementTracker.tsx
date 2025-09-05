import React, { useState, useMemo } from 'react';
import { Category, InventoryMovementEvent } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsInventoryMovementTrackerProps = {
  selectedCategory: Category;
  selectedTimePeriod: string;
};

const MovementChart: React.FC<{
    productName: string;
    data: { value: number; day: number }[];
    events: InventoryMovementEvent[];
    color: string;
}> = ({ productName, data, events, color }) => {
    const svgBaseWidth = 260;
    const svgBaseHeight = 120;
    const margin = { top: 5, right: 10, bottom: 20, left: 30 };
    const width = svgBaseWidth - margin.left - margin.right;
    const height = svgBaseHeight - margin.top - margin.bottom;

    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; day: number; event?: string } | null>(null);

    if (data.length === 0) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <p className="text-sm text-gray-500">No data for this period.</p>
            </div>
        );
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const yAxisMax = Math.ceil(maxValue / 10) * 10 || 10;

    const dayDomain = [Math.min(...data.map(d => d.day)), Math.max(...data.map(d => d.day))];
    const dayCount = data.length;

    const xScale = (day: number) => {
        if (dayCount <= 1) return width / 2;
        const maxDay = dayDomain[1];
        const minDay = dayDomain[0];
        if (maxDay === minDay) return width / 2;
        return ((day - minDay) / (maxDay - minDay)) * width;
    };
    
    const yScale = (value: number) => height - ((value / yAxisMax) * height);

    const linePath = data.length > 1 
        ? "M" + data.map(d => `${xScale(d.day)},${yScale(d.value)}`).join(' L ')
        : `M${xScale(data[0].day)},${yScale(data[0].value)} h0`;

    const pointColor = color.replace('bg-', 'fill-');

    return (
        <div className="relative w-full flex-grow flex flex-col">
            <svg viewBox={`0 0 ${svgBaseWidth} ${svgBaseHeight}`} onMouseLeave={() => setHoveredPoint(null)} className="w-full h-auto">
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Y-Axis */}
                    <line x1="0" y1="0" x2="0" y2={height} className="stroke-gray-300" />
                    <text x="-5" y={yScale(yAxisMax) + 3} textAnchor="end" className="text-[9px] fill-gray-500">{yAxisMax}</text>
                    <text x="-5" y={yScale(0) + 3} textAnchor="end" className="text-[9px] fill-gray-500">0</text>
                    
                    {/* X-Axis */}
                    <line x1="0" y1={height} x2={width} y2={height} className="stroke-gray-300" />
                    <text x={xScale(dayDomain[0])} y={height + 15} textAnchor="middle" className="text-[9px] fill-gray-500">Day {dayDomain[0]}</text>
                    {dayCount > 1 && <text x={xScale(dayDomain[1])} y={height + 15} textAnchor="middle" className="text-[9px] fill-gray-500">Day {dayDomain[1]}</text>}

                    <path d={linePath} className={`stroke-current ${color.replace('bg-', 'text-')}`} fill="none" strokeWidth="2" />
                    
                    {data.map(item => {
                        const event = events.find(e => e.day === item.day);
                        return (
                            <g key={item.day} transform={`translate(${xScale(item.day)}, ${yScale(item.value)})`}>
                                <circle r="3.5" className={pointColor} />
                                <circle r="8" className="fill-transparent cursor-pointer" onMouseEnter={() => setHoveredPoint({ x: (xScale(item.day)+margin.left)/svgBaseWidth*100, y: (yScale(item.value)+margin.top)/svgBaseHeight*100, ...item, event: event?.description })} />
                            </g>
                        )
                    })}
                </g>
            </svg>
            
            {hoveredPoint && (
                <div className="absolute p-1.5 px-2 text-xs bg-gray-900 bg-opacity-80 text-white rounded-md shadow-lg pointer-events-none transform -translate-x-1/2" style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%`, marginTop: '-12px' }}>
                    <p className="font-bold">Day {hoveredPoint.day}: {hoveredPoint.value} units</p>
                    {hoveredPoint.event && <p className="mt-1 text-yellow-300">{hoveredPoint.event}</p>}
                </div>
            )}
        </div>
    );
};

const getProcessedData = (allData: number[], period: string): { value: number, day: number }[] => {
    switch (period) {
        case 'Last 24 Hours':
            if (allData.length === 0) return [];
            const lastDayIndex = allData.length - 1;
            return [{ value: allData[lastDayIndex], day: lastDayIndex + 1 }];
        case 'Last 30 Days':
            const generated = [...allData];
            for (let i = allData.length; i < 30; i++) {
                const baseValue = generated[i - 1] || generated[0] || 50;
                const variation = (Math.random() - 0.45) * baseValue * 0.2;
                generated.push(Math.max(0, Math.round(baseValue + variation)));
            }
            return generated.slice(0, 30).map((value, index) => ({ value, day: index + 1 }));
        case 'Last 7 Days':
        default:
            return allData.map((value, index) => ({ value, day: index + 1 }));
    }
};

const TrendArrow: React.FC<{data: {value: number}[]}> = ({ data }) => {
    if (data.length < 2) return null;
    const trend = data[data.length - 1].value - data[0].value;
    if (trend > 0) return <span className="text-green-500" title="Trending Up">↑</span>;
    if (trend < 0) return <span className="text-red-500" title="Trending Down">↓</span>;
    return <span className="text-gray-400" title="Stable">-</span>
}

export const OpsInventoryMovementTracker: React.FC<OpsInventoryMovementTrackerProps> = ({ selectedCategory, selectedTimePeriod }) => {
  const rawData = MOCK_OPS_DATA[selectedCategory].inventoryMovement;
  const [activeTab, setActiveTab] = useState<'Top' | 'Slow'>('Top');

  const processedFastMoverData = useMemo(() => getProcessedData(rawData.fastMovers.data, selectedTimePeriod), [rawData.fastMovers.data, selectedTimePeriod]);
  const processedSlowMoverData = useMemo(() => getProcessedData(rawData.slowMovers.data, selectedTimePeriod), [rawData.slowMovers.data, selectedTimePeriod]);

  const activeChartData = activeTab === 'Top' ? processedFastMoverData : processedSlowMoverData;
  const activeProductName = activeTab === 'Top' ? rawData.fastMovers.name : rawData.slowMovers.name;
  const activeColor = activeTab === 'Top' ? 'bg-green-500' : 'bg-amber-500';
  const activeEvents = activeTab === 'Top' ? rawData.fastMoverEvents || [] : rawData.slowMoverEvents || [];
  const avgSales = activeChartData.length > 0 ? activeChartData.reduce((a, b) => a + b.value, 0) / activeChartData.length : 0;
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-md font-bold text-[#005BAC] mb-1 shrink-0">Inventory Movement Tracker</h2>
      <div className="flex border-b border-gray-200 shrink-0">
          <button onClick={() => setActiveTab('Top')} className={`px-3 py-1 text-sm font-semibold ${activeTab === 'Top' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Top Movers</button>
          <button onClick={() => setActiveTab('Slow')} className={`px-3 py-1 text-sm font-semibold ${activeTab === 'Slow' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Slow Movers</button>
      </div>
      <div className="flex-grow flex flex-col pt-2 min-h-0">
        <div className="shrink-0">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">{activeProductName} <TrendArrow data={activeChartData} /></p>
            <p className="text-xs text-gray-500">Avg. Daily Sales: {avgSales.toFixed(1)} units</p>
        </div>
        <MovementChart
          productName={activeProductName}
          data={activeChartData}
          events={activeEvents}
          color={activeColor}
        />
      </div>
    </div>
  );
};