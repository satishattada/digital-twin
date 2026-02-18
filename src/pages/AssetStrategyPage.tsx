import React, { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';

type AssetStrategyPageProps = {
  selectedStore: string;
  selectedCategory: string;
};

// Mock data for Asset Strategy Dashboard
const ASSET_CLASSES = [
  { 
    name: 'Refrigeration Units', 
    count: 45, 
    avgAge: 7.2, 
    criticality: 'High',
    totalCost: 425000,
    status: 'Good'
  },
  { 
    name: 'HVAC Systems', 
    count: 28, 
    avgAge: 9.5, 
    criticality: 'High',
    totalCost: 380000,
    status: 'Attention Required'
  },
  { 
    name: 'POS Systems', 
    count: 120, 
    avgAge: 4.2, 
    criticality: 'Medium',
    totalCost: 240000,
    status: 'Good'
  },
  { 
    name: 'Shelving & Fixtures', 
    count: 350, 
    avgAge: 12.1, 
    criticality: 'Medium',
    totalCost: 175000,
    status: 'Refurbishment Due'
  },
  { 
    name: 'Security Systems', 
    count: 85, 
    avgAge: 5.8, 
    criticality: 'High',
    totalCost: 195000,
    status: 'Good'
  }
];

const LIFECYCLE_STAGES = [
  { stage: 'New (0-3 years)', count: 145, percentage: 23 },
  { stage: 'Productive (3-7 years)', count: 198, percentage: 32 },
  { stage: 'Mature (7-12 years)', count: 176, percentage: 28 },
  { stage: 'End of Life (>12 years)', count: 109, percentage: 17 }
];

const PERFORMANCE_METRICS = [
  { metric: 'Overall Asset Health', value: 82, target: 85, trend: '+2%' },
  { metric: 'Maintenance Compliance', value: 94, target: 95, trend: '+1%' },
  { metric: 'Energy Efficiency', value: 76, target: 80, trend: '-3%' },
  { metric: 'Failure Rate', value: 8, target: 5, trend: '+12%' }
];

const AI_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Refrigeration Fleet Renewal',
    description: 'AI predicts optimal renewal timing for 12 refrigeration units (avg age: 11.4 years) to avoid failure cascade. Estimated savings: £38K vs reactive replacement.',
    priority: 'High',
    capexRequired: 145000,
    roi: 'Payback in 2.3 years',
    confidence: 94
  },
  {
    id: 2,
    title: 'HVAC Refurbishment Program',
    description: 'Smart refurbishment of 8 HVAC systems will extend lifecycle by 5 years at 40% cost of replacement. Cost-benefit analysis shows £112K net savings.',
    priority: 'Medium',
    capexRequired: 95000,
    roi: 'Payback in 1.8 years',
    confidence: 89
  },
  {
    id: 3,
    title: 'Shelving Modernization',
    description: 'Replace aging fixtures in high-traffic zones (18 locations) to improve customer experience and reduce maintenance. Predicted improvement in sales conversion: +4.2%.',
    priority: 'Medium',
    capexRequired: 68000,
    roi: 'Payback in 3.1 years',
    confidence: 76
  }
];

const COST_TRENDS = [
  { month: 'Jan', planned: 42000, actual: 38500, forecast: 41000 },
  { month: 'Feb', planned: 38000, actual: 41200, forecast: 40000 },
  { month: 'Mar', planned: 45000, actual: 43800, forecast: 44000 },
  { month: 'Apr', planned: 51000, actual: 48900, forecast: 50000 },
  { month: 'May', planned: 48000, actual: 52100, forecast: 51000 },
  { month: 'Jun', planned: 46000, actual: 45300, forecast: 46500 }
];

const RISK_INDICATORS = [
  { risk: 'Critical Asset Failures', severity: 'High', affected: 8, trend: 'Increasing' },
  { risk: 'Compliance Gaps', severity: 'Medium', affected: 12, trend: 'Stable' },
  { risk: 'Budget Overrun', severity: 'Low', affected: 3, trend: 'Decreasing' },
  { risk: 'Skills Gap', severity: 'Medium', affected: 5, trend: 'Stable' }
];

export const AssetStrategyPage: React.FC<AssetStrategyPageProps> = ({
  selectedStore,
  selectedCategory,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-y-auto">
      {/* Enhanced Header Section with Visual Elements */}
      <div className="relative">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Asset Strategy Dashboard
              </h1>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Strategic Asset Lifecycle Management & Capital Planning
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="group text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">628</div>
              <div className="text-xs font-medium opacity-90">Total Assets</div>
              <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="group text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">£1.42M</div>
              <div className="text-xs font-medium opacity-90">Asset Value</div>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                <span>+8.2% YoY</span>
              </div>
            </div>
            <div className="group text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
              <div className="text-3xl font-bold mb-1">82%</div>
              <div className="text-xs font-medium opacity-90">Health Score</div>
              <div className="mt-2 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Asset Strategy Framework</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        <div className="h-px flex-grow bg-gradient-to-l from-transparent via-purple-300 to-transparent"></div>
      </div>

      {/* Asset Strategy Framework - Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Asset Baseline & Classification - Enhanced */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-blue-100">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-50"></div>
          
          {/* Decorative Corner Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">Asset Baseline & Strategic Classification</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live Data Feed</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-blue-50/50 p-3 rounded-lg border-l-4 border-blue-500">
              Creates a baseline of asset classes, lifecycle stages, costs, and criticality across geographies. 
              Ensures consistent strategic inputs for portfolio decisions.
            </p>
          
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {ASSET_CLASSES.map((asset, idx) => (
                <div 
                  key={idx} 
                  className={`relative bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-4 transition-all cursor-pointer transform hover:scale-[1.02] ${
                    selectedAssetClass === asset.name 
                      ? 'border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedAssetClass(asset.name)}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                    asset.status === 'Good' ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-orange-400 to-orange-600'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-3 ml-2">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-base">{asset.name}</h3>
                        {selectedAssetClass === asset.name && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                          </svg>
                          {asset.count} units
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          Avg {asset.avgAge} yrs
                        </span>
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      asset.criticality === 'High' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    }`}>
                      {asset.criticality}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm ml-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                      </svg>
                      <span className="font-bold text-gray-900">£{asset.totalCost.toLocaleString()}</span>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      asset.status === 'Good' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        asset.status === 'Good' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></span>
                      {asset.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Lifecycle Distribution */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-800">Lifecycle Stage Distribution</h3>
              </div>
              <div className="space-y-3">
                {LIFECYCLE_STAGES.map((stage, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-700 font-medium flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          idx === 0 ? 'bg-green-500' : 
                          idx === 1 ? 'bg-blue-500' : 
                          idx === 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        {stage.stage}
                      </span>
                      <span className="text-gray-900 font-bold">{stage.count} ({stage.percentage}%)</span>
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 group-hover:brightness-110 ${
                          idx === 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                          idx === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 
                          idx === 2 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          'bg-gradient-to-r from-red-400 to-red-600'
                        } shadow-md`}
                        style={{ width: `${stage.percentage}%` }}
                      >
                        <div className="h-full w-full bg-gradient-to-t from-transparent to-white/30"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Performance Monitoring & Diagnostics - Enhanced */}
        <div className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-purple-100">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-50"></div>
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">Performance Monitoring & Strategic Diagnostics</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Real-time Analytics</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 leading-relaxed bg-purple-50/50 p-3 rounded-lg border-l-4 border-purple-500">
              Monitors asset performance, cost trends, risk indicators and compliance gaps to diagnose strategic constraints. 
              Supports strategy refresh cycles.
            </p>

            {/* Enhanced Performance Metrics with Visual Indicators */}
            <div className="space-y-4 mb-5">
              {PERFORMANCE_METRICS.map((metric, idx) => (
                <div key={idx} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        metric.value >= metric.target ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          metric.value >= metric.target ? 'text-green-600' : 'text-orange-600'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">{metric.metric}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                        metric.trend.startsWith('+') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {metric.trend.startsWith('+') ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-grow">
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className={`h-3 rounded-full transition-all duration-700 ${
                            metric.value >= metric.target 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : 'bg-gradient-to-r from-orange-400 to-orange-600'
                          } shadow-md`}
                          style={{ width: `${(metric.value / 100) * 100}%` }}
                        >
                          <div className="h-full w-full bg-gradient-to-t from-transparent to-white/30"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-gray-900 text-lg">{metric.value}%</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600 font-medium">{metric.target}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Cost Trends Chart with 3D Effect */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  <h3 className="text-sm font-bold text-gray-800">Cost Trends & Forecast</h3>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
              
              <div className="h-40 flex items-end justify-between gap-2 mb-3 px-2">
                {COST_TRENDS.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-1 justify-center group">
                      <div 
                        className="relative bg-gradient-to-t from-blue-400 to-blue-300 w-1/3 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-400 cursor-pointer shadow-lg"
                        style={{ height: `${(data.planned / 60000) * 140}px` }}
                        title={`Planned: £${data.planned.toLocaleString()}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/40 rounded-t-lg"></div>
                      </div>
                      <div 
                        className="relative bg-gradient-to-t from-green-600 to-green-400 w-1/3 rounded-t-lg transition-all hover:from-green-700 hover:to-green-500 cursor-pointer shadow-lg"
                        style={{ height: `${(data.actual / 60000) * 140}px` }}
                        title={`Actual: £${data.actual.toLocaleString()}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/40 rounded-t-lg"></div>
                        {data.actual > data.planned && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div 
                        className="relative bg-gradient-to-t from-purple-500 to-purple-300 w-1/3 rounded-t-lg transition-all hover:from-purple-600 hover:to-purple-400 cursor-pointer shadow-lg"
                        style={{ height: `${(data.forecast / 60000) * 140}px` }}
                        title={`Forecast: £${data.forecast.toLocaleString()}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/40 rounded-t-lg"></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{data.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-6 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-300 rounded shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Planned</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-600 to-green-400 rounded shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Actual</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-300 rounded shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Forecast</span>
                </div>
              </div>
            </div>

            {/* Enhanced Risk Indicators with Visual Priority */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-800">Risk Indicators</h3>
              </div>
              <div className="space-y-3">
                {RISK_INDICATORS.map((risk, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shadow-md ${
                        risk.severity === 'High' ? 'bg-red-500 animate-pulse' : 
                        risk.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-xs text-gray-700 font-medium">{risk.risk}</span>
                    </div>
                    <div className="flex gap-4 items-center text-xs">
                      <span className="text-gray-500">{risk.affected} affected</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        risk.trend === 'Increasing' ? 'text-red-600' : 
                        risk.trend === 'Decreasing' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {risk.trend === 'Increasing' && '↑'}
                        {risk.trend === 'Decreasing' && '↓'}
                        {risk.trend === 'Stable' && '→'}
                        {risk.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategy Agent & Predictive Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. Predictive Lifecycle Decisions */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">3</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">Predictive Lifecycle Decisions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Predicts renewal, refurb, or retire decisions using lifecycle, failure, and cost models. 
            Identifies optimal timing for capex investment.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
              <h3 className="text-sm font-semibold text-green-800">AI-Powered Lifecycle Predictions</h3>
            </div>
            <p className="text-xs text-green-700">
              Machine learning models analyze 15,000+ historical asset events to predict optimal renewal timing, 
              minimizing total cost of ownership while maximizing uptime.
            </p>
          </div>

          {/* Decision Matrix */}
          <div className="space-y-3">
            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Refrigeration - Zone A</h3>
                  <p className="text-xs text-gray-500">8 units • Avg 11.2 years</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                  RENEW
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Optimal Timing:</span>
                  <span className="ml-1 text-gray-800 font-medium">Q3 2026</span>
                </div>
                <div>
                  <span className="text-gray-500">Est. Capex:</span>
                  <span className="ml-1 text-gray-800 font-medium">£98K</span>
                </div>
                <div>
                  <span className="text-gray-500">Failure Risk:</span>
                  <span className="ml-1 text-red-600 font-medium">78%</span>
                </div>
                <div>
                  <span className="text-gray-500">ROI Period:</span>
                  <span className="ml-1 text-green-600 font-medium">2.1 years</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">HVAC System - Store 12</h3>
                  <p className="text-xs text-gray-500">3 units • Avg 8.7 years</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                  REFURB
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Optimal Timing:</span>
                  <span className="ml-1 text-gray-800 font-medium">Q1 2027</span>
                </div>
                <div>
                  <span className="text-gray-500">Est. Capex:</span>
                  <span className="ml-1 text-gray-800 font-medium">£32K</span>
                </div>
                <div>
                  <span className="text-gray-500">Lifecycle Extension:</span>
                  <span className="ml-1 text-green-600 font-medium">+5 years</span>
                </div>
                <div>
                  <span className="text-gray-500">Cost Savings:</span>
                  <span className="ml-1 text-green-600 font-medium">£45K vs new</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Legacy POS - Regional</h3>
                  <p className="text-xs text-gray-500">15 units • Avg 14.3 years</p>
                </div>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                  RETIRE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Recommended:</span>
                  <span className="ml-1 text-gray-800 font-medium">Q2 2026</span>
                </div>
                <div>
                  <span className="text-gray-500">Disposal Value:</span>
                  <span className="ml-1 text-gray-800 font-medium">£2.5K</span>
                </div>
                <div>
                  <span className="text-gray-500">Maint. Savings:</span>
                  <span className="ml-1 text-green-600 font-medium">£18K/year</span>
                </div>
                <div>
                  <span className="text-gray-500">Replacement:</span>
                  <span className="ml-1 text-blue-600 font-medium">Modern POS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. AI Strategy Agent - Autonomous Capital Planning */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">4</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">AI Strategy Agent - Autonomous Planning</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            AI Strategy Agent prepares capital cases, runs simulations and recommends prioritization of renewals/refurbs autonomously, 
            accelerating governance.
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-sm font-semibold text-orange-800">Autonomous AI Agent Active</h3>
            </div>
            <p className="text-xs text-orange-700 mb-2">
              The AI Strategy Agent continuously analyzes portfolio scenarios, generates business cases, 
              and provides prioritized recommendations with confidence scores.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-600 font-medium">Running 24/7 Portfolio Optimization</span>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-3">
            {AI_RECOMMENDATIONS.map((rec) => (
              <div key={rec.id} className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-gray-800">{rec.title}</h3>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {rec.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-gray-500 mb-1">Capex Required</div>
                    <div className="font-bold text-gray-800">£{rec.capexRequired.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-gray-500 mb-1">Expected ROI</div>
                    <div className="font-bold text-green-700">{rec.roi}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">AI Confidence:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-green-600">{rec.confidence}%</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors">
                    Review Case
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Runner */}
          <div className="mt-4 bg-white border rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Simulations</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Portfolio Scenario Analysis</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '75%' }}/>
                  </div>
                  <span className="text-gray-500">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Risk vs Cost Optimization</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: '100%' }}/>
                  </div>
                  <span className="text-green-600 font-medium">Complete</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Budget Impact Modeling</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div className="bg-purple-500 h-1 rounded-full" style={{ width: '45%' }}/>
                  </div>
                  <span className="text-gray-500">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Information Management Section */}
      <div className="mt-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 flex-grow bg-gradient-to-r from-cyan-400 to-blue-600 rounded"></div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Information Management</h2>
          <div className="h-1 flex-grow bg-gradient-to-l from-cyan-400 to-blue-600 rounded"></div>
        </div>
      </div>

      {/* Asset Information Management - 4 Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Golden Asset Record & Master Data */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-cyan-600 font-bold text-sm">1</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">Golden Asset Record & Master Data</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Creates a golden asset record consolidating metadata, documentation, warranties, and master data. 
            Ensures trustworthy asset information.
          </p>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-sm font-semibold text-cyan-800">Consolidated Asset Records</h3>
            </div>
            <p className="text-xs text-cyan-700">
              Single source of truth for all asset information across systems (CMMS, eM+, SAP). 
              Automatically consolidates data from multiple sources into one trusted record.
            </p>
          </div>

          {/* Asset Record Examples */}
          <div className="space-y-3">
            <div className="bg-white border-2 border-cyan-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Refrigeration Unit - RF-3421</h3>
                  <p className="text-xs text-gray-500">Location: Store 12, Zone A</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                  ✓ Verified
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-500">Manufacturer:</span>
                  <span className="ml-1 text-gray-800 font-medium">Carrier</span>
                </div>
                <div>
                  <span className="text-gray-500">Model:</span>
                  <span className="ml-1 text-gray-800 font-medium">38CK050</span>
                </div>
                <div>
                  <span className="text-gray-500">Install Date:</span>
                  <span className="ml-1 text-gray-800 font-medium">2015-03-12</span>
                </div>
                <div>
                  <span className="text-gray-500">Warranty:</span>
                  <span className="ml-1 text-orange-600 font-medium">Expired</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-2 mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Data Completeness</span>
                  <span className="text-xs font-bold text-green-600">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '96%' }}/>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">📄 Manual (PDF)</span>
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">🔧 Maint. History</span>
                <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">📊 Performance</span>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Master Data Consolidation</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">CMMS Records</span>
                  <span className="text-green-600 font-medium">✓ Synced (2 min ago)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">eM+ Platform</span>
                  <span className="text-green-600 font-medium">✓ Synced (5 min ago)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SAP Integration</span>
                  <span className="text-green-600 font-medium">✓ Synced (1 min ago)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Document Repository</span>
                  <span className="text-blue-600 font-medium">142 docs linked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Data Quality Diagnostics */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">2</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">Data Quality Diagnostics</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Diagnoses missing asset attributes, data mismatches between CMMS/eM+/SAP and inconsistencies from projects→ops.
          </p>

          {/* Data Quality Issues */}
          <div className="space-y-3 mb-4">
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Missing Critical Attributes</h3>
                  <p className="text-xs text-red-600 mt-1">18 assets missing warranty information</p>
                </div>
                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded font-bold">High</span>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                <span className="text-red-700">Affected: HVAC (8), Refrigeration (6), Electrical (4)</span>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-orange-800">CMMS ↔ SAP Mismatch</h3>
                  <p className="text-xs text-orange-600 mt-1">12 assets with conflicting cost center data</p>
                </div>
                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded font-bold">Medium</span>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                <span className="text-orange-700">Impact: Budget allocation, reporting accuracy</span>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Project→Ops Handover Gaps</h3>
                  <p className="text-xs text-yellow-600 mt-1">5 new assets incomplete documentation</p>
                </div>
                <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded font-bold">Medium</span>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                <span className="text-yellow-700">Recent installations missing commissioning reports</span>
              </div>
            </div>
          </div>

          {/* Data Quality Metrics */}
          <div className="bg-white border rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">System-Level Data Quality</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">CMMS Completeness</span>
                  <span className="text-gray-800 font-medium">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '89%' }}/>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">eM+ Data Accuracy</span>
                  <span className="text-gray-800 font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}/>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">SAP Integration Health</span>
                  <span className="text-gray-800 font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}/>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Cross-System Consistency</span>
                  <span className="text-gray-800 font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}/>
                </div>
              </div>
            </div>
          </div>

          {/* Mismatch Details */}
          <div className="bg-white border rounded-lg p-3 mt-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Mismatch Detections</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-800 font-medium">Asset ID mismatch</span>
                  <span className="text-gray-500 ml-2">CMMS vs eM+</span>
                </div>
                <span className="text-red-600">8 found</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-800 font-medium">Location discrepancy</span>
                  <span className="text-gray-500 ml-2">SAP vs Field Data</span>
                </div>
                <span className="text-orange-600">4 found</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-800 font-medium">Duplicate records</span>
                  <span className="text-gray-500 ml-2">Cross-system</span>
                </div>
                <span className="text-yellow-600">3 found</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Predictive Data Quality Management */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">3</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">Predictive Data Quality Management</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Predicts data quality degradation and criticality-based data risks.
          </p>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-sm font-semibold text-teal-800">AI-Powered Quality Prediction</h3>
            </div>
            <p className="text-xs text-teal-700">
              Machine learning models analyze historical data patterns to predict future quality degradation 
              and identify high-risk asset records before they impact operations.
            </p>
          </div>

          {/* Degradation Predictions */}
          <div className="space-y-3">
            <div className="bg-white border-2 border-red-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">High Risk - Critical Assets</h3>
                  <p className="text-xs text-gray-500">Predicted quality degradation in 30 days</p>
                </div>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">
                  Risk: 85%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Affected Assets:</span>
                  <span className="ml-1 text-red-600 font-bold">14</span>
                </div>
                <div>
                  <span className="text-gray-500">Asset Types:</span>
                  <span className="ml-1 text-gray-800 font-medium">HVAC, Refrigeration</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                ⚠️ Missing maintenance records trend detected. Quality score expected to drop from 94% to 76%.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Medium Risk - Documentation Decay</h3>
                  <p className="text-xs text-gray-500">Predicted degradation in 60 days</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold">
                  Risk: 62%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Affected Assets:</span>
                  <span className="ml-1 text-orange-600 font-bold">27</span>
                </div>
                <div>
                  <span className="text-gray-500">Root Cause:</span>
                  <span className="ml-1 text-gray-800 font-medium">Warranty expiry</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
                📄 Warranty documents approaching expiry without renewal tracking in place.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Criticality-Based Risk Matrix</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-700">Critical Assets (High Risk)</span>
                  </div>
                  <span className="text-red-600 font-bold">14 assets</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-700">Critical Assets (Medium Risk)</span>
                  </div>
                  <span className="text-orange-600 font-bold">8 assets</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-700">Non-Critical (High Risk)</span>
                  </div>
                  <span className="text-yellow-600 font-bold">19 assets</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-700">Low Risk (All Types)</span>
                  </div>
                  <span className="text-green-600 font-bold">587 assets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Steward Agent */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-sm">4</span>
            </div>
            <h2 className="text-lg font-bold text-[#005BAC]">Data Steward Agent - Autonomous Quality Control</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Data Steward Agent auto-corrects asset records, fixes inconsistencies and maintains taxonomy compliance.
          </p>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-sm font-semibold text-emerald-800">Autonomous Data Correction Agent</h3>
            </div>
            <p className="text-xs text-emerald-700 mb-2">
              AI-powered agent continuously monitors, validates, and auto-corrects asset data across all systems. 
              Maintains taxonomy standards and enforces data governance policies 24/7.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-600 font-medium">Active: Processing 1,247 validations/hour</span>
            </div>
          </div>

          {/* Recent Auto-Corrections */}
          <div className="space-y-3 mb-4">
            <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-green-800">Auto-Corrected: Asset ID Format</h3>
                <span className="text-xs text-green-600">2 min ago</span>
              </div>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>Before:</strong> RF3421, rf-3422, Rf_3423</p>
                <p><strong>After:</strong> RF-3421, RF-3422, RF-3423</p>
                <p className="text-green-600 mt-1">✓ Standardized to taxonomy: [TYPE]-[NUMBER]</p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-blue-800">Fixed: CMMS↔SAP Mismatch</h3>
                <span className="text-xs text-blue-600">8 min ago</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Issue:</strong> Cost center 4200 (CMMS) vs 4201 (SAP)</p>
                <p><strong>Resolution:</strong> Verified SAP as authoritative source</p>
                <p className="text-blue-600 mt-1">✓ CMMS updated to 4201, audit trail created</p>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-purple-800">Enhanced: Missing Attributes</h3>
                <span className="text-xs text-purple-600">15 min ago</span>
              </div>
              <div className="text-xs text-purple-700 space-y-1">
                <p><strong>Action:</strong> Retrieved warranty data from manufacturer portal</p>
                <p><strong>Result:</strong> 6 assets enriched with expiry dates</p>
                <p className="text-purple-600 mt-1">✓ Data completeness: 82% → 96%</p>
              </div>
            </div>
          </div>

          {/* Agent Activity Dashboard */}
          <div className="bg-white border rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Agent Activity (Last 24h)</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-green-600">847</div>
                <div className="text-xs text-gray-600">Auto-Corrections</div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-blue-600">95</div>
                <div className="text-xs text-gray-600">Mismatches Fixed</div>
              </div>
              <div className="bg-purple-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-purple-600">142</div>
                <div className="text-xs text-gray-600">Attributes Enriched</div>
              </div>
              <div className="bg-orange-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-orange-600">23</div>
                <div className="text-xs text-gray-600">Escalated Issues</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxonomy Compliance</span>
                <span className="text-green-600 font-bold">99.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cross-System Consistency</span>
                <span className="text-blue-600 font-bold">97.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Auto-Correction Accuracy</span>
                <span className="text-green-600 font-bold">98.5%</span>
              </div>
            </div>
          </div>

          {/* Pending Manual Review */}
          <div className="bg-yellow-50 border rounded-lg p-3 mt-3">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Requiring Manual Review</h3>
            <div className="space-y-1 text-xs text-yellow-700">
              <p>• 5 assets with conflicting manufacturer data (confidence &lt; 80%)</p>
              <p>• 3 duplicate records requiring business decision</p>
              <p>• 2 location updates pending physical verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insight Panel */}
      <div className="bp-card p-6 shadow-bp bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-bold text-[#005BAC] mb-2">Strategic Insight Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              The Asset Strategy framework provides a comprehensive, AI-driven approach to lifecycle management across your retail estate. 
              By establishing a consistent baseline (1), continuously monitoring performance and risks (2), using predictive models for optimal timing (3), 
              and leveraging autonomous AI agents for capital planning (4), you can make data-driven decisions that maximize asset value while minimizing risk.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">£308K</div>
                <div className="text-xs text-gray-600">Potential Savings Identified</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-xs text-gray-600">AI Recommendation Accuracy</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">2.2 yrs</div>
                <div className="text-xs text-gray-600">Avg Payback Period</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-colors z-40 group"
      >
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full blink-live-data"></div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Asset Strategy AI Assistant
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
