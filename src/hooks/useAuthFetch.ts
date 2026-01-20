import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth-fetch";
import { useAuth } from "./useAuth";

export function useAuthFetch() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
