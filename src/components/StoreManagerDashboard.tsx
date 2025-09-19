import React from 'react';
import { Category, Recommendation } from '../types';
import { StoreLayoutMap } from './StoreLayoutMap';
import { Store3DLayoutMap } from './Store3DLayoutMap';
import { PlanogramTracker } from './PlanogramTracker';
import { KpiPanel } from './KpiGrid';
import { AiRecommendations } from './AiRecommendations';
import { InsightsAndAlerts } from './ActionableInsights';
import { EquipmentMonitor } from './Equipment';

type StoreManagerDashboardProps = {
  selectedCategory: Category;
  recommendations: Recommendation[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: number) => void;
};

export const StoreManagerDashboard: React.FC<StoreManagerDashboardProps> = ({ selectedCategory, recommendations, onCreateTask, onIgnoreRecommendation }) => {
  const filteredRecommendations = recommendations.filter(r => r.category === selectedCategory);
  
  return (
    <div className="h-full w-full flex flex-col gap-6">
      {/* --- ROW 1: Store Layout & Planogram --- */}
      <div className="flex flex-row gap-6">
        {/* Store Layout Panel (33% width) */}
        <div className="w-1/3 rounded-lg bg-gray-50 border p-4 shadow-sm flex flex-col">
          <StoreLayoutMap />
        </div>
        
        {/* Planogram Tracker Panel (67% width) */}
        <div className="w-2/3 rounded-lg bg-gray-50 border p-4 shadow-sm flex flex-col">
          <PlanogramTracker selectedCategory={selectedCategory} />
          {/* <Store3DLayoutMap /> */}
        </div>
      </div>

      {/* --- ROW 2: KPIs & Equipment Monitor --- */}
      <div className="grid grid-cols-2 gap-6">
        {/* KPI Panel */}
        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm">
           <h2 className="text-lg font-bold text-[#005BAC] mb-2">Key Performance Indicators</h2>
           <KpiPanel />
        </div>
        
        {/* Equipment Monitor Panel */}
        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm flex flex-col min-h-0">
          <h2 className="text-lg font-bold text-[#005BAC] mb-2 shrink-0">Retail Assets Monitoring</h2>
          <div className="flex-grow -mr-3 pr-3">
            <EquipmentMonitor />
          </div>
        </div>
      </div>

      {/* --- ROW 3: AI Recs & Insights --- */}
      <div className="grid grid-cols-2 gap-6 pb-4">
        {/* AI Recommendations Panel */}
        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm flex flex-col min-h-0">
          <h2 className="text-lg font-bold text-[#005BAC] mb-2 shrink-0">Shelfie Recommendations</h2>
          <div className="flex-grow -mr-3 pr-3">
            <AiRecommendations 
              recommendations={filteredRecommendations} 
              onCreateTask={onCreateTask}
              onIgnoreRecommendation={onIgnoreRecommendation}
            />
          </div>
        </div>
        
        {/* Insights & Alerts Panel */}
        <div className="rounded-lg bg-gray-50 border p-4 shadow-sm flex flex-col min-h-0">
          <h2 className="text-lg font-bold text-[#005BAC] mb-2 shrink-0">Insights & Alerts</h2>
          <div className="flex-grow -mr-3 pr-3">
            <InsightsAndAlerts selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};