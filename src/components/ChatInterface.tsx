import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
  details?: any; // For storing detailed data
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'inventory' | 'planogram' | 'equipment' | 'sales';
}

// Mock detailed data for different types
const getDetailedData = (content: string): { title: string; data: any } => {
  // Analyze the content to determine what type of details to show
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('inventory') || lowerContent.includes('stock') || lowerContent.includes('supply')) {
    return {
      title: 'Inventory Management Details',
      data: {
        overview: {
          totalSKUs: 147,
          lowStock: 12,
          outOfStock: 3,
          overstock: 8,
          turnoverRate: 4.2
        },
        criticalItems: [
          {
            sku: 'DRY-001',
            name: 'Whole Milk 1 Gallon',
            currentStock: 23,
            minThreshold: 50,
            supplier: 'Local Dairy Co.',
            lastDelivery: '2025-01-08',
            nextDelivery: '2025-01-12',
            urgency: 'HIGH'
          },
          {
            sku: 'DRY-045',
            name: 'Greek Yogurt 32oz',
            currentStock: 8,
            minThreshold: 25,
            supplier: 'Dairy Fresh Ltd.',
            lastDelivery: '2025-01-09',
            nextDelivery: '2025-01-13',
            urgency: 'MEDIUM'
          },
          {
            sku: 'DRY-089',
            name: 'Organic Butter 1lb',
            currentStock: 0,
            minThreshold: 15,
            supplier: 'Organic Valley',
            lastDelivery: '2025-01-07',
            nextDelivery: '2025-01-14',
            urgency: 'CRITICAL'
          }
        ]
      }
    };
  }
  
  if (lowerContent.includes('equipment') || lowerContent.includes('temperature') || lowerContent.includes('maintenance')) {
    return {
      title: 'Equipment Monitoring Details',
      data: {
        overview: {
          totalUnits: 8,
          operational: 7,
          alerts: 1,
          efficiency: '94%'
        },
        units: [
          {
            id: 'COOLER-001',
            name: 'Dairy Cooler #1',
            temperature: 38.2,
            targetTemp: 38,
            status: 'Normal',
            lastMaintenance: '2025-09-15',
            nextMaintenance: '2025-10-15'
          },
          {
            id: 'COOLER-002',
            name: 'Dairy Cooler #2',
            temperature: 37.8,
            targetTemp: 38,
            status: 'Normal',
            lastMaintenance: '2025-09-10',
            nextMaintenance: '2025-10-10'
          },
          {
            id: 'COOLER-003',
            name: 'Dairy Cooler #3',
            temperature: 39.1,
            targetTemp: 38,
            status: 'Alert',
            alert: 'Door sensor malfunction',
            lastMaintenance: '2025-09-05',
            nextMaintenance: '2025-10-05'
          }
        ]
      }
    };
  }

    
  if (lowerContent.includes('planogram') || lowerContent.includes('shelf') || lowerContent.includes('layout') || lowerContent.includes('compliance')) {
    return {
      title: 'Planogram Compliance Details',
      data: {
        section: 'Aisle 3 - Yogurt Section',
        currentCompliance: '73%',
        targetCompliance: '90%',
        issues: [
          'Premium yogurt not at eye level (reduces visibility by 25%)',
          'Organic options mixed with regular products (confuses customers)',
          'Price tags not aligned properly (3 items affected)',
          'End cap not utilizing seasonal promotions'
        ],
        recommendations: [
          'Move Chobani and Fage to eye level (shelves 3-4)',
          'Create dedicated organic section with clear signage',
          'Implement planogram realignment schedule',
          'Add seasonal promotion display for fall flavors'
        ],
        expectedImpact: {
          salesIncrease: '8-12%',
          customerSatisfaction: '+0.3 points',
          shoppingTime: '-15 seconds average'
        }
      }
    };
  }
  
  if (lowerContent.includes('sales') || lowerContent.includes('revenue') || lowerContent.includes('performance')) {
    return {
      title: 'Sales Performance Details',
      data: {
        period: 'Last 7 Days',
        totalRevenue: 15420,
        growth: '+12%',
        topProducts: [
          { name: 'Whole Milk (1 Gallon)', revenue: 3240, growth: '+18%', units: 270 },
          { name: 'Greek Yogurt (32oz)', revenue: 2180, growth: '+15%', units: 145 },
          { name: 'Cheese Slices (8oz)', revenue: 1890, growth: '+8%', units: 126 },
          { name: 'Butter (1lb)', revenue: 1560, growth: '+5%', units: 104 },
          { name: 'Organic Cheese', revenue: 980, growth: '-5%', units: 49 }
        ],
        dailyTrends: [
          { day: 'Monday', revenue: 2100 },
          { day: 'Tuesday', revenue: 2350 },
          { day: 'Wednesday', revenue: 2180 },
          { day: 'Thursday', revenue: 2420 },
          { day: 'Friday', revenue: 2680 },
          { day: 'Saturday', revenue: 2890 },
          { day: 'Sunday', revenue: 800 }
        ]
      }
    };
  }

  
  return {
    title: 'Detailed Information',
    data: 'No specific details available for this request.'
  };
};

// Detail Modal Component
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] m-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-bp-green-600 to-bp-green-700 text-white">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {type === 'inventory' && data.data && data?.data?.criticalItems && (
            <div className="space-y-4">
              {/* Overview Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Inventory Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 animate-pulse">{data?.data?.overview.totalSKUs}</div>
                    <div className="text-blue-700 text-sm">Total SKUs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 animate-pulse">{data?.data?.overview.lowStock}</div>
                    <div className="text-blue-700 text-sm">Low Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700 animate-pulse">{data?.data?.overview.outOfStock}</div>
                    <div className="text-blue-700 text-sm">Out of Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 animate-pulse">{data?.data?.overview.overstock}</div>
                    <div className="text-blue-700 text-sm">Overstock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 animate-pulse">{data?.data?.overview.turnoverRate}</div>
                    <div className="text-blue-700 text-sm">Turnover Rate</div>
                  </div>
                </div>
              </div>

              {/* Critical Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Critical Items Requiring Attention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.data?.criticalItems?.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          item.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          item.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">SKU:</span>
                          <span className="font-medium">{item.sku}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stock:</span>
                          <span className={`font-medium blink-critical ${item.currentStock === 0 ? 'text-red-600' : item.currentStock < item.minThreshold ? 'text-orange-600' : 'text-green-600'}`}>
                            {item.currentStock}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Threshold:</span>
                          <span className="font-medium">{item.minThreshold}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium">{item.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Delivery:</span>
                          <span className="font-medium">{item.lastDelivery}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Delivery:</span>
                          <span className="font-medium">{item.nextDelivery}</span>
                        </div>
                      </div>

                      {/* Stock Level Indicator */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Stock Level</span>
                          <span>{Math.round((item.currentStock / item.minThreshold) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.currentStock === 0 ? 'bg-red-500' :
                              item.currentStock < item.minThreshold ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((item.currentStock / item.minThreshold) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'planogram' && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Section Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-blue-700 text-sm">Current Compliance:</span>
                    <div className="text-2xl font-bold text-blue-900 animate-pulse">{data?.data?.currentCompliance}</div>
                  </div>
                  <div>
                    <span className="text-blue-700 text-sm">Target Compliance:</span>
                    <div className="text-2xl font-bold text-blue-900">{data?.data?.targetCompliance}</div>
                  </div>
                </div>
              </div>

              {/* Issues */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Issues Identified
                </h3>
                <div className="space-y-2">
                  {data?.data?.issues?.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-800 text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {data?.data?.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-green-800 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Impact */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Expected Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{data?.data?.expectedImpact?.salesIncrease}</div>
                    <div className="text-sm text-gray-600">Sales Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{data?.data?.expectedImpact?.customerSatisfaction}</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{data?.data?.expectedImpact?.shoppingTime}</div>
                    <div className="text-sm text-gray-600">Shopping Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'equipment' && (
            <div className="space-y-6">
              {/* Equipment Overview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Equipment Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{data?.data?.overview?.totalUnits}</div>
                    <div className="text-blue-700 text-sm">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 animate-pulse">{data?.data?.overview?.operational}</div>
                    <div className="text-blue-700 text-sm">Operational</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 animate-pulse">{data?.data?.overview?.alerts}</div>
                    <div className="text-blue-700 text-sm">Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 animate-pulse">{data?.data?.overview?.efficiency}</div>
                    <div className="text-blue-700 text-sm">Efficiency</div>
                  </div>
                </div>
              </div>

              {/* Equipment Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Equipment Status</h3>
                {data?.data?.units?.map((unit: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        unit.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {unit.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">ID:</span>
                        <div className="font-medium">{unit.id}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <div className="font-medium blink-live-data text-blue-600">{unit.temperature}°F</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Target:</span>
                        <div className="font-medium">{unit.targetTemp}°F</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Maintenance:</span>
                        <div className="font-medium">{unit.lastMaintenance}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Maintenance:</span>
                        <div className="font-medium">{unit.nextMaintenance}</div>
                      </div>
                      {unit.alert && (
                        <div className="col-span-full">
                          <span className="text-red-600">Alert:</span>
                          <div className="font-medium text-red-700">{unit.alert}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'sales' && (
            <div className="space-y-6">
              {/* Sales Overview */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Sales Overview - {data?.data?.period}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-900 blink-live-data">${data?.data?.totalRevenue.toLocaleString()}</div>
                    <div className="text-green-700 text-sm">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 blink-slow">{data?.data?.growth}</div>
                    <div className="text-green-700 text-sm">Growth vs Previous Period</div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                <div className="space-y-3">
                  {data?.data?.topProducts.map((product: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <div className="text-sm text-gray-600">{product.units} units sold</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg blink-live-data">${product.revenue.toLocaleString()}</div>
                          <div className={`text-sm font-medium blink-slow ${
                            product.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.growth}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Trends */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Daily Revenue Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {data?.data?.dailyTrends.map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">{day.day}</span>
                      <span className="font-bold text-gray-900 blink-slow">${day.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fallback for no specific details */}
          {typeof data.data === 'string' && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">{data.data}</p>
              <p className="text-gray-400 text-xs mt-2">Try asking about specific topics like inventory, sales, or equipment</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-bp-green-600 text-white rounded-lg hover:bg-bp-green-700 transition-colors">
            Take Action
          </button>
        </div>
      </div>
    </div>
  );
};
const getAIResponse = (userMessage: string): Message => {
  const responses = [
    {
      trigger: ['stock', 'inventory', 'restock', 'low stock'],
      response: "📦 I can help with inventory management! Based on current data:\n\n• 3 items in Dairy are running low (Whole Milk, Greek Yogurt, Butter)\n• Recommended restock: 24 units each\n• Delivery window: Tomorrow 6-8 AM\n\nWould you like me to create restock tasks automatically?"
    },
    {
      trigger: ['sales', 'revenue', 'performance', 'top sellers'],
      response: "📈 Great news on sales performance! Here's your Dairy category update:\n\n• Revenue: ↗️ 12% vs last week\n• Top performers: Whole Milk (+18%), Greek Yogurt (+15%)\n• Underperformer: Organic Cheese (-5%)\n\nShould I analyze customer preferences or suggest promotional strategies?"
    },
    {
      trigger: ['layout', 'planogram', 'space', 'shelf', 'aisle'],
      response: "🏪 I've detected some planogram opportunities:\n\n• Aisle 3: Yogurt section 73% compliant (target: 90%)\n• Suggestion: Move premium yogurt to eye-level shelves\n• Expected impact: +8% sales lift\n\nWant me to generate a detailed layout optimization plan?"
    },
    {
      trigger: ['equipment', 'temperature', 'freezer', 'cooler'],
      response: "🌡️ Equipment status looking good! Current monitoring shows:\n\n• Dairy cooler: 38°F (optimal)\n• Freezer units: -2°F (optimal)\n• 1 minor alert: Door sensor in dairy case #3\n\nShall I schedule maintenance or provide troubleshooting steps?"
    },
    {
      trigger: ['alerts', 'issues', 'problems', 'urgent'],
      response: "⚠️ Current alerts summary:\n\n• 2 medium priority: Shelf space optimization needed\n• 1 low priority: Price tag update required\n• 0 urgent issues\n\nEverything's running smoothly! Any specific area you'd like me to investigate?"
    },
    {
      trigger: ['help', 'what can you do', 'capabilities'],
      response: "🤖 I'm your AI Store Assistant! I can help with:\n\n📊 Real-time inventory analysis\n📈 Sales performance insights\n🏪 Planogram optimization\n🌡️ Equipment monitoring\n⚠️ Alert management\n📋 Task automation\n\nJust ask me anything about your store operations!"
    },
    {
      trigger: ['customers', 'feedback', 'satisfaction'],
      response: "😊 Customer insights for your store:\n\n• Satisfaction score: 4.2/5 (↗️ +0.3 this month)\n• Top compliment: 'Well-organized dairy section'\n• Main concern: 'Sometimes out of organic options'\n\nWant me to suggest improvements based on customer feedback?"
    },
    {
      trigger: ['tasks', 'todo', 'schedule', 'reminders'],
      response: "📋 I can help manage your tasks! Current pending items:\n\n• 3 restock recommendations\n• 1 planogram adjustment\n• 2 equipment checks\n\nShould I prioritize these or create new tasks based on current data?"
    }
  ];

  const userLower = userMessage.toLowerCase();
  const matchedResponse = responses.find(r => 
    r.trigger.some(trigger => userLower.includes(trigger))
  );

  return {
    id: `ai-${Date.now()}`,
    text: matchedResponse?.response || "🤔 I understand you're asking about store operations. Could you be more specific? I can help with:\n\n• 📦 Inventory & restocking\n• 📈 Sales analysis\n• 🏪 Layout optimization\n• 🌡️ Equipment monitoring\n• 📋 Task management\n\nWhat would you like to know?",
    sender: 'ai',
    timestamp: new Date(),
    type: 'text'
  };
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "👋 Hello! I'm your AI Store Assistant for the Dairy section. I can help you with:\n\n📦 Inventory management\n📈 Sales insights\n🏪 Planogram optimization\n🌡️ Equipment monitoring\n\nWhat would you like to know about your store today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState<any>(null);
  const [detailModalType, setDetailModalType] = useState<'inventory' | 'planogram' | 'equipment' | 'sales'>('inventory');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredPrompts.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredPrompts.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredPrompts.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handlePromptSelect(filteredPrompts[selectedSuggestionIndex].text);
        } else {
          setShowSuggestions(false);
          handleSendMessage();
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setShowSuggestions(value.trim().length >= 2);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
  };

  const handlePromptSelect = (promptText: string) => {
    setInputText(promptText);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleViewDetails = (messageText: string) => {
    let type: 'inventory' | 'planogram' | 'equipment' | 'sales' = 'inventory';
    
    // More comprehensive text analysis
    const lowerText = messageText.toLowerCase();
    if (lowerText.includes('restock') || lowerText.includes('inventory') || lowerText.includes('stock') || lowerText.includes('supply')) {
      type = 'inventory';
    } else if (lowerText.includes('planogram') || lowerText.includes('layout') || lowerText.includes('shelf') || lowerText.includes('compliance')) {
      type = 'planogram';
    } else if (lowerText.includes('equipment') || lowerText.includes('temperature') || lowerText.includes('cooler') || lowerText.includes('maintenance')) {
      type = 'equipment';
    } else if (lowerText.includes('sales') || lowerText.includes('performance') || lowerText.includes('revenue') || lowerText.includes('sellers')) {
      type = 'sales';
    }

    // Use the same function that generates detailed data based on content analysis
    const detailData = getDetailedData(messageText);
    setDetailModalData(detailData);
    setDetailModalType(type);
    setShowDetailModal(true);
  };

  const suggestedQuestions = [
    "📦 Show me low stock items",
    "📈 What are today's top sellers?",
    "🏪 Any layout optimization tips?",
    "🌡️ Check equipment status",
    "📋 Create restock tasks",
    "😊 Customer feedback summary"
  ];

  // Instant prompts that appear as user types
  const instantPrompts = [
    { text: "Show inventory levels", keywords: ["inventory", "stock", "levels", "items"] },
    { text: "Check sales performance", keywords: ["sales", "performance", "revenue", "numbers"] },
    { text: "Analyze planogram compliance", keywords: ["planogram", "layout", "compliance", "shelf"] },
    { text: "Monitor equipment status", keywords: ["equipment", "temperature", "cooler", "freezer"] },
    { text: "Review customer feedback", keywords: ["customer", "feedback", "satisfaction", "reviews"] },
    { text: "Create restocking tasks", keywords: ["restock", "tasks", "order", "supply"] },
    { text: "Show today's alerts", keywords: ["alerts", "issues", "problems", "urgent"] },
    { text: "Generate sales report", keywords: ["report", "summary", "analysis", "data"] },
    { text: "Optimize shelf space", keywords: ["optimize", "space", "arrangement", "organize"] },
    { text: "Check dairy temperatures", keywords: ["dairy", "milk", "yogurt", "cheese", "cold"] },
    { text: "View top performing products", keywords: ["top", "best", "popular", "performing"] },
    { text: "Schedule maintenance", keywords: ["maintenance", "repair", "service", "schedule"] }
  ];

  // Filter prompts based on input text
  const getFilteredPrompts = (input: string) => {
    if (!input.trim() || input.length < 2) return [];
    
    const searchTerm = input.toLowerCase();
    return instantPrompts
      .filter(prompt => 
        prompt.keywords.some(keyword => keyword.includes(searchTerm)) ||
        prompt.text.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const filteredPrompts = getFilteredPrompts(inputText);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col m-4">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-bp-green-600 to-bp-green-700 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center blink-slow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">AI Store Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full blink-live-data"></div>
                <p className="text-xs text-green-100">Online and ready to help</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-bp-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {/* Quick Action Buttons for AI responses */}
                {message.sender === 'ai' && (message.text.includes('restock') || message.text.includes('stock') || message.text.includes('inventory')) && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs bg-bp-green-600 text-white px-2 py-1 rounded hover:bg-bp-green-700 transition-colors">
                      Create Tasks
                    </button>
                    <button 
                      onClick={() => handleViewDetails(message.text)}
                      className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
                
                {message.sender === 'ai' && (message.text.includes('sales') || message.text.includes('revenue') || message.text.includes('performance')) && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs bg-bp-green-600 text-white px-2 py-1 rounded hover:bg-bp-green-700 transition-colors">
                      Generate Report
                    </button>
                    <button 
                      onClick={() => handleViewDetails(message.text)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
                
                {message.sender === 'ai' && (message.text.includes('planogram') || message.text.includes('layout')) && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs bg-bp-green-600 text-white px-2 py-1 rounded hover:bg-bp-green-700 transition-colors">
                      Optimize Layout
                    </button>
                    <button 
                      onClick={() => handleViewDetails(message.text)}
                      className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}

                {message.sender === 'ai' && (message.text.includes('equipment') || message.text.includes('temperature')) && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs bg-bp-green-600 text-white px-2 py-1 rounded hover:bg-bp-green-700 transition-colors">
                      Schedule Check
                    </button>
                    <button 
                      onClick={() => handleViewDetails(message.text)}
                      className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {/* {messages.length === 1 && ( */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        {/* )} */}

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 relative">
          {/* Instant Prompts Dropdown */}
          {showSuggestions && filteredPrompts.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 font-medium">Instant suggestions:</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{filteredPrompts.length} found</span>
                  </div>
                </div>
                {filteredPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(prompt.text)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 flex items-center space-x-2 ${
                      index === selectedSuggestionIndex
                        ? 'bg-bp-green-100 text-bp-green-800 scale-[1.02]'
                        : 'text-gray-700 hover:bg-bp-green-50 hover:text-bp-green-700'
                    }`}
                  >
                    <svg className="w-4 h-4 text-bp-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="flex-grow">{prompt.text}</span>
                    {index === selectedSuggestionIndex && (
                      <div className="flex-shrink-0">
                        <kbd className="px-1.5 py-0.5 text-xs bg-bp-green-200 text-bp-green-700 rounded border">↵</kbd>
                      </div>
                    )}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center justify-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded">↑↓</kbd>
                      <span>navigate</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded">↵</kbd>
                      <span>select</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded">Esc</kbd>
                      <span>close</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onFocus={() => inputText.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type your message or search for suggestions..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bp-green-500 focus:border-transparent pr-10"
              />
              {/* Input indicators */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {inputText.length >= 2 && filteredPrompts.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-bp-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-bp-green-600 font-medium">{filteredPrompts.length}</span>
                  </div>
                )}
                {inputText.length >= 2 && (
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-gray-400 hover:text-bp-green-500 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 transform transition-transform ${showSuggestions ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-bp-green-600 text-white rounded-lg hover:bg-bp-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={detailModalData}
        type={detailModalType}
      />
    </div>
  );
};

export default ChatInterface;