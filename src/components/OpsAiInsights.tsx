import React, { useState, useMemo } from 'react';
import { Category, OpsInsight } from "../types"

type OpsAiInsightsProps = {
  insights: OpsInsight[];
  onCreateTask: (insight: OpsInsight) => void;
  onIgnore: (id: number) => void;
};

const ConfidenceIndicator: React.FC<{confidence: number}> = ({confidence}) => {
    const getConfidenceColor = (conf: number) => {
        if (conf >= 90) return 'bg-green-500';
        if (conf >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex items-center gap-1">
            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getConfidenceColor(confidence)}`}
                    style={{width: `${confidence}%`}}
                ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">{confidence}%</span>
        </div>
    );
};

const InsightTypeIcon: React.FC<{type: string}> = ({type}) => {
    const iconMap: Record<string, string> = {
        inventory: '📦',
        sales: '💰',
        operational: '⚙️',
        customer: '👥',
        safety: '⚡',
        efficiency: '📈',
        cost: '💲',
        quality: '🏅',
        compliance: '📋',
        predictive: '🔮'
    };

    const getType = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('stock') || lowerTitle.includes('inventory')) return 'inventory';
        if (lowerTitle.includes('sales') || lowerTitle.includes('revenue')) return 'sales';
        if (lowerTitle.includes('customer')) return 'customer';
        if (lowerTitle.includes('safety') || lowerTitle.includes('hazard')) return 'safety';
        if (lowerTitle.includes('efficiency') || lowerTitle.includes('optimize')) return 'efficiency';
        if (lowerTitle.includes('cost') || lowerTitle.includes('expense')) return 'cost';
        if (lowerTitle.includes('quality')) return 'quality';
        if (lowerTitle.includes('compliance')) return 'compliance';
        if (lowerTitle.includes('predict') || lowerTitle.includes('forecast')) return 'predictive';
        return 'operational';
    };

    return <span className="text-lg">{iconMap[getType(type)]}</span>;
};

const ActionModal: React.FC<{
    insight: OpsInsight;
    onClose: () => void;
    onCreateTask: (insight: OpsInsight, priority: string, assignee: string, notes: string) => void;
}> = ({ insight, onClose, onCreateTask }) => {
    const [priority, setPriority] = useState('Medium');
    const [assignee, setAssignee] = useState('');
    const [notes, setNotes] = useState('');

    const teamMembers = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'David Kim', 'Auto-assign'];

    const handleSubmit = () => {
        onCreateTask(insight, priority, assignee, notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-lg font-bold text-gray-800">Create Task from AI Insight</h3>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 border border-blue-200">
                    <div className="flex items-start gap-2 mb-2">
                        <InsightTypeIcon type={insight.title} />
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{insight.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                        </div>
                    </div>
                    <div className="bg-white/60 rounded p-2 mt-2">
                        <p className="text-xs text-gray-700"><strong>Recommended Action:</strong> {insight.action}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Priority:
                        </label>
                        <div className="flex gap-2">
                            {['High', 'Medium', 'Low'].map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                                        priority === p 
                                            ? p === 'High' ? 'bg-red-600 text-white' :
                                              p === 'Medium' ? 'bg-yellow-600 text-white' :
                                              'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to:
                        </label>
                        <select 
                            value={assignee} 
                            onChange={e => setAssignee(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select team member...</option>
                            {teamMembers.map(member => 
                                <option key={member} value={member}>{member}</option>
                            )}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes: <span className="text-gray-500">(Optional)</span>
                        </label>
                        <textarea 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            placeholder="Add any specific instructions or context..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none" 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!assignee}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

const InsightCard: React.FC<{ 
    insight: OpsInsight; 
    onCreateTask: (insight: OpsInsight) => void; 
    onIgnore: (id: number) => void; 
}> = ({ insight, onCreateTask, onIgnore }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

    // Mock confidence score and additional data
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    const timeToImplement = ['15 mins', '30 mins', '1 hour', '2 hours', '1 day'][Math.floor(Math.random() * 5)];
    const potentialSavings = ['$500', '$1,200', '$2,500', '$5,000', '$10,000'][Math.floor(Math.random() * 5)];

    const handleCreateTask = (insight: OpsInsight, priority: string, assignee: string, notes: string) => {
        onCreateTask(insight);
        console.log('Task created:', { insight, priority, assignee, notes });
    };

    const handleFeedback = (type: 'helpful' | 'not-helpful') => {
        setFeedback(type);
        // In a real app, this would send feedback to improve AI
    };

    const getPriorityColor = (risk: string) => {
        if (risk.toLowerCase().includes('high') || risk.toLowerCase().includes('critical')) {
            return 'border-red-500 bg-gradient-to-r from-red-50 to-red-100';
        }
        if (risk.toLowerCase().includes('medium') || risk.toLowerCase().includes('moderate')) {
            return 'border-amber-500 bg-gradient-to-r from-amber-50 to-amber-100';
        }
        return 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100';
    };

    return (
        <>
            {showModal && (
                <ActionModal 
                    insight={insight}
                    onClose={() => setShowModal(false)}
                    onCreateTask={handleCreateTask}
                />
            )}
            
            <div className={`border-l-4 ${getPriorityColor(insight.risk)} p-4 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 flex-1">
                        <InsightTypeIcon type={insight.title} />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight">{insight.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    🤖 AI Generated
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        {isExpanded ? '▼' : '▶'}
                    </button>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">{insight.description}</p>
                
                {/* Risk Assessment */}
                <div className="mb-3">
                    <div className={`text-sm font-semibold mb-1 ${
                        insight.risk.toLowerCase().includes('high') ? 'text-red-700' :
                        insight.risk.toLowerCase().includes('medium') ? 'text-amber-700' :
                        'text-blue-700'
                    }`}>
                        ⚠️ {insight.risk}
                    </div>
                </div>

                {/* AI Confidence */}
                <div className="flex items-center justify-between mb-3 p-2 bg-white/60 rounded border">
                    <span className="text-xs font-medium text-gray-600">AI Confidence:</span>
                    <ConfidenceIndicator confidence={confidence} />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/60 rounded p-2 border">
                                <div className="text-xs text-gray-500">Est. Time:</div>
                                <div className="text-sm font-semibold text-gray-800">⏱️ {timeToImplement}</div>
                            </div>
                            <div className="bg-white/60 rounded p-2 border">
                                <div className="text-xs text-gray-500">Potential Savings:</div>
                                <div className="text-sm font-semibold text-green-700">💰 {potentialSavings}</div>
                            </div>
                        </div>

                        {/* AI Rationale */}
                        <div className="bg-white/60 rounded p-2 border">
                            <h5 className="text-xs font-semibold text-gray-700 mb-1">🧠 AI Analysis</h5>
                            <p className="text-xs text-gray-600 leading-relaxed">{insight.rationale}</p>
                        </div>

                        {/* Detailed Action Plan */}
                        <div className="bg-white/60 rounded p-2 border">
                            <h5 className="text-xs font-semibold text-gray-700 mb-1">📋 Recommended Action</h5>
                            <p className="text-xs text-gray-600 leading-relaxed">{insight.action}</p>
                        </div>

                        {/* Feedback Section */}
                        <div className="bg-white/60 rounded p-2 border">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Was this insight helpful?</span>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleFeedback('helpful')}
                                        className={`p-1 rounded transition-colors ${
                                            feedback === 'helpful' 
                                                ? 'text-green-600 bg-green-50' 
                                                : 'text-gray-400 hover:text-green-500'
                                        }`}
                                        title="Helpful"
                                    >
                                        👍
                                    </button>
                                    <button 
                                        onClick={() => handleFeedback('not-helpful')}
                                        className={`p-1 rounded transition-colors ${
                                            feedback === 'not-helpful' 
                                                ? 'text-red-600 bg-red-50' 
                                                : 'text-gray-400 hover:text-red-500'
                                        }`}
                                        title="Not Helpful"
                                    >
                                        👎
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end items-center pt-3 border-t border-gray-200 mt-3 gap-2">
                    <button 
                        onClick={() => onIgnore(insight.id)}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
                    >
                        ❌ Dismiss
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center gap-1"
                    >
                        ✅ Create Task
                    </button>
                </div>
            </div>
        </>
    );
};

export const OpsAiInsights: React.FC<OpsAiInsightsProps> = ({ insights, onCreateTask, onIgnore }) => {
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'confidence' | 'time'>('priority');

    // Calculate insights statistics
    const insightStats = useMemo(() => {
        const total = insights.length;
        const high = insights.filter(i => i.risk.toLowerCase().includes('high')).length;
        const medium = insights.filter(i => i.risk.toLowerCase().includes('medium')).length;
        const low = total - high - medium;
        
        return { total, high, medium, low };
    }, [insights]);

    const filteredInsights = insights.filter(insight => {
        if (filter === 'all') return true;
        if (filter === 'high') return insight.risk.toLowerCase().includes('high');
        if (filter === 'medium') return insight.risk.toLowerCase().includes('medium');
        if (filter === 'low') return !insight.risk.toLowerCase().includes('high') && !insight.risk.toLowerCase().includes('medium');
        return true;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h2 className="text-md font-bold text-[#005BAC]">AI Insights</h2>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{insightStats.total}</div>
                    <div className="text-xs text-gray-500">Active</div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 mb-3 shrink-0">
                <div className="bg-red-50 border border-red-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-red-700">{insightStats.high}</div>
                    <div className="text-xs text-red-600">High Priority</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-amber-700">{insightStats.medium}</div>
                    <div className="text-xs text-amber-600">Medium</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-blue-700">{insightStats.low}</div>
                    <div className="text-xs text-blue-600">Low Priority</div>
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {(['all', 'high', 'medium', 'low'] as const).map(filterType => (
                            <button 
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                    filter === filterType 
                                        ? 'bg-[#005BAC] text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    <select 
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="priority">Sort by Priority</option>
                        <option value="confidence">Sort by Confidence</option>
                        <option value="time">Sort by Time</option>
                    </select>
                </div>
            </div>

            {/* Insights List */}
            <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
                {filteredInsights.length > 0 ? (
                    filteredInsights.map(insight => 
                        <InsightCard 
                            key={insight.id} 
                            insight={insight} 
                            onCreateTask={onCreateTask} 
                            onIgnore={onIgnore} 
                        />
                    )
                ) : (
                    <div className="text-center text-gray-400 pt-8 h-full flex flex-col justify-center items-center">
                        <span className="text-4xl mb-2">🧠</span>
                        <p className="text-sm font-medium">No {filter !== 'all' ? filter + ' priority' : ''} insights available.</p>
                        <p className="text-xs text-gray-400 mt-1">AI is analyzing your data...</p>
                    </div>
                )}
            </div>

            {/* Learning Banner */}
            {insights.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-2 mt-3 shrink-0">
                    <div className="flex items-center gap-2 text-purple-700">
                        <span className="text-sm">🎯</span>
                        <span className="text-xs font-semibold">AI Learning</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                        Your feedback helps improve future recommendations. Keep engaging!
                    </p>
                </div>
            )}
        </div>
    );
};