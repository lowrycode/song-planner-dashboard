import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { AuthUser } from "../types/users";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  userLoading: boolean;
  slowBackend: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [slowBackend, setSlowBackend] = useState(false);


  useEffect(() => {
    // Assume cold start if no response after 3s
    const timeout = setTimeout(() => {
      setSlowBackend(true);
    }, 3000);
    
    async function fetchCurrentUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          // Not authenticated or error, reset user to null
          setUser(null);
        } else {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      } finally {
        setSlowBackend(false); // reset just in case of re-fetch or retry
        setUserLoading(false);
      }
    }

    fetchCurrentUser();
    return () => clearTimeout(timeout); // cleanup if component unmounts
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      userLoading,
      slowBackend,
    }),
    [user, userLoading, slowBackend]
  );

  return <AuthContext value={contextValue}>
    {children}
  </AuthContext>;
}
