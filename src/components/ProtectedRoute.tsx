import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, userLoading } = useAuth();

  if (userLoading) {
    // Show placeholder until auth state is resolved
    return <div>Getting auth state...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
