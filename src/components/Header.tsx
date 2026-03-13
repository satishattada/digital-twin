
import React from 'react';
import { Persona, Category } from "../types"
import { PersonaDropdown } from './Sidebar';

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

const timePeriodsMap: Record<Persona, string[]> = {
    'Store Manager': ['Last 7 Days', 'Last 30 Days', 'Last Quarter'],
    'Operations Manager': ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'],
    'Regional Manager': ['Last 7 Days', 'Last 30 Days', 'Year to Date'],
    'Site Manager': ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last Quarter'],
    'Digital Engineer': ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last Quarter'],
    'Asset Strategy': ['Last 30 Days', 'Last Quarter', 'Year to Date', 'Last 3 Years'],
    'Supplier Performance': ['Last 30 Days', 'Last Quarter', 'Year to Date', 'Last Fiscal Year'],
}

const ActionButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  label: string; 
  variant?: 'primary' | 'secondary';
}> = ({ onClick, children, label, variant = 'secondary' }) => (
  <button
    onClick={onClick}
    className={`
      group relative p-2.5 rounded-xl font-medium transition-all duration-200 
      ${variant === 'primary' 
        ? 'bg-bp-blue-600 hover:bg-bp-blue-700 text-white shadow-lg hover:shadow-xl' 
        : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/30'
      }
      active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-bp-blue-600
    `}
    aria-label={label}
    title={label}
  >
    <div className="w-5 h-5">{children}</div>
    {/* Tooltip */}
    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
      {label}
    </div>
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
    <header className="relative bg-green-990 text-white shadow-2xl border-b border-bp-blue-500/20 print:hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between mx-auto">
          
          {/* Left Section - Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Enhanced Logo */}
              <div className="relative">
                <div className="absolute inset-0  rounded-xl blur-sm opacity-20"></div>
                <img 
                  src="/images/logo.png" 
                  alt="BP Logo" 
                  className="relative h-10 w-auto"
                />
              </div>
              
              {/* Brand & Title */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Retail Operations
                  </h1>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                    Smart Dashboard
                  </span>
                </div>
                <p className="text-xs text-white/80 font-medium">
                  {/* Digital Twin Analytics Platform */}
                  Digital Twin for Stores
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Controls & Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Persona Selection */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <PersonaDropdown
                  activePersona={activePersona}
                  setActivePersona={setActivePersona}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <ActionButton
                onClick={onDigestToggle}
                label="Daily Digest & Analytics"
                variant="secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </ActionButton>
              
              <ActionButton
                onClick={onShelfieToggle}
                label="Shelfie Camera Scanner"
                variant="primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </ActionButton>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full blink-live-data"></div>
                <span className="text-xs font-medium text-white/90 blink-slow">Live Data</span>
              </div>
            </div>

          </div>
        </div>


      </div>
    </header>
  );
};
