import React from 'react';

interface FinanceCalendarNudgeProps {
  window: string;
  daysRemaining: number;
  deadline: string;
}

export const FinanceCalendarNudge: React.FC<FinanceCalendarNudgeProps> = ({ 
  window, 
  daysRemaining, 
  deadline 
}) => {
  const isUrgent = daysRemaining <= 30;

  return (
    <div className={`rounded-lg border p-4 ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
      <div className="flex items-start gap-3">
        <svg 
          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isUrgent ? 'text-red-600' : 'text-green-600'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold mb-1 ${isUrgent ? 'text-red-900' : 'text-blue-900'}`}>
            Finance Calendar Nudge
          </h4>
          <p className={`text-xs ${isUrgent ? 'text-red-700' : 'text-blue-700'}`}>
            {window} budget window closes in <span className="font-bold">{daysRemaining} days</span>. 
            Approval required by {deadline}.
          </p>
        </div>
      </div>
    </div>
  );
};
