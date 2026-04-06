import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

const Badge = ({ type }) => {
  const configs = {
    pending:   { bg: "#fffbeb", color: "#d97706", border: "#fde68a",  label: "Chờ xử lý" },
    confirmed: { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd",  label: "Đã xác nhận" },
    shipping:  { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe",  label: "Đang giao" },
    delivered: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0",  label: "Hoàn thành" },
    cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca",  label: "Đã huỷ" },
  };
  const c = configs[type] || configs.pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: "4px 12px", borderRadius: "3px", fontSize: "11px", fontWeight: 700,
      letterSpacing: "0.5px",
    }}>
      {c.label}
    </span>
  );
};

const UserOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // FIX 1: Gọi đúng endpoint /my-orders thay vì /orders (route admin)
        const res = await fetch("https://vcrons.onrender.com/api/orders/my-orders", {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        // API /my-orders trả về array phẳng
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn hàng:", err);
        setError("Không thể tải đơn hàng: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "820px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 6px" }}>
              Tài khoản
            </p>
            <h2 style={{ fontSize: "24px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0, color: "#1a1a1a" }}>
              Lịch sử đơn hàng
            </h2>
          </div>
          <button onClick={() => navigate("/profile")} style={{
            background: "#fff", border: "1px solid #ddd", padding: "9px 18px",
            borderRadius: "4px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
            fontFamily: "inherit", color: "#444",
          }}>
            ← Về hồ sơ
          </button>
        </div>

        <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "32px", minHeight: "400px" }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</p>
              <p>Đang tải đơn hàng...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>❌</p>
              <p style={{ color: "#e60000", fontWeight: 600 }}>{error}</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: "16px", background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "3px", fontWeight: 700, cursor: "pointer" }}>
                Thử lại
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <p style={{ fontSize: "52px", marginBottom: "14px" }}>🛍️</p>
              <p style={{ fontSize: "16px", marginBottom: "6px", color: "#555" }}>Bạn chưa có đơn hàng nào.</p>
              <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "24px" }}>Hãy mua sắm và quay lại đây nhé!</p>
              <Link to="/product" style={{
                display: "inline-block", background: "#1a1a1a", color: "#fff",
                padding: "11px 28px", borderRadius: "3px", textDecoration: "none",
                fontWeight: 700, fontSize: "12px", letterSpacing: "2px",
              }}>
                MUA SẮM NGAY →
              </Link>
            </div>
          )}

          {/* Danh sách đơn hàng */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map(order => (
                <div
                  key={order._id}
                  style={{ border: "1px solid #efefef", borderRadius: "6px", overflow: "hidden", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  {/* Order header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", padding: "14px 20px", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 2px" }}>Mã đơn hàng</p>
                        <p style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
                          #{order.orderCode || order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 2px" }}>Ngày đặt</p>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#444", margin: 0 }}>
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 2px" }}>Thanh toán</p>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#555", margin: 0, textTransform: "uppercase" }}>
                          {order.payment}
                        </p>
                      </div>
                    </div>
                    <Badge type={order.status} />
                  </div>

                  {/* Order items */}
                  {/* FIX 2: Dùng orderItems thay vì items (đúng tên field trong MongoDB model) */}
                  <div style={{ padding: "16px 20px" }}>
                    {(order.orderItems || []).length === 0 && (
                      <p style={{ color: "#aaa", fontSize: "13px" }}>Không có thông tin sản phẩm.</p>
                    )}
                    {(order.orderItems || []).map((item, idx) => (
                      <div key={idx} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 0",
                        borderBottom: idx < order.orderItems.length - 1 ? "1px solid #f5f5f5" : "none",
                      }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          {/* Thumbnail */}
                          <div style={{
                            width: "48px", height: "48px", borderRadius: "3px",
                            background: "#f0f0f0", overflow: "hidden", flexShrink: 0,
                          }}>
                            {item.image && (
                              <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: "0 0 3px" }}>
                              {item.name}
                            </p>
                            <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
                              Màu: {item.color} · Size: EU {item.size} · SL: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order footer: tổng tiền */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px", borderTop: "1px solid #f0f0f0", background: "#fafafa",
                  }}>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      Giao tới: <strong style={{ color: "#555" }}>{order.shippingAddress?.province}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#666" }}>Tổng cộng:</span>
                      <span style={{ fontSize: "20px", fontWeight: 900, color: "#e60000" }}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;