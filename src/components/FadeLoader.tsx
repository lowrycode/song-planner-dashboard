import Spinner from "./Spinner";

interface FadeLoaderProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  minHeight?: string;
  className?: string;
}

export default function FadeLoader({
  loading,
  error,
  children,
  minHeight,
  className = "",
}: FadeLoaderProps) {
  return (
    <div className={`relative w-full ${minHeight ?? ""}`}>
      {/* Loading Spinner overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
          loading && !error
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <Spinner />
      </div>

      {/* Error overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out z-50 ${
          error
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="text-red-600 font-medium">{error}</div>
      </div>

      {/* Content wrapper with passed className */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          loading || error
            ? "opacity-0 pointer-events-none"
            : "opacity-100 visible"
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
