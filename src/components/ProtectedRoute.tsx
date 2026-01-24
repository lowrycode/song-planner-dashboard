import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, userLoading } = useAuth();

  // Show placeholder until auth state is resolved
  if (userLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <div className="relative">
          <Spinner message="Checking your session..." />
        </div>
      </div>
    );
  }

  // Not logged in, redirect to login
  if (!user) {
    // Remove logout page from redirect behaviour
    const from = location.pathname === "/logout" ? undefined : location;

    return <Navigate to="/login" state={from ? { from } : undefined} replace />;
  }

  return <Outlet />;
}
