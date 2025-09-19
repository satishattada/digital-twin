import React, { useState } from "react";
import { Category, Insight, InsightStatus } from "../types";
import { MOCK_INSIGHTS_DATA } from "../constants";

type InsightsAndAlertsProps = {
  selectedCategory: Category;
};

const getStatusStyles = (status: InsightStatus) => {
  switch (status) {
    case "Urgent":
      return {
        border: "border-red-500",
        bg: "bg-red-50",
        text: "text-red-800",
        badge: "bg-red-500",
        icon: "🚨",
        pulse: "animate-pulse",
      };
    case "Pending":
      return {
        border: "border-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-800",
        badge: "bg-amber-500",
        icon: "⚠️",
        pulse: "",
      };
    case "Resolved":
      return {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-800",
        badge: "bg-green-500",
        icon: "✅",
        pulse: "",
      };
    default:
      return {
        border: "border-gray-300",
        bg: "bg-gray-50",
        text: "text-gray-800",
        badge: "bg-gray-500",
        icon: "ℹ️",
        pulse: "",
      };
  }
};

const getImpactColor = (impact: string) => {
  if (impact.startsWith("+")) return "font-bold text-green-600 ml-1";
  if (impact.startsWith("-")) return "font-bold text-red-600 ml-1";
  return "font-bold text-gray-800 ml-1";
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "inventory":
      return "📦";
    case "sales":
      return "💰";
    case "customer":
      return "👥";
    case "performance":
      return "📊";
    case "alert":
      return "🔔";
    default:
      return "💡";
  }
};

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const styles = getStatusStyles(insight.status);

  if (isDismissed) return null;

  return (
    <div
      className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-r-lg shadow-md hover:shadow-lg transition-all duration-300 ${styles.pulse}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{styles.icon}</span>
          <span className="text-lg">{getTypeIcon(insight.type)}</span>
          <h4 className={`font-bold text-sm ${styles.text}`}>
            {insight.title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${styles.badge}`}
          >
            {insight.status}
          </span>
          {insight.status !== "Resolved" && (
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-gray-600 text-sm"
              title="Dismiss"
            >
              ✖️
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {insight.description}
      </p>

      {insight.projectedImpact && (
        <div className="mb-3 p-2 bg-white/50 rounded-md border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 flex items-center">
            📈 Projected Impact:
            <span className={getImpactColor(insight.projectedImpact)}>
              {insight.projectedImpact}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            🕒 {insight.timestamp}
          </span>
          <span
            className={`font-semibold px-2 py-1 rounded-full ${
              (insight.type as string).toLowerCase() === "alert"
                ? "bg-red-100 text-red-700"
                : (insight.type as string).toLowerCase() === "sales"
                ? "bg-green-100 text-green-700"
                : (insight.type as string).toLowerCase() === "inventory"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {insight.type}
          </span>
        </div>
        {insight.status === "Urgent" && (
          <button className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Take Action
          </button>
        )}
      </div>
    </div>
  );
};

export const InsightsAndAlerts: React.FC<InsightsAndAlertsProps> = ({
  selectedCategory,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const insights = MOCK_INSIGHTS_DATA[selectedCategory];

  // Calculate summary stats
  const urgentCount = insights.filter((i) => i.status === "Urgent").length;
  const pendingCount = insights.filter((i) => i.status === "Pending").length;
  const resolvedCount = insights.filter((i) => i.status === "Resolved").length;

  // Filter insights
  const filteredInsights =
    filterStatus === "all"
      ? insights
      : insights.filter(
          (insight) => insight.status.toLowerCase() === filterStatus
        );

  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <h2 className="text-xl font-bold">Insights & Alerts</h2>
              <p className="text-slate-200 text-sm">
                Real-time monitoring for {selectedCategory}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{insights.length}</p>
            <p className="text-slate-200 text-sm">Total insights</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center justify-between relative">
            <span className="text-2xl animate-pulse indicator-icon">🚨</span>

            <div className="insight-count">
              <p className="text-red-600 text-sm font-medium">Urgent</p>
              <p className="text-2xl font-bold text-red-800">{urgentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-center justify-between relative">
            <span className="text-2xl indicator-icon">⚠️</span>

            <div className="insight-count">
              <p className="text-amber-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-amber-800">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center justify-between relative">
            <span className="text-2xl indicator-icon">✅</span>

            <div className="insight-count">
              <p className="text-green-600 text-sm font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-800">
                {resolvedCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between relative">
            <span className="text-2xl indicator-icon">⏱️</span>

            <div className="insight-count">
              <p className="text-blue-600 text-sm font-medium">Response Time</p>
              <p className="text-2xl font-bold text-blue-800">2.3h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center gap-4 mb-3">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All ({insights.length})</option>
              <option value="urgent">Urgent ({urgentCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="resolved">Resolved ({resolvedCount})</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              📧 Email Report
            </button>
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
              ✅ Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {filteredInsights.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-3">
              Showing {filteredInsights.length} of {insights.length} insights
            </div>
            {filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center">
              {insights.length === 0 ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    All Clear! 🎉
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No alerts for {selectedCategory}. Everything is running
                    smoothly.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md">
                    <p className="text-green-700 text-sm">
                      ✨ Our AI monitoring system is actively watching for any
                      issues.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-6xl mb-4">🔍</span>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filter to see more insights.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      {urgentCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <p className="font-bold text-red-800">Urgent Action Required</p>
              <p className="text-sm text-red-600">
                You have {urgentCount} urgent alert{urgentCount > 1 ? "s" : ""}{" "}
                that need immediate attention.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors">
            🚀 Address Now
          </button>
        </div>
      )}
    </div>
  );
};
