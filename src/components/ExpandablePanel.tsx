import { useState } from "react";
import type { ReactNode } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { BsFillCaretUpFill } from "react-icons/bs";

interface ExpandablePanelProps {
  title?: string;
  caption?: ReactNode;
  recordCount?: number;
  className?: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export default function ExpandablePanel({
  title,
  caption,
  recordCount,
  className = "",
  defaultExpanded = false,
  children,
}: ExpandablePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const shouldShowChildren =
    expanded && (recordCount === undefined || recordCount > 0);

  return (
    <div
      className={`bg-gray-100 px-5 py-3 rounded-lg shadow-sm w-full ${className}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((s) => !s)}
        className="w-full flex items-center justify-between hover:cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex gap-2 items-center">
          {title && (
            <h2 className="text-xl font-extrabold text-purple-900">{title}</h2>
          )}
          {caption && <p className="text-purple-900 font-bold text-sm">{caption}</p>}
          {recordCount !== undefined && (
            <div className="text-sm text-gray-600">({recordCount})</div>
          )}
        </div>
        <div className="text-gray-500 ml-4">
          {expanded ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
        </div>
      </button>

      {shouldShowChildren && <>{children}</>}

      {expanded && recordCount === 0 && (
        <div className="mt-3 text-gray-600 text-sm">No data to display.</div>
      )}
    </div>
  );
}
