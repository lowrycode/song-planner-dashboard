import { useEffect, useState } from "react";
import { UserRoleLabels } from "../constants/user-role-labels";
import type { User, UserRole, Network, Church } from "../types/users";

/* ---------- Types ---------- */

interface AccountDetailsFormState {
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
  network_id: number;
  church_id: number;
}

interface AccountDetailsFormProps {
  initialData: User;
  adminNetworks: Network[];
  networkChurches: Church[];
  onSubmit: (data: AccountDetailsFormState) => void;
  submitting: boolean;
  error: string | null;
}

type FormItemProps = {
  label: string;
  children: React.ReactNode;
};

/* ---------- Helpers ---------- */

function FormItem({ label, children }: FormItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-gray-500 text-sm mb-1">{label}</div>
      {children}
    </div>
  );
}

/* ---------- Component ---------- */

export default function AccountDetailsForm({
  initialData,
  adminNetworks,
  networkChurches,
  onSubmit,
  submitting,
  error,
}: AccountDetailsFormProps) {
  const initialFormState: AccountDetailsFormState = {
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    username: initialData.username,
    role: initialData.role,
    network_id: initialData.network.id,
    church_id: initialData.church.id,
  };
  const [form, setForm] = useState<AccountDetailsFormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof AccountDetailsFormState, string>>
  >({});

  /* Reset form if initialData changes */
  useEffect(() => {
    setForm(initialFormState);
  }, [initialData]);

  function update<K extends keyof AccountDetailsFormState>(
    key: K,
    value: AccountDetailsFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(form: AccountDetailsFormState) {
    const errors: Partial<Record<keyof AccountDetailsFormState, string>> = {};

    if (!form.first_name.trim()) errors.first_name = "First name is required.";
    if (!form.last_name.trim()) errors.last_name = "Last name is required.";

    if (!form.username.trim()) {
      errors.username = "Username is required.";
    } else if (form.username.length < 5) {
      errors.username = "Username must be at least 5 characters.";
    } else if (form.username.length > 20) {
      errors.username = "Username cannot exceed 20 characters.";
    }

    if (!form.network_id) errors.network_id = "Network selection is required.";
    if (!form.church_id) errors.church_id = "Church selection is required.";
    if (!(form.role in UserRoleLabels)) errors.role = "Invalid user role.";

    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty) return;

    const errors = validate(form);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Don't submit if there are validation errors
      return;
    }

    onSubmit(form);
  }

  function handleReset() {
    setForm({
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      username: initialData.username,
      role: initialData.role,
      network_id: initialData.network.id,
      church_id: initialData.church.id,
    });
  }

  const isDirty =
    form.first_name !== initialFormState.first_name ||
    form.last_name !== initialFormState.last_name ||
    form.username !== initialFormState.username ||
    form.role !== initialFormState.role ||
    form.network_id !== initialFormState.network_id ||
    form.church_id !== initialFormState.church_id;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
      {/* Header */}
      <div className="flex w-full flex-wrap">
        <h2 className="whitespace-nowrap flex-1 text-lg font-bold text-gray-500 h-8">
          Account Details
        </h2>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isDirty || submitting}
            className={`px-3 py-1 rounded-md text-gray-50 transition
              ${
                isDirty
                  ? "bg-purple-900 hover:bg-purple-700 hover:cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Update
          </button>
          <button
            type="button"
            disabled={!isDirty || submitting}
            className={`px-3 py-1 rounded-md transition
              ${
                isDirty
                  ? "bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }
            `}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm mb-4">
          <ul className="list-disc list-inside">
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-1 justify-around flex-wrap gap-5">
        {/* First Name */}
        <FormItem label="First Name">
          <input
            type="text"
            value={form.first_name}
            disabled={submitting}
            onChange={(e) => update("first_name", e.target.value)}
            className="border border-gray-300 bg-white rounded px-2 py-1 w-32 text-center"
          />
        </FormItem>

        {/* Last Name */}
        <FormItem label="Last Name">
          <input
            type="text"
            value={form.last_name}
            disabled={submitting}
            onChange={(e) => update("last_name", e.target.value)}
            className="border border-gray-300 bg-white rounded px-2 py-1 w-32 text-center"
          />
        </FormItem>

        {/* Username */}
        <FormItem label="Username">
          <input
            type="text"
            value={form.username}
            disabled={submitting}
            onChange={(e) => update("username", e.target.value)}
            className="border border-gray-300 bg-white rounded px-2 py-1 w-32 text-center"
          />
        </FormItem>

        {/* Network */}
        <FormItem label="Network">
          <select
            value={form.network_id}
            disabled={submitting}
            onChange={(e) => update("network_id", Number(e.target.value))}
            className="border border-gray-300 bg-white rounded px-2 py-1 text-center hover:cursor-pointer"
          >
            {adminNetworks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </FormItem>

        {/* Church */}
        <FormItem label="Church">
          <select
            value={form.church_id}
            disabled={submitting}
            onChange={(e) => update("church_id", Number(e.target.value))}
            className="border border-gray-300 bg-white rounded px-2 py-1 text-center hover:cursor-pointer"
          >
            {networkChurches.map((church) => (
              <option key={church.id} value={church.id}>
                {church.name}
              </option>
            ))}
          </select>
        </FormItem>

        {/* Role */}
        <FormItem label="Role">
          <select
            value={form.role}
            disabled={submitting}
            onChange={(e) => update("role", Number(e.target.value) as UserRole)}
            className="border border-gray-300 bg-white rounded px-2 py-1 text-center hover:cursor-pointer"
          >
            {Object.entries(UserRoleLabels).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
        </FormItem>
      </div>
    </form>
  );
}
