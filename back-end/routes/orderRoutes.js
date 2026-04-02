const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─── USER ROUTES ─────────────────────────────────────────
// Tạo đơn hàng (guest không cần đăng nhập, nhưng nếu có token thì gắn user vào đơn)
router.post("/", orderController.createOrder);

// Lấy đơn hàng của chính mình (cần đăng nhập)
router.get("/my-orders", protect, orderController.getUserOrders);

// Xem chi tiết đơn hàng (cần đăng nhập - kiểm tra chủ sở hữu trong controller)
router.get("/:id", protect, orderController.getOrderById);

// Huỷ đơn hàng của mình (cần đăng nhập)
router.patch("/:id/cancel", protect, orderController.cancelOrder);

// ─── ADMIN ROUTES ─────────────────────────────────────────
// Lấy tất cả đơn hàng
router.get("/", protect, adminOnly, orderController.getOrders);

// Cập nhật trạng thái đơn hàng
router.put("/:id", protect, adminOnly, orderController.updateOrder);

// Xoá đơn hàng
router.delete("/:id", protect, adminOnly, orderController.deleteOrder);

module.exports = router;