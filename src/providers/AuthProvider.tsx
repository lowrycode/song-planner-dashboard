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

  useEffect(() => {
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
        setUserLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      userLoading,
    }),
    [user, userLoading]
  );

  return <AuthContext value={contextValue}>
    {children}
  </AuthContext>;
}
