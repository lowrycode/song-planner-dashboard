import { useNavigate } from "react-router-dom";

function LogoutForm() {
  const navigate = useNavigate();

  async function handleLogout() {
    const refresh_token = localStorage.getItem("refresh_token");

    if (!refresh_token) {
      // No refresh token found, just redirect
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) {
        // You could handle errors here if you want
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Remove tokens from storage regardless
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

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
        Are you sure you wush to logout?
      </p>
      <button onClick={handleLogout} className="bg-purple-900 text-gray-100 px-6 py-2 rounded-md text-center hover:bg-purple-700 hover:cursor-pointer">
        Logout
      </button>
    </div>
  );
}

export default LogoutForm;
