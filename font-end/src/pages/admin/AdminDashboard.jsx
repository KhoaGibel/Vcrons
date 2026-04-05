import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 

const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

const getAuthHeadersFormData = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`
  };
};

const Badge = ({ label, type }) => {
  const colors = {
    active: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    inactive: { bg: "#fafafa", color: "#999", border: "#e5e5e5" },
    pending: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
    shipping: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
    delivered: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    admin: { bg: "#fef2f2", color: "#e60000", border: "#fecaca" },
    staff: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
    customer: { bg: "#fafafa", color: "#666", border: "#e5e5e5" },
    banned: { bg: "#1a1a1a", color: "#fff", border: "#1a1a1a" },
  };
  const c = colors[type] || colors.inactive;
  const labels = { active: "Hoạt động", inactive: "Ẩn", pending: "Chờ xử lý", shipping: "Đang giao", delivered: "Hoàn thành", cancelled: "Huỷ", admin: "Admin", staff: "Nhân viên", customer: "Khách hàng", banned: "Bị khoá" };
  return <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>{labels[type] || label}</span>;
};

const Sidebar = ({ active, setActive }) => {
  const [hovered, setHovered] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const nav = [
    { key: "overview", icon: "▦", label: "Tổng quan" },
    { key: "products", icon: "⬡", label: "Sản phẩm" },
    { key: "orders", icon: "◈", label: "Đơn hàng" },
    { key: "users", icon: "◉", label: "Người dùng" },
  ];

  return (
    <div style={{ width: "240px", minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "4px 0 20px rgba(0,0,0,0.05)", zIndex: 10 }}>
      <div style={{ padding: "32px 24px 24px", cursor: "pointer" }} onClick={() => navigate("/")}>
        <p style={{ color: "#e60000", fontWeight: 900, fontSize: "18px", letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>VCRONS</p>
        <p style={{ color: "#666", fontSize: "11px", letterSpacing: "3px", margin: "4px 0 0", fontWeight: 600 }}>VỀ TRANG CHỦ</p>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {nav.map((item) => (
          <button key={item.key} onClick={() => setActive(item.key)} onMouseEnter={() => setHovered(item.key)} onMouseLeave={() => setHovered(null)} style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "14px 24px", background: active === item.key ? "rgba(230, 0, 0, 0.1)" : (hovered === item.key ? "#1a1a1a" : "transparent"), border: "none", borderLeft: active === item.key ? "4px solid #e60000" : "4px solid transparent", color: active === item.key ? "#e60000" : (hovered === item.key ? "#fff" : "#a0a0a0"), cursor: "pointer", fontSize: "15px", fontWeight: active === item.key ? 800 : 600, letterSpacing: "0.5px", textAlign: "left", transition: "all 0.2s ease", fontFamily: "'Lato', sans-serif" }}>
            <span style={{ fontSize: "18px", opacity: active === item.key ? 1 : 0.8 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "24px", borderTop: "1px solid #222", background: "#0a0a0a" }}>
        <p style={{ color: "#eee", fontSize: "12px", fontWeight: 700, margin: 0 }}>{user?.name || "Đang tải..."}</p>
        <p style={{ color: "#777", fontSize: "11px", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email || "..."}</p>
        <button onClick={handleLogout} style={{ marginTop: "12px", width: "100%", padding: "8px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Đăng xuất</button>
      </div>
    </div>
  );
};

const Overview = ({ products, orders, users }) => {
  const stats = [
    { label: "Doanh thu tháng", value: formatPrice(orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0)), icon: "💰", delta: `Hoàn thành` },
    { label: "Đơn hàng mới", value: orders.filter(o => o.status === "pending").length, icon: "📦", delta: `${orders.length} tổng` },
    { label: "Sản phẩm", value: products.length, icon: "⬡", delta: `${products.filter(p => p.stock === 0).length} hết hàng` },
    { label: "Người dùng", value: users.length, icon: "◉", delta: `${users.filter(u => u.role === "customer").length} khách` },
  ];
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", marginBottom: "32px", letterSpacing: "1px" }}>TỔNG QUAN</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "transform 0.2s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><p style={{ fontSize: "12px", color: "#888", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{s.label}</p><p style={{ fontSize: "26px", fontWeight: 900, color: "#1a1a1a", margin: "0 0 6px" }}>{s.value}</p><p style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600, margin: 0 }}>{s.delta}</p></div>
              <span style={{ fontSize: "32px", opacity: 0.8 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product || { name: "", category: "", price: "", stock: "", status: "active", description: "", images: ["", "", "", ""] });
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const newImgs = [...(form.images || ["", "", "", ""])];
    newImgs[index] = previewUrl;
    set("images", newImgs);
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  const submitForm = async () => {
    setLoading(true);
    await onSave(form, imageFiles);
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "8px", padding: "36px", width: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", fontFamily: "'Lato', sans-serif" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "28px", color: "#1a1a1a" }}>{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Tên sản phẩm</label><input type="text" value={form.name} onChange={e => set("name", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
          <div><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Giá (VNĐ)</label><input type="number" value={form.price} onChange={e => set("price", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
          <div><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Tồn kho</label><input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
        </div>
        
        <div style={{ marginBottom: "20px" }}><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Danh mục</label><input list="categories-list" placeholder="Chọn hoặc gõ để thêm..." value={form.category} onChange={e => set("category", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /><datalist id="categories-list"><option value="Classic" /><option value="Baya" /><option value="Crush" /><option value="Sandal" /><option value="Jibbitz" /></datalist></div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Mô tả sản phẩm</label>
          <textarea 
            value={form.description || ""} 
            onChange={e => set("description", e.target.value)} 
            rows="4"
            placeholder="Nhập mô tả chi tiết sản phẩm vào đây..."
            style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} 
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "12px" }}>Hình ảnh sản phẩm</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: "100%", aspectRatio: "1/1", border: "2px dashed #ddd", borderRadius: "4px", position: "relative", overflow: "hidden", background: "#fafafa" }}>
                {form.images && form.images[i] ? ( <><img src={form.images[i]} alt={`Pic ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /><label style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, cursor: "pointer", transition: "opacity 0.2s", fontSize: "12px", fontWeight: 700 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}><span style={{ fontSize: "20px", marginBottom: "4px" }}>🔄</span>Đổi ảnh<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(i, e)} /></label></>
                ) : ( <label style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.color = "#888"}><span style={{ fontSize: "24px", fontWeight: 300 }}>+</span><span style={{ fontSize: "11px", fontWeight: 700, marginTop: "4px" }}>Ảnh {i + 1}</span><input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(i, e)} /></label> )}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: "32px" }}><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Trạng thái</label><select value={form.status} onChange={e => set("status", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}><option value="active">Hiển thị</option><option value="inactive">Ẩn</option></select></div>
        
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #eaeaea", paddingTop: "24px" }}>
          <button onClick={onClose} disabled={loading} style={{ padding: "12px 24px", background: "#f5f5f5", color: "#444", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 800, cursor: "pointer", transition: "background 0.2s", opacity: loading ? 0.5 : 1 }}>Huỷ</button>
          <button onClick={submitForm} disabled={loading} style={{ padding: "12px 28px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(230,0,0,0.2)", opacity: loading ? 0.5 : 1 }}>
            {loading ? "Đang lưu..." : (product ? "Lưu thay đổi" : "Thêm sản phẩm")}
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = ({ products, setProducts }) => {
  const [modal, setModal] = useState(null); 
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = async (form, imageFiles) => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("status", form.status);
      formData.append("description", form.description || "");

      let hasImage = false;
      for (let i = 0; i < 4; i++) {
        if (imageFiles[i]) {
          formData.append("images", imageFiles[i]);
          hasImage = true;
        } else if (form.images && form.images[i] && !form.images[i].startsWith("blob:")) {
          formData.append("images", form.images[i]);
          hasImage = true;
        }
      }

      if (!hasImage) formData.append("images", []);

      const isAdd = modal === "add";
      const url = isAdd ? "http://localhost:3000/api/products" : `http://localhost:3000/api/products/${form._id}`;

      const response = await fetch(url, { 
        method: isAdd ? "POST" : "PUT", 
        body: formData,
        headers: getAuthHeadersFormData() 
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Lỗi file ảnh quá lớn hoặc Server bị sập ngầm!" }));
        alert(`❌ Không thể lưu: ${errData.message}`);
        return;
      }

      const savedProduct = await response.json();
      
      if (isAdd) setProducts(p => [savedProduct, ...p]);
      else setProducts(p => p.map(pr => pr._id === savedProduct._id ? savedProduct : pr));
      
      setModal(null);
      alert("✅ Đã lưu sản phẩm thành công!");
      
    } catch (error) { 
      console.error(error); 
      alert("❌ Lỗi mất kết nối! Mẹo: Hãy thử chọn 1 tấm ảnh nhỏ hơn xem sao nhé."); 
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${deleteId}`, { 
          method: "DELETE",
          headers: getAuthHeaders() 
      });
      
      if (!response.ok) {
         const errData = await response.json();
         alert(`Lỗi từ Server: ${errData.message}`);
         return; 
      }

      setProducts(p => p.filter(pr => pr._id !== deleteId));
      setDeleteId(null);
      alert("Đã xoá sản phẩm thành công!");
    } catch (error) { 
      console.error(error); 
      alert("Mất kết nối với máy chủ!");
    }
  };

  return (
    <div>
      {modal && <ProductModal product={modal === "add" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "1px" }}>SẢN PHẨM</h2>
        <button onClick={() => setModal("add")} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "13px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily: "'Lato', sans-serif" }}>+ THÊM SẢN PHẨM</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8f9fa" }}><tr>{["Mã ID", "Tên sản phẩm", "Danh mục", "Giá", "Tồn kho", "Trạng thái", "Thao tác"].map(h => <th key={h} style={{ textAlign: "left", padding: "16px", fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 800, borderBottom: "2px solid #eaeaea" }}>{h}</th>)}</tr></thead>
          <tbody>
            {products.length === 0 ? ( <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Chưa có dữ liệu</td></tr>) : (
              products.map(p => (
                <tr key={p._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#888", fontWeight: 600 }}>#{p._id ? p._id.slice(-6).toUpperCase() : "MỚI"}</td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: 800, color: "#1a1a1a" }}>{p.name}</td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#666", fontWeight: 600 }}>{p.category}</td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: 800, color: "#1a1a1a" }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: "16px" }}><span style={{ fontSize: "14px", fontWeight: 800, color: p.stock === 0 ? "#e60000" : "#1a1a1a" }}>{p.stock}</span>{p.stock === 0 && <span style={{ fontSize: "10px", fontWeight: 800, background: "#fef2f2", color: "#e60000", padding: "2px 6px", borderRadius: "2px", marginLeft: "8px" }}>HẾT</span>}</td>
                  <td style={{ padding: "16px" }}><Badge type={p.status} /></td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setModal(p)} style={{ padding: "6px 14px", background: "#f5f5f5", color: "#444", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Sửa</button>
                      <button onClick={() => setDeleteId(p._id)} style={{ padding: "6px 14px", background: "#fef2f2", color: "#e60000", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Xoá</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "40px", width: "400px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</p><h3 style={{ fontWeight: 900, fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>Xác nhận xoá?</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px", lineHeight: "1.5" }}>Dữ liệu sẽ bị xoá vĩnh viễn khỏi MongoDB.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}><button onClick={() => setDeleteId(null)} style={{ padding: "12px 24px", border: "none", borderRadius: "4px", background: "#f5f5f5", color: "#444", cursor: "pointer", fontWeight: 800, fontSize: "13px", fontFamily: "'Lato', sans-serif" }}>Huỷ</button><button onClick={confirmDelete} style={{ padding: "12px 32px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 800, fontSize: "13px", boxShadow: "0 4px 12px rgba(230,0,0,0.2)", fontFamily: "'Lato', sans-serif" }}>Xoá ngay</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CẤU HÌNH TRẠNG THÁI ĐƠN HÀNG ───────────────────────────────────────────
const STATUS_FLOW = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

const STATUS_CONFIG = {
  pending:   { label: "Chờ xử lý",    bg: "#fffbeb", color: "#d97706", border: "#fde68a", icon: "🕐", next: "confirmed" },
  confirmed: { label: "Đã xác nhận",  bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd", icon: "✅", next: "shipping"  },
  shipping:  { label: "Đang giao",    bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", icon: "🚚", next: "delivered" },
  delivered: { label: "Hoàn thành",   bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", icon: "🎉", next: null       },
  cancelled: { label: "Đã huỷ",       bg: "#fef2f2", color: "#dc2626", border: "#fecaca", icon: "❌", next: null       },
};

// Pill trạng thái bấm được → chuyển sang trạng thái tiếp theo
const StatusPill = ({ status, orderId, onUpdate }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!cfg.next || loading) return;
    setLoading(true);
    await onUpdate(orderId, cfg.next);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
      <button
        onClick={handleClick}
        disabled={!cfg.next || loading}
        title={cfg.next ? `Bấm để → ${STATUS_CONFIG[cfg.next]?.label}` : "Trạng thái cuối"}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: cfg.bg, color: cfg.color,
          border: `1.5px solid ${cfg.border}`,
          borderRadius: "20px", padding: "5px 12px",
          fontSize: "12px", fontWeight: 800, letterSpacing: "0.3px",
          cursor: cfg.next ? "pointer" : "default",
          transition: "all 0.2s ease",
          opacity: loading ? 0.6 : 1,
          fontFamily: "'Lato', sans-serif",
          boxShadow: cfg.next ? `0 2px 8px ${cfg.border}` : "none",
        }}
        onMouseEnter={e => { if (cfg.next) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 4px 12px ${cfg.border}`; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = cfg.next ? `0 2px 8px ${cfg.border}` : "none"; }}
      >
        <span>{cfg.icon}</span>
        {loading ? "Đang cập nhật..." : cfg.label}
      </button>
      {cfg.next && (
        <span style={{ fontSize: "10px", color: "#aaa", paddingLeft: "4px" }}>
          → {STATUS_CONFIG[cfg.next]?.label}
        </span>
      )}
    </div>
  );
};

// ─── MODAL CHI TIẾT / CHỈNH SỬA ĐƠN HÀNG ────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusUpdate, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: order.shippingAddress?.fullname || "",
    phone:    order.shippingAddress?.phone    || "",
    address:  order.shippingAddress?.address  || "",
    ward:     order.shippingAddress?.ward     || "",
    district: order.shippingAddress?.district || "",
    province: order.shippingAddress?.province || "",
    note:     order.shippingAddress?.note     || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(order._id, { shippingAddress: editForm });
    setSaving(false);
    setEditMode(false);
  };

  const inp = { width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "9px 12px", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl = { fontSize: "10px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "5px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "10px", width: "680px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", fontFamily: "'Lato', sans-serif" }}>
        
        {/* Header modal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "2px", margin: "0 0 4px" }}>CHI TIẾT ĐƠN HÀNG</p>
            <h3 style={{ fontWeight: 900, fontSize: "18px", color: "#1a1a1a", margin: 0 }}>
              #{order.orderCode || order._id?.slice(-6).toUpperCase()}
            </h3>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <StatusPill status={order.status} orderId={order._id} onUpdate={onStatusUpdate} />
            <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "18px", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── THÔNG TIN KHÁCH HÀNG ── */}
          <div style={{ background: "#fafafa", border: "1px solid #efefef", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ fontWeight: 800, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>
                👤 Thông tin khách hàng
              </h4>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 14px", fontSize: "11px", fontWeight: 800, cursor: "pointer", letterSpacing: "1px" }}>
                  ✏️ Chỉnh sửa
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditMode(false)} style={{ background: "#f5f5f5", color: "#444", border: "none", borderRadius: "4px", padding: "6px 14px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>Huỷ</button>
                  <button onClick={handleSave} disabled={saving} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 14px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>
                    {saving ? "Đang lưu..." : "💾 Lưu"}
                  </button>
                </div>
              )}
            </div>

            {!editMode ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Họ tên",       val: order.shippingAddress?.fullname },
                  { label: "SĐT",          val: order.shippingAddress?.phone },
                  { label: "Email",         val: order.email },
                  { label: "Thanh toán",    val: order.payment?.toUpperCase() },
                  { label: "Địa chỉ",      val: order.shippingAddress?.address },
                  { label: "Phường/Xã",    val: order.shippingAddress?.ward },
                  { label: "Quận/Huyện",   val: order.shippingAddress?.district },
                  { label: "Tỉnh/Thành",   val: order.shippingAddress?.province },
                  { label: "Ghi chú",      val: order.shippingAddress?.note || "—" },
                  { label: "Ngày đặt",     val: new Date(order.createdAt).toLocaleString("vi-VN") },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 3px", fontWeight: 700 }}>{label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{val || "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { key: "fullname", label: "Họ tên" },
                  { key: "phone",    label: "Số điện thoại" },
                  { key: "address",  label: "Địa chỉ chi tiết" },
                  { key: "ward",     label: "Phường/Xã" },
                  { key: "district", label: "Quận/Huyện" },
                  { key: "province", label: "Tỉnh/Thành phố" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <input value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} style={inp} />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Ghi chú</label>
                  <input value={editForm.note} onChange={e => setEditForm(p => ({ ...p, note: e.target.value }))} style={inp} placeholder="Không có ghi chú" />
                </div>
              </div>
            )}
          </div>

          {/* ── DANH SÁCH SẢN PHẨM ── */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 14px" }}>
              📦 Sản phẩm ({(order.orderItems || []).length})
            </h4>
            <div style={{ border: "1px solid #efefef", borderRadius: "8px", overflow: "hidden" }}>
              {(order.orderItems || []).length === 0 ? (
                <p style={{ padding: "20px", color: "#aaa", textAlign: "center" }}>Không có sản phẩm</p>
              ) : (order.orderItems || []).map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: idx < order.orderItems.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "4px", background: "#f0f0f0", overflow: "hidden", flexShrink: 0 }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: "0 0 3px" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>Màu: {item.color} · Size: EU {item.size} · SL: {item.quantity}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 800, fontSize: "14px", color: "#1a1a1a", margin: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                    <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TỔNG TIỀN ── */}
          <div style={{ background: "#fafafa", border: "1px solid #efefef", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>Tạm tính</span>
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>Phí vận chuyển</span>
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{formatPrice(order.shippingFee || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#16a34a" }}>Giảm giá</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e0e0e0", paddingTop: "12px", marginTop: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>Tổng cộng</span>
              <span style={{ fontSize: "20px", fontWeight: 900, color: "#e60000" }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* ── LỊCH SỬ TRẠNG THÁI ── */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 14px" }}>
              🔄 Tiến trình đơn hàng
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {["pending", "confirmed", "shipping", "delivered"].map((s, i) => {
                const cfg = STATUS_CONFIG[s];
                const statusIdx = STATUS_FLOW.indexOf(order.status);
                const stepIdx = STATUS_FLOW.indexOf(s);
                const isDone = order.status !== "cancelled" && stepIdx <= statusIdx;
                const isCurrent = s === order.status;
                return (
                  <React.Fragment key={s}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: isDone ? cfg.bg : "#f5f5f5",
                        border: `2px solid ${isDone ? cfg.color : "#ddd"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px",
                        boxShadow: isCurrent ? `0 0 0 3px ${cfg.border}` : "none",
                        transition: "all 0.3s",
                      }}>
                        {isDone ? cfg.icon : "○"}
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: isCurrent ? 800 : 600, color: isCurrent ? cfg.color : "#aaa", whiteSpace: "nowrap" }}>
                        {cfg.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div style={{ flex: 1, height: "2px", background: STATUS_FLOW.indexOf(order.status) > i && order.status !== "cancelled" ? "#16a34a" : "#e5e5e5", margin: "0 4px", marginBottom: "22px", transition: "background 0.3s" }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {order.status === "cancelled" && (
              <div style={{ marginTop: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", color: "#dc2626", fontWeight: 600 }}>
                ❌ Đơn hàng đã bị huỷ{order.cancelReason ? `: ${order.cancelReason}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ orders, setOrders }) => {
  const [filter, setFilter] = useState("all");
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null); // order đang xem chi tiết
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) { alert("Lỗi cập nhật trạng thái!"); return; }
      const updated = await response.json();
      setOrders(ords => ords.map(o => o._id === id ? { ...o, status: updated.status } : o));
      // Cập nhật viewOrder nếu đang mở
      if (viewOrder && viewOrder._id === id) setViewOrder(v => ({ ...v, status: updated.status }));
    } catch (err) { console.error(err); }
  };

  const handleSaveOrder = async (id, updateData) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(updateData)
      });
      if (!res.ok) { alert("Lỗi lưu đơn hàng!"); return; }
      const updated = await res.json();
      setOrders(ords => ords.map(o => o._id === id ? updated : o));
      if (viewOrder && viewOrder._id === id) setViewOrder(updated);
    } catch (err) { console.error(err); }
  };

  const confirmDeleteOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${deleteOrderId}`, {
        method: "DELETE", headers: getAuthHeaders()
      });
      if (!response.ok) { const e = await response.json(); alert(`Lỗi: ${e.message}`); return; }
      setOrders(ords => ords.filter(o => o._id !== deleteOrderId));
      setDeleteOrderId(null);
      if (viewOrder?._id === deleteOrderId) setViewOrder(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "1px", marginBottom: "28px" }}>ĐƠN HÀNG</h2>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[["all", "Tất cả"], ["pending", "Chờ xử lý"], ["shipping", "Đang giao"], ["delivered", "Hoàn thành"], ["cancelled", "Đã huỷ"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: "10px 20px", borderRadius: "4px", border: "none", background: filter === val ? "#1a1a1a" : "#fff", color: filter === val ? "#fff" : "#666", fontSize: "13px", fontWeight: 800, letterSpacing: "0.5px", cursor: "pointer", boxShadow: filter === val ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.2s ease", fontFamily: "'Lato', sans-serif" }}>
            {label} <span style={{ opacity: 0.7, marginLeft: "4px", fontWeight: 600 }}>{val === "all" ? `(${orders.length})` : `(${orders.filter(o => o.status === val).length})`}</span>
          </button>
        ))}
      </div>
      {/* Modal chi tiết đơn hàng */}
      {viewOrder && (
        <OrderDetailModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onStatusUpdate={updateStatus}
          onSave={handleSaveOrder}
        />
      )}

      <div style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>{["Mã đơn", "Khách hàng", "Sản phẩm", "Tổng tiền", "Trạng thái", "Thao tác"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 800, borderBottom: "2px solid #eaeaea" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#888" }}>Chưa có đơn hàng nào</td></tr>
            ) : filtered.map(o => (
              <tr key={o._id} style={{ borderBottom: "1px solid #f5f5f5", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                
                {/* Mã đơn */}
                <td style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a1a", margin: "0 0 2px" }}>#{o.orderCode || o._id?.slice(-6).toUpperCase()}</p>
                  <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</p>
                </td>

                {/* Khách hàng */}
                <td style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 2px" }}>{o.shippingAddress?.fullname || "—"}</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: "0 0 1px" }}>{o.shippingAddress?.phone || o.email}</p>
                  <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{o.shippingAddress?.province}</p>
                </td>

                {/* Số SP */}
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666", fontWeight: 600 }}>
                  {(o.orderItems || []).length} SP
                </td>

                {/* Tổng tiền */}
                <td style={{ padding: "14px 16px", fontSize: "15px", fontWeight: 900, color: "#e60000" }}>
                  {formatPrice(o.total)}
                </td>

                {/* Trạng thái — bấm được */}
                <td style={{ padding: "14px 16px" }}>
                  <StatusPill status={o.status} orderId={o._id} onUpdate={updateStatus} />
                </td>

                {/* Thao tác */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setViewOrder(o)} style={{ padding: "6px 12px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 800, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                      Chi tiết
                    </button>
                    <button onClick={() => setDeleteOrderId(o._id)} style={{ padding: "6px 12px", background: "#fef2f2", color: "#e60000", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 800, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm xoá */}
      {deleteOrderId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "40px", width: "400px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</p>
            <h3 style={{ fontWeight: 900, fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>Xác nhận xoá đơn hàng?</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px" }}>Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setDeleteOrderId(null)} style={{ padding: "12px 24px", border: "none", borderRadius: "4px", background: "#f5f5f5", color: "#444", cursor: "pointer", fontWeight: 800, fontSize: "13px", fontFamily: "'Lato', sans-serif" }}>Huỷ</button>
              <button onClick={confirmDeleteOrder} style={{ padding: "12px 32px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 800, fontSize: "13px", fontFamily: "'Lato', sans-serif" }}>Xoá ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState(user || { name: "", email: "", role: "customer", status: "active" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "8px", padding: "36px", width: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "28px", color: "#1a1a1a" }}>{user ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</h3>
        <div style={{ marginBottom: "20px" }}><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Họ và tên</label><input type="text" value={form.name} onChange={e => set("name", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /></div>
        <div style={{ marginBottom: "20px" }}><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Email</label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} disabled={user && user.role === "admin"} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Vai trò</label><select value={form.role} onChange={e => set("role", e.target.value)} disabled={user && user.role === "admin"} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}><option value="customer">Khách hàng</option><option value="staff">Nhân viên</option><option value="admin">Admin</option></select></div>
          <div><label style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#555", display: "block", marginBottom: "8px" }}>Trạng thái</label><select value={form.status} onChange={e => set("status", e.target.value)} disabled={user && user.role === "admin"} style={{ width: "100%", border: "1px solid #ddd", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}><option value="active">Hoạt động</option><option value="banned">Bị khoá</option></select></div>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #eaeaea", paddingTop: "24px" }}><button onClick={onClose} style={{ padding: "12px 24px", background: "#f5f5f5", color: "#444", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Huỷ</button><button onClick={() => onSave(form)} style={{ padding: "12px 28px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(230,0,0,0.2)", fontFamily: "'Lato', sans-serif" }}>Lưu thay đổi</button></div>
      </div>
    </div>
  );
};

const Users = ({ users, setUsers }) => {
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = async (form) => {
    try {
      const url = modal === "add" ? "http://localhost:3000/api/users" : `http://localhost:3000/api/users/${form._id}`;
      const res = await fetch(url, { 
        method: modal === "add" ? "POST" : "PUT", 
        headers: getAuthHeaders(), 
        body: JSON.stringify(form) 
      });
      if (!res.ok) {
          const err = await res.json();
          alert(`Lỗi: ${err.message}`); return;
      }
      const savedUser = await res.json();
      if (modal === "add") setUsers(u => [...u, savedUser]);
      else setUsers(us => us.map(u => u._id === form._id ? savedUser : u));
      
      setModal(null);
    } catch (err) { console.error(err); }
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${deleteId}`, { method: "DELETE", headers: getAuthHeaders() });
      if(!response.ok) {
          const errData = await response.json();
          alert(`Lỗi xoá tài khoản: ${errData.message}`); return;
      }
      setUsers(us => us.filter(u => u._id !== deleteId));
      setDeleteId(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      {modal && <UserModal user={modal === "add" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a1a", letterSpacing: "1px" }}>NGƯỜI DÙNG & PHÂN QUYỀN</h2>
        <button onClick={() => setModal("add")} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "13px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily: "'Lato', sans-serif" }}>+ THÊM TÀI KHOẢN</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8f9fa" }}><tr>{["#", "Họ tên", "Email", "Vai trò", "Trạng thái", "Thao tác"].map(h => <th key={h} style={{ textAlign: "left", padding: "16px", fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 800, borderBottom: "2px solid #eaeaea" }}>{h}</th>)}</tr></thead>
          <tbody>
            {users.length === 0 ? <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#888" }}>Chưa có tài khoản nào</td></tr> : users.map(u => (
              <tr key={u._id} style={{ borderBottom: "1px solid #f5f5f5", opacity: u.status === "banned" ? 0.6 : 1 }}>
                <td style={{ padding: "16px", fontSize: "13px", color: "#888", fontWeight: 600 }}>{u._id ? u._id.slice(-4).toUpperCase() : "MỚI"}</td>
                <td style={{ padding: "16px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#666", flexShrink: 0 }}>{u.name.charAt(0)}</div><span style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a1a" }}>{u.name}</span></div></td>
                <td style={{ padding: "16px", fontSize: "13px", color: "#555", fontWeight: 500 }}>{u.email}</td>
                <td style={{ padding: "16px", fontSize: "13px", fontWeight: 700, color: u.role === "admin" ? "#e60000" : "#1a1a1a" }}>{u.role === "admin" ? "Admin" : u.role === "staff" ? "Nhân viên" : "Khách hàng"}</td>
                <td style={{ padding: "16px" }}><Badge type={u.status} /></td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setModal(u)} style={{ padding: "6px 14px", background: "#f5f5f5", color: "#444", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Sửa</button>
                    {u.role !== "admin" && ( <button onClick={() => setDeleteId(u._id)} style={{ padding: "6px 14px", background: "#fef2f2", color: "#e60000", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>Xoá</button> )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "40px", width: "400px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</p><h3 style={{ fontWeight: 900, fontSize: "20px", marginBottom: "12px", color: "#1a1a1a" }}>Xác nhận xoá tài khoản?</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px", lineHeight: "1.5" }}>Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}><button onClick={() => setDeleteId(null)} style={{ padding: "12px 24px", border: "none", borderRadius: "4px", background: "#f5f5f5", color: "#444", cursor: "pointer", fontWeight: 800, fontSize: "13px", fontFamily: "'Lato', sans-serif" }}>Huỷ</button><button onClick={confirmDeleteUser} style={{ padding: "12px 32px", background: "#e60000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 800, fontSize: "13px", boxShadow: "0 4px 12px rgba(230,0,0,0.2)", fontFamily: "'Lato', sans-serif" }}>Xoá ngay</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [active, setActive] = useState("overview"); 
  const [products, setProducts] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const headers = getAuthHeaders();

    fetch("http://localhost:3000/api/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error("Lỗi Product:", err));

    fetch("http://localhost:3000/api/orders", { headers })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Lỗi Order:", err));

    fetch("http://localhost:3000/api/users", { headers })
      .then(res => {
         if (!res.ok) throw new Error("Không có quyền truy cập Users");
         return res.json();
      })
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Lỗi User:", err));
  }, []);

  const renderContent = () => {
    switch (active) {
      case "overview": return <Overview products={products} orders={orders} users={users} />;
      case "products": return <Products products={products} setProducts={setProducts} />;
      case "orders": return <Orders orders={orders} setOrders={setOrders} />;
      case "users": return <Users users={users} setUsers={setUsers} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Lato', sans-serif", background: "#f5f7f9" }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ flex: 1, padding: "48px 56px", overflowY: "auto", minWidth: 0 }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;