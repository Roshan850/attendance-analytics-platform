const express = require("express");
const router = express.Router();

// ── Import EXACT function names from controller ────────────────────
// These names MUST match what is exported in attendanceController.js
const {
  markAttendance,       // exports.markAttendance
  updateRecord,         // exports.updateRecord
  getLectureAttendance, // exports.getLectureAttendance
  getStudentAttendance, // exports.getStudentAttendance
  getLectureAnalytics,  // exports.getLectureAnalytics
} = require("../controllers/attendanceController");

const { protect, facultyOnly } = require("../middleware/auth");

// All routes require login
router.use(protect);

// ─────────────────────────────────────────────────────────────────
// ROUTE ORDER MATTERS IN EXPRESS!
// More specific routes must come BEFORE wildcard routes like /:id
// ─────────────────────────────────────────────────────────────────

// POST  /api/attendance/mark
router.post("/mark", facultyOnly, markAttendance);

// GET   /api/attendance/analytics/lecture/:lectureId  ← specific, comes FIRST
router.get("/analytics/lecture/:lectureId", facultyOnly, getLectureAnalytics);

// GET   /api/attendance/lecture/:lectureId?date=2026-03-04
router.get("/lecture/:lectureId", getLectureAttendance);

// GET   /api/attendance/student/:studentId
router.get("/student/:studentId", getStudentAttendance);

// PUT   /api/attendance/:id  ← wildcard, comes LAST
router.put("/:id", facultyOnly, updateRecord);

module.exports = router;