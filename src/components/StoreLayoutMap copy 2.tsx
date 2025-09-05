import React, { useState } from "react";
import { MOCK_STORE_LAYOUT_DATA } from "../constants";
import { HeatmapZoneData } from "../types";
import Store3DLayout from "./Store3DLayout";

const HeatmapTooltip: React.FC<{ zone: HeatmapZoneData }> = ({ zone }) => (
  <div className="absolute bottom-full mb-2 w-64 p-3 text-sm text-left text-white bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
    <h4 className="font-bold text-base text-cyan-300 border-b border-gray-600 pb-1 mb-2">
      {zone.name} Insights
    </h4>

    <div className="space-y-2 text-xs">
      <div>
        <p className="font-semibold text-gray-300">✅ SKU Performance</p>
        <p className="pl-2">Top: {zone.insights.topSku}</p>
        <p className="pl-2">Low: {zone.insights.lowPerformer}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-300">🛠️ Layout Suggestion</p>
        <p className="pl-2">{zone.insights.layoutSuggestion}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-300">🧠 AI Rationale</p>
        <p className="pl-2">{zone.insights.aiRationale}</p>
      </div>
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-800 rotate-45"></div>
  </div>
);

const Zone: React.FC<{ zone: HeatmapZoneData; isHeatmapOn: boolean }> = ({
  zone,
  isHeatmapOn,
}) => {
  const baseBgColors: Record<string, string> = {
    Produce: "bg-green-100",
    Meat: "bg-red-100",
    Bakery: "bg-orange-100",
    Dairy: "bg-blue-100",
    Pantry: "bg-yellow-100",
    Frozen: "bg-sky-200",
    Snacks: "bg-orange-200",
    Beverages: "bg-cyan-100",
    Health: "bg-teal-100",
    "Baby/Pet": "bg-pink-100",
    Household: "bg-gray-200",
    default: "bg-gray-200",
  };
  const categoryKey =
    Object.keys(baseBgColors).find((key) => zone.name.includes(key)) ||
    "default";

  const heatmapColors = {
    low: "bg-blue-500/60 border-blue-700",
    medium: "bg-yellow-500/60 border-yellow-700",
    high: "bg-orange-500/60 border-orange-700",
  };

  const staticClasses = `${baseBgColors[categoryKey]} border-gray-300`;
  const heatmapClasses = `shadow-inner ${heatmapColors[zone.engagement]}`;

  return (
    <div
      className={`relative group flex items-center justify-center p-1 border rounded-sm text-center text-xs font-semibold transition-all duration-300 ${
        zone.gridClass
      } ${isHeatmapOn ? heatmapClasses : staticClasses}`}
    >
      <span
        className={`${isHeatmapOn ? "text-white font-bold" : "text-gray-700"}`}
      >
        {zone.name}
      </span>
      {isHeatmapOn && zone.insights.topSku !== "N/A" && (
        <HeatmapTooltip zone={zone} />
      )}
    </div>
  );
};

const HeatmapLegend: React.FC = () => (
  <div className="flex justify-start items-center space-x-4 text-xs font-semibold">
    <span className="font-bold">Heatmap:</span>
    <div className="flex items-center space-x-1.5">
      <div className="w-3 h-3 bg-blue-500/60 border border-blue-700 rounded-sm"></div>
      <span>Low</span>
    </div>
    <div className="flex items-center space-x-1.5">
      <div className="w-3 h-3 bg-yellow-500/60 border border-yellow-700 rounded-sm"></div>
      <span>Medium</span>
    </div>
    <div className="flex items-center space-x-1.5">
      <div className="w-3 h-3 bg-orange-500/60 border border-orange-700 rounded-sm"></div>
      <span>High</span>
    </div>
  </div>
);

export const StoreLayoutMap: React.FC = () => {
  const [isHeatmapOn, setHeatmapOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Split MOCK_STORE_LAYOUT_DATA into 4 groups
  const zonesPerGroup = Math.ceil(MOCK_STORE_LAYOUT_DATA.length / 5);
  const zoneDataGroups = Array.from({ length: 5}, (_, i) =>
    MOCK_STORE_LAYOUT_DATA.slice(i * zonesPerGroup, (i + 1) * zonesPerGroup)
  );

  const zoneData = zoneDataGroups.map((group, i)=> {
    const cubeData = group.map((zoneData, i) => {
      return { className: `cube${i}`, faces: { front: zoneData.name }  }
      });
    const blockData = {className: `block${i}`, cubes: cubeData}
    return blockData
  });
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#005BAC]">Store Layout</h2>
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
          >
            Open 3D View
          </button> */}
        </div>
        {/* {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-75"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="bg-white w-full h-full flex flex-col z-10">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                <h3 className="text-2xl font-bold text-gray-800">3D Store Layout</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-3xl text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 bg-gray-100 overflow-hidden">
                <Store3DLayout storeData={zoneData.flat()} />
              </div>
            </div>
          </div>
        )} */}
      </div>
      <div className="flex-grow min-h-0">
        <div className="w-full h-full bg-white p-2 border-2 border-gray-200 rounded-md flex flex-col">
          {/* Displaying the zones in 4 groups */}
          <div className="flex flex-wrap gap-4 flex-grow">
            {zoneDataGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1 flex-1">
                {group.map((zone) => (
                  <Zone key={zone.id} zone={zone} isHeatmapOn={isHeatmapOn} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            {isHeatmapOn ? <HeatmapLegend /> : <div />}
            <label
              htmlFor="heatmap-toggle"
              className="flex items-center cursor-pointer"
            >
              <span className="mr-3 text-sm font-medium text-gray-900">
                Heatmap Mode
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="heatmap-toggle"
                  className="sr-only"
                  checked={isHeatmapOn}
                  onChange={() => setHeatmapOn(!isHeatmapOn)}
                />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    isHeatmapOn ? "translate-x-6 bg-green-400" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
