import React, { createContext, useState, useEffect, type ReactNode } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userLoading: boolean;
}

// Placeholder User type — adapt to your actual User shape
interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

// Create the context with an initial null value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include", // send cookies
        });
        console.log("AuthProvider /auth/me status:", response.status);

        if (!response.ok) {
          // Not authenticated or error, reset user to null
          setUser(null);
        } else {
          const data = await response.json();
          console.log("AuthProvider user data:", data);
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

  return (
    <AuthContext value={{ user, setUser, userLoading }}>
      {children}
    </AuthContext>
  );
}
