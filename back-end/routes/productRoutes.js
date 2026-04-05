const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Import chính xác file config của sếp
const { upload } = require("../config/cloudinaryConfig"); 

// ================= CÁC ROUTE API =================

// PUBLIC: Khách hàng xem sản phẩm
router.get("/", productController.getProducts);               
router.get("/:id", productController.getProductById);

// ADMIN: Tạo / Sửa / Xoá sản phẩm
// Kẹp `upload.array('images', 4)` vào giữa để nó bắt file ảnh gửi lên Cloudinary trước khi chạy hàm create/update
router.post("/", protect, adminOnly, upload.array('images', 4), productController.createProduct);            
router.put("/:id", protect, adminOnly, upload.array('images', 4), productController.updateProduct);          
router.delete("/:id", protect, adminOnly, productController.deleteProduct);       

module.exports = router;