const User = require("../models/User");
const Attendance = require("../models/Attendance");

// ── Search Students (Faculty only) ───────────────────────────────
exports.searchStudents = async (req, res, next) => {
  try {
    const { search, rollNo, email } = req.query;
    const filter = { role: "student", isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNo: { $regex: search, $options: "i" } },
      ];
    }
    if (rollNo) filter.rollNo = { $regex: `^${rollNo}`, $options: "i" };
    if (email) filter.email = email.toLowerCase();

    const students = await User.find(filter).select("-password -__v").limit(20);
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    next(err);
  }
};

// ── Get Student By ID ─────────────────────────────────────────────
exports.getStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    }).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
};