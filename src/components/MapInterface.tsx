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
  const mapRef = useRef<HTMLIFrameElement>(null);

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
    <div>
        <iframe
          ref={mapRef}
          title="Store Map" 
            width="100%"
            height="600"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://bpretaillocator.geoapp.me/?locale=en_GB`}>
        </iframe>
    </div>
  );
};

export default MapInterface;