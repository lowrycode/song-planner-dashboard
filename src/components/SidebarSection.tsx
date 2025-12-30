import { NavLink } from "react-router-dom";

export default function SidebarSection({ title, links }: {
  title: string;
  links: { to: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-sm mb-2 text-gray-400">{title}</h2>
      <ul className="space-y-2">
        {links.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-x-3 hover:text-white ${
                  isActive ? "text-white font-semibold" : ""
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
