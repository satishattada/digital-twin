import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { DailyDigestSidebar } from "../components/DailyDigestSidebar";
import { ShelfieModal } from "../components/ShelfieModal";
import { Persona, Category, Task, Recommendation, OpsAlert, DetectedItem } from "../types";

interface LayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
  tasks: Task[];
  recommendations: Recommendation[];
  opsAlerts: OpsAlert[];
  isDigestOpen: boolean;
  setDigestOpen: (open: boolean) => void;
  isShelfieOpen: boolean;
  setShelfieOpen: (open: boolean) => void;
  digestData: any;
  onInitiateRestock: (items: DetectedItem[]) => void;
}

const personaRouteMap: Record<Persona, string> = {
  "Store Manager": "/store-manager",
  "Operations Manager": "/operations-manager",
  "Regional Manager": "/regional-manager",
  "Site Manager": "/site-manager",
  "Digital Engineer": "/digital-engineer",
  "Asset Strategy": "/asset-strategy",
  "Supplier Performance": "/supplier-performance",
};

const routePersonaMap: Record<string, Persona> = {
  "/store-manager": "Store Manager",
  "/operations-manager": "Operations Manager",
  "/regional-manager": "Regional Manager",
  "/site-manager": "Site Manager",
  "/digital-engineer": "Digital Engineer",
  "/asset-strategy": "Asset Strategy",
  "/supplier-performance": "Supplier Performance",
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  selectedStore,
  setSelectedStore,
  selectedSiteId,
  setSelectedSiteId,
  selectedCategory,
  setSelectedCategory,
  selectedTimePeriod,
  setSelectedTimePeriod,
  tasks,
  recommendations,
  opsAlerts,
  isDigestOpen,
  setDigestOpen,
  isShelfieOpen,
  setShelfieOpen,
  digestData,
  onInitiateRestock,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePersona = routePersonaMap[location.pathname] || "Store Manager";

  const handleSetActivePersona = (persona: Persona) => {
    const route = personaRouteMap[persona];
    navigate(route);
  };

  return (
    <>
      <main className="bg-slate-200 min-h-screen w-full flex flex-col items-center font-sans">
        <div className="w-full max-w-[1600px] aspect-[16/9] bg-[#F3F4F6] shadow-2xl flex flex-col overflow-hidden h-[100vh]">
          <Header
            activePersona={activePersona}
            setActivePersona={handleSetActivePersona}
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
              setActivePersona={handleSetActivePersona}
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
              {children}
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
        onInitiateRestock={onInitiateRestock}
      />
    </>
  );
};
