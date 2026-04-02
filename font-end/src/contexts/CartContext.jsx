/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Lưu giỏ hàng vào localStorage để không mất khi tải lại trang
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartShaking, setIsCartShaking] = useState(false);

  // 1. THÊM SẢN PHẨM VÀO GIỎ
  const addToCart = useCallback((product, color, size, quantity = 1) => {
    setCartItems((prev) => {
      // Kiểm tra xem sản phẩm cùng màu + size đã có trong giỏ chưa
      const existIdx = prev.findIndex(
        (i) => i.productId === product._id && i.color === color.name && i.size === size
      );

      let newItems;
      if (existIdx > -1) {
        // Nếu có rồi → tăng số lượng
        newItems = prev.map((item, idx) =>
          idx === existIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Nếu chưa có → thêm mới
        newItems = [
          ...prev,
          {
            id: `${product._id}-${color.name}-${size}`, // Key duy nhất
            productId: product._id,
            name: product.name,
            price: product.price,
            color: color.name,
            colorHex: color.hex,
            image: color.images?.[0] || "",
            size,
            quantity,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });

    // Hiệu ứng rung icon giỏ hàng trên Header
    setIsCartShaking(true);
    setTimeout(() => setIsCartShaking(false), 600);
  }, []);

  // 2. CẬP NHẬT SỐ LƯỢNG
  const updateQuantity = useCallback((itemId, quantity) => {
    setCartItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  // 3. XOÁ 1 SẢN PHẨM
  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  // 4. XOÁ TOÀN BỘ GIỎ HÀNG
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
  }, []);

  // Tính tổng số lượng (hiển thị trên icon giỏ hàng)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng tiền
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Chuyển cartItems thành format orderItems cho API
  const toOrderItems = () =>
    cartItems.map((item) => ({
      product: item.productId,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      isCartShaking,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toOrderItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng trong CartProvider!");
  return ctx;
};