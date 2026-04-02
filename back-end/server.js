const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Kích hoạt đọc file .env

const app = express();

// 1. Cấu hình Middleware
app.use(cors()); // Cho phép Front-End gọi API
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ Front-End gửi lên
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 2. Kết nối tới MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Đã kết nối thành công với MongoDB Vcrons_DB!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 3. Tạo một API test thử
app.get("/", (req, res) => {
  res.send("Chào mừng đến với hệ thống API của Vcrons Vshop!");
});

// 4. Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ngon lành tại http://localhost:${PORT}`);
});