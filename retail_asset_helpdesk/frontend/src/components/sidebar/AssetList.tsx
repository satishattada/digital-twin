import React from 'react';
import { ASSET_CATEGORIES } from '@/constants';
import { AssetCategory } from '@/types';
import { getDocIcon } from '@/utils';
import styles from './AssetList.module.css';

interface FileInfo {
  filename: string;
  ingested: boolean;
  asset_category?: string;
}

interface AssetListProps {
  files: FileInfo[];
  selectedDocument: string;
  onDocumentSelect: (filename: string) => void;
  categoryFilter: AssetCategory | '';
}

export const AssetList: React.FC<AssetListProps> = ({
  files,
  selectedDocument,
  onDocumentSelect,
  categoryFilter,
}) => {
  // Filter files by category if filter is set
  const filteredFiles = categoryFilter
    ? files.filter((f) => f.asset_category === categoryFilter)
    : files;

  const ingestedFiles = filteredFiles.filter((f) => f.ingested);
  const pendingFiles = filteredFiles.filter((f) => !f.ingested);

  const getCategoryIcon = (category?: string) => {
    if (!category) return '📄';
    return ASSET_CATEGORIES[category as AssetCategory]?.icon || '📄';
  };

  return (
    <div className={styles.documentList}>
      {/* Selection Info */}
      <div className={styles.selectionInfo}>
        <p>Click a document to filter queries</p>
      </div>

      {/* Ingested Files */}
      <h3>✅ Ingested ({ingestedFiles.length})</h3>
      {ingestedFiles.length > 0 ? (
        <ul>
          {ingestedFiles.map((file, idx) => (
            <li
              key={idx}
              className={`${styles.documentItem} ${
                selectedDocument === file.filename ? styles.selected : ''
              }`}
              onClick={() => onDocumentSelect(file.filename)}
            >
              <span className={styles.selectIndicator}>
                {selectedDocument === file.filename ? '✓' : '○'}
              </span>
              <span className={styles.docIcon}>
                {getCategoryIcon(file.asset_category)}
              </span>
              <div className={styles.docInfo}>
                <span className={styles.docName}>{file.filename}</span>
                {file.asset_category && (
                  <span className={styles.docCategory}>
                    {ASSET_CATEGORIES[file.asset_category as AssetCategory]?.label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>
          {categoryFilter
            ? 'No documents for this category'
            : 'No documents ingested yet'}
        </p>
      )}

      {/* Pending Files */}
      {pendingFiles.length > 0 && (
        <>
          <h3 className={styles.pendingHeader}>⏳ Pending ({pendingFiles.length})</h3>
          <ul>
            {pendingFiles.map((file, idx) => (
              <li key={idx} className={`${styles.documentItem} ${styles.pending}`}>
                <span className={styles.selectIndicator}>-</span>
                <span className={styles.docIcon}>
                  {getCategoryIcon(file.asset_category)}
                </span>
                <div className={styles.docInfo}>
                  <span className={styles.docName}>{file.filename}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};