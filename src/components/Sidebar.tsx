import { MdSpaceDashboard } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
// import { BsCircleHalf } from "react-icons/bs";
import { FaUnlock } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import SidebarSection from "./SidebarSection";

export default function Sidebar() {
  const dashboardLinks = [
    { to: "/overview", icon: <MdSpaceDashboard />, label: "Overview" },
    { to: "/search", icon: <FaMagnifyingGlass />, label: "Search" },
    // { to: "/compare", icon: <BsCircleHalf />, label: "Compare" },
  ];

  const accountLinks = [
    { to: "/change-password", icon: <FaUnlock />, label: "Change Password" },
    { to: "/logout", icon: <FiLogOut />, label: "Logout" },
  ];

  return (
    <nav className="w-48 bg-gray-900 text-gray-200 p-4" aria-label="Main navigation">
      <header className="flex items-center justify-center">
        <img src="/images/ccnetwork_logo.png" alt="CCN logo" />
      </header>

      <SidebarSection title="DASHBOARD" links={dashboardLinks} />
      <SidebarSection title="ACCOUNT" links={accountLinks} />
    </nav>
  );
}
