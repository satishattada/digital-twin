import React, { useState } from 'react';
import { Category, Task, OpsInsight, OpsAlert } from "../types"
import { OpsTaskQueue } from './OpsTaskQueue';
import { OpsShelfInventoryStatus } from './OpsShelfInventoryStatus';
import { OpsInventoryMovementTracker } from './OpsInventoryMovementTracker';
import { OpsAlerts } from './OpsAlerts';
import { OpsKpiDashboard } from './OpsKpiDashboard';
import { OpsAiInsights } from './OpsAiInsights';
import { ChatInterface } from './ChatInterface';

type OperationsManagerDashboardProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedCategory: Category;
  selectedStore: string;
  selectedSiteId: string;
  selectedTimePeriod: string;
  insights: OpsInsight[];
  alerts: OpsAlert[];
  onCreateTaskFromInsight: (insight: OpsInsight) => void;
  onIgnoreInsight: (id: number) => void;
  onDismissAlert: (id: number) => void;
};

export const OperationsManagerDashboard: React.FC<OperationsManagerDashboardProps> = ({
  tasks,
  setTasks,
  selectedCategory,
  selectedStore,
  selectedSiteId,
  selectedTimePeriod,
  insights,
  alerts,
  onCreateTaskFromInsight,
  onIgnoreInsight,
  onDismissAlert,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-[3fr_4fr_3fr] gap-3">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-3 min-h-0">
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col">
          <OpsShelfInventoryStatus selectedCategory={selectedCategory} selectedStore={selectedStore} selectedSiteId={selectedSiteId}/>
        </div>
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col">
          <OpsInventoryMovementTracker selectedCategory={selectedCategory} selectedTimePeriod={selectedTimePeriod} selectedSiteId={selectedSiteId}/>
        </div>
      </div>

      {/* --- Column 2: Task Queue --- */}
      <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col h-full">
        <OpsTaskQueue tasks={tasks} setTasks={setTasks} />
      </div>
      
      {/* --- Column 3 --- */}
      <div className="flex flex-col gap-3 h-full min-h-0">
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col" style={{flex: '4 1 0%'}}>
            <OpsKpiDashboard selectedCategory={selectedCategory} />
        </div>
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col" style={{flex: '3 1 0%'}}>
            <OpsAlerts 
                alerts={alerts}
                onDismiss={onDismissAlert}
            />
        </div>
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col" style={{flex: '3 1 0%'}}>
            <OpsAiInsights 
                insights={insights}
                onCreateTask={onCreateTaskFromInsight}
                onIgnore={onIgnoreInsight}
            />
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
          Operations AI Assistant
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