const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Khai báo 4 đường dẫn (Tương ứng với Thêm - Đọc - Sửa - Xoá)
router.get("/", productController.getProducts);               // Đọc
router.post("/", productController.createProduct);            // Thêm
router.put("/:id", productController.updateProduct);          // Sửa (Cần truyền ID)
router.delete("/:id", productController.deleteProduct);       // Xoá (Cần truyền ID)

module.exports = router;