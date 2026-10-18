import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
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
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="beneficiaries" element={<Beneficiaries />} />
            <Route path="beneficiaries/:id" element={<BeneficiaryDetail />} />
            <Route path="ration-shops" element={<RationShops />} />
            <Route path="ration-shops/:id" element={<RationShopDetail />} />
            <Route path="godowns" element={<Godowns />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="dispatch" element={<Dispatch />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="distributions" element={<Distributions />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetail />} />
            <Route path="audit" element={<AiAudit />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="documents" element={<Documents />} />
            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
