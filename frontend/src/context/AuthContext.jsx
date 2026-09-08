"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  clearToken,
  getToken,
  getMe,
  loginAdmin as loginAdminRequest,
  saveToken
} from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    getMe()
      .then((me) => {
        setAdmin(me);
      })
      .catch(() => {
        clearToken();
        setToken(null);
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(
    async (username, password) => {
      const data = await loginAdminRequest(username, password);
      saveToken(data.token);
      setToken(data.token);
      setAdmin({
        _id: data._id,
        username: data.username
      });
      return data;
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setAdmin(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ admin, token, loading, login, logout, isAuthenticated: Boolean(admin) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};