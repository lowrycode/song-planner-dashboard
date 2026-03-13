import { useEffect } from "react";
import type { User } from "../types/users";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  onSuccess: () => void;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  loading,
  error,
  success,
  onSuccess,
}: DeleteUserModalProps) {
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Confirm Delete
        </h3>
        {success ? (
          <div className="mb-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {success}
            </div>
          </div>
        ) : (
          <p className="mb-4">
            Are you sure you want to delete{" "}
            <strong>{user?.first_name} {user?.last_name}</strong>? This action cannot be
            undone.
          </p>
        )}
        {error && !success && (
          <div className="mb-2 text-red-600">{error}</div>
        )}
        {!success && (
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 border rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}