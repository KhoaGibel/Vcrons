const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "VCRONS_SECRET_KEY";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// 1. ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự!" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ message: "Email đã tồn tại!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công! Vui lòng đăng nhập." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký", error });
  }
};

// 2. ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    // Lấy cả password (đã ẩn qua toJSON)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại!" });

    if (user.status === "banned") {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khoá. Vui lòng liên hệ hỗ trợ." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập", error });
  }
};