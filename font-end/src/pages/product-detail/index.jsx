import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// ===================== DỮ LIỆU MẪU =====================
// Mỗi sản phẩm có mảng `images` chứa nhiều ảnh (màu placeholder thay cho ảnh thật)
const allProducts = [
  {
    id: 1,
    name: "Classic Clog",
    category: "Classic",
    price: 850000,
    originalPrice: 1200000,
    description: "Đôi dép Crocs Classic Clog huyền thoại. Nhẹ như không khí, bền bỉ theo thời gian. Thiết kế thông thoáng với những lỗ tròn đặc trưng giúp không khí lưu thông, giữ cho đôi chân luôn khô thoáng và thoải mái suốt cả ngày dài.",
    colors: [
      { name: "Trắng Tinh", hex: "#f5f5f5", images: ["#f5f5f5","#ebebeb","#ddd","#e8e8e8"] },
      { name: "Đen Huyền", hex: "#1a1a1a", images: ["#1a1a1a","#2a2a2a","#111","#222"] },
      { name: "Hồng Pastel", hex: "#f4a7b9", images: ["#f4a7b9","#f7bfcc","#eda0b5","#f9d0da"] },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    isNew: true,
    isSale: true,
    features: ["Chất liệu Croslite™ độc quyền", "Siêu nhẹ, chống trơn trượt", "Có thể điều chỉnh quai sau", "Kháng khuẩn, khử mùi tự nhiên"],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Baya Clog",
    category: "Baya",
    price: 950000,
    originalPrice: null,
    description: "Baya Clog mang lại sự thoải mái tối đa với đế cao hơn Classic. Phù hợp cho các hoạt động ngoài trời, đi dạo biển hay dã ngoại.",
    colors: [
      { name: "Xanh Đại Dương", hex: "#7ec8e3", images: ["#7ec8e3","#6bb8d4","#8ed3ee","#5fa8c4"] },
      { name: "Vàng Nghệ", hex: "#ffd54f", images: ["#ffd54f","#ffc929","#ffe07a","#ffca3a"] },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    isNew: true,
    isSale: false,
    features: ["Đế dày nâng cao", "Quai sau cố định", "Chống thấm nước", "Màu sắc tươi sáng bền màu"],
    rating: 4.5,
    reviewCount: 87,
  },
  {
    id: 3,
    name: "Crush Platform",
    category: "Crush",
    price: 1300000,
    originalPrice: 1600000,
    description: "Crush Platform là sự kết hợp hoàn hảo giữa thời trang và thoải mái. Đế platform cao 6cm tạo chiều cao ấn tượng, thiết kế Y2K đang là xu hướng.",
    colors: [
      { name: "Tím Lavender", hex: "#b39ddb", images: ["#b39ddb","#a685d0","#c4b0e6","#9c7ec9"] },
      { name: "Hồng Sen", hex: "#f48fb1", images: ["#f48fb1","#e97aa0","#f9a5c2","#eb82ab"] },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    isNew: false,
    isSale: true,
    features: ["Đế platform 6cm", "Thiết kế Y2K trendy", "Quai mũi giày đặc biệt", "Phù hợp mọi outfit"],
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: 4,
    name: "Classic Sandal",
    category: "Classic",
    price: 750000,
    originalPrice: null,
    description: "Classic Sandal thiết kế dép quai ngang năng động, phù hợp đi biển, đi bộ và mọi hoạt động hàng ngày. Chất liệu mềm mại không gây trầy xước.",
    colors: [
      { name: "Nâu Caramel", hex: "#a0785a", images: ["#a0785a","#8e6749","#b28a6b","#956e52"] },
      { name: "Cam Sunset", hex: "#ffb74d", images: ["#ffb74d","#ffa726","#ffcc80","#ff9800"] },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    isNew: false,
    isSale: false,
    features: ["Dép quai ngang thoáng khí", "Đế chống trơn chắc chắn", "Thiết kế unisex", "Dễ vệ sinh"],
    rating: 4.3,
    reviewCount: 56,
  },
  {
    id: 5,
    name: "Baya Platform",
    category: "Baya",
    price: 1200000,
    originalPrice: 1500000,
    description: "Baya Platform kết hợp sự thoải mái của dòng Baya với đế nền cao hiện đại. Phong cách streetwear đang được giới trẻ ưa chuộng.",
    colors: [
      { name: "Trắng Ngọc", hex: "#f0f0f0", images: ["#f0f0f0","#e0e0e0","#fafafa","#d5d5d5"] },
      { name: "Xanh Mint", hex: "#80cbc4", images: ["#80cbc4","#6dbdb6","#96d9d3","#5cb0a8"] },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    isNew: true,
    isSale: true,
    features: ["Đế nền platform 4cm", "Phong cách streetwear", "Siêu nhẹ", "Nhiều lựa chọn màu sắc"],
    rating: 4.7,
    reviewCount: 145,
  },
];

const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

// ===================== IMAGE GALLERY =====================
const ImageGallery = ({ images, productName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const mainRef = useRef(null);

  // Reset khi đổi sản phẩm / màu
  useEffect(() => { setActiveIdx(0); setZoomed(false); }, [images]);

  const handleMouseMove = (e) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const prev = () => setActiveIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Main image */}
      <div
        ref={mainRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          aspectRatio: "1/1",
          borderRadius: "4px",
          overflow: "hidden",
          cursor: zoomed ? "crosshair" : "zoom-in",
          background: images[activeIdx],
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {/* Zoom overlay */}
        {zoomed && (
          <div style={{
            position: "absolute", inset: 0,
            background: images[activeIdx],
            transform: `scale(2.2)`,
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transition: "transform-origin 0.05s",
            pointerEvents: "none",
          }} />
        )}

        {/* Badge */}
        <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "6px", zIndex: 5 }}>
          {/* placeholder label */}
          <span style={{ background: "rgba(255,255,255,0.85)", color: "#888", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", padding: "4px 10px", borderRadius: "2px", textTransform: "uppercase" }}>
            Ảnh minh hoạ
          </span>
        </div>

        {/* Image counter */}
        <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", zIndex: 5, letterSpacing: "0.5px" }}>
          {activeIdx + 1} / {images.length}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>‹</button>
            <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>›</button>
          </>
        )}

        {/* Zoom hint */}
        {!zoomed && (
          <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "10px", padding: "4px 10px", borderRadius: "20px", zIndex: 5, letterSpacing: "0.5px" }}>
            🔍 Rê chuột để phóng to
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      <div style={{ display: "flex", gap: "8px" }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: 1,
              aspectRatio: "1/1",
              background: img,
              border: i === activeIdx ? "2.5px solid #1a1a1a" : "2px solid transparent",
              borderRadius: "3px",
              cursor: "pointer",
              outline: "none",
              transition: "border-color 0.2s, transform 0.15s",
              transform: i === activeIdx ? "scale(1.04)" : "scale(1)",
              boxShadow: i === activeIdx ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ===================== RELATED PRODUCTS =====================
const RelatedCard = ({ product, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const firstColor = product.colors[0];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: "#fff",
        border: "1px solid #efefef",
        borderRadius: "4px",
        overflow: "hidden",
        transition: "box-shadow 0.25s, transform 0.25s",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div style={{ background: firstColor.images[0], aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>{firstColor.name}</span>
        {discount && (
          <span style={{ position: "absolute", top: "10px", left: "10px", background: "#e60000", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "2px" }}>
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span style={{ position: "absolute", top: discount ? "30px" : "10px", left: "10px", background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "2px" }}>
            MỚI
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px" }}>
        <p style={{ fontSize: "10px", color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>{product.category}</p>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>{product.name}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 700, color: product.isSale ? "#e60000" : "#1a1a1a", fontSize: "14px" }}>{formatPrice(product.price)}</span>
          {product.originalPrice && <span style={{ fontSize: "11px", color: "#ccc", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>}
        </div>
        {/* Color dots */}
        <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
          {product.colors.map(c => (
            <span key={c.name} title={c.name} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.hex, border: "1px solid rgba(0,0,0,0.1)", display: "inline-block" }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===================== STAR RATING =====================
const StarRating = ({ rating, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: "14px", color: s <= Math.round(rating) ? "#f59e0b" : "#ddd" }}>★</span>
      ))}
    </div>
    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a" }}>{rating}</span>
    <span style={{ fontSize: "12px", color: "#aaa" }}>({count} đánh giá)</span>
  </div>
);

// ===================== MAIN COMPONENT =====================
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = allProducts.find(p => p.id === parseInt(id)) || allProducts[0];
  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).concat(
    allProducts.filter(p => p.id !== product.id && p.category !== product.category)
  ).slice(0, 4);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");

  const currentColor = product.colors[selectedColorIdx];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  // Reset state khi chuyển sản phẩm
  useEffect(() => {
    setSelectedColorIdx(0);
    setSelectedSize(null);
    setQuantity(1);
    setAddedToCart(false);
    setSizeError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2200); return; }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
    // TODO: dispatch to CartContext
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef" }}>
        <div className="container" style={{ padding: "13px 15px" }}>
          <nav style={{ fontSize: "12px", color: "#aaa" }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span style={{ margin: "0 7px" }}>›</span>
            <Link to="/product" style={{ color: "#aaa", textDecoration: "none" }}>Sản phẩm</Link>
            <span style={{ margin: "0 7px" }}>›</span>
            <Link to="/product" style={{ color: "#aaa", textDecoration: "none" }}>{product.category}</Link>
            <span style={{ margin: "0 7px" }}>›</span>
            <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ===== MAIN PRODUCT SECTION ===== */}
      <div className="container" style={{ padding: "48px 15px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

          {/* LEFT: Gallery */}
          <div style={{ position: "sticky", top: "20px" }}>
            <ImageGallery images={currentColor.images} productName={product.name} />
          </div>

          {/* RIGHT: Info */}
          <div>
            {/* Badges row */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {product.isNew && <span style={{ background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 9px", borderRadius: "2px" }}>MỚI</span>}
              {discount && <span style={{ background: "#e60000", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "3px 9px", borderRadius: "2px" }}>-{discount}%</span>}
            </div>

            <p style={{ fontSize: "11px", color: "#bbb", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px" }}>{product.category}</p>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: "#1a1a1a", margin: "0 0 12px", letterSpacing: "2px", textTransform: "uppercase", lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <StarRating rating={product.rating} count={product.reviewCount} />

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px" }}>
              <span style={{ fontSize: "30px", fontWeight: 900, color: product.isSale ? "#e60000" : "#1a1a1a" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: "18px", color: "#ccc", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 24px" }} />

            {/* Chọn màu */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 12px" }}>
                Màu sắc: <span style={{ fontWeight: 400, color: "#888" }}>{currentColor.name}</span>
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(i)}
                    title={color.name}
                    style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: color.hex,
                      border: selectedColorIdx === i ? "3px solid #1a1a1a" : "2px solid #ddd",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: selectedColorIdx === i ? "0 0 0 3px #fff inset" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Chọn size */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{
                  fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", margin: 0,
                  color: sizeError ? "#e60000" : "#1a1a1a",
                  transition: "color 0.2s",
                }}>
                  {sizeError ? "⚠ Vui lòng chọn size" : `Kích cỡ${selectedSize ? ": EU " + selectedSize : ""}`}
                </p>
                <button style={{ fontSize: "11px", color: "#aaa", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Hướng dẫn chọn size
                </button>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    style={{
                      width: "52px", height: "52px",
                      border: selectedSize === size ? "2px solid #1a1a1a" : "1px solid #e0e0e0",
                      background: selectedSize === size ? "#1a1a1a" : "#fff",
                      color: selectedSize === size ? "#fff" : "#555",
                      borderRadius: "3px", fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng + Add to cart */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "3px", overflow: "hidden", flexShrink: 0 }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "46px", height: "54px", background: "#fafafa", border: "none", cursor: "pointer", fontSize: "20px", color: "#555", borderRight: "1px solid #ddd" }}>−</button>
                <span style={{ width: "48px", height: "54px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "46px", height: "54px", background: "#fafafa", border: "none", cursor: "pointer", fontSize: "20px", color: "#555", borderLeft: "1px solid #ddd" }}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, height: "54px",
                  background: addedToCart ? "#16a34a" : "#1a1a1a",
                  color: "#fff", border: "none", borderRadius: "3px",
                  fontSize: "13px", fontWeight: 800, letterSpacing: "2px",
                  textTransform: "uppercase", cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                {addedToCart ? "✓ ĐÃ THÊM VÀO GIỎ" : "THÊM VÀO GIỎ HÀNG"}
              </button>
            </div>

            <button
              onClick={() => { if (!selectedSize) { setSizeError(true); return; } navigate("/checkout"); }}
              style={{ width: "100%", height: "54px", background: "#e60000", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", marginBottom: "28px" }}
            >
              MUA NGAY
            </button>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
              {[
                { icon: "🚚", text: "Giao hàng toàn quốc" },
                { icon: "🔄", text: "Đổi trả trong 30 ngày" },
                { icon: "✅", text: "Hàng chính hãng 100%" },
                { icon: "🔒", text: "Thanh toán bảo mật" },
              ].map(b => (
                <div key={b.text} style={{ display: "flex", gap: "8px", alignItems: "center", background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: "3px", padding: "10px 12px" }}>
                  <span style={{ fontSize: "16px" }}>{b.icon}</span>
                  <span style={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Tabs: Mô tả / Tính năng */}
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #f0f0f0" }}>
                {[["desc","Mô tả"],["features","Tính năng"],["size","Size guide"]].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveTab(key)} style={{
                    padding: "12px 20px", background: "none", border: "none",
                    borderBottom: activeTab === key ? "2px solid #1a1a1a" : "2px solid transparent",
                    fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
                    color: activeTab === key ? "#1a1a1a" : "#aaa",
                    cursor: "pointer", transition: "all 0.2s",
                    marginBottom: "-1px",
                  }}>{label}</button>
                ))}
              </div>

              <div style={{ padding: "20px 0" }}>
                {activeTab === "desc" && (
                  <p style={{ fontSize: "14px", lineHeight: "1.85", color: "#555", margin: 0 }}>{product.description}</p>
                )}
                {activeTab === "features" && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {product.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px", fontSize: "14px", color: "#555" }}>
                        <span style={{ width: "20px", height: "20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#16a34a", flexShrink: 0, marginTop: "1px" }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "size" && (
                  <div>
                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Bảng quy đổi size Crocs (EU → CM):</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#eee", border: "1px solid #eee", borderRadius: "3px", overflow: "hidden" }}>
                      {[["EU","US","UK","CM"],["36","4","3","22.5"],["37","5","4","23"],["38","6","5","24"],["39","7","6","24.5"],["40","8","7","25.5"],["41","9","8","26"],["42","10","9","27"],["43","11","10","27.5"]].map((row, ri) => (
                        row.map((cell, ci) => (
                          <div key={`${ri}-${ci}`} style={{ background: ri === 0 ? "#1a1a1a" : "#fff", color: ri === 0 ? "#fff" : "#444", padding: "8px 12px", fontSize: ri === 0 ? "10px" : "12px", fontWeight: ri === 0 ? 700 : 400, letterSpacing: ri === 0 ? "1px" : 0, textAlign: "center" }}>{cell}</div>
                        ))
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SẢN PHẨM LIÊN QUAN ===== */}
      <div className="container" style={{ padding: "64px 15px 80px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <p style={{ fontSize: "10px", color: "#bbb", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 4px" }}>Khám phá thêm</p>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900, color: "#1a1a1a", letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
              Sản phẩm liên quan
            </h2>
          </div>
          <Link to="/product" style={{ fontSize: "12px", fontWeight: 700, color: "#888", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #ddd", paddingBottom: "2px" }}>
            Xem tất cả →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {related.map(p => (
            <RelatedCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
