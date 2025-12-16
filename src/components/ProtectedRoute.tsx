import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  // Check if token exists in localStorage (or use context/state)
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  if (!isAuthenticated) {
    // Redirect to login page and save the page user wanted to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render child routes
  return <Outlet />;
}

export default ProtectedRoute;
