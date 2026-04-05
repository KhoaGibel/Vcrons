import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const colorMap = { "Trắng": "#f0f0f0", "Xanh": "#7ec8e3", "Đen": "#2a2a2a", "Hồng": "#f4a7b9", "Be": "#dfd6ca", "Vàng": "#ffd54f", "Cam": "#ffb74d" };
const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
const getSavedCart = () => { try { return JSON.parse(localStorage.getItem("vcrons_cart")) || []; } catch { return []; } };

const PAYMENT_METHODS = [
  {
    id: "vnpay",
    label: "VNPAY",
    logo: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <span style={{ fontWeight: 900, fontSize: "15px", letterSpacing: "-0.5px", lineHeight: 1 }}>
          <span style={{ color: "#005baa" }}>VN</span><span style={{ color: "#ed1c24" }}>PAY</span>
        </span>
        <span style={{ fontSize: "9px", color: "#888", letterSpacing: "0.5px" }}>QR Code</span>
      </div>
    ),
  },
  {
    id: "momo",
    label: "MoMo",
    logo: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#a50064", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "10px" }}>M</span>
        </div>
        <span style={{ fontSize: "9px", color: "#888" }}>MoMo</span>
      </div>
    ),
  },
  {
    id: "visa",
    label: "Visa / Mastercard",
    logo: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span style={{ color: "#1a1f71", fontStyle: "italic", fontWeight: 900, fontSize: "14px" }}>VISA</span>
          <div style={{ display: "flex" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#eb001b" }}></div>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f79e1b", marginLeft: "-6px", opacity: 0.9 }}></div>
          </div>
        </div>
        <span style={{ fontSize: "9px", color: "#888" }}>Thẻ quốc tế</span>
      </div>
    ),
  },
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng",
    logo: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <span style={{ fontSize: "22px" }}>💵</span>
        <span style={{ fontSize: "9px", color: "#888", fontWeight: 700 }}>COD</span>
      </div>
    ),
  },
];

export const CartPage = () => {
  const [items, setItems] = useState(getSavedCart());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("vcrons_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  }, [items]);

  const updateQty = (id, color, size, delta) =>
    setItems(prev =>
      prev.map(i => (i.id === id && i.color === color && i.size === size)
        ? { ...i, quantity: Math.max(0, i.quantity + delta) }
        : i
      ).filter(i => i.quantity > 0)
    );

  const removeItem = (id, color, size) =>
    setItems(prev => prev.filter(i => !(i.id === id && i.color === color && i.size === size)));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef" }}>
        <div className="container" style={{ padding: "13px 15px", fontSize: "12px", color: "#aaa" }}>
          <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Giỏ hàng</span>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 15px 80px" }}>
        <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, letterSpacing: "5px", textTransform: "uppercase", color: "#1a1a1a", marginBottom: "32px" }}>
          Giỏ Hàng {totalItems > 0 && <span style={{ fontSize: "16px", color: "#aaa", fontWeight: 400 }}>({totalItems} sản phẩm)</span>}
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "56px", marginBottom: "12px" }}>🛒</p>
            <p style={{ fontSize: "16px", color: "#aaa", marginBottom: "24px" }}>Giỏ hàng của bạn đang trống.</p>
            <Link to="/product" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "13px 32px", borderRadius: "2px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px" }}>
              TIẾP TỤC MUA SẮM →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 130px 36px", gap: "12px", paddingBottom: "12px", borderBottom: "2px solid #1a1a1a" }}>
                {["SẢN PHẨM", "ĐƠN GIÁ", "SỐ LƯỢNG", ""].map(h => (
                  <span key={h} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#999", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {items.map((item, idx) => (
                <div key={`${item.id}-${item.color}-${item.size}-${idx}`}
                  style={{ display: "grid", gridTemplateColumns: "1fr 110px 130px 36px", gap: "12px", alignItems: "center", padding: "18px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ width: "76px", height: "76px", flexShrink: 0, borderRadius: "3px", background: colorMap[item.color] || "#eee", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.image || (item.images && item.images[0]) ? (
                        <img src={item.image || item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)", letterSpacing: "1px" }}>CROCS</span>
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: "15px", color: "#1a1a1a", margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px" }}>Màu: <strong style={{ color: "#555" }}>{item.color}</strong></p>
                      <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>Size: <strong style={{ color: "#555" }}>EU {item.size}</strong></p>
                    </div>
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>{formatPrice(item.price)}</span>
                  <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "2px", overflow: "hidden", width: "fit-content" }}>
                    <button onClick={() => updateQty(item.id, item.color, item.size, -1)} style={{ width: "32px", height: "36px", background: "#fafafa", border: "none", cursor: "pointer", fontSize: "18px", color: "#333", borderRight: "1px solid #ddd" }}>−</button>
                    <span style={{ width: "38px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#1a1a1a" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.color, item.size, 1)} style={{ width: "32px", height: "36px", background: "#fafafa", border: "none", cursor: "pointer", fontSize: "18px", color: "#333", borderLeft: "1px solid #ddd" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id, item.color, item.size)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ccc", fontSize: "20px", lineHeight: 1, transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#e60000"} onMouseLeave={e => e.target.style.color = "#ccc"}>×</button>
                </div>
              ))}
              <Link to="/product" style={{ display: "inline-block", marginTop: "20px", color: "#666", fontSize: "12px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.5px" }}>← Tiếp tục mua sắm</Link>
            </div>

            <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "24px", position: "sticky", top: "80px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", color: "#1a1a1a" }}>Tóm tắt ({totalItems} sản phẩm)</h3>
              {items.map((item, idx) => (
                <div key={`sum-${idx}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "42px", height: "42px", flexShrink: 0, borderRadius: "2px", background: colorMap[item.color] || "#eee", overflow: "hidden", position: "relative" }}>
                      {(item.image || (item.images && item.images[0])) && (
                        <img src={item.image || item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700 }}>{item.quantity}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{item.color} / EU {item.size}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap", flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>Tạm tính</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>Phí vận chuyển</span>
                <span style={{ fontSize: "13px", color: "#aaa" }}>Tính khi thanh toán</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "0 0 16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>Tổng cộng</span>
                <span style={{ fontSize: "20px", fontWeight: 900, color: "#e60000" }}>{formatPrice(subtotal)}</span>
              </div>
              <button onClick={() => navigate("/checkout")} style={{ width: "100%", padding: "15px", background: "#e60000", color: "#fff", border: "none", borderRadius: "2px", fontSize: "14px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>THANH TOÁN →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ email: "", fullname: "", phone: "", address: "", province: "", district: "", ward: "", note: "" });
  const [payment, setPayment] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const items = getSavedCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = form.province ? 25000 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0 && step === 1) { navigate("/cart"); return; }
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then(r => r.json()).then(setProvinces).catch(() => {});
    if (user) {
      setForm(f => ({ ...f, email: user.email || "", fullname: user.name || "" }));
    }
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = provinces.find(p => String(p.code) === code)?.name || "";
    set("province", code); set("district", ""); set("ward", "");
    setProvinceName(name); setDistricts([]); setWards([]);
    if (code) fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`).then(r => r.json()).then(d => setDistricts(d.districts || []));
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = districts.find(d => String(d.code) === code)?.name || "";
    set("district", code); set("ward", "");
    setDistrictName(name); setWards([]);
    if (code) fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`).then(r => r.json()).then(d => setWards(d.wards || []));
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const name = wards.find(w => String(w.code) === code)?.name || "";
    set("ward", code); setWardName(name);
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Nhập email";
    if (!form.fullname) e.fullname = "Nhập họ tên";
    if (!form.phone) e.phone = "Nhập số điện thoại";
    if (!form.address) e.address = "Nhập địa chỉ chi tiết";
    if (!form.province) e.province = "Chọn Tỉnh/Thành phố";
    if (!form.district) e.district = "Chọn Quận/Huyện";
    if (!form.ward) e.ward = "Chọn Phường/Xã";
    if (!payment) e.payment = "Chọn phương thức thanh toán";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const orderData = {
        email: form.email,
        orderItems: items.map(i => ({
          product: i.id || i._id,
          name: i.name,
          color: i.color,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
          image: i.image || (i.images && i.images[0]) || "",
        })),
        shippingAddress: {
          fullname: form.fullname,
          phone: form.phone,
          address: form.address,
          ward: wardName,
          district: districtName,
          province: provinceName,
          note: form.note || "",
        },
        payment: ["visa", "mastercard"].includes(payment) ? "vnpay" : payment,
        subtotal,
        shippingFee: shipping,
        total,
      };

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST", headers, body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Lỗi hệ thống!");
      }

      localStorage.removeItem("vcrons_cart");
      window.dispatchEvent(new Event("storage"));
      setStep(2);
    } catch (err) {
      alert("❌ Đặt hàng thất bại: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (key) => ({
    width: "100%", border: `1px solid ${errors[key] ? "#e60000" : "#ddd"}`,
    borderRadius: "3px", padding: "11px 14px", fontSize: "14px", outline: "none",
    fontFamily: "'Lato', sans-serif", boxSizing: "border-box", color: "#1a1a1a", background: "#fff",
  });
  const labelStyle = { fontSize: "12px", color: "#888", display: "block", marginBottom: "5px", fontWeight: 600 };
  const errStyle = { color: "#e60000", fontSize: "11px", marginTop: "4px", fontWeight: 600 };

  if (step === 2) return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "60px 48px", background: "#fff", borderRadius: "4px", border: "1px solid #efefef", maxWidth: "440px", width: "100%" }}>
        <div style={{ width: "72px", height: "72px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "32px", border: "2px solid #bbf7d0" }}>✓</div>
        <h2 style={{ fontWeight: 900, fontSize: "24px", marginBottom: "12px", color: "#1a1a1a", letterSpacing: "1px" }}>Đặt hàng thành công!</h2>
        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.8", marginBottom: "6px" }}>
          Cảm ơn <strong style={{ color: "#1a1a1a" }}>{form.fullname}</strong>!
        </p>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "28px" }}>
          Xác nhận đơn hàng sẽ được gửi tới <strong>{form.email}</strong>
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link to="/" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", padding: "12px 24px", borderRadius: "2px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px" }}>
            VỀ TRANG CHỦ
          </Link>
          <Link to="/profile" style={{ display: "inline-block", background: "#fff", color: "#1a1a1a", padding: "12px 24px", borderRadius: "2px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", border: "1px solid #ddd" }}>
            ĐƠN HÀNG CỦA TÔI
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="container" style={{ padding: "36px 15px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "28px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "5px" }}>VCRONS</span>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
          <div>
            <section style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Thông tin nhận hàng</h2>
                {!user && <Link to="/login" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Đăng nhập</Link>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@example.com" style={inputStyle("email")} />
                  {errors.email && <p style={errStyle}>{errors.email}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Họ và tên</label>
                  <input value={form.fullname} onChange={e => set("fullname", e.target.value)} placeholder="Nguyễn Văn A" style={inputStyle("fullname")} />
                  {errors.fullname && <p style={errStyle}>{errors.fullname}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Số điện thoại</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "3px", padding: "0 12px", gap: "6px", background: "#fff", flexShrink: 0 }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VN" style={{ width: "22px" }} />
                      <span style={{ fontSize: "13px", color: "#555", fontWeight: 700 }}>+84</span>
                    </div>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="090 123 4567" style={{ ...inputStyle("phone"), flex: 1 }} />
                  </div>
                  {errors.phone && <p style={errStyle}>{errors.phone}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Tỉnh / Thành phố</label>
                  <select value={form.province} onChange={handleProvinceChange} style={{ ...inputStyle("province"), color: form.province ? "#1a1a1a" : "#aaa" }}>
                    <option value="">--- Chọn Tỉnh/Thành phố ---</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  {errors.province && <p style={errStyle}>{errors.province}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Quận / Huyện</label>
                    <select value={form.district} onChange={handleDistrictChange} disabled={!form.province} style={{ ...inputStyle("district"), color: form.district ? "#1a1a1a" : "#aaa", cursor: !form.province ? "not-allowed" : "pointer" }}>
                      <option value="">--- Quận/Huyện ---</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                    {errors.district && <p style={errStyle}>{errors.district}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phường / Xã</label>
                    <select value={form.ward} onChange={handleWardChange} disabled={!form.district} style={{ ...inputStyle("ward"), color: form.ward ? "#1a1a1a" : "#aaa", cursor: !form.district ? "not-allowed" : "pointer" }}>
                      <option value="">--- Phường/Xã ---</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                    {errors.ward && <p style={errStyle}>{errors.ward}</p>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Địa chỉ chi tiết (số nhà, tên đường)</label>
                  <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="VD: 123 Nguyễn Văn Cừ" style={inputStyle("address")} />
                  {errors.address && <p style={errStyle}>{errors.address}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Ghi chú (tùy chọn)</label>
                  <textarea value={form.note} onChange={e => set("note", e.target.value)} rows={2} placeholder="Ghi chú cho đơn hàng..." style={{ ...inputStyle("note"), resize: "vertical", lineHeight: "1.6" }} />
                </div>
              </div>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a1a", marginBottom: "14px" }}>Vận chuyển</h2>
              {form.province ? (
                <div style={{ border: "1px solid #1a1a1a", borderRadius: "3px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>🚚</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: 0 }}>Giao hàng tiêu chuẩn</p>
                      <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>3–5 ngày làm việc</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "15px", color: "#1a1a1a" }}>{formatPrice(25000)}</span>
                </div>
              ) : (
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "3px", padding: "14px 18px", fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
                  Vui lòng chọn Tỉnh/Thành phố để xem phí vận chuyển.
                </div>
              )}
            </section>

            <section style={{ marginBottom: "36px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a1a", marginBottom: "14px" }}>Phương thức thanh toán</h2>
              {errors.payment && <p style={{ ...errStyle, marginBottom: "10px" }}>{errors.payment}</p>}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => { setPayment(method.id); setErrors(e => ({ ...e, payment: "" })); }}
                    style={{
                      border: `2px solid ${payment === method.id ? "#1a1a1a" : "#ddd"}`,
                      borderRadius: "6px", padding: "14px 8px",
                      background: payment === method.id ? "#f9f9f9" : "#fff",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: "6px", minHeight: "80px",
                      boxShadow: payment === method.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {method.logo}
                    {payment === method.id && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1a1a1a", marginTop: "4px" }} />
                    )}
                  </button>
                ))}
              </div>

              {/* 👉 MÃ QR VÀ HƯỚNG DẪN THANH TOÁN 👈 */}
              {payment && (
                <div style={{ marginTop: "16px", padding: "24px", background: "#fcfcfc", border: "1px dashed #ccc", borderRadius: "6px", textAlign: "center" }}>
                  <p style={{ fontSize: "14px", color: "#1a1a1a", marginBottom: "16px", fontWeight: 700 }}>
                    ✅ Đã chọn: <span style={{ color: "#e60000" }}>{PAYMENT_METHODS.find(m => m.id === payment)?.label}</span>
                  </p>

                  {payment !== "cod" ? (
                    <div>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Thanh_Toan_VCRONS_${payment}`} 
                        alt="QR Code" 
                        style={{ width: "160px", height: "160px", border: "6px solid #fff", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} 
                      />
                      <p style={{ fontSize: "13px", color: "#555", marginTop: "16px", marginBottom: 0, fontWeight: 600 }}>
                        Quét mã QR để thanh toán an toàn.
                      </p>
                      <p style={{ fontSize: "12px", color: "#888", marginTop: "4px", marginBottom: 0 }}>
                        Vui lòng giữ nguyên màn hình sau khi quét mã thành công.
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "#555", margin: 0, fontWeight: 600 }}>
                      💵 Bạn sẽ thanh toán trực tiếp bằng tiền mặt cho nhân viên giao hàng khi nhận được sản phẩm.
                    </p>
                  )}
                </div>
              )}
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link to="/cart" style={{ color: "#666", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
                ‹ Quay về giỏ hàng
              </Link>
              <button onClick={handleSubmit} disabled={submitting} style={{
                background: submitting ? "#aaa" : "#e60000", color: "#fff",
                border: "none", padding: "14px 40px", borderRadius: "3px",
                fontSize: "14px", fontWeight: 800, letterSpacing: "1px",
                cursor: submitting ? "not-allowed" : "pointer", textTransform: "uppercase",
              }}>
                {submitting ? "⏳ Đang xử lý..." : "ĐẶT HÀNG →"}
              </button>
            </div>
          </div>

          <div style={{ position: "sticky", top: "20px" }}>
            <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: "4px", padding: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a1a", marginBottom: "20px", letterSpacing: "1px" }}>
                Đơn hàng ({items.length} sản phẩm)
              </h3>

              {items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "50px", height: "50px", flexShrink: 0, borderRadius: "3px", background: colorMap[item.color] || "#eee", overflow: "hidden", position: "relative" }}>
                      {(item.image || (item.images && item.images[0])) && (
                        <img src={item.image || item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 3px", lineHeight: 1.3 }}>{item.name}</p>
                      <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>{item.color} · EU {item.size}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap", flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <hr style={{ border: "none", borderTop: "1px solid #efefef", margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>Tạm tính</span>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>Phí vận chuyển</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: shipping ? "#1a1a1a" : "#aaa" }}>
                  {shipping ? formatPrice(shipping) : "—"}
                </span>
              </div>
              <hr style={{ border: "none", borderTop: "2px solid #1a1a1a", margin: "0 0 14px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>Tổng cộng</span>
                <span style={{ fontSize: "22px", fontWeight: 900, color: "#e60000" }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};