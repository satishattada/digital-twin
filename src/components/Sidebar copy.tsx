import React from "react";
import { Persona, Recommendation, Task, OpsAlert, Category } from "../types";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  selectedStore: string;
  tasks: Task[];
  recommendations: Recommendation[];
  opsAlerts: OpsAlert[];
  setSelectedStore: (store: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
}

const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col w-full ">
    <label htmlFor={label} className="text-sm font-medium text-gray-300 pb-1">
      {label}:
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="bg-green-990 text-white border w-full border-green-400 rounded-md shadow-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Animated Avatar Component
const AnimatedAvatar: React.FC<{ persona: Persona; isActive: boolean }> = ({ persona, isActive }) => {
  const isStoreManager = persona === "Store Manager";
  
  return (
    <div className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-300 shadow-lg' : ''
    }`}>
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isStoreManager 
          ? 'from-green-400 via-blue-500 to-purple-600' 
          : 'from-orange-400 via-red-500 to-pink-600'
      } animate-gradient-xy`} />
      
      {/* Animated particles/dots */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full animate-float-${i % 3}`}
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {isStoreManager ? (
            <img 
                src="/images/store-manager.jpg" 
                alt="Store Manager"
                className="animate-pulse"
            />
    
        ) : (
              <img 
                src="/images/operation-manager.jpg" 
                alt="Store Manager"
                className="animate-pulse"
            />
    
        )}
      </div>
      
      {/* Hover glow effect */}
      <div className={`absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 ${
        isActive ? 'animate-ping opacity-5' : ''
      }`} />
    </div>
  );
};

const stores = ["Kempton Park", "Hatton Cross", "Ashford SF"];
const categories: Category[] = [
  "Dairy",
  "Snacks",
  "Beverages",
  "Fresh Produce",
  "Household",
];
const timePeriodsMap: Record<Persona, string[]> = {
  "Store Manager": ["Last 7 Days", "Last 30 Days", "Last Quarter"],
  "Operations Manager": ["Last 24 Hours", "Last 7 Days", "Last 30 Days"],
};

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activePersona,
  setActivePersona,
  selectedStore,
  tasks,
  recommendations,
  opsAlerts,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  selectedTimePeriod,
  setSelectedTimePeriod,
}) => {
  const timePeriods = timePeriodsMap[activePersona];

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(120deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(240deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 3s ease infinite;
        }
        .animate-float-0 {
          animation: float-0 3s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 2.5s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 3.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-green-990 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header with Toggle */}
        <div className="border-b p-4 border-green-700 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-white-400">Dashboard</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-green-700 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow pl-4 pr-4 overflow-y-auto">
          {sidebarOpen && (
            <div className="space-y-2">
              <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                <FilterDropdown
                  label="Store"
                  value={selectedStore}
                  options={stores}
                  onChange={(e) => setSelectedStore(e.target.value)}
                />
              </div>
              <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                <FilterDropdown
                  label="Period"
                  value={selectedTimePeriod}
                  options={timePeriods}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                />
              </div>
              <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                <FilterDropdown
                  label="Category"
                  value={selectedCategory}
                  options={categories}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as Category)
                  }
                />
              </div>
            </div>
          )}

          {/* Quick Stats - Only show when expanded */}
          {sidebarOpen && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Active Tasks</span>
                    <span className="text-lg font-bold text-green-400">
                      {tasks.filter((t) => t.status === "To Do").length}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Recommendations</span>
                    <span className="text-lg font-bold text-blue-400">
                      {recommendations.length}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Alerts</span>
                    <span className="text-lg font-bold text-orange-400">
                      {opsAlerts.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile - Bottom */}
        <div
          className="p-4 border-t border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-300 group"
          onClick={() => {
            const toggledPersona =
              activePersona === "Store Manager"
                ? "Operations Manager"
                : "Store Manager";
            setActivePersona(toggledPersona);
          }}
        >
          <div className="flex items-center">
            <AnimatedAvatar persona={activePersona} isActive={true} />
            {sidebarOpen && (
              <div className="ml-3">
                <div className="text-sm font-medium flex items-center gap-2">
                  {activePersona}
                </div>
                <div className="text-xs text-gray-400">{selectedStore}</div>
              </div>
            )}
          </div>
          
      
        </div>
      </div>
    </>
  );
};