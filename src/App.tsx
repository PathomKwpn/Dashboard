import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { routes } from "@/router/routes";
import { useAppDispatch } from "@/store/hooks";
import { initializeAuthThunk } from "@/pages/Auth/auth.thunks";

function AppContent() {
  const dispatch = useAppDispatch();

  // Restore auth session from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element()} />
          ))}
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* 404 – catch all unknown paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return <AppContent />;
}

export default App;
