const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, optionalAuth, adminOnly } = require("../middleware/authMiddleware");

// ─── USER ─────────────────────────────────────────────────────────────────────
// Tạo đơn hàng — guest không cần token, nhưng nếu có sẽ gắn user vào đơn
router.post("/", optionalAuth, orderController.createOrder);

// ⚠️ QUAN TRỌNG: /my-orders phải đặt TRƯỚC /:id
// Nếu đặt sau, Express sẽ hiểu "my-orders" là một :id → gọi nhầm getOrderById
router.get("/my-orders", protect, orderController.getUserOrders);

// Huỷ đơn hàng của mình
router.patch("/:id/cancel", protect, orderController.cancelOrder);

// ─── ADMIN ────────────────────────────────────────────────────────────────────
// Lấy TẤT CẢ đơn hàng (admin)
router.get("/", protect, adminOnly, orderController.getOrders);

// Cập nhật trạng thái đơn hàng (admin)
router.put("/:id", protect, adminOnly, orderController.updateOrder);

// Xoá đơn hàng (admin)
router.delete("/:id", protect, adminOnly, orderController.deleteOrder);

// Xem chi tiết 1 đơn hàng (user xem của mình, admin xem tất cả)
router.get("/:id", protect, orderController.getOrderById);

module.exports = router;