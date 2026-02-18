import React from 'react';
import { Message } from '@/types';
import { Badge } from '@/components/ui';
import { formatTime, getDocIcon } from '@/utils';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.avatar}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={styles.content}>
        {/* Asset Badge */}
        {message.assetName && (
          <div className={styles.assetBadge}>
            🔧 {message.assetName}
          </div>
        )}

        {/* Message Text */}
        <div className={styles.text}>
          {message.content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className={styles.sources}>
            <span className={styles.sourcesLabel}>Sources:</span>
            {message.sources.map((source, idx) => (
              <span key={idx} className={styles.sourceTag}>
                {getDocIcon(source.filename)} {source.filename}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className={styles.timestamp}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC = () => (
  <div className={`${styles.message} ${styles.assistant}`}>
    <div className={styles.avatar}>🤖</div>
    <div className={styles.content}>
      <div className={styles.text}>
        <div className={styles.typing}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
);