import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SLORibbon } from './SLORibbon';
import { TIME_MACHINE_OPTIONS, PERSONAS } from '../constants';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [timeMachine, setTimeMachine] = useState('now');
  const [persona, setPersona] = useState('leadership');
  // const [executiveMode, setExecutiveMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine which tower based on current path
  const isSupplierTower = location.pathname.startsWith('/supplier');
  const currentTower = isSupplierTower ? 'supplier' : 'asset';

  const navItems = [
    { path: currentTower === 'asset' ? '/' : '/supplier-tower', label: 'Control Tower', icon: '🎯' },
    { path: currentTower === 'asset' ? '/workbench' : '/supplier/workbench', label: 'Strategy Workbench', icon: '📈' },
    { path: currentTower === 'asset' ? '/simulator' : '/supplier/simulator', label: 'Simulator', icon: '⚡' },
    { path: currentTower === 'asset' ? '/governance' : '/supplier/governance', label: 'Governance', icon: '✓' },
    { path: currentTower === 'asset' ? '/alerts' : '/supplier/alerts', label: 'Alerts', icon: '🔔' },
    { path: currentTower === 'asset' ? '/tasks' : '/supplier/tasks', label: 'My Tasks', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SLORibbon p95Latency="P95<2s" lastRefresh="4m" dataFreshness="15m" />
      
      {/* Main Header - BP Style */}
      <header className="relative bg-green-990 text-white shadow-2xl border-b border-bp-blue-500/20 z-[10000]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Logo Image */}
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>

                {/* Brand & Title */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-base md:text-xl font-bold tracking-tight text-white">
                      <span className="hidden lg:inline">rDOS (Decision Operating System)</span>
                      <span className="lg:hidden">rDOS Control Tower</span>
                    </h1>
                    {/* <span className="hidden sm:inline-flex px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                      Smart Platform
                    </span> */}
                  </div>
                  <p className="hidden md:block text-xs text-white/80 font-medium">
                    AI Agent-driven 
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Right Section - Controls & Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Tower Selector Dropdown */}
              <div className="relative">
                <Link
                  to={currentTower === 'asset' ? '/supplier-tower' : '/'}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <span className="font-medium">
                    {currentTower === 'asset' ? '🎯 Asset Strategy' : '📊 Supplier Performance'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
                  </svg>
                </Link>
              </div>

              {/* Search */}
              {/* <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="Search assets, cases..."
                  className="w-48 xl:w-64 px-4 py-2 pl-10 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div> */}

              {/* Time Machine */}
              <select
                value={timeMachine}
                onChange={(e) => setTimeMachine(e.target.value)}
                className="hidden xl:block px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {TIME_MACHINE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
                ))}
              </select>

              {/* Persona */}
              <div className="hidden xl:flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="bg-transparent text-white text-sm focus:outline-none cursor-pointer font-medium"
                  >
                    {PERSONAS.map(p => (
                      <option key={p.value} value={p.value} className="bg-gray-800">{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Executive Mode Toggle */}
              {/* <button
                onClick={() => setExecutiveMode(!executiveMode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  executiveMode
                    ? 'bg-bp-green-600 hover:bg-bp-green-700 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                }`}
              >
                {executiveMode ? '✓ Executive Mode' : 'Executive Mode'}
              </button> */}

              {/* Quick Actions */}
              <div className="relative group hidden xl:block">
                <button className="px-4 py-2 bg-bp-green-600 hover:bg-bp-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl">
                  Quick Actions
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-3xl border border-gray-200 hidden group-hover:block z-50">
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Create Scenario
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Export Report
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Generate rDOS Strategy Pack
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Status */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full blink-live-data"></div>
                <span className="text-xs font-medium text-white/90 blink-slow">Live Data</span>
              </div>

              {/* User */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-medium border border-white/30">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 md:px-6 flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-white border-b-2 border-bp-green-400'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-1 md:mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-green-990 border-t border-white/10 shadow-xl z-50">
            <div className="p-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets, cases..."
                  className="w-full px-4 py-2 pl-10 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Time Machine */}
              <select
                value={timeMachine}
                onChange={(e) => setTimeMachine(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm"
              >
                {TIME_MACHINE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
                ))}
              </select>

              {/* Persona */}
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm"
              >
                {PERSONAS.map(p => (
                  <option key={p.value} value={p.value} className="bg-gray-800">{p.label}</option>
                ))}
              </select>

              {/* Executive Mode */}
              {/* <button
                onClick={() => setExecutiveMode(!executiveMode)}
                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all ${executiveMode ? 'bg-bp-green-600 text-white' : 'bg-white/10 text-white border border-white/20'}`}
              >
                {executiveMode ? '✓ Executive Mode' : 'Executive Mode'}
              </button> */}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
