import React, { useState } from "react";
import { Link } from "react-router-dom";
// 1. Import thư viện ReCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. State để lưu trữ trạng thái xác thực của CAPTCHA
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 3. Kiểm tra xem người dùng đã tích CAPTCHA chưa
    if (!captchaToken) {
      alert("⚠ Vui lòng xác nhận bạn không phải là robot!");
      return;
    }

    console.log("Đăng nhập với:", email, password);
    console.log("Mã Token CAPTCHA an toàn:", captchaToken);
    // Xử lý API đăng nhập ở đây
  };

  // Hàm này tự động chạy khi người dùng tích xanh thành công
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>EMAIL HOẶC SỐ ĐIỆN THOẠI</label>
            <input 
              type="text" 
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

          {/* 4. Hiển thị ô Google reCAPTCHA */}
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
            <ReCAPTCHA
              // LƯU Ý: Đây là mã Site Key dùng thử của Google (Test Key).
              // Khi đưa web lên thực tế, bạn sẽ cần đăng ký Site Key riêng miễn phí từ Google.
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onCaptchaChange}
            />
          </div>

          <button 
            type="submit"
            className="auth-btn"
            style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s" }}
          >
            Đăng nhập
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