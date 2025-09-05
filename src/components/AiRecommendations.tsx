
import React, { useState } from 'react';
import { Recommendation } from "../types"

type AiRecommendationsProps = {
  recommendations: Recommendation[];
  onCreateTask: (rec: Recommendation) => void;
  onIgnoreRecommendation: (id: number) => void;
};

const RecommendationCard: React.FC<{
    rec: Recommendation,
    onCreateTask: (rec: Recommendation) => void,
    onIgnoreRecommendation: (id: number) => void
}> = ({ rec, onCreateTask, onIgnoreRecommendation }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleAction = (action: 'create' | 'ignore') => {
        if (action === 'create') {
            onCreateTask(rec);
        } else {
            onIgnoreRecommendation(rec.id);
        }
        setMenuOpen(false);
    };
    
    // Stock value is colored red for slow-movers that need a reorder.
    const isStockConcerning = rec.skuVelocity === 'Slow-moving' && rec.suggestedReorderQty > 0;

    return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex flex-col gap-2">
            {/* Top row: Title and Action button */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-base text-gray-800">Reorder: {rec.productName}</p>
                    <p className="text-xs text-gray-500">
                        SKU: {rec.sku} • 
                        <span className={`font-semibold ${rec.skuVelocity === 'Fast-moving' ? 'text-green-600' : 'text-red-600'}`}>
                            {' '}{rec.skuVelocity}
                        </span>
                    </p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center gap-1"
                    >
                        Action...
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10"
                            onMouseLeave={() => setMenuOpen(false)}
                        >
                            <ul className="py-1">
                                <li>
                                    <button onClick={() => handleAction('create')} className="w-full text-left block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">✅ Create Task</button>
                                </li>
                                <li>
                                    <button onClick={() => handleAction('ignore')} className="w-full text-left block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">❌ Ignore</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle section: Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                <div>
                    <p className="text-gray-500">Current Stock</p>
                    <p className={`font-bold text-base ${isStockConcerning ? 'text-red-600' : 'text-gray-800'}`}>
                        {rec.currentStock}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Max Capacity</p>
                    <p className="font-bold text-base text-gray-800">{rec.maxShelfCapacity}</p>
                </div>
                <div>
                    <p className="text-gray-500">Suggested Reorder</p>
                    <p className="font-bold text-base text-blue-600">{rec.suggestedReorderQty}</p>
                </div>
                <div>
                    <p className="text-gray-500">Forecasted Demand (7d)</p>
                    <p className="font-bold text-base text-gray-800">{rec.forecastedDemand}</p>
                </div>
            </div>

            {/* Bottom section: Sell-through */}
            <div>
                 <p className="text-gray-500 text-xs">
                    Expected Sell-Through: <span className="font-bold text-sm text-gray-800">{rec.expectedSellThrough}%</span>
                </p>
            </div>
        </div>
    );
};


export const AiRecommendations: React.FC<AiRecommendationsProps> = ({ recommendations, onCreateTask, onIgnoreRecommendation }) => {
  return (
    <div className="space-y-3">
      {recommendations.length > 0 ? (
        recommendations.map(rec => (
          <RecommendationCard 
            key={rec.id} 
            rec={rec}
            onCreateTask={onCreateTask}
            onIgnoreRecommendation={onIgnoreRecommendation}
            />
        ))
      ) : (
        <div className="text-center text-gray-500 py-8 h-full flex flex-col justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-sm font-semibold">No recommendations for this category.</p>
        </div>
      )}
    </div>
  );
};