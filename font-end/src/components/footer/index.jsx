import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: Gọi API newsletter
    setSubscribed(true);
    setEmail("");
  };

  const links = {
    "Khám Phá": [
      { label: "Trang chủ", to: "/" },
      { label: "Sản phẩm", to: "/product" },
      { label: "Classic", to: "/classic" },
      { label: "Baya", to: "/baya" },
      { label: "Crush", to: "/crush" },
    ],
    "Hỗ Trợ": [
      { label: "Hướng dẫn chọn size", to: "/size-guide" },
      { label: "Chính sách đổi trả", to: "/return-policy" },
      { label: "Chính sách vận chuyển", to: "/shipping" },
      { label: "Câu hỏi thường gặp", to: "/faq" },
    ],
    "Công Ty": [
      { label: "Về chúng tôi", to: "/about" },
      { label: "Liên hệ", to: "/contact" },
      { label: "Điều khoản sử dụng", to: "/terms" },
      { label: "Chính sách bảo mật", to: "/privacy" },
    ],
  };

 const socials = [
    {
      name: "Threads",
      href: "https://www.threads.com/@vcrons.vn", // Điền link trang Threads của shop vào đây
      icon: (
        <svg width="18" height="18" viewBox="0 0 192 192" fill="currentColor">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.369C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0113 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0113 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/vcrons.vn/", // Đã thêm link Instagram
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@vcronsvn",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
        </svg>
      ),
    },
  ];

  return (
    // Thay đổi inline style thành className
    <footer className="footer-container" style={{ fontFamily: "'Lato', sans-serif", transition: "background-color 0.3s ease" }}>

      {/* --- NEWSLETTER STRIP (Giữ nguyên màu đỏ nổi bật) --- */}
      <div style={{ background: "#e60000", padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 4px" }}>
                Ưu đãi độc quyền
              </p>
              <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(18px, 2.5vw, 28px)", margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
                Đăng ký nhận thông tin
              </h3>
            </div>

            {subscribed ? (
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "1px" }}>
                ✓ Cảm ơn bạn đã đăng ký!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0", flexShrink: 0 }}>
                <input
                  type="email" placeholder="Địa chỉ email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="newsletter-input"
                  style={{ padding: "12px 20px", border: "none", borderRadius: "2px 0 0 2px", fontSize: "14px", width: "260px", outline: "none" }}
                />
                <button
                  type="submit" className="newsletter-btn"
                  style={{ padding: "12px 24px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "0 2px 2px 0", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Đăng Ký
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

{/* --- MAIN FOOTER BODY --- */}
      <div className="container" style={{ padding: "64px 15px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", flexWrap: "wrap" }}>

          {/* Brand column */}
          <div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="footer-title" style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase" }}>Vcrons</span>
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#e60000", letterSpacing: "4px", textTransform: "uppercase" }}> Vshop</span>
            </Link>
            <p className="footer-desc" style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.8", fontWeight: 500, maxWidth: "280px" }}>
              Chuyên phân phối dép Crocs chính hãng tại Việt Nam. Thoải mái — phong cách — bền bỉ.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {socials.map((s) => (
                <a
                  key={s.name} href={s.href} aria-label={s.name}
                  target="_blank" rel="noopener noreferrer"
                  className="footer-icon"
                  style={{ width: "42px", height: "42px", border: "2px solid", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s ease" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              {/* Tăng độ đậm tiêu đề cột lên 900 */}
              <h4 className="footer-title" style={{ fontWeight: 900, fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "24px" }}>
                {title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item.label} style={{ marginBottom: "12px" }}>
                    <Link to={item.to} className="footer-link" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "all 0.2s ease" }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Thông tin liên hệ nhanh - Làm đậm các icon và nhãn */}
        <div className="footer-bottom" style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid", display: "flex", gap: "40px", flexWrap: "wrap" }}>
          {[
            { icon: "📍", label: "Địa chỉ", value: "123 Đường ABC, Quận 1, TP. HCM" },
            { icon: "📞", label: "Hotline", value: "1800 - 0000" },
            { icon: "✉️", label: "Email", value: "support@vshop.vn" },
            { icon: "🕐", label: "Giờ làm việc", value: "T2 - T7: 8:00 - 20:00" },
          ].map((info) => (
            <div key={info.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span className="footer-info-icon" style={{ fontSize: "20px", filter: "brightness(1.2)" }}>{info.icon}</span>
              <div>
                <p className="footer-title" style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>{info.label}</p>
                <p className="footer-desc" style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="footer-bottom" style={{ borderTop: "1px solid", padding: "20px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
          
          <p className="footer-bottom-text" style={{ fontSize: "12px", margin: 0 }}>
            © {new Date().getFullYear()} Vcrons. Bảo lưu mọi quyền.
          </p>

          {/* KHU VỰC LOGO THANH TOÁN (Dùng CSS/SVG nội bộ - Tuyệt đối không bao giờ lỗi ảnh) */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            
            {/* Logo VISA */}
            <div style={{ background: "#fff", padding: "0 10px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", height: "30px", minWidth: "50px", justifyContent: "center" }}>
               <span style={{ color: "#1434CB", fontWeight: 900, fontStyle: "italic", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>VISA</span>
            </div>

            {/* Logo Mastercard (Vẽ bằng 2 hình tròn SVG) */}
            <div style={{ background: "#fff", padding: "0 10px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", height: "30px", minWidth: "50px", justifyContent: "center" }}>
               <svg width="26" height="16" viewBox="0 0 32 20">
                  <circle cx="10" cy="10" r="10" fill="#EB001B" />
                  <circle cx="22" cy="10" r="10" fill="#F79E1B" />
               </svg>
            </div>

            {/* Logo MoMo */}
            <div style={{ background: "#fff", padding: "0 10px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", height: "30px", minWidth: "50px", justifyContent: "center" }}>
               <span style={{ color: "#A50064", fontWeight: 800, fontSize: "15px", letterSpacing: "-0.5px", fontFamily: "Arial, sans-serif" }}>MoMo</span>
            </div>

            {/* Logo VNPAY */}
            <div style={{ background: "#fff", padding: "0 10px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", height: "30px", minWidth: "50px", justifyContent: "center" }}>
               <span style={{ fontWeight: 800, fontSize: "14px", fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}>
                  <span style={{ color: "#005BAA" }}>VN</span><span style={{ color: "#ED1C24" }}>PAY</span>
               </span>
            </div>

            {/* Badge COD */}
            <div style={{ background: "#fff", padding: "0 10px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", height: "30px", minWidth: "50px", justifyContent: "center" }}>
               <span style={{ fontSize: "13px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "1px", margin: 0 }}>COD</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;