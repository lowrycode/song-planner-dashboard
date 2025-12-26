import type { ReactNode } from "react";

interface SongResourceItemProps {
  href: string | null;
  icon: ReactNode;
  label: string;
}

export default function SongResourceItem({
  href,
  icon,
  label,
}: SongResourceItemProps) {
  const isAvailable = Boolean(href);

  const baseClasses =
    "flex items-center gap-2 whitespace-nowrap transition-colors";
  const availableClasses =
    "text-purple-900 hover:text-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600";
  const unavailableClasses =
    "text-gray-400 cursor-not-allowed";

  return (
    <li>
      <a
        href={isAvailable ? href! : undefined}
        target={isAvailable ? "_blank" : undefined}
        rel={isAvailable ? "noopener noreferrer" : undefined}
        aria-disabled={!isAvailable}
        tabIndex={isAvailable ? 0 : -1}
        className={`${baseClasses} ${
          isAvailable ? availableClasses : unavailableClasses
        }`}
        title={isAvailable ? "Resource opens in a new tab" : "Resource not available"}
        onClick={(e) => {
          if (!isAvailable) e.preventDefault();
        }}
      >
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>

        {isAvailable && (
          <span className="sr-only"> (opens in a new tab)</span>
        )}
      </a>
    </li>
  );
}
