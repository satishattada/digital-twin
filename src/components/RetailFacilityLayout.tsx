import React, { useState, useEffect } from "react";
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

// Hook for responsive breakpoints
const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: screenSize.width < 768,
        isTablet: screenSize.width >= 768 && screenSize.width < 1024,
        isDesktop: screenSize.width >= 1024,
        width: screenSize.width,
        height: screenSize.height,
    };
};

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
        "food-service",
        "refrigeration",
        "car-wash",
        "other",
    ]),
    equipmentData = [],
}) => {
    const [showLegend, setShowLegend] = React.useState(false);
    const assets: Asset[] = [
        // ============= BUILDINGS =============
        // Main Convenience Store Building
        {
            id: "store-main",
            name: "Convenience Store",
            position2D: { x: 19, y: 8 },
            position3D: { x: 19, y: 18, z: 25 },
            type: "building",
            icon2D: "🏪",
            icon3D: "/images/3d/store-building.svg",
            width: 61,
            height: 37,
            depth: 25,
            category: "buildings",
        },

        // ============= STORE INTERIOR UNITS =============
        // Checkout/Point of Sale Area
        // {
        //     id: "checkout-counter-1",
        //     name: "Checkout Counter 1",
        //     position2D: { x: 48, y: 25 },
        //     position3D: { x: 50, y: 25, z: 2 },
        //     type: "equipment",
        //     icon2D: "🛒",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "checkout-counter-3d",
        // },
        // {
        //     id: "checkout-counter-2",
        //     name: "Checkout Counter 2",
        //     position2D: { x: 51, y: 25 },
        //     position3D: { x: 53, y: 25, z: 2 },
        //     type: "equipment",
        //     icon2D: "🛒",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "checkout-counter-3d",
        // },
        // {
        //     id: "self-checkout-1",
        //     name: "Self-Checkout Kiosk",
        //     position2D: { x: 54, y: 25 },
        //     position3D: { x: 56, y: 25, z: 2 },
        //     type: "equipment",
        //     icon2D: "💳",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "self-checkout-3d",
        // },

        // Shelving Units - Snacks & Confectionery
        // {
        //     id: "shelf-snacks-1",
        //     name: "Snacks Aisle 1",
        //     position2D: { x: 50, y: 28 },
        //     position3D: { x: 35, y: 30, z: 2 },
        //     type: "equipment",
        //     icon2D: "🍿",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },
        // {
        //     id: "shelf-snacks-2",
        //     name: "Snacks Aisle 2",
        //     position2D: { x: 50, y: 31 },
        //     position3D: { x: 38, y: 30, z: 2 },
        //     type: "equipment",
        //     icon2D: "🍿",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },
        // {
        //     id: "shelf-candy",
        //     name: "Candy & Chocolate Section",
        //     position2D: { x: 50, y: 34 },
        //     position3D: { x: 41, y: 30, z: 2 },
        //     type: "equipment",
        //     icon2D: "🍫",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },

        // Shelving Units - Beverages
        // {
        //     id: "shelf-beverages-1",
        //     name: "Beverages Aisle 1",
        //     position2D: { x: 58, y: 28 },
        //     position3D: { x: 45, y: 35, z: 2 },
        //     type: "equipment",
        //     icon2D: "🥤",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },
        // {
        //     id: "shelf-beverages-2",
        //     name: "Beverages Aisle 2",
        //     position2D: { x: 58, y: 31 },
        //     position3D: { x: 48, y: 35, z: 2 },
        //     type: "equipment",
        //     icon2D: "🥤",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },

        // // Shelving Units - Grocery & Household
        // {
        //     id: "shelf-grocery-1",
        //     name: "Grocery Aisle 1",
        //     position2D: { x: 66, y: 28 },
        //     position3D: { x: 30, y: 40, z: 2 },
        //     type: "equipment",
        //     icon2D: "🛍️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },
        // {
        //     id: "shelf-grocery-2",
        //     name: "Grocery Aisle 2",
        //     position2D: { x: 66, y: 31 },
        //     position3D: { x: 33, y: 40, z: 2 },
        //     type: "equipment",
        //     icon2D: "🛍️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },
        // {
        //     id: "shelf-household",
        //     name: "Household Items",
        //     position2D: { x: 66, y: 34 },
        //     position3D: { x: 36, y: 40, z: 2 },
        //     type: "equipment",
        //     icon2D: "🧴",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "racks",
        //     className: "shelf-unit-3d",
        // },

        // // Specialty Sections
        // {
        //     id: "magazine-rack",
        //     name: "Magazine & News Rack",
        //     position2D: { x: 45, y: 28 },
        //     position3D: { x: 65, y: 23, z: 2 },
        //     type: "equipment",
        //     icon2D: "📰",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "magazine-rack-3d",
        // },
        // {
        //     id: "tobacco-cabinet",
        //     name: "Tobacco Cabinet (Secured)",
        //     position2D: { x: 45, y: 23 },
        //     position3D: { x: 68, y: 23, z: 2 },
        //     type: "equipment",
        //     icon2D: "🚬",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "tobacco-cabinet-3d",
        // },
        // {
        //     id: "pharmacy-counter",
        //     name: "Pharmacy/Health Counter",
        //     position2D: { x: 70, y: 28 },
        //     position3D: { x: 25, y: 45, z: 2 },
        //     type: "equipment",
        //     icon2D: "💊",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "pharmacy-counter-3d",
        // },

        // // Customer Service & Storage
        // {
        //     id: "customer-service",
        //     name: "Customer Service Desk",
        //     position2D: { x: 42, y: 25 },
        //     position3D: { x: 72, y: 20, z: 2 },
        //     type: "equipment",
        //     icon2D: "ℹ️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "service-desk-3d",
        // },
        // {
        //     id: "back-office",
        //     name: "Back Office/Storage",
        //     position2D: { x: 75, y: 25 },
        //     position3D: { x: 22, y: 50, z: 2 },
        //     type: "equipment",
        //     icon2D: "📦",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "storage-room-3d",
        // },

        // // Promotional Displays
        // {
        //     id: "promo-display-1",
        //     name: "Promotional Display 1",
        //     position2D: { x: 54, y: 30 },
        //     position3D: { x: 55, y: 30, z: 2 },
        //     type: "equipment",
        //     icon2D: "🎁",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "promo-display-3d",
        // },
        // {
        //     id: "promo-display-2",
        //     name: "Promotional Display 2",
        //     position2D: { x: 62, y: 30 },
        //     position3D: { x: 50, y: 38, z: 2 },
        //     type: "equipment",
        //     icon2D: "🎁",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "other",
        //     className: "promo-display-3d",
        // },

        // Car Wash Building
        {
            id: "carwash-building",
            name: "Automated Car Wash",
            position2D: { x: 74, y: 63 },
            position3D: { x: 77, y: 37, z: 18 },
            type: "building",
            icon2D: "🚗",
            icon3D: "/images/3d/placeholder.svg",
            width: 24,
            height: 13,
            depth: 18,
            category: "buildings",
        },

        // Equipment/Storage Building
        // {
        //     id: "storage-building",
        //     name: "Equipment Room",
        //     position2D: { x: 87, y: 32 },
        //     position3D: { x: 86, y: 40, z: 15 },
        //     type: "building",
        //     icon2D: "📦",
        //     icon3D: "/images/3d/placeholder.svg",
        //     width: 12,
        //     height: 10,
        //     depth: 15,
        //     category: "buildings",
        // },

        // ============= FUEL FORECOURT =============
        // Main Fuel Canopy Structure
        {
            id: "forecourt-canopy",
            name: "Fuel Forecourt Canopy",
            position2D: { x: 18, y: 56 },
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
            position3D: { x: 45, y: 71, z: 3 },
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
            position3D: { x: 53, y: 81, z: 3 },
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
            position3D: { x: 53, y: 60, z: 3 },
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
            position3D: { x: 61, y: 69, z: 3 },
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
            position3D: { x: 60, y: 51  , z: 3 },
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
            position3D: { x: 68, y: 60, z: 3 },
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
            position2D: { x: 22, y: 48 },
            position3D: { x: 52, y: 51, z: -2 },
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
            position2D: { x: 30, y: 48 },
            position3D: { x: 42, y: 63, z: -2 },
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
            position2D: { x: 38, y: 48 },
            position3D: { x: 31, y: 75, z: -2 },
            type: "equipment",
            icon2D: "🛢️",
            icon3D: "/images/3d/tank.png",
            depth: -2,
            category: "fuel",
            className: "fuel-tank-3d",
        },

        // ============= VEHICLES AT FUEL STATION =============
        // Cars at Fuel Pumps
        {
            id: "car-pump-1a",
            name: "Vehicle at Diesel Pump 1A",
            position2D: { x: 37, y: 58 },
            position3D: { x: 41, y: 72, z: 2 },
            type: "vehicle",
            icon2D: "🚗",
            icon3D: "/images/3d/car.png",
            depth: 2,
            category: "fuel",
            className: "vehicle-3d",
        },
        // {
        //     id: "car-pump-1b",
        //     name: "Vehicle at Diesel Pump 1B",
        //     position2D: { x: 43, y: 75 },
        //     position3D: { x: 52, y: 81, z: 2 },
        //     type: "vehicle",
        //     icon2D: "🚙",
        //     icon3D: "/images/3d/car.png",
        //     depth: 2,
        //     category: "fuel",
        //     className: "vehicle-3d",
        // },
        {
            id: "car-pump-2a",
            name: "Vehicle at Regular Pump 2A",
            position2D: { x: 47, y: 58 },
            position3D: { x: 50, y: 63, z: 2 },
            type: "vehicle",
            icon2D: "🚗",
            icon3D: "/images/3d/car.png",
            depth: 2,
            category: "fuel",
            className: "vehicle-3d",
        },
        // {
        //     id: "car-pump-2b",
        //     name: "Vehicle at Regular Pump 2B",
        //     position2D: { x: 53, y: 75 },
        //     position3D: { x: 60, y: 71, z: 2 },
        //     type: "vehicle",
        //     icon2D: "🚙",
        //     icon3D: "/images/3d/car.png",
        //     depth: 2,
        //     category: "fuel",
        //     className: "vehicle-3d",
        // },
        {
            id: "car-pump-3a",
            name: "Vehicle at Premium Pump 3A",
            position2D: { x: 57, y: 58 },
            position3D: { x: 56, y: 55, z: 2 },
            type: "vehicle",
            icon2D: "🚗",
            icon3D: "/images/3d/car.png",
            depth: 2,
            category: "fuel",
            className: "vehicle-3d",
        },
        {
            id: "car-pump-3b",
            name: "Vehicle at Premium Pump 3B",
            position2D: { x: 63, y: 75 },
            position3D: { x: 64, y: 63, z: 2 },
            type: "vehicle",
            icon2D: "🚙",
            icon3D: "/images/3d/car.png",
            depth: 2,
            category: "fuel",
            className: "vehicle-3d",
        },

        // Cars Waiting/In Queue
        // {
        //     id: "car-queue-1",
        //     name: "Vehicle Waiting in Queue",
        //     position2D: { x: 35, y: 48 },
        //     position3D: { x: 37, y: 88, z: 2 },
        //     type: "vehicle",
        //     icon2D: "🚗",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "fuel",
        //     className: "vehicle-3d",
        // },
        // {
        //     id: "car-queue-2",
        //     name: "Vehicle Entering Station",
        //     position2D: { x: 45, y: 48 },
        //     position3D: { x: 45, y: 88, z: 2 },
        //     type: "vehicle",
        //     icon2D: "🚙",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "fuel",
        //     className: "vehicle-3d",
        // },

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
        
        // Fuel Price Display Pillar
        {
            id: "price-list-pillar",
            name: "Fuel price display",
            
            position2D: { x: 57, y: 87 },
            position3D: { x: 75, y: 36, z: 10 },
            type: "tree",
            icon2D: "💲",
            icon3D: "/images/3d/price-pillar.png",
            depth: 10,
            category: "infrastructure",
            className: "price-pillar-3d",
        },

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
            position2D: { x: 5, y: 55 },
            position3D: { x: 31, y: 89, z: 4 },
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
            position2D: { x: 10, y: 55 },
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
            position2D: { x: 15, y: 55 },
            position3D: { x: 34, y: 92, z: 4 },
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
            position2D: { x: 77, y: 13 },
            position3D: { x: 52, y: 23, z: 5 },
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
            position2D: { x: 95, y: 70 },
            position3D: { x: 91, y: 38, z: 4 },
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
            position2D: { x: 61, y: 8 },
            position3D: { x: 43, y: 20, z: 2 },
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
            position2D: { x: 19, y: 12},
            position3D: { x: 13, y: 61, z: 4 },
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
            position2D: { x: 67, y: 66 },
            position3D: { x: 35, y: 83, z: 4 },
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
            position2D: { x: 18, y: 66 },
            position3D: { x: 68, y: 46, z: 4 },
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
            position2D: { x: 74, y: 65 },
            position3D: { x: 88, y: 32, z: 4 },
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
            position2D: { x: 92, y: 52 },
            position3D: { x: 81, y: 28, z: 4 },
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
            position2D: { x: 77, y: 36 },
            position3D: { x: 65, y: 29, z: 3 },
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
            position2D: { x: 65, y: 86 },
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
        // {
        //     id: "vacuum-1",
        //     name: "Vacuum Station 1",
        //     position2D: { x: 7, y: 25 },
        //     position3D: { x: 6, y: 63, z: 3 },
        //     type: "equipment",
        //     icon2D: "🌪️",
        //     icon3D: "/images/3d/vaccum.png",
        //     depth: 3,
        //     category: "service",
        //     className: "vacuum-3d",
        // },
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
            position2D: { x: 58, y: 41 },
            position3D: { x: 57, y: 38, z: 3 },
            type: "equipment",
            icon2D: "💳",
            icon3D: "/images/3d/atm-machine.png",
            depth: 3,
            category: "service",
            className: "atm-3d",
        },

        // ============= STORE EQUIPMENT - FOOD SERVICE =============
        // Coffee Machine
        {
            id: "coffee-machine-1",
            name: "Coffee Machine",
            position2D: { x: 72, y: 24 },
            position3D: { x: 58, y: 26, z: 2 },
            type: "equipment",
            icon2D: "☕",
            icon3D: "/images/3d/coffee-machine.png",
            depth: 2,
            category: "food-service",
            className: "coffee-machine-3d",
        },

        // Beverage Dispenser
        // {
        //     id: "beverage-dispenser-1",
        //     name: "Beverage Dispenser",
        //     position2D: { x: 55, y: 20 },
        //     position3D: { x: 61, y: 23, z: 2 },
        //     type: "equipment",
        //     icon2D: "🥤",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "food-service",
        //     className: "beverage-dispenser-3d",
        // },

        // Bakery Oven
        {
            id: "oven-1",
            name: "Bakery Oven",
            position2D: { x: 51, y: 11 },
            position3D: { x: 38, y: 30, z: 2 },
            type: "equipment",
            icon2D: "🔥",
            icon3D: "/images/3d/bakery-oven.png",
            depth: 2,
            category: "food-service",
            className: "oven-3d",
        },

        // Microwave
        // {
        //     id: "microwave-1",
        //     name: "Customer Microwave",
        //     position2D: { x: 53, y: 18 },
        //     position3D: { x: 59, y: 21, z: 2 },
        //     type: "equipment",
        //     icon2D: "📡",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "food-service",
        //     className: "microwave-3d",
        // },

        // Hot Food Cabinet
        // {
        //     id: "hot-food-cabinet-1",
        //     name: "Hot Food Display Cabinet",
        //     position2D: { x: 56, y: 18 },
        //     position3D: { x: 62, y: 21, z: 2 },
        //     type: "equipment",
        //     icon2D: "🍱",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "food-service",
        //     className: "hot-food-cabinet-3d",
        // },

        // ============= REFRIGERATION EQUIPMENT =============
        // Open Chiller - Beverages
        {
            id: "chiller-1",
            name: "Open Chiller - Beverages",
            position2D: { x: 34, y: 11 },
            position3D: { x: 25, y: 43, z: 2 },
            type: "equipment",
            icon2D: "❄️",
            icon3D: "/images/3d/refrigrator.png",
            depth: 2,
            category: "refrigeration",
            className: "chiller-3d",
        },

        // Open Freezer - Ice Cream
        {
            id: "freezer-1",
            name: "Open Freezer - Ice Cream",
            position2D: { x: 44, y: 11 },
            position3D: { x: 32, y: 36, z: 2 },
            type: "equipment",
            icon2D: "🧊",
            icon3D: "/images/3d/refrigrator.png",
            depth: 2,
            category: "refrigeration",
            className: "freezer-3d",
        },

        // Walk-in Cooler
        // {
        //     id: "chiller-2",
        //     name: "Walk-in Cooler",
        //     position2D: { x: 60, y: 18 },
        //     position3D: { x: 18, y: 80, z: 2 },
        //     type: "equipment",
        //     icon2D: "🚪",
        //     icon3D: "/images/3d/cooler.png",
        //     depth: 2,
        //     category: "refrigeration",
        //     className: "walk-in-cooler-3d",
        // },

        // Compressor Unit
        // {
        //     id: "compressor-1",
        //     name: "Refrigeration Compressor Unit",
        //     position2D: { x: 85, y: 30 },
        //     position3D: { x: 84, y: 38, z: 2 },
        //     type: "equipment",
        //     icon2D: "⚙️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "refrigeration",
        //     className: "compressor-3d",
        // },

        // ============= CAR WASH EQUIPMENT =============
        // Automatic Car Wash System
        {
            id: "carwash-automatic",
            name: "Automatic Car Wash System",
            position2D: { x: 85, y: 67 },
            position3D: { x: 77, y: 35, z: 2 },
            type: "equipment",
            icon2D: "🚿",
            icon3D: "/images/3d/car-wash.png",
            depth: 2,
            category: "car-wash",
            className: "car-wash-3d",
        },

        // Jet/Pressure Wash System
        // {
        //     id: "pressure-wash-1",
        //     name: "Jet/Pressure Wash System",
        //     position2D: { x: 8, y: 23 },
        //     position3D: { x: 77, y: 35, z: 2 },
        //     type: "equipment",
        //     icon2D: "💦",
        //     icon3D: "/images/3d/car-wash.png",
        //     depth: 2,
        //     category: "car-wash",
        //     className: "pressure-wash-3d",
        // },

        // Water Recycling System
        // {
        //     id: "water-recycler-1",
        //     name: "Water Recycling System",
        //     position2D: { x: 12, y: 23 },
        //     position3D: { x: 81, y: 35, z: 2 },
        //     type: "equipment",
        //     icon2D: "♻️",
        //     icon3D: "/images/3d/placeholder.svg",
        //     depth: 2,
        //     category: "car-wash",
        //     className: "water-recycler-3d",
        // },

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

    const { isMobile, isTablet, isDesktop, width } = useResponsive();

    // Responsive perspective and scale
    const perspective = isMobile ? '800px' : isTablet ? '1100px' : '1400px';
    const perspectiveOrigin = isMobile ? '50% 30%' : '50% 25%';
    const containerPadding = isMobile ? '0.5rem' : '0';

    return (
        <div
            className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-400 shadow-2xl"
            style={{
                background:
                    "linear-gradient(135deg, #87ceeb 0%, #e0f6ff 30%, #f0f9ff 70%, #e6f3ff 100%)",
                perspective: perspective,
                perspectiveOrigin: perspectiveOrigin,
                boxShadow:
                    "inset 0 0 50px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)",
                padding: containerPadding,
                minHeight: isMobile ? '400px' : '500px',
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
                    isMobile={isMobile}
                    isTablet={isTablet}
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
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
            )}
            
            {/* BP Logo Overlay */}
            <div className="absolute top-4 left-4 z-10">
                <img 
                    src="/images/logo.png" 
                    alt="BP Logo" 
                    className="h-12 w-auto drop-shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                />
            </div>
        </div>
    );
};

export default RetailFacilityLayout;

