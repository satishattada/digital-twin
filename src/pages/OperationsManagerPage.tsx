import React from "react";
import { OperationsManagerDashboard } from "../components/OperationsManagerDashboard";
import { Category, Task, OpsInsight, OpsAlert } from "../types";

interface OperationsManagerPageProps {
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
}

export const OperationsManagerPage: React.FC<OperationsManagerPageProps> = ({
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
  return (
    <OperationsManagerDashboard
      tasks={tasks}
      setTasks={setTasks}
      selectedCategory={selectedCategory}
      selectedStore={selectedStore}
      selectedSiteId={selectedSiteId}
      selectedTimePeriod={selectedTimePeriod}
      insights={insights}
      alerts={alerts}
      onCreateTaskFromInsight={onCreateTaskFromInsight}
      onIgnoreInsight={onIgnoreInsight}
      onDismissAlert={onDismissAlert}
    />
  );
};
