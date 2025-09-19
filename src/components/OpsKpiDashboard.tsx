import React, { useState, useMemo } from 'react';
import { Category, OpsKpi, PurchaseOrder, Supplier } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsKpiDashboardProps = {
  selectedCategory: Category;
};

const TrendIcon: React.FC<{trend: 'up' | 'down' | 'stable', value?: string}> = ({trend, value}) => {
    const iconClass = "h-4 w-4";
    if (trend === 'up') return (
        <div className="flex items-center gap-1 text-green-600">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {value && <span className="text-xs font-medium">+{value}</span>}
        </div>
    );
    if (trend === 'down') return (
        <div className="flex items-center gap-1 text-red-600">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {value && <span className="text-xs font-medium">-{value}</span>}
        </div>
    );
    return (
        <div className="flex items-center gap-1 text-gray-500">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {value && <span className="text-xs font-medium">{value}</span>}
        </div>
    );
};

const KpiCard: React.FC<{kpi: OpsKpi, isExpanded?: boolean, onToggle?: () => void}> = ({kpi, isExpanded, onToggle}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const getPerformanceStyles = (performance: string) => {
        switch (performance) {
            case 'good':
                return {
                    bg: 'bg-gradient-to-br from-green-50 to-green-100',
                    border: 'border-green-200',
                    text: 'text-green-700',
                    accent: 'bg-green-500'
                };
            case 'bad':
                return {
                    bg: 'bg-gradient-to-br from-red-50 to-red-100',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    accent: 'bg-red-500'
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
                    border: 'border-yellow-200',
                    text: 'text-yellow-700',
                    accent: 'bg-yellow-500'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                    border: 'border-gray-200',
                    text: 'text-gray-700',
                    accent: 'bg-gray-500'
                };
        }
    };

    const styles = getPerformanceStyles(kpi.performance);
    const mockTrendValue = kpi.trend === 'up' ? '12%' : kpi.trend === 'down' ? '8%' : '0%';

    return (
        <div 
            className={`${styles.bg} ${styles.border} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative group`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onToggle}
        >
            {/* Performance indicator */}
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${styles.accent}`}></div>
            
            {/* KPI Header */}
            <div className="mb-3">
                <h4 className={`text-sm font-bold ${styles.text} leading-tight`}>
                    {kpi.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                    {kpi.performance === 'good' ? '✅ On Target' :
                     kpi.performance === 'bad' ? '❌ Below Target' :
                     kpi.performance === 'neutral' ? '⚠️ Needs Attention' : '📊 Monitoring'}
                </p>
            </div>

            {/* KPI Value */}
            <div className="flex items-end justify-between mb-2">
                <div className={`text-2xl font-bold ${styles.text}`}>
                    {kpi.value}
                </div>
                <TrendIcon trend={kpi.trend} value={mockTrendValue} />
            </div>

            {/* Additional metrics */}
            <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                    <span>Target:</span>
                    <span className="font-medium">
                        {kpi.title.includes('%') ? '95%' :
                         kpi.title.includes('Time') ? '2.5d' :
                         kpi.title.includes('Cost') ? '$45K' : '850'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>vs Last Week:</span>
                    <span className={`font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' :
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {mockTrendValue}
                    </span>
                </div>
            </div>

            {/* Hover tooltip */}
            {kpi.definition && isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs text-white bg-gray-900 rounded-lg shadow-xl opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="font-semibold mb-1">📊 KPI Definition</div>
                    <div className="text-gray-300">{kpi.definition}</div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
            )}
        </div>
    );
};

const PoRow: React.FC<{po: PurchaseOrder, isExpanded?: boolean}> = ({po, isExpanded}) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Delivered':
                return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' };
            case 'In Transit':
                return { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
            case 'Pending':
                return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' };
            case 'Delayed':
                return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
            default:
                return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50' };
        }
    };

    const statusStyles = getStatusStyles(po.status);
    const mockValue = Math.floor(Math.random() * 50000) + 10000;
    const mockETA = po.status === 'In Transit' ? '2 days' 
                  : po.status === 'Pending' ? '5 days' 
                  : po.status === 'Delivered' ? 'Delivered' 
                  : po.status === 'Delayed' ? '7 days' 
                  : 'Unknown';

    return (
        <div className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${statusStyles.bg} border-gray-200`}>
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusStyles.color} animate-pulse`}></div>
                    <div>
                        <span className="font-bold text-sm text-gray-800">{po.id}</span>
                        <span className="text-xs text-gray-500 ml-2">• {po.supplierName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles.color} text-white`}>
                        {po.status}
                    </span>
                    <span className="text-xs text-gray-500">
                        {showDetails ? '▼' : '▶'}
                    </span>
                </div>
            </div>

            {showDetails && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-gray-500">Value:</span>
                            <span className="font-semibold ml-1">${mockValue.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">ETA:</span>
                            <span className="font-semibold ml-1">{mockETA}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Order Date: {new Date().toLocaleDateString()}</span>
                        <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                            📧 Track
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SupplierCard: React.FC<{supplier: Supplier}> = ({supplier}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const getScoreColor = (accuracy: number) => {
        if (accuracy >= 95) return 'text-green-600 bg-green-50 border-green-200';
        if (accuracy >= 85) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const scoreStyles = getScoreColor(supplier.fulfillmentAccuracy);

    return (
        <div className={`border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${
            supplier.underperforming 
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">
                        {supplier.underperforming ? '⚠️' : supplier.fulfillmentAccuracy >= 95 ? '⭐' : '📦'}
                    </span>
                    <h4 className="font-bold text-sm text-gray-800">{supplier.name}</h4>
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-2 rounded-md border ${scoreStyles}`}>
                    <div className="text-xs font-medium">Accuracy</div>
                    <div className="text-lg font-bold">{supplier.fulfillmentAccuracy}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                    <div className="text-xs font-medium text-gray-600">Lead Time</div>
                    <div className="text-lg font-bold text-gray-800">{supplier.leadTime}d</div>
                </div>
            </div>

            {supplier.underperforming && (
                <div className="bg-red-100 border border-red-200 rounded-md p-2 mb-3">
                    <div className="flex items-center gap-2 text-red-700">
                        <span className="text-sm">🚨</span>
                        <span className="text-xs font-semibold">Action Required</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                        Escalate to Procurement for performance review
                    </p>
                </div>
            )}

            {isExpanded && (
                <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/50 p-2 rounded border">
                            <span className="text-gray-500">Orders (30d):</span>
                            <span className="font-semibold ml-1">24</span>
                        </div>
                        <div className="bg-white/50 p-2 rounded border">
                            <span className="text-gray-500">Value:</span>
                            <span className="font-semibold ml-1">$125K</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition-colors">
                            📊 View Details
                        </button>
                        <button className="flex-1 text-xs bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors">
                            📞 Contact
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const OpsKpiDashboard: React.FC<OpsKpiDashboardProps> = ({ selectedCategory }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'po' | 'suppliers'>('overview');
    const data = MOCK_OPS_DATA[selectedCategory];

    // Calculate summary stats
    const summaryStats = useMemo(() => {
        const totalPOs = data.purchaseOrders.length;
        const deliveredPOs = data.purchaseOrders.filter(po => po.status === 'Delivered').length;
        const underperformingSuppliers = data.suppliers.filter(s => s.underperforming).length;
        const avgAccuracy = data.suppliers.reduce((acc, s) => acc + s.fulfillmentAccuracy, 0) / data.suppliers.length;
        
        return {
            deliveryRate: Math.round((deliveredPOs / totalPOs) * 100),
            underperformingSuppliers,
            avgAccuracy: Math.round(avgAccuracy),
            totalValue: Math.floor(Math.random() * 500000) + 100000
        };
    }, [data]);

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <h2 className="text-lg font-bold text-[#005BAC]">Operations KPI Dashboard</h2>
                        <p className="text-sm text-gray-600">{selectedCategory} performance metrics</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">{summaryStats.deliveryRate}%</div>
                    <div className="text-xs text-gray-500">Delivery Rate</div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-700">{summaryStats.deliveryRate}%</div>
                    <div className="text-xs text-blue-600">On-Time Delivery</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-700">{summaryStats.avgAccuracy}%</div>
                    <div className="text-xs text-green-600">Avg Accuracy</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-700">{summaryStats.underperformingSuppliers}</div>
                    <div className="text-xs text-red-600">At Risk Suppliers</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-700">${(summaryStats.totalValue/1000).toFixed(0)}K</div>
                    <div className="text-xs text-purple-600">Monthly Value</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                        activeTab === 'overview' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    📊 KPIs
                </button>
                <button 
                    onClick={() => setActiveTab('po')} 
                    className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                        activeTab === 'po' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    📦 Purchase Orders
                </button>
                <button 
                    onClick={() => setActiveTab('suppliers')} 
                    className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                        activeTab === 'suppliers' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    🏪 Suppliers
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto space-y-3">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 gap-3">
                        {data.kpis.map((kpi, index) => 
                            <KpiCard key={kpi.title} kpi={kpi} />
                        )}
                    </div>
                )}

                {activeTab === 'po' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700">📦 Purchase Order Tracker</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {data.purchaseOrders.length} orders
                            </span>
                        </div>
                        <div className="space-y-2">
                            {data.purchaseOrders.map(po => <PoRow key={po.id} po={po} />)}
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                                <span className="text-sm">💡</span>
                                <span className="text-sm font-semibold">Quick Actions</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                                    📈 Create Report
                                </button>
                                <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors">
                                    📧 Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'suppliers' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700">🏪 Supplier Performance</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {data.suppliers.length} suppliers
                            </span>
                        </div>
                        <div className="space-y-3">
                            {data.suppliers.map(supplier => 
                                <SupplierCard key={supplier.name} supplier={supplier} />
                            )}
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <span className="text-sm">🎯</span>
                                <span className="text-sm font-semibold">Performance Insights</span>
                            </div>
                            <p className="text-xs text-green-600">
                                {summaryStats.underperformingSuppliers > 0 
                                    ? `${summaryStats.underperformingSuppliers} supplier(s) need attention. Consider reviewing contracts.`
                                    : 'All suppliers are performing within acceptable ranges.'
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};