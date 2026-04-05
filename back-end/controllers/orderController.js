const Order = require("../models/Order");
const Product = require("../models/Product");

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// 1. ADMIN: Lấy tất cả đơn hàng
// FIX: Trả về array phẳng thay vì { orders, pagination }
// để AdminDashboard dùng Array.isArray(data) hoạt động đúng
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(orders); // ← trả thẳng array, không wrap object
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 2. ADMIN: Cập nhật trạng thái đơn hàng
exports.updateOrder = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const allowed = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (status === "delivered") updateData.isPaid = true;
    if (status === "cancelled" && cancelReason) updateData.cancelReason = cancelReason;

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 3. ADMIN: Xoá đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    res.status(200).json({ message: "Đã xoá đơn hàng!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// ─── USER ─────────────────────────────────────────────────────────────────────

// 4. USER: Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { email, orderItems, shippingAddress, payment, subtotal, shippingFee, total } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Đơn hàng không có sản phẩm!" });
    }

    // Xác minh giá từ DB (chặn client gửi giá giả)
    const enrichedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product).catch(() => null);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm: ${item.name || item.product}` });
      }
      enrichedItems.push({
        product: product._id,
        name: item.name || product.name,
        price: product.price,          // lấy giá từ DB, không tin client
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: item.image || product.colors?.[0]?.images?.[0] || "",
      });

      // Trừ tồn kho
      if (product.stock >= item.quantity) {
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
      }
    }

    const calcSubtotal = enrichedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const calcShipping = shippingFee || 25000;
    const calcTotal = calcSubtotal + calcShipping;

    const newOrder = new Order({
      user: req.user ? req.user.id : null,
      email,
      orderItems: enrichedItems,
      shippingAddress,
      subtotal: calcSubtotal,
      shippingFee: calcShipping,
      discount: 0,
      total: calcTotal,
      payment,
    });

    const saved = await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công!", order: saved });
  } catch (error) {
    console.error("Lỗi createOrder:", error);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};

// 5. USER: Lấy đơn hàng của mình
// FIX: Tìm theo cả user._id LẪN email để đơn guest cũng hiện ra
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user.id },
        { email: req.user.email },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 6. Xem chi tiết 1 đơn hàng (user xem của mình, admin xem tất cả)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    const isOwner = (order.user && order.user._id.toString() === req.user.id)
      || order.email === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này!" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 7. USER: Huỷ đơn hàng (chỉ khi pending)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    const isOwner = (order.user && order.user.toString() === req.user.id)
      || order.email === req.user.email;
    if (!isOwner) return res.status(403).json({ message: "Không có quyền huỷ đơn này!" });

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Chỉ có thể huỷ đơn hàng đang chờ xử lý!" });
    }

    // Hoàn lại tồn kho
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = "cancelled";
    order.cancelReason = req.body.cancelReason || "Khách hàng huỷ";
    await order.save();

    res.status(200).json({ message: "Đã huỷ đơn hàng!", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};