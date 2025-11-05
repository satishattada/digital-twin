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
    chartType: 'Top' | 'Slow';
}> = ({ productName, data, events, color, chartType }) => {
    const svgBaseWidth = 280;
    const svgBaseHeight = 140;
    const margin = { top: 10, right: 15, bottom: 25, left: 35 };
    const width = svgBaseWidth - margin.left - margin.right;
    const height = svgBaseHeight - margin.top - margin.bottom;

    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; day: number; event?: string } | null>(null);

    if (data.length === 0) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2">📊</span>
                <p className="text-sm text-gray-500 font-medium">No movement data available</p>
                <p className="text-xs text-gray-400">Check back later for updates</p>
            </div>
        );
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const minValue = Math.min(...data.map(d => d.value), 0);
    const yAxisMax = Math.ceil(maxValue / 10) * 10 || 10;
    const yAxisMin = Math.floor(minValue / 10) * 10;

    const dayDomain = [Math.min(...data.map(d => d.day)), Math.max(...data.map(d => d.day))];
    const dayCount = data.length;

    const xScale = (day: number) => {
        if (dayCount <= 1) return width / 2;
        const maxDay = dayDomain[1];
        const minDay = dayDomain[0];
        if (maxDay === minDay) return width / 2;
        return ((day - minDay) / (maxDay - minDay)) * width;
    };
    
    const yScale = (value: number) => height - (((value - yAxisMin) / (yAxisMax - yAxisMin)) * height);

    // Create area path for filled chart
    const areaPath = data.length > 1 
        ? `M${xScale(data[0].day)},${height} L` + 
          data.map(d => `${xScale(d.day)},${yScale(d.value)}`).join(' L ') +
          ` L${xScale(data[data.length - 1].day)},${height} Z`
        : '';

    const linePath = data.length > 1 
        ? "M" + data.map(d => `${xScale(d.day)},${yScale(d.value)}`).join(' L ')
        : `M${xScale(data[0].day)},${yScale(data[0].value)} h0`;

    return (
        <div className="relative w-full flex-grow flex flex-col bg-white rounded-lg border border-gray-200 p-3">
            <svg viewBox={`0 0 ${svgBaseWidth} ${svgBaseHeight}`} onMouseLeave={() => setHoveredPoint(null)} className="w-full h-auto">
                <defs>
                    <linearGradient id={`gradient-${chartType}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color.replace('bg-', '')} stopOpacity="0.3"/>
                        <stop offset="100%" stopColor={color.replace('bg-', '')} stopOpacity="0.05"/>
                    </linearGradient>
                </defs>
                
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                        <line 
                            key={ratio}
                            x1="0" 
                            y1={height * ratio} 
                            x2={width} 
                            y2={height * ratio} 
                            className="stroke-gray-100" 
                            strokeDasharray="2,2"
                        />
                    ))}
                    
                    {/* Y-Axis */}
                    <line x1="0" y1="0" x2="0" y2={height} className="stroke-gray-300" strokeWidth="1"/>
                    <text x="-8" y={yScale(yAxisMax) + 4} textAnchor="end" className="text-[10px] fill-gray-600 font-medium">{yAxisMax}</text>
                    <text x="-8" y={yScale(yAxisMax/2) + 4} textAnchor="end" className="text-[10px] fill-gray-500">{Math.round(yAxisMax/2)}</text>
                    <text x="-8" y={yScale(yAxisMin) + 4} textAnchor="end" className="text-[10px] fill-gray-600 font-medium">{yAxisMin}</text>
                    
                    {/* X-Axis */}
                    <line x1="0" y1={height} x2={width} y2={height} className="stroke-gray-300" strokeWidth="1"/>
                    <text x={xScale(dayDomain[0])} y={height + 18} textAnchor="middle" className="text-[10px] fill-gray-600 font-medium">Day {dayDomain[0]}</text>
                    {dayCount > 1 && <text x={xScale(dayDomain[1])} y={height + 18} textAnchor="middle" className="text-[10px] fill-gray-600 font-medium">Day {dayDomain[1]}</text>}

                    {/* Area fill */}
                    {areaPath && (
                        <path 
                            d={areaPath} 
                            fill={`url(#gradient-${chartType})`}
                            className="opacity-60"
                        />
                    )}

                    {/* Line */}
                    <path 
                        d={linePath} 
                        className={`stroke-current ${color.replace('bg-', 'text-')}`} 
                        fill="none" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {data.map(item => {
                        const event = events.find(e => e.day === item.day);
                        const hasEvent = !!event;
                        return (
                            <g key={item.day} transform={`translate(${xScale(item.day)}, ${yScale(item.value)})`}>
                                {hasEvent && (
                                    <circle 
                                        r="8" 
                                        className="fill-yellow-300 stroke-yellow-500" 
                                        strokeWidth="2"
                                        opacity="0.8"
                                    />
                                )}
                                <circle 
                                    r={hasEvent ? "5" : "4"} 
                                    className={`${color.replace('bg-', 'fill-')} stroke-white`}
                                    strokeWidth="2"
                                />
                                <circle 
                                    r="12" 
                                    className="fill-transparent cursor-pointer hover:fill-gray-200 hover:fill-opacity-30" 
                                    onMouseEnter={() => setHoveredPoint({ 
                                        x: (xScale(item.day)+margin.left)/svgBaseWidth*100, 
                                        y: (yScale(item.value)+margin.top)/svgBaseHeight*100, 
                                        ...item, 
                                        event: event?.description 
                                    })} 
                                />
                            </g>
                        )
                    })}

                    {/* Event markers */}
                    {events.map(event => {
                        const dataPoint = data.find(d => d.day === event.day);
                        if (!dataPoint) return null;
                        return (
                            <g key={event.day} transform={`translate(${xScale(event.day)}, ${yScale(dataPoint.value) - 20})`}>
                                <text className="text-[10px] fill-orange-600 font-bold" textAnchor="middle">⚡</text>
                            </g>
                        );
                    })}
                </g>
            </svg>
            
            {hoveredPoint && (
                <div className="absolute p-2 px-3 text-xs bg-gray-900 text-white rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 z-10" 
                     style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%`, marginTop: '-15px' }}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <span>📅 Day {hoveredPoint.day}</span>
                        <span className="text-green-300">{hoveredPoint.value} units</span>
                    </div>
                    {hoveredPoint.event && (
                        <div className="text-yellow-300 text-xs border-t border-gray-700 pt-1">
                            ⚡ {hoveredPoint.event}
                        </div>
                    )}
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

const TrendIndicator: React.FC<{data: {value: number}[], label: string}> = ({ data, label }) => {
    if (data.length < 2) return null;
    
    const trend = data[data.length - 1].value - data[0].value;
    const percentage = data[0].value !== 0 ? ((trend / data[0].value) * 100).toFixed(1) : '0.0';
    
    if (trend > 0) {
        return (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <span className="text-sm">📈</span>
                <span className="text-xs font-bold">+{percentage}%</span>
            </div>
        );
    }
    if (trend < 0) {
        return (
            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <span className="text-sm">📉</span>
                <span className="text-xs font-bold">{percentage}%</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            <span className="text-sm">➡️</span>
            <span className="text-xs font-bold">Stable</span>
        </div>
    );
};

const MetricCard: React.FC<{
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: string;
}> = ({ title, value, subtitle, icon, color }) => (
    <div className={`${color} rounded-lg p-3 border-l-4 border-opacity-50`}>
        <div className="flex items-center justify-between mb-1">
            <span className="text-lg">{icon}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
        <div className="text-xs font-medium opacity-80">{title}</div>
        <div className="text-xs opacity-60">{subtitle}</div>
    </div>
);

export const OpsInventoryMovementTracker: React.FC<OpsInventoryMovementTrackerProps> = ({ 
    selectedCategory, 
    selectedTimePeriod 
}) => {
    // Fix: Access data from correct structure in MOCK_OPS_DATA
    const opsData = MOCK_OPS_DATA[selectedCategory];
    const rawData = opsData && opsData?.inventoryMovement ? opsData?.inventoryMovement : {
        fastMovers: { name: "No Data", data: [] },
        slowMovers: { name: "No Data", data: [] },
        anomaly: null,
        aiInsight: "No data available for this category",
        fastMoverEvents: [],
        slowMoverEvents: []
    };

    const [activeTab, setActiveTab] = useState<'Top' | 'Slow'>('Top');

    const processedFastMoverData = useMemo(() => 
        getProcessedData(rawData.fastMovers?.data || [], selectedTimePeriod), 
        [rawData.fastMovers?.data, selectedTimePeriod]
    );
    const processedSlowMoverData = useMemo(() => 
        getProcessedData(rawData.slowMovers?.data || [], selectedTimePeriod), 
        [rawData.slowMovers?.data, selectedTimePeriod]
    );

    const activeChartData = activeTab === 'Top' ? processedFastMoverData : processedSlowMoverData;
    const activeProductName = activeTab === 'Top' ? (rawData.fastMovers?.name || "Unknown Product") : (rawData.slowMovers?.name || "Unknown Product");
    const activeColor = activeTab === 'Top' ? 'bg-green-500' : 'bg-amber-500';
    const activeEvents = activeTab === 'Top' ? (rawData.fastMoverEvents || []) : (rawData.slowMoverEvents || []);
    
    const avgSales = activeChartData.length > 0 
        ? activeChartData.reduce((a, b) => a + b.value, 0) / activeChartData.length 
        : 0;
    
    const totalSales = activeChartData.reduce((a, b) => a + b.value, 0);
    const peakDay = activeChartData.length > 0 ? activeChartData.reduce((max, current) => 
        current.value > max.value ? current : max, 
        { value: 0, day: 0 }
    ) : { value: 0, day: 0 };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <h2 className="text-lg font-bold text-[#005BAC]">Inventory Movement Tracker</h2>
                        <p className="text-sm text-gray-600">{selectedCategory} • {selectedTimePeriod}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">{totalSales}</div>
                    <div className="text-xs text-gray-500">Total Units Moved</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
                <MetricCard
                    title="Average Daily"
                    value={avgSales.toFixed(0)}
                    subtitle="units per day"
                    icon="📈"
                    color="bg-blue-50 border-blue-300 text-blue-800"
                />
                <MetricCard
                    title="Peak Sales Day"
                    value={peakDay.day > 0 ? `Day ${peakDay.day}` : "N/A"}
                    subtitle={peakDay.value > 0 ? `${peakDay.value} units` : "No data"}
                    icon="🏆"
                    color="bg-green-50 border-green-300 text-green-800"
                />
                <MetricCard
                    title="Active Events"
                    value={activeEvents.length.toString()}
                    subtitle="this period"
                    icon="⚡"
                    color="bg-orange-50 border-orange-300 text-orange-800"
                />
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => setActiveTab('Top')} 
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                            activeTab === 'Top' 
                                ? 'bg-white text-green-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        🚀 Top Movers
                    </button>
                    <button 
                        onClick={() => setActiveTab('Slow')} 
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                            activeTab === 'Slow' 
                                ? 'bg-white text-amber-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        🐌 Slow Movers
                    </button>
                </div>
                
                <TrendIndicator data={activeChartData} label={activeTab} />
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {activeTab === 'Top' ? '🥇' : '🔄'} {activeProductName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Category leader in {selectedCategory.toLowerCase()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{avgSales.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">Avg Daily Units</div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-grow min-h-0">
                <MovementChart
                    productName={activeProductName}
                    data={activeChartData}
                    events={activeEvents}
                    color={activeColor}
                    chartType={activeTab}
                />
            </div>

            {/* Events Summary */}
            {activeEvents.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-yellow-800 mb-2">⚡ Recent Events</h4>
                    <div className="space-y-1">
                        {activeEvents.slice(0, 2).map((event, index) => (
                            <div key={index} className="text-xs text-yellow-700">
                                <span className="font-medium">Day {event.day}:</span> {event.description}
                            </div>
                        ))}
                        {activeEvents.length > 2 && (
                            <div className="text-xs text-yellow-600">
                                +{activeEvents.length - 2} more events
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Insight */}
            {rawData.aiInsight && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">🤖 AI Insight</h4>
                    <p className="text-xs text-blue-700">{rawData.aiInsight}</p>
                </div>
            )}
        </div>
    );
};