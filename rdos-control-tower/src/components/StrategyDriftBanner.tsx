import React from 'react';

interface StrategyDriftBannerProps {
  variance: string;
  autoFixAvailable?: boolean;
  onAutoFix?: () => void;
}

export const StrategyDriftBanner: React.FC<StrategyDriftBannerProps> = ({ 
  variance, 
  autoFixAvailable = true,
  onAutoFix 
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <div className="font-semibold text-amber-900 text-sm mb-1">Strategy Drift Detected</div>
          <div className="text-sm text-amber-800 mb-3">{variance}</div>
          {autoFixAvailable && (
            <button
              onClick={onAutoFix}
              className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors"
              style={{ backgroundColor: '#036b38' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
            >
              Apply Auto-Correct
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
