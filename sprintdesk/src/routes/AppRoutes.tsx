import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Board = lazy(() => import("../pages/Board/Board"));
const Notifications = lazy(
  () => import("../pages/Notifications/Notifications"),
);
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));

function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-sm text-slate-500">Loading page...</div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
