import { NavLink } from "react-router-dom";

interface SidebarSectionProps {
  title?: string;
  links: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }[];
  collapsed: boolean;
  onCloseMobile: () => void;
}

export default function SidebarSection({
  title,
  links,
  collapsed,
  onCloseMobile,
}: SidebarSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="text-sm mb-2 text-gray-500 h-5">
        {!collapsed ? title : null}
      </h2>
      <ul>
        {links.map(({ to, icon, label }) => (
          <li
            key={to}
            title={collapsed ? label : undefined}
            className={collapsed ? "flex justify-center" : ""}
          >
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-1 items-center gap-x-3 border-t border-gray-700 py-2 text-gray-500 hover:text-white ${
                  isActive ? "text-white font-semibold" : ""}
                  ${collapsed ? "justify-center" : "justify-start"}
                }`
              }
              onClick={onCloseMobile}
            >
              <span className={collapsed ? "text-xl" : "text-lg"}>{icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
