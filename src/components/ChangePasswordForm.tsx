import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth_fetch";

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const current_password = (
      formData.get("current_password") as string
    ).trim();
    const new_password = (formData.get("new_password") as string).trim();
    const confirm_new_password = (
      formData.get("confirm_new_password") as string
    ).trim();

    try {
      const response = await authFetch(
        "http://localhost:8000/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password,
            new_password,
            confirm_new_password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // parse the response body
        switch (response.status) {
          case 400:
            if (errorData.detail === "Current password is incorrect") {
              setError("Current password is incorrect.");
            } else if (errorData.detail === "Passwords do not match") {
              setError("Passwords do not match.");
            } else {
              setError("Bad request. Please check your input.");
            }
            break;

          case 401:
            setError("Your session has expired. Please log in again.");
            break;

          case 409:
            setError(
              "New password must be different from your current password."
            );
            break;

          case 422:
            setError("Password does not meet the required format.");
            break;

          default:
            setError("Something went wrong. Please try again.");
        }

        return;
      }

      setSuccess("Password changed successfully");

      // Optional but recommended: log user out after password change
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Change password failed", err);
      setError("Change password failed. Please try again.");
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-purple-950 text-center">
        Change Password
      </h1>
      <p className="text-gray-600 text-center text-sm">
        Update your account password
      </p>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-5"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
        <label
          htmlFor="current_password"
          className="text-purple-950 font-semibold"
        >
          Current Password
        </label>
        <input
          type="password"
          name="current_password"
          id="current_password"
          className="py-1 px-2 border border-purple-950"
          required
        />

        <label
          htmlFor="new_password"
          className="text-purple-950 font-semibold mt-2"
        >
          New Password
        </label>
        <input
          type="password"
          name="new_password"
          id="new_password"
          className="py-1 px-2 border border-purple-950"
          required
        />

        <label
          htmlFor="confirm_new_password"
          className="text-purple-950 font-semibold mt-2"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirm_new_password"
          id="confirm_new_password"
          className="py-1 px-2 border border-purple-950"
          required
        />

        <button
          type="submit"
          className="bg-purple-900 mt-5 px-3 py-1.5 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer"
        >
          Change Password
        </button>
      </form>
    </>
  );
}
