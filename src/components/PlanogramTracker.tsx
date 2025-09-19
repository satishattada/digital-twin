import React from "react";
import { Category } from "../types";
import { MOCK_PLANOGRAM_DATA } from "../constants";
import { PlanogramView } from "./PlanogramView";

type PlanogramTrackerProps = {
  selectedCategory: Category;
};

const getComplianceColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-600";
};

export const PlanogramTracker: React.FC<PlanogramTrackerProps> = ({
  selectedCategory,
}) => {
  const data = MOCK_PLANOGRAM_DATA[selectedCategory];
  const complianceColor = getComplianceColor(data.current.complianceScore);

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="flex">
        <h2 className="text-lg font-bold text-[#005BAC] mb-2 shrink-0">
          Planogram Compliance Tracker
        </h2>
        <div className="text-sm text-gray-500 mb-2 shrink-0 ml-auto">
          % Match to Expected Layout ({selectedCategory}):
          <span className={`font-bold text-lg ml-2 ${complianceColor}`}>
            {data.current.complianceScore}%
          </span>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
            Current View
          </h3>
          <PlanogramView data={data.current} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
            AI Optimized Planogram
          </h3>
          <PlanogramView data={data.ai} isOptimized={true} />
        </div>
      </div>
    </div>
  );
};
