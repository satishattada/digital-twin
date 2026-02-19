import React from 'react';
import { CHAT_SUGGESTIONS } from '@/constants';
import styles from './ChatSuggestions.module.css';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  selectedAsset?: string;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSuggestionClick,
  selectedAsset,
}) => {
  return (
    <div className={styles.emptyChat}>
      <span className={styles.icon}>🔧</span>
      <h2>Retail Asset Helpdesk</h2>
      <p>
        I can help you troubleshoot equipment issues, find maintenance procedures,
        understand error codes, and more.
      </p>

      {selectedAsset && (
        <div className={styles.selectedAssetBadge}>
          Currently helping with: <strong>{selectedAsset}</strong>
        </div>
      )}

      <div className={styles.suggestions}>
        {CHAT_SUGGESTIONS.map((category) => (
          <div key={category.category} className={styles.suggestionCategory}>
            <h3>{category.category}</h3>
            <div className={styles.suggestionButtons}>
              {category.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  className={styles.suggestionButton}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};