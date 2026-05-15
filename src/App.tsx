import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { PageErrorBoundary } from "@/components/common/ErrorBoundary";
import { routes } from "@/router/routes";
import { useAppDispatch } from "@/store/hooks";
import { initializeAuthThunk } from "@/pages/Auth/auth.thunks";

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-xs text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

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

        {/* Protected routes (includes 404) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <PageErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Component />
                  </Suspense>
                </PageErrorBoundary>
              }
            />
          ))}
          {/* 404 — inside layout so sidebar/header stay visible */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return <AppContent />;
}

export default App;
