import React from 'react';
import { Category, Insight, InsightStatus } from "../types"
import { MOCK_INSIGHTS_DATA } from "../constants"

type InsightsAndAlertsProps = {
  selectedCategory: Category;
};

const getStatusStyles = (status: InsightStatus) => {
    switch (status) {
        case 'Urgent': return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800', badge: 'bg-red-500' };
        case 'Pending': return { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', badge: 'bg-amber-500' };
        case 'Resolved': return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-500' };
        default: return { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-800', badge: 'bg-gray-500' };
    }
};

const getImpactColor = (impact: string) => {
    if (impact.startsWith('+')) return 'font-bold text-green-600 ml-1';
    if (impact.startsWith('-')) return 'font-bold text-red-600 ml-1';
    return 'font-bold text-gray-800 ml-1';
};

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const styles = getStatusStyles(insight.status);
    return (
        <div className={`${styles.bg} border-l-4 ${styles.border} p-3 rounded-r-lg shadow-sm flex flex-col`}>
            <div>
                <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm ${styles.text}`}>{insight.title}</h4>
                    <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${styles.badge}`}>{insight.status}</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">{insight.description}</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                    <span>{insight.timestamp}</span>
                    <span className="font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{insight.type}</span>
                </div>
            </div>
            {insight.projectedImpact && (
                <div className="mt-2 pt-2 border-t border-gray-300/60">
                    <p className="text-xs font-semibold text-gray-600">
                        Projected Impact:
                        <span className={getImpactColor(insight.projectedImpact)}>
                            {insight.projectedImpact}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export const InsightsAndAlerts: React.FC<InsightsAndAlertsProps> = ({ selectedCategory }) => {
  const insights = MOCK_INSIGHTS_DATA[selectedCategory];

  return (
    <div className="space-y-3">
      {insights.length > 0 ? (
        insights.map(insight => <InsightCard key={insight.id} insight={insight} />)
      ) : (
         <div className="text-center text-gray-500 py-8 h-full flex flex-col justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-sm font-semibold">No alerts.</p>
            <p className="text-xs">All systems nominal for this category.</p>
        </div>
      )}
    </div>
  );
};