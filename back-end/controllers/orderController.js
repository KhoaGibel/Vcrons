const Order = require("../models/Order");
const Product = require("../models/Product");

// ─── ADMIN ───────────────────────────────────────────────

// 1. ADMIN: LẤY TẤT CẢ ĐƠN HÀNG (có filter + pagination)
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email"); // Kéo thêm tên + email user

    res.status(200).json({
      orders,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 2. ADMIN: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
exports.updateOrder = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const allowedStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    const updateData = { status };
    if (status === "delivered") updateData.isPaid = true;
    if (status === "cancelled" && cancelReason) updateData.cancelReason = cancelReason;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 3. ADMIN: XOÁ ĐƠN HÀNG
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    res.status(200).json({ message: "Đã xoá đơn hàng!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// ─── USER ─────────────────────────────────────────────────

// 4. USER: TẠO ĐƠN HÀNG MỚI
exports.createOrder = async (req, res) => {
  try {
    const {
      email,
      orderItems,      // [{ product: id, color, size, quantity }]
      shippingAddress, // { fullname, phone, address, ward, district, province, note }
      payment,         // "cod" | "vnpay" | "momo"
      couponCode,      // Tùy chọn
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Đơn hàng không có sản phẩm!" });
    }

    // Lấy thông tin sản phẩm từ DB để tính giá chính xác (không tin giá từ client)
    const enrichedItems = [];
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Sản phẩm ${item.product} không tồn tại!` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm "${product.name}" không đủ hàng!` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      enrichedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: product.colors?.[0]?.images?.[0] || "",
      });

      // Trừ tồn kho
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // TODO: Kiểm tra couponCode nếu có → tính discount
    const discount = 0;
    const shippingFee = 30000;
    const total = subtotal + shippingFee - discount;

    const newOrder = new Order({
      user: req.user ? req.user.id : null,
      email,
      orderItems: enrichedItems,
      shippingAddress,
      subtotal,
      shippingFee,
      discount,
      total,
      payment,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Đặt hàng thành công!",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
  }
};

// 5. USER: LẤY ĐƠN HÀNG CỦA MÌNH (cần đăng nhập)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 6. LẤY CHI TIẾT 1 ĐƠN HÀNG THEO ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    // Chỉ cho phép admin hoặc chính chủ đơn hàng xem
    const isOwner = order.user && order.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này!" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 7. USER: HUỶ ĐƠN HÀNG (chỉ khi đang pending)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    const isOwner = order.user && order.user.toString() === req.user.id;
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