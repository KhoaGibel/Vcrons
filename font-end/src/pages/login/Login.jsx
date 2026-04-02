import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../contexts/AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  
  // Lấy hàm login, loading và error từ AuthContext của Khoa
  const { login, loading, error } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("⚠ Vui lòng xác nhận bạn không phải là robot!");
      return;
    }

    // Đẩy thẳng email, pass cho AuthContext tự xử lý API
    const result = await login(email, password);

    if (result.success) {
      // Đăng nhập thành công -> check role trong localStorage để chuyển trang
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser?.role === "admin") {
        navigate("/admin"); // Chào mừng sếp
      } else {
        navigate("/"); // Khách thì về trang chủ
      }
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <div className="auth-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="auth-container" style={{ width: "100%", maxWidth: "420px", padding: "40px 30px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 className="auth-title" style={{ fontWeight: 900, fontSize: "28px", color: "#1a1a1a", letterSpacing: "1px", textTransform: "uppercase" }}>
            Sign In
          </h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Báo lỗi trực tiếp từ AuthContext */}
        {error && <div style={{ color: "#e60000", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "4px", marginBottom: "20px", fontSize: "13px", textAlign: "center", border: "1px solid #fecaca" }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="Nhập email của bạn"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>MẬT KHẨU</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Nhập mật khẩu"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onCaptchaChange}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="auth-btn"
            style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#666" : "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.3s" }}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#666" }}>
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;