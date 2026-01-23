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
}

// 2D Layout Component
const RetailFacilityLayout2D: React.FC<{
    assets: Asset[];
    onAssetClick?: (asset: Asset) => void;
    selectedAssetId?: string;
    visibleAssetTypes: Set<string>;
    showLegend: boolean;
    setShowLegend: (show: boolean) => void;
}> = ({
    assets,
    onAssetClick,
    selectedAssetId,
    visibleAssetTypes,
    showLegend,
    setShowLegend,
}) => {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const getAssetStyle = (asset: Asset): { className: string; style: React.CSSProperties } => {
        const isSelected = selectedAssetId === asset.id;

        const baseClass = "asset-base";
        const baseStyle: React.CSSProperties = {
            left: `${asset.position2D.x}%`,
            top: `${asset.position2D.y}%`,
        };

        if (asset.type === "building") {
            return {
                className: `${baseClass} asset-building ${isSelected ? 'asset-selected' : 'asset-not-selected'}`,
                style: {
                    ...baseStyle,
                    width: `${asset.width}%`,
                    height: `${asset.height}%`,
                },
            };
        } else if (asset.type === "structure") {
            return {
                className: `${baseClass} asset-structure ${isSelected ? 'asset-selected' : 'asset-not-selected'}`,
                style: {
                    ...baseStyle,
                    width: `${asset.width}%`,
                    height: `${asset.height}%`,
                },
            };
        } else {
            return {
                className: `${baseClass} asset-other ${isSelected ? 'asset-other-selected' : 'asset-other-not-selected'} ${asset.type === 'tree' ? 'asset-other-icon-tree' : 'asset-other-icon'}`,
                style: baseStyle,
            };
        }
    };

    const renderBuilding2D = (asset: Asset) => {
        const isSelected = selectedAssetId === asset.id;

        return (
            <div
                className={`asset-building-container ${isSelected ? 'asset-building-container-selected' : ''}`}
            >
                <div className="flex flex-col items-center gap-1">
                    {/* <span className="text-3xl drop-shadow-lg">
                        {asset.icon2D}
                    </span> */}
                    <span className="text-sm font-bold text-slate-800 drop-shadow-sm">
                        {asset.name}
                    </span>
                </div>
            </div>
        );
    };

    const renderStructure2D = (asset: Asset) => {
        const isSelected = selectedAssetId === asset.id;

        return (
            <div
                className={`asset-structure-container ${isSelected ? 'asset-structure-container-selected' : ''}`}
            >
                <div className="flex flex-col items-center">
                    {/* <span className="text-2xl drop-shadow-lg">
                        {asset.icon2D}
                    </span> */}
                    <span className="text-sm font-semibold text-slate-700 drop-shadow-sm">
                        {asset.name}
                    </span>
                </div>

                {/* Enhanced pillar markers in 2D */}
                {[0, 25, 50, 75, 100].map((pos, idx) => (
                    <div
                        key={idx}
                        className="pillar-marker"
                        style={{
                            left: `${pos}%`,
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div
            className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-400 shadow-2xl retail-facility-2d-container"
        >
            {/* 2D Scene Container */}
            <div className="absolute inset-0">
                {/* Ground/Parking areas */}
                <div className="absolute inset-0">
                    {/* Base ground plane */}
                    <div
                        className="absolute inset-0 ground-plane"
                    >
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
                                        <span>{asset.icon2D}</span>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Labels - Toggleable */}
            {showLegend && (
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-300 max-h-[85%] overflow-y-auto">
                    <div className="font-bold mb-2 text-slate-800 text-sm flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span>📋</span> Asset Categories
                        </div>
                        <button
                            onClick={() => setShowLegend(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors text-base"
                            title="Hide Legend"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="font-semibold text-slate-700 mb-1">
                                🏢 Buildings (
                                {
                                    assets.filter((a) => a.type === "building")
                                        .length
                                }
                                )
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>🏪</span>
                                    <span>Convenience Store</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🚗</span>
                                    <span>Car Wash</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📦</span>
                                    <span>Storage/Equipment</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                ⛽ Fuel Systems (10)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>⛽</span>
                                    <span>6× Fuel Dispensers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🛢️</span>
                                    <span>3× Underground Tanks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>💰</span>
                                    <span>Price Display</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                🔌 EV Charging (5)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>⚡</span>
                                    <span>2× DC Fast Chargers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔌</span>
                                    <span>3× Level 2 Chargers</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                🔋 Energy & Power (6)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>❄️</span>
                                    <span>2× HVAC Units</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>⚡</span>
                                    <span>Transformer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔋</span>
                                    <span>Backup Generator</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>☀️</span>
                                    <span>2× Solar Arrays</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                📹 Security (7)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>📹</span>
                                    <span>5× CCTV Cameras</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔔</span>
                                    <span>Fire Alarm</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🛑</span>
                                    <span>Emergency Shutoff</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                🛠️ Service Equipment (5)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>💨</span>
                                    <span>Air & Water</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🌪️</span>
                                    <span>2× Vacuum Stations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>💳</span>
                                    <span>ATM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🧊</span>
                                    <span>Ice Merchandiser</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                💡 Outdoor Infrastructure (9)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>💡</span>
                                    <span>4× LED Light Poles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🚲</span>
                                    <span>3× Bike Racks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>⚫</span>
                                    <span>4× Safety Bollards</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🌲</span>
                                    <span>8× Trees</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-1">
                            <div className="font-semibold text-slate-700 mb-1">
                                🧰 Other Assets (8)
                            </div>
                            <div className="space-y-0.5 pl-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span>🚜</span>
                                    <span>Snow Equipment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔥</span>
                                    <span>Propane Cage</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🗑️</span>
                                    <span>Waste Compactor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>♻️</span>
                                    <span>Recycling Station</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🪧</span>
                                    <span>Site Signage</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-300">
                        <div className="font-bold text-blue-600">
                            Total Assets: {assets.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend Toggle Button - Show when hidden */}
            {!showLegend && (
                <button
                    onClick={() => setShowLegend(true)}
                    className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-300 hover:bg-blue-50 transition-all text-sm font-semibold text-slate-700 hover:text-blue-600"
                    title="Show Asset Legend"
                >
                    📋 Show Legend
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

            {/* Asset Details Popup */}
            {selectedAsset && (
                <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setSelectedAsset(null)}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedAsset.icon2D}</span>
                                <div>
                                    <h3 className="text-lg font-bold">{selectedAsset.name}</h3>
                                    <p className="text-xs opacity-90">Asset ID: {selectedAsset.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAsset(null)}
                                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Asset Type */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                                <p className="text-gray-800 font-medium capitalize">{selectedAsset.type}</p>
                            </div>

                            {/* Category */}
                            {selectedAsset.category && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                                    <p className="text-gray-800 font-medium capitalize">{selectedAsset.category.replace(/-/g, ' ')}</p>
                                </div>
                            )}

                            {/* Position Information */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Position (2D)</label>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div className="bg-gray-100 rounded p-2">
                                        <div className="text-xs text-gray-500">X</div>
                                        <div className="font-semibold">{selectedAsset.position2D.x}%</div>
                                    </div>
                                    <div className="bg-gray-100 rounded p-2">
                                        <div className="text-xs text-gray-500">Y</div>
                                        <div className="font-semibold">{selectedAsset.position2D.y}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions */}
                            {(selectedAsset.width || selectedAsset.height) && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Dimensions</label>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        {selectedAsset.width && (
                                            <div className="bg-gray-100 rounded p-2">
                                                <div className="text-xs text-gray-500">Width</div>
                                                <div className="font-semibold">{selectedAsset.width}%</div>
                                            </div>
                                        )}
                                        {selectedAsset.height && (
                                            <div className="bg-gray-100 rounded p-2">
                                                <div className="text-xs text-gray-500">Height</div>
                                                <div className="font-semibold">{selectedAsset.height}%</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Image Preview */}
                            {selectedAsset.icon3D.startsWith('/') && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Asset Preview</label>
                                    <div className="mt-2 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                                        <img 
                                            src={selectedAsset.icon3D} 
                                            alt={selectedAsset.name}
                                            className="max-h-32 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex justify-between">
                                        <span>3D Position:</span>
                                        <span className="font-mono">({selectedAsset.position3D.x}%, {selectedAsset.position3D.y}%, {selectedAsset.position3D.z || 0})</span>
                                    </div>
                                    {selectedAsset.className && (
                                        <div className="flex justify-between">
                                            <span>CSS Class:</span>
                                            <span className="font-mono text-xs">{selectedAsset.className}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedAsset(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetailFacilityLayout2D;
