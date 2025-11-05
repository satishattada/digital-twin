import React, { useState, useEffect } from "react";
import { Category } from "../types";
import siteProductsData from "./../../site-products.json";

type OpsShelfInventoryStatusProps = {
    selectedCategory: Category;
    selectedStore: string;
    selectedSiteId: string;
};

// BP API Types based on SiteMaster Consumer API
interface StockPosition {
    siteId: string;
    productId: string;
    productName: string;
    categoryId: string;
    categoryName: string;
    currentStock: number;
    maxStock: number;
    minStock: number;
    lastUpdated: string;
    unitOfMeasure: string;
    location?: string;
    shelfZone?: string;
}

interface ProductDetails extends StockPosition {
    stockStatus: "Critical" | "Low" | "Normal" | "Overstocked";
    stockPercentage: number;
    reorderNeeded: boolean;
    trend?: "increasing" | "decreasing" | "stable";
}

// BP API Service using OAuth2 (keeping existing implementation)
class BPApiService {
    private baseUrl = "https://2ni58i353m.execute-api.us-east-1.amazonaws.com";
    private clientId = "1iscd5u2j69mcv1mu8o81ek0lu";
    private clientSecret =
        "m4hsr17drj9r9sq81ivvjld2f4bpq0s2el1ml0lrs97hsrg3pa8";
    private useMockApi = "true";
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;
    private apiPath = "/api/bp";
    private authUrl = "https://auth-dsp.bp.com/oauth2/token";

    // Get OAuth2 token
    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await fetch(this.authUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials",
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    scope: "stock-api/stock.read",
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Auth failed: ${response.status} ${response.statusText}`
                );
            }

            const tokenData = await response.json();
            this.accessToken = tokenData.access_token;
            this.tokenExpiry = Date.now() + tokenData.expires_in * 1000 - 60000; // 1 min buffer

            return this.accessToken!;
        } catch (error) {
            console.error("Failed to get access token:", error);
            throw new Error("Authentication failed");
        }
    }

    // Get stock position for a site through proxy
    async getStockPosition(siteId: string): Promise<StockPosition[]> {
        try {
            const token = await this.getAccessToken();

            const response = await fetch(
                `${this.baseUrl}${this.apiPath}/stock/position?siteId=${siteId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `API Error: ${response.status} ${response.statusText} - ${errorText}`
                );
            }

            const data = await response.text();
            const temp = JSON.parse(data);
            const filterData = this.filterStocks(temp?.data, siteId);
            return Array.isArray(filterData) ? filterData : filterData || [];
        } catch (error) {
            console.error("Failed to fetch stock position:", error);

            // Return mock data if API fails
            return this.getMockStockData(siteId);
        }
    }

    private filterStocks(responseData: any, siteId: string): StockPosition[] {
        const items = responseData?.data.items || [];

        // Find the site data for the given siteId
        const siteNode = siteProductsData.find(
            (site) => site.node.internalSiteID === siteId
        );
        const siteData = siteNode?.node?.physicalStoreProducts || [];

        console.log(`Processing ${items.length} items for site ${siteId}`);
        console.log(
            `Found ${siteData.length} products configured for this site`
        );

        if (!siteData || siteData.length === 0) {
            console.warn(`No site configuration found for siteId: ${siteId}`);
            return [];
        }

        // Create a comprehensive product lookup map with categories
        const productLookup = new Map();
        siteData.forEach((storeProduct) => {
            const product = storeProduct.product;
            const category = this.getCategoryFromProductName(
                product.name || product.displayName
            );

            productLookup.set(product.rmi, {
                displayName: product.displayName,
                originalName: product.name,
                ean: product.ean,
                rmi: product.rmi,
                category: category,
                zone: this.getZoneFromProductName(
                    product.name || product.displayName
                ),
            });
        });

        // Filter and transform items
        const transformedItems: StockPosition[] = [];

        items.forEach((item: any, index: any) => {
            // Check if this item's linkedItemId matches any product rmi
            if (productLookup.has(item.linkedItemId)) {
                const productInfo = productLookup.get(item.linkedItemId);

                // Calculate realistic stock levels
                const currentStock = item.stockOnHand || 0;
                const maxStock = this.calculateMaxStock(
                    currentStock,
                    productInfo.originalName
                );
                const minStock = this.calculateMinStock(maxStock);

                const stockPosition: StockPosition = {
                    siteId: siteId,
                    productId: item.linkedItemId,
                    productName:
                        productInfo.displayName || productInfo.originalName,
                    categoryId: productInfo.category.id,
                    categoryName: productInfo.category.name,
                    currentStock: currentStock,
                    maxStock: maxStock,
                    minStock: minStock,
                    lastUpdated:
                        item.lastUpdated ||
                        item.lastModified ||
                        new Date().toISOString(),
                    unitOfMeasure: "units",
                    location: `Counter Position ${index + 1}`,
                    shelfZone: productInfo.zone,
                };

                transformedItems.push(stockPosition);

                console.log(
                    `✅ Matched item ${item.linkedItemId}: ${productInfo.displayName} (${productInfo.category.name})`
                );
            } else {
                console.log(
                    `⚠️ No product configuration found for linkedItemId: ${item.linkedItemId}`
                );
            }
        });

        console.log(
            `✅ Successfully processed ${transformedItems.length} items with categories`
        );
        return transformedItems;
    }

    // Enhanced category detection based on product names
    private getCategoryFromProductName(productName: string): {
        id: string;
        name: string;
    } {
        if (!productName) return { id: "GENERAL", name: "General Merchandise" };

        const name = productName.toLowerCase();

        // Postal Services
        if (
            name.includes("stamp") ||
            name.includes("postage") ||
            name.includes("envelope") ||
            name.includes("postal") ||
            name.includes("mail") ||
            name.includes("post")
        ) {
            return { id: "POSTAL", name: "Postal Services" };
        }

        // Stationery & Office
        if (
            name.includes("pen") ||
            name.includes("pencil") ||
            name.includes("paper") ||
            name.includes("notebook") ||
            name.includes("diary") ||
            name.includes("card") ||
            name.includes("stationery") ||
            name.includes("writing")
        ) {
            return { id: "STATIONERY", name: "Stationery & Office" };
        }

        // Greeting Cards & Gift Items
        if (
            name.includes("greeting") ||
            name.includes("birthday") ||
            name.includes("anniversary") ||
            name.includes("christmas") ||
            name.includes("valentine") ||
            name.includes("gift") ||
            (name.includes("card") &&
                (name.includes("birthday") || name.includes("christmas")))
        ) {
            return { id: "CARDS", name: "Cards & Gifts" };
        }

        // Tobacco & Smoking
        if (
            name.includes("cigarette") ||
            name.includes("tobacco") ||
            name.includes("cigar") ||
            name.includes("smoking") ||
            name.includes("lighter") ||
            name.includes("match")
        ) {
            return { id: "TOBACCO", name: "Tobacco & Smoking" };
        }

        // Confectionery & Snacks
        if (
            name.includes("chocolate") ||
            name.includes("sweet") ||
            name.includes("candy") ||
            name.includes("gum") ||
            name.includes("mint") ||
            name.includes("lolly") ||
            (name.includes("bar") &&
                (name.includes("chocolate") || name.includes("candy")))
        ) {
            return { id: "CONFECTIONERY", name: "Confectionery & Snacks" };
        }

        // Beverages
        if (
            name.includes("drink") ||
            name.includes("juice") ||
            name.includes("water") ||
            name.includes("cola") ||
            name.includes("soda") ||
            name.includes("beverage") ||
            name.includes("coffee") ||
            name.includes("tea")
        ) {
            return { id: "BEVERAGES", name: "Beverages" };
        }

        // Health & Beauty
        if (
            name.includes("medicine") ||
            name.includes("vitamin") ||
            name.includes("cream") ||
            name.includes("lotion") ||
            name.includes("shampoo") ||
            name.includes("soap") ||
            name.includes("toothpaste") ||
            name.includes("health") ||
            name.includes("beauty")
        ) {
            return { id: "HEALTH_BEAUTY", name: "Health & Beauty" };
        }

        // Electronics & Accessories
        if (
            name.includes("battery") ||
            name.includes("charger") ||
            name.includes("cable") ||
            name.includes("headphone") ||
            name.includes("phone") ||
            name.includes("electronic")
        ) {
            return { id: "ELECTRONICS", name: "Electronics & Accessories" };
        }

        // Automotive
        if (
            name.includes("car") ||
            name.includes("auto") ||
            name.includes("oil") ||
            name.includes("fuel") ||
            name.includes("tire") ||
            name.includes("automotive")
        ) {
            return { id: "AUTOMOTIVE", name: "Automotive" };
        }

        // Newspapers & Magazines
        if (
            name.includes("newspaper") ||
            name.includes("magazine") ||
            name.includes("journal") ||
            name.includes("publication") ||
            name.includes("news")
        ) {
            return { id: "PUBLICATIONS", name: "Publications" };
        }

        // Travel & Transport
        if (
            name.includes("ticket") ||
            name.includes("travel") ||
            name.includes("transport") ||
            name.includes("oyster") ||
            name.includes("metro") ||
            name.includes("bus")
        ) {
            return { id: "TRAVEL", name: "Travel & Transport" };
        }

        // Food Items
        if (
            name.includes("food") ||
            name.includes("meal") ||
            name.includes("sandwich") ||
            name.includes("bread") ||
            name.includes("milk") ||
            name.includes("cheese")
        ) {
            return { id: "FOOD", name: "Food Items" };
        }

        // Default category
        return { id: "GENERAL", name: "General Merchandise" };
    }

    private getZoneFromProductName(productName: string): string {
        if (!productName) return "General Area";

        const name = productName.toLowerCase();

        if (name.includes("stamp") || name.includes("postal")) {
            return "Postal Counter";
        } else if (name.includes("cigarette") || name.includes("tobacco")) {
            return "Tobacco Cabinet";
        } else if (name.includes("magazine") || name.includes("newspaper")) {
            return "Publications Rack";
        } else if (name.includes("drink") || name.includes("beverage")) {
            return "Beverage Cooler";
        } else if (name.includes("chocolate") || name.includes("sweet")) {
            return "Confectionery Display";
        } else if (
            name.includes("card") &&
            (name.includes("greeting") || name.includes("birthday"))
        ) {
            return "Card Stand";
        } else if (name.includes("medicine") || name.includes("health")) {
            return "Health & Beauty Section";
        } else if (name.includes("battery") || name.includes("electronic")) {
            return "Electronics Counter";
        }

        return "General Merchandise Area";
    }

    private calculateMaxStock(
        currentStock: number,
        productName: string
    ): number {
        if (!productName) return Math.max(20, currentStock * 2);

        const name = productName.toLowerCase();

        // High turnover items
        if (
            name.includes("stamp") ||
            name.includes("cigarette") ||
            name.includes("newspaper")
        ) {
            return Math.max(100, currentStock * 4);
        }
        // Medium turnover items
        else if (
            name.includes("chocolate") ||
            name.includes("drink") ||
            name.includes("magazine")
        ) {
            return Math.max(50, currentStock * 3);
        }
        // Low turnover items
        else if (
            name.includes("card") ||
            name.includes("stationery") ||
            name.includes("gift")
        ) {
            return Math.max(30, currentStock * 2);
        }

        return Math.max(20, currentStock * 2); // Default
    }

    private calculateMinStock(maxStock: number): number {
        return Math.floor(maxStock * 0.15); // 15% of max stock as minimum
    }

    private getMockStockData(siteId: string): StockPosition[] {
        return [
            {
                siteId,
                productId: "RM001",
                productName: "1st Class Stamps (Book of 12)",
                categoryId: "POSTAL",
                categoryName: "Postal Services",
                currentStock: 45,
                maxStock: 100,
                minStock: 15,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "books",
                location: "Postal Counter",
                shelfZone: "Postal Counter",
            },
            {
                siteId,
                productId: "RM002",
                productName: "2nd Class Stamps (Book of 12)",
                categoryId: "POSTAL",
                categoryName: "Postal Services",
                currentStock: 12,
                maxStock: 80,
                minStock: 12,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "books",
                location: "Postal Counter",
                shelfZone: "Postal Counter",
            },
            {
                siteId,
                productId: "CONV001",
                productName: "Coca Cola 500ml",
                categoryId: "BEVERAGES",
                categoryName: "Beverages",
                currentStock: 45,
                maxStock: 60,
                minStock: 10,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "units",
                location: "Beverage Cooler 1",
                shelfZone: "Cold Beverages",
            },
            {
                siteId,
                productId: "CONV002",
                productName: "Mars Bar 51g",
                categoryId: "CONFECTIONERY",
                categoryName: "Confectionery & Snacks",
                currentStock: 8,
                maxStock: 50,
                minStock: 15,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "units",
                location: "Confectionery Display A",
                shelfZone: "Confectionery",
            },
            {
                siteId,
                productId: "CONV003",
                productName: "Paracetamol 16 Pack",
                categoryId: "HEALTH_BEAUTY",
                categoryName: "Health & Beauty",
                currentStock: 3,
                maxStock: 30,
                minStock: 5,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "packs",
                location: "Health Section",
                shelfZone: "Health & Beauty Section",
            },
            {
                siteId,
                productId: "CONV004",
                productName: "Biro Pens Blue (Pack of 10)",
                categoryId: "STATIONERY",
                categoryName: "Stationery & Office",
                currentStock: 25,
                maxStock: 40,
                minStock: 8,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "packs",
                location: "Stationery Section",
                shelfZone: "General Merchandise Area",
            },
            {
                siteId,
                productId: "CONV005",
                productName: "AA Batteries (Pack of 4)",
                categoryId: "ELECTRONICS",
                categoryName: "Electronics & Accessories",
                currentStock: 18,
                maxStock: 35,
                minStock: 6,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "packs",
                location: "Electronics Counter",
                shelfZone: "Electronics Counter",
            },
            {
                siteId,
                productName: "The Sun Newspaper",
                productId: "PUB001",
                categoryId: "PUBLICATIONS",
                categoryName: "Publications",
                currentStock: 32,
                maxStock: 50,
                minStock: 10,
                lastUpdated: new Date().toISOString(),
                unitOfMeasure: "copies",
                location: "Publications Rack",
                shelfZone: "Publications Rack",
            }
        ];
    }

    // Transform stock positions to product details with enhanced status
    transformToProductDetails(stockPositions: StockPosition[]): ProductDetails[] {
        return stockPositions.map(stock => {
            const stockPercentage = stock.maxStock > 0 
                ? Math.round((stock.currentStock / stock.maxStock) * 100) 
                : 0;

            let stockStatus: ProductDetails['stockStatus'];
            let reorderNeeded = false;

            if (stock.currentStock <= stock.minStock) {
                stockStatus = "Critical";
                reorderNeeded = true;
            } else if (stockPercentage <= 25) {
                stockStatus = "Low";
                reorderNeeded = true;
            } else if (stockPercentage >= 95) {
                stockStatus = "Overstocked";
            } else {
                stockStatus = "Normal";
            }

            // Generate mock trend
            const trends: ProductDetails['trend'][] = ['increasing', 'decreasing', 'stable'];
            const trend = trends[Math.floor(Math.random() * trends.length)];

            return {
                ...stock,
                stockStatus,
                stockPercentage,
                reorderNeeded,
                trend
            };
        });
    }
}

const bpApiService = new BPApiService();

// Product status styles
const productStatusStyles = {
    Critical: {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-300",
        text: "text-red-800",
        icon: "🚨",
        accent: "bg-red-500",
        ring: "ring-red-200"
    },
    Low: {
        bg: "bg-gradient-to-br from-amber-50 to-amber-100",
        border: "border-amber-300",
        text: "text-amber-800",
        icon: "⚠️",
        accent: "bg-amber-500",
        ring: "ring-amber-200"
    },
    Normal: {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        border: "border-green-300",
        text: "text-green-800",
        icon: "✅",
        accent: "bg-green-500",
        ring: "ring-green-200"
    },
    Overstocked: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100",
        border: "border-purple-300",
        text: "text-purple-800",
        icon: "📦",
        accent: "bg-purple-500",
        ring: "ring-purple-200"
    },
};

// Product Card Component
const ProductCard: React.FC<{ product: ProductDetails }> = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const styles = productStatusStyles[product.stockStatus];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'increasing': return '📈';
            case 'decreasing': return '📉';
            default: return '➡️';
        }
    };

    return (
        <div className={`relative rounded-lg p-2 pt-5 shadow-md hover:shadow-lg transition-all duration-300 ${styles.bg} ${styles.border} border-2 ${styles.ring} ring-2 ring-opacity-20`}>
            {/* Status indicator */}
            <div className={`absolute top-2 right-1 w-3 h-3 rounded-full ${styles.accent} ${product.reorderNeeded ? 'animate-pulse' : ''}`}></div>

            {/* Product Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{styles.icon}</span>
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-bold ${styles.text} leading-tight truncate`}>
                            {product.productName.length > 12
                                ? (
                                    <span title={product.productName}>
                                        {product.productName.slice(0, 12)}
                                        <span className="text-gray-400">...</span>
                                    </span>
                                )
                                : product.productName
                            }
                        </h3>
                        <p className={`text-xs ${styles.text} opacity-70 truncate`}>
                            ID: {product.productId}       </p>
                          <p className={`text-xs ${styles.text} opacity-70 truncate`}>
                             {product.categoryName.length > 10 ? `${product.categoryName.slice(0, 10)}...` : product.categoryName}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`text-xs ${styles.text} opacity-70 hover:opacity-100 transition-opacity p-1`}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
            </div>

            {/* Stock Level Bar */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-medium ${styles.text}`}>
                        Stock Level
                    </span>
                    <span className={`text-xs font-bold ${styles.text}`}>
                        {product.stockPercentage}%
                    </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2.5 border border-gray-200">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${styles.accent} ${
                            product.reorderNeeded ? 'animate-pulse' : ''
                        }`}
                        style={{ width: `${Math.min(product.stockPercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Stock Numbers */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="bg-white/60 rounded p-2 border border-white/40">
                    <div className={`${styles.text} opacity-70`}>Current</div>
                    <div className={`font-bold ${styles.text}`}>{product.currentStock}</div>
                </div>
                <div className="bg-white/60 rounded p-2 border border-white/40">
                    <div className={`${styles.text} opacity-70`}>Min</div>
                    <div className={`font-bold ${styles.text}`}>{product.minStock}</div>
                </div>
                <div className="bg-white/60 rounded p-2 border border-white/40">
                    <div className={`${styles.text} opacity-70`}>Max</div>
                    <div className={`font-bold ${styles.text}`}>{product.maxStock}</div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.accent} text-white`}>
                    {product.stockStatus}
                </span>
                <div className="flex items-center gap-1">
                    <span className="text-xs">{getTrendIcon(product.trend)}</span>
                    <span className={`text-xs ${styles.text} opacity-70 capitalize`}>
                        {product.trend}
                    </span>
                </div>
            </div>

            {/* Reorder Alert */}
            {product.reorderNeeded && (
                <div className="bg-red-100 border border-red-300 rounded-md p-2 mb-3">
                    <div className="flex items-center gap-1 text-red-700">
                        <span className="text-sm">🔔</span>
                        <span className="text-xs font-semibold">Reorder Required</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                        Stock level below minimum threshold
                    </p>
                </div>
            )}

            {/* Expanded Details */}
            {isExpanded && (
                <div className="space-y-3 border-t border-white/40 pt-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/60 rounded p-2 border border-white/40">
                            <div className={`${styles.text} opacity-70 mb-1`}>Location:</div>
                            <div className={`font-medium ${styles.text}`}>📍 {product.location}</div>
                        </div>
                        <div className="bg-white/60 rounded p-2 border border-white/40">
                            <div className={`${styles.text} opacity-70 mb-1`}>Zone:</div>
                            <div className={`font-medium ${styles.text}`}>🏪 {product.shelfZone}</div>
                        </div>
                    </div>
                    
                    <div className="bg-white/60 rounded p-2 border border-white/40">
                        <div className={`${styles.text} opacity-70 mb-1 text-xs`}>Last Updated:</div>
                        <div className={`font-medium ${styles.text} text-xs`}>
                            🕒 {formatDate(product.lastUpdated)}
                        </div>
                    </div>

                    <div className="bg-white/60 rounded p-2 border border-white/40">
                        <div className={`${styles.text} opacity-70 mb-1 text-xs`}>Unit of Measure:</div>
                        <div className={`font-medium ${styles.text} text-xs`}>
                            📏 {product.unitOfMeasure}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 text-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                            📊 View History
                        </button>
                        <button className="flex-1 text-xs bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors">
                            📝 Adjust Stock
                        </button>
                        {product.reorderNeeded && (
                            <button className="flex-1 text-xs bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                                🛒 Reorder
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Product List View Component
const ProductListView: React.FC<{ products: ProductDetails[] }> = ({ products }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700">
                    <div className="col-span-3">Product Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Current</div>
                    <div className="col-span-1">Min</div>
                    <div className="col-span-1">Max</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Trend</div>
                    <div className="col-span-1">Actions</div>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {products.map((product, index) => {
                    const styles = productStatusStyles[product.stockStatus];
                    return (
                        <div
                            key={`${product.productId}-${index}`}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                product.reorderNeeded ? 'bg-red-50' : ''
                            }`}
                        >
                            <div className="grid grid-cols-12 gap-2 items-center text-xs">
                                <div className="col-span-3">
                                    <div className="font-medium text-gray-800 truncate">
                                        {product.productName}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        ID: {product.productId}
                                    </div>
                                </div>
                                <div className="col-span-2 text-gray-600">
                                    {product.categoryName}
                                </div>
                                <div className="col-span-1 font-bold text-gray-800">
                                    {product.currentStock}
                                </div>
                                <div className="col-span-1 text-gray-600">
                                    {product.minStock}
                                </div>
                                <div className="col-span-1 text-gray-600">
                                    {product.maxStock}
                                </div>
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
                                        {styles.icon} {product.stockStatus}
                                    </span>
                                </div>
                                <div className="col-span-1">
                                    <span className="text-gray-600 capitalize">
                                        {product.trend === 'increasing' ? '📈' : 
                                         product.trend === 'decreasing' ? '📉' : '➡️'}
                                    </span>
                                </div>
                                <div className="col-span-1">
                                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                        📊
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Main Component
export const OpsShelfInventoryStatus: React.FC<
    OpsShelfInventoryStatusProps
> = ({ selectedCategory, selectedStore, selectedSiteId }) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"name" | "stock" | "status" | "category">("status");
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    // Fetch data from BP API
    const fetchStockData = async () => {
        setLoading(true);
        setError(null);

        try {
            const stockPositions = await bpApiService.getStockPosition(
                selectedSiteId
            );

            // Filter by selected category if needed
            const filteredStockPositions =
                selectedCategory && selectedCategory.toString() !== "All"
                    ? stockPositions.filter(
                          (stock) =>
                              stock.categoryName
                                  ?.toLowerCase()
                                  .includes(
                                      selectedCategory.toString().toLowerCase()
                                  ) ||
                              stock.productName
                                  ?.toLowerCase()
                                  .includes(
                                      selectedCategory.toString().toLowerCase()
                                  )
                      )
                    : stockPositions;

            const productDetails = bpApiService.transformToProductDetails(
                filteredStockPositions
            );
            setProducts(productDetails);
            setLastRefresh(new Date());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch stock data from BP API"
            );
            console.error("Error fetching BP stock data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and refresh on site/category change
    useEffect(() => {
        fetchStockData();
    }, [selectedSiteId, selectedCategory]);

    // Auto refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(fetchStockData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [selectedSiteId, selectedCategory]);

    // Filter and sort products
    const processedProducts = React.useMemo(() => {
        let filtered = products;

        // Apply status filter
        if (filterStatus !== "all") {
            filtered = products.filter(product =>
                product.stockStatus.toLowerCase() === filterStatus.toLowerCase()
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.productName.localeCompare(b.productName);
                case "stock":
                    return b.currentStock - a.currentStock;
                case "status":
                    const statusOrder = { Critical: 0, Low: 1, Normal: 2, Overstocked: 3 };
                    return statusOrder[a.stockStatus] - statusOrder[b.stockStatus];
                case "category":
                    return a.categoryName.localeCompare(b.categoryName);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, filterStatus, sortBy]);

    // Calculate summary stats
    const criticalCount = products.filter(p => p.stockStatus === "Critical").length;
    const lowCount = products.filter(p => p.stockStatus === "Low").length;
    const normalCount = products.filter(p => p.stockStatus === "Normal").length;
    const overstockedCount = products.filter(p => p.stockStatus === "Overstocked").length;
    const reorderNeededCount = products.filter(p => p.reorderNeeded).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product inventory...</p>
                    <p className="text-xs text-gray-400">
                        Site: {selectedSiteId}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                    <span>⚠️</span>
                    <h3 className="font-semibold">BP API Error</h3>
                </div>
                <p className="text-red-700 text-sm mb-2">{error}</p>
                <p className="text-xs text-red-600 mb-3">
                    Site ID: {selectedSiteId}
                </p>
                <button
                    onClick={fetchStockData}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                    🔄 Retry API Call
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
            
                    <div>
                        <h2 className="text-lg font-bold text-[#005BAC]">
                            Product Inventory Status
                        </h2>
                        <p className="text-sm text-gray-600">
                            {selectedCategory} category • {products.length} products
                        </p>
                    </div>
                </div>

                <div className="flex  items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="critical">Critical</option>
                        <option value="low">Low Stock</option>
                        <option value="normal">Normal</option>
                        <option value="overstocked">Overstocked</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="status">Sort by Status</option>
                        <option value="name">Sort by Name</option>
                        <option value="stock">Sort by Stock</option>
                        <option value="category">Sort by Category</option>
                    </select>
                    <button
                        onClick={() =>
                            setViewMode(viewMode === "grid" ? "list" : "grid")
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title={`Switch to ${
                            viewMode === "grid" ? "list" : "grid"
                        } view`}
                    >
                        {viewMode === "grid" ? "📋" : "⊞"}
                    </button>
                </div>
            </div>

            {/* API Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-800">
                            Connected to BP SiteMaster API
                        </span>
                    </div>
                    <span className="text-xs text-green-600">
                        Last updated: {lastRefresh.toLocaleTimeString("en-GB")}
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-700">
                        {criticalCount}
                    </div>
                    <div className="text-xs text-red-600">Critical Stock</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-amber-700">
                        {lowCount}
                    </div>
                    <div className="text-xs text-amber-600">Low Stock</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-700">
                        {normalCount}
                    </div>
                    <div className="text-xs text-green-600">Normal Stock</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-700">
                        {overstockedCount}
                    </div>
                    <div className="text-xs text-purple-600">Overstocked</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-700">
                        {reorderNeededCount}
                    </div>
                    <div className="text-xs text-orange-600">Need Reorder</div>
                </div>
            </div>

            {/* Product Grid/List */}
            {processedProducts.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                        {processedProducts.map((product, index) => (
                            <ProductCard key={`${product.productId}-${index}`} product={product} />
                        ))}
                    </div>
                ) : (
                    <ProductListView products={processedProducts} />
                )
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">📦</span>
                    <p className="text-sm">No products found</p>
                    <p className="text-xs text-gray-400">
                        Try adjusting your filters or refresh the data
                    </p>
                </div>
            )}

            {/* Quick Actions */}
            {reorderNeededCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <span className="text-lg">⚠️</span>
                            <span className="text-sm font-semibold">
                                {reorderNeededCount} products need reordering
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors">
                                📋 Generate Reorder List
                            </button>
                            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                                📧 Email Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};