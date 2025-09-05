import React from 'react';
import { OpsAlert, Urgency } from "../types"

type OpsAlertsProps = {
  alerts: OpsAlert[];
  onDismiss: (id: number) => void;
};

const getStatusStyles = (urgency: Urgency) => {
    switch (urgency) {
        case 'Urgent':
        case 'Critical':
            return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800', badge: 'bg-red-500' };
        case 'Pending':
        case 'Moderate':
            return { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', badge: 'bg-amber-500' };
        default: return { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-800', badge: 'bg-gray-500' };
    }
};

const AlertCard: React.FC<{alert: OpsAlert; onDismiss: (id: number) => void;}> = ({alert, onDismiss}) => {
    const styles = getStatusStyles(alert.urgency);
    return (
        <div className={`${styles.bg} border-l-4 ${styles.border} p-2.5 rounded-r-lg shadow-sm flex flex-col`}>
            <div className="flex justify-between items-start">
                <h4 className={`font-bold text-sm ${styles.text}`}>{alert.title}</h4>
                <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${styles.badge}`}>{alert.urgency}</span>
            </div>
            <p className="text-xs text-gray-700 mt-1">{alert.message}</p>
            <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>{alert.timestamp}</span>
            </div>
             <div className="flex justify-end space-x-2 mt-2">
                <button className="px-2 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
                    ✅ Accept
                </button>
                <button onClick={() => onDismiss(alert.id)} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
                    ❌ Dismiss
                </button>
            </div>
        </div>
    )
}

export const OpsAlerts: React.FC<OpsAlertsProps> = ({ alerts, onDismiss }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-md font-bold text-[#005BAC] mb-2 shrink-0">Alerts Panel</h2>
      <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
        {alerts.length > 0 ? (
            alerts.slice(0, 3).map(alert => <AlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />)
        ) : (
            <div className="text-center text-gray-400 pt-8 h-full flex flex-col justify-center items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <p className="text-sm mt-1">No alerts.</p>
            </div>
        )}
      </div>
    </div>
  );
};