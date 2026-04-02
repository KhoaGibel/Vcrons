const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load biến môi trường từ file .env
require("dotenv").config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Route kiểm tra server sống
app.get("/", (req, res) => {
  res.json({ message: "Vcrons Vshop API đang chạy! 🚀" });
});

// ─── XỬ LÝ LỖI 404 ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} không tồn tại!` });
});

// ─── KẾT NỐI MONGODB ──────────────────────────────────────
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vcrons_vshop";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });