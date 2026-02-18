import React from 'react';
import { AssetList } from './AssetList';
import { AssetFilters } from './AssetFilters';
import { Button } from '@/components/ui';
import { IngestStatus, AssetCategory } from '@/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  ingestStatus: IngestStatus | null;
  isIngesting: boolean;
  onIngest: () => void;
  selectedDocument: string;
  onDocumentSelect: (filename: string) => void;
  categoryFilter: AssetCategory | '';
  onCategoryChange: (category: AssetCategory | '') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  ingestStatus,
  isIngesting,
  onIngest,
  selectedDocument,
  onDocumentSelect,
  categoryFilter,
  onCategoryChange,
}) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        {isOpen && <h2>📚 Documentation</h2>}
        <button className={styles.toggleButton} onClick={onToggle}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Ingest Button */}
          <Button
            onClick={onIngest}
            loading={isIngesting}
            className={styles.ingestButton}
          >
            {isIngesting ? 'Ingesting...' : '🔄 Ingest Documents'}
          </Button>

          {/* Stats */}
          {ingestStatus && (
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {ingestStatus.ingested_files}
                </span>
                <span className={styles.statLabel}>Ingested</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {ingestStatus.pending_files}
                </span>
                <span className={styles.statLabel}>Pending</span>
              </div>
            </div>
          )}

          {/* Filters */}
          <AssetFilters
            categoryFilter={categoryFilter}
            onCategoryChange={onCategoryChange}
          />

          {/* Document List */}
          <AssetList
            files={ingestStatus?.files || []}
            selectedDocument={selectedDocument}
            onDocumentSelect={onDocumentSelect}
            categoryFilter={categoryFilter}
          />

          {/* Clear Selection */}
          {selectedDocument && (
            <div className={styles.clearSection}>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDocumentSelect('')}
                className={styles.clearButton}
              >
                ✕ Clear Document Selection
              </Button>
            </div>
          )}
        </>
      )}
    </aside>
  );
};