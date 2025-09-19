import React from 'react';
import { Category, Task, OpsInsight, OpsAlert } from "../types"
import { OpsTaskQueue } from './OpsTaskQueue';
import { OpsShelfInventoryStatus } from './OpsShelfInventoryStatus';
import { OpsInventoryMovementTracker } from './OpsInventoryMovementTracker';
import { OpsAlerts } from './OpsAlerts';
import { OpsKpiDashboard } from './OpsKpiDashboard';
import { OpsAiInsights } from './OpsAiInsights';

type OperationsManagerDashboardProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedCategory: Category;
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
  selectedTimePeriod,
  insights,
  alerts,
  onCreateTaskFromInsight,
  onIgnoreInsight,
  onDismissAlert,
}) => {
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-[3fr_4fr_3fr] gap-3">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-3 min-h-0">
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col">
          <OpsShelfInventoryStatus selectedCategory={selectedCategory} />
        </div>
        <div className="rounded-lg bg-gray-50 border p-3 shadow-sm flex flex-col">
          <OpsInventoryMovementTracker selectedCategory={selectedCategory} selectedTimePeriod={selectedTimePeriod} />
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
    </div>
  );
};