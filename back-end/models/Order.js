const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, shipping, delivered, cancelled
  items: { type: Number, required: true },
  payment: { type: String, required: true },
  date: { type: String } // Ngày đặt hàng
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);