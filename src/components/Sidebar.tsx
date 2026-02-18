import React from "react";
import { Persona, Recommendation, Task, OpsAlert, Category } from "../types";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activePersona: Persona;
    setActivePersona: (persona: Persona) => void;
    selectedStore: string;
    selectedSiteId: string; // Added selectedSiteId prop
    setSelectedSiteId: (siteId: string) => void; // Added setSelectedSiteId prop    
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
        <label
            htmlFor={label}
            className="text-sm font-medium text-gray-300 pb-1"
        >
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


// Persona Dropdown Component
export const PersonaDropdown: React.FC<{
    activePersona: Persona;
    setActivePersona: (persona: Persona) => void;
}> = ({ activePersona, setActivePersona }) => (
    <div className="flex flex-col w-full">

        <select
            id="persona"
            value={activePersona}
            onChange={(e) => setActivePersona(e.target.value as Persona)}
            className="bg-green-990 text-white border w-full border-green-400 rounded-md shadow-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white p-1"
        >
            <option value="Store Manager">🏪 Store Manager</option>
            <option value="Operations Manager">⚙️ Operations Manager</option>
            <option value="Regional Manager">🌍 Regional Manager</option>
            <option value="Site Manager">🏗️ Site Manager</option>
            <option value="Digital Engineer">🔧 Digital Engineer</option>
            <option value="Asset Strategy">💼 Asset Strategy</option>
            <option value="Supplier Performance">🤝 Supplier Performance</option>
        </select>
    </div>
);

// Animated Avatar Component
const AnimatedAvatar: React.FC<{ persona: Persona; isActive: boolean }> = ({
    persona,
    isActive,
}) => {
    const getPersonaConfig = (persona: Persona) => {
        switch (persona) {
            case "Store Manager":
                return {
                    gradient: "from-green-400 via-blue-500 to-purple-600",
                    image: "/images/store-manager.jpg",
                    alt: "Store Manager",
                };
            case "Operations Manager":
                return {
                    gradient: "from-orange-400 via-red-500 to-pink-600",
                    image: "/images/operation-manager.jpg",
                    alt: "Operations Manager",
                };
            case "Regional Manager":
                return {
                    gradient: "from-purple-400 via-pink-500 to-red-600",
                    image: "/images/regional-manager.jpg",
                    alt: "Regional Manager",
                };
            case "Site Manager":
                return {
                    gradient: "from-blue-400 via-cyan-500 to-teal-600",
                    image: "/images/site-manager.jpg",
                    alt: "Site Manager",
                };
            case "Digital Engineer":
                return {
                    gradient: "from-cyan-400 via-teal-500 to-emerald-600",
                    image: "/images/digital-engineer.jpg",
                    alt: "Digital Engineer",
                };
            case "Asset Strategy":
                return {
                    gradient: "from-amber-400 via-orange-500 to-red-600",
                    image: "/images/asset-strategy.jpg",
                    alt: "Asset Strategy",
                };
            default:
                return {
                    gradient: "from-gray-400 via-gray-500 to-gray-600",
                    image: "/images/default-avatar.jpg",
                    alt: "User",
                };
        }
    };

    const config = getPersonaConfig(persona);

    return (
        <div
            className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
                isActive ? "ring-2 ring-blue-300 shadow-lg" : ""
            }`}
        >
            {/* Background with gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${config.gradient} animate-gradient-xy`}
            />

            {/* Animated particles/dots */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-white rounded-full animate-float-${
                            i % 3
                        }`}
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${20 + i * 10}%`,
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
                {/* {config.image} */}
                <img
                    src={config.image}
                    alt={config.alt}
                    className="w-full h-full object-cover animate-pulse"
                    // onError={(e) => {
                    //     const target = e.target as HTMLImageElement;
                    //     target.style.display = "none";
                    //     target.parentElement!.innerHTML =
                    //         persona === "Store Manager"
                    //             ? "🏪"
                    //             : persona === "Operations Manager"
                    //             ? "⚙️"
                    //             : "🌍";
                    // }}
                />
            </div>

            {/* Hover glow effect */}
            <div
                className={`absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 ${
                    isActive ? "animate-ping opacity-5" : ""
                }`}
            />
        </div>
    );
};

// Role Badge Component
const RoleBadge: React.FC<{ persona: Persona }> = ({ persona }) => {
    const getBadgeConfig = (persona: Persona) => {
        switch (persona) {
            case "Store Manager":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-800",
                    border: "border-blue-200",
                    emoji: "🏪",
                    abbr: "SM",
                };
            case "Operations Manager":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-800",
                    border: "border-orange-200",
                    emoji: "⚙️",
                    abbr: "OM",
                };
            case "Regional Manager":
                return {
                    bg: "bg-purple-100",
                    text: "text-purple-800",
                    border: "border-purple-200",
                    emoji: "🌍",
                    abbr: "RM",
                };
            case "Site Manager":
                return {
                    bg: "bg-teal-100",
                    text: "text-teal-800",
                    border: "border-teal-200",
                    emoji: "🏗️",
                    abbr: "SM",
                };
            case "Digital Engineer":
                return {
                    bg: "bg-emerald-100",
                    text: "text-emerald-800",
                    border: "border-emerald-200",
                    emoji: "🔧",
                    abbr: "DE",
                };
            case "Asset Strategy":
                return {
                    bg: "bg-amber-100",
                    text: "text-amber-800",
                    border: "border-amber-200",
                    emoji: "💼",
                    abbr: "AS",
                };
            case "Supplier Performance":
                return {
                    bg: "bg-indigo-100",
                    text: "text-indigo-800",
                    border: "border-indigo-200",
                    emoji: "🤝",
                    abbr: "SP",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-800",
                    border: "border-gray-200",
                    emoji: "👤",
                    abbr: "U",
                };
        }
    };

    const config = getBadgeConfig(persona);

    return (
        <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
        >
            <span className="text-xs">{config.emoji}</span>
            <span>{config.abbr}</span>
        </div>
    );
};

// Store configuration with siteId's from site-products.json
const storeConfigs = [
    {
        siteId: "10070",
        displayName: "SHIRLEY SF CONNECT",
        fullName: "SHIRLEY SF CONNECT Service Station"
    },
    {
        siteId: "13001",
        displayName: "BOREHAM SF CONNECT",
        fullName: "BOREHAM SF CONNECT Service Station"  
    },
    {
        siteId: "13097",
        displayName: "BURY STREET SF CONNECT",
        fullName: "BURY STREET SF CONNECT Service Station"
    },
    {
        siteId: "10441",
        displayName: "ST ALBANS SF CONNECT",
        fullName: "ST ALBANS SF CONNECT Service Station"
    },
    {
        siteId: "10491",
        displayName: "BESSBOROUGH SF CONNECT",
        fullName: "BESSBOROUGH SF CONNECT Service Station"
    }
];

// Extract display names for dropdown options
const stores = storeConfigs.map(store => store.displayName);

// Helper function to get siteId from store display name
export const getSiteIdFromStore = (storeDisplayName: string): string => {
    const storeConfig = storeConfigs.find(store => store.displayName === storeDisplayName);
    return storeConfig?.siteId || "10070"; // Default to first store if not found
};

// Helper function to get store display name from siteId
export const getStoreFromSiteId = (siteId: string): string => {
    const storeConfig = storeConfigs.find(store => store.siteId === siteId);
    return storeConfig?.displayName || "SHIRLEY SF CONNECT"; // Default to first store if not found
};

// Helper function to get full store information
export const getStoreConfig = (identifier: string): typeof storeConfigs[0] => {
    // Try to find by siteId first, then by display name
    let storeConfig = storeConfigs.find(store => store.siteId === identifier);
    if (!storeConfig) {
        storeConfig = storeConfigs.find(store => store.displayName === identifier);
    }
    return storeConfig || storeConfigs[0]; // Default to first store
};

// Updated categories based on site-products.json analysis
const categories: Category[] = [
    "All", // Default option to show all categories
    "Postal Services", // Stamps, postage, envelopes
    "Stationery & Office", // Pens, paper, notebooks, writing materials
    "Cards & Gifts", // Greeting cards, gift items
    "Tobacco & Smoking", // Cigarettes, tobacco products, lighters
    "Confectionery & Snacks", // Chocolates, sweets, candy, snacks
    "Beverages", // Drinks, juices, water, soft drinks
    "Health & Beauty", // Medicine, cosmetics, toiletries
    "Electronics & Accessories", // Batteries, chargers, cables, phone accessories
    "Automotive", // Car-related products, oil, fuel additives
    "Publications", // Newspapers, magazines, journals
    "Travel & Transport", // Travel tickets, transport cards
    "Food Items", // Food products, meals, fresh items
];

const timePeriodsMap: Record<Persona, string[]> = {
    "Store Manager": ["Last 7 Days", "Last 30 Days", "Last Quarter"],
    "Operations Manager": ["Last 24 Hours", "Last 7 Days", "Last 30 Days"],
    "Regional Manager": [
        "Last Week",
        "Last Month",
        "Last Quarter",
        "Last 6 Months",
        "Last Year",
    ],
    "Site Manager": ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last Quarter"],
    "Digital Engineer": ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last Quarter"],
    "Asset Strategy": ["Last 30 Days", "Last Quarter", "Year to Date", "Last 3 Years"],
    "Supplier Performance": ["Last 30 Days", "Last Quarter", "Year to Date", "Last Fiscal Year"],
};

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    activePersona,
    setActivePersona,
    selectedStore,
    setSelectedSiteId, // Added setSelectedSiteId prop
    selectedSiteId, // Added selectedSiteId prop
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

    // Regional Manager sees all stores, others see individual stores
    const availableStores =
        activePersona === "Regional Manager"
            ? ["All Stores", ...stores]
            : stores;

    // Get current store configuration for display
    const currentStoreConfig = getStoreConfig(selectedStore);

    // Enhanced store change handler that logs siteId changes
    const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStore = e.target.value;
        const newSiteId = getSiteIdFromStore(newStore);
        
        console.log(`Sidebar: Store changing from ${selectedStore} (${selectedSiteId}) to ${newStore} (${newSiteId})`);
        
        setSelectedStore(newStore);
        setSelectedSiteId(newSiteId)
    };

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
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white">
                                Dashboard
                            </h2>
                            <RoleBadge persona={activePersona} />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-green-700 transition-colors"
                        aria-label={
                            sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                        }
                    >
                        {sidebarOpen ? (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
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
                <nav className="flex-grow pl-4 pr-4 overflow-y-auto relative">
                    {sidebarOpen && (
                        <div className="space-y-2">
                            {activePersona !== "Regional Manager" && (
                                <>
                                    <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                                        <FilterDropdown
                                            label={"Store"}
                                            value={selectedStore}
                                            options={availableStores}
                                            onChange={handleStoreChange}
                                        />
                                    </div>
                                    <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                                        <FilterDropdown
                                            label="Period"
                                            value={selectedTimePeriod}
                                            options={timePeriods}
                                            onChange={(e) =>
                                                setSelectedTimePeriod(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center p-3 rounded cursor-pointer transition-colors">
                                        <FilterDropdown
                                            label="Category"
                                            value={selectedCategory}
                                            options={categories}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value as Category
                                                )
                                            }
                                        />
                                    </div>{" "}
                                </>
                            )}
                        </div>
                    )}

                    {/* Quick Stats - Only show when expanded */}
                    {sidebarOpen && (
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                {/* Store Information with SiteId Display */}
                                {activePersona !== "Regional Manager" && (
                                    <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                                <span className="text-blue-400">
                                                    🏪
                                                </span>
                                                Store Info
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            <div className="flex items-center justify-between">
                                                <span>Site ID:</span>
                                                <span className="font-mono font-bold text-blue-300">
                                                    {selectedSiteId}
                                                </span>
                                            </div>
                                            <div className="truncate mt-1">{currentStoreConfig.fullName}</div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-green-400">
                                                📋
                                            </span>
                                            Active Tasks
                                        </span>
                                        <span className="text-lg font-bold text-green-400">
                                            {
                                                tasks.filter(
                                                    (t) => t.status === "To Do"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-blue-400">
                                                💡
                                            </span>
                                            Recommendations
                                        </span>
                                        <span className="text-lg font-bold text-blue-400">
                                            {recommendations.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-orange-400">
                                                🚨
                                            </span>
                                            Alerts
                                        </span>
                                        <span className="text-lg font-bold text-orange-400">
                                            {opsAlerts.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Regional Manager specific stats */}
                                {activePersona === "Regional Manager" && (
                                    <>
                                        <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300 flex items-center gap-2">
                                                    <span className="text-purple-400">
                                                        🏪
                                                    </span>
                                                    Stores
                                                </span>
                                                <span className="text-lg font-bold text-purple-400">
                                                    {stores.length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300 flex items-center gap-2">
                                                    <span className="text-teal-400">
                                                        📊
                                                    </span>
                                                    Performance
                                                </span>
                                                <span className="text-lg font-bold text-teal-400">
                                                    92%
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Category-specific stats when a category is selected */}
                                {selectedCategory && selectedCategory !== "All" && (
                                    <div className="bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                                <span className="text-cyan-400">
                                                    🏷️
                                                </span>
                                                {selectedCategory}
                                            </span>
                                            <span className="text-lg font-bold text-cyan-400">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Persona Selection Dropdown */}
                    {/* <div className="flex items-center p-3 rounded cursor-pointer transition-colors absolute bottom-0 left-0 right-0 mx-4">
                        <PersonaDropdown
                            activePersona={activePersona}
                            setActivePersona={setActivePersona}
                        />
                    </div> */}
                </nav>

                {/* User Profile - Bottom */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center">
                        <AnimatedAvatar
                            persona={activePersona}
                            isActive={true}
                        />
                        {sidebarOpen && (
                            <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-white">
                                    {activePersona}
                                </div>
                                {activePersona !== "Regional Manager" && (
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <span>📍</span>
                                        {selectedStore}
                                        <span className="text-gray-500 font-mono">({selectedSiteId})</span>
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                    {"Use dropdown above to switch roles"}
                                </div>
                            </div>
                        )}
                        {!sidebarOpen && (
                            <div className="absolute left-16 ml-2 bg-gray-800 text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                                <div className="text-xs font-medium">
                                    {activePersona}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {selectedStore} ({selectedSiteId})
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};