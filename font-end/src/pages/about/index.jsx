import React from "react";
import { Link } from "react-router-dom";

// Placeholder màu thay cho ảnh thật — thay src={} bằng import ảnh thật của bạn
// Ví dụ: import heroImg from "../../assets/about/hero.jpg"

const reasons = [
    {
        icon: "⚡",
        title: "Siêu nhẹ",
        desc: "Chất liệu Croslite™ độc quyền chỉ nặng vài chục gram — đi cả ngày không mỏi chân.",
    },
    {
        icon: "🛡️",
        title: "Bền bỉ theo thời gian",
        desc: "Không bong tróc, không mùi, không mốc. Giặt xong là như mới.",
    },
    {
        icon: "🌊",
        title: "Chống nước hoàn toàn",
        desc: "Đi biển, đi mưa, đi bếp — không lo ướt, không lo trơn trượt.",
    },
    {
        icon: "🎨",
        title: "Cá tính & đa dạng",
        desc: "Hàng trăm màu sắc, từ tối giản đến rực rỡ, phù hợp mọi phong cách.",
    },
    {
        icon: "💚",
        title: "Thân thiện môi trường",
        desc: "Crocs cam kết sản xuất bền vững và dùng vật liệu tái chế từ 2021.",
    },
    {
        icon: "🏆",
        title: "Thương hiệu toàn cầu",
        desc: "Hơn 100 quốc gia, hơn 1 tỷ đôi đã bán — Crocs là biểu tượng thoải mái thế giới.",
    },
];

const timeline = [
    { year: "2002", text: "Crocs ra đời tại Colorado, Mỹ — chiếc dép đầu tiên được giới thiệu tại hội chợ thuyền Fort Lauderdale." },
    { year: "2006", text: "IPO thành công, Crocs chính thức niêm yết trên sàn NASDAQ." },
    { year: "2017", text: "Hợp tác với Post Malone và Balenciaga — Crocs trở thành biểu tượng thời trang đường phố." },
    { year: "2021", text: "Cam kết Net Zero vào 2030, ra mắt dòng sản phẩm từ vật liệu tái chế." },
    { year: "2024", text: "Crocs lọt top 10 thương hiệu giày dép được yêu thích nhất toàn cầu." },
];

const AboutPage = () => {
    return (
        <div style={{ fontFamily: "'Lato', sans-serif", background: "#fff" }}>

            {/* ── HERO ── */}
            <div style={{
                background: "#1a1a1a",
                minHeight: "480px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Background decorative */}
                <div style={{
                    position: "absolute", right: 0, top: 0, bottom: 0, width: "45%",
                    background: "#e60000", clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                    opacity: 0.9,
                }} />

                <div className="container" style={{ position: "relative", zIndex: 2, padding: "80px 15px" }}>
                    <p style={{ color: "#e60000", fontWeight: 700, letterSpacing: "4px", fontSize: "12px", textTransform: "uppercase", marginBottom: "16px" }}>
                        Về chúng tôi
                    </p>
                    <h1 style={{
                        color: "#fff", fontWeight: 900, fontSize: "clamp(32px, 5vw, 64px)",
                        letterSpacing: "3px", textTransform: "uppercase", lineHeight: 1.1,
                        maxWidth: "560px", marginBottom: "24px",
                    }}>
                        Tại sao chúng tôi chọn Crocs?
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", lineHeight: "1.8", maxWidth: "480px", marginBottom: "32px" }}>
                        Không phải ngẫu nhiên — đây là quyết định sau khi chúng tôi thử đủ loại dép trên đời và nhận ra: không có gì thoải mái hơn Crocs.
                    </p>
                    <Link to="/product" style={{
                        display: "inline-block", background: "#fff", color: "#1a1a1a",
                        padding: "14px 36px", borderRadius: "2px", textDecoration: "none",
                        fontWeight: 800, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase",
                    }}>
                        Xem sản phẩm →
                    </Link>
                </div>
            </div>

            {/* ── CÂU CHUYỆN CỦA CHÚNG TÔI ── */}
            <div style={{ background: "#fafafa", padding: "80px 0" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
                        {/* Ảnh placeholder — thay bằng ảnh thật */}
                        <div style={{
                            background: "linear-gradient(135deg, #e60000 0%, #1a1a1a 100%)",
                            borderRadius: "4px", aspectRatio: "4/3",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexDirection: "column", gap: "12px",
                        }}>
                            {/* TODO: thay bằng <img src={yourImage} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"4px"}} /> */}
                            <span style={{ fontSize: "48px" }}>👟</span>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "2px" }}>THAY ẢNH Ở ĐÂY</span>
                        </div>

                        <div>
                            <p style={{ color: "#e60000", fontWeight: 700, letterSpacing: "3px", fontSize: "11px", textTransform: "uppercase", marginBottom: "12px" }}>Câu chuyện</p>
                            <h2 style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "#1a1a1a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>
                                Từ một đôi dép đến một cửa hàng
                            </h2>
                            <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#555", marginBottom: "16px" }}>
                                Tất cả bắt đầu từ một buổi chiều đi dạo phố và một đôi Crocs Classic màu trắng. Nhẹ đến mức tưởng không mang gì, chống nước, không gây mùi — chúng tôi đã bị thuyết phục ngay lập tức.
                            </p>
                            <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#555", marginBottom: "24px" }}>
                                <strong>Vcrons Vshop</strong> ra đời với một mục tiêu đơn giản: mang Crocs chính hãng đến tay người Việt với mức giá hợp lý và dịch vụ tận tâm. Chúng tôi không bán giày — chúng tôi bán sự thoải mái.
                            </p>
                            <div style={{ display: "flex", gap: "32px" }}>
                                {[["500+", "Đơn hàng"], ["100%", "Chính hãng"], ["4.9★", "Đánh giá"]].map(([num, label]) => (
                                    <div key={label}>
                                        <p style={{ fontWeight: 900, fontSize: "28px", color: "#e60000", margin: "0 0 2px" }}>{num}</p>
                                        <p style={{ fontSize: "12px", color: "#999", margin: 0, letterSpacing: "1px" }}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── LÝ DO CHỌN CROCS ── */}
            <div style={{ padding: "80px 0", background: "#fff" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "52px" }}>
                        <p style={{ color: "#e60000", fontWeight: 700, letterSpacing: "3px", fontSize: "11px", textTransform: "uppercase", marginBottom: "10px" }}>Tại sao Crocs?</p>
                        <h2 style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 40px)", color: "#1a1a1a", letterSpacing: "3px", textTransform: "uppercase" }}>
                            6 lý do bạn nên có một đôi
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                        {reasons.map((r) => (
                            <div key={r.title} style={{
                                border: "1px solid #efefef", borderRadius: "4px", padding: "32px 24px",
                                transition: "box-shadow 0.2s, transform 0.2s",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <span style={{ fontSize: "36px", display: "block", marginBottom: "14px" }}>{r.icon}</span>
                                <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#1a1a1a", marginBottom: "8px" }}>{r.title}</h3>
                                <p style={{ fontSize: "14px", color: "#777", lineHeight: "1.7", margin: 0 }}>{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── ẢNH GALLERY (thêm ảnh thật vào đây) ── */}
            <div style={{ background: "#1a1a1a", padding: "80px 0" }}>
                <div className="container">
                    <p style={{ color: "#e60000", fontWeight: 700, letterSpacing: "3px", fontSize: "11px", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>Bộ sưu tập</p>
                    <h2 style={{ fontWeight: 900, fontSize: "clamp(22px, 3vw, 36px)", color: "#fff", letterSpacing: "3px", textTransform: "uppercase", textAlign: "center", marginBottom: "40px" }}>
                        Crocs trong cuộc sống
                    </h2>

                    {/* Grid ảnh — TODO: thay background bằng ảnh thật */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "200px 200px", gap: "12px" }}>
                        {[
                            { grid: "1 / 1 / 3 / 2", bg: "#e60000", label: "Classic White — đi làm, đi chợ, đi đâu cũng được" },
                            { grid: "1 / 2 / 2 / 3", bg: "#333", label: "Crush Platform" },
                            { grid: "1 / 3 / 2 / 4", bg: "#555", label: "Baya Xanh" },
                            { grid: "2 / 2 / 3 / 3", bg: "#888", label: "Classic Đen" },
                            { grid: "2 / 3 / 3 / 4", bg: "#aaa", label: "Classic Hồng" },
                        ].map((item, i) => (
                            <div key={i} style={{
                                gridArea: item.grid, background: item.bg, borderRadius: "3px",
                                display: "flex", alignItems: "flex-end", padding: "16px",
                                position: "relative", overflow: "hidden",
                            }}>
                                {/* TODO: thêm <img> thật vào đây */}
                                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TIMELINE LỊCH SỬ CROCS ── */}
            <div style={{ padding: "80px 0", background: "#fafafa" }}>
                <div className="container" style={{ maxWidth: "720px" }}>
                    <div style={{ textAlign: "center", marginBottom: "52px" }}>
                        <p style={{ color: "#e60000", fontWeight: 700, letterSpacing: "3px", fontSize: "11px", textTransform: "uppercase", marginBottom: "10px" }}>Lịch sử</p>
                        <h2 style={{ fontWeight: 900, fontSize: "clamp(22px, 3vw, 36px)", color: "#1a1a1a", letterSpacing: "2px", textTransform: "uppercase" }}>
                            Crocs qua các năm
                        </h2>
                    </div>

                    <div style={{ position: "relative", paddingLeft: "40px", borderLeft: "2px solid #efefef" }}>
                        {timeline.map((item, i) => (
                            <div key={i} style={{ position: "relative", marginBottom: "36px" }}>
                                {/* Dot */}
                                <div style={{
                                    position: "absolute", left: "-49px", top: "4px",
                                    width: "16px", height: "16px", borderRadius: "50%",
                                    background: i === 0 ? "#e60000" : "#1a1a1a",
                                    border: "3px solid #fff",
                                    boxShadow: "0 0 0 2px #ddd",
                                }} />
                                <p style={{ fontWeight: 900, color: "#e60000", fontSize: "13px", letterSpacing: "2px", margin: "0 0 4px" }}>{item.year}</p>
                                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7", margin: 0 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div style={{ background: "#e60000", padding: "64px 0", textAlign: "center" }}>
                <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>
                    Sẵn sàng thử chưa?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", marginBottom: "32px" }}>
                    Hàng chính hãng — giao toàn quốc — đổi trả trong 30 ngày.
                </p>
                <Link to="/product" style={{
                    display: "inline-block", background: "#fff", color: "#e60000",
                    padding: "14px 40px", borderRadius: "2px", textDecoration: "none",
                    fontWeight: 800, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase",
                }}>
                    Mua ngay →
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;