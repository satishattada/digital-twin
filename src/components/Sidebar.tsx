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

const stores = ["Store A", "Store B", "Store C"];
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
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-green-990 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Sidebar Header with Toggle */}
      <div className=" border-b p-4 border-green-700 flex items-center justify-between">
        {sidebarOpen && (
          <h2 className="text-lg font-bold text-white-400">Dashboard</h2>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-green-700 transition-colors"
        >
          {sidebarOpen ? "◀" : "▶"}
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
            <div className="flex items-center p-3 rounded  cursor-pointer transition-colors">
              <FilterDropdown
                label="Store"
                value={selectedStore}
                options={stores}
                onChange={(e) => setSelectedStore(e.target.value)}
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
            {/* <div className="flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors">
            <span className="text-xl">📋</span>
            {sidebarOpen && <span className="ml-3">Tasks</span>}
            {sidebarOpen && tasks.filter(t => t.status === 'To Do').length > 0 && (
              <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === 'To Do').length}
              </span>
            )}
          </div>
          <div className="flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors">
            <span className="text-xl">🔔</span>
            {sidebarOpen && <span className="ml-3">Alerts</span>}
            {sidebarOpen && opsAlerts.length > 0 && (
              <span className="ml-auto bg-orange-500 text-xs px-2 py-1 rounded-full">
                {opsAlerts.length}
              </span>
            )}
          </div>
          <div className="flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors">
            <span className="text-xl">🎯</span>
            {sidebarOpen && <span className="ml-3">Recommendations</span>}
            {sidebarOpen && recommendations.length > 0 && (
              <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full">
                {recommendations.length}
              </span>
            )}
          </div>
          <div className="flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors">
            <span className="text-xl">📊</span>
            {sidebarOpen && <span className="ml-3">Reports</span>}
          </div>
          <div className="flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors">
            <span className="text-xl">⚙️</span>
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </div> */}
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
        className="p-4 border-t border-gray-700 cursor-pointer"
        onClick={() => {
          const toggledPersona =
            activePersona === "Store Manager"
              ? "Operations Manager"
              : "Store Manager";
          setActivePersona(toggledPersona);
        }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
            {activePersona === "Store Manager" ? "SM" : "OM"}
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <div className="text-sm font-medium">{activePersona}</div>
              <div className="text-xs text-gray-400">{selectedStore}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
