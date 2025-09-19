import React, { useState, useRef, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'operational' | 'warning' | 'critical';
  revenue: number;
  growth: string;
  alerts: number;
  tasks: number;
}

interface MapInterfaceProps {
  onStoreSelect?: (storeId: string) => void;
  selectedStore?: string;
  stores?: Store[];
}

// Mock store data
const MOCK_STORES: Store[] = [
  {
    id: 'BP-001',
    name: 'BP Kempton Park',
    latitude: 51.4167,
    longitude: -0.4167,
    status: 'operational',
    revenue: 125000,
    growth: '+12%',
    alerts: 2,
    tasks: 6
  },
  {
    id: 'BP-002', 
    name: 'BP Hatton Cross',
    latitude: 51.4667,
    longitude: -0.4167,
    status: 'warning',
    revenue: 98000,
    growth: '+8%',
    alerts: 1,
    tasks: 4
  },
  {
    id: 'BP-003',
    name: 'BP Ashford SF',
    latitude: 51.1467,
    longitude: 0.8667,
    status: 'critical',
    revenue: 87000,
    growth: '+15%',
    alerts: 3,
    tasks: 8
  }
];

const MapInterface: React.FC<MapInterfaceProps> = ({
  onStoreSelect,
  selectedStore,
  stores = MOCK_STORES
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredStores, setFilteredStores] = useState(stores);
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter stores based on search
  useEffect(() => {
    if (searchValue) {
      setFilteredStores(stores.filter(store => 
        store.name.toLowerCase().includes(searchValue.toLowerCase())
      ));
    } else {
      setFilteredStores(stores);
    }
  }, [searchValue, stores]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStoreClick = (storeId: string) => {
    onStoreSelect?.(storeId);
  };

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: Store['status']) => {
    switch (status) {
      case 'operational': return 'text-green-700';
      case 'warning': return 'text-yellow-700'; 
      case 'critical': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div 
      className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        '--primary-colour': '#007F00',
        '--text-dark-colour': '#666666',
        '--search-input__text-colour': '#666666',
        '--bp-grey--500': '#666666',
        '--bp-green--500': '#007F00',
        '--bp-green--600': '#006A00',
        '--bp-pale-grey--500': '#EBEBEB',
        '--bp-light-pale-grey--500': '#F7F7F7',
        '--bp-red--500': '#FF0000',
        '--logos-width': '90px'
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Search Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M0.746513 19.913L6.33153 14.328C7.827 15.6675 9.76453 16.4075 11.7722 16.406C16.2817 16.406 19.9504 12.7373 19.9504 8.22777C19.9504 3.7183 16.2817 0.0495605 11.7722 0.0495605C7.26274 0.0495605 3.59403 3.7183 3.59403 8.22777C3.59246 10.2355 4.33248 12.173 5.67204 13.6685L0.0870247 19.2535C-0.000429153 19.3409 -0.0495605 19.4596 -0.0495605 19.5832C-0.0495605 19.7069 -0.000429153 19.8255 0.0870247 19.913C0.174479 20.0004 0.293091 20.0496 0.416769 20.0496C0.540447 20.0496 0.65906 20.0004 0.746513 19.913ZM11.7722 0.982203C15.7675 0.982203 19.0178 4.23254 19.0178 8.22777C19.0178 12.223 15.7675 15.4733 11.7722 15.4733C7.77703 15.4733 4.52667 12.223 4.52667 8.22777C4.52667 4.23254 7.77703 0.982203 11.7722 0.982203Z" 
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search stores..."
                value={searchValue}
                onChange={handleSearchChange}
                aria-label="Search stores"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <button 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Route planner"
                title="Route planner"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M11.9999 23.9405C11.9297 23.9406 11.8602 23.9268 11.7953 23.9C11.7304 23.8731 11.6715 23.8337 11.6219 23.784L0.215937 12.378C0.166287 12.3284 0.126901 12.2694 0.100029 12.2046C0.0731571 12.1397 0.0593262 12.0702 0.0593262 12C0.0593262 11.9298 0.0731571 11.8603 0.100029 11.7954C0.126901 11.7306 0.166287 11.6716 0.215937 11.622L11.6219 0.215998C11.6716 0.166348 11.7305 0.126962 11.7954 0.10009C11.8602 0.0732181 11.9297 0.0593872 11.9999 0.0593872C12.0701 0.0593872 12.1397 0.0732181 12.2045 0.10009C12.2694 0.126962 12.3283 0.166348 12.3779 0.215998L23.7839 11.622C23.8336 11.6716 23.873 11.7306 23.8998 11.7954C23.9267 11.8603 23.9405 11.9298 23.9405 12C23.9405 12.0702 23.9267 12.1397 23.8998 12.2046C23.873 12.2694 23.8336 12.3284 23.7839 12.378L12.3779 23.784C12.3283 23.8337 12.2694 23.8731 12.2046 23.9C12.1397 23.9268 12.0701 23.9406 11.9999 23.9405Z" 
                    fill="#666666"
                  />
                </svg>
              </button>
              
              <button 
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Filters"
                title="Filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="28" height="25" viewBox="0 0 28 25">
                  <path 
                    fill="#666" 
                    d="M26.84 12.36h-2.17a3.88 3.88 0 0 0-7.67.01H.68a.61.61 0 0 0-.61.62.6.6 0 0 0 .61.6h16.34a3.88 3.88 0 0 0 7.67 0h2.16a.61.61 0 0 0 .6-.62.6.6 0 0 0-.6-.6Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Store List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">BP Retail Sites</h3>
          <div className="space-y-3">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedStore === store.id
                    ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStoreClick(store.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(store.status)}`} />
                    <h4 className="font-semibold text-gray-800">{store.name}</h4>
                  </div>
                  <span className="text-xs text-green-600 font-medium">{store.growth}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                  <div>Revenue: £{store.revenue.toLocaleString()}</div>
                  <div className={getStatusTextColor(store.status)}>
                    Status: {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </div>
                  <div>Tasks: <span className="font-medium">{store.tasks}</span></div>
                  <div>Alerts: <span className="font-medium">{store.alerts}</span></div>
                </div>
                
                {store.alerts > 0 && (
                  <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    ⚠️ {store.alerts} active alert{store.alerts > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
            
            {filteredStores.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>No stores found matching "{searchValue}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100">
        {/* Map Container - This would typically integrate with Google Maps or another mapping service */}
        <div 
          ref={mapRef}
          className="w-full h-full bg-gradient-to-b from-blue-100 via-blue-50 to-green-50 relative overflow-hidden"
          style={{ backgroundColor: 'rgb(229, 227, 223)' }}
        >
          {/* Placeholder Map Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Map</h3>
              <p className="text-gray-600 text-sm mb-4">
                This area would display an interactive map showing BP retail locations with real-time status indicators.
              </p>
              <div className="space-y-2 text-left">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(store.status)}`} />
                    <span>{store.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white rounded-lg shadow-lg border p-1">
              <button className="block p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom in">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="w-full h-px bg-gray-200" />
              <button className="block p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border shadow-sm">
            <div className="text-xs text-gray-600 mb-2 font-semibold">Store Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* BP Logo */}
          <div className="absolute top-4 left-4">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
              bp
            </div>
          </div>
        </div>

        {/* Map Footer */}
        <div className="absolute bottom-0 right-0 bg-white/90 text-xs text-gray-600 px-2 py-1">
          Map data ©2025 Google
        </div>
      </div>
    </div>
  );
};

export default MapInterface;