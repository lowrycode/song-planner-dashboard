import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUnauthFetch } from "../hooks/useUnauthFetch";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const unauthFetch = useUnauthFetch();

  const { setUser } = useAuth();

  const redirectTo = location.state?.from?.pathname || "/overview";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
      const response = await unauthFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        credentials: "include", // allows cookies from backend
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.detail || "An error occurred.");
        return;
      }

      const meResponse = await unauthFetch("/auth/me", {
        credentials: "include",
      });

      if (!meResponse.ok) {
        setError(
          "Login succeeded but authentication failed. Please try again."
        );
        setUser(null);
        return;
      }

      const userData = await meResponse.json();
      setUser(userData);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login failed", err);
      setError("Login failed. Please try again.");
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-purple-950 text-center">
        Welcome
      </h1>
      <p className="text-gray-600 text-center text-sm">
        Login with your credentials
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
      <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
        <label htmlFor="username" className="text-purple-950 font-semibold">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="py-1 px-2 border border-purple-950"
        />
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
        />
        <button
          type="submit"
          className="bg-purple-900 mt-5 px-3 py-1.5 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer"
        >
          Log In
        </button>
        <p className="mt-3 text-end">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-purple-950">
            Sign up now
          </Link>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
