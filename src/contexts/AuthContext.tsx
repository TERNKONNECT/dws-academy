import React, { createContext, useContext } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<User> => {
    return login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading: false,
        login: handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
