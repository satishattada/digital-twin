
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
    
    // Enhanced logic for urgency and priority
    const isStockConcerning = rec.skuVelocity === 'Slow-moving' && rec.suggestedReorderQty > 0;
    const stockPercentage = (rec.currentStock / rec.maxShelfCapacity) * 100;
    const isLowStock = stockPercentage < 20;
    const isCritical = stockPercentage < 10;
    
    // Priority badge logic
    const getPriorityBadge = () => {
        if (isCritical) return { text: 'CRITICAL', color: 'bg-red-500 text-white', icon: '🚨' };
        if (isLowStock) return { text: 'HIGH', color: 'bg-orange-500 text-white', icon: '⚠️' };
        if (rec.skuVelocity === 'Fast-moving') return { text: 'MEDIUM', color: 'bg-yellow-500 text-white', icon: '⭐' };
        return { text: 'LOW', color: 'bg-blue-500 text-white', icon: '💡' };
    };

    const priority = getPriorityBadge();

    // Product emoji based on name
    const getProductEmoji = (productName: string) => {
        const name = productName.toLowerCase();
        if (name.includes('coca') || name.includes('coke')) return '🥤';
        if (name.includes('pepsi')) return '🥤';
        if (name.includes('water')) return '💧';
        if (name.includes('juice')) return '🍊';
        if (name.includes('energy')) return '⚡';
        return '📦';
    };

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            {/* Header with priority and action */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{getProductEmoji(rec.productName)}</span>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-800">{rec.productName}</h3>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${priority.color} flex items-center gap-1`}>
                                {priority.icon} {priority.text}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            SKU: <span className="font-mono">{rec.sku}</span> • 
                            <span className={`ml-1 font-semibold ${rec.skuVelocity === 'Fast-moving' ? 'text-green-600' : 'text-orange-600'}`}>
                                {rec.skuVelocity}
                            </span>
                        </p>
                    </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => handleAction('create')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center gap-1"
                    >
                        ✅ Create Task
                    </button>
                    <button 
                        onClick={() => handleAction('ignore')}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                        ✖️ Ignore
                    </button>
                </div>
            </div>

            {/* Stock level progress bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Stock Level</span>
                    <span className={`text-sm font-bold ${isCritical ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                        {rec.currentStock}/{rec.maxShelfCapacity} ({stockPercentage.toFixed(0)}%)
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                            isCritical ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Enhanced metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-blue-600 text-xs font-medium mb-1">Suggested Reorder</p>
                    <p className="font-bold text-xl text-blue-800">{rec.suggestedReorderQty}</p>
                    <p className="text-xs text-blue-600">units</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-purple-600 text-xs font-medium mb-1">7-Day Forecast</p>
                    <p className="font-bold text-xl text-purple-800">{rec.forecastedDemand}</p>
                    <p className="text-xs text-purple-600">units</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-green-600 text-xs font-medium mb-1">Sell-Through</p>
                    <p className="font-bold text-xl text-green-800">{rec.expectedSellThrough}%</p>
                    <p className="text-xs text-green-600">expected</p>
                </div>
            </div>

            {/* AI insight banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🤖</span>
                    <span className="font-bold text-sm">Shelfie Recommendation</span>
                </div>
                <p className="text-sm opacity-90">
                    {isCritical 
                        ? `Critical stock level! Immediate reorder recommended to avoid stockout.`
                        : isLowStock 
                        ? `Stock running low. Consider reordering soon to maintain availability.`
                        : `Optimal reorder timing based on demand forecast and velocity trends.`
                    }
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