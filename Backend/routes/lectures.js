const express = require("express");
const router = express.Router();
const {
  getLectures, createLecture, getLecture, updateLecture,
  deleteLecture, addStudent, removeStudent,
} = require("../controllers/lectureController");
const { protect, facultyOnly } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

router.route("/")
  .get(getLectures)
  .post(facultyOnly, createLecture);

router.route("/:id")
  .get(getLecture)
  .put(facultyOnly, updateLecture)
  .delete(facultyOnly, deleteLecture);

router.post("/:id/students", facultyOnly, addStudent);
router.delete("/:id/students/:studentId", facultyOnly, removeStudent);

module.exports = router;