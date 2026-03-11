// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken } from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch {}
    setAccessToken(null);
    setUser(null);
  }, []);

  // On page load: try to restore session via httpOnly cookie
  useEffect(() => {
    const restore = async () => {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.data.accessToken);
        const me = await api.get("/auth/me");
        setUser(me.data.data.user);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // Handle forced logout from axios interceptor
  useEffect(() => {
    const handle = () => { setUser(null); setAccessToken(null); };
    window.addEventListener("auth:logout", handle);
    return () => window.removeEventListener("auth:logout", handle);
  }, []);

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { accessToken, user: u } = res.data.data;
    setAccessToken(accessToken);
    setUser(u);
    return u;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, user: u } = res.data.data;
    setAccessToken(accessToken);
    setUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
