import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// ==========================================
// 1. IMPORT CÁC COMPONENT LAYOUT
// ==========================================
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";

// ==========================================
// 2. IMPORT CÁC PAGES
// ==========================================
import Home from "./pages/home/index.jsx";
import ProductPage from "./pages/product/index.jsx";
import ProductDetail from "./pages/product-detail/index.jsx";
import Login from "./pages/login/Login.jsx"; 
import Register from "./pages/register/Register.jsx"; 
import { CartPage, CheckoutPage } from "./pages/cart/CartCheckout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AboutPage from "./pages/about/index.jsx";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext"; 
import UserProfile from "./pages/profile/UserProfile.jsx";



// ==========================================
// 3. COMPONENT LAYOUT CHÍNH QUẢN LÝ HEADER & FOOTER
// ==========================================
const MainLayout = ({ children }) => {
    const location = useLocation();

    // KIỂM TRA ĐIỀU KIỆN ẨN HEADER & FOOTER
    // Sẽ ẩn nếu đang ở: /login, /register, /checkout HOẶC bất kỳ link nào bắt đầu bằng /admin
    const hideHeaderFooter = 
        location.pathname === "/login" || 
        location.pathname === "/register" || 
        location.pathname === "/checkout" ||
        location.pathname.startsWith("/admin");

    return (
        <>
            {/* Chỉ hiện Header nếu KHÔNG PHẢI là các trang cần ẩn */}
            {!hideHeaderFooter && <Header />}
            
            {/* Nội dung thay đổi theo từng trang */}
            {children}

            {/* Chỉ hiện Footer nếu KHÔNG PHẢI là các trang cần ẩn */}
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

// ==========================================
// 4. CẤU HÌNH ROUTER TỔNG
// ==========================================
function App() {
    return (
        // BỌC THÊM AUTHPROVIDER Ở NGOÀI CÙNG NHƯ NÀY NÈ:
        <AuthProvider>
            <CartProvider>
                <MainLayout>
                    <Routes>
                        {/* --- NHÓM 1: CÁC TRANG CÓ HEADER & FOOTER --- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<ProductPage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/about" element={<AboutPage />} />

                        {/* --- NHÓM 2: CÁC TRANG TRỐNG --- */}
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/register" element={<Register />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<UserProfile />} />
                        
                        {/* --- NHÓM 3: TRANG ADMIN (CÓ BẢO VỆ) --- */}
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            {/* Dùng /admin/* để AdminDashboard tự quản lý route con bên trong */}
                            <Route path="/admin/*" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </MainLayout>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;