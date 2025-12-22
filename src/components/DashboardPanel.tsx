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
      className={`bg-gray-100 p-4 rounded-lg shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
