import React, { useState } from 'react';

export type ShrinkageCategory = 'theft' | 'admin_error' | 'supplier_error' | 'damage' | 'unknown';

export interface ShrinkageData {
  category: ShrinkageCategory;
  amount: number;
  percentage: number;
  trend: '+' | '-' | '=';
  trendValue: number;
}

export interface StoreShrinkageData {
  storeId: string;
  storeName: string;
  totalShrinkage: number;
  shrinkageRate: number;
  period: string;
  categories: ShrinkageData[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastIncident?: {
    date: string;
    type: ShrinkageCategory;
    amount: number;
  };
}

// Mock data for demonstration
const mockShrinkageData: StoreShrinkageData[] = [
  {
    storeId: '001',
    storeName: 'Kempton Park',
    totalShrinkage: 3450,
    shrinkageRate: 1.2,
    period: 'Last 30 Days',
    riskLevel: 'low',
    categories: [
      { category: 'theft', amount: 1850, percentage: 53.6, trend: '-', trendValue: 8.2 },
      { category: 'admin_error', amount: 750, percentage: 21.7, trend: '+', trendValue: 12.5 },
      { category: 'damage', amount: 520, percentage: 15.1, trend: '=', trendValue: 0 },
      { category: 'supplier_error', amount: 330, percentage: 9.6, trend: '-', trendValue: 5.1 },
    ],
    lastIncident: {
      date: '2025-09-20',
      type: 'theft',
      amount: 125
    }
  },
  {
    storeId: '002',
    storeName: 'Hatton Cross',
    totalShrinkage: 4250,
    shrinkageRate: 1.8,
    period: 'Last 30 Days',
    riskLevel: 'medium',
    categories: [
      { category: 'theft', amount: 2380, percentage: 56.0, trend: '+', trendValue: 15.3 },
      { category: 'admin_error', amount: 850, percentage: 20.0, trend: '+', trendValue: 8.7 },
      { category: 'damage', amount: 680, percentage: 16.0, trend: '=', trendValue: 0 },
      { category: 'supplier_error', amount: 340, percentage: 8.0, trend: '-', trendValue: 3.2 },
    ],
    lastIncident: {
      date: '2025-09-21',
      type: 'theft',
      amount: 89
    }
  },
  {
    storeId: '003',
    storeName: 'Ashford SF',
    totalShrinkage: 5890,
    shrinkageRate: 2.4,
    period: 'Last 30 Days',
    riskLevel: 'high',
    categories: [
      { category: 'theft', amount: 3534, percentage: 60.0, trend: '+', trendValue: 22.1 },
      { category: 'admin_error', amount: 1178, percentage: 20.0, trend: '+', trendValue: 18.5 },
      { category: 'damage', amount: 767, percentage: 13.0, trend: '+', trendValue: 11.2 },
      { category: 'supplier_error', amount: 411, percentage: 7.0, trend: '=', trendValue: 0 },
    ],
    lastIncident: {
      date: '2025-09-22',
      type: 'theft',
      amount: 156
    }
  }
];

const getCategoryIcon = (category: ShrinkageCategory) => {
  switch (category) {
    case 'theft':
      return '🔒';
    case 'admin_error':
      return '📝';
    case 'supplier_error':
      return '🚚';
    case 'damage':
      return '📦';
    default:
      return '❓';
  }
};

const getCategoryLabel = (category: ShrinkageCategory) => {
  switch (category) {
    case 'theft':
      return 'Theft/Security';
    case 'admin_error':
      return 'Admin Error';
    case 'supplier_error':
      return 'Supplier Error';
    case 'damage':
      return 'Damage/Spoilage';
    default:
      return 'Unknown';
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTrendIcon = (trend: '+' | '-' | '=') => {
  switch (trend) {
    case '+':
      return <span className="text-red-500">↗️</span>;
    case '-':
      return <span className="text-green-500">↘️</span>;
    case '=':
      return <span className="text-gray-500">➡️</span>;
  }
};

interface RetailShrinkageWidgetProps {
  selectedStore?: string;
}

export const RetailShrinkageWidget: React.FC<RetailShrinkageWidgetProps> = ({ 
  selectedStore = 'All Stores' 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'breakdown' | 'trends'>('overview');
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  // Calculate regional totals
  const regionalTotals = mockShrinkageData.reduce(
    (acc, store) => ({
      totalShrinkage: acc.totalShrinkage + store.totalShrinkage,
      avgShrinkageRate: (acc.avgShrinkageRate + store.shrinkageRate) / 2,
      storeCount: acc.storeCount + 1
    }),
    { totalShrinkage: 0, avgShrinkageRate: 0, storeCount: 0 }
  );

  const filteredData = selectedStore === 'All Stores' 
    ? mockShrinkageData 
    : mockShrinkageData.filter(store => store.storeName === selectedStore);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Retail Shrinkage Monitor</h2>
            <p className="text-sm text-gray-600">Loss prevention & inventory integrity</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['overview', 'breakdown', 'trends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <div className="text-xs text-red-600 font-medium mb-1">Total Shrinkage</div>
              <div className="text-lg font-bold text-red-700">
                £{selectedStore === 'All Stores' ? regionalTotals.totalShrinkage.toLocaleString() : filteredData[0]?.totalShrinkage.toLocaleString()}
              </div>
              <div className="text-xs text-red-600 mt-1">Last 30 days</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <div className="text-xs text-orange-600 font-medium mb-1">Shrinkage Rate</div>
              <div className="text-lg font-bold text-orange-700">
                {selectedStore === 'All Stores' 
                  ? `${regionalTotals.avgShrinkageRate.toFixed(1)}%` 
                  : `${filteredData[0]?.shrinkageRate}%`}
              </div>
              <div className="text-xs text-orange-600 mt-1">Of total sales</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-blue-600 font-medium mb-1">Risk Assessment</div>
              <div className="flex items-center gap-2 mt-1">
                {filteredData.map((store, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full border ${getRiskLevelColor(store.riskLevel)}`}
                  >
                    {store.riskLevel.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Store Cards */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-2">Store Performance</div>
            {filteredData.map((store) => (
              <div key={store.storeId} className="bg-gray-50 rounded-lg border">
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedStore(expandedStore === store.storeId ? null : store.storeId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${
                        store.riskLevel === 'low' ? 'bg-green-500' :
                        store.riskLevel === 'medium' ? 'bg-yellow-500' :
                        store.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></span>
                      <div>
                        <div className="font-medium text-gray-800">{store.storeName}</div>
                        <div className="text-xs text-gray-600">£{store.totalShrinkage.toLocaleString()} loss</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">{store.shrinkageRate}%</div>
                      <div className="text-xs text-gray-500">shrinkage rate</div>
                    </div>
                  </div>
                  
                  {store.lastIncident && (
                    <div className="mt-2 text-xs text-gray-600 bg-white rounded p-2">
                      <span className="font-medium">Last incident:</span> {getCategoryIcon(store.lastIncident.type)} 
                      £{store.lastIncident.amount} on {new Date(store.lastIncident.date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedStore === store.storeId && (
                  <div className="border-t bg-white p-3">
                    <div className="grid grid-cols-2 gap-4">
                      {store.categories.map((cat) => (
                        <div key={cat.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{getCategoryIcon(cat.category)}</span>
                            <span className="text-xs text-gray-700">{getCategoryLabel(cat.category)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-800">£{cat.amount}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              {getTrendIcon(cat.trend)} {cat.trendValue}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown Tab */}
      {selectedTab === 'breakdown' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Shrinkage by Category</div>
          
          {filteredData.map((store) => (
            <div key={store.storeId} className="bg-gray-50 rounded-lg p-3 border">
              <div className="font-medium text-gray-800 mb-3">{store.storeName}</div>
              <div className="space-y-2">
                {store.categories.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>{getCategoryIcon(cat.category)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{getCategoryLabel(cat.category)}</div>
                        <div className="text-xs text-gray-600">{cat.percentage.toFixed(1)}% of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">£{cat.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {getTrendIcon(cat.trend)} {cat.trendValue}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trends Tab */}
      {selectedTab === 'trends' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Trend Analysis</div>
          
          {/* Alerts & Recommendations */}
          <div className="space-y-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <div>
                  <div className="font-medium text-red-800">High Risk Alert</div>
                  <div className="text-sm text-red-700 mt-1">
                    Ashford SF showing 22.1% increase in theft incidents. Consider security audit.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 mt-0.5">📊</span>
                <div>
                  <div className="font-medium text-yellow-800">Trend Alert</div>
                  <div className="text-sm text-yellow-700 mt-1">
                    Administrative errors increasing across 2 stores. Staff training recommended.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✅</span>
                <div>
                  <div className="font-medium text-green-800">Positive Trend</div>
                  <div className="text-sm text-green-700 mt-1">
                    Kempton Park showing 8.2% reduction in theft. Share best practices with other stores.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Items */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="font-medium text-blue-800 mb-2">Recommended Actions</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Schedule security assessment for high-risk stores</li>
              <li>• Implement additional staff training on inventory procedures</li>
              <li>• Review supplier delivery processes to reduce errors</li>
              <li>• Consider enhanced surveillance systems for problem areas</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailShrinkageWidget;