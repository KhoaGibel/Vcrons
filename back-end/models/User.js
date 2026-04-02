const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // THÊM DÒNG NÀY
  role: { type: String, default: "customer" }, 
  status: { type: String, default: "active" },
  joined: { type: Date, default: Date.now } // Sửa lại thành Date cho chuẩn
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);