const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinaryConfig"); // Đảm bảo đường dẫn này đúng với file config của Khoa

// 1. LẤY TOÀN BỘ SẢN PHẨM (Đã sửa để trả về Mảng, khớp 100% với AdminDashboard)
exports.getProducts = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    // Lấy danh sách và sắp xếp mới nhất lên đầu
    const products = await Product.find(filter).sort({ createdAt: -1 });

    // TRẢ VỀ DẠNG MẢNG ĐỂ FRONT-END KHÔNG BỊ LỖI TRẮNG TRANG
    res.status(200).json(products);
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

// 3. THÊM SẢN PHẨM MỚI (Tích hợp Multer & Cloudinary)
exports.createProduct = async (req, res) => {
  try {
    // Lấy link ảnh mới từ Cloudinary (do Multer đẩy lên)
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];

    // Nếu Admin điền link ảnh thủ công hoặc có ảnh cũ truyền lên
    let existingImages = [];
    if (req.body.images) {
      existingImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const newProduct = new Product({
      ...req.body,
      // Gộp ảnh cũ và ảnh mới lại với nhau
      images: [...existingImages, ...newImageUrls].filter(img => img) 
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm sản phẩm", error });
  }
};

// 4. CẬP NHẬT SẢN PHẨM
exports.updateProduct = async (req, res) => {
  try {
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];
    
    let existingImages = [];
    if (req.body.images) {
      existingImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updateData = { 
      ...req.body,
      images: [...existingImages, ...newImageUrls].filter(img => img)
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error });
  }
};

// 5. XOÁ SẢN PHẨM (Kèm xoá sạch ảnh trên mây Cloudinary)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Xoá file ảnh trên Cloudinary để đỡ tốn dung lượng
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        if (imgUrl.includes('res.cloudinary.com')) {
          try {
            const parts = imgUrl.split("/");
            const filename = parts[parts.length - 1].split(".")[0];
            const folderName = parts[parts.length - 2]; 
            const publicId = `${folderName}/${filename}`; // VD: vcrons_products/abcxyz
            
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Lỗi khi xoá ảnh Cloudinary:", err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xoá sản phẩm và ảnh thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá sản phẩm", error });
  }
};