import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

/**
 * AuthProvider - wraps the app and provides auth state + actions.
 * Persists user/token to localStorage for page refresh.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // check existing session on mount

  // On mount: restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Log in and persist token + user to localStorage.
   */
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const { token, ...userData } = data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  /**
   * Sign up a new user and auto-log-in.
   */
  const signup = async (name, email, password) => {
    const { data } = await authAPI.signup({ name, email, password });
    const { token, ...userData } = data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  /**
   * Log out — clear state and localStorage.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
