import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

const Badge = ({ type }) => {
  const configs = {
    pending: { bg: "#fffbeb", color: "#d97706", label: "Chờ xử lý" },
    shipping: { bg: "#eff6ff", color: "#2563eb", label: "Đang giao" },
    delivered: { bg: "#f0fdf4", color: "#16a34a", label: "Hoàn thành" },
    cancelled: { bg: "#fef2f2", color: "#dc2626", label: "Đã huỷ" },
  };
  const c = configs[type] || configs.pending;
  return <span style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: "3px", fontSize: "11px", fontWeight: 700 }}>{c.label}</span>;
};

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nếu chưa đăng nhập thì đá văng ra trang Login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Gọi API lấy đơn hàng (Bản fix lỗi ESLint cascading renders)
  useEffect(() => {
    const fetchOrders = async () => {
      // Chỉ chạy khi có user và đang ở đúng tab
      if (!user || activeTab !== "orders") return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        const allOrders = Array.isArray(data) ? data : [];
        // Lọc ra đúng đơn của mình dựa trên email
        const filtered = allOrders.filter(o => o.email === user.email);
        // Đảo ngược để đơn mới nhất lên đầu
        setMyOrders(filtered.reverse());
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, activeTab]);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", paddingBottom: "80px" }}>
      {/* Header Profile */}
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "40px 0" }}>
        <div className="container text-center">
          <div style={{ width: "80px", height: "80px", background: "#1a1a1a", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: 900, margin: "0 auto 16px" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a1a", margin: "0 0 8px", textTransform: "uppercase" }}>{user.name}</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>{user.email}</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* MENU TRÁI */}
          <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "16px 0" }}>
            {[
              { id: "orders", label: "Lịch sử đơn hàng", icon: "📦" },
              { id: "profile", label: "Thông tin cá nhân", icon: "👤" }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", textAlign: "left", padding: "14px 24px", background: activeTab === tab.id ? "#fafafa" : "#fff", border: "none", borderLeft: activeTab === tab.id ? "3px solid #1a1a1a" : "3px solid transparent", color: activeTab === tab.id ? "#1a1a1a" : "#666", fontSize: "14px", fontWeight: activeTab === tab.id ? 800 : 600, cursor: "pointer", display: "flex", gap: "12px", transition: "all 0.2s" }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
            <hr style={{ borderTop: "1px solid #efefef", margin: "16px 0" }} />
            <button onClick={() => { logout(); navigate("/login"); }} style={{ width: "100%", textAlign: "left", padding: "14px 24px", background: "#fff", border: "none", borderLeft: "3px solid transparent", color: "#e60000", fontSize: "14px", fontWeight: 800, cursor: "pointer", display: "flex", gap: "12px" }}>
              <span>🚪</span> Đăng xuất
            </button>
          </div>

          {/* NỘI DUNG PHẢI */}
          <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "32px", minHeight: "400px" }}>
            
            {/* TAB: LỊCH SỬ ĐƠN HÀNG */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Lịch sử đơn hàng</h2>
                {loading ? <p style={{ color: "#888" }}>Đang tải dữ liệu...</p> : myOrders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                    <p style={{ fontSize: "48px", marginBottom: "16px" }}>🛍️</p>
                    <p>Bạn chưa có đơn hàng nào tại VCRONS.</p>
                    <button onClick={() => navigate("/shop")} style={{ marginTop: "20px", background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "3px", fontWeight: 700, cursor: "pointer" }}>Mua sắm ngay</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {myOrders.map(order => (
                      <div key={order._id} style={{ border: "1px solid #efefef", borderRadius: "4px", padding: "24px", transition: "box-shadow 0.2s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #efefef", paddingBottom: "16px", marginBottom: "16px" }}>
                          <div>
                            <span style={{ fontSize: "13px", color: "#666", fontWeight: 700 }}>Mã đơn: #{order._id.slice(-6).toUpperCase()}</span>
                            <p style={{ fontSize: "11px", color: "#aaa", margin: "4px 0 0" }}>Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                          </div>
                          <Badge type={order.status} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {order.items?.map((item, idx) => (
                             <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                               <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{item.quantity}x {item.name} <span style={{color: "#999", fontSize: "12px", fontWeight: 400}}>(Size: {item.size})</span></span>
                               <span style={{ color: "#666" }}>{formatPrice(item.price * item.quantity)}</span>
                             </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #efefef", paddingTop: "16px", marginTop: "16px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 800 }}>Tổng giá trị:</span>
                          <span style={{ fontSize: "20px", fontWeight: 900, color: "#e60000" }}>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: THÔNG TIN CÁ NHÂN */}
            {activeTab === "profile" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Thông tin cá nhân</h2>
                <div style={{ display: "grid", gap: "24px", maxWidth: "450px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#999", marginBottom: "8px", textTransform: "uppercase" }}>Họ và tên</label>
                    <input type="text" value={user.name} readOnly style={{ width: "100%", padding: "14px 18px", border: "1px solid #eee", borderRadius: "3px", background: "#fcfcfc", color: "#1a1a1a", outline: "none", fontFamily: "inherit", fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#999", marginBottom: "8px", textTransform: "uppercase" }}>Email</label>
                    <input type="text" value={user.email} readOnly style={{ width: "100%", padding: "14px 18px", border: "1px solid #eee", borderRadius: "3px", background: "#fcfcfc", color: "#1a1a1a", outline: "none", fontFamily: "inherit", fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#999", marginBottom: "8px", textTransform: "uppercase" }}>Quyền hạn</label>
                    <div style={{ padding: "14px 18px", border: "1px solid #eee", borderRadius: "3px", background: "#fcfcfc" }}>
                        <span style={{ color: user.role === 'admin' ? "#e60000" : "#2563eb", fontWeight: 800, fontSize: "14px" }}>{user.role.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: "10px", padding: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "4px" }}>
                    <p style={{ fontSize: "13px", color: "#b91c1c", margin: 0 }}>Chức năng <strong>Đổi mật khẩu</strong> và <strong>Cập nhật hồ sơ</strong> hiện đang trong quá trình bảo trì để nâng cấp bảo mật.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;