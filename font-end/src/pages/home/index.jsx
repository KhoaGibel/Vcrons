import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/user/banner1.jpg";
import banner2 from "../../assets/user/banner2.jpg";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const colorMap = {
  "Trắng": "#f5f5f5", "Đen": "#1a1a1a", "Be": "#dfd6ca", "Xanh Biển": "#172134"
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="product-card" style={{
        background: "#fff", border: "1px solid #efefef", borderRadius: "4px", overflow: "hidden", 
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)", cursor: "pointer",
      }}>
        <div style={{ width: "100%", aspectRatio: "4/3", background: colorMap[product.color] || "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>Crocs</span>
          )}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ background: "#1a1a1a", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", padding: "3px 8px", borderRadius: "2px" }}>MỚI</span>
          </div>
        </div>
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "#999", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>{product.category}</p>
          <h3 className="product-title" style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 10px", color: "#1a1a1a" }}>{product.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="product-price" style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const banners = [banner1, banner2];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    fetch("https://vcrons.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        // Xử lý thông minh: Dù API trả về Array trực tiếp hay bọc trong Object thì đều lấy được
        const productList = Array.isArray(data) ? data : (data.products || data.data || []);
        
        if (productList.length > 0) {
          // Lọc ra mấy đôi dép có trạng thái active
          const activeProds = productList.filter(p => p.status === "active");
          
          // Nếu có active thì lấy 4 cái, không có active thì lấy bừa 4 cái đầu tiên trong kho
          if (activeProds.length > 0) {
              setTrendingProducts(activeProds.slice(0, 4));
          } else {
              setTrendingProducts(productList.slice(0, 4));
          }
        }
      })
      .catch(err => console.error("Lỗi:", err));
      
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="home-page" style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "'Lato', sans-serif" }}>
      <div className="hero-banner" style={{ width: "100%", height: "75vh", minHeight: "550px", position: "relative", overflow: "hidden" }}>
          {banners.map((img, index) => (
            <div
              key={index}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: "cover", backgroundPosition: "center",
                transition: "opacity 1.5s ease-in-out",
                opacity: currentSlide === index ? 1 : 0,
                zIndex: currentSlide === index ? 1 : 0
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)" }}></div>
            </div>
          ))}
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", color: "#fff", padding: "0 20px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: "16px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "20px", fontWeight: 800 }}>Bộ sưu tập mới nhất 2026</p>
              <h1 style={{ fontSize: "clamp(45px, 7vw, 85px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "3px", margin: "0 0 35px", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>VCRONS SUMMER</h1>
              <Link to="/product" style={{ display: "inline-block", backgroundColor: "#fff", color: "#1a1a1a", padding: "18px 48px", fontSize: "15px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", borderRadius: "2px" }}>Mua Ngay</Link>
              <div style={{ position: "absolute", bottom: "30px", display: "flex", gap: "12px" }}>
                  {banners.map((_, i) => (
                      <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: "12px", height: "12px", borderRadius: "50%", cursor: "pointer", backgroundColor: currentSlide === i ? "#fff" : "rgba(255,255,255,0.4)" }} />
                  ))}
              </div>
          </div>
      </div>

      <div className="container" style={{ padding: "80px 15px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "3px", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 12px" }}>Sản Phẩm Nổi Bật</h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#1a1a1a", margin: "0 auto" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888", fontSize: "15px" }}>Đang tải sản phẩm...</p>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/product" style={{ display: "inline-block", padding: "12px 32px", border: "2px solid #1a1a1a", color: "#1a1a1a", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>Xem tất cả sản phẩm</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;