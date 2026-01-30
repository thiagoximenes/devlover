import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requireSubscription?: boolean;
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

export function ProtectedRoute({ 
  requireSubscription = false, 
  requireAdmin = false,
  children 
}: ProtectedRouteProps) {
  const { user, loading, hasActiveSubscription, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/select-plan" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
