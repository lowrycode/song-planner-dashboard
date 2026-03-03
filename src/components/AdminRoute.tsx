import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasRequiredRole } from "../utils/has-required-role";


export default function AdminRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!hasRequiredRole(user?.role, "admin")) {
    return <Navigate to="/overview" replace />;
  }

  return <Outlet />;
}
