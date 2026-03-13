'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { Sidebar } from '@/components/sidebar';
import { ChatMessage, TypingIndicator, ChatInput, ChatSuggestions } from '@/components/chat';
import { Button } from '@/components/ui';
import { Message, IngestStatus, AssetCategory } from '@/types';
import { generateId } from '@/utils';
import styles from './page.module.css';

export default function Home() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ingestStatus, setIngestStatus] = useState<IngestStatus | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);

  // Filter state
  const [selectedDocument, setSelectedDocument] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | ''>('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load ingest status on mount
  useEffect(() => {
    loadIngestStatus();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadIngestStatus = async () => {
    try {
      const status = await api.getIngestStatus();
      setIngestStatus(status);
    } catch (error) {
      console.error('Failed to load ingest status:', error);
    }
  };

  const handleIngest = async () => {
    setIsIngesting(true);
    try {
      await api.ingestDocuments();
      await loadIngestStatus();
    } catch (error) {
      console.error('Failed to ingest:', error);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
      assetName: selectedDocument || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.queryDocuments(
        trimmedInput,
        categoryFilter || undefined,
        selectedDocument || undefined
      );

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleDocumentSelect = (filename: string) => {
    if (selectedDocument === filename) {
      setSelectedDocument('');
    } else {
      setSelectedDocument(filename);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        ingestStatus={ingestStatus}
        isIngesting={isIngesting}
        onIngest={handleIngest}
        selectedDocument={selectedDocument}
        onDocumentSelect={handleDocumentSelect}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Main Chat Area */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <img src="/logo.png" alt="BP" className={styles.logo} />
            <h1>Retail Asset Helpdesk</h1>
          </div>
          <div className={styles.headerRight}>
            <Link href="/assets">
              <Button 
                variant="ghost" 
                size="sm"
              >
                🏪 View All Assets
              </Button>
            </Link>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearChat}>
                🗑️ Clear Chat
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <ChatSuggestions
              onSuggestionClick={handleSuggestionClick}
              selectedAsset={selectedDocument}
            />
          ) : (
            <div className={styles.messages}>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          selectedAsset={selectedDocument}
          onClearAsset={() => setSelectedDocument('')}
          placeholder={
            selectedDocument
              ? `Report ${selectedDocument}...`
              : 'Describe your equipment issue or ask a question...'
          }
        />
      </main>
    </div>
  );
}