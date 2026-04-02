const Order = require("../models/Order");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Lấy đơn hàng mới nhất lên đầu
    res.status(200).json(orders);
  } catch (error) { res.status(500).json({ error }); }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedOrder);
  } catch (error) { res.status(500).json({ error }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xoá đơn hàng!" });
  } catch (error) { res.status(500).json({ error }); }
};