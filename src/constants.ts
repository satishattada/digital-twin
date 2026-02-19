import { Category, Kpi, Recommendation, Insight, PlanogramData, Product, Task, ShelfZone, InventoryMovementData, OpsAlert, OpsKpi, PurchaseOrder, Supplier, OpsInsight, CategoryPerformanceSummary, OpsData, InventorySuggestion, SpaceUtilizationData, SpaceUtilizationZone, SpaceUtilizationSuggestion, HeatmapZoneData, DailyTask, UrgentIssue, DailyDigestData, ShelfieAnalysisResult, DetectedItem } from './types';

// Product Database organized by new categories
const productDatabase: Record<Category, Product[]> = {
  "All": [], // Will be populated from all categories
  
  "Postal Services": [
    { id: 'ps1', name: '1st Class Stamps Book (12)', category: 'Postal Services', price: 8.40, costPrice: 7.56, stock: 45, minStock: 50, maxStock: 100, supplier: 'Royal Mail', sku: 'RM-1ST-12', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'ps2', name: '2nd Class Stamps Book (12)', category: 'Postal Services', price: 6.84, costPrice: 6.16, stock: 32, minStock: 8, maxStock: 80, supplier: 'Royal Mail', sku: 'RM-2ND-12', lastRestock: '2024-01-14', trend: 'increasing' },
    { id: 'ps3', name: 'Large Letter Stamps Book (6)', category: 'Postal Services', price: 7.50, costPrice: 6.75, stock: 28, minStock: 5, maxStock: 50, supplier: 'Royal Mail', sku: 'RM-LL-6', lastRestock: '2024-01-12', trend: 'stable' },
    { id: 'ps4', name: 'Padded Envelopes A4', category: 'Postal Services', price: 1.25, costPrice: 0.95, stock: 15, minStock: 20, maxStock: 100, supplier: 'Postal Plus', sku: 'PP-ENV-A4', lastRestock: '2024-01-10', trend: 'decreasing' },
    { id: 'ps5', name: 'Recorded Delivery Labels', category: 'Postal Services', price: 3.20, costPrice: 2.88, stock: 8, minStock: 15, maxStock: 60, supplier: 'Royal Mail', sku: 'RM-RD-LBL', lastRestock: '2024-01-08', trend: 'stable' },
    { id: 'ps6', name: 'Special Delivery Next Day', category: 'Postal Services', price: 6.95, costPrice: 6.26, stock: 12, minStock: 5, maxStock: 30, supplier: 'Royal Mail', sku: 'RM-SD-ND', lastRestock: '2024-01-11', trend: 'stable' },
  ],

  "Stationery & Office": [
    { id: 'st1', name: 'Biro Pens Blue (Pack of 10)', category: 'Stationery & Office', price: 3.99, costPrice: 2.79, stock: 25, minStock: 10, maxStock: 80, supplier: 'Office Direct', sku: 'OD-PEN-BL10', lastRestock: '2024-01-14', trend: 'stable' },
    { id: 'st2', name: 'A4 Lined Notebook', category: 'Stationery & Office', price: 2.50, costPrice: 1.75, stock: 18, minStock: 8, maxStock: 50, supplier: 'Stationery Plus', sku: 'SP-NB-A4L', lastRestock: '2024-01-13', trend: 'increasing' },
    { id: 'st3', name: 'Pencils HB (Pack of 5)', category: 'Stationery & Office', price: 1.99, costPrice: 1.39, stock: 22, minStock: 12, maxStock: 60, supplier: 'Office Direct', sku: 'OD-PENC-HB5', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'st4', name: 'Sticky Notes Yellow', category: 'Stationery & Office', price: 1.50, costPrice: 1.05, stock: 30, minStock: 15, maxStock: 75, supplier: 'Stationery Plus', sku: 'SP-STK-YEL', lastRestock: '2024-01-12', trend: 'stable' },
  ],

  "Cards & Gifts": [
    { id: 'cg1', name: 'Birthday Cards Assorted', category: 'Cards & Gifts', price: 2.99, costPrice: 1.49, stock: 40, minStock: 20, maxStock: 100, supplier: 'Greeting Co', sku: 'GC-BD-ASS', lastRestock: '2024-01-14', trend: 'stable' },
    { id: 'cg2', name: 'Thank You Cards (Pack of 6)', category: 'Cards & Gifts', price: 4.99, costPrice: 2.49, stock: 15, minStock: 10, maxStock: 50, supplier: 'Greeting Co', sku: 'GC-TY-6PK', lastRestock: '2024-01-10', trend: 'stable' },
    { id: 'cg3', name: 'Gift Wrap Roll', category: 'Cards & Gifts', price: 3.50, costPrice: 2.10, stock: 8, minStock: 5, maxStock: 25, supplier: 'Wrap It Up', sku: 'WIU-GW-RL', lastRestock: '2024-01-09', trend: 'seasonal' },
  ],

  "Tobacco & Smoking": [
    { id: 'ts1', name: 'Marlboro Gold 20s', category: 'Tobacco & Smoking', price: 12.50, costPrice: 10.75, stock: 200, minStock: 50, maxStock: 500, supplier: 'Tobacco Direct', sku: 'TD-MG-20', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'ts2', name: 'Lambert & Butler Blue 20s', category: 'Tobacco & Smoking', price: 11.90, costPrice: 10.25, stock: 180, minStock: 40, maxStock: 450, supplier: 'Tobacco Direct', sku: 'TD-LB-20', lastRestock: '2024-01-14', trend: 'decreasing' },
    { id: 'ts3', name: 'Disposable Lighter', category: 'Tobacco & Smoking', price: 1.00, costPrice: 0.60, stock: 50, minStock: 25, maxStock: 150, supplier: 'Lighter World', sku: 'LW-DISP', lastRestock: '2024-01-13', trend: 'stable' },
  ],

  "Confectionery & Snacks": [
    { id: 'cs1', name: 'Mars Bar 51g', category: 'Confectionery & Snacks', price: 1.25, costPrice: 0.75, stock: 48, minStock: 20, maxStock: 120, supplier: 'Sweet Supply', sku: 'SS-MARS-51', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'cs2', name: 'Snickers 48g', category: 'Confectionery & Snacks', price: 1.25, costPrice: 0.75, stock: 42, minStock: 20, maxStock: 120, supplier: 'Sweet Supply', sku: 'SS-SNICK-48', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'cs3', name: 'Haribo Starmix 140g', category: 'Confectionery & Snacks', price: 1.99, costPrice: 1.19, stock: 25, minStock: 15, maxStock: 80, supplier: 'Sweet Supply', sku: 'SS-HAR-STX', lastRestock: '2024-01-14', trend: 'increasing' },
    { id: 'cs4', name: 'Walkers Crisps Ready Salted', category: 'Confectionery & Snacks', price: 0.85, costPrice: 0.51, stock: 60, minStock: 30, maxStock: 200, supplier: 'Snack Direct', sku: 'SD-WALK-RS', lastRestock: '2024-01-15', trend: 'stable' },
  ],

  "Beverages": [
    { id: 'bv1', name: 'Coca Cola 500ml', category: 'Beverages', price: 1.50, costPrice: 0.90, stock: 72, minStock: 30, maxStock: 200, supplier: 'Drink Co', sku: 'DC-COKE-500', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'bv2', name: 'Water 500ml', category: 'Beverages', price: 0.80, costPrice: 0.48, stock: 96, minStock: 50, maxStock: 300, supplier: 'Pure Water Ltd', sku: 'PW-H2O-500', lastRestock: '2024-01-14', trend: 'stable' },
    { id: 'bv3', name: 'Red Bull 250ml', category: 'Beverages', price: 1.85, costPrice: 1.11, stock: 36, minStock: 20, maxStock: 120, supplier: 'Energy Plus', sku: 'EP-RB-250', lastRestock: '2024-01-13', trend: 'increasing' },
  ],

  "Health & Beauty": [
    { id: 'hb1', name: 'Paracetamol 16 Pack', category: 'Health & Beauty', price: 1.99, costPrice: 1.19, stock: 5, minStock: 10, maxStock: 80, supplier: 'Health Direct', sku: 'HD-PARA-16', lastRestock: '2024-01-12', trend: 'stable' },
    { id: 'hb2', name: 'Hand Sanitizer 50ml', category: 'Health & Beauty', price: 1.50, costPrice: 0.90, stock: 8, minStock: 15, maxStock: 100, supplier: 'Health Direct', sku: 'HD-HAND-50', lastRestock: '2024-01-14', trend: 'decreasing' },
    { id: 'hb3', name: 'Tissues Pocket Pack', category: 'Health & Beauty', price: 0.99, costPrice: 0.59, stock: 45, minStock: 25, maxStock: 150, supplier: 'Tissue Plus', sku: 'TP-POCK', lastRestock: '2024-01-13', trend: 'stable' },
  ],

  "Electronics & Accessories": [
    { id: 'ea1', name: 'AA Batteries (Pack of 4)', category: 'Electronics & Accessories', price: 3.99, costPrice: 2.39, stock: 20, minStock: 10, maxStock: 60, supplier: 'Power Tech', sku: 'PT-AA-4PK', lastRestock: '2024-01-11', trend: 'stable' },
    { id: 'ea2', name: 'USB-C Charging Cable', category: 'Electronics & Accessories', price: 7.99, costPrice: 4.79, stock: 2, minStock: 5, maxStock: 30, supplier: 'Tech Supply', sku: 'TS-USBC-CBL', lastRestock: '2024-01-09', trend: 'increasing' },
    { id: 'ea3', name: 'Earbuds Basic', category: 'Electronics & Accessories', price: 12.99, costPrice: 7.79, stock: 12, minStock: 8, maxStock: 40, supplier: 'Audio Plus', sku: 'AP-EAR-BSC', lastRestock: '2024-01-10', trend: 'stable' },
  ],

  "Automotive": [
    { id: 'au1', name: 'Car Air Freshener', category: 'Automotive', price: 2.99, costPrice: 1.79, stock: 15, minStock: 10, maxStock: 50, supplier: 'Auto Fresh', sku: 'AF-FRESH', lastRestock: '2024-01-08', trend: 'stable' },
    { id: 'au2', name: 'Screen Wash 1L', category: 'Automotive', price: 4.50, costPrice: 2.70, stock: 6, minStock: 5, maxStock: 25, supplier: 'Car Care Co', sku: 'CC-SW-1L', lastRestock: '2024-01-07', trend: 'stable' },
  ],

  "Publications": [
    { id: 'pb1', name: 'The Sun Newspaper', category: 'Publications', price: 0.80, costPrice: 0.40, stock: 25, minStock: 15, maxStock: 100, supplier: 'News Direct', sku: 'ND-SUN', lastRestock: '2024-01-15', trend: 'declining' },
    { id: 'pb2', name: 'Heat Magazine', category: 'Publications', price: 1.99, costPrice: 0.99, stock: 8, minStock: 5, maxStock: 30, supplier: 'Magazine Plus', sku: 'MP-HEAT', lastRestock: '2024-01-14', trend: 'stable' },
  ],

  "Travel & Transport": [
    { id: 'tt1', name: 'Oyster Card Top-up Voucher', category: 'Travel & Transport', price: 0.00, costPrice: 0.00, stock: 100, minStock: 50, maxStock: 200, supplier: 'TfL', sku: 'TFL-OYST', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'tt2', name: 'Bus Day Pass', category: 'Travel & Transport', price: 5.50, costPrice: 4.95, stock: 20, minStock: 10, maxStock: 50, supplier: 'Local Bus Co', sku: 'LBC-DAY', lastRestock: '2024-01-14', trend: 'stable' },
  ],

  "Food Items": [
    { id: 'fd1', name: 'Sandwich BLT', category: 'Food Items', price: 3.50, costPrice: 2.10, stock: 12, minStock: 8, maxStock: 30, supplier: 'Fresh Foods Ltd', sku: 'FF-BLT', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'fd2', name: 'Fresh Milk 1L', category: 'Food Items', price: 1.20, costPrice: 0.84, stock: 18, minStock: 10, maxStock: 40, supplier: 'Dairy Direct', sku: 'DD-MILK-1L', lastRestock: '2024-01-15', trend: 'stable' },
    { id: 'fd3', name: 'Bread White Loaf', category: 'Food Items', price: 1.00, costPrice: 0.65, stock: 22, minStock: 15, maxStock: 50, supplier: 'Bakery Plus', sku: 'BP-BREAD-W', lastRestock: '2024-01-15', trend: 'stable' },
  ],
};

// Generate recommendations based on low stock items
export const generateRecommendationsForCategory = (category: Category): Recommendation[] => {
  const products = productDatabase[category] || [];
  
  return products
    .filter(product => product.stock <= product.minStock)
    .map(product => ({
      id: `rec-${product.id}`,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.stock,
      minThreshold: product.minStock,
      suggestedReorderQty: Math.ceil((product.maxStock - product.stock) / 12) * 12, // Round to dozens
      confidence: product.stock < product.minStock * 0.5 ? "High" : "Medium",
      reason: product.stock === 0 
        ? "Out of stock - immediate reorder required"
        : `Stock below minimum threshold (${product.minStock} units)`,
      estimatedDaysUntilStockout: Math.max(1, Math.floor(product.stock / 2)), // Rough estimate
      supplier: product.supplier,
      costImpact: (Math.ceil((product.maxStock - product.stock) / 12) * 12) * product.costPrice,
    }));
};

// Populate "All" category with products from all other categories
productDatabase["All"] = Object.keys(productDatabase)
  .filter(key => key !== "All")
  .flatMap(key => productDatabase[key as Category]);

// Current products by category (simplified - just use the productDatabase directly)
const currentProductsMapping: Record<Category, Product[]> = {
  "All": productDatabase["All"],
  "Postal Services": productDatabase["Postal Services"],
  "Stationery & Office": productDatabase["Stationery & Office"],
  "Cards & Gifts": productDatabase["Cards & Gifts"],
  "Tobacco & Smoking": productDatabase["Tobacco & Smoking"],
  "Confectionery & Snacks": productDatabase["Confectionery & Snacks"],
  "Beverages": productDatabase["Beverages"],
  "Health & Beauty": productDatabase["Health & Beauty"],
  "Electronics & Accessories": productDatabase["Electronics & Accessories"],
  "Automotive": productDatabase["Automotive"],
  "Publications": productDatabase["Publications"],
  "Travel & Transport": productDatabase["Travel & Transport"],
  "Food Items": productDatabase["Food Items"],
};

// Initial recommendations for Store Manager
export const initialRecommendations: Recommendation[] = [
  ...generateRecommendationsForCategory("Postal Services"),
  ...generateRecommendationsForCategory("Health & Beauty"),
  ...generateRecommendationsForCategory("Electronics & Accessories"),
].slice(0, 8); // Limit to 8 recommendations

// Initial tasks
export const initialTasks: Task[] = [
  {
    id: 'task-1',
    description: 'Restock: 1st Class Stamps',
    details: 'Restock SKU: RM-1ST-12. Current: 45, Min: 50. Suggested: 72 units.',
    status: 'In Progress',
    type: 'Restocking',
    priority: 'High',
    source: 'Autonomous',
    category: 'Postal Services',
    timestamp: '09:15'
  },
  {
    id: 'task-2',
    description: 'Check expiry dates: Fresh sandwiches',
    details: 'Daily check required for all fresh food items',
    status: 'To Do',
    type: 'Quality Control',
    priority: 'Medium',
    source: 'Store Manager',
    category: 'Food Items',
    timestamp: '08:30'
  },
  {
    id: 'task-3',
    description: 'Reface: Confectionery display',
    details: 'Chocolate bars and sweets need proper facing',
    status: 'Completed',
    type: 'Merchandising',
    priority: 'Low',
    source: 'Store Manager',
    category: 'Confectionery & Snacks',
    timestamp: '07:45'
  }
];

// ...existing code...

// MOCK OPS DATA - Updated with new categories, inventory movement data, and purchase orders
export const MOCK_OPS_DATA: Record<string, { insights: OpsInsight[]; alerts: OpsAlert[]; inventoryMovement: InventoryMovementData; purchaseOrders: PurchaseOrder[] }> = {
  "All": {
    insights: [
      {
        id: 1,
        title: "Cross-Category Performance Analysis",
        description: "Postal services and confectionery showing strong correlation in sales patterns",
        impact: "high",
        action: "Review cross-merchandising opportunities near postal counter",
        category: "All",
        timestamp: "2 hours ago"
      },
      {
        id: 2,
        title: "Store Traffic Pattern Optimization",
        description: "Peak hours analysis reveals opportunity for better staff allocation",
        impact: "medium",
        action: "Adjust staffing schedule for 11:30-13:30 peak period",
        category: "All",
        timestamp: "4 hours ago"
      }
    ],
    alerts: [
      {
        id: 1,
        title: "Daily Systems Check Complete",
        description: "All point-of-sale and inventory systems functioning normally",
        severity: "low",
        category: "All",
        timestamp: "1 hour ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Overall Fast Movers", data: [45, 52, 38, 61, 47, 55, 49] },
      slowMovers: { name: "Overall Slow Movers", data: [8, 12, 6, 9, 11, 7, 10] },
      anomaly: { sku: "MULTI-CAT", description: "Cross-category bundling opportunity detected" },
      aiInsight: "Store-wide analysis shows strong correlation between postal services and impulse purchases. Consider cross-merchandising strategies.",
      fastMoverEvents: [
        { day: 2, description: "Morning rush hour surge" },
        { day: 4, description: "Lunch period peak traffic" }
      ],
      slowMoverEvents: [
        { day: 3, description: "Midweek low traffic period" },
        { day: 6, description: "Weekend different shopping patterns" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-2024-001",
        supplier: "Multiple Suppliers",
        status: "Pending",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-06",
        totalValue: 2847.50,
        items: [
          { sku: "RM-1ST-12", productName: "1st Class Stamps Book (12)", quantity: 72, unitCost: 7.56, totalCost: 544.32 },
          { sku: "HD-PARA-16", productName: "Paracetamol 16 Pack", quantity: 48, unitCost: 1.19, totalCost: 57.12 },
          { sku: "TS-USBC-CBL", productName: "USB-C Charging Cable", quantity: 24, unitCost: 4.79, totalCost: 114.96 }
        ]
      }
    ]
  },

  "Postal Services": {
    insights: [
      {
        id: 3,
        title: "Peak Stamp Demand Pattern",
        description: "1st class stamps showing 40% higher demand during 9-11 AM window",
        impact: "high",
        action: "Ensure adequate morning stock levels for priority postal products",
        category: "Postal Services",
        timestamp: "1 hour ago"
      },
      {
        id: 4,
        title: "Collection Time Impact Analysis",
        description: "Customer traffic spikes 30 minutes before each postal collection",
        impact: "medium",
        action: "Optimize staffing around 11:30 AM and 4:30 PM collection times",
        category: "Postal Services",
        timestamp: "3 hours ago"
      }
    ],
    alerts: [
      {
        id: 2,
        title: "Low Stock Alert: Priority Items",
        description: "Padded envelopes and recorded delivery labels below minimum threshold",
        severity: "high",
        category: "Postal Services",
        timestamp: "30 minutes ago"
      },
      {
        id: 3,
        title: "Collection Service Update",
        description: "Next postal collection delayed by 15 minutes - customer notification posted",
        severity: "medium",
        category: "Postal Services",
        timestamp: "45 minutes ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "1st Class Stamps", data: [82, 95, 67, 89, 78, 92, 85] },
      slowMovers: { name: "Special Delivery", data: [3, 5, 2, 4, 3, 6, 4] },
      anomaly: { sku: "RM-1ST-12", description: "Unusual spike in evening stamp purchases" },
      aiInsight: "1st Class Stamps dominate postal category sales with consistent high velocity. Consider increasing minimum stock levels.",
      fastMoverEvents: [
        { day: 2, description: "Collection deadline surge" },
        { day: 6, description: "Weekend mail preparation" }
      ],
      slowMoverEvents: [
        { day: 3, description: "Midweek low demand" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-PS-2024-003",
        supplier: "Royal Mail",
        status: "Delivered",
        orderDate: "2024-11-03",
        expectedDelivery: "2024-11-05",
        totalValue: 756.24,
        items: [
          { sku: "RM-1ST-12", productName: "1st Class Stamps Book (12)", quantity: 72, unitCost: 7.56, totalCost: 544.32 },
          { sku: "RM-2ND-12", productName: "2nd Class Stamps Book (12)", quantity: 24, unitCost: 6.16, totalCost: 147.84 },
          { sku: "RM-RD-LBL", productName: "Recorded Delivery Labels", quantity: 36, unitCost: 2.88, totalCost: 103.68 }
        ]
      }
    ]
  },

  "Stationery & Office": {
    insights: [
      {
        id: 5,
        title: "Back-to-School Demand Surge",
        description: "Pens and notebooks showing 60% increase compared to last month",
        impact: "high",
        action: "Prepare for sustained high demand through September - increase order quantities",
        category: "Stationery & Office",
        timestamp: "2 hours ago"
      }
    ],
    alerts: [
      {
        id: 4,
        title: "Supplier Delivery Delay",
        description: "Office Direct delivery delayed 24 hours - pen stock running low",
        severity: "medium",
        category: "Stationery & Office",
        timestamp: "1 hour ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Biro Pens Blue", data: [28, 35, 22, 41, 33, 38, 31] },
      slowMovers: { name: "Sticky Notes", data: [8, 12, 6, 9, 11, 7, 10] },
      anomaly: { sku: "OD-PEN-BL10", description: "Seasonal back-to-school demand spike detected" },
      aiInsight: "Pen sales correlate strongly with notebook purchases. Bundle promotion opportunity identified.",
      fastMoverEvents: [
        { day: 4, description: "Student rush before exams" }
      ],
      slowMoverEvents: []
    },
    purchaseOrders: [
      {
        id: "PO-ST-2024-007",
        supplier: "Office Direct",
        status: "Delayed",
        orderDate: "2024-11-02",
        expectedDelivery: "2024-11-05", // Originally 2024-11-04
        totalValue: 234.68,
        items: [
          { sku: "OD-PEN-BL10", productName: "Biro Pens Blue (Pack of 10)", quantity: 60, unitCost: 2.79, totalCost: 167.40 },
          { sku: "SP-NB-A4L", productName: "A4 Lined Notebook", quantity: 24, unitCost: 1.75, totalCost: 42.00 },
          { sku: "SP-STK-YEL", productName: "Sticky Notes Yellow", quantity: 36, unitCost: 1.05, totalCost: 37.80 }
        ]
      }
    ]
  },

  "Cards & Gifts": {
    insights: [
      {
        id: 6,
        title: "Greeting Card Performance Analysis",
        description: "Birthday cards outselling sympathy and thank-you cards by 4:1 ratio",
        impact: "medium",
        action: "Reallocate card display space to prioritize birthday card selection",
        category: "Cards & Gifts",
        timestamp: "4 hours ago"
      }
    ],
    alerts: [
      {
        id: 5,
        title: "Seasonal Stock Advisory",
        description: "Christmas card demand expected to increase - current stock insufficient",
        severity: "low",
        category: "Cards & Gifts",
        timestamp: "2 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Birthday Cards", data: [15, 22, 18, 25, 19, 21, 17] },
      slowMovers: { name: "Gift Wrap", data: [2, 4, 1, 3, 2, 5, 3] },
      anomaly: null,
      aiInsight: "Birthday cards maintain steady demand year-round. Gift wrap shows seasonal patterns requiring better forecasting.",
      fastMoverEvents: [
        { day: 6, description: "Weekend birthday party preparations" }
      ],
      slowMoverEvents: [
        { day: 1, description: "Post-weekend low demand" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-CG-2024-002",
        supplier: "Greeting Co",
        status: "Created",
        orderDate: "2024-10-28",
        expectedDelivery: "2024-11-02",
        totalValue: 189.50,
        items: [
          { sku: "GC-BD-ASS", productName: "Birthday Cards Assorted", quantity: 48, unitCost: 1.49, totalCost: 71.52 },
          { sku: "GC-TY-6PK", productName: "Thank You Cards (Pack of 6)", quantity: 24, unitCost: 2.49, totalCost: 59.76 },
          { sku: "WIU-GW-RL", productName: "Gift Wrap Roll", quantity: 18, unitCost: 2.10, totalCost: 37.80 }
        ]
      }
    ]
  },

  "Tobacco & Smoking": {
    insights: [
      {
        id: 7,
        title: "Regulatory Compliance Update",
        description: "All tobacco products properly secured and age verification protocols active",
        impact: "high",
        action: "Continue current security and verification procedures",
        category: "Tobacco & Smoking",
        timestamp: "6 hours ago"
      }
    ],
    alerts: [
      {
        id: 6,
        title: "Age Verification Log",
        description: "Daily age verification record requires completion and filing",
        severity: "medium",
        category: "Tobacco & Smoking",
        timestamp: "3 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Marlboro Gold 20s", data: [45, 52, 38, 48, 44, 50, 46] },
      slowMovers: { name: "Disposable Lighter", data: [12, 15, 9, 13, 11, 16, 14] },
      anomaly: { sku: "TD-MG-20", description: "Consistent high-value sales with strict age verification" },
      aiInsight: "Tobacco products show steady, regulated demand patterns. Lighters have potential for impulse sales growth.",
      fastMoverEvents: [],
      slowMoverEvents: []
    },
    purchaseOrders: [
      {
        id: "PO-TS-2024-011",
        supplier: "Tobacco Direct",
        status: "Delivered",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-06",
        totalValue: 4835.00,
        items: [
          { sku: "TD-MG-20", productName: "Marlboro Gold 20s", quantity: 300, unitCost: 10.75, totalCost: 3225.00 },
          { sku: "TD-LB-20", productName: "Lambert & Butler Blue 20s", quantity: 120, unitCost: 10.25, totalCost: 1230.00 },
          { sku: "LW-DISP", productName: "Disposable Lighter", quantity: 200, unitCost: 0.60, totalCost: 120.00 }
        ]
      }
    ]
  },

  "Confectionery & Snacks": {
    insights: [
      {
        id: 8,
        title: "Impulse Purchase Optimization",
        description: "Checkout-adjacent chocolate displays generating 35% higher sales per unit",
        impact: "high",
        action: "Expand strategic placement of high-margin confectionery near payment areas",
        category: "Confectionery & Snacks",
        timestamp: "1 hour ago"
      },
      {
        id: 9,
        title: "Weather-Driven Demand Patterns",
        description: "Cold weather correlating with increased sales of warm snacks and chocolate",
        impact: "medium",
        action: "Monitor weather forecasts for proactive seasonal product positioning",
        category: "Confectionery & Snacks",
        timestamp: "5 hours ago"
      }
    ],
    alerts: [
      {
        id: 7,
        title: "Product Expiry Management",
        description: "Multiple confectionery items approaching best-before dates within 7 days",
        severity: "medium",
        category: "Confectionery & Snacks",
        timestamp: "2 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Mars Bar", data: [65, 78, 52, 71, 59, 74, 67] },
      slowMovers: { name: "Haribo Starmix", data: [18, 25, 15, 22, 19, 27, 21] },
      anomaly: { sku: "SS-MARS-51", description: "Cold weather driving chocolate sales surge" },
      aiInsight: "Chocolate bars significantly outperform gummy sweets. Weather patterns strongly influence sales velocity.",
      fastMoverEvents: [
        { day: 2, description: "Temperature drop increases chocolate sales" },
        { day: 5, description: "Friday treat purchases spike" }
      ],
      slowMoverEvents: [
        { day: 1, description: "Monday health-conscious behavior" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-CS-2024-015",
        supplier: "Sweet Supply",
        status: "Pending",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-07",
        totalValue: 487.20,
        items: [
          { sku: "SS-MARS-51", productName: "Mars Bar 51g", quantity: 144, unitCost: 0.75, totalCost: 108.00 },
          { sku: "SS-SNICK-48", productName: "Snickers 48g", quantity: 120, unitCost: 0.75, totalCost: 90.00 },
          { sku: "SS-HAR-STX", productName: "Haribo Starmix 140g", quantity: 72, unitCost: 1.19, totalCost: 85.68 },
          { sku: "SD-WALK-RS", productName: "Walkers Crisps Ready Salted", quantity: 200, unitCost: 0.51, totalCost: 102.00 }
        ]
      }
    ]
  },

  "Beverages": {
    insights: [
      {
        id: 10,
        title: "Refrigeration Performance Analysis",
        description: "Optimal temperature maintenance resulting in 95% sales rate for chilled beverages",
        impact: "medium",
        action: "Maintain current refrigeration schedule and monitor temperature logs",
        category: "Beverages",
        timestamp: "3 hours ago"
      }
    ],
    alerts: [
      {
        id: 8,
        title: "Cooler Temperature Variance",
        description: "Beverage refrigerator temperature 2°C above optimal range",
        severity: "low",
        category: "Beverages",
        timestamp: "1 hour ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Coca Cola 500ml", data: [95, 112, 87, 104, 91, 108, 98] },
      slowMovers: { name: "Water 500ml", data: [45, 52, 38, 48, 42, 55, 49] },
      anomaly: { sku: "EP-RB-250", description: "Energy drink sales spike during exam periods" },
      aiInsight: "Coca Cola dominates beverage category. Energy drinks show opportunity for targeted placement near study materials.",
      fastMoverEvents: [
        { day: 3, description: "Midweek energy drink demand" },
        { day: 7, description: "Weekend social gathering purchases" }
      ],
      slowMoverEvents: []
    },
    purchaseOrders: [
      {
        id: "PO-BV-2024-009",
        supplier: "Drink Co",
        status: "In Transit",
        orderDate: "2024-11-02",
        expectedDelivery: "2024-11-05",
        totalValue: 324.00,
        items: [
          { sku: "DC-COKE-500", productName: "Coca Cola 500ml", quantity: 144, unitCost: 0.90, totalCost: 129.60 },
          { sku: "PW-H2O-500", productName: "Water 500ml", quantity: 200, unitCost: 0.48, totalCost: 96.00 },
          { sku: "EP-RB-250", productName: "Red Bull 250ml", quantity: 48, unitCost: 1.11, totalCost: 53.28 }
        ]
      }
    ]
  },

  "Health & Beauty": {
    insights: [
      {
        id: 11,
        title: "Essential Health Products Demand",
        description: "Pain relief and antiseptic products showing consistent above-average demand",
        impact: "medium",
        action: "Increase minimum stock levels for essential health and safety items",
        category: "Health & Beauty",
        timestamp: "4 hours ago"
      }
    ],
    alerts: [
      {
        id: 9,
        title: "Critical Stock Shortage",
        description: "Paracetamol and hand sanitizer approaching zero stock",
        severity: "high",
        category: "Health & Beauty",
        timestamp: "45 minutes ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Paracetamol 16 Pack", data: [25, 32, 18, 28, 22, 35, 29] },
      slowMovers: { name: "Tissues Pocket Pack", data: [12, 18, 8, 15, 11, 19, 16] },
      anomaly: { sku: "HD-PARA-16", description: "Critical shortage despite high demand" },
      aiInsight: "Essential health products show consistent demand but stock levels are critically low. Immediate reordering required.",
      fastMoverEvents: [
        { day: 1, description: "Monday morning health needs" },
        { day: 4, description: "Midweek illness management" }
      ],
      slowMoverEvents: []
    },
    purchaseOrders: [
      {
        id: "PO-HB-2024-012",
        supplier: "Health Direct",
        status: "Created",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-05",
        totalValue: 178.50,
        items: [
          { sku: "HD-PARA-16", productName: "Paracetamol 16 Pack", quantity: 60, unitCost: 1.19, totalCost: 71.40 },
          { sku: "HD-HAND-50", productName: "Hand Sanitizer 50ml", quantity: 72, unitCost: 0.90, totalCost: 64.80 },
          { sku: "TP-POCK", productName: "Tissues Pocket Pack", quantity: 48, unitCost: 0.59, totalCost: 28.32 }
        ]
      }
    ]
  },

  "Electronics & Accessories": {
    insights: [
      {
        id: 12,
        title: "Battery Sales Trend Analysis",
        description: "AA batteries representing 70% of all battery sales - optimization opportunity",
        impact: "medium",
        action: "Adjust battery inventory allocation to favor AA batteries over other types",
        category: "Electronics & Accessories",
        timestamp: "2 hours ago"
      }
    ],
    alerts: [
      {
        id: 10,
        title: "Zero Stock Alert",
        description: "USB-C charging cables completely sold out - customer inquiries increasing",
        severity: "high",
        category: "Electronics & Accessories",
        timestamp: "1 hour ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "AA Batteries", data: [22, 28, 15, 25, 19, 31, 26] },
      slowMovers: { name: "Earbuds Basic", data: [3, 6, 2, 4, 3, 7, 5] },
      anomaly: { sku: "TS-USBC-CBL", description: "USB-C cables sold out - high demand unmet" },
      aiInsight: "Electronics category driven by emergency purchases. USB-C cables show untapped demand potential with zero stock.",
      fastMoverEvents: [
        { day: 6, description: "Weekend device usage increases battery needs" }
      ],
      slowMoverEvents: [
        { day: 2, description: "Tuesday low electronics demand" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-EA-2024-008",
        supplier: "Tech Supply",
        status: "Created",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-05",
        totalValue: 287.60,
        items: [
          { sku: "TS-USBC-CBL", productName: "USB-C Charging Cable", quantity: 36, unitCost: 4.79, totalCost: 172.44 },
          { sku: "PT-AA-4PK", productName: "AA Batteries (Pack of 4)", quantity: 48, unitCost: 2.39, totalCost: 114.72 }
        ]
      }
    ]
  },

  "Automotive": {
    insights: [
      {
        id: 13,
        title: "Low-Velocity Product Analysis",
        description: "Automotive products showing consistently low turnover rates",
        impact: "low",
        action: "Consider reducing automotive category floor space allocation",
        category: "Automotive",
        timestamp: "6 hours ago"
      }
    ],
    alerts: [
      {
        id: 11,
        title: "Inventory Optimization Required",
        description: "Automotive products not meeting minimum turnover targets for allocated space",
        severity: "low",
        category: "Automotive",
        timestamp: "4 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Car Air Freshener", data: [8, 12, 6, 9, 7, 14, 10] },
      slowMovers: { name: "Screen Wash 1L", data: [2, 4, 1, 3, 2, 5, 3] },
      anomaly: null,
      aiInsight: "Automotive category underperforming across all products. Space reallocation recommended for higher-velocity categories.",
      fastMoverEvents: [],
      slowMoverEvents: [
        { day: 1, description: "Consistent low demand pattern" },
        { day: 3, description: "Midweek minimal automotive purchases" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-AU-2024-004",
        supplier: "Auto Fresh",
        status: "Delayed",
        orderDate: "2024-10-28",
        expectedDelivery: "2024-11-02",
        totalValue: 89.40,
        items: [
          { sku: "AF-FRESH", productName: "Car Air Freshener", quantity: 24, unitCost: 1.79, totalCost: 42.96 },
          { sku: "CC-SW-1L", productName: "Screen Wash 1L", quantity: 12, unitCost: 2.70, totalCost: 32.40 }
        ]
      }
    ]
  },

  "Publications": {
    insights: [
      {
        id: 14,
        title: "Digital Media Impact Assessment",
        description: "Newspaper sales declining 15% month-over-month while magazines remain stable",
        impact: "medium",
        action: "Reduce newspaper allocation and optimize magazine rack positioning",
        category: "Publications",
        timestamp: "5 hours ago"
      }
    ],
    alerts: [
      {
        id: 12,
        title: "Daily Publication Delivery",
        description: "Morning newspaper delivery arrived 45 minutes late - display updated",
        severity: "medium",
        category: "Publications",
        timestamp: "2 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "The Sun Newspaper", data: [35, 28, 32, 25, 30, 22, 27] },
      slowMovers: { name: "Heat Magazine", data: [5, 8, 3, 6, 4, 9, 7] },
      anomaly: { sku: "ND-SUN", description: "Newspaper sales declining trend continues" },
      aiInsight: "Publications category showing digital disruption impact. Newspapers declining while magazines maintain niche appeal.",
      fastMoverEvents: [
        { day: 1, description: "Monday newspaper demand peak" }
      ],
      slowMoverEvents: [
        { day: 4, description: "Thursday magazine changeover day" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-PB-2024-DAILY",
        supplier: "News Direct",
        status: "Delayed",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-05",
        totalValue: 65.00,
        items: [
          { sku: "ND-SUN", productName: "The Sun Newspaper", quantity: 50, unitCost: 0.40, totalCost: 20.00 },
          { sku: "MP-HEAT", productName: "Heat Magazine", quantity: 15, unitCost: 0.99, totalCost: 14.85 }
        ]
      }
    ]
  },

  "Travel & Transport": {
    insights: [
      {
        id: 15,
        title: "Transport Service Usage Patterns",
        description: "Oyster card top-ups peak during morning (7-9 AM) and evening (5-7 PM) commute",
        impact: "medium",
        action: "Ensure staff availability for transport services during peak commute windows",
        category: "Travel & Transport",
        timestamp: "3 hours ago"
      }
    ],
    alerts: [
      {
        id: 13,
        title: "Local Transport Disruption",
        description: "Bus route 25 temporary diversion affecting customer foot traffic patterns",
        severity: "low",
        category: "Travel & Transport",
        timestamp: "1 hour ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Oyster Top-ups", data: [125, 145, 98, 132, 118, 155, 138] },
      slowMovers: { name: "Bus Day Pass", data: [8, 12, 5, 9, 7, 14, 11] },
      anomaly: { sku: "TFL-OYST", description: "Commuter pattern disruption due to transport changes" },
      aiInsight: "Transport services show clear commuter patterns with high velocity during peak times. Excellent customer retention category.",
      fastMoverEvents: [
        { day: 1, description: "Monday morning commute rush" },
        { day: 2, description: "Tuesday evening peak travel" },
        { day: 6, description: "Friday weekend travel preparation" }
      ],
      slowMoverEvents: [
        { day: 3, description: "Midweek reduced travel" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-TT-2024-SERVICE",
        supplier: "TfL",
        status: "Delayed",
        orderDate: "2024-11-01",
        expectedDelivery: "2024-11-04",
        totalValue: 0.00,
        items: [
          { sku: "TFL-OYST", productName: "Oyster Card Top-up Service", quantity: 1, unitCost: 0.00, totalCost: 0.00 }
        ]
      }
    ]
  },

  "Food Items": {
    insights: [
      {
        id: 16,
        title: "Fresh Food Turnover Optimization",
        description: "Sandwiches and fresh items maintaining 90% daily sellthrough rate",
        impact: "high",
        action: "Maintain current fresh food ordering schedule and explore expanding selection",
        category: "Food Items",
        timestamp: "1 hour ago"
      },
      {
        id: 17,
        title: "Lunch Period Demand Analysis",
        description: "Peak fresh food sales consistently occurring between 12:00-14:00",
        impact: "medium",
        action: "Ensure fresh food restocking completion by 11:30 AM daily",
        category: "Food Items",
        timestamp: "4 hours ago"
      }
    ],
    alerts: [
      {
        id: 14,
        title: "Food Safety Compliance",
        description: "Daily expiry date check required for all fresh food products",
        severity: "high",
        category: "Food Items",
        timestamp: "30 minutes ago"
      },
      {
        id: 15,
        title: "Temperature Control Alert",
        description: "Fresh food display case temperature requires adjustment - currently 6°C",
        severity: "medium",
        category: "Food Items",
        timestamp: "1.5 hours ago"
      }
    ],
    inventoryMovement: {
      fastMovers: { name: "Sandwich BLT", data: [28, 35, 22, 38, 31, 42, 36] },
      slowMovers: { name: "Bread White Loaf", data: [12, 18, 8, 15, 11, 19, 16] },
      anomaly: { sku: "FF-BLT", description: "Lunch period concentration - 70% sold between 12-14:00" },
      aiInsight: "Fresh food category performs excellently with tight expiry management. Lunch period optimization critical for maximizing sales.",
      fastMoverEvents: [
        { day: 2, description: "Tuesday lunch rush peak" },
        { day: 4, description: "Thursday pre-weekend shopping" },
        { day: 5, description: "Friday lunch demand surge" }
      ],
      slowMoverEvents: [
        { day: 1, description: "Monday fresh stock setup period" }
      ]
    },
    purchaseOrders: [
      {
        id: "PO-FD-2024-DAILY",
        supplier: "Fresh Foods Ltd",
        status: "Delivered",
        orderDate: "2024-11-04",
        expectedDelivery: "2024-11-04",
        totalValue: 126.00,
        items: [
          { sku: "FF-BLT", productName: "Sandwich BLT", quantity: 24, unitCost: 2.10, totalCost: 50.40 },
          { sku: "DD-MILK-1L", productName: "Fresh Milk 1L", quantity: 36, unitCost: 0.84, totalCost: 30.24 },
          { sku: "BP-BREAD-W", productName: "Bread White Loaf", quantity: 48, unitCost: 0.65, totalCost: 31.20 }
        ]
      }
    ]
  }
};


// Updated MOCK_INSIGHTS_DATA for Postal Office Categories
export const MOCK_INSIGHTS_DATA: Record<Category, Insight[]> = {
    "All": [
        { id: 'all1', timestamp: '1h ago', title: 'Cross-Category Sales Correlation', description: 'Postal services and confectionery showing 85% purchase correlation during peak hours.', category: 'All', type: 'Sales', status: 'Pending', projectedImpact: '+£450 weekly opportunity' },
        { id: 'all2', timestamp: '3h ago', title: 'Store Performance Overview', description: 'Overall compliance score dropped to 72% due to stock shortages in key categories.', category: 'All', type: 'Compliance', status: 'Urgent', projectedImpact: '-8% category performance' },
    ],

    "Postal Services": [
        { id: 'ps1', timestamp: '30m ago', title: 'Critical Stock Alert: 1st Class Stamps', description: '1st Class Stamps below minimum threshold (45/50). Peak demand period approaching.', category: 'Postal Services', type: 'Inventory', status: 'Urgent', projectedImpact: '-£280 lost sales risk' },
        { id: 'ps2', timestamp: '2h ago', title: 'Service Efficiency Drop', description: 'Postal counter service time increased by 15% due to stamp shortage causing delays.', category: 'Postal Services', type: 'Layout', status: 'Pending', projectedImpact: 'Customer satisfaction risk' },
        { id: 'ps3', timestamp: '1d ago', title: 'Collection Time Optimization', description: 'Customer traffic spikes 30 minutes before postal collections - staff allocation needed.', category: 'Postal Services', type: 'Layout', status: 'Resolved', projectedImpact: '+12% service efficiency' },
    ],

    "Stationery & Office": [
        { id: 'st1', timestamp: '4h ago', title: 'Back-to-School Demand Surge', description: 'Pen and notebook sales up 60% - seasonal opportunity detected.', category: 'Stationery & Office', type: 'Sales', status: 'Pending', projectedImpact: '+£320 revenue opportunity' },
        { id: 'st2', timestamp: '6h ago', title: 'Bundle Opportunity Identified', description: 'Customers buying pens also purchase notebooks 78% of the time.', category: 'Stationery & Office', type: 'Sales', status: 'Pending', projectedImpact: '+15% average transaction value' },
    ],

    "Cards & Gifts": [
        { id: 'cg1', timestamp: '8h ago', title: 'Seasonal Display Optimization', description: 'Birthday cards outselling other categories 4:1 - display space reallocation needed.', category: 'Cards & Gifts', type: 'Layout', status: 'Pending', projectedImpact: '+£180 monthly uplift' },
        { id: 'cg2', timestamp: '2d ago', title: 'Gift Wrap Slow Movement', description: 'Gift wrap sales 40% below forecast - consider promotional pricing.', category: 'Cards & Gifts', type: 'Sales', status: 'Resolved', projectedImpact: 'Inventory optimization' },
    ],

    "Tobacco & Smoking": [
        { id: 'ts1', timestamp: '1h ago', title: 'Regulatory Compliance Check', description: 'Daily age verification log complete - all tobacco transactions properly recorded.', category: 'Tobacco & Smoking', type: 'Compliance', status: 'Resolved', projectedImpact: 'Compliance maintained' },
        { id: 'ts2', timestamp: '5h ago', title: 'High-Margin Category Performance', description: 'Tobacco products generating 15.3% margin impact - security protocols effective.', category: 'Tobacco & Smoking', type: 'Sales', status: 'Resolved', projectedImpact: '+£890 weekly contribution' },
    ],

    "Confectionery & Snacks": [
        { id: 'cs1', timestamp: '2h ago', title: 'Impulse Purchase Optimization', description: 'Chocolate bars near checkout showing 35% higher sales velocity.', category: 'Confectionery & Snacks', type: 'Layout', status: 'Urgent', projectedImpact: '+£520 weekly opportunity' },
        { id: 'cs2', timestamp: '6h ago', title: 'Weather-Driven Demand Pattern', description: 'Cold weather correlating with 25% increase in warm snack sales.', category: 'Confectionery & Snacks', type: 'Inventory', status: 'Pending', projectedImpact: '+£340 seasonal uplift' },
        { id: 'cs3', timestamp: '1d ago', title: 'Expiry Date Management', description: 'Multiple confectionery items approaching best-before dates within 7 days.', category: 'Confectionery & Snacks', type: 'Compliance', status: 'Resolved', projectedImpact: 'Waste reduction achieved' },
    ],

    "Beverages": [
        { id: 'bv1', timestamp: '3h ago', title: 'Cooler Temperature Alert', description: 'Beverage refrigerator running 2°C above optimal - sales impact detected.', category: 'Beverages', type: 'Inventory', status: 'Urgent', projectedImpact: '-£450 weekly sales risk' },
        { id: 'bv2', timestamp: '1d ago', title: 'Energy Drink Performance', description: 'Red Bull sales up 18% - consider expanding energy drink selection.', category: 'Beverages', type: 'Sales', status: 'Pending', projectedImpact: '+£280 category expansion' },
    ],

    "Health & Beauty": [
        { id: 'hb1', timestamp: '1h ago', title: 'Critical Stock Shortage', description: 'Paracetamol (5/10) and hand sanitizer (8/15) approaching zero stock.', category: 'Health & Beauty', type: 'Inventory', status: 'Urgent', projectedImpact: '-£380 lost sales risk' },
        { id: 'hb2', timestamp: '4h ago', title: 'Essential Items Demand Spike', description: 'Health products showing 22% above-average demand this week.', category: 'Health & Beauty', type: 'Sales', status: 'Pending', projectedImpact: '+£190 reorder opportunity' },
    ],

    "Electronics & Accessories": [
        { id: 'ea1', timestamp: '45m ago', title: 'Zero Stock Alert: USB-C Cables', description: 'USB-C charging cables completely sold out - customer inquiries increasing.', category: 'Electronics & Accessories', type: 'Inventory', status: 'Urgent', projectedImpact: '-£620 immediate sales loss' },
        { id: 'ea2', timestamp: '3h ago', title: 'Battery Category Optimization', description: 'AA batteries represent 70% of battery sales - space allocation review needed.', category: 'Electronics & Accessories', type: 'Layout', status: 'Pending', projectedImpact: '+£150 space efficiency' },
    ],

    "Automotive": [
        { id: 'au1', timestamp: '1d ago', title: 'Low Category Performance', description: 'Automotive products showing consistently low turnover - space reallocation opportunity.', category: 'Automotive', type: 'Sales', status: 'Pending', projectedImpact: '+£120 space optimization' },
        { id: 'au2', timestamp: '2d ago', title: 'Seasonal Demand Pattern', description: 'Air freshener sales stable but screen wash declining in winter months.', category: 'Automotive', type: 'Inventory', status: 'Resolved', projectedImpact: 'Inventory rightsized' },
    ],

    "Publications": [
        { id: 'pb1', timestamp: '2h ago', title: 'Digital Media Impact', description: 'Newspaper sales down 15% month-over-month while magazines remain stable.', category: 'Publications', type: 'Sales', status: 'Pending', projectedImpact: '-£85 category decline' },
        { id: 'pb2', timestamp: '5h ago', title: 'Delivery Timing Issue', description: 'Morning newspaper delivery 45 minutes late - customer complaints received.', category: 'Publications', type: 'Compliance', status: 'Resolved', projectedImpact: 'Service quality maintained' },
    ],

    "Travel & Transport": [
        { id: 'tt1', timestamp: '1h ago', title: 'Peak Commute Optimization', description: 'Oyster card top-ups surge during 7-9 AM and 5-7 PM windows.', category: 'Travel & Transport', type: 'Layout', status: 'Pending', projectedImpact: '+£340 service efficiency' },
        { id: 'tt2', timestamp: '4h ago', title: 'Transport Disruption Impact', description: 'Bus route 25 diversion affecting customer foot traffic patterns.', category: 'Travel & Transport', type: 'Layout', status: 'Resolved', projectedImpact: 'Customer communication updated' },
    ],

    "Food Items": [
        { id: 'fd1', timestamp: '2h ago', title: 'Food Safety Compliance Check', description: 'Daily expiry date check required for all fresh food products - BLT sandwiches priority.', category: 'Food Items', type: 'Compliance', status: 'Urgent', projectedImpact: 'Safety compliance critical' },
        { id: 'fd2', timestamp: '3h ago', title: 'Fresh Food Turnover Success', description: 'Sandwiches maintaining 90% daily sellthrough rate - supply optimization working.', category: 'Food Items', type: 'Sales', status: 'Resolved', projectedImpact: '+£240 waste reduction' },
        { id: 'fd3', timestamp: '6h ago', title: 'Temperature Control Alert', description: 'Fresh food display case temperature at 6°C - requires adjustment to 4°C.', category: 'Food Items', type: 'Compliance', status: 'Pending', projectedImpact: 'Food safety compliance' },
    ],
};

// ...rest of existing code...

// Updated Store Manager KPI Data for Postal Office
export const MOCK_STORE_MANAGER_KPI_DATA: Kpi[] = [
    { 
        title: 'Postal Service Efficiency', 
        value: '92%', 
        change: '↑ +2.1%', 
        insight: 'vs last week', 
        definition: '% of postal transactions completed within target time (under 3 minutes per customer).' 
    },
    { 
        title: 'Stock Availability Rate', 
        value: '85%', 
        change: '↓ -3.2%', 
        insight: 'Target: > 90%', 
        definition: '% of core products in stock during business hours.' 
    },
    { 
        title: 'Daily Revenue per Sq Ft', 
        value: '£12.4', 
        change: '↑ +1.8%', 
        insight: '7-day average', 
        definition: 'Revenue generated per square foot of retail space per day.' 
    },
    { 
        title: 'Customer Service Score', 
        value: '4.3/5', 
        change: '↑ +0.2', 
        insight: 'Monthly rating', 
        definition: 'Average customer satisfaction rating from postal service and retail transactions.' 
    },
];

// Updated Category Performance Data for Postal Office Categories
export const MOCK_CATEGORY_PERFORMANCE_DATA: Record<Category, CategoryPerformanceSummary> = {
    "All": { 
        totalSkus: 42, 
        avgShelfTurns: 18.5, 
        marginImpact: '+2.8%' 
    },
    "Postal Services": { 
        totalSkus: 6, 
        avgShelfTurns: 35.2, 
        marginImpact: '+8.1%' 
    },
    "Stationery & Office": { 
        totalSkus: 4, 
        avgShelfTurns: 22.3, 
        marginImpact: '+3.4%' 
    },
    "Cards & Gifts": { 
        totalSkus: 3, 
        avgShelfTurns: 8.7, 
        marginImpact: '+1.2%' 
    },
    "Tobacco & Smoking": { 
        totalSkus: 3, 
        avgShelfTurns: 28.9, 
        marginImpact: '+15.3%' 
    },
    "Confectionery & Snacks": { 
        totalSkus: 4, 
        avgShelfTurns: 45.6, 
        marginImpact: '+6.2%' 
    },
    "Beverages": { 
        totalSkus: 3, 
        avgShelfTurns: 52.1, 
        marginImpact: '+4.8%' 
    },
    "Health & Beauty": { 
        totalSkus: 3, 
        avgShelfTurns: 18.4, 
        marginImpact: '+2.9%' 
    },
    "Electronics & Accessories": { 
        totalSkus: 3, 
        avgShelfTurns: 12.7, 
        marginImpact: '+7.5%' 
    },
    "Automotive": { 
        totalSkus: 2, 
        avgShelfTurns: 4.2, 
        marginImpact: '-0.8%' 
    },
    "Publications": { 
        totalSkus: 2, 
        avgShelfTurns: 15.6, 
        marginImpact: '-1.2%' 
    },
    "Travel & Transport": { 
        totalSkus: 2, 
        avgShelfTurns: 68.3, 
        marginImpact: '+3.1%' 
    },
    "Food Items": { 
        totalSkus: 3, 
        avgShelfTurns: 28.7, 
        marginImpact: '+2.6%' 
    },
};


// Updated Store Layout Data for Postal Office/Convenience Store
export const MOCK_STORE_LAYOUT_DATA: HeatmapZoneData[] = [
    { 
      id: 'zone1', 
      name: 'Postal Counter', 
      engagement: 'high', 
      gridClass: 'col-start-1 col-span-4 row-start-1 row-span-1', 
      insights: { 
        topSku: '1st Class Stamps - 150 units/wk', 
        lowPerformer: 'Special Delivery - 8 units/wk', 
        layoutSuggestion: 'Place popular stamp books at eye level for faster service.', 
        aiRationale: 'High traffic area with queue formation - optimize for speed and efficiency.' 
      } 
    },
    { 
      id: 'zone2', 
      name: 'Confectionery & Snacks', 
      engagement: 'high', 
      gridClass: 'col-start-5 col-span-4 row-start-1 row-span-1', 
      insights: { 
        topSku: 'Mars Bar - 98 units/wk', 
        lowPerformer: 'Rice Cakes - 12 units/wk', 
        layoutSuggestion: 'Position chocolate bars near checkout for impulse purchases.', 
        aiRationale: 'High impulse category - proximity to payment area increases conversion.' 
      } 
    },
    { 
      id: 'zone3', 
      name: 'Beverages Cooler', 
      engagement: 'high', 
      gridClass: 'col-start-9 col-span-4 row-start-1 row-span-1', 
      insights: { 
        topSku: 'Coca Cola 500ml - 180 units/wk', 
        lowPerformer: 'Lemonade - 15 units/wk', 
        layoutSuggestion: 'Place energy drinks at eye level in cooler.', 
        aiRationale: 'Temperature-sensitive products with high margin potential.' 
      } 
    },
    { 
      id: 'zone4', 
      name: 'Tobacco Cabinet', 
      engagement: 'medium', 
      gridClass: 'col-start-1 col-span-4 row-start-2 row-span-1', 
      insights: { 
        topSku: 'Marlboro Gold - 120 units/wk', 
        lowPerformer: 'Pipe Tobacco - 3 units/wk', 
        layoutSuggestion: 'Maintain regulatory compliance with secure storage.', 
        aiRationale: 'Regulated category requiring controlled access and age verification.' 
      } 
    },
    { 
      id: 'zone5', 
      name: 'Health & Beauty', 
      engagement: 'medium', 
      gridClass: 'col-start-5 col-span-4 row-start-2 row-span-1', 
      insights: { 
        topSku: 'Paracetamol - 45 units/wk', 
        lowPerformer: 'Vitamins - 8 units/wk', 
        layoutSuggestion: 'Place hand sanitizer and tissues near entrance.', 
        aiRationale: 'Essential items with consistent demand - improve accessibility.' 
      } 
    },
    { 
      id: 'zone6', 
      name: 'Electronics & Accessories', 
      engagement: 'low', 
      gridClass: 'col-start-9 col-span-4 row-start-2 row-span-1', 
      insights: { 
        topSku: 'AA Batteries - 35 units/wk', 
        lowPerformer: 'Earbuds - 5 units/wk', 
        layoutSuggestion: 'Create tech essentials section with cables and batteries.', 
        aiRationale: 'Emergency purchase category - group related items together.' 
      } 
    },
    { 
      id: 'zone7', 
      name: 'Cards & Gifts', 
      engagement: 'low', 
      gridClass: 'col-start-1 col-span-4 row-start-3 row-span-1', 
      insights: { 
        topSku: 'Birthday Cards - 25 units/wk', 
        lowPerformer: 'Wedding Cards - 3 units/wk', 
        layoutSuggestion: 'Rotate seasonal cards to front of display.', 
        aiRationale: 'Occasion-driven purchases - seasonal optimization required.' 
      } 
    },
    { 
      id: 'zone8', 
      name: 'Stationery & Office', 
      engagement: 'medium', 
      gridClass: 'col-start-5 col-span-4 row-start-3 row-span-1', 
      insights: { 
        topSku: 'Biro Pens - 60 units/wk', 
        lowPerformer: 'Folders - 4 units/wk', 
        layoutSuggestion: 'Bundle pens with notebooks for back-to-school promotions.', 
        aiRationale: 'Seasonal demand patterns - optimize for student customer base.' 
      } 
    },
    { 
      id: 'zone9', 
      name: 'Food Items', 
      engagement: 'medium', 
      gridClass: 'col-start-9 col-span-4 row-start-3 row-span-1', 
      insights: { 
        topSku: 'Fresh Sandwiches - 40 units/wk', 
        lowPerformer: 'Soup Cans - 6 units/wk', 
        layoutSuggestion: 'Ensure temperature control for fresh items.', 
        aiRationale: 'Perishable category requiring careful stock rotation and temperature management.' 
      } 
    },
    { 
      id: 'zone10', 
      name: 'Publications', 
      engagement: 'low', 
      gridClass: 'col-start-1 col-span-4 row-start-4 row-span-1', 
      insights: { 
        topSku: 'The Sun - 30 units/wk', 
        lowPerformer: 'Trade Magazines - 2 units/wk', 
        layoutSuggestion: 'Focus on popular daily newspapers and weekly magazines.', 
        aiRationale: 'Declining category - optimize space allocation for better performing products.' 
      } 
    },
    { 
      id: 'zone11', 
      name: 'Travel & Transport', 
      engagement: 'high', 
      gridClass: 'col-start-5 col-span-4 row-start-4 row-span-1', 
      insights: { 
        topSku: 'Oyster Top-ups - 200 units/wk', 
        lowPerformer: 'Travel Insurance - 1 unit/wk', 
        layoutSuggestion: 'Promote transport services with clear signage.', 
        aiRationale: 'High-frequency service with excellent customer retention potential.' 
      } 
    },
    { 
      id: 'zone12', 
      name: 'Automotive', 
      engagement: 'low', 
      gridClass: 'col-start-9 col-span-4 row-start-4 row-span-1', 
      insights: { 
        topSku: 'Air Freshener - 12 units/wk', 
        lowPerformer: 'Engine Oil - 1 unit/wk', 
        layoutSuggestion: 'Consider reducing automotive space allocation.', 
        aiRationale: 'Low-performing category - space could be better utilized for higher-turnover products.' 
      } 
    },
    { 
      id: 'zone13', 
      name: 'CHECKOUT', 
      engagement: 'high', 
      gridClass: 'col-start-1 col-span-4 row-start-5 row-span-1 font-bold', 
      insights: { 
        topSku: 'Impulse Items', 
        lowPerformer: 'N/A', 
        layoutSuggestion: 'Optimize impulse purchase placement.', 
        aiRationale: 'Critical conversion area - maximize last-minute purchase opportunities.' 
      } 
    },
    { 
      id: 'zone14', 
      name: 'ENTRANCE', 
      engagement: 'medium', 
      gridClass: 'col-start-9 col-span-4 row-start-5 row-span-1 font-bold', 
      insights: { 
        topSku: 'N/A', 
        lowPerformer: 'N/A', 
        layoutSuggestion: 'Clear sightlines to postal counter and popular categories.', 
        aiRationale: 'First impression area - guide customers to high-value services and products.' 
      } 
    },
];


const aiOptimizedProducts = (products: Product[], category: Category): Product[] => {
  return products.map(product => ({
    ...product,
    // AI optimization: better stock levels, no alerts, improved positioning
    stock: Math.max(product.stock, product.minStock + 5),
    alert: undefined,
    rationale: `AI-optimized placement for ${product.name} based on sales velocity and customer behavior patterns.`
  }));
};

// Updated MOCK_PLANOGRAM_DATA to match new categories
export const MOCK_PLANOGRAM_DATA: Record<Category, { current: PlanogramData, ai: PlanogramData }> = {
  "All": {
    current: { 
      products: productDatabase["All"].slice(0, 20), // Limit for display
      complianceScore: 75 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["All"].slice(0, 20), "All"), 
      complianceScore: 100 
    },
  },

  "Postal Services": {
    current: { 
      products: productDatabase["Postal Services"].map(p => ({
        ...p,
        alert: p.stock <= p.minStock ? 'EMPTY_SHELF' : undefined,
        rationale: p.stock <= p.minStock ? 'Below minimum stock threshold' : undefined
      })), 
      complianceScore: 68 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Postal Services"], "Postal Services"), 
      complianceScore: 100 
    },
  },

  "Stationery & Office": {
    current: { 
      products: productDatabase["Stationery & Office"], 
      complianceScore: 82 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Stationery & Office"], "Stationery & Office"), 
      complianceScore: 100 
    },
  },

  "Cards & Gifts": {
    current: { 
      products: productDatabase["Cards & Gifts"], 
      complianceScore: 78 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Cards & Gifts"], "Cards & Gifts"), 
      complianceScore: 100 
    },
  },

  "Tobacco & Smoking": {
    current: { 
      products: productDatabase["Tobacco & Smoking"], 
      complianceScore: 95 // High compliance due to regulations
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Tobacco & Smoking"], "Tobacco & Smoking"), 
      complianceScore: 100 
    },
  },

  "Confectionery & Snacks": {
    current: { 
      products: productDatabase["Confectionery & Snacks"].map(p => ({
        ...p,
        alert: p.id === 'cs3' ? 'WRONG_LOCATION' : undefined,
        rationale: p.id === 'cs3' ? 'Should be positioned closer to checkout for impulse purchases' : undefined
      })), 
      complianceScore: 72 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Confectionery & Snacks"], "Confectionery & Snacks"), 
      complianceScore: 100 
    },
  },

  "Beverages": {
    current: { 
      products: productDatabase["Beverages"].map(p => ({
        ...p,
        alert: p.id === 'bv1' ? 'WRONG_LOCATION' : undefined,
        rationale: p.id === 'bv1' ? 'High-demand item should be at eye level in cooler' : undefined
      })), 
      complianceScore: 65 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Beverages"], "Beverages"), 
      complianceScore: 100 
    },
  },

  "Health & Beauty": {
    current: { 
      products: productDatabase["Health & Beauty"].map(p => ({
        ...p,
        alert: p.stock <= p.minStock ? 'EMPTY_SHELF' : undefined,
        rationale: p.stock <= p.minStock ? 'Critical shortage - immediate restocking required' : undefined
      })), 
      complianceScore: 58 // Low due to stock issues
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Health & Beauty"], "Health & Beauty"), 
      complianceScore: 100 
    },
  },

  "Electronics & Accessories": {
    current: { 
      products: productDatabase["Electronics & Accessories"].map(p => ({
        ...p,
        alert: p.stock <= p.minStock ? 'EMPTY_SHELF' : undefined,
        rationale: p.stock <= p.minStock ? 'High-demand electronics out of stock' : undefined
      })), 
      complianceScore: 45 // Very low due to USB-C cable shortage
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Electronics & Accessories"], "Electronics & Accessories"), 
      complianceScore: 100 
    },
  },

  "Automotive": {
    current: { 
      products: productDatabase["Automotive"], 
      complianceScore: 85 // Good compliance, low turnover category
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Automotive"], "Automotive"), 
      complianceScore: 100 
    },
  },

  "Publications": {
    current: { 
      products: productDatabase["Publications"], 
      complianceScore: 90 // Good compliance, stable category
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Publications"], "Publications"), 
      complianceScore: 100 
    },
  },

  "Travel & Transport": {
    current: { 
      products: productDatabase["Travel & Transport"], 
      complianceScore: 88 // Good compliance
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Travel & Transport"], "Travel & Transport"), 
      complianceScore: 100 
    },
  },

  "Food Items": {
    current: { 
      products: productDatabase["Food Items"].map(p => ({
        ...p,
        alert: p.id === 'fd1' ? 'WRONG_LOCATION' : undefined,
        rationale: p.id === 'fd1' ? 'Fresh items should be in temperature-controlled display' : undefined
      })), 
      complianceScore: 70 
    },
    ai: { 
      products: aiOptimizedProducts(productDatabase["Food Items"], "Food Items"), 
      complianceScore: 100 
    },
  },
};

// --- For Shelfie Modal ---
const SHELFIE_SCENARIO_GOOD: ShelfieAnalysisResult = {
  complianceScore: 92,
  summary: {
    correct: 11,
    misplaced: 0,
    low: 1,
    empty: 0,
    totalExpectedSkus: 12,
    facingIssues: 1,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: '1st Class Stamps', tooltip: '✔ Correct placement' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 5, width: 20, height: 28 }, label: '2nd Class Stamps', tooltip: '✔ Correct placement' },
    { id: 'c3', type: 'correct', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Large Letter Stamps', tooltip: '✔ Correct placement' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Recorded Delivery', tooltip: '✔ Correct placement' },
    { id: 'c5', type: 'correct', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Mars Bar', tooltip: '✔ Correct placement' },
    { id: 'c6', type: 'correct', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Snickers', tooltip: '✔ Correct placement' },
    { id: 'c7', type: 'correct', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Haribo Starmix', tooltip: '✔ Correct placement' },
    { id: 'c8', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Walkers Crisps', tooltip: '✔ Correct placement' },
    { id: 'c9', type: 'correct', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Coca Cola', tooltip: '✔ Correct placement' },
    { id: 'l1', type: 'low', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Paracetamol', tooltip: 'Low Stock: Est. 3 units remaining.' },
    { id: 'c10', type: 'correct', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'AA Batteries', tooltip: '✔ Correct placement. Minor facing issue.' },
    { id: 'c11', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'USB-C Cable', tooltip: '✔ Correct placement' },
  ],
};

const SHELFIE_SCENARIO_MODERATE: ShelfieAnalysisResult = {
  complianceScore: 67,
  summary: {
    correct: 8,
    misplaced: 2,
    low: 1,
    empty: 1,
    totalExpectedSkus: 12,
    facingIssues: 2,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: '1st Class Stamps', tooltip: '✔ Correct placement' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 5, width: 20, height: 28 }, label: '2nd Class Stamps', tooltip: '✔ Correct placement' },
    { id: 'c3', type: 'correct', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Large Letter Stamps', tooltip: '✔ Correct placement. Facing is obstructed.' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Recorded Delivery', tooltip: '✔ Correct placement' },
    { id: 'm1', type: 'misplaced', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Tissues Pack', tooltip: 'Misplaced: Should be in Health & Beauty section.' },
    { id: 'm2', type: 'misplaced', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Birthday Card', tooltip: 'Misplaced: Should be in Cards & Gifts display.' },
    { id: 'c5', type: 'correct', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Mars Bar', tooltip: '✔ Correct placement' },
    { id: 'c6', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Snickers', tooltip: '✔ Correct placement' },
    { id: 'e1', type: 'empty', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Haribo Starmix out of stock.' },
    { id: 'c7', type: 'correct', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Walkers Crisps', tooltip: '✔ Correct placement. Facing is angled.' },
    { id: 'l1', type: 'low', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'Coca Cola', tooltip: 'Low Stock: Est. 4 bottles remaining.' },
    { id: 'c8', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'Water Bottles', tooltip: '✔ Correct placement' },
  ],
};

const SHELFIE_SCENARIO_POOR: ShelfieAnalysisResult = {
  complianceScore: 33,
  summary: {
    correct: 4,
    misplaced: 3,
    low: 2,
    empty: 3,
    totalExpectedSkus: 12,
    facingIssues: 4,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: '1st Class Stamps', tooltip: '✔ Correct placement. Facing is obstructed.' },
    { id: 'm1', type: 'misplaced', box: { x: 28, y: 5, width: 20, height: 28 }, label: 'Biro Pens', tooltip: 'Misplaced: Should be in Stationery section.' },
    { id: 'e1', type: 'empty', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: 2nd Class Stamps out of stock.' },
    { id: 'l1', type: 'low', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Large Letter Stamps', tooltip: 'Low Stock: Est. 2 books remaining.' },
    { id: 'm2', type: 'misplaced', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Hand Sanitizer', tooltip: 'Misplaced: Should be in Health & Beauty section.' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Mars Bar', tooltip: '✔ Correct placement. Facing is reversed.' },
    { id: 'e2', type: 'empty', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Snickers out of stock.' },
    { id: 'c3', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Haribo Starmix', tooltip: '✔ Correct placement' },
    { id: 'm3', type: 'misplaced', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Car Air Freshener', tooltip: 'Misplaced: Should be in Automotive section. Facing is angled.' },
    { id: 'l2', type: 'low', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Walkers Crisps', tooltip: 'Low Stock: Est. 3 packs remaining. Facing is angled.' },
    { id: 'e3', type: 'empty', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Coca Cola out of stock.' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'Water Bottles', tooltip: '✔ Correct placement' },
  ],
};

export const MOCK_SHELFIE_SCENARIOS = [
    SHELFIE_SCENARIO_GOOD,
    SHELFIE_SCENARIO_MODERATE,
    SHELFIE_SCENARIO_POOR,
];

// Daily Digest Data (updated with new categories)
export const MOCK_DAILY_DIGEST_DATA: DailyDigestData = {
  date: "Today, November 4th",
  summary: {
    totalTasks: 12,
    completedTasks: 8,
    urgentIssues: 2,
    revenueToday: 1847.32
  },
  tasks: [
    {
      id: "dt1",
      title: "Restock postal supplies",
      category: "Postal Services",
      priority: "high",
      status: "completed",
      time: "09:15"
    },
    {
      id: "dt2", 
      title: "Check confectionery expiry dates",
      category: "Confectionery & Snacks",
      priority: "medium",
      status: "pending",
      time: "11:30"
    },
    {
      id: "dt3",
      title: "Refill beverage cooler",
      category: "Beverages", 
      priority: "high",
      status: "in-progress",
      time: "13:00"
    }
  ],
  urgentIssues: [
    {
      id: "ui1",
      title: "Low Stock Alert",
      description: "USB-C cables completely out of stock",
      category: "Electronics & Accessories",
      severity: "high",
      time: "14:32"
    },
    {
      id: "ui2",
      title: "Food Safety Check",
      description: "Fresh sandwiches require immediate expiry check", 
      category: "Food Items",
      severity: "critical",
      time: "15:45"
    }
  ]
};

export const MOCK_OPS_DAILY_DIGEST_DATA: DailyDigestData = {
  date: "Today, November 4th",
  summary: {
    totalTasks: 18,
    completedTasks: 12,
    urgentIssues: 3,
    revenueToday: 1847.32
  },
  tasks: [
    {
      id: "odt1",
      title: "Analyze cross-category performance",
      category: "All",
      priority: "medium",
      status: "completed", 
      time: "08:00"
    },
    {
      id: "odt2",
      title: "Review postal service metrics",
      category: "Postal Services",
      priority: "high",
      status: "in-progress",
      time: "10:30"
    },
    {
      id: "odt3",
      title: "Optimize tobacco security protocols",
      category: "Tobacco & Smoking",
      priority: "high",
      status: "pending",
      time: "14:00"
    }
  ],
  urgentIssues: [
    {
      id: "oui1",
      title: "Critical Stock Shortage",
      description: "Multiple health products below safety stock levels",
      category: "Health & Beauty", 
      severity: "critical",
      time: "13:22"
    },
    {
      id: "oui2",
      title: "System Performance Alert",
      description: "POS system response times degraded",
      category: "All",
      severity: "high", 
      time: "15:18"
    },
    {
      id: "oui3",
      title: "Compliance Audit Required",
      description: "Tobacco age verification log incomplete",
      category: "Tobacco & Smoking",
      severity: "medium",
      time: "16:05"
    }
  ]
};

// Export all the updated constants
export { productDatabase, currentProductsMapping };