import React from 'react';
import { Kpi } from "../types"
import { MOCK_STORE_MANAGER_KPI_DATA } from "../constants"

const TrendIndicator: React.FC<{ change: string }> = ({ change }) => {
    const isUp = change.includes('↑');
    const isDown = change.includes('↓');

    if (!isUp && !isDown) return null;

    const color = isUp ? 'text-green-600' : 'text-red-500';
    const bgColor = isUp ? 'bg-green-50' : 'bg-red-50';
    const icon = isUp ? '📈' : '📉';

    return (
        <span className={`flex items-center text-xs font-semibold ${color} ${bgColor} px-2 py-1 rounded-full`}>
            {icon} {change.replace('↑', '').replace('↓', '')}
        </span>
    );
};

const getKpiIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('revenue') || titleLower.includes('sales')) return '💰';
    if (titleLower.includes('customer') || titleLower.includes('satisfaction')) return '😊';
    if (titleLower.includes('inventory') || titleLower.includes('stock')) return '📦';
    if (titleLower.includes('efficiency') || titleLower.includes('performance')) return '⚡';
    if (titleLower.includes('profit') || titleLower.includes('margin')) return '📊';
    if (titleLower.includes('foot') || titleLower.includes('traffic')) return '👥';
    return '📈'; // Default
};

const getKpiGradient = (value: string, isPositive: boolean) => {
    if (isPositive) {
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200';
    }
    return 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200';
};

const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
    const isPositiveTrend = kpi.change?.includes('↑');
    const isNegativeTrend = kpi.change?.includes('↓');
    const kpiIcon = getKpiIcon(kpi.title);
    const cardGradient = getKpiGradient(kpi.value, isPositiveTrend || false);

    return (
        <div className={`border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative group ${cardGradient}`}>
            {/* Header with icon and trend */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{kpiIcon}</span>
                    <h4 className="text-sm font-bold text-gray-700">{kpi.title}</h4>
                </div>
                <TrendIndicator change={kpi.change || ''} />
            </div>

            {/* Main KPI Value */}
           <div className="mb-3">
                <p className="text-4xl font-bold text-[#005BAC] leading-tight blink-live-data">{kpi.value}</p>
                {kpi.change && (
                    <p className="text-sm text-gray-600 mt-1">
                        vs last period: <span className={`blink-slow ${isPositiveTrend ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</span>
                    </p>
                )}
            </div>


            {/* Insight */}
            <div className="mt-auto">
                <p className="text-sm text-gray-600 font-medium">{kpi.insight}</p>
                
                {/* Progress bar for visual appeal */}
                <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${isPositiveTrend ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: isPositiveTrend ? '85%' : '65%' }}
                    ></div>
                </div>
            </div>

            {/* Enhanced Tooltip */}
            {kpi.definition && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 text-sm text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{kpiIcon}</span>
                        <span className="font-bold">KPI Definition</span>
                    </div>
                    <p className="leading-relaxed">{kpi.definition}</p>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-4 h-4 bg-slate-800 rotate-45"></div>
                </div>
            )}

            {/* Status indicator dot */}
            <div className={`absolute indicator-dot w-3 h-3 rounded-full ${isPositiveTrend ? 'bg-green-400' : isNegativeTrend ? 'bg-red-400' : 'bg-blue-400'}`}></div>
        </div>
    );
};

export const KpiPanel: React.FC = () => {
    const kpis = MOCK_STORE_MANAGER_KPI_DATA;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">📊 Store Performance Dashboard</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Last updated: {new Date().toLocaleTimeString()}
                </span>
            </div>
            
            {/* KPI Grid */}
            <div className="grid grid-cols-2 gap-6">
                {kpis.map(kpi => <KpiCard key={kpi.title} kpi={kpi} />)}
            </div>
        </div>
    );
};