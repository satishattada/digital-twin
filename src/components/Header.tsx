
import React from 'react';
import { Persona, Category } from "../types"

type HeaderProps = {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
  onDigestToggle: () => void;
  onShelfieToggle: () => void;
};

const stores = ['Store A', 'Store B', 'Store C'];
const categories: Category[] = ['Dairy', 'Snacks', 'Beverages', 'Fresh Produce', 'Household'];
const timePeriodsMap: Record<Persona, string[]> = {
    'Store Manager': ['Last 7 Days', 'Last 30 Days', 'Last Quarter'],
    'Operations Manager': ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'],
}

const ToggleButton: React.FC<{ label: Persona; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
      active ? 'bg-white text-[#319331]' : 'text-white hover:bg-green-500'
    }`}
  >
    {label}
  </button>
);



export const Header: React.FC<HeaderProps> = ({
  activePersona,
  setActivePersona,
  selectedStore,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  selectedTimePeriod,
  setSelectedTimePeriod,
  onDigestToggle,
  onShelfieToggle
}) => {
  const timePeriods = timePeriodsMap[activePersona];
  
  return (
    <header className="bg-green-990 text-white p-3 shadow-md flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 shrink-0">
      <h1 className="text-xl font-bold tracking-tight">Shelfie – Smart Dashboard</h1>
   

      <div className="flex items-center space-x-2">
        {/* <div className="bg-green-990 p-1 rounded-lg flex space-x-1">
          <ToggleButton label="Store Manager" active={activePersona === 'Store Manager'} onClick={() => setActivePersona('Store Manager')} />
          <ToggleButton label="Operations Manager" active={activePersona === 'Operations Manager'} onClick={() => setActivePersona('Operations Manager')} />
        </div> */}
        <div className="flex items-center border-l border-green-400 pl-2 space-x-1">
            <button onClick={onDigestToggle} className="p-2 rounded-full hover:bg-green-500 transition-colors" aria-label="Open Daily Digest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            </button>
            <button onClick={onShelfieToggle} className="p-2 rounded-full hover:bg-green-500 transition-colors" aria-label="Open Shelf Scanner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.5 4a.5.5 0 000-1H13a.5.5 0 000 1h1.5zM4 12a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3-4a1 1 0 100 2h.01a1 1 0 100-2H7zm4 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};
