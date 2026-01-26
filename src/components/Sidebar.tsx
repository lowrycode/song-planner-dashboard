import { MdSpaceDashboard } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsCircleHalf } from "react-icons/bs";
import { FaUnlock } from "react-icons/fa";
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled,
} from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import SidebarSection from "./SidebarSection";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onCloseMobile,
}: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const dashboardLinks = [
    { to: "/overview", icon: <MdSpaceDashboard />, label: "Overview" },
    { to: "/search", icon: <FaMagnifyingGlass />, label: "Search" },
    { to: "/compare", icon: <BsCircleHalf />, label: "Compare" },
  ];

  const adminLinks = [
    { to: "/admin/users", icon: <MdSpaceDashboard />, label: "Manage Users" },
  ];

  const accountLinks = [
    { to: "/change-password", icon: <FaUnlock />, label: "Change Password" },
    { to: "/logout", icon: <FiLogOut />, label: "Logout" },
  ];

  return (
    <nav
      className={`
        fixed md:static inset-y-0 left-0 z-40
        bg-gray-900 text-gray-200 p-4
        transition-transform duration-300
        flex flex-col
        ${collapsed ? "w-16" : "w-56"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      aria-label="Main navigation"
    >
      <header className="flex justify-center gap-3">
        <div className="flex justify-between items-center">
          {!collapsed && (
            <img
              src="/images/ccnetwork_logo.png"
              alt="CCN logo"
              className="w-3/4"
            />
          )}

          
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white text-2xl hidden md:block"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <TbLayoutSidebarLeftExpandFilled />
              ) : (
                <TbLayoutSidebarRightExpandFilled />
              )}
            </button>
          
        </div>
      </header>

      <SidebarSection
        title="DASHBOARD"
        links={dashboardLinks}
        collapsed={collapsed}
        onCloseMobile={onCloseMobile}
      />

      {isAdmin && (
        <SidebarSection
          title="ADMIN"
          links={adminLinks}
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
        />
      )}

      <div className="mt-auto pb-5">
        <SidebarSection
          title="ACCOUNT"
          links={accountLinks}
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
        />
      </div>
    </nav>
  );
}
