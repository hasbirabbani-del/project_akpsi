import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Toaster } from "./components/ui/toaster";
import Login from "./components/Login";
import Layout from "./components/Layout";
import SalesOrderPage from "./components/SalesOrderPage";
import Dashboard from "./components/Dashboard";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-order"
        element={
          <ProtectedRoute>
            <Layout>
              <SalesOrderPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <AppRoutes />
          <Toaster />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
