import React, { useState } from 'react';
import { Category, Recommendation, Task, OpsInsight, OpsAlert } from '../types';
import UKMapWithStores from './UKMapWithStores';
import MapInterface from './MapInterface';

type RegionalManagerDashboardProps = {
  selectedStore: string;
  selectedCategory: Category;
  selectedTimePeriod: string;
  tasks: Task[];
  recommendations: Recommendation[];
  insights: OpsInsight[];
  alerts: OpsAlert[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: number) => void;
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

// UK Map Component with BP Store Locations
// const UKMapWithStores: React.FC<{ onStoreSelect: (store: string) => void; selectedStore: string }> = ({ onStoreSelect, selectedStore }) => {
//   const [hoveredStore, setHoveredStore] = useState<string | null>(null);

//   const getStoreColor = (status: string) => {
//     switch (status) {
//       case 'excellent': return '#10B981'; // Green
//       case 'good': return '#3B82F6'; // Blue
//       case 'needs-attention': return '#F59E0B'; // Orange
//       default: return '#6B7280'; // Gray
//     }
//   };

//   const getStoreSize = (isSelected: boolean, isHovered: boolean) => {
//     if (isSelected) return 14;
//     if (isHovered) return 12;
//     return 10;
//   };

//   return (
//     <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border">
//       <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">UK Regional Overview</h3>
      
//       {/* UK Map SVG */}
//       <div className="relative w-full h-80 bg-white rounded-lg border shadow-sm overflow-hidden">
//         <svg 
//           viewBox="0 0 400 500" 
//           className="w-full h-full"
//           style={{ background: 'linear-gradient(to bottom, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)' }}
//         >
//           {/* Simplified UK outline */}
//           <path
//             d="M100 450 L120 430 L140 410 L160 390 L180 370 L200 350 L210 330 L220 310 L215 290 L205 270 L190 250 L175 230 L160 210 L150 190 L145 170 L150 150 L160 130 L175 110 L190 100 L210 95 L230 100 L250 110 L265 125 L275 145 L280 165 L275 185 L270 205 L280 225 L290 245 L285 265 L275 285 L265 305 L255 325 L245 345 L235 365 L225 385 L215 405 L205 425 L190 440 L170 450 L150 455 L130 455 L110 452 Z"
//             fill="#22C55E"
//             fillOpacity="0.2"
//             stroke="#16A34A"
//             strokeWidth="2"
//             className="drop-shadow-sm"
//           />
          
//           {/* England/Wales body */}
//           <path
//             d="M140 450 L160 430 L180 400 L200 370 L220 340 L230 310 L225 280 L215 250 L200 220 L185 200 L170 180 L160 160 L155 140 L160 120 L175 105 L195 100 L215 105 L235 115 L250 130 L260 150 L265 170 L260 190 L255 210 L265 230 L275 250 L270 270 L260 290 L250 310 L240 330 L230 350 L220 370 L210 390 L200 410 L190 430 L180 445 L165 450 L150 452 Z"
//             fill="#DCFCE7"
//             stroke="#16A34A"
//             strokeWidth="1"
//           />

//           {/* Scotland */}
//           <path
//             d="M175 110 L195 105 L215 110 L230 125 L240 145 L235 165 L225 185 L210 200 L195 210 L180 215 L165 210 L155 195 L150 180 L155 165 L165 150 L175 135 L180 120 Z"
//             fill="#DCFCE7"
//             stroke="#16A34A"
//             strokeWidth="1"
//           />

//           {/* Northern Ireland */}
//           <ellipse cx="120" cy="180" rx="25" ry="35" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />

//           {/* Store markers */}
//           {REGIONAL_STORES.map((store) => {
//             const isSelected = selectedStore === store.name;
//             const isHovered = hoveredStore === store.name;
//             const size = getStoreSize(isSelected, isHovered);
            
//             // Convert lat/lng to SVG coordinates (simplified projection)
//             const x = 200 + (store.lng * 50);
//             const y = 300 - (store.lat * 4);
            
//             return (
//               <g key={store.name}>
//                 {/* Store marker */}
//                 <circle
//                   cx={x}
//                   cy={y}
//                   r={size}
//                   fill={getStoreColor(store.status)}
//                   stroke="white"
//                   strokeWidth="3"
//                   className="cursor-pointer transition-all duration-200 drop-shadow-md"
//                   onMouseEnter={() => setHoveredStore(store.name)}
//                   onMouseLeave={() => setHoveredStore(null)}
//                   onClick={() => onStoreSelect(store.name)}
//                 />
                
//                 {/* Store label */}
//                 <text
//                   x={x}
//                   y={y - size - 8}
//                   textAnchor="middle"
//                   className="text-xs font-semibold fill-gray-800 pointer-events-none"
//                   style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}
//                 >
//                   {store.name}
//                 </text>
                
//                 {/* Pulse animation for alerts */}
//                 {store.alerts > 0 && (
//                   <circle
//                     cx={x}
//                     cy={y}
//                     r={size + 4}
//                     fill="none"
//                     stroke="#EF4444"
//                     strokeWidth="2"
//                     opacity="0.6"
//                     className="animate-ping"
//                   />
//                 )}
                
//                 {/* Hover tooltip */}
//                 {isHovered && (
//                   <foreignObject x={x + 20} y={y - 40} width="180" height="80">
//                     <div className="bg-white p-3 rounded-lg border shadow-lg text-xs">
//                       <div className="font-semibold text-gray-800">{store.name}</div>
//                       <div className="text-gray-600 mt-1">
//                         Revenue: £{store.revenue.toLocaleString()}<br/>
//                         Growth: {store.growth}<br/>
//                         Tasks: {store.tasks} • Alerts: {store.alerts}
//                       </div>
//                     </div>
//                   </foreignObject>
//                 )}
//               </g>
//             );
//           })}

//           {/* BP Logo in corner */}
//           <g transform="translate(20, 20)">
//             <circle cx="15" cy="15" r="15" fill="#005BAC" />
//             <text x="15" y="20" textAnchor="middle" className="fill-white text-sm font-bold">BP</text>
//           </g>
//         </svg>
//       </div>

//       {/* Legend */}
//       <div className="mt-4 flex justify-center gap-6 text-xs">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           <span>Excellent Performance</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//           <span>Good Performance</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-orange-500"></div>
//           <span>Needs Attention</span>
//         </div>
//       </div>

//       {/* Quick stats overlay */}
//       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border shadow-sm">
//         <div className="text-xs text-gray-600 mb-1">Regional Totals</div>
//         <div className="text-sm font-semibold text-gray-800">
//           Revenue: £{mockRegionalData.kpis.totalRevenue.toLocaleString()}<br/>
//           Stores: {REGIONAL_STORES.length}<br/>
//           Tasks: {mockRegionalData.kpis.totalTasks}
//         </div>
//       </div>
//     </div>
//   );
// };

export const RegionalManagerDashboard: React.FC<RegionalManagerDashboardProps> = ({
  selectedStore,
  selectedCategory,
  selectedTimePeriod,
  tasks,
  recommendations,
  insights,
  alerts,
  onCreateTask,
  onIgnoreRecommendation,
}) => {
  const isAllStores = selectedStore === 'All Stores';

  const handleStoreSelect = (storeName: string) => {
    // This would typically call a prop function to update the selected store
    console.log('Selected store:', storeName);
  };

  return (
    <div className="h-full w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Regional Overview
          </h1>
          <p className="text-gray-600">
            {isAllStores ? 'All Stores' : selectedStore} • {selectedCategory} • {selectedTimePeriod}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-white rounded-lg p-3 border shadow-sm">
            <div className="text-lg font-bold text-blue-600">£{mockRegionalData.kpis.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 border shadow-sm">
            <div className="text-lg font-bold text-green-600">+{mockRegionalData.kpis.avgGrowth}%</div>
            <div className="text-xs text-gray-500">Avg Growth</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 border shadow-sm">
            <div className="text-lg font-bold text-purple-600">{mockRegionalData.kpis.avgEfficiency}%</div>
            <div className="text-xs text-gray-500">Efficiency</div>
          </div>
        </div>
      </div>

            <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
     <UKMapWithStores onStoreSelect={handleStoreSelect} selectedStore={selectedStore} />
        {/* <MapInterface onStoreSelect={handleStoreSelect} selectedStore={selectedStore} /> */}
      </div>

      {/* UK Map and Store Performance */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#005BAC] mb-4">Store Performance</h2>
          <div className="space-y-3">
            {mockRegionalData.storePerformance.map((store) => {
              const storeData = REGIONAL_STORES.find(s => s.name === store.store);
              return (
                <div 
                  key={store.store} 
                  className={`bg-white rounded-lg p-3 border transition-all cursor-pointer ${
                    selectedStore === store.store ? 'ring-2 ring-blue-300 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleStoreSelect(store.store)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getStoreColor(storeData?.status || 'good') }}
                      ></div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{store.store}</h3>
                        <p className="text-sm text-gray-600">£{store.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">{store.growth}</div>
                      <div className="text-xs text-gray-500">{store.efficiency}% efficiency</div>
                    </div>
                  </div>
                  {storeData && (
                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                      <span>📋 {storeData.tasks} tasks</span>
                      <span>🚨 {storeData.alerts} alerts</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

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
    </div>
  );
};

// Helper function (move outside component if needed)
const getStoreColor = (status: string) => {
  switch (status) {
    case 'excellent': return '#10B981'; // Green
    case 'good': return '#3B82F6'; // Blue
    case 'needs-attention': return '#F59E0B'; // Orange
    default: return '#6B7280'; // Gray
  }
};