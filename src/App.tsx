import React, { useState, useCallback, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { StoreManagerPage } from "./pages/StoreManagerPage";
import { OperationsManagerPage } from "./pages/OperationsManagerPage";
import { RegionalManagerPage } from "./pages/RegionalManagerPage";
import { FacilitiesManagerPage } from "./pages/FacilitiesManagerPage";
import { AssetDetailsPage } from "./pages/AssetDetailsPage";
import {
  Category,
  Recommendation,
  Task,
  OpsInsight,
  OpsAlert,
  DetectedItem,
} from "./types";
import {
  initialRecommendations,
  initialTasks,
  MOCK_OPS_DATA,
  MOCK_DAILY_DIGEST_DATA,
  MOCK_OPS_DAILY_DIGEST_DATA,
} from "./constants";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState<string>("SHIRLEY SF CONNECT");
  const [selectedSiteId, setSelectedSiteId] = useState<string>('13001');

  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("Last 7 Days");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    initialRecommendations
  );
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [opsInsights, setOpsInsights] = useState<OpsInsight[]>(
    MOCK_OPS_DATA[selectedCategory].insights
  );
  const [opsAlerts, setOpsAlerts] = useState<OpsAlert[]>(
    MOCK_OPS_DATA[selectedCategory].alerts
  );

  const [isDigestOpen, setDigestOpen] = useState(false);
  const [isShelfieOpen, setShelfieOpen] = useState(false);

  // Determine active persona based on route
  const activePersona = useMemo(() => {
    const path = location.pathname;
    if (path.includes("operations-manager")) return "Operations Manager";
    if (path.includes("regional-manager")) return "Regional Manager";
    if (path.includes("site-manager")) return "Site Manager";
    return "Store Manager";
  }, [location.pathname]);

  // Reset data when category changes for the Ops Manager
  useEffect(() => {
    if (activePersona === "Operations Manager") {
      setOpsInsights(MOCK_OPS_DATA[selectedCategory].insights);
      setOpsAlerts(MOCK_OPS_DATA[selectedCategory].alerts);
    }
  }, [selectedCategory, activePersona]);

  // Reset selected store when switching to/from Regional Manager
  useEffect(() => {
    if (activePersona === "Regional Manager") {
      setSelectedStore("All Stores");
      setSelectedTimePeriod("Last Month");
    } else if (selectedStore === "All Stores") {
      setSelectedStore("SHIRLEY SF CONNECT");
      setSelectedTimePeriod("Last 7 Days");
    }
  }, [activePersona, selectedStore]);

  const handleCreateTask = useCallback((rec: Recommendation) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      description: `Restock: ${rec.productName}`,
      details: `Restock SKU: ${rec.sku}. Suggested: ${rec.suggestedReorderQty}.`,
      status: "To Do",
      type: "Restocking",
      priority: "High",
      source: "Store Manager",
      category: rec.category,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setRecommendations((prevRecs) => prevRecs.filter((r) => r.id !== rec.id));
  }, []);

  const handleCreateTaskFromInsight = useCallback(
    (insight: OpsInsight) => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        description: insight.action,
        details: insight.title,
        status: "To Do",
        type: "Investigation",
        priority: "Medium",
        source: "Autonomous",
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setTasks((prev) => [newTask, ...prev]);
      setOpsInsights((prev) => prev.filter((i) => i.id !== insight.id));
    },
    [selectedCategory]
  );

  const handleInitiateRestock = useCallback(
    (itemsToRestock: DetectedItem[]) => {
      const newTasks: Task[] = itemsToRestock.map((item) => ({
        id: `task-shelfie-${Date.now()}-${item.id}`,
        description:
          item.type === "low"
            ? `Restock low item: ${item.label}`
            : `Restock empty slot: ${item.label}`,
        details: item.tooltip,
        status: "To Do",
        type: "Restocking",
        priority: "High",
        source: "Autonomous",
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setTasks((prevTasks) => [...newTasks, ...prevTasks]);
    },
    [selectedCategory]
  );

  const handleIgnoreInsight = useCallback((id: number) => {
    setOpsInsights((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleDismissAlert = useCallback((id: number) => {
    setOpsAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleIgnoreRecommendation = useCallback((id: string) => {
    setRecommendations((prevRecs) => prevRecs.filter((r) => r.id !== id));
  }, []);

  const digestData = useMemo(() => {
    return activePersona === "Store Manager"
      ? MOCK_DAILY_DIGEST_DATA
      : MOCK_OPS_DAILY_DIGEST_DATA;
  }, [activePersona]);

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      selectedStore={selectedStore}
      setSelectedStore={setSelectedStore}
      selectedSiteId={selectedSiteId}
      setSelectedSiteId={setSelectedSiteId}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedTimePeriod={selectedTimePeriod}
      setSelectedTimePeriod={setSelectedTimePeriod}
      tasks={tasks}
      recommendations={recommendations}
      opsAlerts={opsAlerts}
      isDigestOpen={isDigestOpen}
      setDigestOpen={setDigestOpen}
      isShelfieOpen={isShelfieOpen}
      setShelfieOpen={setShelfieOpen}
      digestData={digestData}
      onInitiateRestock={handleInitiateRestock}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/store-manager" replace />} />
        <Route
          path="/store-manager"
          element={
            <StoreManagerPage
              selectedCategory={selectedCategory}
              recommendations={recommendations}
              onCreateTask={handleCreateTask}
              onIgnoreRecommendation={handleIgnoreRecommendation}
            />
          }
        />
        <Route
          path="/operations-manager"
          element={
            <OperationsManagerPage
              tasks={tasks}
              setTasks={setTasks}
              selectedCategory={selectedCategory}
              selectedStore={selectedStore}
              selectedSiteId={selectedSiteId}
              selectedTimePeriod={selectedTimePeriod}
              insights={opsInsights}
              alerts={opsAlerts}
              onCreateTaskFromInsight={handleCreateTaskFromInsight}
              onIgnoreInsight={handleIgnoreInsight}
              onDismissAlert={handleDismissAlert}
            />
          }
        />
        <Route
          path="/regional-manager"
          element={
            <RegionalManagerPage
              selectedStore={selectedStore}
              selectedCategory={selectedCategory}
              selectedTimePeriod={selectedTimePeriod}
              tasks={tasks}
              recommendations={recommendations}
              insights={opsInsights}
              alerts={opsAlerts}
              onCreateTask={handleCreateTask}
              onIgnoreRecommendation={handleIgnoreRecommendation}
            />
          }
        />  
        <Route
          path="/site-manager"
          element={
            <FacilitiesManagerPage
              selectedStore={selectedStore}
              selectedCategory={selectedCategory}
            />
          }
        />
        <Route
          path="/digital-engineer"
          element={
            <FacilitiesManagerPage
              selectedStore={selectedStore}
              selectedCategory={selectedCategory}
            />
          }
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/asset/:assetId" element={<AssetDetailsPage />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;