import React from "react";
import RetailFacilityLayout3D from "./RetailFacilityLayout3D";
import RetailFacilityLayout2D from "./RetailFacilityLayout2D";

interface Asset {
    id: string;
    name: string;
    // 2D positioning (percentage-based)
    position2D: {
        x: number;
        y: number;
    };
    // 3D positioning (isometric coordinates)
    position3D: {
        x: number;
        y: number;
        z?: number; // Depth/height for isometric view
    };
    type: "building" | "equipment" | "structure" | "vehicle" | "tree";
    icon2D: string;
    icon3D: string; // Image path for 3D view
    width?: number;
    height?: number;
    depth?: number; // 3D depth/height for isometric view (legacy, use position3D.z)
    category?: string; // Asset category for filtering
    className?: string; // Additional CSS classes
}

interface RetailFacilityLayoutProps {
    onAssetClick?: (asset: Asset) => void;
    selectedAssetId?: string;
    viewMode?: "3d" | "2d";
    visibleAssetTypes?: Set<string>;
    equipmentData?: Array<{id: string; status: 'operational' | 'warning' | 'critical' | 'offline'}>;
}

export const RetailFacilityLayout: React.FC<RetailFacilityLayoutProps> = ({
    onAssetClick,
    selectedAssetId,
    viewMode = "3d",
    visibleAssetTypes = new Set([
        "buildings",
        "fuel",
        "ev-charging",
        "energy",
        "security",
        "service",
        "infrastructure",
        "other",
    ]),
    equipmentData = [],
}) => {
    const [showLegend, setShowLegend] = React.useState(true);
    const assets: Asset[] = [
        // ============= BUILDINGS =============
        // Main Convenience Store Building
        {
            id: "store-main",
            name: "Convenience Store",
            position2D: { x: 45, y: 14 },
            position3D: { x: 46, y: 21, z: 25 },
            type: "building",
            icon2D: "🏪",
            icon3D: "/images/3d/store-building.svg",
            width: 35,
            height: 23,
            depth: 25,
            category: "buildings",
        },

        // Car Wash Building
        {
            id: "carwash-building",
            name: "Automated Car Wash",
            position2D: { x: 6, y: 17 },
            position3D: { x: 11, y: 54, z: 18 },
            type: "building",
            icon2D: "🚗",
            icon3D: "/images/3d/placeholder.svg",
            width: 24,
            height: 20,
            depth: 18,
            category: "buildings",
        },

        // Equipment/Storage Building
        {
            id: "storage-building",
            name: "Equipment Room",
            position2D: { x: 87, y: 32 },
            position3D: { x: 86, y: 40, z: 15 },
            type: "building",
            icon2D: "📦",
            icon3D: "/images/3d/placeholder.svg",
            width: 12,
            height: 10,
            depth: 15,
            category: "buildings",
        },

        // ============= FUEL FORECOURT =============
        // Main Fuel Canopy Structure
        {
            id: "forecourt-canopy",
            name: "Fuel Forecourt Canopy",
            position2D: { x: 36, y: 50 },
            position3D: { x: 43, y: 48 },
            type: "structure",
            icon2D: "⛽",
            icon3D: "/images/3d/placeholder.svg",
            width: 50,
            height: 36,
            depth: 25,
            category: "fuel",
            className: "fuel-pump-3d",
        },

        // Fuel Dispensers (Island 1 - Diesel)
        {
            id: "pump-1a",
            name: "Diesel Pump 1A",
            position2D: { x: 40, y: 58 },
            position3D: { x: 43, y: 69, z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },
        {
            id: "pump-1b",
            name: "Diesel Pump 1B",
            position2D: { x: 40, y: 75 },
            position3D: { x: 51, y: 78, z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },

        // Fuel Dispensers (Island 2 - Regular)
        {
            id: "pump-2a",
            name: "Regular Pump 2A",
            position2D: { x: 50, y: 58 },
            position3D: { x: 52, y: 60, z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },
        {
            id: "pump-2b",
            name: "Regular Pump 2B",
            position2D: { x: 50, y: 75 },
            position3D: { x: 59, y: 68, z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },

        // Fuel Dispensers (Island 3 - Premium)
        {
            id: "pump-3a",
            name: "Premium Pump 3A",
            position2D: { x: 60, y: 58 },
            position3D: { x: 58, y: 52  , z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },
        {
            id: "pump-3b",
            name: "Premium Pump 3B",
            position2D: { x: 60, y: 75 },
            position3D: { x: 67, y: 60, z: 3 },
            type: "equipment",
            icon2D: "⛽",
            icon3D: "/images/3d/fuel-pump.png",
            depth: 3,
            category: "fuel",
            className: "fuel-pump-3d",
        },

        // Underground Fuel Storage Tanks (shown as subsurface)
        {
            id: "fuel-tank-diesel",
            name: "UST - Diesel 40,000L",
            position2D: { x: 12, y: 79 },
            position3D: { x: 51, y: 48, z: -2 },
            type: "equipment",
            icon2D: "🛢️",
            icon3D: "/images/3d/tank.png",
            depth: -2,
            category: "fuel",
            className: "fuel-tank-3d",
        },
        {
            id: "fuel-tank-regular",
            name: "UST - Regular 40,000L",
            position2D: { x: 21, y: 79 },
            position3D: { x: 39, y: 59, z: -2 },
            type: "equipment",
            icon2D: "🛢️",
            icon3D: "/images/3d/tank.png",
            depth: -2,
            category: "fuel",
            className: "fuel-tank-3d",
        },
        {
            id: "fuel-tank-premium",
            name: "UST - Premium 30,000L",
            position2D: { x: 29, y: 79 },
            position3D: { x: 26, y: 70, z: -2 },
            type: "equipment",
            icon2D: "🛢️",
            icon3D: "/images/3d/tank.png",
            depth: -2,
            category: "fuel",
            className: "fuel-tank-3d",
        },

        // Fuel Management Systems
        // {
        //     id: "fuel-controller",
        //     name: "Fuel Management System",
        //     position2D: { x: 69, y: 66 },
        //     position3D: { x: 58, y: 50, z: 4 },
        //     type: "equipment",
        //     icon2D: "🖥️",
        //     icon3D: "/images/3d/fuel-system.png",
        //     depth: 4,
        //     category: "fuel",
        //     className: "fuel-system-3d",
        // },
        // {
        //     id: "fuel-sign",
        //     name: "Digital Price Display",
        //     position2D: { x: 58, y: 56 },
        //     position3D: { x: 58, y: 56, z: 6 },
        //     type: "equipment",
        //     icon2D: "💰",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 6,
        //     category: "fuel",
        // },

        // ============= EV CHARGING STATIONS =============
        // EV Charging Zone 1 (Fast Chargers)
        // {
        //     id: "ev-fast-1",
        //     name: "DC Fast Charger 150kW",
        //     position2D: { x: 6, y: 38 },
        //     position3D: { x: 6, y: 38, z: 5 },
        //     type: "equipment",
        //     icon2D: "⚡",
        //     icon3D: "/images/3d/ev-fast-charger.svg",
        //     depth: 5,
        //     category: "ev-charging",
        // },
        // {
        //     id: "ev-fast-2",
        //     name: "DC Fast Charger 150kW",
        //     position2D: { x: 11, y: 38 },
        //     position3D: { x: 11, y: 38, z: 5 },
        //     type: "equipment",
        //     icon2D: "⚡",
        //     icon3D: "/images/3d/ev-fast-charger.svg",
        //     depth: 5,
        //     category: "ev-charging",
        // },

        // EV Charging Zone 2 (Level 2 Chargers)
        {
            id: "ev-level2-1",
            name: "Level 2 Charger 7kW",
            position2D: { x: 10, y: 55 },
            position3D: { x: 32, y: 90, z: 4 },
            type: "equipment",
            icon2D: "🔌",
            icon3D: "/images/3d/ev-charger.png",
            depth: 4,
            category: "ev-charging",
            className: "ev-charger-3d",
        },
        {
            id: "ev-level2-2",
            name: "Level 2 Charger 7kW",
            position2D: { x: 20, y: 55 },
            position3D: { x: 28, y: 85, z: 4 },
            type: "equipment",
            icon2D: "🔌",
            icon3D: "/images/3d/ev-charger.png",
            depth: 4,
            category: "ev-charging",
            className: "ev-charger-3d",

        },
        {
            id: "ev-level2-3",
            name: "Level 2 Charger 7kW",
            position2D: { x: 30, y: 55 },
            position3D: { x: 24, y: 80, z: 4 },
            type: "equipment",
            icon2D: "🔌",
            icon3D: "/images/3d/ev-charger.png",
            depth: 4,
            category: "ev-charging",
            className: "ev-charger-3d",

        },

        // ============= BUILDING SYSTEMS =============
        // HVAC Systems on roof
        {
            id: "hvac-store",
            name: "Store HVAC Unit 15 Ton",
            position2D: { x: 72, y: 17 },
            position3D: { x: 60, y: 24, z: 5 },
            type: "equipment",
            icon2D: "❄️",
            icon3D: "/images/3d/store-coolant.png",
            depth: 5,
            category: "energy",
            className: "hvac-3d",
        },
        {
            id: "hvac-carwash",
            name: "Car Wash HVAC 8 Ton",
            position2D: { x: 23, y: 23 },
            position3D: { x: 20, y: 56, z: 4 },
            type: "equipment",
            icon2D: "❄️",
            icon3D: "/images/3d/store-coolant.png",
            depth: 4,
            category: "energy",
            className: "hvac-3d",
        },

        // Electrical Systems
        // { id: 'transformer', name: 'Electrical Transformer', position2D: { x: 85, y: 56 }, position3D: { x: 85, y: 56, z: 4 }, type: 'equipment', icon2D: '⚡', icon3D: '/images/3d/placeholder.svg', depth: 4, category: 'energy' },
        // { id: 'generator', name: 'Backup Generator 200kW', position2D: { x: 82, y: 62 }, position3D: { x: 82, y: 62, z: 5 }, type: 'equipment', icon2D: '🔋', icon3D: '/images/3d/placeholder.svg', depth: 5, category: 'energy' },
        {
            id: "solar-panel-1",
            name: "Solar Panel Array",
            position2D: { x: 52, y: 8 },
            position3D: { x: 45, y: 26, z: 2 },
            type: "equipment",
            icon2D: "☀️",
            icon3D: "/images/3d/solar-pannel.png",
            depth: 2,
            category: "energy",
            className: "solar-panel-3d",
        },

        // ============= SECURITY & SURVEILLANCE =============
        // CCTV Cameras
        {
            id: "cctv-store",
            name: "CCTV - Store Entrance",
            position2D: { x: 47, y: 12},
            position3D: { x: 61, y: 19, z: 4 },
            type: "equipment",
            icon2D: "📹",
            icon3D: "/images/3d/cctv-camera.png",
            depth: 4,
            category: "security",
            className: "cctv-3d",
        },
        {
            id: "cctv-forecourt-1",
            name: "CCTV - Forecourt East",
            position2D: { x: 35, y: 46 },
            position3D: { x: 32, y: 79, z: 4 },
            type: "equipment",
            icon2D: "📹",
            icon3D: "/images/3d/cctv-camera.png",
            depth: 4,
            category: "security",
            className: "cctv-3d",

        },
        {
            id: "cctv-forecourt-2",
            name: "CCTV - Forecourt West",
            position2D: { x: 60, y: 46 },
            position3D: { x: 64, y: 46, z: 4 },
            type: "equipment",
            icon2D: "📹",
            icon3D: "/images/3d/cctv-camera.png",
            depth: 4,
            category: "security",
            className: "cctv-3d",

        },
        {
            id: "cctv-carwash",
            name: "CCTV - Car Wash",
            position2D: { x: 8, y: 15 },
            position3D: { x: 25, y: 55, z: 4 },
            type: "equipment",
            icon2D: "📹",
            icon3D: "/images/3d/cctv-camera.png",
            depth: 4,
            category: "security",
            className: "cctv-3d",

        },
        {
            id: "cctv-parking",
            name: "CCTV - Parking Area",
            position2D: { x: 75, y: 35 },
            position3D: { x: 75, y: 28, z: 4 },
            type: "equipment",
            icon2D: "📹",
            icon3D: "/images/3d/cctv-camera.png",
            depth: 4,
            category: "security",
            className: "cctv-3d",

        },

        // Emergency Systems
        {
            id: "fire-alarm-1",
            name: "Fire Alarm Panel",
            position2D: { x: 46, y: 31 },
            position3D: { x: 70, y: 28, z: 3 },
            type: "equipment",
            icon2D: "🔔",
            icon3D: "/images/3d/fire-alarm.png",
            depth: 3,
            category: "security",
            className: "fire-alarm-3d",
        },
        {
            id: "emergency-shutoff",
            name: "Emergency Fuel Shutoff",
            position2D: { x: 81, y: 53 },
            position3D: { x: 76, y: 56, z: 4 },
            type: "equipment",
            icon2D: "🛑",
            icon3D: "/images/3d/emergency-shutoff.png",
            depth: 4,
            category: "security",
            className: "emergency-shutoff-3d",
        },

        // ============= SERVICE EQUIPMENT =============
        // Air & Water Station
        // {
        //     id: "air-water",
        //     name: "Tire Air & Water Station",
        //     position2D: { x: 3, y: 62 },
        //     position3D: { x: 3, y: 62, z: 3 },
        //     type: "equipment",
        //     icon2D: "💨",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 3,
        //     category: "service",
        // },

        // Vacuum Station
        {
            id: "vacuum-1",
            name: "Vacuum Station 1",
            position2D: { x: 7, y: 25 },
            position3D: { x: 6, y: 63, z: 3 },
            type: "equipment",
            icon2D: "🌪️",
            icon3D: "/images/3d/vaccum.png",
            depth: 3,
            category: "service",
            className: "vacuum-3d",
        },
        // {
        //     id: "vacuum-2",
        //     name: "Vacuum Station 2",
        //     position2D: { x: 13, y: 25 },
        //     position3D: { x: 9, y: 54, z: 3 },
        //     type: "equipment",
        //     icon2D: "🌪️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 3,
        //     category: "service",
        // },

        // ATM Machine
        {
            id: "atm",
            name: "ATM Machine",
            position2D: { x: 58, y: 31 },
            position3D: { x: 65, y: 32, z: 3 },
            type: "equipment",
            icon2D: "💳",
            icon3D: "/images/3d/atm-machine.png",
            depth: 3,
            category: "service",
            className: "atm-3d",
        },

        // Ice & Propane
        // { id: 'ice-merchandiser', name: 'Ice Merchandiser', x: 38, y: 22, type: 'equipment', icon2D: '🧊', icon3D: '/images/3d/placeholder.svg', depth: 3, category: 'service' },
        // { id: 'propane-cage', name: 'Propane Exchange Cage', x: 78, y: 22, type: 'equipment', icon2D: '🔥', icon3D: '/images/3d/placeholder.svg', depth: 4, category: 'service' },

        // ============= OUTDOOR FACILITIES =============
        // Bicycle Parking
        // { id: 'bike-rack-1', name: 'Bike Rack 1', x: 74, y: 32, type: 'equipment', icon2D: '🚲', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },
        // { id: 'bike-rack-2', name: 'Bike Rack 2', x: 78, y: 32, type: 'equipment', icon2D: '🚲', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },
        // { id: 'bike-rack-3', name: 'Bike Rack 3', x: 82, y: 32, type: 'equipment', icon2D: '🚲', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },

        // Outdoor Lighting
        // { id: 'light-pole-1', name: 'LED Light Pole', x: 32, y: 42, type: 'equipment', icon2D: '💡', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'infrastructure' },
        // { id: 'light-pole-2', name: 'LED Light Pole', x: 50, y: 42, type: 'equipment', icon2D: '💡', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'infrastructure' },
        // { id: 'light-pole-3', name: 'LED Light Pole', x: 68, y: 38, type: 'equipment', icon2D: '💡', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'infrastructure' },
        // { id: 'light-pole-4', name: 'LED Light Pole', x: 15, y: 32, type: 'equipment', icon2D: '💡', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'infrastructure' },

        // ============= SAFETY & MAINTENANCE =============
        // Snow Removal Equipment
        // { id: 'snow-plow', name: 'Snow Plow Equipment', x: 86, y: 68, type: 'equipment', icon2D: '🚜', icon3D: '/images/3d/placeholder.svg', depth: 3, category: 'other' },
        // { id: 'salt-spreader', name: 'Salt Storage Box', x: 90, y: 62, type: 'equipment', icon2D: '📦', icon3D: '/images/3d/placeholder.svg', depth: 3, category: 'other' },

        // Safety Bollards
        // { id: 'bollard-1', name: 'Safety Bollard', x: 72, y: 68, type: 'equipment', icon2D: '⚫', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },
        // { id: 'bollard-2', name: 'Safety Bollard', x: 16, y: 75, type: 'equipment', icon2D: '⚫', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },
        // { id: 'bollard-3', name: 'Safety Bollard', x: 24, y: 45, type: 'equipment', icon2D: '⚫', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },
        // { id: 'bollard-4', name: 'Safety Bollard', x: 58, y: 45, type: 'equipment', icon2D: '⚫', icon3D: '/images/3d/placeholder.svg', depth: 2, category: 'infrastructure' },

        // Waste Management
        // { id: 'dumpster', name: 'Waste Compactor', x: 86, y: 42, type: 'equipment', icon2D: '🗑️', icon3D: '/images/3d/placeholder.svg', depth: 4, category: 'other' },
        // { id: 'recycle-bin', name: 'Recycling Station', x: 90, y: 48, type: 'equipment', icon2D: '♻️', icon3D: '/images/3d/placeholder.svg', depth: 3, category: 'other' },

        // ============= LANDSCAPING =============
        // Trees
        // { id: 'tree-1', name: 'Ornamental Tree', x: 4, y: 24, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-2', name: 'Ornamental Tree', x: 22, y: 16, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-3', name: 'Ornamental Tree', x: 28, y: 16, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-4', name: 'Ornamental Tree', x: 85, y: 24, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-5', name: 'Ornamental Tree', x: 88, y: 30, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-6', name: 'Ornamental Tree', x: 75, y: 42, type: 'tree', icon2D: '🌲', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-7', name: 'Ornamental Tree', x: 4, y: 48, type: 'tree', icon2D: '🌳', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },
        // { id: 'tree-8', name: 'Ornamental Tree', x: 92, y: 72, type: 'tree', icon2D: '🌳', icon3D: '/images/3d/placeholder.svg', depth: 8, category: 'other' },

        // ============= SIGNAGE =============
        // Site Signage
        // {
        //     id: "main-sign",
        //     name: "Main Site Sign",
        //     position2D: { x: 65, y: 42 },
        //     position3D: { x: 65, y: 42, z: 7 },
        //     type: "equipment",
        //     icon2D: "🪧",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 7,
        //     category: "other",
        // },
        // {
        //     id: "direction-sign",
        //     name: "Directional Sign",
        //     position2D: { x: 12, y: 45 },
        //     position3D: { x: 12, y: 45, z: 3 },
        //     type: "equipment",
        //     icon2D: "➡️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 3,
        //     category: "other",
        // },
    ];

    return (
        <div
            className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-400 shadow-2xl"
            style={{
                background:
                    "linear-gradient(135deg, #87ceeb 0%, #e0f6ff 30%, #f0f9ff 70%, #e6f3ff 100%)",
                perspective: "1400px",
                perspectiveOrigin: "50% 25%",
                boxShadow:
                    "inset 0 0 50px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)",
            }}
        >
            {viewMode === "3d" ? (
                <RetailFacilityLayout3D
                    assets={assets}
                    onAssetClick={onAssetClick}
                    selectedAssetId={selectedAssetId}
                    visibleAssetTypes={visibleAssetTypes}
                    showLegend={showLegend}
                    setShowLegend={setShowLegend}
                    equipmentData={equipmentData}
                />
            ) : (
                <RetailFacilityLayout2D
                    assets={assets}
                    onAssetClick={onAssetClick}
                    selectedAssetId={selectedAssetId}
                    visibleAssetTypes={visibleAssetTypes}
                    showLegend={showLegend}
                    setShowLegend={setShowLegend}
                    equipmentData={equipmentData}
                />
            )}
        </div>
    );
};

export default RetailFacilityLayout;

