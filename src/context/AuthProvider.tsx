import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    isSidebarCollapsed,
    toggleSidebar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};