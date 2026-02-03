import React from "react";
import { RegionalManagerDashboard } from "../components/RegionalManagerDashboard";
import { Category, Task, Recommendation, OpsInsight, OpsAlert } from "../types";

interface RegionalManagerPageProps {
  selectedStore: string;
  selectedCategory: Category;
  selectedTimePeriod: string;
  tasks: Task[];
  recommendations: Recommendation[];
  insights: OpsInsight[];
  alerts: OpsAlert[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: string) => void;
}

export const RegionalManagerPage: React.FC<RegionalManagerPageProps> = ({
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
  return (
    <RegionalManagerDashboard
      selectedStore={selectedStore}
      selectedCategory={selectedCategory}
      selectedTimePeriod={selectedTimePeriod}
      tasks={tasks}
      recommendations={recommendations}
      insights={insights}
      alerts={alerts}
      onCreateTask={onCreateTask}
      onIgnoreRecommendation={onIgnoreRecommendation}
    />
  );
};
