import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Dẫn đúng đường dẫn

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { login, register, loading, error, user } = useAuth();
  const navigate = useNavigate();

  // Nếu lỡ đăng nhập rồi mà mò vào trang login thì đá về trang chủ hoặc admin
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        // Đăng nhập thành công -> Về trang chủ (ProtectedRoute sẽ tự lo việc cho Admin vào /admin)
        navigate("/"); 
      }
    } else {
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsLogin(true); // Chuyển sang form đăng nhập
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-black text-center mb-6 tracking-wider uppercase text-gray-900">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Họ Tên</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900" />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
            <input type="email" required placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Mật khẩu</label>
            <input type="password" required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3 rounded mt-2 hover:bg-gray-800 transition disabled:opacity-50">
            {loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-red-600 font-bold hover:underline">
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
};