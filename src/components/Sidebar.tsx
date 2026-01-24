import { MdSpaceDashboard } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsCircleHalf } from "react-icons/bs";
import { FaUnlock } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import SidebarSection from "./SidebarSection";
import { useAuth } from "../hooks/useAuth";


export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = (user?.role === "admin");

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
      className="w-48 bg-gray-900 text-gray-200 p-4"
      aria-label="Main navigation"
    >
      <header className="flex items-center justify-center">
        <img src="/images/ccnetwork_logo.png" alt="CCN logo" />
      </header>

      <SidebarSection title="DASHBOARD" links={dashboardLinks} />
      {isAdmin && <SidebarSection title="ADMIN" links={adminLinks} />}
      <SidebarSection title="ACCOUNT" links={accountLinks} />
    </nav>
  );
}
