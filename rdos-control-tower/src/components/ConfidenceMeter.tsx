import React from 'react';
import { ConfidenceLevel } from '../types';

interface ConfidenceMeterProps {
  level: ConfidenceLevel;
  score: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ level, score }) => {
  const getColor = () => {
    if (level === 'High') return 'bg-green-500';
    if (level === 'Med') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (level === 'High') return 'text-green-700';
    if (level === 'Med') return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Confidence</span>
          <span className={`text-xs font-semibold ${getTextColor()}`}>
            {level} ({score}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getColor()} transition-all duration-300`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
