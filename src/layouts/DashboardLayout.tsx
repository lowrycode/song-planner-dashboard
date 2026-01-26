import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileTopBar from "../components/MobileTopBar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile Top Bar */}
      <MobileTopBar setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex flex-1 h-screen text-base">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggle={() => setCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="bg-slate-200 w-screen overflow-y-auto">
          {/* Dashboard content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
