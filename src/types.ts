import { ReactNode } from "react";

export type Persona = 'Store Manager' | 'Operations Manager' | 'Regional Manager' | 'Site Manager' | 'Digital Engineer' | 'Asset Strategy' | 'Asset Strategy Control Tower' | 'Supplier Performance';

export type Category = 
    | "All"
    | "Postal Services"
    | "Stationery & Office" 
    | "Cards & Gifts"
    | "Tobacco & Smoking"
    | "Confectionery & Snacks"
    | "Beverages"
    | "Health & Beauty"
    | "Electronics & Accessories"
    | "Automotive"
    | "Publications"
    | "Travel & Transport"
    | "Food Items";

// Updated Product type to match constants.ts
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  sku: string;
  lastRestock: string;
  trend: 'stable' | 'increasing' | 'decreasing' | 'declining' | 'seasonal';
  // Legacy fields for compatibility
  quantity?: any;
  brand?: string;
  imageUrl?: string;
  alert?: 'WRONG_LOCATION' | 'EMPTY_SHELF';
  rationale?: string;
};

export type PlanogramData = {
  products: Product[];
  complianceScore: number;
};

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  insight: string;
  definition?: string;
};

// Updated Recommendation type to match constants.ts
export type Recommendation = {
  id: string;  // Changed from number to string
  productName: string;
  sku: string;
  category: Category;
  currentStock: number;
  minThreshold: number;
  suggestedReorderQty: number;
  confidence: "High" | "Medium" | "Low";
  reason: string;
  estimatedDaysUntilStockout: number;
  supplier: string;
  costImpact: number;
  // Legacy fields for compatibility
  shelfCapacity?: number;
  forecastedDemand?: number;
  skuVelocity?: 'Fast-moving' | 'Slow-moving';
  maxShelfCapacity?: number;
  expectedSellThrough?: number;
};

export type InsightStatus = 'Urgent' | 'Pending' | 'Resolved';
export type InsightType = 'Layout' | 'Inventory' | 'Sales' | 'Compliance';

export type Insight = {
  id: string;
  timestamp: string;
  description: string;
  category: Category;
  type: InsightType;
  status: InsightStatus;
  title: string;
  projectedImpact?: string;
};

export type CategoryPerformanceSummary = {
    totalSkus: number;
    avgShelfTurns: number;
    marginImpact: string;
};

// --- For Store Layout Heatmap ---
export type HeatmapInsight = {
  topSku: string;
  lowPerformer: string;
  layoutSuggestion: string;
  aiRationale: string;
};

export type HeatmapZoneData = {
  id: string;
  name: string;
  engagement: 'low' | 'medium' | 'high';
  gridClass: string;
  insights: HeatmapInsight;
};

// --- For Daily Digest ---
export type DailyTask = {
    id: string;
    title: string;
    category: Category;
    priority: "high" | "medium" | "low";
    status: "completed" | "pending" | "in-progress";
    time: string;
    // Legacy fields
    name?: string;
    type?: 'Restock' | 'Layout' | 'Compliance' | 'General' | 'PO Approval' | 'Investigation';
};

export type UrgentIssue = {
    id: string;
    title: string;
    description: string;
    category: Category;
    severity: "critical" | "high" | "medium" | "low";
    time: string;
    // Legacy fields
    timestamp?: string;
    status?: 'Urgent' | 'Pending' | 'Completed';
};

export type DailyDigestData = {
    date: string;
    summary: {
        totalTasks: number;
        completedTasks: number;
        urgentIssues: number;
        revenueToday: number;
    };
    tasks: DailyTask[];
    urgentIssues: UrgentIssue[];
    // Legacy fields
    todayTasks?: DailyTask[];
    completedTasks?: DailyTask[];
};

// --- Operations Manager Types ---
export type TaskType = 'Restocking' | 'Layout Change' | 'PO' | 'Investigation' | 'Compliance' | 'Quality Control' | 'Merchandising';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export type Task = {
  id: string;
  description: string;
  details: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  category: Category;
  source?: 'Store Manager' | 'Autonomous';
  poId?: string;
  timestamp?: string;
  isPaused?: boolean;
  pauseReason?: string;
  isEscalated?: boolean;
  escalationReason?: string;
};

export type ShelfZoneStatus = 'Overstocked' | 'Understocked' | 'Optimized' | 'Chronic Imbalance';
export type ShelfZone = {
  id: string;
  name: string;
  status: ShelfZoneStatus;
  sku: string;
  currentStock: number;
  capacity: number;
  suggestedAdjustment: number;
};

export type InventoryMovementEvent = {
    day: number;
    description: string;
};

export type InventoryMovementData = {
  fastMovers: { name: string, data: number[] };
  slowMovers: { name: string, data: number[] };
  anomaly: { sku: string; description: string; } | null;
  aiInsight: string;
  fastMoverEvents?: InventoryMovementEvent[];
  slowMoverEvents?: InventoryMovementEvent[];
};

export type InventorySuggestion = {
  id: number;
  text: string;
};

// Updated OpsAlert type to match constants.ts
export type OpsAlert = {
  id: number;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: Category;
  timestamp: string;
  // Legacy fields for compatibility
  sku?: string;
  productName?: string;
  urgency?: 'Urgent' | 'Pending' | 'Critical' | 'Moderate';
  message?: string;
  recommendation?: string;
};

export type Trend = 'up' | 'down' | 'stable';
export type OpsKpi = {
  title: string;
  value: string;
  trend: Trend;
  performance: 'good' | 'bad' | 'neutral';
  definition?: string;
};

export type PoStatus = 'Created' | 'Delivered' | 'Pending' | 'In Transit' | 'Delayed';
export type PurchaseOrder = {
  id: string;
  supplierName?: string;
  supplier: string;
  orderDate?: string;
  expectedDelivery?: string;
  totalValue?: number;
  status: PoStatus;
  items: any;
  date?: string;
};

export type Supplier = {
  name: string;
  leadTime: number; // in days
  fulfillmentAccuracy: number; // in %
  underperforming: boolean;
};

// Updated OpsInsight type to match constants.ts
export type OpsInsight = {
    id: number;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    action: string;
    category: Category;
    timestamp: string;
    // Legacy fields for compatibility
    risk?: string;
    rationale?: string;
};

export type SpaceUtilizationSuggestion = {
    id: number;
    text: string;
};

export type SpaceUtilizationZone = {
    id: string;
    usage: number; // in %
};

export type SpaceUtilizationData = {
    zones: SpaceUtilizationZone[];
    suggestions: SpaceUtilizationSuggestion[];
};

export type OpsData = {
    shelfInventory: ShelfZone[];
    inventorySuggestions: InventorySuggestion[];
    inventoryMovement: InventoryMovementData;
    alerts: OpsAlert[];
    kpis: OpsKpi[];
    purchaseOrders: PurchaseOrder[];
    suppliers: Supplier[];
    insights: OpsInsight[];
    spaceUtilization: SpaceUtilizationData;
};

// --- For Shelfie Modal ---
export type DetectedItemType = 'correct' | 'misplaced' | 'low' | 'empty';

export type BoundingBox = {
  x: number; // % from left
  y: number; // % from top
  width: number; // % of parent
  height: number; // % of parent
};

export type DetectedItem = {
  id: string;
  type: DetectedItemType;
  box: BoundingBox;
  label: string;
  tooltip: string;
};

export type ShelfieAnalysisResult = {
  complianceScore: number;
  detectedItems: DetectedItem[];
  summary: {
      correct: number;
      misplaced: number;
      low: number;
      empty: number;
      totalExpectedSkus: number;
      facingIssues: number;
  };
};