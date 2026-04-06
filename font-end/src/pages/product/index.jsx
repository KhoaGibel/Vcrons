import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

const colorMap = {
  "Trắng": "#f5f5f5", "Đen": "#1a1a1a", "Be": "#dfd6ca", "Xanh Biển": "#172134",
  "Tím": "#b39ddb", "Nâu": "#a0785a", "Xanh": "#7ec8e3", "Hồng": "#f4a7b9", 
  "Vàng": "#ffd54f", "Cam": "#ffb74d", "Hồng Bone": "#e8dcc7", "Xanh Navy": "#172134"
};

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  if (!product) return null;

  // 👉 TỐI ƯU LOGIC HIỂN THỊ ẢNH: Ưu tiên mảng images ngoài cùng (Cloudinary)
  let displayImage = null;
  if (product.images && product.images.length > 0) {
      displayImage = product.images[0];
  } else if (product.colors && product.colors.length > 0 && product.colors[0].images?.length > 0) {
      displayImage = product.colors[0].images[0];
  }

  const displayColor = product.colors?.length > 0 ? product.colors[0].name : (product.color || "Mặc định");

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-card" style={{
        background: "#fff", border: "1px solid #efefef", borderRadius: "4px", overflow: "hidden", 
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)", cursor: "pointer",
      }}>
        <div style={{ width: "100%", aspectRatio: "4/3", background: colorMap[displayColor] || "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {displayImage ? (
            <img src={displayImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.2)", letterSpacing: "2px", fontWeight: 800 }}>CROCS</span>
                <p style={{ fontSize: "10px", color: "#ccc", margin: 0 }}>Chưa có ảnh</p>
            </div>
          )}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
             {product.isNewProduct && <span style={{ background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 8px", borderRadius: "2px" }}>MỚI</span>}
          </div>
        </div>
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "#999", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>{product.category || "Giày dép"}</p>
          <h3 className="product-title" style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 10px", color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name || "Đang cập nhật"}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="product-price" style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductPage = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("https://vcrons.onrender.comapi/products")
      .then(res => res.json())
      .then(data => {
        const productList = Array.isArray(data) ? data : (data.products || data.data || []);
        setDbProducts(productList);
        setLoading(false);
      })
      .catch(err => { console.error("Lỗi Fetch:", err); setLoading(false); });
  }, []);

  const sortedProducts = [...dbProducts].sort((a, b) => {
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return 0; 
  });

  return (
    <div className="shop-page" style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="shop-header" style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "48px 0 32px" }}>
        <div className="container text-center">
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Bộ Sưu Tập</p>
          <h1 className="shop-title" style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "6px", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>SẢN PHẨM</h1>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #efefef", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "14px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: "1px solid #ddd", borderRadius: "2px", padding: "6px 12px", fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span style={{ fontSize: "13px", color: "#666", whiteSpace: "nowrap" }}>{sortedProducts.length} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 15px 80px" }}>
        {loading ? (
           <div style={{ textAlign: "center", padding: "80px 0" }}>Đang tải sản phẩm...</div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
            <p style={{ fontSize: "16px", letterSpacing: "1px" }}>Không tìm thấy dữ liệu từ Backend.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {sortedProducts.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;