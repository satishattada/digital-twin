
import React from 'react';
import { Category, SpaceUtilizationSuggestion } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsShelfSpaceUtilizationProps = {
  selectedCategory: Category;
};

const getUsageColor = (usage: number) => {
    if (usage > 95) return 'bg-red-600'; // Overcrowded
    if (usage > 80) return 'bg-green-500'; // Well-utilized
    if (usage > 50) return 'bg-yellow-400'; // Okay
    return 'bg-blue-300'; // Underutilized
};

const Legend: React.FC = () => (
    <div className="flex justify-between items-center mt-1 text-[9px] font-semibold text-gray-500">
        <span>Underutilized</span>
        <span>Overcrowded</span>
    </div>
);

const Suggestion: React.FC<{suggestion: SpaceUtilizationSuggestion}> = ({suggestion}) => (
    <div className="flex justify-between items-center text-xs text-gray-700 bg-gray-100 p-1.5 rounded-md">
        <span>{suggestion.text}</span>
        <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-green-500" title="Accept Suggestion">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.09.044a2 2 0 002.243-1.253L10.5 15.25V8.25a2 2 0 00-2-2H6.5a2 2 0 00-2 2v2.333zM19 10.5a1.5 1.5 0 11-3 0v6a1.5 1.5 0 013 0v-6zM14 10.333v5.43a2 2 0 01-1.106 1.787l-.09.044a2 2 0 01-2.243-1.253L9.5 15.25V8.25a2 2 0 012-2h1.5a2 2 0 012 2v2.333z" />
                </svg>
            </button>
            <button className="text-gray-400 hover:text-red-500" title="Dismiss Suggestion">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.787l-.09-.044a2 2 0 00-2.243 1.253L9.5 4.75v6.999a2 2 0 002 2h1.5a2 2 0 002-2V9.667zM2 9.5a1.5 1.5 0 113 0v-6a1.5 1.5 0 01-3 0v6zM6 9.667v-5.43a2 2 0 011.106-1.787l.09-.044a2 2 0 012.243 1.253L10.5 4.75v6.999a2 2 0 01-2 2H6.5a2 2 0 01-2-2V9.667z" />
                </svg>
            </button>
        </div>
    </div>
);


export const OpsShelfSpaceUtilization: React.FC<OpsShelfSpaceUtilizationProps> = ({ selectedCategory }) => {
  const categoryData = MOCK_OPS_DATA[selectedCategory];
  // @ts-ignore - spaceUtilization not in all mock data yet
  const data = categoryData?.spaceUtilization || { zones: [], suggestions: [] };

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-md font-bold text-[#005BAC] mb-2">Shelf Space Utilization</h2>
        <div className="bg-gray-200 p-1 rounded-md">
            <div className="grid grid-cols-6 gap-1">
                {data.zones && data.zones.map((zone: any) => (
                    <div key={zone.id} className={`h-6 rounded-sm ${getUsageColor(zone.usage)}`} title={`Usage: ${zone.usage}%`}></div>
                ))}
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-300 via-yellow-400 via-green-500 to-red-600 rounded-full mt-1"></div>
            <Legend />
        </div>
        <div className="mt-2 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-600">AI Suggestions:</h3>
            {data.suggestions && data.suggestions.map((s: any) => <Suggestion key={s.id} suggestion={s} />)}
        </div>
    </div>
  );
};
