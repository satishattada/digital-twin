import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChatAssistant } from './components/ChatAssistant';
import { ControlTowerPage } from './pages/ControlTowerPage';
import { StrategyWorkbenchPage } from './pages/StrategyWorkbenchPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { GovernancePage } from './pages/GovernancePage';
import { AlertsPage } from './pages/AlertsPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { SupplierTowerPage } from './pages/SupplierTowerPage';
import { SupplierWorkbenchPage } from './pages/SupplierWorkbenchPage';
import { SupplierSimulatorPage } from './pages/SupplierSimulatorPage';
import { SupplierGovernancePage } from './pages/SupplierGovernancePage';
import { SupplierAlertsPage } from './pages/SupplierAlertsPage';
import { SupplierTasksPage } from './pages/SupplierTasksPage';
import { AIConsolePage } from './pages/AIConsolePage';
import { SupplierAIConsolePage } from './pages/SupplierAIConsolePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Asset Strategy Tower Routes */}
          <Route path="/" element={<ControlTowerPage />} />
          <Route path="/workbench" element={<StrategyWorkbenchPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/tasks" element={<MyTasksPage />} />
          
          {/* Supplier Performance Tower Routes */}
          <Route path="/supplier-tower" element={<SupplierTowerPage />} />
          <Route path="/supplier/workbench" element={<SupplierWorkbenchPage />} />
          <Route path="/supplier/simulator" element={<SupplierSimulatorPage />} />
          <Route path="/supplier/governance" element={<SupplierGovernancePage />} />
          <Route path="/supplier/alerts" element={<SupplierAlertsPage />} />
          <Route path="/supplier/tasks" element={<SupplierTasksPage />} />
          
          {/* AI Console */}
          <Route path="/ai-console" element={<AIConsolePage />} />
          <Route path="/supplier/ai-console" element={<SupplierAIConsolePage />} />
        </Routes>
      </Layout>
      <ChatAssistant />
    </BrowserRouter>
  );
};

export default App;
