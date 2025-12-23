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
      className={`bg-gray-100 px-5 py-3 rounded-lg shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
