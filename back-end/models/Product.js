const mongoose = require("mongoose");

// Schema cho từng màu sắc kèm theo mảng ảnh
const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },       // "Trắng Tinh"
  hex: { type: String, required: true },        // "#f5f5f5"
  images: [{ type: String }],                  // Mảng URL ảnh của màu đó
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm là bắt buộc"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Danh mục là bắt buộc"],
    enum: ["Classic", "Baya", "Crush"],
  },
  price: {
    type: Number,
    required: [true, "Giá sản phẩm là bắt buộc"],
    min: [0, "Giá không được âm"],
  },
  originalPrice: {
    type: Number,
    default: null, // null = không khuyến mãi
  },
  description: {
    type: String,
    default: "",
  },
  colors: [colorSchema],    // Mảng màu + ảnh theo từng màu
  sizes: [{ type: Number }], // [36, 37, 38, 39, 40, 41, 42, 43]
  features: [{ type: String }], // Các tính năng nổi bật
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Virtual: isSale — tự tính từ price và originalPrice
productSchema.virtual("isSale").get(function () {
  return this.originalPrice !== null && this.originalPrice > this.price;
});

// Trả về virtual khi dùng .toJSON() hoặc .toObject()
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);