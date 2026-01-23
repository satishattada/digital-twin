import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { StoreManagerDashboard } from "./components/StoreManagerDashboard";
import { OperationsManagerDashboard } from "./components/OperationsManagerDashboard";
import { RegionalManagerDashboard } from "./components/RegionalManagerDashboard";
import { FacilitiesManagerDashboard } from "./components/FacilitiesManagerDashboard";
import Store3DLayout from "./components/Store3DLayout";
import { Sidebar } from "./components/Sidebar";
import {
  Persona,
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
import { DailyDigestSidebar } from "./components/DailyDigestSidebar";
import { ShelfieModal } from "./components/ShelfieModal";

const App: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona>("Store Manager");
  const [selectedStore, setSelectedStore] = useState<string>("SHIRLEY SF CONNECT");
  const [selectedSiteId, setSelectedSiteId] = useState<string>('13001');

  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("Last 7 Days");
  const [show3DLayout, setShow3DLayout] = useState<boolean>(false);
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

  // Render dashboard based on active persona
  const renderDashboard = () => {
    switch (activePersona) {
      case "Store Manager":
        return (
          <StoreManagerDashboard
            selectedCategory={selectedCategory}
            recommendations={recommendations}
            onCreateTask={handleCreateTask}
            onIgnoreRecommendation={handleIgnoreRecommendation}
          />
        );
      case "Operations Manager":
        return (
          <OperationsManagerDashboard
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
        );
      case "Regional Manager":
        return (
          <RegionalManagerDashboard
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
        );
      case "Facilities Manager":
        return (
          <FacilitiesManagerDashboard
            selectedStore={selectedStore}
            selectedCategory={selectedCategory}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Unknown persona selected</p>
          </div>
        );
    }
  };

  return (
    <>
      <main className="bg-slate-200 min-h-screen w-full flex flex-col items-center font-sans">
        <div className="w-full max-w-[1600px] aspect-[16/9] bg-[#F3F4F6] shadow-2xl flex flex-col overflow-hidden h-[100vh]">
          <Header
            activePersona={activePersona}
            setActivePersona={setActivePersona}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTimePeriod={selectedTimePeriod}
            setSelectedTimePeriod={setSelectedTimePeriod}
            onDigestToggle={() => setDigestOpen(true)}
            onShelfieToggle={() => setShelfieOpen(true)}
          />
          <div className="flex flex-grow overflow-hidden">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              activePersona={activePersona}
              setActivePersona={setActivePersona}
              selectedStore={selectedStore}
              selectedSiteId={selectedSiteId}
              setSelectedSiteId={setSelectedSiteId}
              tasks={tasks}
              recommendations={recommendations}
              opsAlerts={opsAlerts}
              setSelectedStore={setSelectedStore}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
            />

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-grey-100">
              {renderDashboard()}
            </div>
          </div>
        </div>
      </main>
      <DailyDigestSidebar
        isOpen={isDigestOpen}
        onClose={() => setDigestOpen(false)}
        data={digestData}
      />
      <ShelfieModal
        isOpen={isShelfieOpen}
        onClose={() => setShelfieOpen(false)}
        onInitiateRestock={handleInitiateRestock}
      />
    </>
  );
};

export default App;