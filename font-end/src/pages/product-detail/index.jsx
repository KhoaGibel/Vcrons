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
            <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5 }}>‹</button>
            <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", zIndex: 5 }}>›</button>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setActiveIdx(i)} style={{
            flex: 1, aspectRatio: "1/1", background: `url(${img}) center/cover`,
            border: i === activeIdx ? "2.5px solid #1a1a1a" : "2px solid transparent",
            borderRadius: "3px", cursor: "pointer", outline: "none", transition: "all 0.2s",
            transform: i === activeIdx ? "scale(1.04)" : "scale(1)",
          }} />
        ))}
      </div>
    </div>
  );
};

// ===================== RELATED PRODUCTS =====================
const RelatedCard = ({ product, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0] || "https://placehold.co/600x600/f0f0f0/aaa?text=Crocs";
  return (
    <div onClick={() => navigate(`/product/${product._id}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", background: "#fff", border: "1px solid #efefef", borderRadius: "4px", overflow: "hidden", transition: "all 0.25s", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}>
      <div style={{ background: `url(${image}) center/cover`, aspectRatio: "4/3" }} />
      <div style={{ padding: "14px" }}>
        <p style={{ fontSize: "10px", color: "#aaa", textTransform: "uppercase", margin: "0 0 4px" }}>{product.category}</p>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h4>
        <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>{formatPrice(product.price)}</span>
      </div>
    </div>
  );
};

// FIX LỖI UNUSED VARS: Dùng biến count để hiện lượt đánh giá
const StarRating = ({ rating, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: "14px", color: s <= Math.round(rating || 5) ? "#f59e0b" : "#ddd" }}>★</span>)}
    </div>
    <span style={{ fontSize: "13px", fontWeight: 700 }}>{rating || "5.0"}</span>
    <span style={{ fontSize: "12px", color: "#aaa" }}>({count || 10} đánh giá)</span>
  </div>
);

// ===================== MAIN COMPONENT =====================
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
          fetch(`http://localhost:3000/api/products/${id}`),
          fetch(`http://localhost:3000/api/products`)
        ]);
        const pData = await pRes.json();
        const aData = await aRes.json();
        setProduct(pData);
        setRelated(Array.isArray(aData) ? aData.filter(p => p._id !== id).slice(0, 4) : []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
    setSelectedSize(null); setQuantity(1); setAddedToCart(false);
  }, [id]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Đang tải...</div>;
  if (!product || product.message) return <div style={{ padding: "100px", textAlign: "center" }}>Không tìm thấy sản phẩm!</div>;

  // Đảm bảo luôn có 4 ảnh cho đẹp giao diện
  let displayImages = product.images?.length > 0 ? [...product.images] : ["https://placehold.co/600x600/f0f0f0/aaa?text=Crocs"];
  while (displayImages.length > 0 && displayImages.length < 4) displayImages.push(displayImages[0]);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    let cart = JSON.parse(localStorage.getItem("vcrons_cart")) || [];
    const newItem = { id: product._id, name: product.name, price: product.price, image: displayImages[0], color: product.color || "Mặc định", size: selectedSize, quantity };
    const idx = cart.findIndex(i => i.id === newItem.id && i.size === newItem.size);
    if (idx >= 0) cart[idx].quantity += quantity; else cart.push(newItem);
    localStorage.setItem("vcrons_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "13px 15px" }}>
        <div className="container" style={{ fontSize: "12px", color: "#aaa" }}>
          <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link> › <Link to="/shop" style={{ color: "#aaa", textDecoration: "none" }}>Sản phẩm</Link> › <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{product.name}</span>
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
            </div>
            <p style={{ fontSize: "11px", color: "#bbb", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>{product.category}</p>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px" }}>{product.name}</h1>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <div style={{ fontSize: "30px", fontWeight: 900, marginBottom: "28px" }}>{formatPrice(product.price)}</div>
            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", marginBottom: "24px" }} />

            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: sizeError ? "#e60000" : "#1a1a1a", marginBottom: "12px" }}>{sizeError ? "⚠ VUI LÒNG CHỌN SIZE" : `KÍCH CỠ: EU ${selectedSize || ""}`}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[36,37,38,39,40,41,42].map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{ width: "52px", height: "52px", border: selectedSize === s ? "2px solid #1a1a1a" : "1px solid #e0e0e0", background: selectedSize === s ? "#1a1a1a" : "#fff", color: selectedSize === s ? "#fff" : "#555", borderRadius: "3px", fontWeight: 700, cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "3px" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "46px", height: "54px", border: "none", background: "none", cursor: "pointer", fontSize: "20px" }}>−</button>
                <span style={{ width: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "46px", height: "54px", border: "none", background: "none", cursor: "pointer", fontSize: "20px" }}>+</button>
              </div>
              <button onClick={handleAddToCart} style={{ flex: 1, background: addedToCart ? "#16a34a" : "#1a1a1a", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 800, cursor: "pointer" }}>{addedToCart ? "✓ ĐÃ THÊM" : "THÊM VÀO GIỎ"}</button>
            </div>
            <button onClick={() => { if(!selectedSize){setSizeError(true); return;} handleAddToCart(); navigate("/checkout"); }} style={{ width: "100%", height: "54px", background: "#e60000", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 800, cursor: "pointer" }}>MUA NGAY</button>

            {/* BẢNG SIZE CHI TIẾT MÀ KHOA YÊU CẦU */}
            <div style={{ marginTop: "40px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
                {[["desc","Mô tả"],["features","Tính năng"],["size","Bảng size"]].map(([k, l]) => (
                  <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "15px 25px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid #1a1a1a" : "none", fontWeight: 700, color: activeTab === k ? "#1a1a1a" : "#aaa", cursor: "pointer" }}>{l}</button>
                ))}
              </div>
              <div style={{ padding: "20px 0", fontSize: "14px", color: "#555", lineHeight: 1.8 }}>
                {activeTab === "desc" && <p>{product.description || "Đôi dép Crocs huyền thoại, siêu nhẹ và bền bỉ. Thiết kế thông thoáng giúp đôi chân thoải mái suốt ngày dài."}</p>}
                {activeTab === "features" && <ul>{(product.features?.length ? product.features : ["Chất liệu Croslite™ độc quyền", "Siêu nhẹ, chống trượt", "Dễ dàng vệ sinh"]).map((f, i) => <li key={i}>✓ {f}</li>)}</ul>}
                {activeTab === "size" && (
                    <div style={{ background: "#eee", padding: "1px", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px" }}>
                            {[["EU","US","UK","CM"],["36","4","3","22.5"],["37","5","4","23"],["38","6","5","24"],["39","7","6","24.5"],["40","8","7","25.5"],["41","9","8","26"],["42","10","9","27"]].map((row, ri) => (
                                row.map((cell, ci) => (
                                    <div key={`${ri}-${ci}`} style={{ background: ri === 0 ? "#1a1a1a" : "#fff", color: ri === 0 ? "#fff" : "#444", padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: ri === 0 ? 700 : 400 }}>{cell}</div>
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

      <div className="container" style={{ padding: "64px 15px 80px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 900, textTransform: "uppercase", marginBottom: "28px" }}>Sản phẩm liên quan</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {related.map(p => <RelatedCard key={p._id} product={p} navigate={navigate} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;