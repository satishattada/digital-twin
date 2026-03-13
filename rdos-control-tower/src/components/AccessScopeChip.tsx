import React from 'react';

interface AccessScopeChipProps {
  scope: 'Standard' | 'Restricted' | 'Broad';
  onRequestAccess?: () => void;
}

export const AccessScopeChip: React.FC<AccessScopeChipProps> = ({ scope, onRequestAccess }) => {
  const getColor = () => {
    switch (scope) {
      case 'Broad':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Restricted':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-green-50 border-green-200 text-green-700';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 border rounded text-xs ${getColor()}`}>
          Access: {scope}
        </span>
        {scope !== 'Broad' && onRequestAccess && (
          <button
            onClick={onRequestAccess}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Request Broader
          </button>
        )}
      </div>
    </div>
  );
};
