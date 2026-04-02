const mongoose = require("mongoose");

// Chi tiết từng sản phẩm trong đơn hàng
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },     // Lưu lại tên tại thời điểm đặt
  price: { type: Number, required: true },    // Lưu lại giá tại thời điểm đặt
  color: { type: String, required: true },    // Màu đã chọn
  size: { type: Number, required: true },     // Size đã chọn
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },       // Ảnh đại diện sản phẩm
}, { _id: false });

// Địa chỉ giao hàng
const shippingAddressSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  note: { type: String, default: "" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // Liên kết tới User (có thể null nếu đặt hàng không đăng nhập — guest checkout)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // Email để liên hệ (dùng cho cả guest và user đã đăng nhập)
  email: {
    type: String,
    required: true,
  },
  // Danh sách sản phẩm trong đơn
  orderItems: [orderItemSchema],

  // Địa chỉ giao hàng
  shippingAddress: shippingAddressSchema,

  // Tài chính
  subtotal: { type: Number, required: true },         // Tổng tiền hàng
  shippingFee: { type: Number, default: 30000 },      // Phí vận chuyển
  discount: { type: Number, default: 0 },             // Giảm giá (từ coupon)
  total: { type: Number, required: true },            // Tổng cộng cuối

  // Thanh toán
  payment: {
    type: String,
    enum: ["cod", "vnpay", "momo"],
    required: true,
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
    default: "pending",
  },
  cancelReason: { type: String, default: "" },

  // Mã đơn hàng dạng đọc được (ORD-XXXXXX)
  orderCode: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

// Tự tạo orderCode trước khi lưu
orderSchema.pre("save", async function (next) {
  if (!this.orderCode) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderCode = `ORD-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);