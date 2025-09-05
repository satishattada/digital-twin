import React from 'react';
import { Category, OpsKpi, PurchaseOrder, Supplier } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsKpiDashboardProps = {
  selectedCategory: Category;
};

const TrendIcon: React.FC<{trend: 'up' | 'down' | 'stable'}> = ({trend}) => {
    if (trend === 'up') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>;
    if (trend === 'down') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.293-8.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 10.586V7a1 1 0 102 0v3.586l1.293-1.293a1 1 0 00-1.414-1.414z" clipRule="evenodd" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 4a1 1 0 100 2h.01a1 1 0 100-2H10z" clipRule="evenodd" /></svg>
}

const KpiCard: React.FC<{kpi: OpsKpi}> = ({kpi}) => {
    const color = kpi.performance === 'good' ? 'text-green-600' : kpi.performance === 'bad' ? 'text-red-600' : 'text-gray-500';
    return (
        <div className="bg-white p-2 rounded-md shadow-sm border relative group">
            <h4 className="text-sm font-semibold text-gray-600 truncate">{kpi.title}</h4>
            <div className={`flex items-center space-x-2 ${color}`}>
                <p className="text-xl font-bold">{kpi.value}</p>
                <TrendIcon trend={kpi.trend}/>
            </div>
            {kpi.definition && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {kpi.definition}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
            )}
        </div>
    )
}

const PoRow: React.FC<{po: PurchaseOrder}> = ({po}) => {
    const statusColor = po.status === 'Delivered' ? 'bg-green-500' : po.status === 'In Transit' ? 'bg-amber-500' : 'bg-blue-500';
    return (
        <div className="flex justify-between items-center text-sm text-gray-600 py-1 border-b last:border-0">
            <span>{po.id} <span className="text-gray-400">({po.supplierName})</span></span>
            <span className="flex items-center space-x-2 font-semibold">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
                <span>{po.status}</span>
            </span>
        </div>
    )
}

const SupplierCard: React.FC<{supplier: Supplier}> = ({supplier}) => (
    <div className={`p-2 rounded-md ${supplier.underperforming ? 'bg-red-100 border border-red-300' : 'bg-white border'}`}>
        <p className="font-bold text-sm text-gray-800">{supplier.name}</p>
        <p className="text-sm text-gray-600">Accuracy: <span className="font-semibold">{supplier.fulfillmentAccuracy}%</span> | Lead Time: <span className="font-semibold">{supplier.leadTime}d</span></p>
        {supplier.underperforming && <p className="text-red-600 font-semibold mt-1">Recommendation: Escalate to Procurement.</p>}
    </div>
)

export const OpsKpiDashboard: React.FC<OpsKpiDashboardProps> = ({ selectedCategory }) => {
  const data = MOCK_OPS_DATA[selectedCategory];

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-md font-bold text-[#005BAC] mb-2 shrink-0">KPI Dashboard</h2>
        <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                {data.kpis.map(kpi => <KpiCard key={kpi.title} kpi={kpi} />)}
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-600 mb-1">PO Tracker</h3>
                <div className="bg-white p-2 rounded-md border space-y-1">
                    {data.purchaseOrders.map(po => <PoRow key={po.id} po={po}/>)}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-600 mb-1">Supplier Scorecard</h3>
                 <div className="space-y-2">
                    {data.suppliers.map(s => <SupplierCard key={s.name} supplier={s} />)}
                </div>
            </div>
        </div>
    </div>
  );
};