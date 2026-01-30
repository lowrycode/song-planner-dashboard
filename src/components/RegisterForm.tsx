import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Network, Church } from "../pages/RegisterPage";
import { useUnauthFetch } from "../hooks/useUnauthFetch";

interface RegisterFormProps {
  networks: Network[];
  churches: Church[];
  selectedNetworkId: number | null;
  selectedChurchId: number | null;
  setSelectedNetworkId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedChurchId: React.Dispatch<React.SetStateAction<number | null>>;
  networksLoading: boolean;
  churchesLoading: boolean;
  networkError: string | null;
  churchError: string | null;
}

export default function RegisterForm({
  networks,
  churches,
  selectedNetworkId,
  selectedChurchId,
  setSelectedNetworkId,
  setSelectedChurchId,
  networksLoading,
  churchesLoading,
  networkError,
  churchError,
}: RegisterFormProps) {
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unauthFetch = useUnauthFetch();

  // Scroll to top whenever error is set
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const firstName = (formData.get("first-name") as string).trim();
    const lastName = (formData.get("last-name") as string).trim();
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();
    const confirmPassword = (formData.get("confirm-password") as string).trim();
    const network = formData.get("network") as string | null;
    const church = formData.get("church") as string | null;

    // Validation rules
    if (
      !firstName ||
      !lastName ||
      !username ||
      !password ||
      !network ||
      !church
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (username.length < 5) {
      setError("Username must be at least 5 characters long.");
      return;
    }
    if (username.length > 20) {
      setError("Username cannot exceed 20 characters.");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }
    if (password.length > 20) {
      setError("Password cannot exceed 20 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const body = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: password,
      confirm_password: confirmPassword,
      network_id: Number(network),
      church_id: Number(church),
    };

    try {
      await unauthFetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      navigate("/register-success");
    } catch (error: any) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-purple-950 text-center">
        Sign Up
      </h1>
      <p className="text-gray-600 text-center text-sm mt-2">
        Fill in the details below to register an account.
      </p>
      {error && (
        <div
          ref={errorRef}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
        <div className="flex w-full gap-4">
          <div className="flex flex-col flex-1 min-w-0">
            {/* First name */}
            <label
              htmlFor="first-name"
              className="text-purple-950 font-semibold"
            >
              First Name
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              className="py-1 px-2 border border-purple-950"
              required
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            {/* Last name */}
            <label
              htmlFor="last-name"
              className="text-purple-950 font-semibold"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              className="py-1 px-2 border border-purple-950"
              required
            />
          </div>
        </div>

        {/* Network */}
        <label htmlFor="network" className="text-purple-950 font-semibold mt-2">
          Network
        </label>
        <select
          id="network"
          name="network"
          className="py-1 px-2 border border-purple-950"
          value={selectedNetworkId ?? ""}
          onChange={(e) =>
            setSelectedNetworkId(e.target.value ? Number(e.target.value) : null)
          }
          disabled={networksLoading}
        >
          {networksLoading ? (
            <option>Loading networks…</option>
          ) : (
            <>
              <option value="" disabled>
                -- Select a network --
              </option>
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </>
          )}
        </select>
        {networkError && (
          <div
            className="text-red-600 text-sm mt-1"
            role="alert"
            aria-live="assertive"
          >
            {networkError}
          </div>
        )}

        {/* Church */}
        <label htmlFor="church" className="text-purple-950 font-semibold mt-2">
          Church
        </label>
        <select
          id="church"
          name="church"
          className="py-1 px-2 border border-purple-950"
          value={selectedChurchId ?? ""}
          onChange={(e) =>
            setSelectedChurchId(e.target.value ? Number(e.target.value) : null)
          }
          disabled={selectedNetworkId === null || churchesLoading}
        >
          {selectedNetworkId === null ? (
            <option>-- Select a network first --</option>
          ) : churchesLoading ? (
            <option>Loading churches…</option>
          ) : (
            <>
              <option value="" disabled>
                -- Select a church --
              </option>
              {churches.map((church) => (
                <option key={church.id} value={church.id}>
                  {church.name}
                </option>
              ))}
            </>
          )}
        </select>
        <div
          className="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="assertive"
        >
          {churchError}
        </div>

        {/* Username */}
        <label
          htmlFor="username"
          className="text-purple-950 font-semibold mt-8"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="py-1 px-2 border border-purple-950"
          required
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="text-purple-950 font-semibold mt-2"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="py-1 px-2 border border-purple-950"
          required
        />

        {/* Confirm password */}
        <label
          htmlFor="confirm-password"
          className="text-purple-950 font-semibold mt-2"
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          className="py-1 px-2 border border-purple-950"
          required
        />

        {/* Info */}
        <p className="text-gray-600 text-center text-sm mt-2 italic">
          NOTE: You will only gain access once a network admin has approved your
          account.
        </p>

        {/* Submit and link */}
        <button
          type="submit"
          disabled={!selectedNetworkId || !selectedChurchId}
          className="bg-purple-900 mt-5 px-3 py-1.5 text-gray-50 rounded-md
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:bg-purple-700"
        >
          Register Account
        </button>
        <p className="mt-3 text-end">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-950">
            Go to Login page
          </Link>
        </p>
      </form>
    </>
  );
}
