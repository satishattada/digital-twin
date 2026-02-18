import React from "react";
import { FacilitiesManagerDashboardWrapper } from "../components/FacilitiesManagerDashboard";
import { Persona } from "../types";

interface FacilitiesManagerPageProps {
  selectedStore: string;
  selectedCategory: string;
  persona?: Persona;
}

export const FacilitiesManagerPage: React.FC<FacilitiesManagerPageProps> = ({
  selectedStore,
  selectedCategory,
  persona = "Site Manager",
}) => {
  return (
    <FacilitiesManagerDashboardWrapper
      selectedStore={selectedStore}
      selectedCategory={selectedCategory}
      persona={persona}
    />
  );
};
