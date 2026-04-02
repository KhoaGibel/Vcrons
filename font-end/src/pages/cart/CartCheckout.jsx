import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// ===================== DỮ LIỆU & LƯU TRỮ TRẠNG THÁI =====================
const initCartItems = [
  { id: 1, name: "Classic Clog", color: "Trắng", size: 40, price: 850000, quantity: 1, image: null },
  { id: 2, name: "Baya Platform", color: "Xanh", size: 38, price: 1200000, quantity: 2, image: null },
];

const colorMap = { "Trắng": "#f0f0f0", "Xanh": "#7ec8e3", "Đen": "#1a1a1a", "Hồng": "#f4a7b9", "Be": "#dfd6ca" };
const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

// Hàm đồng bộ giỏ hàng với LocalStorage để 2 trang tự nhận diện nhau
const getSavedCart = () => {
  const saved = localStorage.getItem("vcrons_cart");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("vcrons_cart", JSON.stringify(initCartItems));
  return initCartItems;
};

// ===================== TRANG GIỎ HÀNG (CartPage) =====================
export const CartPage = () => {
  const [items, setItems] = useState(getSavedCart());
  const navigate = useNavigate();

  // Tự động lưu lại mỗi khi có thay đổi (thêm/sửa/xóa)
  useEffect(() => {
    localStorage.setItem("vcrons_cart", JSON.stringify(items));
  }, [items]);

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    );
  };
  
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef" }}>
        <div className="container" style={{ padding: "14px 15px" }}>
          <nav style={{ fontSize: "12px", color: "#999" }}>
            <Link to="/" style={{ color: "#999", textDecoration: "none" }}>Trang chủ</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Giỏ hàng</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 15px 80px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", color: "#1a1a1a", marginBottom: "32px" }}>
          Giỏ Hàng
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</p>
            <p style={{ fontSize: "16px", color: "#aaa", marginBottom: "24px" }}>Giỏ hàng của bạn đang trống.</p>
            <Link to="/shop" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "12px 32px", borderRadius: "2px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", fontFamily: "'Lato', sans-serif" }}>
              TIẾP TỤC MUA SẮM
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
            {/* DANH SÁCH SẢN PHẨM */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 40px", gap: "16px", padding: "0 0 12px", borderBottom: "2px solid #1a1a1a" }}>
                {["SẢN PHẨM", "GIÁ", "SỐ LƯỢNG", ""].map(h => (
                  <span key={h} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#999" }}>{h}</span>
                ))}
              </div>

              {items.map(item => (
                <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 40px", gap: "16px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "80px", height: "80px", background: colorMap[item.color] || "#eee", borderRadius: "2px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)", letterSpacing: "1px" }}>{item.color}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: "0 0 4px" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#999", margin: "0 0 2px" }}>Màu: {item.color}</p>
                      <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Size: EU {item.size}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{formatPrice(item.price)}</span>
                  <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "2px", overflow: "hidden", width: "fit-content" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: "32px", height: "36px", background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#444" }}>−</button>
                    <span style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: "32px", height: "36px", background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#444" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ccc", fontSize: "18px", lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px" }}>
                <Link to="/shop" style={{ color: "#666", fontSize: "12px", textDecoration: "none", fontWeight: 600, letterSpacing: "0.5px" }}>
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "28px", position: "sticky", top: "80px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", color: "#1a1a1a" }}>Đơn hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</h3>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", background: colorMap[item.color] || "#eee", borderRadius: "2px", flexShrink: 0, position: "relative" }}>
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700 }}>{item.quantity}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 2px" }}>{item.name}</p>
                      <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.color} / EU {item.size}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>Tạm tính</span>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>Phí vận chuyển</span>
                <span style={{ fontSize: "12px", color: "#aaa" }}>Tính khi thanh toán</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "0 0 16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a1a" }}>Tổng cộng</span>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "#e60000" }}>{formatPrice(subtotal)}</span>
              </div>
              <button onClick={() => navigate("/checkout")} style={{ width: "100%", padding: "14px", background: "#e60000", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                THANH TOÁN →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ===================== TRANG CHECKOUT (CheckoutPage) =====================
export const CheckoutPage = () => {
  const [form, setForm] = useState({ email: "", fullname: "", phone: "", address: "", province: "", district: "", ward: "", note: "" });
  const [payment, setPayment] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  // Lấy dữ liệu từ bộ nhớ thay vì biến tĩnh
  const items = getSavedCart(); 
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = form.province ? 30000 : 0;

  // ===== STATE CHỨA DỮ LIỆU TỪ API =====
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Gọi API lấy 63 Tỉnh/Thành
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Lỗi gọi API Tỉnh:", err));
  }, []);

  const handleProvinceChange = (e) => {
    const pCode = e.target.value;
    setForm(f => ({ ...f, province: pCode, district: "", ward: "" }));
    setDistricts([]);
    setWards([]);
    if (pCode) {
      fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts));
    }
  };

  const handleDistrictChange = (e) => {
    const dCode = e.target.value;
    setForm(f => ({ ...f, district: dCode, ward: "" }));
    setWards([]);
    if (dCode) {
      fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards));
    }
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Vui lòng nhập email";
    if (!form.fullname) e.fullname = "Vui lòng nhập họ tên";
    if (!form.phone) e.phone = "Vui lòng nhập số điện thoại";
    if (!form.address) e.address = "Vui lòng nhập địa chỉ chi tiết";
    if (!form.province) e.province = "Vui lòng chọn Tỉnh/Thành phố";
    if (!form.district) e.district = "Vui lòng chọn Quận/Huyện";
    if (!form.ward) e.ward = "Vui lòng chọn Phường/Xã";
    if (!payment) e.payment = "Vui lòng chọn phương thức thanh toán";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    // Thành công: Xóa giỏ hàng và chuyển sang step 2
    localStorage.removeItem("vcrons_cart"); 
    setStep(2);
  };

  const inputStyle = (key) => ({
    width: "100%", border: `1px solid ${errors[key] ? "#e60000" : "#ddd"}`, borderRadius: "3px",
    padding: "11px 14px", fontSize: "14px", outline: "none", fontFamily: "'Lato', sans-serif",
    boxSizing: "border-box", color: "#1a1a1a", background: "#fff",
    transition: "border-color 0.2s",
  });

  const labelStyle = { fontSize: "12px", color: "#888", display: "block", marginBottom: "5px" };

  if (step === 2) return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "60px 40px", background: "#fff", borderRadius: "4px", border: "1px solid #efefef", maxWidth: "420px" }}>
        <div style={{ width: "64px", height: "64px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>✓</div>
        <h2 style={{ fontWeight: 900, fontSize: "22px", marginBottom: "10px", color: "#1a1a1a" }}>Đặt hàng thành công!</h2>
        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>Cảm ơn <strong>{form.fullname}</strong>! Đơn hàng của bạn đã được ghi nhận.</p>
        <Link to="/" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "12px 32px", borderRadius: "2px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", fontFamily: "'Lato', sans-serif" }}>VỀ TRANG CHỦ</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="container" style={{ padding: "40px 15px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "28px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "4px" }}>VCRONS</span>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
          <div>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Thông tin nhận hàng</h2>
                <Link to="/login" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none" }}>Đăng nhập</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div><label style={labelStyle}>Email</label><input placeholder="Email" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle("email")} />{errors.email && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.email}</p>}</div>
                <div><label style={labelStyle}>Họ và tên</label><input placeholder="Họ và tên" value={form.fullname} onChange={e => set("fullname", e.target.value)} style={inputStyle("fullname")} />{errors.fullname && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.fullname}</p>}</div>
                <div>
                  <label style={labelStyle}>Số điện thoại</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "3px", padding: "0 10px", gap: "6px", background: "#fff", flexShrink: 0 }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VN" style={{ width: "20px", height: "14px", borderRadius: "2px", objectFit: "cover" }} />
                      <span style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}>+84</span>
                    </div>
                    <input placeholder="Số điện thoại" value={form.phone} onChange={e => set("phone", e.target.value)} style={{ ...inputStyle("phone"), flex: 1 }} />
                  </div>
                  {errors.phone && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.phone}</p>}
                </div>

                {/* ===== DROPDOWN DÙNG API TỈNH THÀNH ===== */}
                <div>
                  <label style={labelStyle}>Tỉnh thành</label>
                  <select value={form.province} onChange={handleProvinceChange} style={{ ...inputStyle("province"), color: form.province ? "#1a1a1a" : "#aaa" }}>
                    <option value="">--- Chọn Tỉnh/Thành phố ---</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  {errors.province && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.province}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Quận huyện</label>
                    <select value={form.district} onChange={handleDistrictChange} disabled={!form.province || districts.length === 0} style={{ ...inputStyle("district"), color: form.district ? "#1a1a1a" : "#aaa", background: !form.province ? "#fafafa" : "#fff" }}>
                      <option value="">--- Chọn Quận/Huyện ---</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                    {errors.district && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.district}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phường xã</label>
                    <select value={form.ward} onChange={e => set("ward", e.target.value)} disabled={!form.district || wards.length === 0} style={{ ...inputStyle("ward"), color: form.ward ? "#1a1a1a" : "#aaa", background: !form.district ? "#fafafa" : "#fff" }}>
                      <option value="">--- Chọn Phường/Xã ---</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                    {errors.ward && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.ward}</p>}
                  </div>
                </div>
                {/* ================================ */}

                <div><label style={labelStyle}>Địa chỉ chi tiết</label><input placeholder="Số nhà, tên đường, ngõ ngách..." value={form.address} onChange={e => set("address", e.target.value)} style={inputStyle("address")} />{errors.address && <p style={{ color: "#e60000", fontSize: "11px", marginTop: "4px" }}>{errors.address}</p>}</div>
                <div><label style={labelStyle}>Ghi chú (tùy chọn)</label><textarea placeholder="Ghi chú (tùy chọn)" value={form.note} onChange={e => set("note", e.target.value)} rows={3} style={{ ...inputStyle("note"), resize: "vertical", lineHeight: "1.5" }} /></div>
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "16px" }}>Vận chuyển</h2>
              {!form.province ? (
                <div style={{ background: "#f0f8ff", border: "1px solid #bfdbfe", borderRadius: "3px", padding: "14px 16px", fontSize: "13px", color: "#2563eb", fontFamily: "'Lato', sans-serif" }}>Vui lòng chọn Tỉnh/Thành phố để xem hình thức vận chuyển.</div>
              ) : (
                <div style={{ border: "1px solid #ddd", borderRadius: "3px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "18px" }}>🚚</span>
                    <span style={{ fontSize: "14px", color: "#1a1a1a" }}>Giao hàng tiêu chuẩn (2-5 ngày)</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatPrice(30000)}</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "16px" }}>Thanh toán</h2>
              {errors.payment && <p style={{ color: "#e60000", fontSize: "12px", marginBottom: "10px" }}>{errors.payment}</p>}
              
              {[
                { value: "vnpay", label: "Thanh toán qua VNPAY-QR", logo: <span style={{ fontWeight: 800, fontSize: "15px", fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}><span style={{ color: "#005BAA" }}>VN</span><span style={{ color: "#ED1C24" }}>PAY</span></span> },
                { value: "momo", label: "Ví MoMo", logo: <span style={{ color: "#A50064", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px", fontFamily: "Arial, sans-serif" }}>MoMo</span> },
                { value: "card", label: "Thẻ Visa / Mastercard / JCB", logo: <span style={{ fontWeight: 900, fontStyle: "italic", color: "#1434CB", fontFamily: "Arial, sans-serif" }}>VISA</span> },
                { value: "cod", label: "Thanh toán khi giao hàng (COD)", logo: <span style={{ fontSize: "14px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>COD</span> },
              ].map(opt => (
                <div key={opt.value} style={{ marginBottom: "8px" }}>
                  <label onClick={() => { setPayment(opt.value); setErrors(e => ({ ...e, payment: "" })); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${payment === opt.value ? "#1a1a1a" : "#ddd"}`, borderRadius: "3px", padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s", background: payment === opt.value ? "#fafafa" : "#fff", marginBottom: 0 }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${payment === opt.value ? "#1a1a1a" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{payment === opt.value && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a1a1a" }} />}</div>
                      <span style={{ fontSize: "14px", color: "#1a1a1a" }}>{opt.label}</span>
                    </div>
                    <div style={{ background: "#fff", padding: "2px 8px", borderRadius: "3px", border: "1px solid #eee", display: "flex", alignItems: "center", height: "28px" }}>{opt.logo}</div>
                  </label>
                  
                  {/* Khu vực sổ xuống hiển thị QR Code cho MoMo hoặc VNPAY */}
                  {payment === opt.value && (opt.value === "vnpay" || opt.value === "momo") && (
                    <div style={{ border: "1px solid #1a1a1a", borderTop: "none", borderRadius: "0 0 3px 3px", padding: "20px", background: "#fafafa", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: "#555", marginBottom: "12px" }}>Mở ứng dụng <strong>{opt.label.replace("Ví ", "")}</strong> trên điện thoại và quét mã QR bên dưới để thanh toán.</p>
                      <div style={{ width: "160px", height: "160px", margin: "0 auto", border: "1px solid #ddd", padding: "8px", borderRadius: "8px", background: "#fff" }}>
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ThanhToan${opt.value.toUpperCase()}VcronsVshop`} alt="QR Code" style={{ width: "100%", height: "100%" }} />
                      </div>
                      <p style={{ fontSize: "12px", color: "#e60000", marginTop: "12px", fontWeight: 700 }}>Tổng tiền: {formatPrice(subtotal + shipping)}</p>
                    </div>
                  )}

                  {/* Thông báo nhỏ khi chọn Thẻ Ngân hàng */}
                  {payment === opt.value && opt.value === "card" && (
                    <div style={{ border: "1px solid #1a1a1a", borderTop: "none", borderRadius: "0 0 3px 3px", padding: "16px", background: "#fafafa", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>Hệ thống sẽ chuyển hướng bạn đến cổng thanh toán an toàn sau khi nhấn Đặt hàng.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link to="/cart" style={{ color: "#666", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>‹ Quay về giỏ hàng</Link>
              <button onClick={handleSubmit} style={{ background: "#e60000", color: "#fff", border: "none", borderRadius: "3px", padding: "14px 36px", fontSize: "14px", fontWeight: 800, letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", fontFamily: "'Lato', sans-serif" }}>ĐẶT HÀNG</button>
            </div>
          </div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <div style={{ position: "sticky", top: "20px" }}>
            <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>Đơn hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</h3>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "48px", height: "48px", background: colorMap[item.color] || "#eee", borderRadius: "3px", flexShrink: 0, position: "relative" }}><span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700 }}>{item.quantity}</span></div>
                    <div><p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 3px" }}>{item.name}</p><p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.color} / EU {item.size}</p></div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "16px 0" }} />
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input placeholder="Nhập mã giảm giá" style={{ flex: 1, border: "1px solid #ddd", borderRadius: "3px", padding: "10px 12px", fontSize: "13px", outline: "none", fontFamily: "'Lato', sans-serif" }} /><button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "3px", padding: "10px 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Lato', sans-serif" }}>Áp dụng</button>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "0 0 12px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ fontSize: "13px", color: "#666" }}>Tạm tính</span><span style={{ fontSize: "13px" }}>{formatPrice(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}><span style={{ fontSize: "13px", color: "#666" }}>Phí vận chuyển</span><span style={{ fontSize: "13px", color: shipping ? "#1a1a1a" : "#aaa" }}>{shipping ? formatPrice(shipping) : "-"}</span></div>
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "0 0 14px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>Tổng cộng</span><span style={{ fontSize: "20px", fontWeight: 900, color: "#e60000" }}>{formatPrice(subtotal + shipping)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};