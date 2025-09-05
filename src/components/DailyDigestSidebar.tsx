
import React from 'react';
import { DailyTask, UrgentIssue, Category, DailyDigestData } from "../types"

type DailyDigestSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    data: DailyDigestData;
};

const getStatusBadge = (status: 'Urgent' | 'Pending' | 'Completed') => {
    switch(status) {
        case 'Urgent': return <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" title="Urgent"></div>;
        case 'Pending': return <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" title="Pending"></div>;
        case 'Completed': return <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" title="Completed"></div>;
        default: return null;
    }
};

const getTaskIcon = (type: DailyTask['type']) => {
    switch(type) {
        case 'Restock': return '📦';
        case 'Layout': return '📐';
        case 'Compliance': return '📋';
        case 'General': return '📌';
        case 'PO Approval': return '📄';
        case 'Investigation': return '🔍';
        default: return '📝';
    }
}

const UrgentIssueCard: React.FC<{ issue: UrgentIssue }> = ({ issue }) => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-3">
        {getStatusBadge(issue.status)}
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 text-sm">{issue.title}</p>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>{issue.timestamp}</span>
                <span className="font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{issue.category}</span>
            </div>
        </div>
    </div>
);

const TaskCard: React.FC<{ task: DailyTask, isCompleted?: boolean }> = ({ task, isCompleted = false }) => (
    <div className={`bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 ${isCompleted ? 'opacity-60' : ''}`}>
        <span className="text-xl">{getTaskIcon(task.type)}</span>
        <div className='flex-grow'>
            <p className={`font-medium text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.name}</p>
            {!isCompleted && <span className="text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full mt-1 inline-block">🟡 Pending</span>}
        </div>
    </div>
);


export const DailyDigestSidebar: React.FC<DailyDigestSidebarProps> = ({ isOpen, onClose, data }) => {
    const { urgentIssues, todayTasks, completedTasks } = data;

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
                        <h2 id="daily-digest-title" className="text-xl font-bold text-[#005BAC]">Daily Digest</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" aria-label="Close Daily Digest">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>

                    <div className="flex-grow p-4 overflow-y-auto space-y-6">
                        {urgentIssues.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold uppercase text-red-600 tracking-wider mb-3 flex items-center gap-2">⚠️ Urgent Issues</h3>
                                <div className="space-y-3">
                                    {urgentIssues.map(issue => <UrgentIssueCard key={issue.id} issue={issue} />)}
                                </div>
                            </section>
                        )}

                        <section>
                            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-2">🔔 Today’s Tasks</h3>
                            <div className="space-y-3">
                                {todayTasks.map(task => <TaskCard key={task.id} task={task} />)}
                            </div>
                        </section>
                        
                        <section>
                            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-2">✅ Completed Tasks</h3>
                            <div className="space-y-3">
                                {completedTasks.map(task => <TaskCard key={task.id} task={task} isCompleted />)}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
