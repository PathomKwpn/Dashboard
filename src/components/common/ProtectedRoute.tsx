import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes. Redirects to /login if not authenticated.
 * Preserves the original location so we can redirect back after login.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  // While the auth state is being restored from storage, show a loader
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
