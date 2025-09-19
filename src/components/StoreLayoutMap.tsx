import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { MOCK_STORE_LAYOUT_DATA } from "../constants";
import { HeatmapZoneData } from "../types";
import Store3DLayout from "./Store3DLayout";

export const HeatmapTooltip: React.FC<{ 
  zone: HeatmapZoneData; 
  mousePosition: { x: number; y: number } | null;
  isVisible: boolean;
}> = ({ zone, mousePosition, isVisible }) => {
  if (!mousePosition || !isVisible) return null;

  const tooltipContent = (
    <section 
      className="fixed z-[9999] w-64 md:w-72 p-3 md:p-4 text-xs md:text-sm text-left text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl shadow-2xl border border-gray-600 pointer-events-none transition-opacity duration-200"
      style={{
        left: mousePosition.x + 10,
        top: mousePosition.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex items-center space-x-2 border-b border-gray-600 pb-2 md:pb-3 mb-2 md:mb-3">
        <span className="text-lg md:text-xl">📊</span>
        <h4 className="font-bold text-base md:text-lg text-cyan-300">
          {zone.name} Insights
        </h4>
      </div>

      <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
        <div className="bg-gray-700/50 p-2 md:p-3 rounded-md md:rounded-lg">
          <p className="font-semibold text-green-300 flex items-center mb-1 md:mb-2">
            <span className="mr-2">📈</span>
            SKU Performance
          </p>
          <p className="pl-4 md:pl-6 text-gray-300">🏆 Top: <span className="text-green-400 font-medium">{zone.insights.topSku}</span></p>
          <p className="pl-4 md:pl-6 text-gray-300">📉 Low: <span className="text-red-400 font-medium">{zone.insights.lowPerformer}</span></p>
        </div>
        <div className="bg-gray-700/50 p-2 md:p-3 rounded-md md:rounded-lg">
          <p className="font-semibold text-blue-300 flex items-center mb-1 md:mb-2">
            <span className="mr-2">🛠️</span>
            Layout Suggestion
          </p>
          <p className="pl-4 md:pl-6 text-gray-300">{zone.insights.layoutSuggestion}</p>
        </div>
        <div className="bg-gray-700/50 p-2 md:p-3 rounded-md md:rounded-lg">
          <p className="font-semibold text-purple-300 flex items-center mb-1 md:mb-2">
            <span className="mr-2">🧠</span>
            AI Rationale
          </p>
          <p className="pl-4 md:pl-6 text-gray-300">{zone.insights.aiRationale}</p>
        </div>
      </div>
    </section>
  );

  return createPortal(tooltipContent, document.body);
};



const Zone: React.FC<{ 
  zone: HeatmapZoneData; 
  isHeatmapOn: boolean;
  onMouseEnter: (zone: HeatmapZoneData, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (event: React.MouseEvent) => void;
}> = ({
  zone,
  isHeatmapOn,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}) => {
  const categoryStyles: Record<string, { bg: string; gradient: string; icon: string; textColor: string }> = {
    Produce: { 
      bg: "bg-gradient-to-br from-green-100 to-green-200", 
      gradient: "from-green-400 to-green-600",
      icon: "🥬", 
      textColor: "text-green-800" 
    },
    Meat: { 
      bg: "bg-gradient-to-br from-red-100 to-red-200", 
      gradient: "from-red-400 to-red-600",
      icon: "🥩", 
      textColor: "text-red-800" 
    },
    Bakery: { 
      bg: "bg-gradient-to-br from-orange-100 to-orange-200", 
      gradient: "from-orange-400 to-orange-600",
      icon: "🍞", 
      textColor: "text-orange-800" 
    },
    Dairy: { 
      bg: "bg-gradient-to-br from-blue-100 to-blue-200", 
      gradient: "from-blue-400 to-blue-600",
      icon: "🥛", 
      textColor: "text-blue-800" 
    },
    Pantry: { 
      bg: "bg-gradient-to-br from-yellow-100 to-yellow-200", 
      gradient: "from-yellow-400 to-yellow-600",
      icon: "🥫", 
      textColor: "text-yellow-800" 
    },
    Frozen: { 
      bg: "bg-gradient-to-br from-sky-100 to-sky-200", 
      gradient: "from-sky-400 to-sky-600",
      icon: "🧊", 
      textColor: "text-sky-800" 
    },
    Snacks: { 
      bg: "bg-gradient-to-br from-purple-100 to-purple-200", 
      gradient: "from-purple-400 to-purple-600",
      icon: "🍿", 
      textColor: "text-purple-800" 
    },
    Beverages: { 
      bg: "bg-gradient-to-br from-cyan-100 to-cyan-200", 
      gradient: "from-cyan-400 to-cyan-600",
      icon: "🥤", 
      textColor: "text-cyan-800" 
    },
    Health: { 
      bg: "bg-gradient-to-br from-teal-100 to-teal-200", 
      gradient: "from-teal-400 to-teal-600",
      icon: "💊", 
      textColor: "text-teal-800" 
    },
    "Baby/Pet": { 
      bg: "bg-gradient-to-br from-pink-100 to-pink-200", 
      gradient: "from-pink-400 to-pink-600",
      icon: "🍼", 
      textColor: "text-pink-800" 
    },
    Household: { 
      bg: "bg-gradient-to-br from-emerald-100 to-emerald-200", 
      gradient: "from-emerald-400 to-emerald-600",
      icon: "🧽", 
      textColor: "text-emerald-800" 
    },
    POS: { 
      bg: "bg-gradient-to-br from-indigo-100 to-indigo-200", 
      gradient: "from-indigo-400 to-indigo-600",
      icon: "💳", 
      textColor: "text-indigo-800" 
    },
    default: { 
      bg: "bg-gradient-to-br from-gray-100 to-gray-200", 
      gradient: "from-gray-400 to-gray-600",
      icon: "📦", 
      textColor: "text-gray-800" 
    },
  };

  const categoryKey =
    Object.keys(categoryStyles).find((key) => zone.name.includes(key)) ||
    "default";
  
  const categoryStyle = categoryStyles[categoryKey];

  const heatmapColors = {
    low: "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700 shadow-lg",
    medium: "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700 shadow-lg",
    high: "bg-gradient-to-br from-red-400 to-red-600 border-red-700 shadow-lg",
  };

  const staticClasses = `${categoryStyle.bg} border-2 border-white shadow-md hover:shadow-lg transform hover:scale-105`;
  const heatmapClasses = `${heatmapColors[zone.engagement]} border-2`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-1 md:p-2 rounded-md md:rounded-lg text-center transition-all duration-300 cursor-pointer ${
        zone.gridClass
      } ${isHeatmapOn ? heatmapClasses : staticClasses}`}
      onMouseEnter={(e) => onMouseEnter(zone, e)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <div className="flex flex-col items-center space-y-0.5 md:space-y-1">
        <span className="text-sm md:text-lg">{categoryStyle.icon}</span>
        <span
          className={`text-xs md:text-sm font-bold leading-tight ${
            isHeatmapOn ? "text-white drop-shadow-md" : categoryStyle.textColor
          }`}
        >
          {zone.name.replace(/\s+/g, '\n')}
        </span>
      </div>
    </div>
  );
};

const HeatmapLegend: React.FC = () => (
  <div className="flex flex-col lg:justify-start space-y-2 lg:space-y-0  xl:space-x-6 text-sm font-semibold bg-white p-3 rounded-lg shadow-md border w-full lg:w-auto">
    <span className="font-bold text-gray-700 flex items-center text-xs md:text-sm">
      <span className="mr-2">🔥</span>
      <span className="hidden sm:inline">Engagement Heatmap:</span>
      <span className="sm:hidden">Heatmap:</span>
    </span>
    <div className="flex items-center justify-between lg:justify-start engagement-legend space-x-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-blue-400 to-blue-600 border border-blue-700 rounded-md shadow-sm"></div>
        <span className="text-blue-700 font-medium text-xs md:text-sm">Low</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-700 rounded-md shadow-sm"></div>
        <span className="text-yellow-700 font-medium text-xs md:text-sm">Medium</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-red-400 to-red-600 border border-red-700 rounded-md shadow-sm"></div>
        <span className="text-red-700 font-medium text-xs md:text-sm">High</span>
      </div>
    </div>
  </div>
);

export const StoreLayoutMap: React.FC = () => {
 const [isHeatmapOn, setHeatmapOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<HeatmapZoneData | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (zone: HeatmapZoneData, event: React.MouseEvent) => {
    if (isHeatmapOn && zone.insights.topSku !== "N/A") {
      setHoveredZone(zone);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredZone(null);
    setMousePosition(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredZone) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };


  // Split MOCK_STORE_LAYOUT_DATA into 4 groups
  const zonesPerGroup = Math.ceil(MOCK_STORE_LAYOUT_DATA.length / 5);
  const zoneDataGroups = Array.from({ length: 5 }, (_, i) =>
    MOCK_STORE_LAYOUT_DATA.slice(i * zonesPerGroup, (i + 1) * zonesPerGroup)
  );

  const zoneData = zoneDataGroups.map((group, i) => {
    const cubeData = group.map((zoneData, i) => {
      const baseBgColors: Record<string, string> = {
        Produce: "bg-green-100",
        Meat: "bg-red-100",
        Bakery: "bg-orange-100",
        Dairy: "bg-blue-100",
        Pantry: "bg-yellow-100",
        Frozen: "bg-sky-200",
        Snacks: "bg-orange-200",
        Beverages: "bg-cyan-100",
        Health: "bg-teal-200",
        "Baby/Pet": "bg-pink-100",
        Household: "bg-green-200",
        POS: "bg-purple-200",
        default: "bg-gray-200",
      };
      const categoryKey =
        Object.keys(baseBgColors).find((key) => zoneData.name.includes(key)) ||
        "default";
      const staticClasses = `${baseBgColors[categoryKey]} border-gray-300`;
      return {
        className: `cube${i}`,
        faceColor: staticClasses,
        faces: { front: zoneData.name },
        zone: zoneData,
      };
    });

    const blockData = { className: `block${i}`, cubes: cubeData };
    return blockData;
  });
  return (
    <>
          {/* Tooltip rendered outside all divs */}
      <HeatmapTooltip 
        zone={hoveredZone!} 
        mousePosition={mousePosition}
        isVisible={!!hoveredZone && isHeatmapOn}
      />
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-sm md:text-lg">🏪</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Store Layout</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 w-full lg:w-auto"
        >
          <span>🎯</span>
          <span>3D View</span>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="bg-white w-full h-full flex flex-col z-10 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-lg lg:text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl lg:text-3xl font-bold text-gray-800">
                    3D Store Layout
                  </h3>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                  {isHeatmapOn && (
                    <div className="w-full lg:w-auto">
                      <HeatmapLegend />
                    </div>
                  )}
                  <label
                    htmlFor="heatmap-toggle-modal"
                    className="flex items-center cursor-pointer bg-white p-3 rounded-lg shadow-md border hover:shadow-lg transition-shadow w-full lg:w-auto justify-center lg:justify-start"
                  >
                    <span className="mr-4 text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">🗺️</span>
                      Heatmap Mode
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="heatmap-toggle-modal"
                        className="sr-only"
                        checked={isHeatmapOn}
                        onChange={() => setHeatmapOn(!isHeatmapOn)}
                      />
                      <div className={`block w-14 h-7 rounded-full transition-colors ${isHeatmapOn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform shadow-md ${
                          isHeatmapOn ? "translate-x-7" : ""
                        }`}
                      ></div>
                    </div>
                  </label>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-3xl lg:text-4xl text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 self-end lg:self-auto"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-scroll">
                <Store3DLayout storeData={zoneData.flat()} is3DHeatmapOn={isHeatmapOn}
                 onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-4 border-2 border-gray-300 rounded-xl shadow-lg flex flex-col">
         <div className="grid grid-cols-6 md:grid-cols-12 grid-rows-4 md:grid-rows-4 gap-1 md:gap-2 flex-grow p-1 md:p-2 bg-white rounded-lg shadow-inner overflow-hidden">
          {MOCK_STORE_LAYOUT_DATA.map((zone) => (
            <Zone 
              key={zone.id} 
              zone={zone} 
              isHeatmapOn={isHeatmapOn}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          ))}
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-200 space-y-4 lg:space-y-0">
          {isHeatmapOn && (
            <div className="w-full lg:w-auto">
              <HeatmapLegend />
            </div>
          )}
          <label
            htmlFor="heatmap-toggle"
            className="toggle-checkbox flex items-center cursor-pointer bg-white p-3 rounded-lg shadow-md border hover:shadow-lg transition-shadow w-full lg:w-auto justify-center lg:justify-start"
          >
            <span className="mr-4 text-xs md:text-sm font-medium text-gray-700 flex items-center">
              <span className="mr-2">🗺️</span>
              <span className="hidden sm:inline toggle-title ">Heatmap Mode</span>
              <span className="sm:hidden">Heatmap</span>
            </span>
            <div className="relative">
              <input
                type="checkbox"
                id="heatmap-toggle"
                className="sr-only "
                checked={isHeatmapOn}
                onChange={() => setHeatmapOn(!isHeatmapOn)}
              />
              <div className={`block w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors ${isHeatmapOn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 md:w-5 md:h-5 rounded-full transition-transform shadow-md ${
                  isHeatmapOn ? "translate-x-6 md:translate-x-7" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};
