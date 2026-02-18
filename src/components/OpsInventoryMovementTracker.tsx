import React, { useState, useMemo, useEffect } from "react";
import { Category, InventoryMovementEvent } from "../types";
import { MOCK_OPS_DATA } from "../constants";
import siteProductsData from "./../../site-products.json";
import productsData from "./../../product-transaction.json";

type OpsInventoryMovementTrackerProps = {
    selectedCategory: Category;
    selectedSiteId: string;
    selectedTimePeriod: string;
};

// Process JSON data for weekly sales
const processWeeklySalesData = (jsonData: any[], category: string) => {
    const categoryData = jsonData.filter(
        (row: any) =>
            !row.category ||
            row.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryData.length === 0) {
        return Array(7)
            .fill(0)
            .map((_, i) => ({
                day: i + 1,
                sales: 0,
                dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            }));
    }

    // Initialize weekly data
    const weeklyData = Array(7)
        .fill(0)
        .map((_, i) => ({
            day: i + 1,
            sales: 0,
            dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        }));

    // Aggregate sales by day of week
    categoryData.forEach((row: any) => {
        const dateStr =
            row.date || row.timestamp || row.created_at || row.transaction_date;
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon=0, Sun=6
        const quantity = parseInt(row.quantity || row.qty || row.amount || "1");

        if (dayIndex >= 0 && dayIndex < 7) {
            weeklyData[dayIndex].sales += quantity;
        }
    });

    return weeklyData;
};

const processWeeklyProductSalesData = (selectedSiteId: string) => {
    const siteNode = siteProductsData.find(
        (site) => site.node.internalSiteID === selectedSiteId
    );
    const siteData = siteNode?.node?.physicalStoreProducts || [];
    const products: any = productsData;
    // Combine siteData and products based on rmi and inventory_item_id
    const combinedData = products?.map((product: any) => {
        const matchingSiteProduct = siteData.find(
            (siteProduct) =>
                siteProduct.product.rmi == product.inventory_item_id
        );

        return {
            ...product,
            productName: matchingSiteProduct?.product.name || "Unknown Product",
        };
    });

    console.log("Combined Product Data:", combinedData.length);
    const filteredData = combinedData.filter(
        (item: any) => item.productName !== "Unknown Product"
    );
    console.log(
        "Filtered out Unknown Product count:",
        combinedData.length - filteredData.length
    );
    return filteredData;

};

// Weekly Sales Bar Chart Component
const WeeklySalesChart: React.FC<{
    data: { day: number; sales: number; dayName: string }[];
    category: string;
}> = ({ data, category }) => {
    const svgBaseWidth = 600;
    const svgBaseHeight = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = svgBaseWidth - margin.left - margin.right;
    const height = svgBaseHeight - margin.top - margin.bottom;

    const [hoveredBar, setHoveredBar] = useState<{
        day: number;
        sales: number;
        dayName: string;
    } | null>(null);

    const maxSales = Math.max(...data.map((d) => d.sales), 10);
    const yAxisMax = Math.ceil(maxSales / 10) * 10;

    const barWidth = width / data.length - 10;
    const xScale = (index: number) =>
        index * (width / data.length) + width / data.length / 2 - barWidth / 2;
    const yScale = (value: number) => height - (value / yAxisMax) * height;

    const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
    const avgDailySales = totalSales / 7;
    const peakDay = data.reduce(
        (max, current) => (current.sales > max.sales ? current : max),
        data[0]
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#005BAC] flex items-center gap-2">
                        📊 Weekly Sales Overview
                    </h3>
                    <p className="text-sm text-gray-600">{category} category</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 blink-live-data">
                        {totalSales}
                    </div>
                    <div className="text-xs text-gray-500">
                        Total Weekly Sales
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium">
                        Avg Daily
                    </div>
                    <div className="text-lg font-bold text-blue-800">
                        {avgDailySales.toFixed(0)}
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <div className="text-xs text-green-600 font-medium">
                        Peak Day
                    </div>
                    <div className="text-lg font-bold text-green-800">
                        {peakDay.dayName}
                    </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                    <div className="text-xs text-purple-600 font-medium">
                        Peak Sales
                    </div>
                    <div className="text-lg font-bold text-purple-800">
                        {peakDay.sales}
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="relative">
                <svg
                    viewBox={`0 0 ${svgBaseWidth} ${svgBaseHeight}`}
                    className="w-full h-auto"
                >
                    <g transform={`translate(${margin.left},${margin.top})`}>
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                            <line
                                key={ratio}
                                x1="0"
                                y1={height * ratio}
                                x2={width}
                                y2={height * ratio}
                                className="stroke-gray-200"
                                strokeDasharray="2,2"
                            />
                        ))}

                        {/* Y-Axis */}
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2={height}
                            className="stroke-gray-300"
                            strokeWidth="2"
                        />
                        <text
                            x="-10"
                            y="5"
                            textAnchor="end"
                            className="text-xs fill-gray-600 font-medium"
                        >
                            {yAxisMax}
                        </text>
                        <text
                            x="-10"
                            y={height / 2}
                            textAnchor="end"
                            className="text-xs fill-gray-500"
                        >
                            {yAxisMax / 2}
                        </text>
                        <text
                            x="-10"
                            y={height}
                            textAnchor="end"
                            className="text-xs fill-gray-600 font-medium"
                        >
                            0
                        </text>

                        {/* X-Axis */}
                        <line
                            x1="0"
                            y1={height}
                            x2={width}
                            y2={height}
                            className="stroke-gray-300"
                            strokeWidth="2"
                        />

                        {/* Bars */}
                        {data.map((item, index) => {
                            const barHeight = height - yScale(item.sales);
                            const isHovered = hoveredBar?.day === item.day;
                            const isPeak = item.sales === peakDay.sales;

                            return (
                                <g key={item.day}>
                                    {/* Bar */}
                                    <rect
                                        x={xScale(index)}
                                        y={yScale(item.sales)}
                                        width={barWidth}
                                        height={barHeight}
                                        className={`transition-all cursor-pointer ${
                                            isPeak
                                                ? "fill-green-500"
                                                : "fill-blue-500"
                                        } ${
                                            isHovered
                                                ? "opacity-100"
                                                : "opacity-80"
                                        }`}
                                        rx="4"
                                        onMouseEnter={() => setHoveredBar(item)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    />

                                    {/* Sales value on top of bar */}
                                    {item.sales > 0 && (
                                        <text
                                            x={xScale(index) + barWidth / 2}
                                            y={yScale(item.sales) - 5}
                                            textAnchor="middle"
                                            className="text-xs font-bold fill-gray-700"
                                        >
                                            {item.sales}
                                        </text>
                                    )}

                                    {/* Day label */}
                                    <text
                                        x={xScale(index) + barWidth / 2}
                                        y={height + 20}
                                        textAnchor="middle"
                                        className={`text-sm font-semibold ${
                                            isPeak
                                                ? "fill-green-600"
                                                : "fill-gray-600"
                                        }`}
                                    >
                                        {item.dayName}
                                    </text>

                                    {/* Peak indicator */}
                                    {isPeak && (
                                        <text
                                            x={xScale(index) + barWidth / 2}
                                            y={yScale(item.sales) - 20}
                                            textAnchor="middle"
                                            className="text-lg"
                                        >
                                            🏆
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>

                {/* Hover Tooltip */}
                {hoveredBar && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium pointer-events-none z-10">
                        <div className="flex items-center gap-2">
                            <span>{hoveredBar.dayName}:</span>
                            <span className="text-green-300 font-bold">
                                {hoveredBar.sales} units
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MovementChart: React.FC<{
    productName: string;
    data: { value: number; day: number }[];
    events: InventoryMovementEvent[];
    color: string;
    chartType: "Top" | "Slow";
}> = ({ productName, data, events, color, chartType }) => {
    const svgBaseWidth = 280;
    const svgBaseHeight = 140;
    const margin = { top: 10, right: 15, bottom: 25, left: 35 };
    const width = svgBaseWidth - margin.left - margin.right;
    const height = svgBaseHeight - margin.top - margin.bottom;

    const [hoveredPoint, setHoveredPoint] = useState<{
        x: number;
        y: number;
        value: number;
        day: number;
        event?: string;
    } | null>(null);

    if (data.length === 0) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-4xl mb-2">📊</span>
                <p className="text-sm text-gray-500 font-medium">
                    No movement data available
                </p>
                <p className="text-xs text-gray-400">
                    Check back later for updates
                </p>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 0);
    const minValue = Math.min(...data.map((d) => d.value), 0);
    const yAxisMax = Math.ceil(maxValue / 10) * 10 || 10;
    const yAxisMin = Math.floor(minValue / 10) * 10;

    const dayDomain = [
        Math.min(...data.map((d) => d.day)),
        Math.max(...data.map((d) => d.day)),
    ];
    const dayCount = data.length;

    const xScale = (day: number) => {
        if (dayCount <= 1) return width / 2;
        const maxDay = dayDomain[1];
        const minDay = dayDomain[0];
        if (maxDay === minDay) return width / 2;
        return ((day - minDay) / (maxDay - minDay)) * width;
    };

    const yScale = (value: number) =>
        height - ((value - yAxisMin) / (yAxisMax - yAxisMin)) * height;

    // Create area path for filled chart
    const areaPath =
        data.length > 1
            ? `M${xScale(data[0].day)},${height} L` +
              data
                  .map((d) => `${xScale(d.day)},${yScale(d.value)}`)
                  .join(" L ") +
              ` L${xScale(data[data.length - 1].day)},${height} Z`
            : "";

    const linePath =
        data.length > 1
            ? "M" +
              data.map((d) => `${xScale(d.day)},${yScale(d.value)}`).join(" L ")
            : `M${xScale(data[0].day)},${yScale(data[0].value)} h0`;

    return (
        <div className="relative w-full flex-grow flex flex-col bg-white rounded-lg border border-gray-200 p-3">
            <svg
                viewBox={`0 0 ${svgBaseWidth} ${svgBaseHeight}`}
                onMouseLeave={() => setHoveredPoint(null)}
                className="w-full h-auto"
            >
                <defs>
                    <linearGradient
                        id={`gradient-${chartType}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={color.replace("bg-", "")}
                            stopOpacity="0.3"
                        />
                        <stop
                            offset="100%"
                            stopColor={color.replace("bg-", "")}
                            stopOpacity="0.05"
                        />
                    </linearGradient>
                </defs>

                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <line
                            key={ratio}
                            x1="0"
                            y1={height * ratio}
                            x2={width}
                            y2={height * ratio}
                            className="stroke-gray-100"
                            strokeDasharray="2,2"
                        />
                    ))}

                    {/* Y-Axis */}
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={height}
                        className="stroke-gray-300"
                        strokeWidth="1"
                    />
                    <text
                        x="-8"
                        y={yScale(yAxisMax) + 4}
                        textAnchor="end"
                        className="text-[10px] fill-gray-600 font-medium"
                    >
                        {yAxisMax}
                    </text>
                    <text
                        x="-8"
                        y={yScale(yAxisMax / 2) + 4}
                        textAnchor="end"
                        className="text-[10px] fill-gray-500"
                    >
                        {Math.round(yAxisMax / 2)}
                    </text>
                    <text
                        x="-8"
                        y={yScale(yAxisMin) + 4}
                        textAnchor="end"
                        className="text-[10px] fill-gray-600 font-medium"
                    >
                        {yAxisMin}
                    </text>

                    {/* X-Axis */}
                    <line
                        x1="0"
                        y1={height}
                        x2={width}
                        y2={height}
                        className="stroke-gray-300"
                        strokeWidth="1"
                    />
                    <text
                        x={xScale(dayDomain[0])}
                        y={height + 18}
                        textAnchor="middle"
                        className="text-[10px] fill-gray-600 font-medium"
                    >
                        Day {dayDomain[0]}
                    </text>
                    {dayCount > 1 && (
                        <text
                            x={xScale(dayDomain[1])}
                            y={height + 18}
                            textAnchor="middle"
                            className="text-[10px] fill-gray-600 font-medium"
                        >
                            Day {dayDomain[1]}
                        </text>
                    )}

                    {/* Area fill */}
                    {areaPath && (
                        <path
                            d={areaPath}
                            fill={`url(#gradient-${chartType})`}
                            className="opacity-60"
                        />
                    )}

                    {/* Line */}
                    <path
                        d={linePath}
                        className={`stroke-current ${color.replace(
                            "bg-",
                            "text-"
                        )}`}
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {data.map((item) => {
                        const event = events.find((e) => e.day === item.day);
                        const hasEvent = !!event;
                        return (
                            <g
                                key={item.day}
                                transform={`translate(${xScale(
                                    item.day
                                )}, ${yScale(item.value)})`}
                            >
                                {hasEvent && (
                                    <circle
                                        r="8"
                                        className="fill-yellow-300 stroke-yellow-500"
                                        strokeWidth="2"
                                        opacity="0.8"
                                    />
                                )}
                                <circle
                                    r={hasEvent ? "5" : "4"}
                                    className={`${color.replace(
                                        "bg-",
                                        "fill-"
                                    )} stroke-white`}
                                    strokeWidth="2"
                                />
                                <circle
                                    r="12"
                                    className="fill-transparent cursor-pointer hover:fill-gray-200 hover:fill-opacity-30"
                                    onMouseEnter={() =>
                                        setHoveredPoint({
                                            x:
                                                ((xScale(item.day) +
                                                    margin.left) /
                                                    svgBaseWidth) *
                                                100,
                                            y:
                                                ((yScale(item.value) +
                                                    margin.top) /
                                                    svgBaseHeight) *
                                                100,
                                            ...item,
                                            event: event?.description,
                                        })
                                    }
                                />
                            </g>
                        );
                    })}

                    {/* Event markers */}
                    {events.map((event) => {
                        const dataPoint = data.find((d) => d.day === event.day);
                        if (!dataPoint) return null;
                        return (
                            <g
                                key={event.day}
                                transform={`translate(${xScale(event.day)}, ${
                                    yScale(dataPoint.value) - 20
                                })`}
                            >
                                <text
                                    className="text-[10px] fill-orange-600 font-bold"
                                    textAnchor="middle"
                                >
                                    ⚡
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>

            {hoveredPoint && (
                <div
                    className="absolute p-2 px-3 text-xs bg-gray-900 text-white rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 z-10"
                    style={{
                        left: `${hoveredPoint.x}%`,
                        top: `${hoveredPoint.y}%`,
                        marginTop: "-15px",
                    }}
                >
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <span>📅 Day {hoveredPoint.day}</span>
                        <span className="text-green-300">
                            {hoveredPoint.value} units
                        </span>
                    </div>
                    {hoveredPoint.event && (
                        <div className="text-yellow-300 text-xs border-t border-gray-700 pt-1">
                            ⚡ {hoveredPoint.event}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const getProcessedData = (
    allData: number[],
    period: string
): { value: number; day: number }[] => {
    switch (period) {
        case "Last 24 Hours":
            if (allData.length === 0) return [];
            const lastDayIndex = allData.length - 1;
            return [{ value: allData[lastDayIndex], day: lastDayIndex + 1 }];
        case "Last 30 Days":
            const generated = [...allData];
            for (let i = allData.length; i < 30; i++) {
                const baseValue = generated[i - 1] || generated[0] || 50;
                const variation = (Math.random() - 0.45) * baseValue * 0.2;
                generated.push(Math.max(0, Math.round(baseValue + variation)));
            }
            return generated
                .slice(0, 30)
                .map((value, index) => ({ value, day: index + 1 }));
        case "Last 7 Days":
        default:
            return allData.map((value, index) => ({ value, day: index + 1 }));
    }
};

const TrendIndicator: React.FC<{
    data: { value: number }[];
    label: string;
}> = ({ data, label }) => {
    if (data.length < 2) return null;

    const trend = data[data.length - 1].value - data[0].value;
    const percentage =
        data[0].value !== 0
            ? ((trend / data[0].value) * 100).toFixed(1)
            : "0.0";

    if (trend > 0) {
        return (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <span className="text-sm">📈</span>
                <span className="text-xs font-bold">+{percentage}%</span>
            </div>
        );
    }
    if (trend < 0) {
        return (
            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <span className="text-sm">📉</span>
                <span className="text-xs font-bold">{percentage}%</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            <span className="text-sm">➡️</span>
            <span className="text-xs font-bold">Stable</span>
        </div>
    );
};

const MetricCard: React.FC<{
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: string;
}> = ({ title, value, subtitle, icon, color }) => (
    <div className={`${color} rounded-lg p-3 border-l-4 border-opacity-50`}>
        <div className="flex items-center justify-between mb-1">
            <span className="text-lg">{icon}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
        <div className="text-xs font-medium opacity-80">{title}</div>
        <div className="text-xs opacity-60">{subtitle}</div>
    </div>
);

export const OpsInventoryMovementTracker: React.FC<
    OpsInventoryMovementTrackerProps
> = ({ selectedCategory, selectedSiteId, selectedTimePeriod }) => {
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Top" | "Slow">("Top");
    processWeeklyProductSalesData(selectedSiteId);
    // Load JSON data
    useEffect(() => {
        const loadJSON = async () => {
            try {
                const response = await fetch("/sale-transactions.json");
                if (!response.ok) {
                    throw new Error("Failed to load JSON file");
                }
                const data = await response.json();
                const transactions = Array.isArray(data)
                    ? data
                    : data.transactions || data.sales || [];
                setJsonData(transactions);
            } catch (error) {
                console.error("Error loading JSON:", error);
                setJsonData([]);
            } finally {
                setLoading(false);
            }
        };

        loadJSON();
    }, []);

    // Process weekly sales data
    const weeklySalesData = useMemo(
        () => processWeeklySalesData(jsonData, selectedCategory),
        [jsonData, selectedCategory]
    );

    // Fix: Access data from correct structure in MOCK_OPS_DATA
    const opsData = MOCK_OPS_DATA[selectedCategory];
    const rawData =
        opsData && opsData?.inventoryMovement
            ? opsData?.inventoryMovement
            : {
                  fastMovers: { name: "No Data", data: [] },
                  slowMovers: { name: "No Data", data: [] },
                  anomaly: null,
                  aiInsight: "No data available for this category",
                  fastMoverEvents: [],
                  slowMoverEvents: [],
              };

    const processedFastMoverData = useMemo(
        () =>
            getProcessedData(
                rawData.fastMovers?.data || [],
                selectedTimePeriod
            ),
        [rawData.fastMovers?.data, selectedTimePeriod]
    );
    const processedSlowMoverData = useMemo(
        () =>
            getProcessedData(
                rawData.slowMovers?.data || [],
                selectedTimePeriod
            ),
        [rawData.slowMovers?.data, selectedTimePeriod]
    );

    const activeChartData =
        activeTab === "Top" ? processedFastMoverData : processedSlowMoverData;
    const activeProductName =
        activeTab === "Top"
            ? rawData.fastMovers?.name || "Unknown Product"
            : rawData.slowMovers?.name || "Unknown Product";
    const activeColor = activeTab === "Top" ? "bg-green-500" : "bg-amber-500";
    const activeEvents =
        activeTab === "Top"
            ? rawData.fastMoverEvents || []
            : rawData.slowMoverEvents || [];

    const avgSales =
        activeChartData.length > 0
            ? activeChartData.reduce((a, b) => a + b.value, 0) /
              activeChartData.length
            : 0;

    const totalSales = activeChartData.reduce((a, b) => a + b.value, 0);
    const peakDay =
        activeChartData.length > 0
            ? activeChartData.reduce(
                  (max, current) => (current.value > max.value ? current : max),
                  { value: 0, day: 0 }
              )
            : { value: 0, day: 0 };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p className="text-sm text-gray-600">
                        Loading sales data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
            {/* Weekly Sales Chart - NEW */}
            {selectedSiteId === "10491" && (
                <WeeklySalesChart
                    data={weeklySalesData}
                    category={selectedCategory}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <h2 className="text-lg font-bold text-[#005BAC]">
                            Inventory Movement Tracker
                        </h2>
                        <p className="text-sm text-gray-600">
                            {selectedCategory} • {selectedTimePeriod}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-800 blink-live-data">
                        {totalSales}
                    </div>
                    <div className="text-xs text-gray-500">
                        Total Units Moved
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
                <MetricCard
                    title="Average Daily"
                    value={avgSales.toFixed(0)}
                    subtitle="units per day"
                    icon="📈"
                    color="bg-blue-50 border-blue-300 text-blue-800"
                />
                <MetricCard
                    title="Peak Sales Day"
                    value={peakDay.day > 0 ? `Day ${peakDay.day}` : "N/A"}
                    subtitle={
                        peakDay.value > 0 ? `${peakDay.value} units` : "No data"
                    }
                    icon="🏆"
                    color="bg-green-50 border-green-300 text-green-800"
                />
                <MetricCard
                    title="Active Events"
                    value={activeEvents.length.toString()}
                    subtitle="this period"
                    icon="⚡"
                    color="bg-orange-50 border-orange-300 text-orange-800"
                />
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab("Top")}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                            activeTab === "Top"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        🚀 Top Movers
                    </button>
                    <button
                        onClick={() => setActiveTab("Slow")}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                            activeTab === "Slow"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        🐌 Slow Movers
                    </button>
                </div>

                <TrendIndicator data={activeChartData} label={activeTab} />
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {activeTab === "Top" ? "🥇" : "🔄"}{" "}
                            {activeProductName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Category leader in {selectedCategory.toLowerCase()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-800 blink-live-data">
                            {avgSales.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                            Avg Daily Units
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-grow min-h-0">
                <MovementChart
                    productName={activeProductName}
                    data={activeChartData}
                    events={activeEvents}
                    color={activeColor}
                    chartType={activeTab}
                />
            </div>

            {/* Events Summary */}
            {activeEvents.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-yellow-800 mb-2">
                        ⚡ Recent Events
                    </h4>
                    <div className="space-y-1">
                        {activeEvents.slice(0, 2).map((event, index) => (
                            <div
                                key={index}
                                className="text-xs text-yellow-700"
                            >
                                <span className="font-medium">
                                    Day {event.day}:
                                </span>{" "}
                                {event.description}
                            </div>
                        ))}
                        {activeEvents.length > 2 && (
                            <div className="text-xs text-yellow-600">
                                +{activeEvents.length - 2} more events
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Insight */}
            {rawData.aiInsight && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">
                        🤖 AI Insight
                    </h4>
                    <p className="text-xs text-blue-700">{rawData.aiInsight}</p>
                </div>
            )}
        </div>
    );
};
