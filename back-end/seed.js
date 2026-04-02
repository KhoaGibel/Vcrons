const mongoose = require("mongoose");
const Product = require("./models/Product"); // Đảm bảo đường dẫn này trỏ đúng tới file Model của bạn

// 1. ĐIỀN LINK MONGODB CỦA BẠN VÀO ĐÂY
const MONGO_URI ='mongodb+srv://khoapham7788_db_user:123@crocs.dlxmawa.mongodb.net/'

// 2. CHUẨN BỊ MỘT CỤC DỮ LIỆU SIÊU CHI TIẾT
const productsData = [
  {
    name: "Crocs Classic Clog",
    category: "Classic",
    price: 995000,
    originalPrice: 1200000,
    description: "Đôi giày huyền thoại tạo nên cuộc cách mạng về sự thoải mái trên toàn thế giới. Siêu nhẹ, siêu êm và luôn sẵn sàng cùng bạn đi muôn nơi.",
    colors: [
      { name: "Trắng", hex: "#ffffff", images: ["https://m.media-amazon.com/images/I/61y4nO0L+mL._AC_UY695_.jpg"] },
      { name: "Đen", hex: "#1a1a1a", images: ["https://m.media-amazon.com/images/I/61NlP-KjKKL._AC_UY695_.jpg"] }
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    features: ["Siêu nhẹ chỉ 150g", "Vật liệu Croslite đúc nguyên khối", "Thoáng khí tối đa", "Dễ dàng rửa sạch bằng nước"],
    stock: 50,
    status: "active",
    isNewProduct: true,
    rating: 4.8,
    reviewCount: 342
  },
  {
    name: "Crocs Crush Platform",
    category: "Crush",
    price: 1550000,
    originalPrice: null,
    description: "Nâng tầm phong cách với đế xuồng táo bạo cao 5.2cm. Vừa hack dáng cực đỉnh, vừa giữ nguyên sự thoải mái mang tính biểu tượng của Crocs.",
    colors: [
      { name: "Hồng Bone", hex: "#e8dcc7", images: ["https://m.media-amazon.com/images/I/51r2X73K9EL._AC_UY695_.jpg"] },
    ],
    sizes: [36, 37, 38, 39, 40],
    features: ["Đế cao 5.2cm hack dáng", "Thiết kế năng động", "Hỗ trợ gót chân cực tốt"],
    stock: 30,
    status: "active",
    isNewProduct: true,
    rating: 5.0,
    reviewCount: 128
  },
  {
    name: "Crocs Baya Lined Clog",
    category: "Baya",
    price: 1350000,
    originalPrice: 1600000,
    description: "Trải nghiệm sự ấm áp trong những ngày se lạnh với lớp lót lông cừu tổng hợp siêu mềm mịn bên trong.",
    colors: [
      { name: "Xanh Navy", hex: "#172134", images: ["https://m.media-amazon.com/images/I/71uA+-f0xFL._AC_UY695_.jpg"] }
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    features: ["Lót lông ấm áp", "Logo Baya dập nổi", "Dây quai gót gập linh hoạt"],
    stock: 25,
    status: "active",
    isNewProduct: false,
    rating: 4.5,
    reviewCount: 89
  }
];

// 3. HÀM CHẠY SEED DATA
const importData = async () => {
  try {
    console.log("⏳ Đang kết nối tới MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối thành công!");

    // (Tuỳ chọn) Cẩn thận: Dòng này sẽ XOÁ SẠCH sản phẩm cũ trong Database để nạp mới
    // Nếu muốn giữ sản phẩm cũ thì xoá dòng này đi:
    // await Product.deleteMany(); 
    // console.log("🗑️ Đã xoá dọn sạch dữ liệu cũ.");

    // Đẩy nguyên cục JSON vào DB
    console.log("📦 Đang đẩy dữ liệu mới vào...");
    await Product.insertMany(productsData);
    
    console.log("🚀 XONG! Đã nạp thành công toàn bộ sản phẩm.");
    process.exit(); // Tự động tắt script khi xong
  } catch (error) {
    console.error("❌ Lỗi cmnr:", error);
    process.exit(1);
  }
};

importData();