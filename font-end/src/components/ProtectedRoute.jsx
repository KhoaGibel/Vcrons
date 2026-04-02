import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Dẫn đúng đường dẫn file Context của bạn

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  // 1. Chưa đăng nhập -> Đá về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Yêu cầu quyền Admin nhưng user không phải Admin -> Đá về trang chủ
  if (adminOnly && !isAdmin) {
    alert("Bạn không có quyền truy cập trang Quản trị!");
    return <Navigate to="/" replace />;
  }

  // 3. Hợp lệ -> Cho phép đi tiếp vào component con
  return <Outlet />;
};