import React, { useState } from 'react';
import { Category, Recommendation, Task, OpsInsight, OpsAlert } from '../types';
import MapInterface from './MapInterface';
import { RetailShrinkageWidget } from './RetailShrinkageWidget';
import { ChatInterface } from './ChatInterface';

type RegionalManagerDashboardProps = {
  selectedStore: string;
  selectedCategory: Category;
  selectedTimePeriod: string;
  tasks: Task[];
  recommendations: Recommendation[];
  insights: OpsInsight[];
  alerts: OpsAlert[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: string) => void;
};

// Mock regional data with geographic coordinates for UK stores
const REGIONAL_STORES = [
  { 
    name: 'Kempton Park', 
    revenue: 98500, 
    growth: '+12%', 
    efficiency: 94,
    lat: 51.4167, 
    lng: -0.4167,
    tasks: 6,
    alerts: 2,
    status: 'excellent'
  },
  { 
    name: 'Hatton Cross', 
    revenue: 87200, 
    growth: '+8%', 
    efficiency: 91,
    lat: 51.4667, 
    lng: -0.4167,
    tasks: 4,
    alerts: 1,
    status: 'good'
  },
  { 
    name: 'Ashford SF', 
    revenue: 76300, 
    growth: '+15%', 
    efficiency: 88,
    lat: 51.1467, 
    lng: 0.8667,
    tasks: 8,
    alerts: 2,
    status: 'needs-attention'
  }
];

const mockRegionalData = {
  storePerformance: REGIONAL_STORES.map(store => ({
    store: store.name,
    revenue: store.revenue,
    growth: store.growth,
    efficiency: store.efficiency
  })),
  categoryPerformance: [
    { category: 'Dairy', revenue: 45000, growth: '+10%', margin: '18%' },
    { category: 'Snacks', revenue: 38000, growth: '+14%', margin: '22%' },
    { category: 'Beverages', revenue: 42000, growth: '+7%', margin: '16%' },
    { category: 'Fresh Produce', revenue: 52000, growth: '+12%', margin: '14%' },
    { category: 'Household', revenue: 35000, growth: '+9%', margin: '20%' }
  ],
  kpis: {
    totalRevenue: 262000,
    avgGrowth: 11.2,
    avgEfficiency: 91,
    totalTasks: 18,
    totalRecommendations: 12,
    totalAlerts: 5
  }
};

export const RegionalManagerDashboard: React.FC<RegionalManagerDashboardProps> = ({
  selectedStore,
  selectedCategory,
  selectedTimePeriod,
  tasks,
  recommendations,
  alerts,
  onCreateTask,
}) => {
  const isAllStores = selectedStore === 'All Stores';
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStoreSelect = (storeName: string) => {
    // This would typically call a prop function to update the selected store
    console.log('Selected store:', storeName);
  };

  return (
    <div className="h-full w-full flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Regional Overview
          </h1>
          <p className="text-gray-600 font-medium">
            {isAllStores ? 'All Stores' : selectedStore} • {selectedCategory} • {selectedTimePeriod}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bp-card p-4 shadow-bp">
            <div className="text-2xl font-bold text-bp-blue-600">£{mockRegionalData.kpis.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">Total Revenue</div>
          </div>
          <div className="text-center bp-card p-4 shadow-bp">
            <div className="text-2xl font-bold text-green-600">+{mockRegionalData.kpis.avgGrowth}%</div>
            <div className="text-sm text-gray-600 font-medium">Avg Growth</div>
          </div>
          <div className="text-center bp-card p-4 shadow-bp">
            <div className="text-2xl font-bold text-purple-600">{mockRegionalData.kpis.avgEfficiency}%</div>
            <div className="text-sm text-gray-600 font-medium">Efficiency</div>
          </div>
        </div>
      </div>

      <div className="bp-card p-6 shadow-bp">
        <MapInterface onStoreSelect={handleStoreSelect} selectedStore={selectedStore} />
      </div>

      {/* Category Performance */}
      <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
        <h2 className="text-lg font-bold text-[#005BAC] mb-4">Category Performance Across Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {mockRegionalData.categoryPerformance.map((cat) => (
            <div key={cat.category} className={`bg-white rounded-lg p-3 border transition-all ${
              cat.category === selectedCategory ? 'ring-2 ring-blue-300 bg-blue-50' : 'hover:shadow-md'
            }`}>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 text-sm">{cat.category}</h3>
                <p className="text-lg font-bold text-blue-600 mt-1">£{cat.revenue.toLocaleString()}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-green-600">{cat.growth}</span>
                  <span className="text-gray-500">{cat.margin}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#005BAC] mb-4">Regional Tasks</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tasks.slice(0, 8).map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-2 border text-sm">
                <div className="font-medium text-gray-800 truncate">{task.description}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${
                    task.status === 'To Do' ? 'bg-orange-400' :
                    task.status === 'In Progress' ? 'bg-blue-400' : 'bg-green-400'
                  }`}></span>
                  {task.category} • {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#005BAC] mb-4">Recommendations</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recommendations.slice(0, 6).map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg p-2 border text-sm">
                <div className="font-medium text-gray-800 truncate">{rec.productName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {rec.category} • Qty: {rec.suggestedReorderQty}
                </div>
                <button
                  onClick={() => onCreateTask(rec)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1 hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#005BAC] mb-4">Regional Alerts</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg p-2 border text-sm border-l-4 border-l-orange-400">
                <div className="font-medium text-gray-800">{alert.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {alert.category} • {alert.severity}
                </div>
              </div>
            ))}
            
            {/* Mock regional-specific alerts */}
            <div className="bg-white rounded-lg p-2 border text-sm border-l-4 border-l-red-400">
              <div className="font-medium text-gray-800">Multi-store inventory discrepancy</div>
              <div className="text-xs text-gray-500 mt-1">Supply Chain • High</div>
            </div>
            <div className="bg-white rounded-lg p-2 border text-sm border-l-4 border-l-yellow-400">
              <div className="font-medium text-gray-800">Performance variance detected</div>
              <div className="text-xs text-gray-500 mt-1">Operations • Medium</div>
            </div>
          </div>
        </div>
      </div>

      {/* Retail Shrinkage Widget */}
      <RetailShrinkageWidget selectedStore={selectedStore} />

      {/* Regional Summary */}
      <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
        <h2 className="text-lg font-bold text-[#005BAC] mb-4">Regional Insights</h2>
        <div className="bg-white rounded-lg p-4 border">
          <div className="grid grid-cols-3 gap-6 text-center mb-4">
            <div className="border-r">
              <div className="text-2xl font-bold text-blue-600">{REGIONAL_STORES.length}</div>
              <div className="text-sm text-gray-600">Active Stores</div>
            </div>
            <div className="border-r">
              <div className="text-2xl font-bold text-green-600">{mockRegionalData.kpis.totalTasks}</div>
              <div className="text-sm text-gray-600">Active Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{mockRegionalData.kpis.totalAlerts}</div>
              <div className="text-sm text-gray-600">Priority Alerts</div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📊 <strong>Regional Insight:</strong> Ashford SF showing strongest growth (+15%) 
              but needs efficiency improvements. Consider sharing best practices from Kempton Park 
              to optimize operations across the region.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors z-40 group"
      >
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full blink-live-data"></div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Regional AI Assistant
        </div>
      </button>

      {/* Chat Interface Modal */}
      {isChatOpen && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};