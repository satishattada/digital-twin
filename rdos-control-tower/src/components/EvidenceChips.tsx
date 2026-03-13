import React from 'react';

interface EvidenceChipsProps {
  chips: string[];
}

export const EvidenceChips: React.FC<EvidenceChipsProps> = ({ chips }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-1 bg-purple-100 border border-purple-200 rounded-full text-xs font-medium text-purple-800"
        >
          {chip}
        </span>
      ))}
    </div>
  );
};
