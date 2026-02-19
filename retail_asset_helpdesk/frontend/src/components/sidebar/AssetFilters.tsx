import React from 'react';
import { Select } from '@/components/ui';
import { ASSET_CATEGORIES } from '@/constants';
import { AssetCategory } from '@/types';
import styles from './AssetFilters.module.css';

interface AssetFiltersProps {
  categoryFilter: AssetCategory | '';
  onCategoryChange: (category: AssetCategory | '') => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  categoryFilter,
  onCategoryChange,
}) => {
  const categoryOptions = Object.entries(ASSET_CATEGORIES).map(
    ([value, { label, icon }]) => ({
      value,
      label,
      icon,
    })
  );

  return (
    <div className={styles.filters}>
      <h3>🔍 Filter by Category</h3>
      <Select
        options={categoryOptions}
        value={categoryFilter}
        onChange={(value) => onCategoryChange(value as AssetCategory | '')}
        placeholder="All Categories"
      />
      {categoryFilter && (
        <button
          className={styles.clearFilter}
          onClick={() => onCategoryChange('')}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};