import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth-fetch";
import { AuthContext } from "../providers/AuthProvider";

export function useAuthFetch() {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setUser } = auth;

  return async function authFetchWithLogout(
    url: string,
    options?: RequestInit
  ) {
    try {
      return await authFetch(url, options);
    } catch (err) {
      setUser(null);
      navigate("/login", { replace: true });
      throw err;
    }
  };
}
