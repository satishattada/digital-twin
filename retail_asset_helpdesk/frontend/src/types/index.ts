// Asset Types
export type AssetCategory = 
  | 'coffee_machine'
  | 'oven'
  | 'refrigerator'
  | 'freezer'
  | 'dishwasher'
  | 'microwave'
  | 'pos_terminal'
  | 'display_cooler'
  | 'ice_machine'
  | 'hvac';

export type AssetStatus = 'operational' | 'maintenance' | 'faulty' | 'offline';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  model: string;
  manufacturer: string;
  location: string;
  status: AssetStatus;
  lastMaintenance: string;
  serialNumber: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  installationDate?: string;
  warrantyExpiry?: string;
  imageUrl?: string;
  specifications?: AssetSpecifications;
  maintenanceHistory?: MaintenanceRecord[];
  issueHistory?: IssueRecord[];
}

export interface AssetSpecifications {
  voltage?: string;
  power?: string;
  capacity?: string;
  dimensions?: string;
  weight?: string;
  connectivity?: string;
  [key: string]: string | undefined;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'preventive' | 'corrective' | 'emergency';
  description: string;
  technician: string;
  cost?: number;
  partsReplaced?: string[];
  nextDueDate?: string;
}

export interface IssueRecord {
  id: string;
  reportedDate: string;
  resolvedDate?: string;
  issueType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolution?: string;
  downtime?: string;
  cost?: number;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}

export interface Document {
  id: string;
  filename: string;
  assetId: string;
  assetCategory: AssetCategory;
  docType: 'manual' | 'troubleshooting' | 'maintenance' | 'warranty' | 'parts';
  ingested: boolean;
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  assetId?: string;
  assetName?: string;
  sources?: Source[];
}

export interface Source {
  filename: string;
  docType: string;
  assetCategory: string;
}

// API Types
export interface IngestStatus {
  total_files: number;
  ingested_files: number;
  pending_files: number;
  files: Array<{
    filename: string;
    ingested: boolean;
    asset_category?: string;
  }>;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export interface AssetStats {
  total: number;
  byCategory: Record<AssetCategory, number>;
  byStatus: Record<AssetStatus, number>;
}