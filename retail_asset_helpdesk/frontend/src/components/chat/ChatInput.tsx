import React, { useRef } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  selectedAsset?: string;
  onClearAsset?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Describe your issue or ask a question...',
  selectedAsset,
  onClearAsset,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.container}>
      {/* {selectedAsset && (
        <div className={styles.activeFilter}>
          <span>Report:</span>
          <span className={styles.filterTag}>{selectedAsset}</span>
          {onClearAsset && (
            <button className={styles.clearFilter} onClick={onClearAsset}>
              ✕
            </button>
          )}
        </div>
      )} */}

      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={styles.textarea}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!value.trim() || disabled}
        >
          ➤
        </button>
      </form>

      <p className={styles.disclaimer}>
        AI-powered assistance based on equipment manuals and documentation.
        Based on past tickets and resolutions.
      </p>
    </div>
  );
};