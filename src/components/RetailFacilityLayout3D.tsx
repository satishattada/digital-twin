import React, { useState } from 'react';

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
  type: 'building' | 'equipment' | 'structure' | 'vehicle' | 'tree';
  icon2D: string;
  icon3D: string; // Image path for 3D view
  width?: number;
  height?: number;
  depth?: number; // 3D depth/height for isometric view (legacy, use position3D.z)
  category?: string; // Asset category for filtering
  className?: string; // Additional CSS classes
}

// 3D Layout Component
const RetailFacilityLayout3D: React.FC<{
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  selectedAssetId?: string;
  visibleAssetTypes: Set<string>;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}> = ({ assets, onAssetClick, selectedAssetId, visibleAssetTypes, showLegend, setShowLegend }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const getAssetStyle = (asset: Asset): React.CSSProperties => {
    const depth = asset.position3D.z || asset.depth || 0;
    const isSelected = selectedAssetId === asset.id;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${asset.position3D.x}%`,
      top: `${asset.position3D.y}%`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transformStyle: 'preserve-3d',
    };

    if (asset.type === 'building') {
      return {
        ...baseStyle,
        width: `${asset.width}%`,
        height: `${asset.height}%`,
        transform: isSelected ? 'rotateX(60deg) rotateZ(-45deg) scale(1.05)' : 'rotateX(60deg) rotateZ(-45deg)',
        transformOrigin: 'bottom center',
      };
    } else if (asset.type === 'structure') {
      return {
        ...baseStyle,
        width: `${asset.width}%`,
        height: `${asset.height}%`,
        transform: isSelected ? 'rotateX(60deg) rotateZ(-45deg) scale(1.05)' : 'rotateX(60deg) rotateZ(-45deg)',
        transformOrigin: 'bottom center',
      };
    } else {
      const transformStyle = asset.category === 'service' ?
        `rotateX(28deg) rotateY(40deg) rotateZ(-2deg) translateZ(25px)` : asset.category !== 'energy' ?
        'rotateX(9deg) rotateY(5deg) rotateZ(4deg) translateZ(25px)' : undefined;
      return {
        ...baseStyle,
        fontSize: asset.type === 'tree' ? '24px' : '28px',
        transform: transformStyle,
        transformOrigin: 'center',
        opacity: asset.name.includes('UST ')? 0.5 : 1,
        filter: isSelected
          ? 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) brightness(1.2) saturate(1.2)'
          : 'drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(1.1)',
        transition: 'all 0.3s ease',
        textShadow: isSelected
          ? '0 0 8px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
          : '0 2px 4px rgba(0,0,0,0.3)',
      };
    }
  };

  const renderBuilding3D = (asset: Asset) => {
    const isSelected = selectedAssetId === asset.id;
    const depth = asset.depth || 10;
    const visualDepth = depth * 2;

    // 3D Mode - Enhanced isometric representation with better shadows and gradients
    return (
      <div
        className="building-3d"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        //   filter: 'brightness(1) contrast(1)',
        }}
      >
        {/* Top face - with gradient and enhanced styling */}
        <div
        className='top-face'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            // background: isSelected
            //   ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)'
            //   : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
            border: '2px solid #1e293b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // transform: `translateZ(${visualDepth}px)`,
            boxShadow: isSelected
              ? '0 0 20px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0,0,0,0.4)'
              : '0 6px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* <div className="flex flex-col items-center gap-1">
            {asset.icon3D.startsWith('/') ? (
              <img 
                src={asset.icon3D} 
                alt={asset.name} 
                className="w-8 h-8 object-contain drop-shadow-lg" 
              />
            ) : (
              <span className="text-2xl drop-shadow-lg">{asset.icon3D}</span>
            )}
            <span className="text-sm font-bold text-slate-800 drop-shadow-sm">{asset.name}</span>
          </div> */}
        </div>

        {/* Front face - with depth and shadow */}
        <div
        className='front-face'
          style={{
            position: 'absolute',
            width: '100%',
            height: `${visualDepth}px`,
            // background: isSelected
            //   ? 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)'
            //   : 'linear-gradient(to bottom, #cbd5e1 0%, #94a3b8 100%)',
            border: '2px solid #334155',
            borderTop: 'none',
            bottom: 0,
            transformOrigin: 'bottom',
            transform: 'rotateX(-90deg)',
            boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.4)',
            filter: 'brightness(0.8)',
          }}
        />

        {/* Right face - with depth and shadow */}
        <div
         className='right-face'
          style={{
            position: 'absolute',
            width: `${visualDepth}px`,
            height: '100%',
            background: isSelected
              ? 'linear-gradient(to right, #2563eb 0%, #1d4ed8 100%)'
              : 'linear-gradient(to right, #94a3b8 0%, #64748b 100%)',
            border: '2px solid #475569',
            borderLeft: 'none',
            right: 0,
            transformOrigin: 'right',
            transform: 'rotateY(90deg)',
            boxShadow: 'inset 3px 0 8px rgba(0,0,0,0.4)',
            filter: 'brightness(0.7)',
          }}
        />

        {/* Left face - subtle shadow */}
        <div
         className='left-face'
          style={{
            position: 'absolute',
            width: `${visualDepth}px`,
            height: '100%',
            background: isSelected
              ? 'linear-gradient(to left, #3b82f6 0%, #60a5fa 100%)'
              : 'linear-gradient(to left, #cbd5e1 0%, #e2e8f0 100%)',
            border: '2px solid #64748b',
            borderRight: 'none',
            left: 0,
            transformOrigin: 'left',
            transform: 'rotateY(-90deg)',
            boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.2)',
            filter: 'brightness(0.9)',
          }}
        />

        {/* Back face - minimal */}
        <div
         className='back-face'
          style={{
            position: 'absolute',
            width: '100%',
            height: `${visualDepth}px`,
            background: isSelected
              ? '#1d4ed8'
              : '#64748b',
            border: '1px solid #475569',
            top: 0,
            transformOrigin: 'top',
            transform: 'rotateX(90deg) translateZ(-1px)',
            opacity: 0.3,
          }}
        />
      </div>
    );
  };

  const renderStructure3D = (asset: Asset) => {
    const isSelected = selectedAssetId === asset.id;
    const depth = asset.depth || 8;
    const visualDepth = (depth * 2);

    // 3D Mode - Enhanced isometric structure with full 3D box representation
    return (
      <div
        className="structure-3d"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          background: '#475569',
        }}
      >
        {/* Top face - semi-transparent canopy with glass effect */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: isSelected
              ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.5) 100%)'
              : 'linear-gradient(135deg, rgba(226, 232, 240, 0.6) 0%, rgba(203, 213, 225, 0.4) 100%)',
            border: '2px solid #64748b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // transform: `translateZ(${visualDepth}px)`,
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.3s ease',
          }}
        >
          <div className="flex flex-col items-center">
            {/* {asset.icon3D.startsWith('/') ? (
              <img
                src={asset.icon3D}
                alt={asset.name}
                className="w-6 h-6 object-contain drop-shadow-lg"
              />
            ) : (
              <span className="text-xl drop-shadow-lg">{asset.icon3D}</span>
            )} */}
            {/* <span className="text-sm font-semibold text-slate-700 drop-shadow-sm">{asset.name}</span> */}
          </div>
        </div>

        {/* Front face - with depth and shadow */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: `${visualDepth}px`,
            background: isSelected
              ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 100%)'
              : 'linear-gradient(to bottom, rgba(203, 213, 225, 0.5) 0%, rgba(148, 163, 184, 0.3) 100%)',
            border: '2px solid #64748b',
            borderTop: 'none',
            bottom: 0,
            transformOrigin: 'bottom',
            transform: 'rotateX(-90deg)',
            boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.3)',
            filter: 'brightness(0.8)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Right face - with depth and shadow */}
        <div
          style={{
            position: 'absolute',
            width: `${visualDepth}px`,
            height: '100%',
            background: isSelected
              ? 'linear-gradient(to right, rgba(37, 99, 235, 0.5) 0%, rgba(29, 78, 216, 0.3) 100%)'
              : 'linear-gradient(to right, rgba(148, 163, 184, 0.4) 0%, rgba(100, 116, 139, 0.2) 100%)',
            border: '2px solid #64748b',
            borderLeft: 'none',
            right: 0,
            transformOrigin: 'right',
            transform: 'rotateY(90deg)',
            boxShadow: 'inset 3px 0 8px rgba(0,0,0,0.3)',
            filter: 'brightness(0.7)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Left face - subtle shadow */}
        <div
          style={{
            position: 'absolute',
            width: `${visualDepth}px`,
            height: '100%',
            background: isSelected
              ? 'linear-gradient(to left, rgba(59, 130, 246, 0.6) 0%, rgba(96, 165, 250, 0.4) 100%)'
              : 'linear-gradient(to left, rgba(203, 213, 225, 0.5) 0%, rgba(226, 232, 240, 0.3) 100%)',
            border: '2px solid #64748b',
            borderRight: 'none',
            left: 0,
            transformOrigin: 'left',
            transform: 'rotateY(-90deg)',
            boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.2)',
            filter: 'brightness(0.9)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Back face - minimal */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: `${visualDepth}px`,
            background: isSelected
              ? 'rgba(29, 78, 216, 0.3)'
              : 'rgba(100, 116, 139, 0.2)',
            border: '1px solid #64748b',
            top: 0,
            transformOrigin: 'top',
            transform: 'rotateX(90deg) translateZ(-1px)',
            opacity: 0.3,
            backdropFilter: 'blur(2px)',
          }}
        />

      
            {[0, 25, 50, 75, 100].map((pos, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  width: idx === 4 || idx === 0? undefined : '25px',
                  height: `${visualDepth+159}px`,
                //   background: 'linear-gradient(to bottom, #64748b 0%, #475569 50%, #334155 100%)',
                  border: '1px solid #1e293b',
                  borderRadius: '2px',
                  left: `${pos}%`,
                  bottom: 0,
                  transform: 'translateZ(0px)',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  filter: 'brightness(0.8)',
                }}
              />
            ))}

            {/* Cross beams for structural integrity */}
        {/* <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '3px',
            background: 'linear-gradient(to right, #64748b 0%, #475569 50%, #64748b 100%)',
            border: '1px solid #334155',
            bottom: `${visualDepth * 0.3}px`,
            transform: 'translateZ(0px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '3px',
            background: 'linear-gradient(to right, #64748b 0%, #475569 50%, #64748b 100%)',
            border: '1px solid #334155',
            bottom: `${visualDepth * 0.7}px`,
            transform: 'translateZ(0px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        /> */}
      </div>
    );
  };

  return (
    <div
      className="relative w-full h-full rounded-lg border-2 border-slate-400 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #87ceeb 0%, #e0f6ff 30%, #f0f9ff 70%, #e6f3ff 100%)',
        perspective: '1400px',
        perspectiveOrigin: '50% 25%',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* 3D Scene Container */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(0deg)',
        }}
      >
        {/* Ground/Parking areas with isometric perspective */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Base ground plane with asphalt texture */}
          <div
            className="absolute inset-0"
            style={{
            //   background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 30%, #718096 70%, #a0aec0 100%)',
              transform: 'rotateX(60deg) rotateZ(-45deg) translateZ(-60px)',
              transformOrigin: 'center',
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
            }}
          >
            {/* Asphalt texture with parking lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <defs>
                <pattern id="asphalt-texture-3d" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#2d3748" />
                  <circle cx="10" cy="10" r="1" fill="#4a5568" opacity="0.6" />
                  <circle cx="30" cy="25" r="1.5" fill="#718096" opacity="0.4" />
                  <circle cx="5" cy="35" r="0.8" fill="#4a5568" opacity="0.5" />
                  <circle cx="35" cy="5" r="1.2" fill="#718096" opacity="0.3" />
                </pattern>
                <pattern id="parking-lines-3d" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="80" height="80" fill="url(#asphalt-texture-3d)" />
                  <line x1="0" y1="40" x2="80" y2="40" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8,8" />
                  <line x1="40" y1="0" x2="40" y2="80" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#parking-lines-3d)" />
            </svg>
          </div>

          {/* Assets in 3D space - filtered by category */}
          {assets
            .filter(asset => !asset.category || visibleAssetTypes.has(asset.category))
            .map((asset) => (
            <div
              key={asset.id}
              style={getAssetStyle(asset)}
              onClick={() => {
                setSelectedAsset(asset);
                onAssetClick?.(asset);
              }}
              title={asset.name}
              className="hover:z-20"
            >
              {asset.type === 'building' ? (
                renderBuilding3D(asset)
              ) : asset.type === 'structure' ? (
                renderStructure3D(asset)
              ) : (
                asset.icon3D.startsWith('/') ? (
                  <img 
                    src={asset.icon3D} 
                    alt={asset.name} 
                    className={`w-4 h-4 object-contain  ${asset.className || ''}`}
                  />
                ) : (
                  <span>{asset.icon3D}</span>
                )
              )}
            </div>
          ))}
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
              <div className="font-semibold text-slate-700 mb-1">🏢 Buildings ({assets.filter(a => a.type === 'building').length})</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>🏪</span><span>Convenience Store</span></div>
                <div className="flex items-center gap-2"><span>🚗</span><span>Car Wash</span></div>
                <div className="flex items-center gap-2"><span>📦</span><span>Storage/Equipment</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">⛽ Fuel Systems (10)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>⛽</span><span>6× Fuel Dispensers</span></div>
                <div className="flex items-center gap-2"><span>🛢️</span><span>3× Underground Tanks</span></div>
                <div className="flex items-center gap-2"><span>💰</span><span>Price Display</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">🔌 EV Charging (5)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>⚡</span><span>2× DC Fast Chargers</span></div>
                <div className="flex items-center gap-2"><span>🔌</span><span>3× Level 2 Chargers</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">🔋 Energy & Power (6)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>❄️</span><span>2× HVAC Units</span></div>
                <div className="flex items-center gap-2"><span>⚡</span><span>Transformer</span></div>
                <div className="flex items-center gap-2"><span>🔋</span><span>Backup Generator</span></div>
                <div className="flex items-center gap-2"><span>☀️</span><span>2× Solar Arrays</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">📹 Security (7)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>📹</span><span>5× CCTV Cameras</span></div>
                <div className="flex items-center gap-2"><span>🔔</span><span>Fire Alarm</span></div>
                <div className="flex items-center gap-2"><span>🛑</span><span>Emergency Shutoff</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">🛠️ Service Equipment (5)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>💨</span><span>Air & Water</span></div>
                <div className="flex items-center gap-2"><span>🌪️</span><span>2× Vacuum Stations</span></div>
                <div className="flex items-center gap-2"><span>💳</span><span>ATM</span></div>
                <div className="flex items-center gap-2"><span>🧊</span><span>Ice Merchandiser</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">💡 Outdoor Infrastructure (9)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>💡</span><span>4× LED Light Poles</span></div>
                <div className="flex items-center gap-2"><span>🚲</span><span>3× Bike Racks</span></div>
                <div className="flex items-center gap-2"><span>⚫</span><span>4× Safety Bollards</span></div>
                <div className="flex items-center gap-2"><span>🌲</span><span>8× Trees</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1">
              <div className="font-semibold text-slate-700 mb-1">🧰 Other Assets (8)</div>
              <div className="space-y-0.5 pl-2 text-xs">
                <div className="flex items-center gap-2"><span>🚜</span><span>Snow Equipment</span></div>
                <div className="flex items-center gap-2"><span>🔥</span><span>Propane Cage</span></div>
                <div className="flex items-center gap-2"><span>🗑️</span><span>Waste Compactor</span></div>
                <div className="flex items-center gap-2"><span>♻️</span><span>Recycling Station</span></div>
                <div className="flex items-center gap-2"><span>🪧</span><span>Site Signage</span></div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-300">
            <div className="font-bold text-blue-600">Total Assets: {assets.length}</div>
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
      <div className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-xl text-xs border border-blue-400">
        <div className="font-bold mb-2 text-sm">📊 Asset Summary</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex justify-between gap-2">
            <span className="opacity-90">Buildings:</span>
            <span className="font-bold">{assets.filter(a => a.type === 'building').length}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="opacity-90">Equipment:</span>
            <span className="font-bold">{assets.filter(a => a.type === 'equipment').length}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="opacity-90">Structures:</span>
            <span className="font-bold">{assets.filter(a => a.type === 'structure').length}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="opacity-90">Trees:</span>
            <span className="font-bold">{assets.filter(a => a.type === 'tree').length}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-blue-400 text-center font-bold text-sm">
          Total: {assets.length}
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-slate-300">
        <div className="text-sm font-bold text-slate-700">N ↑</div>
      </div>

      {/* Info banner */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold border border-blue-400">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏗️</span>
          <div>
            <div className="text-xs opacity-90">Retail Fuel Site Facility</div>
            <div className="text-base font-bold">3D Isometric Asset Map</div>

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
                <label className="text-xs font-semibold text-gray-500 uppercase">Position (3D)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xs text-gray-500">X</div>
                    <div className="font-semibold">{selectedAsset.position3D.x}%</div>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xs text-gray-500">Y</div>
                    <div className="font-semibold">{selectedAsset.position3D.y}%</div>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xs text-gray-500">Z</div>
                    <div className="font-semibold">{selectedAsset.position3D.z || selectedAsset.depth || 0}</div>
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
                    <span>2D Position:</span>
                    <span className="font-mono">({selectedAsset.position2D.x}%, {selectedAsset.position2D.y}%)</span>
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
        </div>
      </div>
    </div>
  );
};

export default RetailFacilityLayout3D;