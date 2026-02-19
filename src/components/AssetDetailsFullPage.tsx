import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Equipment, equipmentDataAtom } from '../store/facilitiesStore';

interface AssetDetailsFullPageProps {
  equipment: Equipment;
  onBack: () => void;
}

const AssetDetailsFullPage: React.FC<AssetDetailsFullPageProps> = ({ equipment, onBack }) => {
  const [equipmentData, setEquipmentData] = useAtom(equipmentDataAtom);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [simulatorState, setSimulatorState] = useState({
    waterLevel: 100,
    coffeeBeansLevel: 80,
    milkLevel: 60,
    temperature: 92,
    pressure: 9,
    brewing: false,
    cleaningNeeded: false,
  });

  const isCoffeeMachine = equipment.type === 'coffee-machine';

  const showNotification = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const triggerIssue = (issueType: string) => {
    const updatedEquipment = equipmentData.map(eq => {
      if (eq.id === equipment.id) {
        let newAlerts = [...eq.alerts];
        let newStatus = eq.status;

        switch (issueType) {
          case 'water-low':
            if (!newAlerts.includes('Water reservoir low - refill required')) {
              newAlerts.push('Water reservoir low - refill required');
              newStatus = 'warning';
            }
            setSimulatorState(prev => ({ ...prev, waterLevel: 15 }));
            break;
          case 'beans-empty':
            if (!newAlerts.includes('Coffee beans empty - machine inoperable')) {
              newAlerts.push('Coffee beans empty - machine inoperable');
              newStatus = 'critical';
            }
            setSimulatorState(prev => ({ ...prev, coffeeBeansLevel: 0 }));
            break;
          case 'cleaning-required':
            if (!newAlerts.includes('Cleaning cycle overdue - maintenance required')) {
              newAlerts.push('Cleaning cycle overdue - maintenance required');
              newStatus = 'warning';
            }
            setSimulatorState(prev => ({ ...prev, cleaningNeeded: true }));
            break;
          case 'temp-issue':
            if (!newAlerts.includes('Temperature regulation malfunction detected')) {
              newAlerts.push('Temperature regulation malfunction detected');
              newStatus = 'critical';
            }
            setSimulatorState(prev => ({ ...prev, temperature: 65 }));
            break;
          case 'pressure-issue':
            if (!newAlerts.includes('Pressure system anomaly - check pump')) {
              newAlerts.push('Pressure system anomaly - check pump');
              newStatus = 'warning';
            }
            setSimulatorState(prev => ({ ...prev, pressure: 4 }));
            break;
        }

        return {
          ...eq,
          alerts: newAlerts,
          status: newStatus,
        };
      }
      return eq;
    });

    setEquipmentData(updatedEquipment);
    showNotification();
  };

  const resolveAllIssues = () => {
    const updatedEquipment = equipmentData.map(eq => {
      if (eq.id === equipment.id) {
        return {
          ...eq,
          alerts: [],
          status: 'operational' as const,
        };
      }
      return eq;
    });

    setEquipmentData(updatedEquipment);
    setSimulatorState({
      waterLevel: 100,
      coffeeBeansLevel: 80,
      milkLevel: 60,
      temperature: 92,
      pressure: 9,
      brewing: false,
      cleaningNeeded: false,
    });
    showNotification();
  };

  const resolveSingleAlert = (alertToRemove: string) => {
    const updatedEquipment = equipmentData.map(eq => {
      if (eq.id === equipment.id) {
        const newAlerts = eq.alerts.filter(alert => alert !== alertToRemove);
        let newStatus = eq.status;
        
        // If no critical alerts remain, downgrade from critical to warning or operational
        if (newAlerts.length === 0) {
          newStatus = 'operational';
        } else if (newStatus === 'critical') {
          // Check if any remaining alerts are critical
          const hasCriticalAlert = newAlerts.some(alert => 
            alert.includes('empty') || 
            alert.includes('failure') || 
            alert.includes('malfunction') ||
            alert.includes('leak')
          );
          newStatus = hasCriticalAlert ? 'critical' : 'warning';
        }
        
        return {
          ...eq,
          alerts: newAlerts,
          status: newStatus,
        };
      }
      return eq;
    });

    setEquipmentData(updatedEquipment);
    
    // Reset simulator state for resolved issues
    if (alertToRemove.includes('Water reservoir low')) {
      setSimulatorState(prev => ({ ...prev, waterLevel: 100 }));
    }
    if (alertToRemove.includes('Coffee beans')) {
      setSimulatorState(prev => ({ ...prev, coffeeBeansLevel: 80 }));
    }
    if (alertToRemove.includes('Temperature')) {
      setSimulatorState(prev => ({ ...prev, temperature: 92 }));
    }
    if (alertToRemove.includes('Pressure')) {
      setSimulatorState(prev => ({ ...prev, pressure: 9 }));
    }
    if (alertToRemove.includes('Cleaning')) {
      setSimulatorState(prev => ({ ...prev, cleaningNeeded: false }));
    }
    
    showNotification();
  };

  const brewCoffee = () => {
    setSimulatorState(prev => ({ ...prev, brewing: true }));
    setTimeout(() => {
      setSimulatorState(prev => {
        const newWaterLevel = Math.max(0, prev.waterLevel - 20);
        const newBeansLevel = Math.max(0, prev.coffeeBeansLevel - 5);
        
        // Update equipment data if water or beans are getting low
        const updatedEquipment = equipmentData.map(eq => {
          if (eq.id === equipment.id) {
            let newAlerts = [...eq.alerts];
            let newStatus = eq.status;
            
            // Check water level and add alert if low
            if (newWaterLevel < 20 && !newAlerts.includes('Water reservoir low - refill required')) {
              newAlerts.push('Water reservoir low - refill required');
              newStatus = 'warning';
            }
            
            // Check beans level and add alert if empty/low
            if (newBeansLevel === 0 && !newAlerts.includes('Coffee beans empty - machine inoperable')) {
              newAlerts = newAlerts.filter(a => a !== 'Water reservoir low - refill required');
              newAlerts.push('Coffee beans empty - machine inoperable');
              newStatus = 'critical';
            } else if (newBeansLevel < 10 && newBeansLevel > 0 && !newAlerts.includes('Coffee beans running low - restock soon')) {
              if (!newAlerts.includes('Coffee beans empty - machine inoperable')) {
                newAlerts.push('Coffee beans running low - restock soon');
                if (newStatus !== 'critical') {
                  newStatus = 'warning';
                }
              }
            }
            
            return {
              ...eq,
              alerts: newAlerts,
              status: newStatus,
            };
          }
          return eq;
        });
        
        setEquipmentData(updatedEquipment);
        if (newWaterLevel < 20 || newBeansLevel < 10) {
          showNotification();
        }
        
        return {
          ...prev,
          brewing: false,
          waterLevel: newWaterLevel,
          coffeeBeansLevel: newBeansLevel,
        };
      });
    }, 3000);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <span className="text-red-500">🔴</span>;
      case 'warning': return <span className="text-yellow-500">🟡</span>;
      case 'operational': return <span className="text-green-500">🟢</span>;
      case 'maintenance': return <span className="text-blue-500">🔵</span>;
      default: return <span className="text-gray-500">⚪</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'operational': return 'bg-green-50 border-green-200 text-green-700';
      case 'maintenance': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status);
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${colorClass}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Save Notification Toast */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Changes Saved!</p>
              {/* <p className="text-sm text-green-100">Data persisted to localStorage & ready for CSV export</p> */}
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Asset Details</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <span className="text-5xl">🔧</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{equipment.name}</h2>
                <p className="text-blue-100 text-lg mb-3">Asset ID: {equipment.id}</p>
                <div className="flex items-center gap-3">
                  {getStatusBadge(equipment.status)}
                  {equipment.criticality && (
                    <span className="px-4 py-2 bg-red-500 bg-opacity-90 text-white rounded-full text-sm font-semibold">
                      Criticality: {equipment.criticality}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm mb-1">Last Updated</p>
              <p className="text-white font-semibold text-lg">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {equipment.alerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🚨</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-3">Active Alerts ({equipment.alerts.length})</h3>
                <div className="space-y-3">
                  {equipment.alerts.map((alert, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-red-800 font-semibold mb-1">{alert}</p>
                          <p className="text-sm text-red-600">Priority: High • Requires immediate attention</p>
                        </div>
                        <button 
                          onClick={() => resolveSingleAlert(alert)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>📋</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium mb-2">Equipment Type</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">{equipment.type}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-2">Location</p>
                  <p className="text-lg font-bold text-gray-900">{equipment.location}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-2">Zone</p>
                  <p className="text-lg font-bold text-gray-900">{equipment.zone}</p>
                </div>
                {equipment.category && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium mb-2">Category</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{equipment.category}</p>
                  </div>
                )}
                {equipment.maintenanceMode && (
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-600 font-medium mb-2">Maintenance Mode</p>
                    <p className="text-lg font-bold text-gray-900">{equipment.maintenanceMode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Schedule Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🔧</span>
                Maintenance Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-blue-600 font-semibold">Last Maintenance</p>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{equipment.lastMaintenance}</p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-green-600 font-semibold">Next Maintenance</p>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{equipment.nextMaintenance}</p>
                </div>
                {equipment.serviceFrequency && (
                  <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                    <p className="text-sm text-purple-600 font-semibold mb-2">Service Frequency</p>
                    <p className="text-lg font-bold text-gray-900">{equipment.serviceFrequency}</p>
                  </div>
                )}
                {equipment.replacementCycle && (
                  <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold mb-2">Replacement Cycle</p>
                    <p className="text-lg font-bold text-gray-900">{equipment.replacementCycle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Metrics */}
            {equipment.temperature !== undefined && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📊</span>
                  Operational Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-red-600 font-semibold">Current Temperature</p>
                      <span className="text-2xl">🌡️</span>
                    </div>
                    <p className="text-4xl font-bold text-red-700">{equipment.temperature}°C</p>
                    {equipment.targetTemp !== undefined && (
                      <p className="text-sm text-red-600 mt-2">
                        {equipment.temperature > equipment.targetTemp ? '↑' : '↓'} 
                        {Math.abs(equipment.temperature - equipment.targetTemp).toFixed(1)}°C from target
                      </p>
                    )}
                  </div>
                  {equipment.targetTemp !== undefined && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-green-600 font-semibold">Target Temperature</p>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <p className="text-4xl font-bold text-green-700">{equipment.targetTemp}°C</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Coffee Machine Simulator */}
            {isCoffeeMachine && (
              <div className="bg-white rounded-xl shadow-md p-6 border-4 border-amber-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>☕</span>
                  Coffee Machine Simulator
                </h3>
                
                {/* Visual 3D Coffee Machine */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-2xl p-8 mb-6 relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-5 rounded-full blur-3xl"></div>
                  
                  {/* 3D Coffee Machine Container */}
                  <div className="relative max-w-lg mx-auto perspective-1000">
                    {/* Machine Base/Body - 3D effect */}
                    <div className="relative" style={{ perspective: '1000px' }}>
                      {/* Back panel shadow for depth */}
                      <div className="absolute inset-0 bg-black opacity-20 blur-xl transform translate-y-4 rounded-2xl"></div>
                      
                      {/* Main Machine Body */}
                      <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl shadow-2xl border-4 border-gray-600 overflow-hidden"
                           style={{ transform: 'rotateX(2deg)' }}>
                        
                        {/* Top accent line */}
                        <div className="h-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 border-b-2 border-gray-800"></div>
                        
                        {/* Machine Interior */}
                        <div className="p-6">
                          {/* Digital Display Panel - 3D inset */}
                          <div className="relative mb-6">
                            <div className="absolute inset-0 bg-black opacity-30 blur-sm rounded-lg"></div>
                            <div className="relative bg-gradient-to-b from-green-950 to-green-900 rounded-lg p-4 border-4 border-gray-700 shadow-inner"
                                 style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)' }}>
                              <div className="text-green-400 font-mono text-center">
                                {simulatorState.brewing ? (
                                  <div className="space-y-2">
                                    <div className="flex justify-center items-center gap-2 animate-pulse">
                                      <span className="text-2xl">☕</span>
                                      <p className="text-lg font-bold">BREWING...</p>
                                    </div>
                                    <div className="w-full bg-green-950 rounded-full h-3 border border-green-700">
                                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full animate-pulse shadow-lg shadow-green-500/50" 
                                           style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-xs text-green-500">Dispensing fresh coffee...</p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-2xl font-bold mb-1">READY</p>
                                    <p className="text-xs text-green-500">System operational</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Brewing Chamber Visual */}
                          <div className="mb-4 relative">
                            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 border-2 border-amber-900 shadow-inner relative overflow-hidden"
                                 style={{ boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8)' }}>
                              {/* Coffee spout */}
                              <div className="flex justify-center mb-2">
                                <div className="relative">
                                  <div className="w-16 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-full border-2 border-gray-600"></div>
                                  {simulatorState.brewing && (
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                      <div className="w-1 h-12 bg-gradient-to-b from-amber-800 to-amber-950 animate-pulse"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Coffee cup platform */}
                              <div className="flex justify-center">
                                <div className="relative">
                                  {/* Grid pattern for cup platform */}
                                  <div className="w-24 h-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded border border-gray-500"
                                       style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    <div className="flex gap-1 px-2 py-0.5">
                                      <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                      <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                      <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                    </div>
                                  </div>
                                  {/* Coffee cup */}
                                  {simulatorState.brewing && (
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                      <div className="w-12 h-10 bg-gradient-to-b from-gray-100 to-white rounded-b-lg border-2 border-gray-300"
                                           style={{ borderTopWidth: '1px', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Control Panel - Status Indicators Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Water Level Indicator */}
                            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-lg p-3 border-2 border-gray-700 shadow-lg"
                                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-blue-300 font-bold flex items-center gap-1">
                                  <span>💧</span> WATER
                                </span>
                                <span className={`text-xs font-bold ${simulatorState.waterLevel < 20 ? 'text-red-400' : 'text-blue-400'}`}>
                                  {simulatorState.waterLevel}%
                                </span>
                              </div>
                              <div className="relative w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden"
                                   style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    simulatorState.waterLevel < 20 
                                      ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/50' 
                                      : 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg shadow-blue-500/50'
                                  }`}
                                  style={{ width: `${simulatorState.waterLevel}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Coffee Beans Indicator */}
                            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-lg p-3 border-2 border-gray-700 shadow-lg"
                                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                                  <span>🫘</span> BEANS
                                </span>
                                <span className={`text-xs font-bold ${simulatorState.coffeeBeansLevel < 10 ? 'text-red-400' : 'text-amber-400'}`}>
                                  {simulatorState.coffeeBeansLevel}%
                                </span>
                              </div>
                              <div className="relative w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden"
                                   style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    simulatorState.coffeeBeansLevel < 10 
                                      ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/50' 
                                      : 'bg-gradient-to-r from-amber-700 to-amber-500 shadow-lg shadow-amber-500/50'
                                  }`}
                                  style={{ width: `${simulatorState.coffeeBeansLevel}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Milk Level Indicator */}
                            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-lg p-3 border-2 border-gray-700 shadow-lg"
                                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-300 font-bold flex items-center gap-1">
                                  <span>🥛</span> MILK
                                </span>
                                <span className="text-xs font-bold text-gray-200">{simulatorState.milkLevel}%</span>
                              </div>
                              <div className="relative w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden"
                                   style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                                <div 
                                  className="bg-gradient-to-r from-gray-100 to-white h-3 rounded-full transition-all duration-500 shadow-lg shadow-white/30"
                                  style={{ width: `${simulatorState.milkLevel}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Temperature Indicator */}
                            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-lg p-3 border-2 border-gray-700 shadow-lg"
                                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)' }}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-orange-300 font-bold flex items-center gap-1">
                                  <span>🌡️</span> TEMP
                                </span>
                                <span className={`text-xs font-bold ${simulatorState.temperature < 85 ? 'text-red-400' : 'text-orange-400'}`}>
                                  {simulatorState.temperature}°C
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Target:</span>
                                <span className="text-xs text-green-400 font-semibold">92°C</span>
                              </div>
                            </div>
                          </div>

                          {/* Main Brew Button - 3D style */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-black opacity-20 blur-md transform translate-y-2 rounded-xl"></div>
                            <button
                              onClick={brewCoffee}
                              disabled={simulatorState.brewing || simulatorState.coffeeBeansLevel === 0 || simulatorState.waterLevel < 10}
                              className={`relative w-full py-5 rounded-xl font-bold text-xl transition-all transform ${
                                simulatorState.brewing || simulatorState.coffeeBeansLevel === 0 || simulatorState.waterLevel < 10
                                  ? 'bg-gradient-to-b from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border-4 border-gray-600'
                                  : 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-white hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 active:scale-95 border-4 border-amber-600 shadow-lg shadow-amber-600/50 hover:shadow-xl hover:shadow-amber-600/60'
                              }`}
                              style={!(simulatorState.brewing || simulatorState.coffeeBeansLevel === 0 || simulatorState.waterLevel < 10) ? {
                                boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2), 0 8px 16px rgba(217, 119, 6, 0.4)'
                              } : {}}
                            >
                              <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">{simulatorState.brewing ? '⏳' : '☕'}</span>
                                <span>{simulatorState.brewing ? 'BREWING...' : 'BREW COFFEE'}</span>
                              </div>
                            </button>
                          </div>
                        </div>
                        
                        {/* Bottom accent */}
                        <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-t-2 border-gray-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Triggers */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                    <span>⚠️</span>
                    Trigger Issues (Simulator Controls)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => triggerIssue('water-low')}
                      className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      💧 Low Water
                    </button>
                    <button
                      onClick={() => triggerIssue('beans-empty')}
                      className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      🫘 Empty Beans
                    </button>
                    <button
                      onClick={() => triggerIssue('cleaning-required')}
                      className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      🧹 Cleaning Due
                    </button>
                    <button
                      onClick={() => triggerIssue('temp-issue')}
                      className="px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      🌡️ Temp Issue
                    </button>
                    <button
                      onClick={() => triggerIssue('pressure-issue')}
                      className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      ⚙️ Pressure Issue
                    </button>
                    <button
                      onClick={resolveAllIssues}
                      className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      ✅ Resolve All
                    </button>
                  </div>
                  {/* <p className="text-xs text-red-600">
                    💾 Changes are automatically saved to localStorage and will appear in the Facilities Dashboard. Use "Export CSV" button to download updated data.
                  </p> */}
                </div>
              </div>
            )}

            {/* Compliance & KPIs */}
            {(equipment.compliance || equipment.kpis) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipment.compliance && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>✅</span>
                      Compliance
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700 leading-relaxed">{equipment.compliance}</p>
                    </div>
                  </div>
                )}
                {equipment.kpis && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📈</span>
                      Key Performance Indicators
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700 leading-relaxed">{equipment.kpis}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Maintenance
                </button>
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>
                <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Create Alert
                </button>
                <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Details
                </button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📅</span>
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-gray-900">Maintenance Completed</p>
                    <p className="text-xs text-gray-500">{equipment.lastMaintenance}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-gray-900">Inspection Passed</p>
                    <p className="text-xs text-gray-500">{equipment.lastMaintenance}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Status Updated</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                Additional Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Installation Date</span>
                  <span className="font-medium text-gray-900">{equipment.lastMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor</span>
                  <span className="font-medium text-gray-900">Standard Supplier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Inspection</span>
                  <span className="font-medium text-gray-900">{equipment.lastMaintenance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsFullPage;
