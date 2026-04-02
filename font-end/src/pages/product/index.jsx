import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dữ liệu mẫu - sau này thay bằng API call từ Express/MongoDB
const sampleProducts = [
  // 8 đôi cũ
  { id: 1, name: "Classic Clog", category: "Classic", price: 850000, originalPrice: 1200000, color: "Trắng", image: null, isNew: true, isSale: true },
  { id: 2, name: "Baya Clog", category: "Baya", price: 950000, originalPrice: null, color: "Đen", image: null, isNew: true, isSale: false },
  { id: 3, name: "Crush Clog", category: "Crush", price: 1100000, originalPrice: 1400000, color: "Hồng", image: null, isNew: false, isSale: true },
  { id: 4, name: "Classic Sandal", category: "Classic", price: 750000, originalPrice: null, color: "Nâu", image: null, isNew: false, isSale: false },
  { id: 5, name: "Baya Platform", category: "Baya", price: 1200000, originalPrice: 1500000, color: "Xanh", image: null, isNew: true, isSale: true },
  { id: 6, name: "Crush Platform", category: "Crush", price: 1300000, originalPrice: null, color: "Tím", image: null, isNew: false, isSale: false },
  { id: 7, name: "Classic Slip On", category: "Classic", price: 680000, originalPrice: 900000, color: "Vàng", image: null, isNew: false, isSale: true },
  { id: 8, name: "Baya Sandal", category: "Baya", price: 820000, originalPrice: null, color: "Cam", image: null, isNew: true, isSale: false },

  // --- 5 ĐÔI MỚI THÊM VÀO ---
  { id: 9, name: "Classic Slate", category: "Classic", price: 850000, originalPrice: null, color: "Xám", image: null, isNew: true, isSale: false },
  { id: 10, name: "Baya Bone Clog", category: "Baya", price: 950000, originalPrice: 1200000, color: "Be", image: null, isNew: false, isSale: true },
  { id: 11, name: "Crush Quartz", category: "Crush", price: 1100000, originalPrice: null, color: "Hồng Nude", image: null, isNew: true, isSale: false },
  { id: 12, name: "Classic Navy", category: "Classic", price: 850000, originalPrice: null, color: "Xanh Biển", image: null, isNew: false, isSale: false },
  { id: 13, name: "Baya Oxygen", category: "Baya", price: 950000, originalPrice: 1100000, color: "Xanh Da Trời", image: null, isNew: true, isSale: true },
];

const categories = ["Tất cả", "Classic", "Baya", "Crush"];
const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "newest", label: "Mới nhất" },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

// Màu placeholder dựa theo tên màu
const colorMap = {
  "Trắng": "#f5f5f5", "Đen": "#1a1a1a", "Hồng": "#f4a7b9", "Nâu": "#a0785a",
  "Xanh": "#7ec8e3", "Tím": "#b39ddb", "Vàng": "#ffd54f", "Cam": "#ffb74d",
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#fff",
        border: "1px solid #efefef",
        borderRadius: "4px",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
      }}>
        {/* Hình ảnh sản phẩm */}
        <div style={{
          width: "100%",
          aspectRatio: "4/3",
          background: colorMap[product.color] || "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>
              {product.color}
            </span>
          )}

          {/* Badges */}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {product.isNew && (
              <span style={{ background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 8px", borderRadius: "2px" }}>
                MỚI
              </span>
            )}
            {discount && (
              <span style={{ background: "#e60000", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "3px 8px", borderRadius: "2px" }}>
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "#999", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>
            {product.category}
          </p>
          <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 10px", color: "#1a1a1a" }}>
            {product.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: product.isSale ? "#e60000" : "#1a1a1a" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "13px", color: "#bbb", textDecoration: "line-through" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductPage = () => {
  // Vì đã bỏ thanh tìm kiếm/lọc, ta chỉ cần gọi thẳng danh sách sampleProducts
  const filtered = sampleProducts;

  return (
    <div className="shop-page" style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif", transition: "background-color 0.3s ease" }}>
      
      {/* --- PAGE HEADER (Chỉ giữ lại phần này) --- */}
      <div className="shop-header" style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "48px 0 32px", transition: "all 0.3s ease" }}>
        <div className="container text-center">
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>
            Bộ Sưu Tập
          </p>
          <h1 className="shop-title" style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "6px", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>
            Sản Phẩm
          </h1>
        </div>
      </div>

      {/* ĐÃ XÓA TOÀN BỘ THANH FILTER BAR Ở ĐÂY */}

      {/* --- PRODUCT GRID (Lưới sản phẩm) --- */}
      <div className="container" style={{ padding: "40px 15px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
            <p style={{ fontSize: "16px", letterSpacing: "1px" }}>Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
