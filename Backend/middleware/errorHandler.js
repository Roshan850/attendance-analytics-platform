// Global error-handling middleware
// Express recognizes this by having four arguments.
module.exports = (err, req, res, next) => {
  console.error(err.stack || err);
  const statusCode = err.statusCode || err.status || 500;const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getLectureAttendance,
  getStudentAttendance,
  getAnalytics,
  updateRecord,
  removeRecord,
} = require("../controllers/attendanceController");
const { protect, facultyOnly } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

router.post("/mark", facultyOnly, markAttendance);
router.get("/lecture/:lectureId", getLectureAttendance);
router.get("/student/:studentId", getStudentAttendance);
router.get("/analytics/:lectureId", facultyOnly, getAnalytics);
router.put("/:id", updateRecord);
router.delete("/:id", removeRecord);

module.exports = router;
  const message = err.message || "Server Error";

  // Mongoose validation errors often have an errors object
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: message, errors });
  }

  res.status(statusCode).json({ success: false, message });
};