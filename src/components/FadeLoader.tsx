import Spinner from "./Spinner";

interface FadeLoaderProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  minHeight?: string;
}

export default function FadeLoader({
  loading,
  error,
  children,
  minHeight,
}: FadeLoaderProps) {
  return (
    <div
      className={`relative w-full ${
        minHeight ? minHeight : ""
      }`}
    >
      {/* Spinner overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
          loading
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <Spinner />
      </div>

      {/* Content */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          loading || error
            ? "opacity-0 pointer-events-none"
            : "opacity-100 visible"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
