import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen text-base">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(prev => !prev)}
      />
      <div className="bg-slate-200 w-screen overflow-y-auto">
        {/* Dashboard content */}
        <Outlet />
      </div>
    </div>
  );
}
