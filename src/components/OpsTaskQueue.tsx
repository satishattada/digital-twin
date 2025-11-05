import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskType, TaskPriority, Category } from "../types"

type OpsTaskQueueProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const taskTypeFilters: (TaskType | 'All')[] = ['All', 'Restocking', 'Layout Change', 'Compliance', 'PO', 'Investigation'];
const priorityFilters: (TaskPriority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

const categoryColors: Partial<Record<Category | string, string>> = {
    'Confectionery & Snacks': 'bg-orange-100 text-orange-800 border-orange-300',
    Beverages: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'Food Items': 'bg-green-100 text-green-800 border-green-300',
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
        ? ['Vendor Delay', 'Awaiting Approval', 'Inventory Blocker', 'Shift Unavailable', 'Equipment Issue']
        : ['Resource Delay', 'Customer Issue', 'SLA Risk', 'High Impact', 'Management Required'];

    const handleConfirm = () => {
        if (reason) {
            onConfirm(task, reason, notes);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{action === 'pause' ? '⏸️' : '🔺'}</span>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Task Details:</p>
                    <p className="text-sm font-semibold text-gray-800">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                            {task.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                            task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                            task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                        }`}>
                            {task.priority} Priority
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for {action}:
                        </label>
                        <select 
                            value={reason} 
                            onChange={e => setReason(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a reason...</option>
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes: <span className="text-gray-500">(Optional)</span>
                        </label>
                        <textarea 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            placeholder="Add any additional context or details..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none" 
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
                        onClick={handleConfirm} 
                        disabled={!reason} 
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        {action === 'pause' ? 'Confirm Pause' : 'Confirm Escalation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TaskCard: React.FC<{ 
    task: Task; 
    onAction: (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => void;
    columnType: TaskStatus;
}> = ({ task, onAction, columnType }) => {
    const [isHovered, setIsHovered] = useState(false);

    let cardClasses = "bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-3 relative group cursor-grab transition-all duration-200 hover:shadow-md";
    
    if (task.isPaused) cardClasses += " opacity-70 bg-gray-50 border-gray-300";
    if (task.isEscalated) cardClasses += " border-l-4 border-red-500 bg-red-50";
    if (task.status === 'Completed') cardClasses += " bg-green-50 border-green-200";

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const getPriorityIcon = (priority: TaskPriority) => {
        switch (priority) {
            case 'High': return '🔴';
            case 'Medium': return '🟡';
            case 'Low': return '🟢';
            default: return '⚪';
        }
    };

    const getTypeIcon = (type: TaskType) => {
        switch (type) {
            case 'Restocking': return '📦';
            case 'Layout Change': return '🔄';
            case 'Compliance': return '📋';
            case 'PO': return '📑';
            case 'Investigation': return '🔍';
            default: return '📝';
        }
    };

    return (
        <div 
            className={cardClasses} 
            draggable={task.status !== 'Completed'} 
            onDragStart={handleDragStart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                {task.isPaused && (
                    <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                        ⏸️ Paused
                    </span>
                )}
                {task.isEscalated && !task.isPaused && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                        🔺 Escalated
                    </span>
                )}
            </div>
            
            {/* Task header */}
            <div className="pr-20 mb-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTypeIcon(task.type)}</span>
                    <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                    {task.description}
                </h4>
            </div>
            
            {/* Task details */}
            {task.status === 'Completed' && task.type === 'PO' ? (
                <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded border space-y-1">
                    <p><strong>Completion Reason:</strong> {task.details}</p>
                    <p><strong>Completed:</strong> {task.timestamp}</p>
                </div>
            ) : (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.details}</p>
            )}
            
            {/* Task metadata */}
            <div className="flex items-center gap-1 flex-wrap">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${categoryColors[task.category]}`}>
                    {task.category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                    task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                    task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-green-50 text-green-700 border-green-200'
                }`}>
                    {task.priority}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded-full border border-gray-200">
                    {task.type}
                </span>
            </div>
            
            {/* Hover actions */}
            {task.status !== 'Completed' && isHovered && (
                <div className="absolute top-2 right-2 bottom-2 flex flex-col items-center justify-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 px-2 shadow-sm">
                    {task.isPaused ? (
                        <button 
                            onClick={() => onAction(task, 'resume')} 
                            className="p-1 hover:bg-green-100 rounded transition-colors" 
                            title="Resume Task"
                        >
                            ▶️
                        </button>
                    ) : (
                        <button 
                            onClick={() => onAction(task, 'pause')} 
                            className="p-1 hover:bg-yellow-100 rounded transition-colors" 
                            title="Pause Task"
                        >
                            ⏸️
                        </button>
                    )}
                    
                    {!task.isEscalated && (
                        <button 
                            onClick={() => onAction(task, 'escalate')} 
                            className="p-1 hover:bg-red-100 rounded transition-colors" 
                            title="Escalate Task"
                        >
                            🔺
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onAction(task, 'complete')} 
                        className="p-1 hover:bg-green-100 rounded transition-colors" 
                        title="Mark Complete"
                    >
                        ✅
                    </button>
                </div>
            )}
        </div>
    );
};

const TaskColumn: React.FC<{ 
    title: TaskStatus; 
    tasks: Task[]; 
    onAction: (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => void; 
    onDrop: (status: TaskStatus) => void;
    color: string;
}> = ({ title, tasks, onAction, onDrop, color }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(title);
    };

    const getColumnIcon = (status: TaskStatus) => {
        switch (status) {
            case 'To Do': return '📋';
            case 'In Progress': return '⚡';
            case 'Completed': return '✅';
            default: return '📝';
        }
    };

    return (
        <div 
            className={`${color} rounded-xl p-4 flex flex-col flex-1  transition-all duration-200 ${
                isDragOver ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getColumnIcon(title)}</span>
                    <h3 className="font-bold text-sm text-gray-700">{title}</h3>
                </div>
                <div className="bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-gray-600">{tasks.length}</span>
                </div>
            </div>
            
            <div className="flex-grow space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onAction={onAction}
                            columnType={title}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <span className="text-3xl mb-2">🎯</span>
                        <p className="text-xs text-center">
                            {title === 'To Do' ? 'No pending tasks' :
                             title === 'In Progress' ? 'No active tasks' :
                             'No completed tasks'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const OpsTaskQueue: React.FC<OpsTaskQueueProps> = ({ tasks, setTasks }) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<TaskType | 'All'>('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [modalState, setModalState] = useState<{task: Task, action: 'pause' | 'escalate'} | null>(null);

  // Calculate summary stats
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const paused = tasks.filter(t => t.isPaused).length;
    const escalated = tasks.filter(t => t.isEscalated).length;
    const high = tasks.filter(t => t.priority === 'High').length;
    
    return { total, completed, inProgress, paused, escalated, high };
  }, [tasks]);

  const handleAction = (task: Task, action: 'pause' | 'escalate' | 'resume' | 'complete') => {
      if (action === 'pause' || action === 'escalate') {
          setModalState({ task, action });
      } else if (action === 'resume') {
          setTasks(prev => prev.map(t => t.id === task.id ? {...t, isPaused: false, pauseReason: undefined} : t));
      } else if (action === 'complete') {
          setTasks(prev => prev.map(t => t.id === task.id ? {...t, status: 'Completed', isPaused: false, isEscalated: false } : t));
      }
  };

  const handleConfirmModal = (task: Task, reason: string, notes?: string) => {
      if (modalState?.action === 'pause') {
           setTasks(prev => prev.map(t => t.id === task.id ? {...t, isPaused: true, pauseReason: reason, pauseNotes: notes} : t));
      } else if (modalState?.action === 'escalate') {
           setTasks(prev => prev.map(t => t.id === task.id ? {...t, isEscalated: true, escalationReason: reason, escalationNotes: notes} : t));
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
    <div className="flex flex-col h-full space-y-4">
      {modalState && (
        <TaskActionModal 
          task={modalState.task} 
          action={modalState.action} 
          onClose={() => setModalState(null)} 
          onConfirm={handleConfirmModal} 
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-lg font-bold text-[#005BAC]">Task Queue Management</h2>
            <p className="text-sm text-gray-600">Operational workflow dashboard</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">{taskStats.total}</div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-700">{taskStats.inProgress}</div>
          <div className="text-xs text-blue-600">In Progress</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-700">{taskStats.completed}</div>
          <div className="text-xs text-green-600">Completed</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-700">{taskStats.high}</div>
          <div className="text-xs text-red-600">High Priority</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-700">{taskStats.paused}</div>
          <div className="text-xs text-yellow-600">Paused</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-700">{taskStats.escalated}</div>
          <div className="text-xs text-purple-600">Escalated</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-700">{Math.round((taskStats.completed / taskStats.total) * 100) || 0}%</div>
          <div className="text-xs text-gray-600">Completion</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            🏷️ Type:
          </span>
          {taskTypeFilters.map(type => (
            <button 
              key={type} 
              onClick={() => setActiveTypeFilter(type)} 
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeTypeFilter === type 
                  ? 'bg-[#005BAC] text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            ⚡ Priority:
          </span>
          {priorityFilters.map(p => (
            <button 
              key={p} 
              onClick={() => setActivePriorityFilter(p)} 
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activePriorityFilter === p 
                  ? 'bg-[#005BAC] text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-grow flex space-x-4 items-stretch min-h-0">
        <TaskColumn 
          title="To Do" 
          tasks={toDo} 
          onAction={handleAction} 
          onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
          }}
          color="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
        />
        <TaskColumn 
          title="In Progress" 
          tasks={inProgress} 
          onAction={handleAction} 
          onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
          }}
          color="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
        />
        <TaskColumn 
          title="Completed" 
          tasks={completed} 
          onAction={handleAction} 
          onDrop={(status) => {
            const taskId = (window.event as DragEvent).dataTransfer?.getData('taskId');
            if (taskId) handleDrop(status, taskId);
          }}
          color="bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
        />
      </div>
    </div>
  );
};