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
  status?: 'operational' | 'warning' | 'critical' | 'offline';
}

// 3D Layout Component
const RetailFacilityLayout3D: React.FC<{
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  selectedAssetId?: string;
  visibleAssetTypes: Set<string>;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  equipmentData?: Array<{id: string; status: 'operational' | 'warning' | 'critical' | 'offline'}>;
  isMobile?: boolean;
  isTablet?: boolean;
}> = ({ assets, onAssetClick, selectedAssetId, visibleAssetTypes, showLegend, setShowLegend, equipmentData = [], isMobile = false, isTablet = false }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Get asset status from equipment data
  const getAssetStatus = (assetId: string) => {
    return equipmentData.find(eq => eq.id === assetId)?.status || 'operational';
  };

  // Responsive font sizes
  const getFontSize = (asset: Asset) => {
    const baseSize = asset.type === 'tree' ? 24 : 28;
    if (isMobile) return `${baseSize * 0.6}px`;
    if (isTablet) return `${baseSize * 0.8}px`;
    return `${baseSize}px`;
  };

  const getAssetStyle = (asset: Asset): React.CSSProperties => {
    const depth = asset.position3D.z || asset.depth || 0;
    const isSelected = selectedAssetId === asset.id;
    const status = getAssetStatus(asset.id);

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

      let transformStyle: string | undefined;
      switch (asset.category) {
        case 'car-wash':
          transformStyle = 'rotateX(0deg) rotateY(0deg) rotateZ(-7deg) translateZ(0px)';
          break;
        case 'service':
          transformStyle = 'rotateX(28deg) rotateY(40deg) rotateZ(-2deg) translateZ(25px)';
          break;
        case 'refrigeration':
          transformStyle = 'rotateX(10deg) rotateY(30deg) rotateZ(-10deg) translateZ(25px)';
          break;
        case 'food-service':
          transformStyle = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(25px)';
          break;
        case 'energy':
          transformStyle = undefined;
          break;
        default:
          transformStyle = 'rotateX(9deg) rotateY(5deg) rotateZ(4deg) translateZ(25px)';
          break;
      }
      // Alert styling based on status
      let filterStyle = 'drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(1.1)';
      let textShadow = '0 2px 4px rgba(0,0,0,0.3)';
      let animation = '';
      
      if (status === 'critical') {
        filterStyle = 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.9)) drop-shadow(0 0 10px rgba(220, 38, 38, 0.6)) brightness(1.3)';
        textShadow = '0 0 12px rgba(220, 38, 38, 1), 0 0 6px rgba(220, 38, 38, 0.8)';
        animation = 'pulse-red 1.5s ease-in-out infinite';
      } else if (status === 'warning') {
        filterStyle = 'drop-shadow(0 0 15px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 8px rgba(234, 179, 8, 0.5)) brightness(1.2)';
        textShadow = '0 0 10px rgba(234, 179, 8, 1), 0 0 5px rgba(234, 179, 8, 0.7)';
        animation = 'pulse-yellow 2s ease-in-out infinite';
      } else if (status === 'offline') {
        filterStyle = 'drop-shadow(0 6px 12px rgba(0,0,0,0.5)) grayscale(80%) brightness(0.6)';
        textShadow = '0 2px 4px rgba(0,0,0,0.5)';
      }
      
      if (isSelected) {
        filterStyle = 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) brightness(1.2) saturate(1.2)';
        textShadow = '0 0 8px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.5)';
        animation = '';
      }
      
      return {
        ...baseStyle,
        fontSize: getFontSize(asset),
        transform: transformStyle,
        transformOrigin: 'center',
        opacity: asset.name.includes('UST ')? 0.5 : 1,
        filter: filterStyle,
        transition: 'all 0.3s ease',
        textShadow: textShadow,
        animation: animation,
      };
    }
  };

  const renderBuilding3D = (asset: Asset) => {
    const isSelected = selectedAssetId === asset.id;
    const depth = asset.depth || 10;
    const visualDepth = depth * 2;
    const isStore = asset.id === 'store-main';
     const isCarWash = asset.id === 'carwash-building';
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
            background: isSelected
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
              : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
            border: '2px solid #1e293b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSelected
              ? '0 0 20px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0,0,0,0.4)'
              : '0 6px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            overflow: 'visible',
            transformStyle: 'preserve-3d',
          }}
        >

          {/* Store Interior Shelving - Only for main store */}
          {isStore && (
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
              {/* Checkout counters at front */}
              {/* <div className="absolute" style={{ left: '8%', top: '20%', width: '8%', height: '3%', background: '#8b4513', border: '1px solid #654321', borderRadius: '1px', transform: 'translateZ(3px)', transformStyle: 'preserve-3d' }} />
              <div className="absolute" style={{ left: '8%', top: '35%', width: '8%', height: '3%', background: '#8b4513', border: '1px solid #654321', borderRadius: '1px', transform: 'translateZ(3px)', transformStyle: 'preserve-3d' }} />
              <div className="absolute" style={{ left: '8%', top: '50%', width: '8%', height: '3%', background: '#4a5568', border: '1px solid #2d3748', borderRadius: '1px', transform: 'translateZ(3px)', transformStyle: 'preserve-3d' }} />
               */}
              {/* 3D Vertical Shelf rows - Aisle 1 (Left) */}
              {[
                { left: '20%', top: '20%', height: '64%' },
                { left: '34%', top: '20%', height: '64%' },
                { left: '48%', top: '20%', height: '64%' },
                { left: '60%', top: '20%', height: '64%' },
                { left: '74%', top: '20%', height: '64%' },
                // { left: '88%', top: '20%', height: '64%' },
              ].map((shelf, idx) => (
                <div key={`shelf-1-${idx}`} className="absolute" style={{ left: shelf.left, top: shelf.top, width: '2%', height: shelf.height, transformStyle: 'preserve-3d' }}>
                  {/* Top */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', background: '#cbd5e1', border: '1px solid #94a3b8', transform: 'translateZ(39px)' }} />
                  {/* Front */}
                  <div style={{ position: 'absolute', width: '100%', height: '39px', background: '#94a3b8', border: '1px solid #64748b', bottom: 0, transformOrigin: 'bottom', transform: 'rotateX(-90deg)' }} />
                  {/* Right */}
                  <div style={{ position: 'absolute', width: '39px', height: '100%', background: '#8892a8', border: '1px solid #64748b', right: 0, transformOrigin: 'right', transform: 'rotateY(90deg)' }} />
                  {/* Left */}
                  <div style={{ position: 'absolute', width: '39px', height: '100%', background: '#a8b2c8', border: '1px solid #94a3b8', left: 0, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />
                </div>
              ))}

             
              
              {/* 3D Refrigeration units (Right side) */}
              {[
                { left: '8%', top: '65%', height: '3%' },
                { left: '8%', top: '35%', height: '3%' },
                { left: '8%', top: '50%',  height: '3%' },
              ].map((fridge, idx) => (
                <div key={`fridge-${idx}`} className="absolute" style={{ left: fridge.left, top: fridge.top, width: '8%', height: fridge.height, transformStyle: 'preserve-3d' }}>
                  {/* Top */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', background: '#93c5fd', border: '1px solid #60a5fa', transform: 'translateZ(10px)' }} />
                  {/* Front */}
                  <div style={{ position: 'absolute', width: '100%', height: '10px', background: '#60a5fa', border: '1px solid #3b82f6', bottom: 0, transformOrigin: 'bottom', transform: 'rotateX(-90deg)' }} />
                  {/* Right */}
                  <div style={{ position: 'absolute', width: '10px', height: '100%', background: '#3b82f6', border: '1px solid #2563eb', right: 0, transformOrigin: 'right', transform: 'rotateY(90deg)' }} />
                  {/* Left */}
                  <div style={{ position: 'absolute', width: '10px', height: '100%', background: '#7dd3fc', border: '1px solid #60a5fa', left: 0, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />
                </div>
              ))}
              
             
              
          
              {/* Display stands */}
              <div className="absolute" style={{ left: '50%', top: '25%', width: '3%', height: '3%', background: '#ef4444', border: '1px solid #dc2626', borderRadius: '50%', transform: 'translateZ(4px)' }} />
              <div className="absolute" style={{ left: '32%', top: '35%', width: '3%', height: '3%', background: '#ef4444', border: '1px solid #dc2626', borderRadius: '50%', transform: 'translateZ(4px)' }} />
              <div className="absolute" style={{ left: '68%', top: '35%', width: '3%', height: '3%', background: '#10b981', border: '1px solid #059669', borderRadius: '50%', transform: 'translateZ(4px)' }} />
              
             
            </div>
          )}
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
       {!isCarWash &&  <div
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
        />}

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

  // Responsive perspective and scaling
  const perspective = isMobile ? '800px' : isTablet ? '1100px' : '1400px';
  const perspectiveOrigin = isMobile ? '50% 30%' : '50% 25%';
  const sceneScale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
  
  return (
    <div
      className="relative w-full h-full rounded-lg border-2 border-slate-400 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #87ceeb 0%, #e0f6ff 30%, #f0f9ff 70%, #e6f3ff 100%)',
        perspective: perspective,
        perspectiveOrigin: perspectiveOrigin,
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* 3D Scene Container */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(0deg) scale(${sceneScale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Ground/Parking areas with isometric perspective */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Base ground plane with asphalt texture */}
          <div
            className="absolute inset-0"
            style={{
            //   background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 30%, #718096 70%, #a0aec0 100%)',
              transform: `rotateX(60deg) rotateZ(-45deg) translateZ(${isMobile ? '-40px' : isTablet ? '-50px' : '-60px'})`,
              transformOrigin: 'center',
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
            }}
          >
            {/* Asphalt texture with parking lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: 'none' }}>
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

            {/* Entry and Exit Points */}
            {/* Main Entry - South */}
            <div
              className="absolute"
              style={{
                left: '48%',
                bottom: '0%',
                width: '10%',
                height: '5%',
                // transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformOrigin: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '3px solid #047857',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                fontSize: '24px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title="Main Entry"
            >
              <div >⬆️ ENTRY</div>
            </div>

            {/* North Exit */}
            <div
              className="absolute"
              style={{
                left: '90%',
                top: '0%',
                width: '10%',
                height: '5%',
                // transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformOrigin: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: '3px solid #b91c1c',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                fontSize: '24px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title="North Exit"
            >
              <div >⬆️ EXIT</div>
            </div>

            {/* East Entry/Exit */}
            <div
              className="absolute"
              style={{
                right: '0%',
                top: '48%',
                width: '5%',
                height: '10%',
                // transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformOrigin: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: '3px solid #1d4ed8',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                fontSize: '20px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title="East Entry/Exit"
            >
              <div >⬅️</div>
            </div>

            {/* West Entry/Exit */}
            <div
              className="absolute"
              style={{
                left: '0%',
                top: '48%',
                width: '5%',
                height: '10%',
                transform: 'rotateX(60deg) rotateZ(-45deg)',
                transformOrigin: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: '3px solid #1d4ed8',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                fontSize: '20px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title="West Entry/Exit"
            >
              <div style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}>➡️</div>
            </div>
          </div>

          {/* Assets in 3D space - filtered by category */}
          {assets
            .filter(asset => !asset.category || visibleAssetTypes.has(asset.category))
            .map((asset) => (
            <div
              key={asset.id}
              style={getAssetStyle(asset)}
              onClick={() => {
                if (asset.type === 'building' || asset.type === 'structure') {
                  return;
                }
                setSelectedAsset(asset);
                onAssetClick?.(asset);
              }}
              title={asset.name}
              // className="hover:z-20"
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

      {/* Top Energy Consumers */}
      {showLegend && (
        <div className="absolute z-10 top-8 right-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-300 max-h-[85%] overflow-y-auto min-w-[280px]">
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
          className="absolute top-8 right-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-300 hover:bg-blue-50 transition-all text-sm font-semibold text-slate-700 hover:text-blue-600"
          title="Show Energy Consumption"
        >
          ⚡ Energy Metrics
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailFacilityLayout3D;