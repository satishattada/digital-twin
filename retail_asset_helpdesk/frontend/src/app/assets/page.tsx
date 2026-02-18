'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { Asset, AssetCategory, AssetStatus } from '@/types';
import { Button } from '@/components/ui';
import styles from './assets.module.css';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assets from API...');
      const data = await api.getAssets();
      console.log('Received assets:', data?.length || 0);
      setAssets(data || []);
    } catch (error) {
      console.error('Failed to load assets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load assets');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    if (categoryFilter && asset.category !== categoryFilter) return false;
    if (statusFilter && asset.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'operational':
        return '#10b981';
      case 'maintenance':
        return '#f59e0b';
      case 'faulty':
        return '#ef4444';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: AssetCategory) => {
    const icons: Record<AssetCategory, string> = {
      coffee_machine: '☕',
      oven: '🔥',
      refrigerator: '❄️',
      freezer: '🧊',
      dishwasher: '🍽️',
      microwave: '📡',
      pos_terminal: '💳',
      display_cooler: '🧃',
      ice_machine: '🧊',
      hvac: '🌡️',
    };
    return icons[category] || '🔧';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>⚠️ Error Loading Assets</h2>
          <p>{error}</p>
          <Button onClick={loadAssets}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/">
            <Button variant="ghost">
              ← Back
            </Button>
          </Link>
          <img src="/logo.png" alt="BP" className={styles.logo} />
          <h1>Asset Inventory</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.count}>{filteredAssets.length} Assets</span>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | '')}
            className={styles.select}
          >
            <option value="">All Categories</option>
            <option value="coffee_machine">Coffee Machine</option>
            <option value="oven">Oven</option>
            <option value="refrigerator">Refrigerator</option>
            <option value="freezer">Freezer</option>
            <option value="dishwasher">Dishwasher</option>
            <option value="microwave">Microwave</option>
            <option value="pos_terminal">POS Terminal</option>
            <option value="display_cooler">Display Cooler</option>
            <option value="ice_machine">Ice Machine</option>
            <option value="hvac">HVAC</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AssetStatus | '')}
            className={styles.select}
          >
            <option value="">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="faulty">Faulty</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {(categoryFilter || statusFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategoryFilter('');
              setStatusFilter('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Assets Grid */}
      <div className={styles.grid}>
        {filteredAssets.map((asset) => (
          <Link 
            key={asset.id} 
            href={`/assets/${asset.id}`}
            className={styles.assetCard}
          >
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{getCategoryIcon(asset.category)}</span>
              <div
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(asset.status) }}
              >
                {asset.status}
              </div>
            </div>

            <h3 className={styles.assetName}>{asset.name}</h3>
            <p className={styles.assetModel}>
              {asset.manufacturer} - {asset.model}
            </p>

            <div className={styles.cardDetails}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>{asset.location}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Serial:</span>
                <span className={styles.detailValue}>{asset.serialNumber}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Last Maintenance:</span>
                <span className={styles.detailValue}>
                  {new Date(asset.lastMaintenance).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className={styles.empty}>
          <p>No assets found matching your filters</p>
          {assets.length > 0 && <p>Total assets: {assets.length}</p>}
          {assets.length === 0 && <p>No assets loaded from server</p>}
        </div>
      )}
    </div>
  );
}
