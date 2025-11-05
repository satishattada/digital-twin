import React from 'react';
import { DailyTask, UrgentIssue, Category, DailyDigestData } from "../types"

type DailyDigestSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    data: DailyDigestData;
};

const getStatusBadge = (status: 'critical' | 'high' | 'medium' | 'low') => {
    switch(status) {
        case 'critical': return <div className="w-3 h-3 rounded-full bg-red-600 shrink-0" title="Critical"></div>;
        case 'high': return <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" title="High"></div>;
        case 'medium': return <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" title="Medium"></div>;
        case 'low': return <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" title="Low"></div>;
        default: return null;
    }
};

const getTaskStatusBadge = (status: 'completed' | 'pending' | 'in-progress') => {
    switch(status) {
        case 'completed': return <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" title="Completed"></div>;
        case 'in-progress': return <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" title="In Progress"></div>;
        case 'pending': return <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" title="Pending"></div>;
        default: return null;
    }
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
        case 'high': return 'text-red-800 bg-red-100';
        case 'medium': return 'text-yellow-800 bg-yellow-100';
        case 'low': return 'text-green-800 bg-green-100';
        default: return 'text-gray-800 bg-gray-100';
    }
};

const getTaskIcon = (category: Category) => {
    switch(category) {
        case 'Postal Services': return '📮';
        case 'Stationery & Office': return '✏️';
        case 'Cards & Gifts': return '🎁';
        case 'Tobacco & Smoking': return '🚬';
        case 'Confectionery & Snacks': return '🍫';
        case 'Beverages': return '🥤';
        case 'Health & Beauty': return '💊';
        case 'Electronics & Accessories': return '🔌';
        case 'Automotive': return '🚗';
        case 'Publications': return '📰';
        case 'Travel & Transport': return '🚌';
        case 'Food Items': return '🥪';
        case 'All': return '🏪';
        default: return '📝';
    }
}

const UrgentIssueCard: React.FC<{ issue: UrgentIssue }> = ({ issue }) => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-3">
        {getStatusBadge(issue.severity)}
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 text-sm">{issue.title}</p>
            <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                <span>{issue.time}</span>
                <span className="font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{issue.category}</span>
            </div>
        </div>
    </div>
);

const TaskCard: React.FC<{ task: DailyTask, isCompleted?: boolean }> = ({ task, isCompleted = false }) => (
    <div className={`bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 ${isCompleted ? 'opacity-60' : ''}`}>
        <span className="text-xl">{getTaskIcon(task.category)}</span>
        <div className='flex-grow'>
            <p className={`font-medium text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.title}</p>
            <div className="flex items-center gap-2 mt-1">
                {getTaskStatusBadge(task.status)}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
                <span className="text-xs text-gray-500">{task.time}</span>
            </div>
        </div>
    </div>
);

export const DailyDigestSidebar: React.FC<DailyDigestSidebarProps> = ({ isOpen, onClose, data }) => {
    const { urgentIssues, tasks, summary } = data;

    // Filter tasks by status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const todayTasks = [...pendingTasks, ...inProgressTasks];

    return (
        <div 
            className={`fixed inset-0 z-40 transition-visibility ${isOpen ? 'visible' : 'invisible'}`}
            aria-labelledby="daily-digest-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                onClick={onClose} 
                className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
            ></div>

            {/* Panel */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
                        <div>
                            <h2 id="daily-digest-title" className="text-xl font-bold text-[#005BAC]">Daily Digest</h2>
                            <p className="text-sm text-gray-600">{data.date}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" aria-label="Close Daily Digest">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>

                    {/* Summary Stats */}
                    <div className="p-4 bg-white border-b border-gray-200 shrink-0">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-[#005BAC]">{summary.completedTasks}/{summary.totalTasks}</p>
                                <p className="text-xs text-gray-600">Tasks Done</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">£{summary.revenueToday.toFixed(0)}</p>
                                <p className="text-xs text-gray-600">Revenue Today</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto space-y-6">
                        {urgentIssues.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold uppercase text-red-600 tracking-wider mb-3 flex items-center gap-2">⚠️ Urgent Issues ({urgentIssues.length})</h3>
                                <div className="space-y-3">
                                    {urgentIssues.map(issue => <UrgentIssueCard key={issue.id} issue={issue} />)}
                                </div>
                            </section>
                        )}

                        {todayTasks.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-2">🔔 Today's Tasks ({todayTasks.length})</h3>
                                <div className="space-y-3">
                                    {todayTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                </div>
                            </section>
                        )}
                        
                        {completedTasks.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-2">✅ Completed Tasks ({completedTasks.length})</h3>
                                <div className="space-y-3">
                                    {completedTasks.map(task => <TaskCard key={task.id} task={task} isCompleted />)}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};