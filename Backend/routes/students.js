const express = require("express");
const router = express.Router();
const { searchStudents, getStudent } = require("../controllers/studentController");
const { protect, facultyOnly } = require("../middleware/auth");

router.use(protect);
router.get("/", facultyOnly, searchStudents);
router.get("/:id", getStudent);

module.exports = router;