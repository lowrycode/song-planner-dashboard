import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message = "Loading..." }: SpinnerProps) {
  return (
    <div className="flex flex-col flex-1 gap-3 justify-center items-center text-center">
      <ClipLoader color="#3b82f6" size={30} />
      <div className="text-sm text-gray-500">{message}</div>
    </div>
  );
}
