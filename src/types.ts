export type Persona = 'Store Manager' | 'Operations Manager';
export type Category = 'Dairy' | 'Snacks' | 'Beverages' | 'Fresh Produce' | 'Household';

export type Product = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
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

export type Recommendation = {
  id: number;
  category: Category;
  sku: string;
  productName: string;
  shelfCapacity: number;
  forecastedDemand: number;
  skuVelocity: 'Fast-moving' | 'Slow-moving';
  currentStock: number;
  suggestedReorderQty: number;
  maxShelfCapacity: number;
  expectedSellThrough: number;
  reason: string;
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
    name:string;
    type: 'Restock' | 'Layout' | 'Compliance' | 'General' | 'PO Approval' | 'Investigation';
};

export type UrgentIssue = {
    id: string;
    title: string;
    timestamp: string;
    category: Category;
    status: 'Urgent' | 'Pending' | 'Completed';
};

export type DailyDigestData = {
    urgentIssues: UrgentIssue[];
    todayTasks: DailyTask[];
    completedTasks: DailyTask[];
}


// --- Operations Manager Types ---

export type TaskType = 'Restocking' | 'Layout Change' | 'PO' | 'Investigation' | 'Compliance';
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

export type Urgency = 'Urgent' | 'Pending' | 'Critical' | 'Moderate'; // Expanded for alerts
export type OpsAlert = {
  id: number;
  sku?: string;
  productName?: string;
  title: string;
  urgency: Urgency;
  message: string;
  recommendation?: string;
  timestamp: string;
  category: Category;
};

export type Trend = 'up' | 'down' | 'stable';
export type OpsKpi = {
  title: string;
  value: string;
  trend: Trend;
  performance: 'good' | 'bad' | 'neutral';
  definition?: string;
};

export type PoStatus = 'Created' | 'In Transit' | 'Delivered';
export type PurchaseOrder = {
  id: string;
  supplierName: string;
  status: PoStatus;
  items: number;
  date: string;
};

export type Supplier = {
  name: string;
  leadTime: number; // in days
  fulfillmentAccuracy: number; // in %
  underperforming: boolean;
};

export type OpsInsight = {
    id: number;
    title: string;
    description: string;
    action: string;
    risk: string;
    rationale: string;
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