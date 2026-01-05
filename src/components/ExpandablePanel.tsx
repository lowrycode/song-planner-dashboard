import { useState } from "react";
import type { ReactNode } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { BsFillCaretUpFill } from "react-icons/bs";

interface ExpandablePanelProps {
  title: string;
  recordCount: number;
  className?: string;
  children: ReactNode;
}

export default function ExpandablePanel({
  title,
  recordCount,
  className = "",
  children,
}: ExpandablePanelProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`bg-gray-100 px-5 py-3 rounded-lg shadow-sm w-full ${className}`}>
      <button
        onClick={() => setExpanded((s) => !s)}
        className="w-full flex items-center justify-between hover:cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-extrabold text-purple-900">{title}</h2>
          <div className="text-sm text-gray-600">({recordCount})</div>
        </div>
        <div className="text-gray-500 ml-4">{expanded ? <BsFillCaretUpFill/> : <BsFillCaretDownFill/>}</div>
      </button>

      {expanded && recordCount > 0 && (
        <>
          {children}
        </>
      )}

      {expanded && recordCount === 0 && (
        <div className="mt-3 text-gray-600 text-sm">
          No data to display.
        </div>
      )}
    </div>
  );
}
