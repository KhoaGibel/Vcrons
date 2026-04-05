import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../api/api";
import api from "../../api/api";

const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: "#fffbeb", color: "#d97706", border: "#fde68a",  label: "Chờ xử lý" },
    confirmed: { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd",  label: "Đã xác nhận" },
    shipping:  { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe",  label: "Đang giao" },
    delivered: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0",  label: "Hoàn thành" },
    cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca",  label: "Đã huỷ" },
  };
  const c = map[status] || map.pending;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: "4px 10px", borderRadius: "3px", fontSize: "11px", fontWeight: 700 }}>
      {c.label}
    </span>
  );
};

const CANCEL_REASONS = [
  "Tôi muốn thay đổi sản phẩm",
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi tìm được nơi mua rẻ hơn",
  "Tôi đặt nhầm sản phẩm",
];

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Đơn hàng
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Modal huỷ
  const [cancelModal, setCancelModal] = useState(null); // { orderId, orderCode }
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setProfileForm({ name: user.name || "", phone: user.phone || "" });
    if (user.avatar) setAvatarPreview(user.avatar);
  }, [user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "orders" && orders.length === 0) fetchOrders();
  };

  // ── FETCH ĐƠN HÀNG ──
  const fetchOrders = async () => {
    setOrdersLoading(true); setOrdersError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrdersError("Không thể tải đơn hàng: " + err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ── HUỶ ĐƠN ──
  const handleCancelOrder = async () => {
    const finalReason = customReason.trim() || cancelReason || "Khách hàng huỷ đơn";
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/orders/${cancelModal.orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason: finalReason }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Huỷ đơn thất bại!");
      }
      setOrders(prev => prev.map(o => o._id === cancelModal.orderId ? { ...o, status: "cancelled", cancelReason: finalReason } : o));
      setCancelModal(null); setCancelReason(""); setCustomReason("");
      showToast("success", "Đã huỷ đơn hàng thành công!");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setCancelling(false);
    }
  };

  // ── AVATAR ──
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast("error", "Ảnh tối đa 3MB!"); return; }
    setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    setUploadingAvatar(true);
    try {
      const fd = new FormData(); fd.append("images", avatarFile);
      const res = await api.post("/products/upload-images", fd, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data.urls[0];
    } catch { showToast("error", "Upload ảnh thất bại!"); return null; }
    finally { setUploadingAvatar(false); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { showToast("error", "Tên không được để trống!"); return; }
    setSaving(true);
    try {
      let avatarUrl = user.avatar;
      if (avatarFile) { avatarUrl = await uploadAvatar(); if (!avatarUrl) { setSaving(false); return; } }
      await userAPI.updateProfile({ name: profileForm.name, phone: profileForm.phone, avatar: avatarUrl });
      showToast("success", "Cập nhật thành công! Đăng nhập lại để áp dụng.");
      setTimeout(() => { logout(); navigate("/login"); }, 2000);
    } catch (err) { showToast("error", err.response?.data?.message || "Cập nhật thất bại!"); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword) { showToast("error", "Nhập mật khẩu cũ!"); return; }
    if (pwForm.newPassword.length < 6) { showToast("error", "Mật khẩu mới tối thiểu 6 ký tự!"); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { showToast("error", "Mật khẩu xác nhận không khớp!"); return; }
    setSaving(true);
    try {
      await userAPI.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      showToast("success", "Đổi mật khẩu thành công! Đăng nhập lại.");
      setTimeout(() => { logout(); navigate("/login"); }, 2000);
    } catch (err) { showToast("error", err.response?.data?.message || "Đổi mật khẩu thất bại!"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  const inp = { width: "100%", border: "1px solid #ddd", borderRadius: "3px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "'Lato', sans-serif", boxSizing: "border-box", color: "#1a1a1a" };
  const lbl = { fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "1px" };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", paddingBottom: "80px" }}>

      {/* ══ MODAL XÁC NHẬN HUỶ ══ */}
      {cancelModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "36px", width: "100%", maxWidth: "460px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", fontFamily: "'Lato', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ width: "68px", height: "68px", background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "30px", border: "2px solid #fecaca" }}>⚠️</div>
              <h3 style={{ fontWeight: 900, fontSize: "20px", color: "#1a1a1a", margin: "0 0 6px" }}>Xác nhận huỷ đơn hàng?</h3>
              <p style={{ fontSize: "14px", color: "#555", margin: "0 0 2px" }}>Mã đơn: <strong>#{cancelModal.orderCode}</strong></p>
              <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>Hành động này không thể hoàn tác.</p>
            </div>

            {/* Chọn lý do */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Lý do huỷ (tùy chọn)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "10px" }}>
                {CANCEL_REASONS.map(reason => (
                  <button key={reason} onClick={() => { setCancelReason(reason); setCustomReason(""); }}
                    style={{
                      textAlign: "left", padding: "10px 14px",
                      border: `1.5px solid ${cancelReason === reason ? "#e60000" : "#e5e5e5"}`,
                      borderRadius: "6px",
                      background: cancelReason === reason ? "#fef2f2" : "#fafafa",
                      color: cancelReason === reason ? "#e60000" : "#444",
                      fontSize: "13px", fontWeight: cancelReason === reason ? 700 : 500,
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: "10px",
                    }}>
                    <span style={{
                      width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${cancelReason === reason ? "#e60000" : "#ccc"}`,
                      background: cancelReason === reason ? "#e60000" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {cancelReason === reason && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff", display: "block" }} />}
                    </span>
                    {reason}
                  </button>
                ))}
              </div>
              <input
                placeholder="Hoặc nhập lý do khác..."
                value={customReason}
                onChange={e => { setCustomReason(e.target.value); setCancelReason(""); }}
                style={{ width: "100%", border: `1.5px solid ${customReason ? "#1a1a1a" : "#e5e5e5"}`, borderRadius: "6px", padding: "10px 14px", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", color: "#1a1a1a", background: "#fafafa" }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => { setCancelModal(null); setCancelReason(""); setCustomReason(""); }}
                disabled={cancelling}
                style={{ flex: 1, padding: "13px", background: "#f5f5f5", color: "#444", border: "1px solid #e5e5e5", borderRadius: "6px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                Giữ đơn hàng
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                style={{ flex: 1, padding: "13px", background: cancelling ? "#aaa" : "#e60000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 800, cursor: cancelling ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: cancelling ? "none" : "0 4px 14px rgba(230,0,0,0.25)" }}>
                {cancelling ? "⏳ Đang huỷ..." : "Xác nhận huỷ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9998, background: toast.type === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`, color: toast.type === "success" ? "#16a34a" : "#e60000", padding: "14px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          {toast.type === "success" ? "✅ " : "❌ "}{toast.msg}
        </div>
      )}

      {/* ══ HEADER ══ */}
      <div style={{ background: "#1a1a1a", padding: "48px 0 80px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#333", border: "3px solid #e60000", overflow: "hidden" }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px", fontWeight: 900, color: "#fff" }}>{user.name?.charAt(0).toUpperCase()}</div>
              }
            </div>
            <label style={{ position: "absolute", bottom: 0, right: 0, background: "#e60000", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "13px", border: "2px solid #fff" }}>
              📷<input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </label>
          </div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "22px", margin: "0 0 6px", letterSpacing: "2px" }}>{user.name}</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>{user.email}</p>
          <span style={{ display: "inline-block", background: user.role === "admin" ? "#e60000" : "#333", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", padding: "3px 10px", borderRadius: "2px", textTransform: "uppercase" }}>
            {user.role === "admin" ? "Admin" : user.role === "staff" ? "Nhân viên" : "Khách hàng"}
          </span>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="container" style={{ marginTop: "-40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px", alignItems: "start" }}>

          {/* Sidebar */}
          <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "6px", overflow: "hidden" }}>
            {[{ key: "profile", icon: "👤", label: "Hồ sơ" }, { key: "password", icon: "🔒", label: "Đổi mật khẩu" }, { key: "orders", icon: "📦", label: "Đơn hàng" }].map(tab => (
              <button key={tab.key} onClick={() => handleTabChange(tab.key)} style={{ width: "100%", textAlign: "left", padding: "15px 20px", background: activeTab === tab.key ? "#fafafa" : "#fff", border: "none", borderLeft: `3px solid ${activeTab === tab.key ? "#e60000" : "transparent"}`, color: activeTab === tab.key ? "#1a1a1a" : "#666", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", gap: "10px", alignItems: "center", transition: "all 0.15s" }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
            {user.role === "admin" && (
              <><hr style={{ margin: "6px 0", border: "none", borderTop: "1px solid #f0f0f0" }} />
              <Link to="/admin" style={{ display: "flex", gap: "10px", alignItems: "center", padding: "15px 20px", color: "#e60000", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                <span>⚙️</span> Quản trị Admin
              </Link></>
            )}
            <hr style={{ margin: "6px 0", border: "none", borderTop: "1px solid #f0f0f0" }} />
            <button onClick={() => { logout(); navigate("/login"); }} style={{ width: "100%", textAlign: "left", padding: "15px 20px", background: "#fff", border: "none", borderLeft: "3px solid transparent", color: "#e60000", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", gap: "10px" }}>
              <span>🚪</span> Đăng xuất
            </button>
          </div>

          {/* Main Panel */}
          <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "6px", padding: "36px" }}>

            {/* Hồ sơ */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile}>
                <h2 style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "28px", color: "#1a1a1a" }}>Thông tin cá nhân</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", padding: "18px", background: "#fafafa", borderRadius: "6px", border: "1px solid #f0f0f0" }}>
                  <div style={{ width: "68px", height: "68px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #ddd" }}>
                    {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#fff", fontWeight: 900 }}>{user.name?.charAt(0).toUpperCase()}</div>}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: "0 0 4px" }}>Ảnh đại diện</p>
                    <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 10px" }}>JPG, PNG, WebP — tối đa 3MB</p>
                    <label style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "7px 16px", borderRadius: "3px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                      {uploadingAvatar ? "⏳ Đang xử lý..." : "📷 Chọn ảnh mới"}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>
                <div style={{ display: "grid", gap: "16px", maxWidth: "480px" }}>
                  <div><label style={lbl}>Email (không thể đổi)</label><input value={user.email} readOnly style={{ ...inp, background: "#f9f9f9", color: "#aaa" }} /></div>
                  <div><label style={lbl}>Họ và tên *</label><input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} placeholder="Họ và tên" style={inp} required /></div>
                  <div><label style={lbl}>Số điện thoại</label><input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="0901 234 567" style={inp} /></div>
                  <button type="submit" disabled={saving || uploadingAvatar} style={{ background: saving ? "#aaa" : "#1a1a1a", color: "#fff", border: "none", padding: "13px 28px", borderRadius: "3px", fontSize: "13px", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", width: "fit-content" }}>
                    {saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}

            {/* Đổi mật khẩu */}
            {activeTab === "password" && (
              <form onSubmit={handleChangePassword}>
                <h2 style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "28px", color: "#1a1a1a" }}>Đổi mật khẩu</h2>
                <div style={{ display: "grid", gap: "16px", maxWidth: "420px" }}>
                  {[{ key: "oldPassword", label: "Mật khẩu hiện tại *", ph: "Nhập mật khẩu cũ" }, { key: "newPassword", label: "Mật khẩu mới * (tối thiểu 6)", ph: "Nhập mật khẩu mới" }, { key: "confirmPassword", label: "Xác nhận mật khẩu mới *", ph: "Nhập lại mật khẩu mới" }].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input type="password" placeholder={f.ph} value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ ...inp, borderColor: f.key === "confirmPassword" && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? "#e60000" : "#ddd" }} />
                      {f.key === "confirmPassword" && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (<p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>Mật khẩu không khớp!</p>)}
                    </div>
                  ))}
                  <button type="submit" disabled={saving} style={{ background: saving ? "#aaa" : "#e60000", color: "#fff", border: "none", padding: "13px 28px", borderRadius: "3px", fontSize: "13px", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", width: "fit-content" }}>
                    {saving ? "⏳ Đang đổi..." : "🔒 Đổi mật khẩu"}
                  </button>
                </div>
              </form>
            )}

            {/* Đơn hàng */}
            {activeTab === "orders" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>Đơn hàng của tôi</h2>
                  <button onClick={fetchOrders} disabled={ordersLoading} style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: "4px", padding: "7px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#555", fontFamily: "inherit" }}>🔄 Làm mới</button>
                </div>

                {ordersLoading && (<div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}><p style={{ fontSize: "32px" }}>⏳</p><p>Đang tải đơn hàng...</p></div>)}

                {!ordersLoading && ordersError && (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: "28px" }}>❌</p>
                    <p style={{ color: "#e60000", marginBottom: "16px" }}>{ordersError}</p>
                    <button onClick={fetchOrders} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "9px 20px", borderRadius: "3px", cursor: "pointer", fontWeight: 700 }}>Thử lại</button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>
                    <p style={{ fontSize: "48px" }}>🛍️</p>
                    <p style={{ fontSize: "14px", marginBottom: "20px" }}>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/product" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "11px 28px", borderRadius: "3px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px" }}>MUA NGAY →</Link>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {orders.map(order => (
                      <div key={order._id} style={{ border: "1px solid #efefef", borderRadius: "8px", overflow: "hidden", transition: "box-shadow 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>

                        {/* Header đơn */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", padding: "13px 18px", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap", gap: "8px" }}>
                          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <div><p style={{ fontSize: "10px", color: "#aaa", margin: "0 0 2px" }}>Mã đơn</p><p style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>#{order.orderCode || order._id.slice(-6).toUpperCase()}</p></div>
                            <div><p style={{ fontSize: "10px", color: "#aaa", margin: "0 0 2px" }}>Ngày đặt</p><p style={{ fontSize: "12px", color: "#555", fontWeight: 600, margin: 0 }}>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p></div>
                            <div><p style={{ fontSize: "10px", color: "#aaa", margin: "0 0 2px" }}>Thanh toán</p><p style={{ fontSize: "12px", color: "#555", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>{order.payment}</p></div>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>

                        {/* Sản phẩm */}
                        <div style={{ padding: "12px 18px" }}>
                          {(order.orderItems || []).map((item, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: idx < order.orderItems.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <div style={{ width: "46px", height: "46px", borderRadius: "4px", background: "#f0f0f0", overflow: "hidden", flexShrink: 0 }}>
                                  {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                </div>
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a1a", margin: "0 0 2px" }}>{item.name}</p>
                                  <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.color} · EU {item.size} · ×{item.quantity}</p>
                                </div>
                              </div>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer: tổng + nút huỷ */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "1px solid #f0f0f0", background: "#fafafa", flexWrap: "wrap", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", color: "#888" }}>{order.shippingAddress?.province}</span>

                            {/* Nút huỷ — chỉ hiện khi pending */}
                            {order.status === "pending" && (
                              <button
                                onClick={() => { setCancelReason(""); setCustomReason(""); setCancelModal({ orderId: order._id, orderCode: order.orderCode || order._id.slice(-6).toUpperCase() }); }}
                                style={{ background: "#fff", color: "#e60000", border: "1px solid #fecaca", borderRadius: "4px", padding: "5px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#e60000"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fecaca"; }}>
                                Huỷ đơn hàng
                              </button>
                            )}

                            {/* Lý do huỷ */}
                            {order.status === "cancelled" && order.cancelReason && (
                              <span style={{ fontSize: "11px", color: "#aaa", fontStyle: "italic" }}>Lý do: {order.cancelReason}</span>
                            )}
                          </div>

                          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#888" }}>Tổng:</span>
                            <span style={{ fontSize: "18px", fontWeight: 900, color: "#e60000" }}>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;