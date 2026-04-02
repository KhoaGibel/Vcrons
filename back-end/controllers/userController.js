const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ─── ADMIN ───────────────────────────────────────────────

// 1. ADMIN: LẤY TẤT CẢ NGƯỜI DÙNG
exports.getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 2. ADMIN: CẬP NHẬT ROLE / STATUS người dùng
exports.updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    // Không cho tự sửa tài khoản admin gốc (id = req.user.id khi là chính mình)
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Không thể tự sửa tài khoản của chính mình qua API này!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 3. ADMIN: XOÁ NGƯỜI DÙNG
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Không thể xoá chính mình!" });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.status(200).json({ message: "Đã xoá người dùng!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// ─── USER (chính chủ) ────────────────────────────────────

// 4. USER: XEM THÔNG TIN CÁ NHÂN
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 5. USER: CẬP NHẬT THÔNG TIN CÁ NHÂN (tên, phone, avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 6. USER: ĐỔI MẬT KHẨU
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới tối thiểu 6 ký tự!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};