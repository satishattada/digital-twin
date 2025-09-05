import { Category, Kpi, Recommendation, Insight, PlanogramData, Product, Task, ShelfZone, InventoryMovementData, OpsAlert, OpsKpi, PurchaseOrder, Supplier, OpsInsight, CategoryPerformanceSummary, OpsData, InventorySuggestion, SpaceUtilizationData, SpaceUtilizationZone, SpaceUtilizationSuggestion, HeatmapZoneData, DailyTask, UrgentIssue, DailyDigestData, ShelfieAnalysisResult } from './types';

// Use a real image placeholder service to get more realistic product pictures.
// The lock parameter helps in getting a consistent image for the same product.
const createImage = (keywords: string, id: string) => `https://loremflickr.com/100/100/${encodeURIComponent(keywords)}/all?lock=${id}`;

const productDatabase: Record<Category, Product[]> = {
    Dairy: [
        { id: 'd1', name: 'Fresh Milk', brand: 'Farmhouse', imageUrl: createImage('milk carton', 'd1') },
        { id: 'd2', name: 'Cheddar Cheese', brand: 'Kraft', imageUrl: createImage('cheddar cheese', 'd2') },
        { id: 'd3', name: 'Greek Yogurt', brand: 'Chobani', imageUrl: createImage('yogurt cup', 'd3') },
        { id: 'd4', name: 'Unsalted Butter', brand: 'Lurpak', imageUrl: createImage('butter block', 'd4') },
        { id: 'd5', name: 'Soy Milk', brand: 'Vitasoy', imageUrl: createImage('soy milk', 'd5') },
        { id: 'd6', name: 'Probiotic Drink', brand: 'Yakult', imageUrl: createImage('probiotic drink', 'd6'), alert: 'WRONG_LOCATION', rationale: 'Misplaced item. Move near yogurts to align with shopper behavior.' },
        { id: 'd7', name: 'Eggs (12-pack)', brand: 'Chew\'s', imageUrl: createImage('egg carton', 'd7') },
        { id: 'd8', name: 'Cream Cheese', brand: 'Philadelphia', imageUrl: createImage('cream cheese', 'd8') },
        { id: 'd9', name: 'Cottage Cheese', brand: 'Bullafarm', imageUrl: createImage('cottage cheese', 'd9') },
        { id: 'd10', name: 'Sour Cream', brand: 'Emborg', imageUrl: createImage('sour cream', 'd10') },
        { id: 'd11', name: 'Margarine', brand: 'Planta', imageUrl: createImage('margarine tub', 'd11') },
        { id: 'd12', name: 'Kefir', brand: 'Babushka', imageUrl: createImage('kefir bottle', 'd12') },
    ],
    Snacks: [
        { id: 's1', name: 'Potato Chips (Lays)', brand: 'Lays', imageUrl: createImage('potato chips bag', 's1') },
        { id: 's2', name: 'Chocolate Bar (Cadbury)', brand: 'Cadbury', imageUrl: createImage('chocolate bar', 's2') },
        { id: 's3', name: 'Seaweed (Tao Kae Noi)', brand: 'Tao Kae Noi', imageUrl: createImage('seaweed snack', 's3') },
        { id: 's4', name: 'Oatmeal Cookies', brand: 'Quaker', imageUrl: createImage('oatmeal cookies', 's4') },
        { id: 's5', name: 'Empty Slot', brand: 'Empty', imageUrl: createImage('empty shelf', 's5'), alert: 'EMPTY_SHELF', rationale: 'Out of stock. Urgent restock needed to prevent lost sales.' },
        { id: 's6', name: 'Gummy Bears', brand: 'Haribo', imageUrl: createImage('gummy bears', 's6') },
        { id: 's7', name: 'Popcorn', brand: 'Garrett', imageUrl: createImage('popcorn bag', 's7') },
        { id: 's8', name: 'Wafer Biscuits', brand: 'Loacker', imageUrl: createImage('wafer biscuit', 's8') },
        { id: 's9', name: 'Mixed Nuts', brand: 'Camel', imageUrl: createImage('mixed nuts', 's9') },
        { id: 's10', name: 'Pretzels', brand: 'Snyder\'s', imageUrl: createImage('pretzels', 's10') },
        { id: 's11', name: 'Crackers', brand: 'Ritz', imageUrl: createImage('crackers box', 's11') },
        { id: 's12', name: 'Rice Cakes', brand: 'Goodrice', imageUrl: createImage('rice cakes', 's12') },
        { id: 's13', name: 'Potato Chips (Ruffles)', brand: 'Ruffles', imageUrl: createImage('potato chips ruffles', 's13') },
    ],
    Beverages: [
        { id: 'b1', name: 'Cola', brand: 'Coca-Cola', imageUrl: createImage('cola can', 'b1') },
        { id: 'b2', name: 'Green Tea', brand: 'Pokka', imageUrl: createImage('green tea bottle', 'b2') },
        { id: 'b3', name: 'Orange Juice', brand: 'Sunkist', imageUrl: createImage('orange juice carton', 'b3') },
        { id: 'b4', name: 'Mineral Water', brand: 'Evian', imageUrl: createImage('water bottle', 'b4') },
        { id: 'b5', name: 'Empty Slot', brand: 'Empty', imageUrl: createImage('empty shelf', 'b5'), alert: 'EMPTY_SHELF', rationale: 'Out of stock. Urgent restock needed to prevent lost sales.' },
        { id: 'b6', name: 'Empty Slot', brand: 'Empty', imageUrl: createImage('empty shelf', 'b6'), alert: 'EMPTY_SHELF', rationale: 'Out of stock. Urgent restock needed to prevent lost sales.' },
        { id: 'b7', name: 'Energy Drink', brand: 'Red Bull', imageUrl: createImage('energy drink can', 'b7') },
        { id: 'b8', name: 'Iced Coffee', brand: 'Starbucks', imageUrl: createImage('iced coffee bottle', 'b8') },
        { id: 'b9', name: 'Soy Milk', brand: 'Vitasoy', imageUrl: createImage('soy milk carton', 'b9') },
        { id: 'b10', name: 'Coconut Water', brand: 'Vita Coco', imageUrl: createImage('coconut water', 'b10') },
        { id: 'b11', name: 'Root Beer', brand: 'A&W', imageUrl: createImage('root beer can', 'b11') },
        { id: 'b12', name: 'Apple Juice', brand: 'Marigold', imageUrl: createImage('apple juice', 'b12') },
        { id: 'b13', name: 'Sports Drink', brand: 'Gatorade', imageUrl: createImage('sports drink', 'b13') },
    ],
    'Fresh Produce': [
        { id: 'fp1', name: 'Red Apples', brand: 'Generic', imageUrl: createImage('red apples', 'fp1') },
        { id: 'fp2', name: 'Bananas', brand: 'Generic', imageUrl: createImage('bananas', 'fp2') },
        { id: 'fp3', name: 'Broccoli', brand: 'Generic', imageUrl: createImage('broccoli', 'fp3') },
        { id: 'fp4', name: 'Cherry Tomatoes', brand: 'Generic', imageUrl: createImage('cherry tomatoes', 'fp4') },
        { id: 'fp5', name: 'Lettuce', brand: 'Generic', imageUrl: createImage('lettuce', 'fp5') },
        { id: 'fp6', name: 'Carrots', brand: 'Generic', imageUrl: createImage('carrots', 'fp6') },
        { id: 'fp7', name: 'Avocado', brand: 'Generic', imageUrl: createImage('avocado', 'fp7') },
        { id: 'fp8', name: 'Strawberries', brand: 'Generic', imageUrl: createImage('strawberries', 'fp8') },
        { id: 'fp9', name: 'Bell Peppers', brand: 'Generic', imageUrl: createImage('bell peppers', 'fp9') },
        { id: 'fp10', name: 'Cucumbers', brand: 'Generic', imageUrl: createImage('cucumbers', 'fp10') },
        { id: 'fp11', name: 'Mushrooms', brand: 'Generic', imageUrl: createImage('mushrooms', 'fp11') },
        { id: 'fp12', name: 'Garlic', brand: 'Generic', imageUrl: createImage('garlic', 'fp12') },
    ],
    Household: [
        { id: 'h1', name: 'Dish Soap', brand: 'Mama Lemon', imageUrl: createImage('dish soap', 'h1') },
        { id: 'h2', name: 'Laundry Detergent', brand: 'Breeze', imageUrl: createImage('laundry detergent', 'h2') },
        { id: 'h3', name: 'Paper Towels', brand: 'Scott', imageUrl: createImage('paper towels', 'h3') },
        { id: 'h4', name: 'Bleach', brand: 'Clorox', imageUrl: createImage('bleach bottle', 'h4'), alert: 'WRONG_LOCATION', rationale: 'Safety hazard. Move to household chemicals section.' },
        { id: 'h5', name: 'Trash Bags', brand: 'Glad', imageUrl: createImage('trash bags', 'h5') },
        { id: 'h6', name: 'Sponges', brand: '3M', imageUrl: createImage('kitchen sponge', 'h6') },
        { id: 'h7', name: 'All-Purpose Cleaner', brand: 'Dettol', imageUrl: createImage('cleaner spray', 'h7') },
        { id: 'h8', 'name': 'Tissues', brand: 'Kleenex', imageUrl: createImage('tissue box', 'h8') },
        { id: 'h9', name: 'Fabric Softener', brand: 'Downy', imageUrl: createImage('fabric softener', 'h9') },
        { id: 'h10', name: 'Toilet Cleaner', brand: 'Harpic', imageUrl: createImage('toilet cleaner', 'h10') },
        { id: 'h11', name: 'Glass Cleaner', brand: 'Windex', imageUrl: createImage('glass cleaner', 'h11') },
        { id: 'h12', name: 'Air Freshener', brand: 'Glade', imageUrl: createImage('air freshener', 'h12') },
    ]
};

const newSnacksCurrentProducts: Product[] = [
    productDatabase.Snacks.find(p => p.id === 's12')!, // Rice Cakes (Goodrice)
    { ...productDatabase.Snacks.find(p => p.id === 's6')!, alert: 'WRONG_LOCATION', rationale: 'Misplaced: Should be in the candy section for better category grouping.' }, // Gummy Bears (Haribo)
    productDatabase.Snacks.find(p => p.id === 's3')!, // Seaweed (Tao Kae Noi)
    productDatabase.Snacks.find(p => p.id === 's4')!, // Oatmeal Cookies (Quaker)
    productDatabase.Snacks.find(p => p.id === 's1')!, // Potato Chips (Lays)
    productDatabase.Snacks.find(p => p.id === 's13')!,// Potato Chips (Ruffles)
    productDatabase.Snacks.find(p => p.id === 's7')!, // Popcorn (Garrett)
    productDatabase.Snacks.find(p => p.id === 's10')!,// Pretzels (Snyder's)
    productDatabase.Snacks.find(p => p.id === 's2')!, // Chocolate Bar (Cadbury)
    productDatabase.Snacks.find(p => p.id === 's8')!, // Wafer Biscuits (Loacker)
    productDatabase.Snacks.find(p => p.id === 's11')!,// Crackers (Ritz)
    productDatabase.Snacks.find(p => p.id === 's9')!, // Mixed Nuts (Camel)
];

const newSnacksAiProducts: Product[] = [
    { ...productDatabase.Snacks.find(p => p.id === 's12')!, rationale: 'Moved due to low margin. Grouped with other healthy snacks for better visibility.' },
    { ...productDatabase.Snacks.find(p => p.id === 's9')!, rationale: 'Shifted for eye-level targeting. Anchors the healthy snacks section.' },
    productDatabase.Snacks.find(p => p.id === 's3')!,
    productDatabase.Snacks.find(p => p.id === 's4')!,
    productDatabase.Snacks.find(p => p.id === 's1')!,
    productDatabase.Snacks.find(p => p.id === 's13')!,
    productDatabase.Snacks.find(p => p.id === 's7')!,
    productDatabase.Snacks.find(p => p.id === 's10')!,
    productDatabase.Snacks.find(p => p.id === 's2')!,
    productDatabase.Snacks.find(p => p.id === 's8')!,
    productDatabase.Snacks.find(p => p.id === 's11')!,
    { ...productDatabase.Snacks.find(p => p.id === 's6')!, rationale: 'Positioned at end of aisle to capture impulse buys based on foot traffic data.' },
];

const newBeveragesAiProducts: Product[] = [
    { ...productDatabase.Beverages.find(p => p.id === 'b4')!, rationale: 'High-demand item, moved to eye-level for better visibility.' },
    productDatabase.Beverages.find(p => p.id === 'b2')!,
    productDatabase.Beverages.find(p => p.id === 'b3')!,
    productDatabase.Beverages.find(p => p.id === 'b12')!,
    productDatabase.Beverages.find(p => p.id === 'b1')!,
    productDatabase.Beverages.find(p => p.id === 'b7')!,
    { ...productDatabase.Beverages.find(p => p.id === 'b8')!, rationale: 'Iced Coffee replaced with Empty Slot to evaluate adjacent product performance.'},
    productDatabase.Beverages.find(p => p.id === 'b11')!,
    productDatabase.Beverages.find(p => p.id === 'b9')!,
    productDatabase.Beverages.find(p => p.id === 'b10')!,
    productDatabase.Beverages.find(p => p.id === 'b13')!,
    { id: 'b5-empty', name: 'Empty Slot', brand: 'Empty', imageUrl: createImage('empty shelf', 'b5'), rationale: 'Slot intentionally left empty to evaluate adjacent product performance.'},
];


const aiOptimizedProducts = (products: Product[], category: Category): Product[] => {
    let optimized = JSON.parse(JSON.stringify(products));

    optimized.forEach((p: Product) => {
        p.alert = undefined;
        // Add rationale for AI moves
        if (p.id === 'd5') p.rationale = "Swapped to correct misplacement of Probiotic Drink.";
        if (p.id === 'd6') p.rationale = "Moved to be adjacent to similar yogurt products.";
        if (p.id === 'h3') p.rationale = "Swapped to move Bleach to a safer location.";
        if (p.id === 'h4') p.rationale = "Moved to household chemicals section for safety and compliance.";
    });

    const fillers: Partial<Record<Category, Product[]>> = {
        Beverages: [
            productDatabase.Beverages.find(p => p.id === 'b8')!,
            productDatabase.Beverages.find(p => p.id === 'b10')!,
        ],
    };

    const categoryFillers = fillers[category] || [];
    let fillerIndex = 0;
    
    optimized = optimized.map((p: Product) => {
        if (p.name === 'Empty Slot') {
            const filler = categoryFillers[fillerIndex % categoryFillers.length];
            fillerIndex++;
            return {
                ...filler,
                id: `${p.id}-ai-filled`,
                rationale: 'Filled empty slot with a high-velocity product to prevent sales loss.'
            };
        }
        return p;
    });

    if (category === 'Dairy') {
        const d5Index = optimized.findIndex((p: Product) => p.id === 'd5');
        const d6Index = optimized.findIndex((p: Product) => p.id === 'd6');
        if (d5Index !== -1 && d6Index !== -1) {
            [optimized[d5Index], optimized[d6Index]] = [optimized[d6Index], optimized[d5Index]];
        }
    }
    if (category === 'Household') {
        const h3Index = optimized.findIndex((p: Product) => p.id === 'h3');
        const h4Index = optimized.findIndex((p: Product) => p.id === 'h4');
        if (h3Index !== -1 && h4Index !== -1) {
            [optimized[h3Index], optimized[h4Index]] = [optimized[h4Index], optimized[h3Index]];
        }
    }

    return optimized;
};

export const MOCK_PLANOGRAM_DATA: Record<Category, { current: PlanogramData, ai: PlanogramData }> = {
    Dairy: {
        current: { products: productDatabase.Dairy, complianceScore: 82 },
        ai: { products: aiOptimizedProducts(productDatabase.Dairy, 'Dairy'), complianceScore: 100 },
    },
    Snacks: {
        current: { products: newSnacksCurrentProducts, complianceScore: 78 },
        ai: { products: newSnacksAiProducts, complianceScore: 100 },
    },
    Beverages: {
        current: { products: productDatabase.Beverages, complianceScore: 65 },
        ai: { products: newBeveragesAiProducts, complianceScore: 100 },
    },
    'Fresh Produce': {
        current: { products: productDatabase['Fresh Produce'], complianceScore: 95 },
        ai: { products: aiOptimizedProducts(productDatabase['Fresh Produce'], 'Fresh Produce'), complianceScore: 100 },
    },
    Household: {
        current: { products: productDatabase.Household, complianceScore: 70 },
        ai: { products: aiOptimizedProducts(productDatabase.Household, 'Household'), complianceScore: 100 },
    },
};

export const MOCK_KPI_DATA: Record<Category, Kpi[]> = {
    Dairy: [
        { title: 'Sales vs. Forecast', value: '+5.2%', change: '↑', insight: 'Exceeding expectations this week.' },
        { title: 'Out of Stock %', value: '3.1%', change: '↓', insight: 'Reduced from 4.5% last week.' },
    ],
    Snacks: [
        { title: 'Sales vs. Forecast', value: '-2.1%', change: '↓', insight: 'Below forecast, check promotions.' },
        { title: 'Out of Stock %', value: '8.5%', change: '↑', insight: 'High OOS rate affecting sales.' },
    ],
    Beverages: [
        { title: 'Sales vs. Forecast', value: '+8.0%', change: '↑', insight: 'Strong performance, especially water.' },
        { title: 'Out of Stock %', value: '12.2%', change: '↑', insight: 'Critical OOS issue on bestsellers.' },
    ],
    'Fresh Produce': [
        { title: 'Sales vs. Forecast', value: '+1.5%', change: '↑', insight: 'Stable growth.' },
        { title: 'Out of Stock %', value: '1.8%', change: '↓', insight: 'Good availability.' },
    ],
    Household: [
        { title: 'Sales vs. Forecast', value: '-0.5%', change: '↓', insight: 'Slightly below expectations.' },
        { title: 'Out of Stock %', value: '2.5%', change: '↓', insight: 'Improved from last week.' },
    ],
};

// For Store Manager KPI Panel
export const MOCK_STORE_MANAGER_KPI_DATA: Kpi[] = [
    { title: 'Planogram Compliance', value: '88%', change: '↑ +1.2%', insight: 'vs last week', definition: '% of shelf zones aligned with recommended layout.' },
    { title: 'Shelf Restocking Freq.', value: '2.4/day', change: '↓ -0.5%', insight: 'Target: < 2.0', definition: 'Average number of times a shelf is restocked per day.' },
    { title: 'AI-driven Sales Uplift', value: '$1.2K', change: '↑ +3.5%', insight: '7-day rolling', definition: 'Estimated sales increase from implementing AI recommendations.' },
    { title: 'Avg. Layout Change Time', value: '45 min', change: '↓ -5 min', insight: 'Target: < 40 min', definition: 'Average time taken to implement layout changes suggested by AI.' },
];


export const MOCK_CATEGORY_PERFORMANCE_DATA: Record<Category, CategoryPerformanceSummary> = {
    Dairy: { totalSkus: 45, avgShelfTurns: 12.5, marginImpact: '+2.1%' },
    Snacks: { totalSkus: 120, avgShelfTurns: 25.2, marginImpact: '+4.5%' },
    Beverages: { totalSkus: 80, avgShelfTurns: 30.1, marginImpact: '+5.2%' },
    'Fresh Produce': { totalSkus: 60, avgShelfTurns: 40.5, marginImpact: '+1.8%' },
    Household: { totalSkus: 95, avgShelfTurns: 8.9, marginImpact: '-0.5%' },
};

export const initialRecommendations: Recommendation[] = [
  {
    id: 1,
    category: 'Dairy',
    sku: 'D-001-P',
    productName: 'Fresh Milk',
    shelfCapacity: 50,
    forecastedDemand: 120,
    skuVelocity: 'Fast-moving',
    currentStock: 10,
    suggestedReorderQty: 110,
    maxShelfCapacity: 60,
    expectedSellThrough: 95,
    reason: 'High turnover + upcoming regional event may cause stockout.'
  },
  {
    id: 2,
    category: 'Dairy',
    sku: 'D-003-Y',
    productName: 'Greek Yogurt',
    shelfCapacity: 80,
    forecastedDemand: 60,
    skuVelocity: 'Slow-moving',
    currentStock: 55,
    suggestedReorderQty: 25,
    maxShelfCapacity: 80,
    expectedSellThrough: 70,
    reason: 'Seasonal dip detected; adjust reorder to avoid overstock.'
  },
  {
    id: 11,
    category: 'Snacks',
    productName: 'Potato Chips (Lays)',
    sku: 'S-001',
    skuVelocity: 'Fast-moving',
    currentStock: 8,
    suggestedReorderQty: 72,
    expectedSellThrough: 92,
    maxShelfCapacity: 40,
    forecastedDemand: 80,
    shelfCapacity: 40,
    reason: 'High velocity and forecasted demand indicate a restock is needed to avoid stockout.'
  },
  {
    id: 12,
    category: 'Snacks',
    productName: 'Chocolate Bar (Cadbury)',
    sku: 'S-002',
    skuVelocity: 'Fast-moving',
    currentStock: 12,
    suggestedReorderQty: 48,
    expectedSellThrough: 88,
    maxShelfCapacity: 50,
    forecastedDemand: 60,
    shelfCapacity: 50,
    reason: 'Consistent sales and fast-moving status require maintaining stock levels.'
  },
  {
    id: 13,
    category: 'Snacks',
    productName: 'Potato Chips (Ruffles)',
    sku: 'S-13',
    skuVelocity: 'Fast-moving',
    currentStock: 5,
    suggestedReorderQty: 72,
    expectedSellThrough: 90,
    maxShelfCapacity: 40,
    forecastedDemand: 70,
    shelfCapacity: 40,
    reason: 'Stock is critically low for a fast-moving item with high demand.'
  },
  {
    id: 14,
    category: 'Snacks',
    productName: 'Seaweed (Tao Kae Noi)',
    sku: 'S-003',
    skuVelocity: 'Slow-moving',
    currentStock: 10,
    suggestedReorderQty: 24,
    expectedSellThrough: 75,
    maxShelfCapacity: 30,
    forecastedDemand: 25,
    shelfCapacity: 30,
    reason: 'Slow-moving but approaching reorder point. Moderate restock recommended.'
  },
  {
    id: 4,
    category: 'Beverages',
    sku: 'B-001-C',
    productName: 'Cola',
    shelfCapacity: 150,
    forecastedDemand: 400,
    skuVelocity: 'Fast-moving',
    currentStock: 30,
    suggestedReorderQty: 370,
    maxShelfCapacity: 150,
    expectedSellThrough: 99,
    reason: 'Heatwave forecast for the next 7 days will spike demand.'
  },
  {
    id: 5,
    category: 'Beverages',
    sku: 'B-002-T',
    productName: 'Green Tea',
    shelfCapacity: 100,
    forecastedDemand: 80,
    skuVelocity: 'Slow-moving',
    currentStock: 90,
    suggestedReorderQty: 0,
    maxShelfCapacity: 100,
    expectedSellThrough: 60,
    reason: 'Current stock is sufficient for forecasted demand. No reorder needed.'
  },
  {
    id: 9,
    category: 'Beverages',
    sku: 'B-007-ED',
    productName: 'Energy Drink',
    shelfCapacity: 100,
    forecastedDemand: 180,
    skuVelocity: 'Fast-moving',
    currentStock: 15,
    suggestedReorderQty: 165,
    maxShelfCapacity: 100,
    expectedSellThrough: 96,
    reason: 'Local sports event this weekend is expected to drive high demand for energy drinks.'
  },
  {
    id: 10,
    category: 'Beverages',
    sku: 'B-010-CW',
    productName: 'Coconut Water',
    shelfCapacity: 60,
    forecastedDemand: 90,
    skuVelocity: 'Fast-moving',
    currentStock: 5,
    suggestedReorderQty: 85,
    maxShelfCapacity: 60,
    expectedSellThrough: 92,
    reason: 'Influencer promotion for this brand detected. High risk of stockout if not restocked immediately.'
  }
];

export const MOCK_INSIGHTS_DATA: Record<Category, Insight[]> = {
    Dairy: [
        { id: 'i1', timestamp: '2h ago', title: 'Stock Gap Risk: Milk', description: 'Fresh Milk stock is at 15%, may run out in 3 hours.', category: 'Dairy', type: 'Inventory', status: 'Urgent', projectedImpact: '-$250 sales risk' },
        { id: 'i2', timestamp: '1d ago', title: 'Low Compliance Score', description: 'Dairy planogram compliance dropped to 75%.', category: 'Dairy', type: 'Compliance', status: 'Pending', projectedImpact: '-3% category sales' },
    ],
    Snacks: [
        { id: 's1', timestamp: '5m ago', title: 'Footfall up 12% in Snacks', description: 'Unusual traffic spike detected near chip aisle.', category: 'Snacks', type: 'Layout', status: 'Urgent', projectedImpact: '+$500 opportunity' },
        { id: 's2', timestamp: '8h ago', title: 'Low Stock: Salty Snacks', description: 'Top-selling potato chips are running low.', category: 'Snacks', type: 'Inventory', status: 'Pending', projectedImpact: '-$300 sales risk' },
        { id: 's3', timestamp: '2d ago', title: 'Promo Ended', description: 'Chocolate bar promotion has ended. Revert pricing.', category: 'Snacks', type: 'Sales', status: 'Resolved', projectedImpact: 'Price accuracy maintained' },
    ],
    Beverages: [
        { id: 'b1', timestamp: '1h ago', title: 'Empty Shelf: Water', description: 'Mineral water section is completely empty.', category: 'Beverages', type: 'Inventory', status: 'Urgent', projectedImpact: '-$800 sales risk' },
    ],
    'Fresh Produce': [
        { id: 'fp1', timestamp: '4h ago', title: 'Quality Alert', description: 'Reports of poor quality avocados from latest shipment.', category: 'Fresh Produce', type: 'Inventory', status: 'Pending', projectedImpact: 'Reputation risk' },
    ],
    Household: [
        { id: 'h1', timestamp: '3d ago', title: 'Slow Mover: Bleach', description: 'Bleach sales have been 50% below forecast for 2 weeks.', category: 'Household', type: 'Sales', status: 'Resolved', projectedImpact: '+$50 weekly profit' },
        { id: 'h2', timestamp: '1d ago', title: 'Safety Compliance', description: 'Bleach still misplaced near food items.', category: 'Household', type: 'Compliance', status: 'Pending', projectedImpact: 'Mitigate safety hazard' },
    ],
};

// For Store Layout
export const MOCK_STORE_LAYOUT_DATA: HeatmapZoneData[] = [
    { id: 'zone1', name: 'Fresh Produce', engagement: 'high', gridClass: 'col-span-5 row-span-3', insights: { topSku: 'Organic Avocados - 112 units/wk', lowPerformer: 'Leeks - 8 units/wk', layoutSuggestion: 'Place berries near entrance to boost impulse buys.', aiRationale: 'High traffic but low conversion on high-margin items.' } },
    { id: 'zone2', name: 'Meat & Seafood', engagement: 'medium', gridClass: 'col-span-4 row-span-3', insights: { topSku: 'Chicken Breast - 98 units/wk', lowPerformer: 'Lamb Chops - 12 units/wk', layoutSuggestion: 'Cross-promote with wine selection.', aiRationale: 'Basket analysis shows strong link between meat and wine purchases.' } },
    { id: 'zone3', name: 'Bakery', engagement: 'high', gridClass: 'col-span-3 row-span-3', insights: { topSku: 'Sourdough Bread - 150 units/wk', lowPerformer: 'Rye Bread - 20 units/wk', layoutSuggestion: 'Increase variety of gluten-free options.', aiRationale: 'Demographic data indicates high demand for gluten-free products.' } },
    { id: 'zone4', name: 'Dairy & Eggs', engagement: 'medium', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Fresh Milk - 250 units/wk', lowPerformer: 'Soy Milk - 30 units/wk', layoutSuggestion: 'Place high-protein yogurts at eye-level.', aiRationale: 'Matches current health and fitness trends.' } },
    { id: 'zone5', name: 'Pantry', engagement: 'low', gridClass: 'col-span-6 row-span-2', insights: { topSku: 'Pasta Sauce - 80 units/wk', lowPerformer: 'Canned Tuna - 15 units/wk', layoutSuggestion: 'Bundle pasta and sauce for a meal deal.', aiRationale: 'Increases basket size and moves slow-moving stock.' } },
    { id: 'zone6', name: 'Frozen', engagement: 'low', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Frozen Pizza - 90 units/wk', lowPerformer: 'Frozen Vegetables - 25 units/wk', layoutSuggestion: 'Relocate ice cream to an end-cap freezer.', aiRationale: 'High-impulse category currently has low visibility.' } },
    { id: 'zone7', name: 'Snacks', engagement: 'high', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Potato Chips - 200 units/wk', lowPerformer: 'Rice Cakes - 22 units/wk', layoutSuggestion: 'Co-locate with beverages to encourage combo purchases.', aiRationale: 'Sales data shows 60% of snack buyers also purchase a beverage.' } },
    { id: 'zone8', name: 'Beverages', engagement: 'high', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Sparkling Water - 180 units/wk', lowPerformer: 'Lemonade - 15 units/wk', layoutSuggestion: 'Move Sparkling Water closer to aisle entry for increased conversion.', aiRationale: 'Footfall is concentrated at front left – product underexposed here.' } },
    { id: 'zone9', name: 'Health', engagement: 'low', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Vitamin C - 50 units/wk', lowPerformer: 'Herbal Tea - 10 units/wk', layoutSuggestion: 'Create a dedicated "Immunity Booster" section.', aiRationale: 'Leverages seasonal health trends for increased sales.' } },
    { id: 'zone10', name: 'Baby/Pet', engagement: 'medium', gridClass: 'col-span-3 row-span-2', insights: { topSku: 'Diapers - 70 units/wk', lowPerformer: 'Dog Toys - 5 units/wk', layoutSuggestion: 'Place pet treats at a lower shelf height.', aiRationale: 'Improves visibility for customers with pets.' } },
    { id: 'zone11', name: 'Household', engagement: 'low', gridClass: 'col-span-5 row-span-1', insights: { topSku: 'Paper Towels - 60 units/wk', lowPerformer: 'Air Freshener - 8 units/wk', layoutSuggestion: 'Place cleaning wipes near high-traffic areas.', aiRationale: 'Encourages impulse purchase for convenience.' } },
    { id: 'zone12', name: 'POS', engagement: 'low', gridClass: 'col-span-3 row-span-1', insights: { topSku: 'N/A', lowPerformer: 'N/A', layoutSuggestion: 'N/A', aiRationale: 'N/A' } },
    { id: 'zone13', name: 'ENTRY', engagement: 'low', gridClass: 'col-span-2 row-span-1 font-bold', insights: { topSku: 'N/A', lowPerformer: 'N/A', layoutSuggestion: 'N/A', aiRationale: 'N/A' } },
    { id: 'zone14', name: 'EXIT', engagement: 'low', gridClass: 'col-span-2 row-span-1 font-bold', insights: { topSku: 'N/A', lowPerformer: 'N/A', layoutSuggestion: 'N/A', aiRationale: 'N/A' } },
];

// For Store Manager Daily Digest
export const MOCK_DAILY_DIGEST_DATA: DailyDigestData = {
    urgentIssues: [
        { id: 'ui1', title: 'Freezer #3 temp alert', timestamp: '8:15 AM', category: 'Household', status: 'Urgent' },
        { id: 'ui2', title: 'POS #2 offline', timestamp: '9:00 AM', category: 'Snacks', status: 'Pending' },
        { id: 'ui3', title: 'Spill in Aisle 4', timestamp: '9:30 AM', category: 'Beverages', status: 'Completed' },
    ],
    todayTasks: [
        { id: 'dt1', name: 'Restock Snacks Aisle', type: 'Restock' },
        { id: 'dt2', name: 'Update Promo Display', type: 'Layout' },
        { id: 'dt3', name: 'Check Dairy Expiration', type: 'Compliance' },
        { id: 'dt4', name: 'Morning Store Walk', type: 'General' },
    ],
    completedTasks: [
        { id: 'ct1', name: 'Team Huddle', type: 'General' },
    ],
};

// For Operations Manager Daily Digest
export const MOCK_OPS_DAILY_DIGEST_DATA: DailyDigestData = {
    urgentIssues: [
        { id: 'ops-ui1', title: 'Supplier "SnackCo" delivery delayed', timestamp: '8:45 AM', category: 'Snacks', status: 'Urgent' },
        { id: 'ops-ui2', title: 'Critical stockout risk: Cola', timestamp: '9:15 AM', category: 'Beverages', status: 'Urgent' },
        { id: 'ops-ui3', title: 'Data sync error with Store B', timestamp: '10:00 AM', category: 'Household', status: 'Pending' },
    ],
    todayTasks: [
        { id: 'ops-dt1', name: 'Approve PO #7812 for Drink Corp', type: 'PO Approval' },
        { id: 'ops-dt2', name: 'Review Dairy inventory levels', type: 'Compliance' },
        { id: 'ops-dt3', name: 'Investigate Household overstock', type: 'Investigation' },
    ],
    completedTasks: [
        { id: 'ops-ct1', name: 'Generated PO for Snacks', type: 'PO Approval' },
        { id: 'ops-ct2', name: 'Resolved Dairy compliance issue', type: 'Compliance' },
    ],
}


// --- Operations Manager Data ---
export const initialTasks: Task[] = [
    { id: 't1', description: 'Restock: Fresh Milk', details: 'SKU: D-001-P, Qty: 110', status: 'To Do', type: 'Restocking', priority: 'High', source: 'Store Manager', category: 'Dairy', timestamp: '10:30 AM' },
    { id: 't2', description: 'Review Dairy Planogram', details: 'Compliance has dropped to 75%. Investigate and fix.', status: 'To Do', type: 'Layout Change', priority: 'Medium', source: 'Autonomous', category: 'Dairy', timestamp: '11:00 AM', isEscalated: true, escalationReason: 'SLA Risk' },
    { id: 't3', description: 'Investigate OOS: Cola', details: 'Cola running out of stock despite recent delivery.', status: 'In Progress', type: 'Investigation', priority: 'High', source: 'Autonomous', category: 'Beverages', timestamp: 'Yesterday' },
    { id: 't-comp-1', description: '✅ Autonomous PO #8821', details: 'PO created for 12 SKUs with critically low stock.', status: 'Completed', type: 'PO', priority: 'High', source: 'Autonomous', category: 'Beverages', timestamp: '2025-07-05 08:15' },
    { id: 't-comp-2', description: '✅ Autonomous PO #8899', details: 'PO created for out-of-stock items.', status: 'Completed', type: 'PO', priority: 'Low', source: 'Autonomous', category: 'Snacks', timestamp: 'Today' },
    { id: 't5', description: 'Check Fresh Produce quality', details: 'Reports of poor quality avocados.', status: 'In Progress', type: 'Investigation', priority: 'Medium', source: 'Store Manager', category: 'Fresh Produce', timestamp: '1:00 PM', isPaused: true, pauseReason: 'Awaiting Approval' },
    { id: 't6', description: 'Adjust Household chemical layout', details: 'Safety compliance issue reported.', status: 'To Do', type: 'Compliance', priority: 'High', source: 'Autonomous', category: 'Household', timestamp: '2:15 PM' },
];

const opsDataTemplate: OpsData = {
    shelfInventory: [],
    inventorySuggestions: [
        { id: 1, text: 'Increase safety stock for high-velocity items by 10% for weekend peak.' },
        { id: 2, text: 'Consider de-listing chronically underperforming SKUs to optimize space.' },
        { id: 3, text: 'Review cross-store inventory levels to identify balancing opportunities.' },
    ],
    inventoryMovement: {
        fastMovers: { name: 'Item A', data: [80, 85, 90, 88, 110, 120, 115] },
        slowMovers: { name: 'Item B', data: [12, 10, 8, 9, 7, 5, 6] },
        anomaly: null,
        aiInsight: "Fast movers show strong weekend sales. Slow movers trend is declining and might be candidates for delisting to free up shelf space for higher velocity items.",
        fastMoverEvents: [],
        slowMoverEvents: [],
    },
    alerts: [],
    kpis: [],
    purchaseOrders: [],
    suppliers: [],
    insights: [],
    spaceUtilization: {
        zones: [
            { id: 'z1', usage: 60 }, { id: 'z2', usage: 85 }, { id: 'z3', usage: 92 },
            { id: 'z4', usage: 40 }, { id: 'z5', usage: 98 }, { id: 'z6', usage: 75 },
        ],
        suggestions: [
            { id: 1, text: 'Consolidate slow-moving items to free up one shelf.' },
            { id: 2, text: 'Expand fast-moving section into adjacent underutilized space.' }
        ]
    }
};

const dairyOpsData: OpsData = JSON.parse(JSON.stringify(opsDataTemplate));
dairyOpsData.shelfInventory = [
    { id: 'd1', name: 'Fresh Milk', sku: 'D-001-P', status: 'Understocked', currentStock: 10, capacity: 50, suggestedAdjustment: 40 },
    { id: 'd2', name: 'Cheddar Cheese', sku: 'D-002-C', status: 'Optimized', currentStock: 40, capacity: 50, suggestedAdjustment: 0 },
    { id: 'd3', name: 'Greek Yogurt', sku: 'D-003-Y', status: 'Optimized', currentStock: 55, capacity: 80, suggestedAdjustment: 0 },
    { id: 'd4', name: 'Soy Milk', sku: 'D-005-SM', status: 'Overstocked', currentStock: 45, capacity: 30, suggestedAdjustment: -15 },
    { id: 'd5', name: 'Eggs', sku: 'D-007-E', status: 'Chronic Imbalance', currentStock: 5, capacity: 60, suggestedAdjustment: 55 },
    { id: 'd6', name: 'Kefir', sku: 'D-012-K', status: 'Optimized', currentStock: 20, capacity: 25, suggestedAdjustment: 0 },
];
dairyOpsData.inventoryMovement.fastMovers = { name: 'Fresh Milk', data: [80, 85, 90, 88, 110, 120, 115] };
dairyOpsData.inventoryMovement.slowMovers = { name: 'Soy Milk', data: [12, 10, 8, 9, 7, 5, 6] };
dairyOpsData.alerts = [
    { id: 1, title: 'Stockout Risk: Milk', urgency: 'Urgent', message: 'Stock level at 10 units, predicted stockout in <3 hours.', recommendation: 'Initiate emergency restock from backroom.', timestamp: 'Today, 8:30 AM', category: 'Dairy' },
    { id: 2, title: 'Shelf gaps in Dairy', urgency: 'Pending', message: 'Dairy planogram compliance dropped to 75%.', timestamp: 'Today, 11:00 AM', category: 'Dairy' },
];
dairyOpsData.insights = [
    { id: 1, title: 'Optimize Dairy Order Cycle', description: 'Fresh milk shows a consistent 3-day sell-through. Adjusting POs to a 2-day lead time could reduce overstock by 15%.', action: 'Update PO frequency to every 2 days.', risk: '⛔️ Risk: Potential for minor stockouts during adjustment period.', rationale: 'AI detected a repeatable 3-day sales cycle for D-001-P, but ordering occurs every 4 days, causing inefficiency.' },
    { id: 2, title: 'Proactive Yogurt Restocking', description: 'Weekend sales for Greek Yogurt spike by 40%. The current safety stock is insufficient.', action: 'Increase safety stock for D-003-Y by 20% before weekends.', risk: '⛔️ Risk: Minor increase in carrying costs if trend deviates.', rationale: 'AI identified a correlation between weekend foot traffic and yogurt sales that exceeds current replenishment triggers.' },
];
dairyOpsData.kpis = [
    { title: 'Inventory Turnover', value: '8.5', trend: 'up', performance: 'good', definition: 'How many times inventory is sold and replaced over a period.' },
    { title: 'Shelf Utilization', value: '88%', trend: 'up', performance: 'good', definition: 'Percentage of shelf space occupied by products.' },
    { title: 'Restocking Lead Time', value: '2.1d', trend: 'down', performance: 'good', definition: 'Time from PO creation to stock being available on shelf.' },
    { title: 'Waste Reduction', value: '1.2%', trend: 'up', performance: 'good', definition: 'Percentage of inventory reduction due to spoilage or expiry.' },
];
dairyOpsData.purchaseOrders = [
    { id: 'PO-7810', supplierName: 'Global Foods', status: 'Delivered', items: 5, date: '2d ago' },
];
dairyOpsData.suppliers = [
    { name: 'Global Foods', leadTime: 3, fulfillmentAccuracy: 98, underperforming: false },
    { name: 'DairyBest', leadTime: 2, fulfillmentAccuracy: 99, underperforming: false },
];


const snacksOpsData: OpsData = JSON.parse(JSON.stringify(opsDataTemplate));
snacksOpsData.shelfInventory = [
    { id: 's1', name: 'Potato Chips', sku: 'S-015-C', status: 'Understocked', currentStock: 20, capacity: 100, suggestedAdjustment: 80 },
    { id: 's2', name: 'Chocolate Bar', sku: 'S-002-CH', status: 'Understocked', currentStock: 180, capacity: 200, suggestedAdjustment: 0 },
    { id: 's3', name: 'Gummy Bears', sku: 'S-006-GB', status: 'Chronic Imbalance', currentStock: 30, capacity: 120, suggestedAdjustment: 90 },
    { id: 's4', name: 'Mixed Nuts', sku: 'S-009-MN', status: 'Overstocked', currentStock: 60, capacity: 40, suggestedAdjustment: -20 },
    { id: 's5', name: 'Pretzels', sku: 'S-010-P', status: 'Optimized', currentStock: 80, capacity: 50, suggestedAdjustment: -30 },
    { id: 's6', name: 'Rice Cakes', sku: 'S-012-RC', status: 'Optimized', currentStock: 35, capacity: 40, suggestedAdjustment: 0 },
];
snacksOpsData.inventoryMovement.fastMovers = { name: 'Potato Chips', data: [150, 160, 180, 95, 230, 200, 190] };
snacksOpsData.inventoryMovement.slowMovers = { name: 'Rice Cakes', data: [22, 20, 25, 18, 15, 17, 16] };
snacksOpsData.inventoryMovement.fastMoverEvents = [{ day: 4, description: 'Temporary shelf rearrangement affected availability.' }];
snacksOpsData.inventoryMovement.slowMoverEvents = [{ day: 4, description: 'Delayed restocking due to supplier backlog.' }];
snacksOpsData.alerts = [
    { id: 2, title: 'High Stockout Risk', urgency: 'Urgent', message: 'High velocity on Potato Chips and low stock. Risk of stockout during evening peak.', recommendation: 'Prioritize for next restocking cycle.', timestamp: 'Today, 2:45 PM', category: 'Snacks' },
    { id: 7, title: 'Supplier Underperforming', urgency: 'Pending', message: 'SnackCo fulfillment accuracy dropped to 89%.', timestamp: 'Yesterday, 4:00 PM', category: 'Snacks' },
];
snacksOpsData.insights = [
    { id: 3, title: 'Correlate Snack & Bev Promos', description: 'Basket analysis shows 60% of snack buyers also purchase a beverage. Current promotions are not aligned.', action: 'Create a bundled "Movie Night" deal with chips and cola.', risk: '⛔️ Risk: Margin reduction on individual items.', rationale: 'AI analysis of transaction logs found a strong affinity between SKU S-015-C and B-001-C, which can be leveraged to increase total basket value.' },
];
snacksOpsData.kpis = [
    { title: 'Inventory Turnover', value: '12.1', trend: 'up', performance: 'good', definition: 'How many times inventory is sold and replaced over a period.' },
    { title: 'Shelf Utilization', value: '93%', trend: 'up', performance: 'good', definition: 'Percentage of shelf space occupied by products.' },
    { title: 'Restocking Lead Time', value: '2d', trend: 'down', performance: 'good', definition: 'Time from PO creation to stock being available on shelf.' },
    { title: 'Waste Reduction', value: '0.5%', trend: 'stable', performance: 'neutral', definition: 'Percentage of inventory reduction due to spoilage or expiry.' },
];
snacksOpsData.purchaseOrders = [
    { id: 'PO-7811', supplierName: 'SnackCo', status: 'In Transit', items: 2, date: '1d ago' },
    { id: 'PO-8899', supplierName: 'AutoSnacks', status: 'Created', items: 8, date: 'Today' },
];
snacksOpsData.suppliers = [
    { name: 'SnackCo', leadTime: 5, fulfillmentAccuracy: 89, underperforming: true },
    { name: 'Crispy Cravings', leadTime: 3, fulfillmentAccuracy: 95, underperforming: false },
];

const beveragesOpsData: OpsData = JSON.parse(JSON.stringify(opsDataTemplate));
beveragesOpsData.shelfInventory = [
    { id: 'b1', name: 'Cola', sku: 'B-001-C', status: 'Understocked', currentStock: 30, capacity: 150, suggestedAdjustment: 120 },
    { id: 'b2', name: 'Green Tea', sku: 'B-002-T', status: 'Optimized', currentStock: 90, capacity: 100, suggestedAdjustment: 0 },
    { id: 'b3', name: 'Energy Drink', sku: 'B-007-ED', status: 'Chronic Imbalance', currentStock: 15, capacity: 100, suggestedAdjustment: 85 },
    { id: 'b4', name: 'Coconut Water', sku: 'B-010-CW', status: 'Understocked', currentStock: 5, capacity: 60, suggestedAdjustment: 55 },
    { id: 'b5', name: 'Mineral Water', sku: 'B-004-W', status: 'Optimized', currentStock: 110, capacity: 120, suggestedAdjustment: 0 },
    { id: 'b6', name: 'Root Beer', sku: 'B-011-RB', status: 'Overstocked', currentStock: 70, capacity: 50, suggestedAdjustment: -20 },
];
beveragesOpsData.inventoryMovement.fastMovers = { name: 'Cola', data: [200, 220, 250, 300, 400, 380, 350] };
beveragesOpsData.inventoryMovement.slowMovers = { name: 'Green Tea', data: [40, 45, 38, 50, 42, 44, 41] };
beveragesOpsData.inventoryMovement.fastMoverEvents = [{ day: 5, description: 'Heatwave forecast initiated demand spike.' }];
beveragesOpsData.alerts = [
    { id: 3, title: 'Critical OOS: Cola', urgency: 'Critical', message: 'Demand spike from heatwave forecast. Stock will deplete in <5 hours.', recommendation: 'Execute immediate transfer from another store if available.', timestamp: 'Today, 9:15 AM', category: 'Beverages' },
    { id: 4, title: 'Critical OOS: Coconut Water', urgency: 'Urgent', message: 'Influencer promotion detected. Stock almost depleted.', recommendation: 'Generate emergency PO with express shipping.', timestamp: 'Today, 9:05 AM', category: 'Beverages' }
];
beveragesOpsData.insights = [
    { id: 1, title: 'Prioritize Bev. Compliance', description: 'Beverages compliance has been low for 3 days, correlating with a 15% sales dip despite high traffic.', action: 'Create a high-priority compliance task for Beverages aisle.', risk: '⛔️ Risk: Estimated sales loss of $12,000 if not addressed.', rationale: 'AI detected a >15% sales decline in Beverages over 3 days, despite foot traffic in that zone remaining high. This strongly indicates a planogram/restocking issue.' },
];
beveragesOpsData.kpis = [
    { title: 'Inventory Turnover', value: '15.3', trend: 'up', performance: 'good', definition: 'How many times inventory is sold and replaced over a period.' },
    { title: 'Shelf Utilization', value: '92%', trend: 'up', performance: 'good', definition: 'Percentage of shelf space occupied by products.' },
    { title: 'Restocking Lead Time', value: '1.8d', trend: 'down', performance: 'good', definition: 'Time from PO creation to stock being available on shelf.' },
    { title: 'Waste Reduction', value: '0.2%', trend: 'stable', performance: 'neutral', definition: 'Percentage of inventory reduction due to spoilage or expiry.' },
];
beveragesOpsData.purchaseOrders = [
    { id: 'PO-7812', supplierName: 'Drink Corp', status: 'In Transit', items: 8, date: '1d ago' },
    { id: 'PO-8821', supplierName: 'DrinkCorp', status: 'Created', items: 12, date: 'Today' },
];
beveragesOpsData.suppliers = [
    { name: 'Drink Corp', leadTime: 2, fulfillmentAccuracy: 99, underperforming: false },
    { name: 'Global Foods', leadTime: 3, fulfillmentAccuracy: 98, underperforming: false },
];


const freshProduceOpsData: OpsData = JSON.parse(JSON.stringify(opsDataTemplate));
freshProduceOpsData.shelfInventory = [
    { id: 'fp1', name: 'Red Apples', sku: 'FP-001-A', status: 'Optimized', currentStock: 50, capacity: 60, suggestedAdjustment: 0 },
    { id: 'fp2', name: 'Bananas', sku: 'FP-002-B', status: 'Understocked', currentStock: 20, capacity: 80, suggestedAdjustment: 60 },
    { id: 'fp3', name: 'Broccoli', sku: 'FP-003-BR', status: 'Optimized', currentStock: 30, capacity: 40, suggestedAdjustment: 0 },
    { id: 'fp4', name: 'Avocado', sku: 'FP-007-AV', status: 'Overstocked', currentStock: 50, capacity: 30, suggestedAdjustment: -20 },
    { id: 'fp5', name: 'Strawberries', sku: 'FP-008-S', status: 'Understocked', currentStock: 10, capacity: 40, suggestedAdjustment: 30 },
    { id: 'fp6', name: 'Mushrooms', sku: 'FP-011-M', status: 'Chronic Imbalance', currentStock: 5, capacity: 20, suggestedAdjustment: 15 },
];
freshProduceOpsData.inventoryMovement.fastMovers = { name: 'Bananas', data: [100, 110, 120, 130, 125, 115, 105] };
freshProduceOpsData.inventoryMovement.slowMovers = { name: 'Mushrooms', data: [15, 12, 18, 14, 10, 9, 11] };
freshProduceOpsData.alerts = [
    { id: 5, title: 'Spoilage Risk: Avocado', urgency: 'Pending', message: 'Overstocked. Risk of spoilage if not sold within 2 days.', recommendation: 'Apply a 20% discount promotion.', timestamp: 'Today, 1:10 PM', category: 'Fresh Produce' },
    { id: 6, title: 'Shelf gaps in Produce', urgency: 'Moderate', message: 'Empty spaces detected in berry section.', recommendation: 'Restock immediately.', timestamp: 'Today, 8:30 AM', category: 'Fresh Produce' }
];
freshProduceOpsData.insights = [
    { id: 4, title: 'Adjust Avocado Order Size', description: 'Avocados are consistently overstocked by 40% post-delivery, leading to waste.', action: 'Reduce standard PO size for avocados by 30%.', risk: '⛔️ Risk: Potential for minor stockouts if demand unexpectedly spikes.', rationale: 'AI spoilage model predicts a 25% loss on the current avocado inventory batch if sell-through rate does not increase.' },
];
freshProduceOpsData.kpis = [
    { title: 'Inventory Turnover', value: '45.0', trend: 'up', performance: 'good', definition: 'How many times inventory is sold and replaced over a period.' },
    { title: 'Shelf Utilization', value: '82%', trend: 'down', performance: 'bad', definition: 'Percentage of shelf space occupied by products.' },
    { title: 'Restocking Lead Time', value: '0.8d', trend: 'down', performance: 'good', definition: 'Time from PO creation to stock being available on shelf.' },
    { title: 'Waste Reduction', value: '4.5%', trend: 'up', performance: 'good', definition: 'Percentage of inventory reduction due to spoilage or expiry.' },
];
freshProduceOpsData.purchaseOrders = [
    { id: 'PO-7808', supplierName: 'FreshDirect', status: 'Delivered', items: 25, date: '1d ago' },
];
freshProduceOpsData.suppliers = [
    { name: 'FreshDirect', leadTime: 1, fulfillmentAccuracy: 92, underperforming: false },
];

const householdOpsData: OpsData = JSON.parse(JSON.stringify(opsDataTemplate));
householdOpsData.shelfInventory = [
    { id: 'h1', name: 'Dish Soap', sku: 'H-001-DS', status: 'Optimized', currentStock: 45, capacity: 50, suggestedAdjustment: 0 },
    { id: 'h2', name: 'Laundry Detergent', sku: 'H-002-LD', status: 'Optimized', currentStock: 38, capacity: 40, suggestedAdjustment: 0 },
    { id: 'h3', name: 'Paper Towels', sku: 'H-003-PT', status: 'Understocked', currentStock: 10, capacity: 60, suggestedAdjustment: 50 },
    { id: 'h4', name: 'Bleach', sku: 'H-004-B', status: 'Overstocked', currentStock: 30, capacity: 20, suggestedAdjustment: -10 },
    { id: 'h5', name: 'Trash Bags', sku: 'H-005-TB', status: 'Optimized', currentStock: 40, capacity: 50, suggestedAdjustment: 0 },
    { id: 'h6', name: 'Air Freshener', sku: 'H-012-AF', status: 'Chronic Imbalance', currentStock: 5, capacity: 30, suggestedAdjustment: 25 },
];
householdOpsData.inventoryMovement.fastMovers = { name: 'Paper Towels', data: [50, 55, 60, 58, 65, 70, 68] };
householdOpsData.inventoryMovement.slowMovers = { name: 'Air Freshener', data: [8, 7, 9, 6, 5, 8, 7] };
householdOpsData.alerts = [
    { id: 8, title: 'Safety Compliance', urgency: 'Urgent', message: 'Bleach is misplaced near food items. Immediate action required.', recommendation: 'Relocate product to designated chemical section.', timestamp: 'Today, 9:00 AM', category: 'Household' },
];
householdOpsData.insights = [
    { id: 5, title: 'Delist Slow Mover', description: 'Air Freshener has been a chronic low-performer for 3 months with high carrying costs.', action: 'Initiate process to delist SKU H-012-AF.', risk: '⛔️ Risk: Minor customer dissatisfaction from a small user base.', rationale: 'AI analysis shows this SKU has the lowest sales velocity and margin contribution in its sub-category, making it a prime candidate for delisting to free up space.' },
];
householdOpsData.kpis = [
    { title: 'Inventory Turnover', value: '3.1', trend: 'stable', performance: 'neutral', definition: 'How many times inventory is sold and replaced over a period.' },
    { title: 'Shelf Utilization', value: '65%', trend: 'down', performance: 'bad', definition: 'Percentage of shelf space occupied by products.' },
    { title: 'Restocking Lead Time', value: '4.2d', trend: 'up', performance: 'bad', definition: 'Time from PO creation to stock being available on shelf.' },
    { title: 'Waste Reduction', value: '0.1%', trend: 'stable', performance: 'neutral', definition: 'Percentage of inventory reduction due to spoilage or expiry.' },
];
householdOpsData.purchaseOrders = [
    { id: 'PO-7809', supplierName: 'CleanCo', status: 'Delivered', items: 15, date: '3d ago' },
];
householdOpsData.suppliers = [
    { name: 'CleanCo', leadTime: 4, fulfillmentAccuracy: 99, underperforming: false },
];


export const MOCK_OPS_DATA: Record<Category, OpsData> = {
    Dairy: dairyOpsData,
    Snacks: snacksOpsData,
    Beverages: beveragesOpsData,
    'Fresh Produce': freshProduceOpsData,
    Household: householdOpsData,
};

// --- For Shelfie Modal ---
const SHELFIE_SCENARIO_GOOD: ShelfieAnalysisResult = {
  complianceScore: 0,
  summary: {
    correct: 11,
    misplaced: 0,
    low: 1,
    empty: 0,
    totalExpectedSkus: 12,
    facingIssues: 1,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: 'Item A', tooltip: '✔ Correct placement' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 5, width: 20, height: 28 }, label: 'Item B', tooltip: '✔ Correct placement' },
    { id: 'c3', type: 'correct', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Item C', tooltip: '✔ Correct placement' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Item D', tooltip: '✔ Correct placement' },
    { id: 'c5', type: 'correct', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Item E', tooltip: '✔ Correct placement' },
    { id: 'c6', type: 'correct', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Item F', tooltip: '✔ Correct placement' },
    { id: 'c7', type: 'correct', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Item G', tooltip: '✔ Correct placement' },
    { id: 'c8', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Item H', tooltip: '✔ Correct placement' },
    { id: 'c9', type: 'correct', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Item I', tooltip: '✔ Correct placement' },
    { id: 'l1', type: 'low', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Item J', tooltip: 'Low Stock: Est. 2 units remaining.' },
    { id: 'c10', type: 'correct', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'Item K', tooltip: '✔ Correct placement. Minor facing issue.' },
    { id: 'c11', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'Item L', tooltip: '✔ Correct placement' },
  ],
};

const SHELFIE_SCENARIO_MODERATE: ShelfieAnalysisResult = {
  complianceScore: 0,
  summary: {
    correct: 8,
    misplaced: 2,
    low: 1,
    empty: 1,
    totalExpectedSkus: 12,
    facingIssues: 2,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: 'Item A', tooltip: '✔ Correct placement' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 5, width: 20, height: 28 }, label: 'Item B', tooltip: '✔ Correct placement' },
    { id: 'c3', type: 'correct', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Item C', tooltip: '✔ Correct placement. Facing is obstructed.' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Item D', tooltip: '✔ Correct placement' },
    { id: 'm1', type: 'misplaced', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Potato Chips', tooltip: 'Misplaced: SKU S-001. Should be in Aisle 5, Section B.' },
    { id: 'm2', type: 'misplaced', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Gummy Bears', tooltip: 'Misplaced: SKU S-006. Should be in Candy Section.' },
    { id: 'c5', type: 'correct', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Item E', tooltip: '✔ Correct placement' },
    { id: 'c6', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Item F', tooltip: '✔ Correct placement' },
    { id: 'e1', type: 'empty', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Replenishment required for SKU X-123.' },
    { id: 'c7', type: 'correct', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Item G', tooltip: '✔ Correct placement. Facing is angled.' },
    { id: 'l1', type: 'low', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'Low Stock Zone', tooltip: 'Low Stock: Est. 3 units remaining for SKU Y-456.' },
    { id: 'c8', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'Item H', tooltip: '✔ Correct placement' },
  ],
};

const SHELFIE_SCENARIO_POOR: ShelfieAnalysisResult = {
  complianceScore: 0,
  summary: {
    correct: 4,
    misplaced: 3,
    low: 2,
    empty: 3,
    totalExpectedSkus: 12,
    facingIssues: 4,
  },
  detectedItems: [
    { id: 'c1', type: 'correct', box: { x: 5, y: 5, width: 20, height: 28 }, label: 'Item A', tooltip: '✔ Correct placement. Facing is obstructed.' },
    { id: 'm1', type: 'misplaced', box: { x: 28, y: 5, width: 20, height: 28 }, label: 'Cereal', tooltip: 'Misplaced: SKU C-001. Should be in Aisle 2.' },
    { id: 'e1', type: 'empty', box: { x: 51, y: 5, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Replenishment required for SKU X-456.' },
    { id: 'l1', type: 'low', box: { x: 74, y: 5, width: 20, height: 28 }, label: 'Low Stock Zone', tooltip: 'Low Stock: Est. 1 unit remaining for SKU Y-789.' },
    { id: 'm2', type: 'misplaced', box: { x: 5, y: 36, width: 20, height: 28 }, label: 'Diapers', tooltip: 'Misplaced: SKU D-002. Should be in Baby section.' },
    { id: 'c2', type: 'correct', box: { x: 28, y: 36, width: 20, height: 28 }, label: 'Item B', tooltip: '✔ Correct placement. Facing is reversed.' },
    { id: 'e2', type: 'empty', box: { x: 51, y: 36, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Replenishment required for SKU Z-111.' },
    { id: 'c3', type: 'correct', box: { x: 74, y: 36, width: 20, height: 28 }, label: 'Item C', tooltip: '✔ Correct placement' },
    { id: 'm3', type: 'misplaced', box: { x: 5, y: 67, width: 20, height: 28 }, label: 'Dog Food', tooltip: 'Misplaced: SKU P-003. Should be in Pet section. Facing is angled.' },
    { id: 'l2', type: 'low', box: { x: 28, y: 67, width: 20, height: 28 }, label: 'Low Stock Zone', tooltip: 'Low Stock: Est. 2 units remaining for SKU W-222. Facing is angled.' },
    { id: 'e3', type: 'empty', box: { x: 51, y: 67, width: 20, height: 28 }, label: 'Empty Slot', tooltip: 'Empty Slot: Replenishment required for SKU V-333.' },
    { id: 'c4', type: 'correct', box: { x: 74, y: 67, width: 20, height: 28 }, label: 'Item D', tooltip: '✔ Correct placement' },
  ],
};

export const MOCK_SHELFIE_SCENARIOS = [
    SHELFIE_SCENARIO_GOOD,
    SHELFIE_SCENARIO_MODERATE,
    SHELFIE_SCENARIO_POOR,
];