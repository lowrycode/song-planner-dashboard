import { MdSpaceDashboard } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbContrastFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="w-48 bg-gray-900 text-gray-200 p-4">
      <img src="/images/ccnetwork_logo.png" alt="CCN logo" />
      <div className="mt-10">
        <h2 className="text-sm mb-2">DASHBOARD</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-x-3">
            <MdSpaceDashboard />
            Overview
          </li>
          <li className="flex items-center gap-x-3">
            <FaMagnifyingGlass />
            Drilldown
          </li>
          <li className="flex items-center gap-x-3">
            <TbContrastFilled />
            Compare
          </li>
        </ul>
      </div>
      <div className="mt-10">
        <h2 className="text-sm mb-2">SETTINGS</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-x-3">
            <FaUser />
            Profile
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
