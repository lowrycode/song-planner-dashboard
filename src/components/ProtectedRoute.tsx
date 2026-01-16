import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

export default function ProtectedRoute() {
  const location = useLocation();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user, userLoading } = auth;

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
