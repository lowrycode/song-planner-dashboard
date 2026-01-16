import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
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
// import AdminPage from "./pages/AdminPage.tsx";
// import UserPermissionsPage from "./pages/UserPermissionsPage.tsx";

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
                <Route path="/songs/:song_id" element={<SongDetailsPage />} />
                <Route path="/search" element={<SongSearchPage />} />
                <Route path="/compare" element={<ComparePage />} />
                {/* Add more protected pages here */}
              </Route>
              {/* <Route path="/admin/users" element={<AdminPage />} /> */}
              {/* <Route
                path="/admin/users/:user_id"
                element={<UserPermissionsPage />}
              /> */}
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
