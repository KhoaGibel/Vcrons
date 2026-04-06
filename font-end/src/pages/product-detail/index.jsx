import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

// ===================== IMAGE GALLERY =====================
const ImageGallery = ({ images, productName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const mainRef = useRef(null);

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
      <div
        ref={mainRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative", aspectRatio: "1/1", borderRadius: "4px", overflow: "hidden", 
          cursor: zoomed ? "crosshair" : "zoom-in", background: "#f0f0f0",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <img src={images[activeIdx]} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {zoomed && (
          <div style={{
            position: "absolute", inset: 0, backgroundImage: `url(${images[activeIdx]})`,
            backgroundSize: "cover", transform: `scale(2.2)`,
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`, pointerEvents: "none",
          }} />
        )}

        <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", zIndex: 5 }}>
          {activeIdx + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setActiveIdx(i)} style={{
            flex: 1, aspectRatio: "1/1", background: `url(${img}) center/cover`, backgroundColor: "#f0f0f0",
            border: i === activeIdx ? "2.5px solid #1a1a1a" : "2px solid transparent",
            borderRadius: "3px", cursor: "pointer", outline: "none", transition: "all 0.2s",
            transform: i === activeIdx ? "scale(1.04)" : "scale(1)"
          }} />
        ))}
      </div>
    </div>
  );
};

const RelatedCard = ({ product, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0] || "https://placehold.co/600x600/f0f0f0/aaa?text=Crocs";
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div onClick={() => navigate(`/product/${product._id}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", background: "#fff", border: "1px solid #efefef", borderRadius: "4px", overflow: "hidden", transition: "all 0.25s", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}>
      <div style={{ background: `url(${image}) center/cover`, backgroundColor: "#f0f0f0", aspectRatio: "4/3", position: "relative" }}>
        {discount && <span style={{ position: "absolute", top: "10px", left: "10px", background: "#e60000", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "2px" }}>-{discount}%</span>}
      </div>
      <div style={{ padding: "14px" }}>
        {/* 👉 ĐÃ FIX MÀU: Đậm hơn cho category */}
        <p style={{ fontSize: "11px", color: "#777", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 700, letterSpacing: "0.5px" }}>{product.category}</p>
        <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 800, color: discount ? "#e60000" : "#1a1a1a", fontSize: "15px" }}>{formatPrice(product.price)}</span>
          {product.originalPrice && <span style={{ fontSize: "12px", color: "#aaa", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: "14px", color: s <= Math.round(rating || 5) ? "#f59e0b" : "#ddd" }}>★</span>)}
    </div>
    <span style={{ fontSize: "13px", fontWeight: 800, color: "#1a1a1a" }}>{rating || "5.0"}</span>
    <span style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>({count || 10} đánh giá)</span>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, aRes] = await Promise.all([
          fetch(`https://vcrons.onrender.com/api/products/${id}`),
          fetch(`https://vcrons.onrender.com/api/products`)
        ]);
        const pData = await pRes.json();
        const aData = await aRes.json();
        setProduct(pData);
        const all = Array.isArray(aData) ? aData : (aData.products || aData.data || []);
        setRelated(all.filter(p => p._id !== id).slice(0, 4));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
    setSelectedSize(null); setQuantity(1); setAddedToCart(false); setSizeError(false);
  }, [id]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center", fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>Đang tải...</div>;
  if (!product || product.message) return <div style={{ padding: "100px", textAlign: "center", color: "red", fontSize: "18px", fontWeight: 700 }}>Không tìm thấy sản phẩm!</div>;

  let displayImages = product.images?.length > 0 ? [...product.images] : ["https://placehold.co/600x600/f0f0f0/aaa?text=Crocs"];
  while (displayImages.length > 0 && displayImages.length < 4) {
      displayImages.push(displayImages[0]);
  }

  const sizes = product.sizes?.length > 0 ? product.sizes : [36, 37, 38, 39, 40, 41, 42, 43];
  const features = product.features?.length > 0 ? product.features : ["Chất liệu Croslite™ độc quyền", "Siêu nhẹ, chống trơn trượt", "Có thể điều chỉnh quai sau", "Kháng khuẩn, khử mùi tự nhiên"];
  const description = product.description || "Đôi dép Crocs huyền thoại. Nhẹ như không khí, bền bỉ theo thời gian.";
  
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    let cart = JSON.parse(localStorage.getItem("vcrons_cart")) || [];
    const colorName = product.colors?.[0]?.name || product.color || "Mặc định";
    const newItem = { id: product._id, name: product.name, price: product.price, image: displayImages[0], color: colorName, size: selectedSize, quantity };
    const idx = cart.findIndex(i => i.id === newItem.id && i.size === newItem.size);
    if (idx >= 0) cart[idx].quantity += quantity; else cart.push(newItem);
    localStorage.setItem("vcrons_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "13px 15px" }}>
        <div className="container" style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>
          <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Trang chủ</Link> › <Link to="/shop" style={{ color: "#666", textDecoration: "none" }}>Sản phẩm</Link> › <span style={{ color: "#1a1a1a", fontWeight: 800 }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 15px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: "20px" }}>
            <ImageGallery key={product._id} images={displayImages} productName={product.name} />
          </div>

          <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                {product.isNewProduct && <span style={{ background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 9px", borderRadius: "2px" }}>MỚI</span>}
                {discount && <span style={{ background: "#e60000", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "3px 9px", borderRadius: "2px" }}>-{discount}%</span>}
            </div>
            
            {/* 👉 ĐÃ FIX MÀU: Danh mục và Tên SP nổi bật hơn */}
            <p style={{ fontSize: "12px", color: "#555", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 700 }}>{product.category}</p>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px", color: "#1a1a1a" }}>{product.name}</h1>
            
            <StarRating rating={product.rating} count={product.reviewCount} />
            
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px" }}>
               <span style={{ fontSize: "30px", fontWeight: 900, color: discount ? "#e60000" : "#1a1a1a" }}>{formatPrice(product.price)}</span>
               {product.originalPrice && <span style={{ fontSize: "18px", color: "#888", textDecoration: "line-through", fontWeight: 600 }}>{formatPrice(product.originalPrice)}</span>}
            </div>
            
            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", marginBottom: "24px" }} />

            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontSize: "12px", fontWeight: 800, color: sizeError ? "#e60000" : "#1a1a1a", transition: "color 0.2s", margin: 0 }}>
                    {sizeError ? "⚠ VUI LÒNG CHỌN SIZE" : `KÍCH CỠ: EU ${selectedSize || ""}`}
                </p>
                <button style={{ fontSize: "12px", color: "#555", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>Hướng dẫn chọn size</button>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }} style={{ width: "52px", height: "52px", border: selectedSize === s ? "2px solid #1a1a1a" : "1px solid #ddd", background: selectedSize === s ? "#1a1a1a" : "#fff", color: selectedSize === s ? "#fff" : "#1a1a1a", borderRadius: "3px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", border: "1px solid #ccc", borderRadius: "3px", background: "#fff" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "46px", height: "54px", border: "none", background: "none", cursor: "pointer", fontSize: "20px", color: "#1a1a1a", fontWeight: 600 }}>−</button>
                {/* 👉 ĐÃ FIX MÀU: Số lượng hiển thị đen nét căng */}
                <span style={{ width: "48px", height: "54px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px", color: "#1a1a1a", borderLeft: "1px solid #ccc", borderRight: "1px solid #ccc" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "46px", height: "54px", border: "none", background: "none", cursor: "pointer", fontSize: "20px", color: "#1a1a1a", fontWeight: 600 }}>+</button>
              </div>
              <button onClick={handleAddToCart} style={{ flex: 1, background: addedToCart ? "#16a34a" : "#1a1a1a", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 800, cursor: "pointer", fontSize: "14px", letterSpacing: "1px" }}>{addedToCart ? "✓ ĐÃ THÊM" : "THÊM VÀO GIỎ HÀNG"}</button>
            </div>
            <button onClick={() => { if(!selectedSize){setSizeError(true); return;} handleAddToCart(); navigate("/checkout"); }} style={{ width: "100%", height: "54px", background: "#e60000", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 800, cursor: "pointer", fontSize: "14px", letterSpacing: "1px" }}>MUA NGAY</button>

            <div style={{ marginTop: "40px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
                {[["desc","Mô tả"],["features","Tính năng"],["size","Bảng size"]].map(([k, l]) => (
                  <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "15px 25px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid #1a1a1a" : "none", fontWeight: 800, color: activeTab === k ? "#1a1a1a" : "#888", cursor: "pointer", fontSize: "13px", textTransform: "uppercase" }}>{l}</button>
                ))}
              </div>
              <div style={{ padding: "20px 0", fontSize: "14px", color: "#333", lineHeight: 1.8, fontWeight: 500 }}>
                {activeTab === "desc" && <p>{description}</p>}
                {activeTab === "features" && <ul>{features.map((f, i) => <li key={i}>✓ {f}</li>)}</ul>}
                {activeTab === "size" && (
                    <div style={{ background: "#ccc", padding: "1px", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px" }}>
                            {[["EU","US","UK","CM"],["36","4","3","22.5"],["37","5","4","23"],["38","6","5","24"],["39","7","6","24.5"],["40","8","7","25.5"],["41","9","8","26"],["42","10","9","27"]].map((row, ri) => (
                                row.map((cell, ci) => (
                                    <div key={`${ri}-${ci}`} style={{ background: ri === 0 ? "#1a1a1a" : "#fff", color: ri === 0 ? "#fff" : "#1a1a1a", padding: "12px 10px", textAlign: "center", fontSize: "13px", fontWeight: ri === 0 ? 800 : 600 }}>{cell}</div>
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

      {/* 👉 ĐÃ FIX MÀU: SẢN PHẨM LIÊN QUAN */}
      <div className="container" style={{ padding: "64px 15px 80px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a1a", textTransform: "uppercase", marginBottom: "28px", letterSpacing: "1px" }}>Sản phẩm liên quan</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {related.map(p => <RelatedCard key={p._id} product={p} navigate={navigate} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;