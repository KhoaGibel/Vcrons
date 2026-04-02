import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Thêm useNavigate
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

// ==========================================
// 1. COMPONENT DARK MODE
// ==========================================
const DarkMode = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const element = document.documentElement;

    React.useEffect(() => {
        if (theme === "dark") {
            element.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            element.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    return (
        <div
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ position: "relative", width: "24px", height: "24px", marginRight: "20px", cursor: "pointer" }}
        >
            {/* Mặt trời */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                    position: "absolute", width: "100%", height: "100%", transition: "all 0.5s ease",
                    opacity: theme === "dark" ? 0 : 1, transform: theme === "dark" ? "rotate(90deg)" : "rotate(0deg)",
                    color: "#f39c12"
                }}>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            {/* Mặt trăng */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                    position: "absolute", width: "100%", height: "100%", transition: "all 0.5s ease",
                    opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0deg)" : "rotate(-90deg)",
                    color: "#34495e"
                }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </div>
    );
};

// ==========================================
// 2. HEADER CHÍNH
// ==========================================
const Header = () => {
    const [isUserOpen, setIsUserOpen] = useState(false);
    // State quản lý từ khóa tìm kiếm
    const [keyword, setKeyword] = useState(""); 
    
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Hook chuyển trang

    // Hàm xử lý khi submit form tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?search=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <header className="header py-3 border-bottom header-container" style={{ transition: "all 0.3s ease" }}>
            <div className="container-fluid px-4 d-flex align-items-center justify-content-between">

                {/* LOGO */}
                <div className="logo" style={{ flex: "1" }}>
                    <Link to="/" className="text-dark font-weight-bold logo-text"
                        style={{ fontSize: "32px", fontFamily: "Arial, sans-serif", textDecoration: "none" }}>
                        Vcrons
                    </Link>
                </div>

                {/* MENU */}
                <nav className="main-menu d-none d-lg-flex justify-content-center" style={{ flex: "2", gap: "32px" }}>
                    <Link to="/product" className="text-dark font-weight-bold text-uppercase menu-link"
                        style={{ textDecoration: "none", fontSize: "18px", letterSpacing: "0.5px" }}>
                        Shop
                    </Link>
                    <Link to="/product?category=Classic" className="text-dark font-weight-bold text-uppercase menu-link"
                        style={{ textDecoration: "none", fontSize: "18px", letterSpacing: "0.5px" }}>
                        Classic
                    </Link>
                    <Link to="/product?category=Crush" className="text-dark font-weight-bold text-uppercase menu-link"
                        style={{ textDecoration: "none", fontSize: "18px", letterSpacing: "0.5px" }}>
                        Crush
                    </Link>
                    <Link to="/about" className="text-dark font-weight-bold text-uppercase menu-link"
                        style={{ textDecoration: "none", fontSize: "18px", letterSpacing: "0.5px" }}>
                        About Us
                    </Link>
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="right-actions d-flex align-items-center justify-content-end" style={{ flex: "1" }}>
                    <DarkMode />

                    {/* FORM TÌM KIẾM ĐÃ ĐƯỢC KÍCH HOẠT */}
                    <form 
                        onSubmit={handleSearch} 
                        className="search-bar position-relative d-none d-md-block mr-4"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <input 
                            type="text" 
                            className="form-control rounded-pill px-3 py-2 border-0 font-weight-bold search-input"
                            placeholder="Tìm kiếm..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{ width: "220px", fontSize: "15px", backgroundColor: "#e9ecef", paddingRight: "40px" }} 
                        />
                        <button 
                            type="submit" 
                            style={{ 
                                position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", 
                                background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#444" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Giỏ hàng */}
                    <Link to="/cart" className="text-dark position-relative mr-4 icon-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="badge badge-pill badge-dark position-absolute cart-badge"
                                style={{ top: "-5px", right: "-10px", fontSize: "11px", background: "#e60000", color: "#fff" }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User icon + Dropdown */}
                    <div className="position-relative"
                        onMouseEnter={() => setIsUserOpen(true)}
                        onMouseLeave={() => setIsUserOpen(false)}>
                        <div className="text-dark icon-link" style={{ cursor: "pointer" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                        </div>

                        <div className="position-absolute bg-white shadow rounded border dropdown-user"
                            style={{
                                top: "40px", right: "0", width: "190px", zIndex: 1000,
                                opacity: isUserOpen ? 1 : 0, visibility: isUserOpen ? "visible" : "hidden",
                                transition: "all 0.25s ease", transform: isUserOpen ? "translateY(0)" : "translateY(10px)"
                            }}>
                            {user ? (
                                <>
                                    {/* Đã đăng nhập */}
                                    <div className="px-3 py-2 border-bottom">
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#1a1a1a" }}>{user.name}</p>
                                        <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>{user.role}</p>
                                    </div>
                                    <Link to="/profile" className="d-block px-3 py-2 text-dark menu-link"
                                        style={{ textDecoration: "none", fontSize: "14px" }}>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link to="/history-order" className="d-block px-3 py-2 text-dark menu-link"
                                        style={{ textDecoration: "none", fontSize: "14px" }}>
                                        Đơn hàng của tôi
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link to="/admin" className="d-block px-3 py-2 menu-link"
                                            style={{ textDecoration: "none", fontSize: "14px", color: "#e60000", fontWeight: 700 }}>
                                            Quản trị Admin
                                        </Link>
                                    )}
                                    <div className="border-top my-1"></div>
                                    <button onClick={logout}
                                        className="d-block w-100 text-left px-3 py-2 menu-link"
                                        style={{ background: "none", border: "none", fontSize: "14px", color: "#e60000", fontWeight: 700, cursor: "pointer" }}>
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Chưa đăng nhập */}
                                    <Link to="/login" className="d-block px-3 py-2 text-dark menu-link"
                                        style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
                                        Đăng nhập
                                    </Link>
                                    <div className="border-top my-1"></div>
                                    <Link to="/register" className="d-block px-3 py-2 text-dark menu-link"
                                        style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
                                        Đăng ký tài khoản
                                    </Link>
                                    <Link to="/profile"></Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;