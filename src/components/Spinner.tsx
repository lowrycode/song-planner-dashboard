import { ClipLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex flex-col flex-1 gap-3 justify-center items-center text-center">
      <div>
      <ClipLoader color="#3b82f6" size={30} />
      <div className="text-sm text-gray-500">Loading..</div>

      </div>
    </div>
  );
}
