const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Import cổng kiểm duyệt ảnh

router.get("/", productController.getProducts);               
router.get("/:id", productController.getProductById);

// Cho phép upload tối đa 4 ảnh với tên field là 'images'
router.post("/", protect, adminOnly, upload.array('images', 4), productController.createProduct);            
router.put("/:id", protect, adminOnly, upload.array('images', 4), productController.updateProduct);          
router.delete("/:id", protect, adminOnly, productController.deleteProduct);       

module.exports = router;