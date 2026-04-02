const Product = require("../models/Product");

// 1. LẤY TOÀN BỘ SẢN PHẨM (có filter + pagination)
exports.getProducts = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm", error });
  }
};

// 2. LẤY 1 SẢN PHẨM THEO ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 3. THÊM SẢN PHẨM MỚI
exports.createProduct = async (req, res) => {
  try {
    // req.files chứa các ảnh đã được Multer đẩy lên Cloudinary
    // Ta map qua để lấy danh sách các đường link URL
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new Product({
      ...req.body,
      images: imageUrls.length > 0 ? imageUrls : req.body.images 
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm sản phẩm", error });
  }
};

// 4. CẬP NHẬT SẢN PHẨM
exports.updateProduct = async (req, res) => {
  try {
    // Lấy URL ảnh mới (nếu Admin có chọn ảnh mới)
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    // Nếu có up ảnh mới thì lấy ảnh mới, không thì giữ nguyên ảnh cũ (nằm trong req.body)
    const updateData = { ...req.body };
    if (imageUrls.length > 0) {
        updateData.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error });
  }
};

// 5. XOÁ SẢN PHẨM
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    res.status(200).json({ message: "Đã xoá sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá sản phẩm", error });
  }
};