import React from 'react';

interface SLORibbonProps {
  p95Latency: string;
  lastRefresh: string;
  dataFreshness: string;
}

export const SLORibbon: React.FC<SLORibbonProps> = ({ p95Latency, lastRefresh, dataFreshness }) => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-1.5 flex items-center justify-end gap-6 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">rDOS</span>
        <span className="font-mono text-green-600">{p95Latency}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Last refresh</span>
        <span className="font-mono text-gray-900">{lastRefresh}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Data freshness</span>
        <span className="font-mono text-gray-900">{dataFreshness}</span>
      </div>
    </div>
  );
};
