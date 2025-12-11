import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen text-base">
      <Sidebar />
      <div className="bg-slate-200 w-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
