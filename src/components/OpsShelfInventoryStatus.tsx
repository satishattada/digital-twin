import React, { useState } from 'react';
import { Category, ShelfZone, InventorySuggestion } from "../types"
import { MOCK_OPS_DATA } from "../constants"

type OpsShelfInventoryStatusProps = {
  selectedCategory: Category;
};

const statusStyles = {
    Overstocked: { 
        bg: 'bg-gradient-to-br from-red-50 to-red-100', 
        border: 'border-red-300', 
        text: 'text-red-800',
        icon: '📈',
        accent: 'bg-red-500'
    },
    Understocked: { 
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100', 
        border: 'border-amber-300', 
        text: 'text-amber-800',
        icon: '📉',
        accent: 'bg-amber-500'
    },
    Optimized: { 
        bg: 'bg-gradient-to-br from-green-50 to-green-100', 
        border: 'border-green-300', 
        text: 'text-green-800',
        icon: '✅',
        accent: 'bg-green-500'
    },
    'Chronic Imbalance': { 
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
        border: 'border-purple-300', 
        text: 'text-purple-800',
        icon: '⚠️',
        accent: 'bg-purple-500'
    },
};

const Zone: React.FC<{ zone: ShelfZone }> = ({ zone }) => {
    const [isHovered, setIsHovered] = useState(false);
    const styles = statusStyles[zone.status];
    
    // Mock additional data for realism
    const stockLevel = zone.status === 'Overstocked' ? 95 : 
                      zone.status === 'Understocked' ? 15 :
                      zone.status === 'Chronic Imbalance' ? 60 : 85;
    
    const capacity = 100;
    const trend = zone.status === 'Overstocked' ? '+12%' :
                  zone.status === 'Understocked' ? '-8%' :
                  zone.status === 'Chronic Imbalance' ? '±15%' : '+2%';

    return (
        <div 
            className={`relative rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${styles.bg} ${styles.border} border-2`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status indicator dot */}
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${styles.accent}`}></div>
            
            {/* Zone header */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{styles.icon}</span>
                <div className="flex-1">
                    <p className={`text-sm font-bold ${styles.text}`}>{zone.name}</p>
                    <p className={`text-xs ${styles.text} opacity-70`}>{zone.status}</p>
                </div>
            </div>

            {/* Stock level bar */}
            <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-medium ${styles.text}`}>Stock Level</span>
                    <span className={`text-xs font-bold ${styles.text}`}>{stockLevel}%</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2 border border-gray-200">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${styles.accent}`}
                        style={{ width: `${stockLevel}%` }}
                    ></div>
                </div>
            </div>

            {/* Trend indicator */}
            <div className="flex justify-between items-center text-xs">
                <span className={`${styles.text} opacity-70`}>vs last week</span>
                <span className={`font-bold ${
                    trend.startsWith('+') ? 'text-green-600' :
                    trend.startsWith('-') ? 'text-red-600' : 'text-amber-600'
                }`}>
                    {trend}
                </span>
            </div>

            {/* Hover overlay */}
            {isHovered && (
                <div className="absolute inset-0 bg-white/20 rounded-lg border-2 border-white/50 transition-all duration-300">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                        Click for details
                    </div>
                </div>
            )}
        </div>
    );
};

const Legend: React.FC = () => (
    <div className="bg-gray-50 rounded-lg p-3 mt-4">
        <h4 className="text-xs font-bold text-gray-700 mb-2">📊 Status Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(statusStyles).map(([status, styles]) => (
                <div key={status} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${styles.accent}`}></div>
                    <span className="text-gray-600">{status}</span>
                </div>
            ))}
        </div>
    </div>
);

const Suggestion: React.FC<{suggestion: InventorySuggestion}> = ({suggestion}) => {
    const [feedback, setFeedback] = useState<'none' | 'good' | 'bad'>('none');
    
    const handleFeedback = (type: 'good' | 'bad') => {
        setFeedback(type);
        // Here you would typically send feedback to your analytics
    };

    const getPriorityBadge = (text: string) => {
        if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('critical')) {
            return { color: 'bg-red-500', text: 'HIGH', icon: '🚨' };
        }
        if (text.toLowerCase().includes('soon') || text.toLowerCase().includes('consider')) {
            return { color: 'bg-amber-500', text: 'MED', icon: '⚠️' };
        }
        return { color: 'bg-blue-500', text: 'LOW', icon: '💡' };
    };

    const priority = getPriorityBadge(suggestion.text);

    return (
        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 mb-2">
            <div className="flex-shrink-0">
                <span className="text-lg">🤖</span>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${priority.color} flex items-center gap-1`}>
                        {priority.icon} {priority.text}
                    </span>
                    <span className="text-xs text-gray-500">Shelfie Recommendation</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{suggestion.text}</p>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-2">
                    <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        ✅ Implement
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                        📅 Schedule
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <button 
                    onClick={() => handleFeedback('good')}
                    className={`p-1 rounded transition-colors ${
                        feedback === 'good' 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-400 hover:text-green-500'
                    }`}
                    title="Good Suggestion"
                >
                    👍
                </button>
                <button 
                    onClick={() => handleFeedback('bad')}
                    className={`p-1 rounded transition-colors ${
                        feedback === 'bad' 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-400 hover:text-red-500'
                    }`}
                    title="Poor Suggestion"
                >
                    👎
                </button>
            </div>
        </div>
    );
};

export const OpsShelfInventoryStatus: React.FC<OpsShelfInventoryStatusProps> = ({ selectedCategory }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    
    const data = MOCK_OPS_DATA[selectedCategory].shelfInventory;
    const suggestions = MOCK_OPS_DATA[selectedCategory].inventorySuggestions;

    // Calculate summary stats
    const overstockedCount = data.filter(z => z.status === 'Overstocked').length;
    const understockedCount = data.filter(z => z.status === 'Understocked').length;
    const optimizedCount = data.filter(z => z.status === 'Optimized').length;
    const imbalanceCount = data.filter(z => z.status === 'Chronic Imbalance').length;

    const filteredData = filterStatus === 'all' 
        ? data 
        : data.filter(zone => zone.status.toLowerCase().includes(filterStatus.toLowerCase()));

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <div>
                        <h2 className="text-lg font-bold text-[#005BAC]">Shelf Inventory Status</h2>
                        <p className="text-sm text-gray-600">{selectedCategory} category overview</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Zones</option>
                        <option value="overstocked">Overstocked</option>
                        <option value="understocked">Understocked</option>
                        <option value="optimized">Optimized</option>
                        <option value="imbalance">Imbalance</option>
                    </select>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                    >
                        {viewMode === 'grid' ? '📋' : '⊞'}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                    <div className="text-xl font-bold text-red-700">{overstockedCount}</div>
                    <div className="text-xs text-red-600">Over stocked</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                    <div className="text-xl font-bold text-amber-700">{understockedCount}</div>
                    <div className="text-xs text-amber-600">Under stocked</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <div className="text-xl font-bold text-green-700">{optimizedCount}</div>
                    <div className="text-xs text-green-600">Optimized</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
                    <div className="text-xl font-bold text-purple-700">{imbalanceCount}</div>
                    <div className="text-xs text-purple-600">Imbalanced</div>
                </div>
            </div>

            {/* Zone Grid */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}`}>
                {filteredData.map(zone => <Zone key={zone.id} zone={zone} />)}
            </div>

            <Legend />

            {/* AI Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <h3 className="text-sm font-bold text-gray-800">AI-Powered Recommendations</h3>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {suggestions?.length || 0} suggestions
                    </span>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {suggestions && suggestions.length > 0 ? (
                        suggestions.map(s => <Suggestion key={s.id} suggestion={s} />)
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-2 block">✨</span>
                            <p className="text-sm">No recommendations at this time.</p>
                            <p className="text-xs text-gray-400">All zones are performing well!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};