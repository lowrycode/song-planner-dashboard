import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLoadingPage from "../pages/AuthLoadingPage";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, userLoading, slowBackend } = useAuth();

  let title = "Checking Your Session";
  let subTitle = "This should only take a moment";

  if (slowBackend) {
    title = "Loading the Dashboard";
    subTitle = "This should only take a few seconds";
  }
  // Show placeholder until auth state is resolved
  if (userLoading) {
    return <AuthLoadingPage title={title} subTitle={subTitle} />;
  }

  // Not logged in, redirect to login
  if (!user) {
    // Remove logout page from redirect behaviour
    const from = location.pathname === "/logout" ? undefined : location;

    return <Navigate to="/login" state={from ? { from } : undefined} replace />;
  }

  return <Outlet />;
}
