import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import BeneficiaryDetail from './pages/BeneficiaryDetail';
import RationShops from './pages/RationShops';
import RationShopDetail from './pages/RationShopDetail';
import Godowns from './pages/Godowns';
import Inventory from './pages/Inventory';
import Dispatch from './pages/Dispatch';
import Receipts from './pages/Receipts';
import Distributions from './pages/Distributions';
import Alerts from './pages/Alerts';
import AlertDetail from './pages/AlertDetail';
import AiAudit from './pages/AiAudit';
import AiAssistant from './pages/AiAssistant';
import Documents from './pages/Documents';
import AuditLogs from './pages/AuditLogs';
import HierarchyExplorer from './pages/HierarchyExplorer';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import WarehouseConsole from './pages/WarehouseConsole';
import TransporterConsole from './pages/TransporterConsole';
import Complaints from './pages/Complaints';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Dashboard Workspaces */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hierarchy" element={<HierarchyExplorer />} />
            <Route path="/citizen-portal" element={<BeneficiaryPortal />} />
            <Route path="/warehouse-ops" element={<WarehouseConsole />} />
            <Route path="/transporter-ops" element={<TransporterConsole />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/beneficiaries/:id" element={<BeneficiaryDetail />} />
            <Route path="/ration-shops" element={<RationShops />} />
            <Route path="/ration-shops/:id" element={<RationShopDetail />} />
            <Route path="/godowns" element={<Godowns />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/distributions" element={<Distributions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/alerts/:id" element={<AlertDetail />} />
            <Route path="/audit" element={<AiAudit />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>

          {/* Safe Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
