import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import DashboardLayout from "./layouts/DashboardLayout";
import SongLayout from "./layouts/SongLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import SongSearchPage from "./pages/SongSearchPage.tsx";
import SongDetailsPage from "./pages/SongDetailsPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route element={<DashboardLayout />}>
            <Route element={<SongLayout />}>
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/songs/:song_id" element={<SongDetailsPage />} />
              <Route path="/search" element={<SongSearchPage />} />
              {/* Add more protected pages here */}
            </Route>
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
