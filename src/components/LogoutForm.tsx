import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth-fetch";
import { AuthContext } from "../providers/AuthProvider";

function LogoutForm() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setUser } = auth;

  async function handleLogout() {
    try {
      const response = await authFetch("/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      // Redirect to login page
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-950 text-center mb-4">
        Logout
      </h1>
      <p className="text-gray-600 text-center text-sm mb-8">
        Are you sure you wish to logout?
      </p>
      <button
        onClick={handleLogout}
        className="bg-purple-900 text-gray-100 px-6 py-2 rounded-md text-center hover:bg-purple-700 hover:cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutForm;
