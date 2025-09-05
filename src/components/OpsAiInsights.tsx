import React from 'react';
import { Category, OpsInsight } from "../types"

type OpsAiInsightsProps = {
  insights: OpsInsight[];
  onCreateTask: (insight: OpsInsight) => void;
  onIgnore: (id: number) => void;
};

const InsightCard: React.FC<{ insight: OpsInsight; onCreateTask: (insight: OpsInsight) => void; onIgnore: (id: number) => void; }> = ({ insight, onCreateTask, onIgnore }) => (
  <div className="bg-blue-50 border-l-4 border-[#005BAC] p-3 rounded-r-lg shadow-sm">
    <div className="flex justify-between items-start">
        <h4 className="font-bold text-sm text-[#005BAC]">{insight.title}</h4>
        <div className="relative group">
            <span className="text-blue-600 cursor-help">ℹ️</span>
            <div className="absolute bottom-full right-full mr-2 w-64 p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                <span className="font-bold">AI Rationale:</span> {insight.rationale}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
        </div>
    </div>
    <p className="text-sm text-gray-700 my-1">{insight.description}</p>
    <p className="text-sm font-semibold text-red-700 my-1">{insight.risk}</p>
     <div className="flex justify-end items-center pt-2 border-t border-blue-200 mt-2 gap-2">
         <p className="text-xs text-gray-600 flex-1 min-w-0 font-semibold">Action: <span className="font-normal">{insight.action}</span></p>
         <div className="flex space-x-2 shrink-0">
            <button 
                onClick={() => onIgnore(insight.id)}
                className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
                ❌ Ignore
            </button>
            <button 
                onClick={() => onCreateTask(insight)}
                className="px-2 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
                ✅ Create Task
            </button>
        </div>
    </div>
  </div>
);

export const OpsAiInsights: React.FC<OpsAiInsightsProps> = ({ insights, onCreateTask, onIgnore }) => {

  return (
    <div className="flex flex-col h-full">
       <h2 className="text-md font-bold text-[#005BAC] mb-2 shrink-0">AI Insights &amp; Recommendations</h2>
       <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
            {insights.length > 0 ? (
                insights.map(insight => <InsightCard key={insight.id} insight={insight} onCreateTask={onCreateTask} onIgnore={onIgnore} />)
            ) : (
                <div className="text-center text-gray-400 pt-8 h-full flex flex-col justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm mt-1">No new insights.</p>
                </div>
            )}
       </div>
    </div>
  );
};