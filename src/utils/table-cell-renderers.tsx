import { Link } from "react-router-dom";

export function renderCell(value: any) {
  if (value && typeof value === "object" && "display" in value) {
    const content = <span title={value.hover}>{value.display}</span>;

    return value.to ? (
      <Link
        to={value.to}
        className="text-purple-900 font-semibold hover:underline"
      >
        {content}
      </Link>
    ) : (
      content
    );
  }

  return String(value);
}
