import { FaExclamationTriangle } from "react-icons/fa";

export default function NoAccessPermissions() {
  return (
    <div className="flex flex-col justify-center items-center h-full p-8 text-center">
      <FaExclamationTriangle fontSize={80} />
      <p className="text-2xl mt-4 mb-2">
        You do not have any access permissions
      </p>
      <p>Please contact your network admin.</p>
    </div>
  );
}
