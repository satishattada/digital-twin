import React from 'react';
import { ReasoningMapStep } from '../types';

interface ReasoningMapProps {
  step: ReasoningMapStep;
  compact?: boolean;
}

export const ReasoningMap: React.FC<ReasoningMapProps> = ({ step, compact = false }) => {
  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h4 className="font-semibold text-green-900 text-sm">Agent Reasoning Map</h4>
      </div>
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-24 text-xs font-medium text-green-700">Signal</div>
          <div className="flex-1 text-sm text-gray-700">{step.signal}</div>
        </div>
        <div className="flex items-center gap-2 ml-24">
          <div className="w-full h-px bg-green-300"></div>
          <span className="text-green-500">→</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-24 text-xs font-medium text-green-700">Threshold</div>
          <div className="flex-1 text-sm text-gray-700">{step.threshold}</div>
        </div>
        <div className="flex items-center gap-2 ml-24">
          <div className="w-full h-px bg-green-300"></div>
          <span className="text-green-500">→</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-24 text-xs font-medium text-green-700">Impact</div>
          <div className="flex-1 text-sm text-gray-700">{step.impact}</div>
        </div>
        <div className="flex items-center gap-2 ml-24">
          <div className="w-full h-px bg-green-300"></div>
          <span className="text-green-500">→</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-24 text-xs font-medium text-blue-700">Recommendation</div>
          <div className="flex-1 text-sm font-medium text-blue-900">{step.recommendation}</div>
        </div>
      </div>
    </div>
  );
};
