import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isSidebarCollapsed: boolean; 
  toggleSidebar: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isSidebarCollapsed: false,
  toggleSidebar: () => {},
});