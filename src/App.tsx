import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import SongDetailsPage from "./pages/SongDetailsPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/song" element={<SongDetailsPage />} />
          {/* Add more protected pages here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
