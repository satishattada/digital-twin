import React from 'react';
import { Kpi } from "../types"
import { MOCK_STORE_MANAGER_KPI_DATA } from "../constants"

const TrendIndicator: React.FC<{ change: string }> = ({ change }) => {
    const isUp = change.includes('↑');
    const isDown = change.includes('↓');

    if (!isUp && !isDown) return null;

    const color = isUp ? 'text-green-500' : 'text-red-500';
    const icon = isUp ? '↑' : '↓';

    return (
        <span className={`flex items-center text-xs font-semibold ${color}`}>
            {icon} {change.replace('↑', '').replace('↓', '')}
        </span>
    );
};

const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
  const isNegative = kpi.change?.startsWith('↓');
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-between h-full relative group">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-semibold text-gray-500">{kpi.title}</h4>
        <TrendIndicator change={kpi.change || ''} />
      </div>
      <p className="text-3xl font-bold text-[#005BAC] my-1">{kpi.value}</p>
      <p className="text-xs text-gray-500">{kpi.insight}</p>
      {kpi.definition && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {kpi.definition}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export const KpiPanel: React.FC = () => {
  const kpis = MOCK_STORE_MANAGER_KPI_DATA;

  return (
    <div className="grid grid-cols-2 gap-4">
      {kpis.map(kpi => <KpiCard key={kpi.title} kpi={kpi} />)}
    </div>
  );
};