import React, { useState, useRef, useEffect } from 'react';

interface Store {
  name: string;
  revenue: number;
  growth: string;
  efficiency: number;
  lat: number;
  lng: number;
  tasks: number;
  alerts: number;
  status: 'excellent' | 'good' | 'needs-attention';
}

interface UKMapWithStoresProps {
  onStoreSelect: (store: string) => void;
  selectedStore: string;
  stores?: Store[];
}

const REGIONAL_STORES: Store[] = [
  { 
    name: 'Kempton Park', 
    revenue: 98500, 
    growth: '+12%', 
    efficiency: 94,
    lat: 51.4167, 
    lng: -0.4167,
    tasks: 6,
    alerts: 2,
    status: 'excellent'
  },
  { 
    name: 'Hatton Cross', 
    revenue: 87200, 
    growth: '+8%', 
    efficiency: 91,
    lat: 51.4667, 
    lng: -0.4167,
    tasks: 4,
    alerts: 1,
    status: 'good'
  },
  { 
    name: 'Ashford SF', 
    revenue: 76300, 
    growth: '+15%', 
    efficiency: 88,
    lat: 51.1467, 
    lng: 0.8667,
    tasks: 8,
    alerts: 2,
    status: 'needs-attention'
  },
  { 
    name: 'Manchester Central', 
    revenue: 92400, 
    growth: '+10%', 
    efficiency: 89,
    lat: 53.4808, 
    lng: -2.2426,
    tasks: 5,
    alerts: 1,
    status: 'good'
  },
  { 
    name: 'Edinburgh North', 
    revenue: 84600, 
    growth: '+7%', 
    efficiency: 86,
    lat: 55.9533, 
    lng: -3.1883,
    tasks: 7,
    alerts: 3,
    status: 'needs-attention'
  },
  { 
    name: 'Birmingham South', 
    revenue: 96800, 
    growth: '+14%', 
    efficiency: 92,
    lat: 52.4862, 
    lng: -1.8904,
    tasks: 4,
    alerts: 0,
    status: 'excellent'
  },
  { 
    name: 'Cardiff Bay', 
    revenue: 79200, 
    growth: '+6%', 
    efficiency: 87,
    lat: 51.4816, 
    lng: -3.1791,
    tasks: 6,
    alerts: 2,
    status: 'good'
  },
  { 
    name: 'Belfast City', 
    revenue: 73500, 
    growth: '+9%', 
    efficiency: 85,
    lat: 54.5973, 
    lng: -5.9301,
    tasks: 8,
    alerts: 1,
    status: 'good'
  }
];

export const UKMapWithStores: React.FC<UKMapWithStoresProps> = ({ 
  onStoreSelect, 
  selectedStore, 
  stores = REGIONAL_STORES 
}) => {
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);

  const getStoreColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10B981'; // Green
      case 'good': return '#3B82F6'; // Blue  
      case 'needs-attention': return '#F59E0B'; // Orange
      default: return '#6B7280'; // Gray
    }
  };

  const getStoreSize = (isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return 14;
    if (isHovered) return 12;
    return 10;
  };

  const handleStoreClick = (storeName: string) => {
    onStoreSelect(storeName);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="app-container bg-white rounded-lg shadow-lg h-full flex">
      {/* Sidebar */}
      <div className="app__sidebar bg-gray-50 border-r border-gray-200 w-80 flex flex-col">
        {/* Search */}
        <div className="search__wrapper p-4 border-b border-gray-200">
          <div className="search search--with-after relative" role="search">
            <div className="search__input-line relative">
              <span className="search__left-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.746513 19.913L6.33153 14.328C7.827 15.6675 9.76453 16.4075 11.7722 16.406C16.2817 16.406 19.9504 12.7373 19.9504 8.22777C19.9504 3.7183 16.2817 0.0495605 11.7722 0.0495605C7.26274 0.0495605 3.59403 3.7183 3.59403 8.22777C3.59246 10.2355 4.33248 12.173 5.67204 13.6685L0.0870247 19.2535C-0.000429153 19.3409 -0.0495605 19.4596 -0.0495605 19.5832C-0.0495605 19.7069 -0.000429153 19.8255 0.0870247 19.913C0.174479 20.0004 0.293091 20.0496 0.416769 20.0496C0.540447 20.0496 0.65906 20.0004 0.746513 19.913ZM11.7722 0.982203C15.7675 0.982203 19.0178 4.23254 19.0178 8.22777C19.0178 12.223 15.7675 15.4733 11.7722 15.4733C7.77703 15.4733 4.52667 12.223 4.52667 8.22777C4.52667 4.23254 7.77703 0.982203 11.7722 0.982203Z" fill="currentColor"/>
                </svg>
              </span>
              <input 
                className="search__input w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                role="searchbox" 
                spellCheck="false" 
                autoComplete="off" 
                title="Search stores" 
                id="search" 
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search stores..."
              />
            </div>
            <div className="search__after-content flex items-center gap-2 mt-2">
              <button className="button-with-icon app__sidebar-filter-toggle-button p-2 hover:bg-gray-100 rounded-md" aria-label="Route planner" title="Route planner">
                <div className="button-with-icon__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9999 23.9405C11.9297 23.9406 11.8602 23.9268 11.7953 23.9C11.7304 23.8731 11.6715 23.8337 11.6219 23.784L0.215937 12.378C0.166287 12.3284 0.126901 12.2694 0.100029 12.2046C0.0731571 12.1397 0.0593262 12.0702 0.0593262 12C0.0593262 11.9298 0.0731571 11.8603 0.100029 11.7954C0.126901 11.7306 0.166287 11.6716 0.215937 11.622L11.6219 0.215998C11.6716 0.166348 11.7305 0.126962 11.7954 0.10009C11.8602 0.0732181 11.9297 0.0593872 11.9999 0.0593872C12.0701 0.0593872 12.1397 0.0732181 12.2045 0.10009C12.2694 0.126962 12.3283 0.166348 12.3779 0.215998L23.7839 11.622C23.8336 11.6716 23.873 11.7306 23.8998 11.7954C23.9267 11.8603 23.9405 11.9298 23.9405 12C23.9405 12.0702 23.9267 12.1397 23.8998 12.2046C23.873 12.2694 23.8336 12.3284 23.7839 12.378L12.3779 23.784C12.3283 23.8337 12.2694 23.8731 12.2046 23.9C12.1397 23.9268 12.0701 23.9406 11.9999 23.9405Z" fill="#666666"/>
                  </svg>
                </div>
              </button>
              <button className="button-with-icon app__sidebar-filter-toggle-button p-2 hover:bg-gray-100 rounded-md" aria-label="Filters" title="Filters">
                <div className="button-with-icon__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="28" height="25" viewBox="0 0 28 25">
                    <path fill="#666" d="M26.84 12.36h-2.17a3.88 3.88 0 0 0-7.67.01H.68a.61.61 0 0 0-.61.62.6.6 0 0 0 .61.6h16.34a3.88 3.88 0 0 0 7.67 0h2.16a.61.61 0 0 0 .6-.62.6.6 0 0 0-.6-.6Z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Store List */}
        <div className="app__sidebar-content flex-1 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">BP Retail Sites</h3>
          <div className="space-y-3">
            {filteredStores.map((store) => (
                <div 
                  key={store.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedStore === store.name 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleStoreClick(store.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStoreColor(store.status) }}
                      />
                      <h4 className="font-semibold text-gray-800">{store.name}</h4>
                    </div>
                    <span className="text-xs text-green-600 font-medium">{store.growth}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Revenue: £{store.revenue.toLocaleString()}</div>
                    <div>Efficiency: {store.efficiency}%</div>
                    <div>Tasks: {store.tasks}</div>
                    <div>Alerts: {store.alerts}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="google-map-base flex-1 relative">
        <div className="google-map-base__container relative overflow-hidden h-full">
          <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-b from-blue-100 via-blue-50 to-green-50">

            <svg 
              className="w-full h-full"
              viewBox="0 0 800 600" 
              style={{ background: 'linear-gradient(to bottom, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)' }}
            >
              <g transform="translate(350, 80) scale(0.8)">
                {/* England - More accurate shape */}
                <path
                  d="M50 450 L60 440 L70 430 L75 420 L80 400 L85 380 L90 360 L95 340 L100 320 L105 300 L110 280 L115 260 L120 240 L125 220 L130 200 L135 180 L140 160 L145 140 L150 120 L155 100 L160 85 L165 75 L170 70 L175 65 L180 60 L185 55 L190 50 L195 48 L200 47 L205 46 L210 45 L215 44 L220 43 L225 42 L230 41 L235 40 L240 41 L245 43 L250 45 L255 48 L260 52 L265 57 L270 63 L275 70 L280 78 L285 87 L290 97 L295 108 L300 120 L305 133 L310 147 L315 162 L320 178 L325 195 L330 213 L335 232 L340 252 L345 273 L350 295 L355 318 L360 342 L365 367 L370 393 L375 420 L380 448 L375 460 L365 465 L350 468 L330 470 L305 471 L275 470 L245 468 L215 465 L185 461 L155 456 L125 450 L95 443 L70 435 L50 450 Z"
                  fill="#22C55E"
                  fillOpacity="0.3"
                  stroke="#16A34A"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                
                {/* Wales - West side peninsula */}
                <path
                  d="M45 300 L35 310 L25 325 L20 340 L18 355 L20 370 L25 385 L35 400 L50 410 L65 415 L80 418 L90 420 L95 425 L90 430 L80 433 L65 435 L50 438 L35 440 L25 443 L20 447 L18 452 L20 457 L25 462 L35 467 L50 470 L70 468 L90 465 L110 460 L130 454 L150 447 L160 440 L155 430 L145 420 L130 410 L110 400 L90 390 L70 380 L55 370 L45 360 L40 350 L38 340 L40 330 L42 320 L44 310 L45 300 Z"
                  fill="#22C55E"
                  fillOpacity="0.3"
                  stroke="#16A34A"
                  strokeWidth="2"
                />
                
                {/* Scotland - More accurate northern region */}
                <path
                  d="M120 40 L130 35 L145 30 L160 28 L175 27 L190 28 L205 30 L220 33 L235 37 L250 42 L265 48 L280 55 L295 63 L310 72 L325 82 L340 93 L350 105 L355 118 L358 132 L360 147 L358 162 L355 177 L350 192 L340 206 L325 219 L310 231 L295 242 L280 252 L265 261 L250 269 L235 276 L220 282 L205 287 L190 291 L175 294 L160 296 L145 297 L130 297 L120 296 L115 290 L112 284 L110 278 L109 272 L108 266 L109 260 L112 254 L117 248 L123 242 L130 236 L138 230 L147 224 L157 218 L168 212 L180 206 L193 200 L207 194 L222 188 L238 182 L240 175 L238 168 L235 161 L230 154 L223 147 L215 140 L205 133 L194 126 L182 119 L169 112 L155 105 L140 98 L125 91 L110 84 L100 77 L95 70 L92 63 L90 56 L89 49 L90 42 L92 35 L95 28 L100 21 L110 18 L120 20 L125 25 L128 32 L130 39 L120 40 Z"
                  fill="#22C55E"
                  fillOpacity="0.3"
                  stroke="#16A34A"
                  strokeWidth="2"
                />

                {/* Northern Ireland - More accurate position and shape */}
                <path
                  d="M-20 150 L-15 145 L-8 142 L0 141 L8 142 L15 145 L20 150 L23 157 L24 165 L23 173 L20 180 L15 186 L8 191 L0 194 L-8 195 L-15 194 L-20 191 L-23 186 L-24 180 L-23 173 L-20 165 L-18 157 L-20 150 Z"
                  fill="#22C55E"
                  fillOpacity="0.3"
                  stroke="#16A34A"
                  strokeWidth="2"
                />

                {/* Cornwall - Southwest peninsula */}
                <path
                  d="M80 470 L70 475 L55 478 L40 480 L25 481 L15 480 L10 478 L8 475 L10 472 L15 469 L25 467 L40 466 L55 467 L70 469 L80 470 Z"
                  fill="#22C55E"
                  fillOpacity="0.3"
                  stroke="#16A34A"
                  strokeWidth="2"
                />
              </g>

              {/* Store Markers with corrected positioning */}
              {filteredStores.map((store) => {
                const isSelected = selectedStore === store.name;
                const isHovered = hoveredStore === store.name;
                const size = getStoreSize(isSelected, isHovered);
                
                // More accurate lat/lng to SVG coordinate conversion for UK
                const x = 350 + ((store.lng + 8) * 40); // Adjusted for UK longitude range
                const y = 400 - ((store.lat - 49) * 45); // Adjusted for UK latitude range
                
                return (
                  <g key={store.name}>
                    {/* Store marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={getStoreColor(store.status)}
                      stroke="white"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-200 drop-shadow-md hover:scale-110"
                      onMouseEnter={() => setHoveredStore(store.name)}
                      onMouseLeave={() => setHoveredStore(null)}
                      onClick={() => handleStoreClick(store.name)}
                    />
                    
                    {/* Store label */}
                    <text
                      x={x}
                      y={y - size - 8}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-800 pointer-events-none"
                      style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}
                    >
                      {store.name}
                    </text>
                    
                    {/* Pulse animation for alerts */}
                    {store.alerts > 0 && (
                      <circle
                        cx={x}
                        cy={y}
                        r={size + 4}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}
                    
                    {/* Hover tooltip */}
                    {isHovered && (
                      <foreignObject x={x + 20} y={y - 60} width="200" height="100">
                        <div className="bg-white p-3 rounded-lg border shadow-lg text-xs">
                          <div className="font-semibold text-gray-800">{store.name}</div>
                          <div className="text-gray-600 mt-1 space-y-1">
                            <div>Revenue: £{store.revenue.toLocaleString()}</div>
                            <div>Growth: {store.growth}</div>
                            <div>Tasks: {store.tasks} • Alerts: {store.alerts}</div>
                            <div>Efficiency: {store.efficiency}%</div>
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}

              {/* BP Logo */}
              <g transform="translate(20, 20)">
                <circle cx="20" cy="20" r="18" fill="#005BAC" />
                <text x="20" y="26" textAnchor="middle" className="fill-white text-sm font-bold">bp</text>
              </g>
            </svg>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-lg border p-2">
                <div className="flex flex-col gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded" title="Zoom in">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="w-full h-px bg-gray-200" />
                  <button className="p-2 hover:bg-gray-100 rounded" title="Zoom out">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border shadow-sm">
              <div className="text-xs text-gray-600 mb-2 font-semibold">Store Status</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Excellent Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Good Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Needs Attention</span>
                </div>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Regional Overview</div>
              <div className="text-sm font-semibold text-gray-800 space-y-1">
                <div>Total Revenue: £{filteredStores.reduce((sum, store) => sum + store.revenue, 0).toLocaleString()}</div>
                <div>Active Stores: {filteredStores.length}</div>
                <div>Total Tasks: {filteredStores.reduce((sum, store) => sum + store.tasks, 0)}</div>
                <div>Total Alerts: {filteredStores.reduce((sum, store) => sum + store.alerts, 0)}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UKMapWithStores;