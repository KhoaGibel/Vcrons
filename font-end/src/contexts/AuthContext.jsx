/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khôi phục user từ localStorage khi load trang
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. ĐĂNG NHẬP
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại!";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // 2. ĐĂNG KÝ
  const register = async (name, email, password) => {
    setLoading(true);
    setError("");
    try {
      await authAPI.register({ name, email, password });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại!";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // 3. ĐĂNG XUẤT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng trong AuthProvider!");
  return ctx;
};