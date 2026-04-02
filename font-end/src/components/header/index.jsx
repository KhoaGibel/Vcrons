import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ==========================================
// 1. COMPONENT DARK MODE
// ==========================================
const DarkMode = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const element = document.documentElement;

    useEffect(() => {
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
            {/* SVG Mặt trời (Chế độ Sáng) */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                    position: "absolute", width: "100%", height: "100%", transition: "all 0.5s ease",
                    opacity: theme === "dark" ? 0 : 1, transform: theme === "dark" ? "rotate(90deg)" : "rotate(0deg)",
                    color: "#f39c12" 
                }}
            >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>

            {/* SVG Mặt trăng (Chế độ Tối) */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                    position: "absolute", width: "100%", height: "100%", transition: "all 0.5s ease",
                    opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0deg)" : "rotate(-90deg)",
                    color: "#34495e" 
                }}
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </div>
    );
};

// ==========================================
// 2. COMPONENT HEADER CHÍNH
// ==========================================
const Header = () => {
    // Thêm State để điều khiển cái Dropdown của nút User
    const [isUserOpen, setIsUserOpen] = useState(false);

    return (
        <header className="header py-3 border-bottom header-container" style={{ transition: "all 0.3s ease" }}>
            <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
                
                {/* --- 1. PHẦN LOGO --- */}
                <div className="logo" style={{ flex: "1" }}>
                    <Link to="/" className="text-dark font-weight-bold logo-text" style={{ fontSize: "32px", fontFamily: "Arial, sans-serif", textDecoration: "none" }}>
                        Vcrons
                    </Link>
                </div>

                {/* --- 2. PHẦN MENU Ở GIỮA --- */}
                <nav className="main-menu d-none d-lg-flex justify-content-center" style={{ flex: "2" }}>
                    <Link to="/shop" className="text-dark font-weight-bold text-uppercase mr-4 menu-link" style={{textDecoration: 'none', fontSize: '20px', letterSpacing: '0.5px'}}>Shop</Link>
                    <Link to="/classic" className="text-dark font-weight-bold text-uppercase mr-4 menu-link" style={{textDecoration: 'none', fontSize: '20px', letterSpacing: '0.5px'}}>Classic</Link>
                    <Link to="/crush" className="text-dark font-weight-bold text-uppercase mr-4 menu-link" style={{textDecoration: 'none', fontSize: '20px', letterSpacing: '0.5px'}}>Crush</Link>
                    <Link to="/baya" className="text-dark font-weight-bold text-uppercase menu-link" style={{textDecoration: 'none', fontSize: '20px', letterSpacing: '0.5px'}}>Baya</Link>
                </nav>

                {/* --- 3. PHẦN TÌM KIẾM & ICON BÊN PHẢI --- */}
                <div className="right-actions d-flex align-items-center justify-content-end" style={{ flex: "1" }}>
                    
                    <DarkMode />
                    
                    {/* Thanh tìm kiếm */}
                    <div className="search-bar position-relative d-none d-md-block mr-4">
                        <input 
                            type="text" 
                            className="form-control rounded-pill px-3 py-2 border-0 font-weight-bold search-input" 
                            placeholder="Tìm kiếm..." 
                            style={{ width: "250px", fontSize: "16px", backgroundColor: "#e9ecef", paddingRight: "40px" }} 
                        />
                        <span style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#444" viewBox="0 0 16 16" className="search-icon">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                    </div>

                    {/* Icon Giỏ hàng */}
                    <Link to="/cart" className="text-dark position-relative mr-4 icon-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                        <span className="badge badge-pill badge-dark position-absolute cart-badge" style={{ top: "-5px", right: "-10px", fontSize: "13px" }}>
                            0
                        </span>
                    </Link>

                    {/* Icon User với Dropdown */}
                    <div 
                        className="position-relative"
                        onMouseEnter={() => setIsUserOpen(true)}
                        onMouseLeave={() => setIsUserOpen(false)}
                    >
                        <Link to="/login" className="text-dark icon-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </Link>
                        
                        {/* Bảng Dropdown Đăng nhập / Đăng ký */}
                        <div className="position-absolute bg-white shadow rounded border dropdown-user" 
                             style={{ 
                                 top: "40px", right: "0", width: "180px", zIndex: 1000,
                                 opacity: isUserOpen ? 1 : 0, visibility: isUserOpen ? "visible" : "hidden",
                                 transition: "all 0.3s ease", transform: isUserOpen ? "translateY(0)" : "translateY(10px)"
                             }}>
                            <Link to="/login" className="d-block px-3 py-2 text-dark menu-link" style={{textDecoration: "none", fontSize: "14px", fontWeight: "600"}}>
                                Đăng nhập
                            </Link>
                            <div className="border-top my-1"></div>
                            <Link to="/register" className="d-block px-3 py-2 text-dark menu-link" style={{textDecoration: "none", fontSize: "14px", fontWeight: "600"}}>
                                Đăng ký tài khoản
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;