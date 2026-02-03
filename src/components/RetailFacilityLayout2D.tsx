import React, { useState } from "react";
import "./RetailFacilityLayout2D.css";

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
    status?: "operational" | "warning" | "critical" | "offline";
}

// 2D Layout Component
const RetailFacilityLayout2D: React.FC<{
    assets: Asset[];
    onAssetClick?: (asset: Asset) => void;
    selectedAssetId?: string;
    visibleAssetTypes: Set<string>;
    showLegend: boolean;
    setShowLegend: (show: boolean) => void;
    equipmentData?: Array<{
        id: string;
        status: "operational" | "warning" | "critical" | "offline";
    }>;
    isMobile?: boolean;
    isTablet?: boolean;
}> = ({
    assets,
    onAssetClick,
    selectedAssetId,
    visibleAssetTypes,
    showLegend,
    setShowLegend,
    equipmentData = [],
    isMobile = false,
    isTablet = false,
}) => {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    // Responsive font sizing helper
    const getFontSize = (baseSize: number) => {
        if (isMobile) return `${baseSize * 0.6}px`;
        if (isTablet) return `${baseSize * 0.8}px`;
        return `${baseSize}px`;
    };

    const getIconSize = () => {
        if (isMobile) return { width: "20px", height: "20px" };
        if (isTablet) return { width: "28px", height: "28px" };
        return { width: "32px", height: "32px" };
    };

    // Get asset status from equipment data
    const getAssetStatus = (assetId: string) => {
        return (
            equipmentData.find((eq) => eq.id === assetId)?.status ||
            "operational"
        );
    };

    const getAssetStyle = (
        asset: Asset,
    ): { className: string; style: React.CSSProperties } => {
        const isSelected = selectedAssetId === asset.id;
        const status = getAssetStatus(asset.id);

        const baseClass = "asset-base";
        const baseStyle: React.CSSProperties = {
            left: `${asset.position2D.x}%`,
            top: `${asset.position2D.y}%`,
        };

        // Add status class for alert styling
        const statusClass =
            status !== "operational" ? `asset-status-${status}` : "";

        if (asset.type === "building") {
            return {
                className: `${baseClass} asset-building ${isSelected ? "asset-selected" : "asset-not-selected"} ${statusClass}`,
                style: {
                    ...baseStyle,
                    width: `${asset.width}%`,
                    height: `${asset.height}%`,
                },
            };
        } else if (asset.type === "structure") {
            return {
                className: `${baseClass} asset-structure ${isSelected ? "asset-selected" : "asset-not-selected"} ${statusClass}`,
                style: {
                    ...baseStyle,
                    width: `${asset.width}%`,
                    height: `${asset.height}%`,
                },
            };
        } else {
            return {
                className: `${baseClass} asset-other ${isSelected ? "asset-other-selected" : "asset-other-not-selected"} ${asset.type === "tree" ? "asset-other-icon-tree" : "asset-other-icon"} ${statusClass}`,
                style: baseStyle,
            };
        }
    };

    const renderBuilding2D = (asset: Asset) => {
        const isSelected = selectedAssetId === asset.id;
        const depth = asset.depth || 10;
        const visualDepth = depth * 2;
        const isStore = asset.id === "store-main";
        const isCarWash = asset.id === "carwash-building";
        return (
            <div
                className={`asset-building-container ${isSelected ? "asset-building-container-selected" : ""}`}
            >
                <div className="flex flex-col items-center gap-1">
                    {/* <span className="text-3xl drop-shadow-lg">
                        {asset.icon2D}
                    </span> */}
                    <span
                        className="font-bold text-slate-800 drop-shadow-sm"
                        style={{ fontSize: getFontSize(14) }}
                    >
                        {asset.name}
                    </span>

                    {isStore && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {[
                                { left: "20%", top: "20%", height: "64%" },
                                { left: "34%", top: "20%", height: "64%" },
                                { left: "48%", top: "20%", height: "64%" },
                                { left: "60%", top: "20%", height: "64%" },
                                { left: "74%", top: "20%", height: "64%" },
                                // { left: '88%', top: '20%', height: '64%' },
                            ].map((shelf, idx) => (
                                <div
                                    key={`shelf-1-${idx}`}
                                    className="absolute"
                                    style={{
                                        left: shelf.left,
                                        top: shelf.top,
                                        width: "2%",
                                        height: shelf.height,
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Top */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            background: "#cbd5e1",
                                            border: "1px solid #94a3b8",
                                            transform: "translateZ(39px)",
                                        }}
                                    />
                                    {/* Front */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "39px",
                                            background: "#94a3b8",
                                            border: "1px solid #64748b",
                                            bottom: 0,
                                            transformOrigin: "bottom",
                                            transform: "rotateX(-90deg)",
                                        }}
                                    />
                                    {/* Right */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "39px",
                                            height: "100%",
                                            background: "#8892a8",
                                            border: "1px solid #64748b",
                                            right: 0,
                                            transformOrigin: "right",
                                            transform: "rotateY(90deg)",
                                        }}
                                    />
                                    {/* Left */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "39px",
                                            height: "100%",
                                            background: "#a8b2c8",
                                            border: "1px solid #94a3b8",
                                            left: 0,
                                            transformOrigin: "left",
                                            transform: "rotateY(-90deg)",
                                        }}
                                    />
                                </div>
                            ))}

                            {/* 3D Refrigeration units (Right side) */}
                            {[
                                { left: "8%", top: "65%", height: "3%" },
                                { left: "8%", top: "35%", height: "3%" },
                                { left: "8%", top: "50%", height: "3%" },
                            ].map((fridge, idx) => (
                                <div
                                    key={`fridge-${idx}`}
                                    className="absolute"
                                    style={{
                                        left: fridge.left,
                                        top: fridge.top,
                                        width: "8%",
                                        height: fridge.height,
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Top */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            background: "#93c5fd",
                                            border: "1px solid #60a5fa",
                                            transform: "translateZ(10px)",
                                        }}
                                    />
                                    {/* Front */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "10px",
                                            background: "#60a5fa",
                                            border: "1px solid #3b82f6",
                                            bottom: 0,
                                            transformOrigin: "bottom",
                                            transform: "rotateX(-90deg)",
                                        }}
                                    />
                                    {/* Right */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "10px",
                                            height: "100%",
                                            background: "#3b82f6",
                                            border: "1px solid #2563eb",
                                            right: 0,
                                            transformOrigin: "right",
                                            transform: "rotateY(90deg)",
                                        }}
                                    />
                                    {/* Left */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "10px",
                                            height: "100%",
                                            background: "#7dd3fc",
                                            border: "1px solid #60a5fa",
                                            left: 0,
                                            transformOrigin: "left",
                                            transform: "rotateY(-90deg)",
                                        }}
                                    />
                                </div>
                            ))}

                            {/* Display stands */}
                            <div
                                className="absolute"
                                style={{
                                    left: "50%",
                                    top: "25%",
                                    width: "3%",
                                    height: "3%",
                                    background: "#ef4444",
                                    border: "1px solid #dc2626",
                                    borderRadius: "50%",
                                    transform: "translateZ(4px)",
                                }}
                            />
                            <div
                                className="absolute"
                                style={{
                                    left: "32%",
                                    top: "35%",
                                    width: "3%",
                                    height: "3%",
                                    background: "#ef4444",
                                    border: "1px solid #dc2626",
                                    borderRadius: "50%",
                                    transform: "translateZ(4px)",
                                }}
                            />
                            <div
                                className="absolute"
                                style={{
                                    left: "68%",
                                    top: "35%",
                                    width: "3%",
                                    height: "3%",
                                    background: "#10b981",
                                    border: "1px solid #059669",
                                    borderRadius: "50%",
                                    transform: "translateZ(4px)",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderStructure2D = (asset: Asset) => {
        const isSelected = selectedAssetId === asset.id;

        return (
            <div
                className={`asset-structure-container ${isSelected ? "asset-structure-container-selected" : ""}`}
            >
                <div className="flex flex-col items-center">
                    {/* <span className="text-2xl drop-shadow-lg">
                        {asset.icon2D}
                    </span> */}
                    <span
                        className="font-semibold text-slate-700 drop-shadow-sm"
                        style={{ fontSize: getFontSize(14) }}
                    >
                        {asset.name}
                    </span>
                </div>

                {/* Enhanced pillar markers in 2D */}
                {/* {[0, 25, 50, 75, 100].map((pos, idx) => (
                    <div
                        key={idx}
                        className="pillar-marker"
                        style={{
                            left: `${pos}%`,
                        }}
                    />
                ))} */}
            </div>
        );
    };

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-400 shadow-2xl retail-facility-2d-container">
            {/* 2D Scene Container */}
            <div className="absolute inset-0">
                {/* Ground/Parking areas */}
                <div className="absolute inset-0">
                    {/* Base ground plane */}
                    <div className="absolute inset-0 ground-plane">
                        {/* Asphalt texture with parking lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-30">
                            <defs>
                                <pattern
                                    id="asphalt-texture-2d"
                                    x="0"
                                    y="0"
                                    width="40"
                                    height="40"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect
                                        width="40"
                                        height="40"
                                        fill="#2d3748"
                                    />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="1"
                                        fill="#4a5568"
                                        opacity="0.6"
                                    />
                                    <circle
                                        cx="30"
                                        cy="25"
                                        r="1.5"
                                        fill="#718096"
                                        opacity="0.4"
                                    />
                                    <circle
                                        cx="5"
                                        cy="35"
                                        r="0.8"
                                        fill="#4a5568"
                                        opacity="0.5"
                                    />
                                    <circle
                                        cx="35"
                                        cy="5"
                                        r="1.2"
                                        fill="#718096"
                                        opacity="0.3"
                                    />
                                </pattern>
                                <pattern
                                    id="parking-lines-2d"
                                    x="0"
                                    y="0"
                                    width="80"
                                    height="80"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect
                                        x="0"
                                        y="0"
                                        width="80"
                                        height="80"
                                        fill="url(#asphalt-texture-2d)"
                                    />
                                    <line
                                        x1="0"
                                        y1="40"
                                        x2="80"
                                        y2="40"
                                        stroke="#fbbf24"
                                        strokeWidth="2"
                                        strokeDasharray="8,8"
                                    />
                                    <line
                                        x1="40"
                                        y1="0"
                                        x2="40"
                                        y2="80"
                                        stroke="#fbbf24"
                                        strokeWidth="1"
                                        opacity="0.7"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#parking-lines-2d)"
                            />
                        </svg>
                    </div>

                    {/* Entry and Exit Points */}
                    {/* Main Entry - Bottom Center */}
                    <div 
                        className="absolute"
                        style={{
                            left: '48%',
                            bottom: '-1%',
                            width: '8%',
                            height: '4%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}
                    >
                        <div className="bg-green-600 border-4 border-green-800 rounded-lg shadow-2xl px-3 py-2 flex items-center gap-2">
                            <span className="text-white text-2xl">🚗</span>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xs">ENTRY</span>
                                <div className="flex gap-1 mt-1">
                                    <div className="w-2 h-1 bg-green-300 rounded animate-pulse"></div>
                                    <div className="w-2 h-1 bg-green-300 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-1 bg-green-300 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                        {/* Entry arrow pointing inward */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <div className="text-green-600 text-4xl animate-bounce">↑</div>
                        </div>
                    </div>

                    {/* Exit - Bottom Left */}
                    <div 
                        className="absolute"
                        style={{
                            left: '2%',
                            bottom: '-1%',
                            width: '8%',
                            height: '4%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}
                    >
                        <div className="bg-red-600 border-4 border-red-800 rounded-lg shadow-2xl px-3 py-2 flex items-center gap-2">
                            <span className="text-white text-2xl">🚙</span>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xs">EXIT</span>
                                <div className="flex gap-1 mt-1">
                                    <div className="w-2 h-1 bg-red-300 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    <div className="w-2 h-1 bg-red-300 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-1 bg-red-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        {/* Exit arrow pointing outward */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                            <div className="text-red-600 text-4xl animate-bounce">↓</div>
                        </div>
                    </div>

                    {/* Secondary Exit - Top Right */}
                    <div 
                        className="absolute"
                        style={{
                            right: '2%',
                            top: '2%',
                            width: '6%',
                            height: '4%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}
                    >
                        <div className="bg-orange-600 border-3 border-orange-800 rounded-lg shadow-xl px-2 py-1 flex items-center gap-1">
                            <span className="text-white text-lg">🚗</span>
                            <span className="text-white font-bold text-xs">EXIT 2</span>
                        </div>
                        {/* Exit arrow */}
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                            <div className="text-orange-600 text-2xl">→</div>
                        </div>
                    </div>

                    {/* Pedestrian Entry - Left side */}
                    <div 
                        className="absolute"
                        style={{
                            left: '-1%',
                            top: '45%',
                            width: '4%',
                            height: '6%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}
                    >
                        <div className="bg-blue-600 border-3 border-blue-800 rounded-lg shadow-xl px-2 py-2 flex flex-col items-center gap-1">
                            <span className="text-white text-xl">🚶</span>
                            <span className="text-white font-bold text-xs text-center">WALK-IN</span>
                        </div>
                        {/* Pedestrian arrow */}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1">
                            <div className="text-blue-600 text-2xl">→</div>
                        </div>
                    </div>

                    {/* Assets in 2D space - filtered by category */}
                    {assets
                        .filter(
                            (asset) =>
                                !asset.category ||
                                visibleAssetTypes.has(asset.category),
                        )
                        .map((asset) => {
                            const { className, style } = getAssetStyle(asset);
                            return (
                                <div
                                    key={asset.id}
                                    className={`${className} `}
                                    style={style}
                                    onClick={() => {
                                        setSelectedAsset(asset);
                                        onAssetClick?.(asset);
                                    }}
                                    title={asset.name}
                                >
                                    {asset.type === "building" ? (
                                        renderBuilding2D(asset)
                                    ) : asset.type === "structure" ? (
                                        renderStructure2D(asset)
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: getFontSize(
                                                    asset.type === "tree"
                                                        ? 24
                                                        : 28,
                                                ),
                                            }}
                                        >
                                            {asset.icon2D}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Top Energy Consumers */}
            {showLegend && (
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-300 max-h-[85%] overflow-y-auto min-w-[280px]">
                    <div className="font-bold mb-2 text-slate-800 text-sm flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span>⚡</span> Top Energy Consumers
                        </div>
                        <button
                            onClick={() => setShowLegend(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors text-base"
                            title="Hide Energy Data"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-2">
                        {/* HVAC Systems */}
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>❄️</span>
                                    <span className="font-semibold text-red-800">HVAC Unit #1</span>
                                </div>
                                <span className="text-red-700 font-bold">125.4 kWh/day</span>
                            </div>
                            <div className="text-xs text-red-600">Peak: 18.2 kW | Rating: C</div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>❄️</span>
                                    <span className="font-semibold text-red-800">HVAC Unit #2</span>
                                </div>
                                <span className="text-red-700 font-bold">118.7 kWh/day</span>
                            </div>
                            <div className="text-xs text-red-600">Peak: 17.5 kW | Rating: C</div>
                        </div>

                        {/* Refrigeration */}
                        <div className="bg-orange-50 border border-orange-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>🧊</span>
                                    <span className="font-semibold text-orange-800">Walk-in Cooler</span>
                                </div>
                                <span className="text-orange-700 font-bold">87.3 kWh/day</span>
                            </div>
                            <div className="text-xs text-orange-600">Peak: 12.1 kW | Rating: B</div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>🧊</span>
                                    <span className="font-semibold text-orange-800">Walk-in Freezer</span>
                                </div>
                                <span className="text-orange-700 font-bold">94.8 kWh/day</span>
                            </div>
                            <div className="text-xs text-orange-600">Peak: 13.6 kW | Rating: B</div>
                        </div>

                        {/* Lighting */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>💡</span>
                                    <span className="font-semibold text-yellow-800">LED Canopy Lights</span>
                                </div>
                                <span className="text-yellow-700 font-bold">45.2 kWh/day</span>
                            </div>
                            <div className="text-xs text-yellow-600">Peak: 6.8 kW | Rating: A</div>
                        </div>

                        {/* EV Charging */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>⚡</span>
                                    <span className="font-semibold text-blue-800">DC Fast Charger #1</span>
                                </div>
                                <span className="text-blue-700 font-bold">38.5 kWh/day</span>
                            </div>
                            <div className="text-xs text-blue-600">Peak: 150 kW | Rating: A</div>
                        </div>

                        {/* Car Wash */}
                        <div className="bg-purple-50 border border-purple-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>🚗</span>
                                    <span className="font-semibold text-purple-800">Car Wash System</span>
                                </div>
                                <span className="text-purple-700 font-bold">32.1 kWh/day</span>
                            </div>
                            <div className="text-xs text-purple-600">Peak: 8.4 kW | Rating: B</div>
                        </div>

                        {/* Energy Generation */}
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span>☀️</span>
                                    <span className="font-semibold text-green-800">Solar Array</span>
                                </div>
                                <span className="text-green-700 font-bold">-45.8 kWh/day</span>
                            </div>
                            <div className="text-xs text-green-600">Peak: 25 kW | Generation</div>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-300">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">Total Consumption:</span>
                            <span className="font-bold text-red-600">541.4 kWh/day</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="font-bold text-slate-700">Net Consumption:</span>
                            <span className="font-bold text-blue-600">495.6 kWh/day</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Energy Toggle Button - Show when hidden */}
            {!showLegend && (
                <button
                    onClick={() => setShowLegend(true)}
                    className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-300 hover:bg-blue-50 transition-all text-sm font-semibold text-slate-700 hover:text-blue-600"
                    title="Show Energy Consumption"
                >
                    ⚡ Energy Metrics
                </button>
            )}

            {/* Asset Count Summary */}
            <div className="absolute bottom-2 right-2 asset-summary text-white px-4 py-3 rounded-lg shadow-xl text-xs border border-blue-400">
                <div className="font-bold mb-2 text-sm">📊 Asset Summary</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div className="flex justify-between gap-2">
                        <span className="opacity-90">Buildings:</span>
                        <span className="font-bold">
                            {assets.filter((a) => a.type === "building").length}
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="opacity-90">Equipment:</span>
                        <span className="font-bold">
                            {
                                assets.filter((a) => a.type === "equipment")
                                    .length
                            }
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="opacity-90">Structures:</span>
                        <span className="font-bold">
                            {
                                assets.filter((a) => a.type === "structure")
                                    .length
                            }
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span className="opacity-90">Trees:</span>
                        <span className="font-bold">
                            {assets.filter((a) => a.type === "tree").length}
                        </span>
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-400 text-center font-bold text-sm">
                    Total: {assets.length}
                </div>
            </div>

            {/* Compass */}
            <div className="absolute top-2 right-2 compass px-3 py-2 rounded-full shadow-lg border border-slate-300">
                <div className="text-sm font-bold text-slate-700">N ↑</div>
            </div>

            {/* Info banner */}
            <div className="absolute top-2 left-2 info-banner backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold border border-blue-400">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🏗️</span>
                    <div>
                        <div className="text-xs opacity-90">
                            Retail Fuel Site Facility
                        </div>
                        <div className="text-base font-bold">
                            2D Top-Down Asset Map
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailFacilityLayout2D;

