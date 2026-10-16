import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await api.getCurrentUser();
      if (res && res.success) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn("Auth check error:", err.message);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res && res.success) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const signup = async (userData) => {
    const res = await api.signup(userData);
    if (res && res.success) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        checkAuth,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
