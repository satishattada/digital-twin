import { IngestStatus, QueryResponse, Asset, AssetStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ==================
  // Asset Endpoints
  // ==================

  async getAssets(): Promise<Asset[]> {
    return this.request<Asset[]>('/assets');
  }

  async getAsset(id: string): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}`);
  }

  async getAssetStats(): Promise<AssetStats> {
    return this.request<AssetStats>('/assets/stats');
  }

  // ==================
  // Document/RAG Endpoints
  // ==================

  async ingestDocuments(): Promise<{ message: string; files_processed: number }> {
    return this.request('/ingest', { method: 'POST' });
  }

  async getIngestStatus(): Promise<IngestStatus> {
    return this.request<IngestStatus>('/ingest/status');
  }

  async queryDocuments(
    question: string,
    assetCategory?: string,
    filename?: string
  ): Promise<QueryResponse> {
    return this.request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify({
        question,
        asset_category: assetCategory || null,
        filename: filename || null,
      }),
    });
  }

  // ==================
  // Health Check
  // ==================

  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const api = new ApiClient(API_BASE_URL);