const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "staff", "admin"],
    default: "customer",
  },
  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
  },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
}, { timestamps: true });

// Ẩn password khi trả về JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);