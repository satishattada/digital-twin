import React, { useState } from 'react';
import { Guardrail } from '../types';

interface GuardrailBadgeProps {
  guardrail: Guardrail;
}

export const GuardrailBadge: React.FC<GuardrailBadgeProps> = ({ guardrail }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 border border-amber-300 rounded text-xs font-medium text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowDrawer(true)}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          {guardrail.type}
        </span>

        {showTooltip && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
            Constrained by {guardrail.type}. Click to view rule.
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {showDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end" onClick={() => setShowDrawer(false)}>
          <div className="bg-white w-96 h-full shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Guardrail Rule</h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{guardrail.type}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Rule</label>
                <p className="mt-1 text-sm text-gray-700">{guardrail.rule}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Reason</label>
                <p className="mt-1 text-sm text-gray-700">{guardrail.reason}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Policy Reference</label>
                <p className="mt-1 text-sm font-mono text-blue-600">{guardrail.policyRef}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface GuardrailBadgesProps {
  guardrails: Guardrail[];
}

export const GuardrailBadges: React.FC<GuardrailBadgesProps> = ({ guardrails }) => {
  if (guardrails.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {guardrails.map((guardrail, index) => (
        <GuardrailBadge key={index} guardrail={guardrail} />
      ))}
    </div>
  );
};
