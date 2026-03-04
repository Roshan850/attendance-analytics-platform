const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Protect middleware: verify JWT and attach user ─────────────────
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

// ── Role-based helpers ─────────────────────────────────────────────
exports.facultyOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Access restricted to faculty members",
    });
  }
  next();
};

exports.studentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access restricted to students",
    });
  }
  next();
};