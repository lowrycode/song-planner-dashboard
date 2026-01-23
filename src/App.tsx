import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import DashboardLayout from "./layouts/DashboardLayout";
import SongLayout from "./layouts/SongLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RegisterSuccessPage from "./pages/RegisterSuccessPage.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import ComparePage from "./pages/ComparePage.tsx";
import SongSearchPage from "./pages/SongSearchPage.tsx";
import SongDetailsPage from "./pages/SongDetailsPage.tsx";
import AdminManageUsersPage from "./pages/AdminManageUsersPage.tsx";
import AdminManageUserPage from "./pages/AdminManageUserPage.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-success" element={<RegisterSuccessPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route element={<DashboardLayout />}>
              <Route element={<SongLayout />}>
                <Route path="/overview" element={<OverviewPage />} />
                <Route path="/songs/:songId" element={<SongDetailsPage />} />
                <Route path="/search" element={<SongSearchPage />} />
                <Route path="/compare" element={<ComparePage />} />
                {/* Add more protected pages here */}
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminManageUsersPage />} />
                <Route path="/admin/users/:userId" element={<AdminManageUserPage />} />
                {/* Add more admin pages here */}
              </Route>
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/logout" element={<LogoutPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
