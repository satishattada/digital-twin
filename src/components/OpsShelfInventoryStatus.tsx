
import React from 'react';
import { Category, ShelfZone, InventorySuggestion } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsShelfInventoryStatusProps = {
  selectedCategory: Category;
};

const statusStyles = {
    Overstocked: { bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-900' },
    Understocked: { bg: 'bg-amber-200', border: 'border-amber-400', text: 'text-amber-900' },
    Optimized: { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900' },
    'Chronic Imbalance': { bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-900' },
};

const Zone: React.FC<{ zone: ShelfZone }> = ({ zone }) => {
    const styles = statusStyles[zone.status];
    return (
        <div className={`rounded-md py-2 px-2 text-center shadow-sm ${styles.bg} ${styles.text}`}>
            <p className={`text-sm font-semibold`}>{zone.name}</p>
            <p className={`text-xs`}>{zone.status}</p>
        </div>
    );
};

const Legend: React.FC = () => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
        <div className="flex items-center space-x-1.5">
            <div className={`w-3 h-3 rounded-sm bg-red-200 border border-red-400`}></div>
            <span>Overstocked</span>
        </div>
        <div className="flex items-center space-x-1.5">
            <div className={`w-3 h-3 rounded-sm bg-amber-200 border border-amber-400`}></div>
            <span>Understocked</span>
        </div>
        <div className="flex items-center space-x-1.5">
            <div className={`w-3 h-3 rounded-sm bg-green-200 border border-green-400`}></div>
            <span>Optimized</span>
        </div>
        <div className="flex items-center space-x-1.5">
            <div className={`w-3 h-3 rounded-sm bg-purple-200 border border-purple-400`}></div>
            <span>Chronic Imbalance</span>
        </div>
    </div>
);


const Suggestion: React.FC<{suggestion: InventorySuggestion}> = ({suggestion}) => (
    <div className="flex justify-between items-center text-sm text-gray-700 py-2 border-b border-gray-200 last:border-b-0 gap-2">
        <p className="flex-grow pr-2">{suggestion.text}</p>
        <div className="flex space-x-2 shrink-0">
            <button className="text-gray-400 hover:text-green-500 transition-colors" title="Good Suggestion">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM18.875 9.062c.28-.415.422-.904.422-1.437C19.297 6.25 18.25 5 16.906 5h-4.954a2.25 2.25 0 00-2.25 2.25v2.25c0 .53.212 1.023.582 1.383l3.418 3.418c.49.49.77.923.77 1.442v.375a.75.75 0 01-.75.75h-.375a.75.75 0 01-.75-.75v-.375c0-.519-.28-1.09-.77-1.442l-3.418-3.418A2.25 2.25 0 009.75 11.5H7.125a2.25 2.25 0 00-2.25 2.25v3a.75.75 0 001.5 0v-3a.75.75 0 01.75-.75h1.125a.75.75 0 00.75-.75V9A.75.75 0 009 8.25H7.125a.75.75 0 01-.75-.75V3.75a.75.75 0 00-1.5 0v3.75c0 .414.336.75.75.75h.75a.75.75 0 00.75.75v5.25a2.25 2.25 0 002.25 2.25h3.53a2.25 2.25 0 002.138-1.55l.75-3a2.25 2.25 0 00-1.312-2.738.75.75 0 01-.586-1.333 3.75 3.75 0 003.583-4.32z" />
                </svg>
            </button>
            <button className="text-gray-400 hover:text-red-500 transition-colors" title="Bad Suggestion">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M1 11.75a1.25 1.25 0 102.5 0V4.25a1.25 1.25 0 10-2.5 0v7.5zM18.875 10.938c.28.415.422.904.422 1.437 0 1.345-1.047 2.625-2.397 2.625h-4.954a2.25 2.25 0 01-2.25-2.25v-2.25c0-.53-.212-1.023-.582-1.383L5.418 7.918c-.49-.49-.77-.923-.77-1.442v-.375a.75.75 0 01.75-.75h.375a.75.75 0 01.75.75v.375c0 .519.28 1.09.77 1.442l3.418 3.418A2.25 2.25 0 0110.25 12h2.625a2.25 2.25 0 012.25-2.25v-3a.75.75 0 00-1.5 0v3a.75.75 0 00.75.75H12a.75.75 0 01-.75.75V15a.75.75 0 01.75.75h2.875a.75.75 0 00.75-.75v-5.25a2.25 2.25 0 012.25-2.25h1.125a2.25 2.25 0 012.138 1.55l.75 3a2.25 2.25 0 01-1.312 2.738.75.75 0 00.586 1.333 3.75 3.75 0 003.583-4.32z" />
                </svg>
            </button>
        </div>
    </div>
);

export const OpsShelfInventoryStatus: React.FC<OpsShelfInventoryStatusProps> = ({ selectedCategory }) => {
  const data = MOCK_OPS_DATA[selectedCategory].shelfInventory;
  const suggestions = MOCK_OPS_DATA[selectedCategory].inventorySuggestions;

  return (
    <div className="flex flex-col">
      <h2 className="text-md font-bold text-[#005BAC] mb-2 shrink-0">Shelf Inventory Status</h2>
      <div className="grid grid-cols-3 gap-2">
        {data.map(zone => <Zone key={zone.id} zone={zone} />)}
      </div>
       <Legend />
       <div className="mt-4 pt-3 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 shrink-0 mb-1">AI Suggestions:</h3>
            <div className="overflow-y-auto max-h-32 pr-2 -mr-2">
                {suggestions && suggestions.map(s => <Suggestion key={s.id} suggestion={s} />)}
            </div>
       </div>
    </div>
  );
};
