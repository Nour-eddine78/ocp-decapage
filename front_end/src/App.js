import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./component/Auth/ProtectedRoute";

// Lazy load components
const Login = lazy(() => import("./component/Auth/Login"));
const ForgotPassword = lazy(() => import("./component/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./component/Auth/ResetPassword"));
const Signup = lazy(() => import("./component/Auth/Signup"));
const Dashboard = lazy(() => import("./component/Dashboard/Dashboard"));
const SuperadminDashboard = lazy(() => import("./component/Dashboard/SuperadminDashboard"));
const Machines = lazy(() => import("./component/Machines/Machines"));
const Operations = lazy(() => import("./component/Operations/Operations"));
const Incidents = lazy(() => import("./component/Incidents/Incidents"));
const Performances = lazy(() => import("./component/Performances/Performances"));
const Reports = lazy(() => import("./component/Reports/Reports"));
const Users = lazy(() => import("./component/Users/Users"));
const Unauthorized = lazy(() => import("./component/Common/Unauthorized"));
const NotFound = lazy(() => import("./component/Common/NotFound"));
const Accueil= lazy(() => import("./component/Accueil/Accueil"));
export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-purple-600 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-gray-600">Chargement...</span>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Operator", "Viewer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/Accueil"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager", "Operator", "Viewer"]}>
                <Accueil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Superadmin"]}>
                <SuperadminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machines"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager", "Operator", "Viewer"]}>
                <Machines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operations"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager", "Operator", "Viewer"]}>
                <Operations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager", "Operator", "Viewer"]}>
                <Incidents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performances"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager", "Operator", "Viewer"]}>
                <Performances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager", "Viewer"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Superadmin", "Admin", "Manager"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}