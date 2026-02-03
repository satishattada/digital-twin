import React from "react";
import { StoreManagerDashboard } from "../components/StoreManagerDashboard";
import { Category, Recommendation, Task } from "../types";

interface StoreManagerPageProps {
  selectedCategory: Category;
  recommendations: Recommendation[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: string) => void;
}

export const StoreManagerPage: React.FC<StoreManagerPageProps> = ({
  selectedCategory,
  recommendations,
  onCreateTask,
  onIgnoreRecommendation,
}) => {
  return (
    <StoreManagerDashboard
      selectedCategory={selectedCategory}
      recommendations={recommendations}
      onCreateTask={onCreateTask}
      onIgnoreRecommendation={onIgnoreRecommendation}
    />
  );
};
