import React, { useState, useMemo } from 'react';
import { OpsAlert } from "../types"

type Urgency = 'Urgent' | 'Pending' | 'Critical' | 'Moderate';

type OpsAlertsProps = {
  alerts: OpsAlert[];
  onDismiss: (id: number) => void;
};

const getStatusStyles = (urgency: Urgency) => {
    switch (urgency) {
        case 'Urgent':
        case 'Critical':
            return { 
                border: 'border-red-500', 
                bg: 'bg-gradient-to-r from-red-50 to-red-100', 
                text: 'text-red-800', 
                badge: 'bg-red-500',
                icon: '🚨',
                pulse: 'animate-pulse'
            };
        case 'Pending':
        case 'Moderate':
            return { 
                border: 'border-amber-500', 
                bg: 'bg-gradient-to-r from-amber-50 to-amber-100', 
                text: 'text-amber-800', 
                badge: 'bg-amber-500',
                icon: '⚠️',
                pulse: ''
            };
        default: 
            return { 
                border: 'border-blue-500', 
                bg: 'bg-gradient-to-r from-blue-50 to-blue-100', 
                text: 'text-blue-800', 
                badge: 'bg-blue-500',
                icon: 'ℹ️',
                pulse: ''
            };
    }
};

const getAlertTypeIcon = (title: string) => {
    if (title.toLowerCase().includes('stock') || title.toLowerCase().includes('inventory')) return '📦';
    if (title.toLowerCase().includes('temperature') || title.toLowerCase().includes('temp')) return '🌡️';
    if (title.toLowerCase().includes('security') || title.toLowerCase().includes('access')) return '🔒';
    if (title.toLowerCase().includes('system') || title.toLowerCase().includes('server')) return '💻';
    if (title.toLowerCase().includes('safety') || title.toLowerCase().includes('hazard')) return '⚡';
    if (title.toLowerCase().includes('quality') || title.toLowerCase().includes('compliance')) return '🏅';
    if (title.toLowerCase().includes('supplier') || title.toLowerCase().includes('vendor')) return '🏪';
    if (title.toLowerCase().includes('equipment') || title.toLowerCase().includes('maintenance')) return '🔧';
    return '📢';
};

const AlertActionModal: React.FC<{
    alert: OpsAlert;
    onClose: () => void;
    onAction: (action: 'escalate' | 'resolve' | 'assign', notes?: string, assignee?: string) => void;
}> = ({ alert, onClose, onAction }) => {
    const [notes, setNotes] = useState('');
    const [assignee, setAssignee] = useState('');
    const [actionType, setActionType] = useState<'escalate' | 'resolve' | 'assign'>('resolve');

    const teamMembers = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'David Kim'];

    const handleSubmit = () => {
        onAction(actionType, notes, assignee);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{getAlertTypeIcon(alert.title)}</span>
                    <h3 className="text-lg font-bold text-gray-800">Alert Action</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Alert Details:</p>
                    <p className="text-sm font-semibold text-gray-800">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Action:
                        </label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setActionType('resolve')}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                                    actionType === 'resolve' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ✅ Resolve
                            </button>
                            <button 
                                onClick={() => setActionType('assign')}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                                    actionType === 'assign' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                👤 Assign
                            </button>
                            <button 
                                onClick={() => setActionType('escalate')}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                                    actionType === 'escalate' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                🔺 Escalate
                            </button>
                        </div>
                    </div>

                    {actionType === 'assign' && (
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
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes: <span className="text-gray-500">(Optional)</span>
                        </label>
                        <textarea 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            placeholder="Add resolution notes or additional context..."
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
                        disabled={actionType === 'assign' && !assignee}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        Confirm Action
                    </button>
                </div>
            </div>
        </div>
    );
};

const AlertCard: React.FC<{
    alert: OpsAlert; 
    onDismiss: (id: number) => void;
    onAction: (id: number, action: 'escalate' | 'resolve' | 'assign', notes?: string, assignee?: string) => void;
}> = ({ alert, onDismiss, onAction }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const styles = getStatusStyles(alert.urgency || 'Pending');
    
    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const alertTime = new Date(timestamp);
        const diffMs = now.getTime() - alertTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    };

    const handleModalAction = (action: 'escalate' | 'resolve' | 'assign', notes?: string, assignee?: string) => {
        onAction(alert.id, action, notes, assignee);
    };

    return (
        <>
            {showModal && (
                <AlertActionModal 
                    alert={alert}
                    onClose={() => setShowModal(false)}
                    onAction={handleModalAction}
                />
            )}
            
            <div className={`${styles.bg} border-l-4 ${styles.border} ${styles.pulse} p-3 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200 group`}>
                {/* Alert Header */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2 flex-1">
                        <span className="text-lg flex-shrink-0">{getAlertTypeIcon(alert.title)}</span>
                        <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm ${styles.text} leading-tight`}>
                                {alert.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${styles.badge}`}>
                                    {styles.icon} {alert.urgency}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {timeAgo(alert.timestamp)}
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

                {/* Alert Message */}
                <p className={`text-xs text-gray-700 mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {alert.message}
                </p>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                        {/* Additional Details */}
                        <div className="bg-white/50 rounded-md p-2 space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Alert ID:</span>
                                <span className="font-mono text-gray-700">#{alert.id.toString().padStart(4, '0')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Category:</span>
                                <span className="text-gray-700 capitalize">
                                    {alert.title.toLowerCase().includes('stock') ? 'Inventory' :
                                     alert.title.toLowerCase().includes('temp') ? 'Environment' :
                                     alert.title.toLowerCase().includes('system') ? 'Technical' : 'Operational'}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Status:</span>
                                <span className="text-gray-700">Active</span>
                            </div>
                        </div>

                        {/* Impact Assessment */}
                        <div className="bg-white/50 rounded-md p-2">
                            <h5 className="text-xs font-semibold text-gray-700 mb-1">📊 Impact Assessment</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500">Business Impact:</span>
                                    <div className={`text-xs px-1 py-0.5 rounded mt-1 inline-block ${
                                        alert.urgency === 'Critical' || alert.urgency === 'Urgent' 
                                            ? 'bg-red-100 text-red-700' 
                                            : alert.urgency === 'Moderate' 
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {alert.urgency === 'Critical' ? 'High' :
                                         alert.urgency === 'Urgent' ? 'Medium-High' :
                                         alert.urgency === 'Moderate' ? 'Medium' : 'Low'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500">SLA Risk:</span>
                                    <div className="text-xs text-gray-700 mt-1">
                                        {alert.urgency === 'Critical' ? '🔴 High' :
                                         alert.urgency === 'Urgent' ? '🟡 Medium' : '🟢 Low'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-3">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1"
                    >
                        ⚡ Action
                    </button>
                    <button 
                        onClick={() => onDismiss(alert.id)} 
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
                    >
                        ❌ Dismiss
                    </button>
                </div>
            </div>
        </>
    );
};

export const OpsAlerts: React.FC<OpsAlertsProps> = ({ alerts, onDismiss }) => {
    const [filter, setFilter] = useState<'all' | 'critical' | 'urgent' | 'moderate'>('all');
    const [showAll, setShowAll] = useState(false);

    const handleAction = (id: number, action: 'escalate' | 'resolve' | 'assign', notes?: string, assignee?: string) => {
        // In a real app, this would make an API call
        console.log(`Alert ${id} ${action}ed`, { notes, assignee });
        onDismiss(id); // For demo purposes, dismiss after action
    };

    // Calculate alert statistics
    const alertStats = useMemo(() => {
        const total = alerts.length;
        const critical = alerts.filter(a => a.urgency === 'Critical').length;
        const urgent = alerts.filter(a => a.urgency === 'Urgent').length;
        const moderate = alerts.filter(a => a.urgency === 'Moderate' || a.urgency === 'Pending').length;
        
        return { total, critical, urgent, moderate };
    }, [alerts]);

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'all') return true;
        if (filter === 'critical') return alert.urgency === 'Critical';
        if (filter === 'urgent') return alert.urgency === 'Urgent';
        if (filter === 'moderate') return alert.urgency === 'Moderate' || alert.urgency === 'Pending';
        return true;
    });

    const displayedAlerts = showAll ? filteredAlerts : filteredAlerts.slice(0, 3);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🚨</span>
                    <h2 className="text-md font-bold text-[#005BAC]">Alerts Panel</h2>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{alertStats.total}</div>
                    <div className="text-xs text-gray-500">Active</div>
                </div>
            </div>

            {/* Alert Statistics */}
            <div className="grid grid-cols-3 gap-2 mb-3 shrink-0">
                <div className="bg-red-50 border border-red-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-red-700">{alertStats.critical}</div>
                    <div className="text-xs text-red-600">Critical</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-amber-700">{alertStats.urgent}</div>
                    <div className="text-xs text-amber-600">Urgent</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-center">
                    <div className="text-sm font-bold text-blue-700">{alertStats.moderate}</div>
                    <div className="text-xs text-blue-600">Moderate</div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1 mb-3 shrink-0">
                {(['all', 'critical', 'urgent', 'moderate'] as const).map(filterType => (
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

            {/* Alerts List */}
            <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
                {displayedAlerts.length > 0 ? (
                    <>
                        {displayedAlerts.map(alert => 
                            <AlertCard 
                                key={alert.id} 
                                alert={alert} 
                                onDismiss={onDismiss}
                                onAction={handleAction}
                            />
                        )}
                        
                        {filteredAlerts.length > 3 && (
                            <button 
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            >
                                {showAll ? '▲ Show Less' : `▼ Show ${filteredAlerts.length - 3} More`}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400 pt-8 h-full flex flex-col justify-center items-center">
                        <span className="text-4xl mb-2">✨</span>
                        <p className="text-sm font-medium">No {filter !== 'all' ? filter : ''} alerts.</p>
                        <p className="text-xs text-gray-400 mt-1">All systems operating normally</p>
                    </div>
                )}
            </div>
        </div>
    );
};