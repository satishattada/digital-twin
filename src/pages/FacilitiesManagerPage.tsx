import React from "react";
import { FacilitiesManagerDashboardWrapper } from "../components/FacilitiesManagerDashboard";

interface FacilitiesManagerPageProps {
  selectedStore: string;
  selectedCategory: string;
}

export const FacilitiesManagerPage: React.FC<FacilitiesManagerPageProps> = ({
  selectedStore,
  selectedCategory,
}) => {
  return (
    <FacilitiesManagerDashboardWrapper
      selectedStore={selectedStore}
      selectedCategory={selectedCategory}
    />
  );
};
