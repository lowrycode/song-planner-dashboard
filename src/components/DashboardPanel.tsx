import type { ReactNode } from "react";

interface DashboardPanelProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardPanel({
  children,
  className = "",
}: DashboardPanelProps) {
  return (
    <div
      className={`bg-gray-100 px-3 py-3 md:px-4 rounded-lg shadow-sm w-full ${className}`}
    >
      {children}
    </div>
  );
}
