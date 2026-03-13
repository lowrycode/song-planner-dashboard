interface DeleteUserFormProps {
  onDeleteClick: () => void;
}

export default function DeleteUserForm({ onDeleteClick }: DeleteUserFormProps) {
  return (
    <div className="flex flex-1 min-w-42 flex-col items-start gap-2">
      <h3 className="text-lg font-bold text-red-700">Delete User</h3>
      <p className="text-sm text-gray-600">
        This action is irreversible. The user will lose all access.
      </p>
      <button
        onClick={onDeleteClick}
        className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-500"
      >
        Delete User
      </button>
    </div>
  );
}