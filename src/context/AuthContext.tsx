"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  loggedIn: boolean;
  username: string | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

// context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // state for tracking the information from the type
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // checks the login status of the user
  const refreshAuth = async () => {
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
      });

      // set the information if it is retrieved
      if (res.ok) {
        const data = await res.json();
        setLoggedIn(true);
        setUsername(data.username);
      } else {
        setLoggedIn(false);
        setUsername(null);
      }
    } catch {
      setLoggedIn(false);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, username, loading, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// allows authemtication information (i.e. type data) to be accessed easily
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};