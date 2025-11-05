import React, { useState } from 'react';
import { Category, Recommendation } from '../types';
import { StoreLayoutMap } from './StoreLayoutMap';
import { Store3DLayoutMap } from './Store3DLayoutMap';
import { PlanogramTracker } from './PlanogramTracker';
import { KpiPanel } from './KpiGrid';
import { AiRecommendations } from './AiRecommendations';
import { InsightsAndAlerts } from './ActionableInsights';
import { EquipmentMonitor } from './Equipment';
import { ChatInterface } from './ChatInterface';

type StoreManagerDashboardProps = {
  selectedCategory: Category;
  recommendations: Recommendation[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: string) => void;
};

export const StoreManagerDashboard: React.FC<StoreManagerDashboardProps> = ({ selectedCategory, recommendations, onCreateTask, onIgnoreRecommendation }) => {
  const filteredRecommendations = recommendations.filter(r => r.category === selectedCategory);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <div className="h-full w-full flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Operations</h1>
          <p className="text-gray-600 font-medium">Real-time insights for {selectedCategory} category</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full blink-live-data"></div>
            <span className="text-sm font-medium text-gray-700 blink-slow">Live Data</span>
          </div>
          <div className="bg-bp-green-50 text-bp-green-700 px-3 py-2 rounded-xl border border-bp-green-200">
            <span className="text-sm font-semibold">{selectedCategory}</span>
          </div>
          {/* AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-bp-green-600 to-bp-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
            title="Ask AI Assistant"
          >
            <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-semibold">Ask AI</span>
          </button>
        </div>
      </div>

      {/* --- ROW 1: Store Layout & Planogram --- */}
      <div className="flex flex-row gap-6">
        {/* Store Layout Panel (33% width) */}
        <div className="w-1/3 bp-card p-6 shadow-bp flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-bp-green-600">Store Layout</h2>
            <div className="w-2 h-2 bg-green-500 rounded-full blink-slow"></div>
          </div>
          <StoreLayoutMap />
        </div>
        
        {/* Planogram Tracker Panel (67% width) */}
        <div className="w-2/3 bp-card p-6 shadow-bp flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-bp-green-600">Planogram Analysis</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Optimized</span>
          </div>
          <PlanogramTracker selectedCategory={selectedCategory} />
          {/* <Store3DLayoutMap /> */}
        </div>
      </div>

      {/* --- ROW 2: KPIs & Equipment Monitor --- */}
      <div className="grid grid-cols-2 gap-6">
        {/* KPI Panel */}
        <div className="bp-card p-6 shadow-bp">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-bp-green-600">Key Performance Indicators</h2>
            <svg className="w-5 h-5 text-bp-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <KpiPanel />
        </div>
        
        {/* Equipment Monitor Panel */}
        <div className="bp-card p-6 shadow-bp flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-bp-green-600">Retail Assets Monitoring</h2>
            <svg className="w-5 h-5 text-bp-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div className="flex-grow -mr-3 pr-3">
            <EquipmentMonitor />
          </div>
        </div>
      </div>

      {/* --- ROW 3: AI Recs & Insights --- */}
      <div className="grid grid-cols-2 gap-6 pb-4">
        {/* AI Recommendations Panel */}
        <div className="bp-card p-6 shadow-bp flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-bp-green-600">AI Recommendations</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full blink-live-data"></div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium blink-slow">
                {filteredRecommendations.length} Active
              </span>
            </div>
          </div>
          <div className="flex-grow -mr-3 pr-3">
            <AiRecommendations 
              recommendations={filteredRecommendations} 
              onCreateTask={onCreateTask}
              onIgnoreRecommendation={onIgnoreRecommendation}
            />
          </div>
        </div>
        
        {/* Insights & Alerts Panel */}
        <div className="bp-card p-6 shadow-bp flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-bp-green-600">Insights & Alerts</h2>
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-grow -mr-3 pr-3">
            <InsightsAndAlerts selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-bp-green-600 to-bp-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40 flex items-center justify-center group"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Notification badge for new suggestions */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </div>
        </button>
      )}
    </div>
  );
};