/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { getMyInfo, login as loginService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await loginService({ username, password });

      const token = res?.result?.token;
      if (!token) throw new Error("No token returned from server.");

      const decoded = jwtDecode(token);
      const roles = decoded.scope ? decoded.scope.split(" ") : [];
      const userData = {
        username: decoded.sub,
        roles,
        exp: decoded.exp,
      };

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  };

  const adminLogin = async (username, password) => {
    try {
      setLoading(true);
      const res = await loginService({ username, password });

      const token = res?.result?.token;
      if (!token) throw new Error("No token returned from server.");

      const decoded = jwtDecode(token);
      const roles = decoded.scope ? decoded.scope.split(" ") : [];
      const userData = {
        username: decoded.sub,
        roles,
        exp: decoded.exp,
      };

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);

      if (roles.includes("ROLE_ADMIN")) {
        message.success("Welcome admin! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        alert("You do not have access!");
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired. Logging out...");
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    adminLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
