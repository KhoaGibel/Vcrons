const Product = require("../models/Product");

// 1. LẤY TOÀN BỘ SẢN PHẨM
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm", error });
  }
};

// 2. THÊM SẢN PHẨM MỚI
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// 3. CẬP NHẬT SẢN PHẨM (SỬA)
exports.updateProduct = async (req, res) => {
  try {
    // Tìm sản phẩm theo ID truyền trên thanh địa chỉ và cập nhật dữ liệu mới
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Trả về dữ liệu mới nhất sau khi sửa
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// 4. XOÁ SẢN PHẨM
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xoá sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá sản phẩm", error });
  }
};