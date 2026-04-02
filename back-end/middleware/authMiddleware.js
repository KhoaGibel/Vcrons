const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn không có quyền truy cập, vui lòng đăng nhập!" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "VCRONS_SECRET_KEY");
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// Middleware tuỳ chọn: gắn user nếu có token, không bắt buộc
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "VCRONS_SECRET_KEY");
      req.user = decoded;
    } catch (_) {}
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ Admin mới có quyền thực hiện thao tác này!" });
  }
};

const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(403).json({ message: "Yêu cầu quyền Staff hoặc Admin!" });
  }
};

module.exports = { protect, optionalAuth, adminOnly, staffOrAdmin };