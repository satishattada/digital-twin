import React, { useState } from 'react';
import { Task, TaskStatus, TaskType, TaskPriority, Category } from "../types"

type OpsTaskQueueProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const taskTypeFilters: (TaskType | 'All')[] = ['All', 'Restocking', 'Layout Change', 'Compliance', 'PO', 'Investigation'];
const priorityFilters: (TaskPriority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

const categoryColors: Record<Category, string> = {
    Dairy: 'bg-blue-100 text-blue-800',
    Snacks: 'bg-orange-100 text-orange-800',
    Beverages: 'bg-cyan-100 text-cyan-800',
    'Fresh Produce': 'bg-green-100 text-green-800',
    Household: 'bg-gray-200 text-gray-800',
};

const TaskActionModal: React.FC<{
    task: Task;
    action: 'pause' | 'escalate';
    onClose: () => void;
    onConfirm: (task: Task, reason: string, notes?: string) => void;
}> = ({ task, action, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    const title = action === 'pause' ? '⏸️ Pause Task' : '🔺 Escalate Task';
    const reasons = action === 'pause' 
        ? ['Vendor Delay', 'Awaiting Approval', 'Inventory Blocker', 'Shift Unavailable']
        : ['Resource Delay', 'Customer Issue', 'SLA Risk', 'High Impact'];

    const handleConfirm = () => {
        if (reason) {
            onConfirm(task, reason, notes);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-sm text-gray-600 mb-2">Task: <span className="font-semibold">{task.description}</span></p>
                <div className="space-y-4">
                    <select value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Select a reason...</option>
                        {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." className="w-full p-2 border border-gray-300 rounded-md h-24" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleConfirm} disabled={!reason} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">{action === 'pause' ? 'Confirm Pause' : 'Confirm Escalation'}</button>
                </div>
            </div>
        </div>
    );
};

const TaskCard: React.FC<{ task: Task; onAction: (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => void }> = ({ task, onAction }) => {
    let cardClasses = "bg-white p-2 rounded-md shadow-sm border border-gray-200 mb-2 relative group cursor-grab";
    if (task.isPaused) cardClasses += " opacity-70 bg-gray-100";
    if (task.isEscalated) cardClasses += " border-l-4 border-red-500";
    if (task.status === 'Completed') cardClasses += " bg-green-50";

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('taskId', task.id);
    };

    return (
        <div className={cardClasses} draggable={task.status !== 'Completed'} onDragStart={handleDragStart}>
            {task.isPaused && <span className="absolute top-1 right-1 text-xs font-bold text-gray-600 bg-gray-300 px-2 py-0.5 rounded-full">⏸️ Paused</span>}
            {task.isEscalated && !task.isPaused && <span className="absolute top-1 right-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">🔺 Escalated</span>}
            
            <p className="text-xs font-semibold text-gray-800 pr-16">{task.description}</p>
            
            {task.status === 'Completed' && task.type === 'PO' ? (
                 <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                    <p><strong>Reason:</strong> {task.details}</p>
                    <p><strong>Timestamp:</strong> {task.timestamp}</p>
                </div>
            ) : (
                <p className="text-[11px] text-gray-500 my-0.5">{task.details}</p>
            )}
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-bold py-0.5 px-1.5 rounded-full ${categoryColors[task.category]}`}>{task.category}</span>
                <span className={`text-[10px] font-bold py-0.5 px-1.5 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{task.priority}</span>
                <span className="text-[10px] bg-gray-200 text-gray-700 font-semibold py-0.5 px-1.5 rounded-full">{task.type}</span>
            </div>
            
            {task.status !== 'Completed' && (
                <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center p-1 space-y-1 bg-gray-100/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-md">
                    {task.isPaused 
                        ? <button onClick={() => onAction(task, 'resume')} className="text-lg" title="▶️ Resume Task">▶️</button>
                        : <button onClick={() => onAction(task, 'pause')} className="text-lg" title="⏸️ Pause Task">⏸️</button>
                    }
                    {!task.isEscalated && <button onClick={() => onAction(task, 'escalate')} className="text-lg" title="🔺 Escalate Task">🔺</button>}
                    {(task.status as string) !== 'Completed' && <button onClick={() => onAction(task, 'complete')} className="text-lg" title="✅ Mark Complete">✅</button>}
                </div>
            )}
        </div>
    )
};

const TaskColumn: React.FC<{ title: TaskStatus; tasks: Task[]; onAction: (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => void; onDrop: (status: TaskStatus) => void }> = ({ title, tasks, onAction, onDrop }) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop(title);
    };

    return (
        <div className="bg-gray-100 rounded-lg p-2 flex flex-col flex-1" onDragOver={handleDragOver} onDrop={handleDrop}>
            <h3 className="font-bold text-sm text-gray-700 mb-2 px-1">{title} ({tasks.length})</h3>
            <div className="flex-grow overflow-y-auto -mr-1.5 pr-1.5">
                {tasks.map(task => <TaskCard key={task.id} task={task} onAction={onAction} />)}
            </div>
        </div>
    );
};

export const OpsTaskQueue: React.FC<OpsTaskQueueProps> = ({ tasks, setTasks }) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<TaskType | 'All'>('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [modalState, setModalState] = useState<{task: Task, action: 'pause' | 'escalate'} | null>(null);

  const handleAction = (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => {
      if (action === 'pause' || action === 'escalate') {
          setModalState({ task, action });
      } else if (action === 'resume') {
          setTasks(prev => prev.map(t => t.id === task.id ? {...t, isPaused: false, pauseReason: undefined} : t));
      } else if (action === 'complete') {
          setTasks(prev => prev.map(t => t.id === task.id ? {...t, status: 'Completed', isPaused: false, isEscalated: false } : t));
      }
  };

  const handleConfirmModal = (task: Task, reason: string) => {
      if (modalState?.action === 'pause') {
           setTasks(prev => prev.map(t => t.id === task.id ? {...t, isPaused: true, pauseReason: reason} : t));
      } else if (modalState?.action === 'escalate') {
           setTasks(prev => prev.map(t => t.id === task.id ? {...t, isEscalated: true, escalationReason: reason} : t));
      }
  };

  const handleDrop = (newStatus: TaskStatus, taskId: string) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };
  
  const onDropInColumn = (status: TaskStatus) => (e: React.DragEvent) => {
      const taskId = e.dataTransfer.getData('taskId');
      if (taskId) {
        handleDrop(status, taskId);
      }
  };

  const filteredTasks = tasks.filter(t => {
      const typeMatch = activeTypeFilter === 'All' || t.type === activeTypeFilter;
      const priorityMatch = activePriorityFilter === 'All' || t.priority === activePriorityFilter;
      return typeMatch && priorityMatch;
  });

  const toDo = filteredTasks.filter(t => t.status === 'To Do');
  const inProgress = filteredTasks.filter(t => t.status === 'In Progress');
  const completed = filteredTasks.filter(t => t.status === 'Completed');

  return (
    <div className="flex flex-col h-full">
      {modalState && <TaskActionModal task={modalState.task} action={modalState.action} onClose={() => setModalState(null)} onConfirm={handleConfirmModal} />}
      <div className='shrink-0'>
        <h2 className="text-lg font-bold text-[#005BAC] mb-1">Task Queue</h2>
        <div className="mb-1 flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-600">Type:</span>
            {taskTypeFilters.map(type => (
                 <button key={type} onClick={() => setActiveTypeFilter(type)} className={`text-xs px-2 py-0.5 rounded-full ${activeTypeFilter === type ? 'bg-[#005BAC] text-white' : 'bg-gray-200 text-gray-700'}`}>{type}</button>
            ))}
        </div>
        <div className="mb-2 flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-600">Priority:</span>
            {priorityFilters.map(p => (
                 <button key={p} onClick={() => setActivePriorityFilter(p)} className={`text-xs px-2 py-0.5 rounded-full ${activePriorityFilter === p ? 'bg-[#005BAC] text-white' : 'bg-gray-200 text-gray-700'}`}>{p}</button>
            ))}
        </div>
      </div>
      <div className="flex-grow flex space-x-2 items-stretch min-h-0">
        <TaskColumn title="To Do" tasks={toDo} onAction={handleAction} onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
        }} />
        <TaskColumn title="In Progress" tasks={inProgress} onAction={handleAction} onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
        }} />
        <TaskColumn title="Completed" tasks={completed} onAction={handleAction} onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
        }} />
      </div>
    </div>
  );
};