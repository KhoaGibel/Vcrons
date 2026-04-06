import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      alert("Vui lòng đồng ý với các điều khoản!");
      return;
    }

    try {
      // Gọi API Đăng ký
      const response = await fetch("https://vcrons.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Đăng ký thành công thì chuyển qua trang Login
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="auth-container" style={{ width: "100%", maxWidth: "420px", padding: "40px 30px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 className="auth-title" style={{ fontWeight: 900, fontSize: "28px", color: "#1a1a1a", letterSpacing: "1px", textTransform: "uppercase" }}>
            Sign Up
          </h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>Tạo tài khoản để trải nghiệm mua sắm</p>
        </div>

        {/* Hiển thị lỗi */}
        {error && <div style={{ color: "#e60000", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "4px", marginBottom: "20px", fontSize: "13px", textAlign: "center", border: "1px solid #fecaca" }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>HỌ VÀ TÊN</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              placeholder="Nhập họ tên của bạn"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>SỐ ĐIỆN THOẠI</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="auth-input"
              placeholder="Nhập số điện thoại"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>MẬT KHẨU</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Tạo mật khẩu"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", outline: "none" }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <input 
              type="checkbox" 
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ marginTop: "3px", cursor: "pointer" }}
              required
            />
            <label htmlFor="terms" style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", cursor: "pointer", margin: 0 }}>
              Tôi đã đọc và đồng ý với các <Link to="#" style={{ color: "#1a1a1a", fontWeight: "bold" }}>Điều khoản dịch vụ</Link> và <Link to="#" style={{ color: "#1a1a1a", fontWeight: "bold" }}>Chính sách bảo mật</Link> của Vshop.
            </label>
          </div>

          <button 
            type="submit"
            className="auth-btn"
            style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s" }}
          >
            Đăng ký
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#666" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "none" }}>
            Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;