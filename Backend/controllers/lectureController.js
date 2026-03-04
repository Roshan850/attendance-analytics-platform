const Lecture = require("../models/Lecture");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// ── Get All Lectures ──────────────────────────────────────────────
exports.getLectures = async (req, res, next) => {
  try {
    let lectures;
    if (req.user.role === "faculty") {
      lectures = await Lecture.find({ faculty: req.user._id, isActive: true })
        .populate("students", "name email rollNo")
        .sort({ createdAt: -1 });
    } else {
      lectures = await Lecture.find({ students: req.user._id, isActive: true })
        .populate("faculty", "name email department")
        .sort({ createdAt: -1 });
    }
    res.json({ success: true, count: lectures.length, lectures });
  } catch (err) {
    next(err);
  }
};

// ── Create Lecture ────────────────────────────────────────────────
exports.createLecture = async (req, res, next) => {
  try {
    const { name, subject, subjectCode, schedule, semester, academicYear, room } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ success: false, message: "Name and subject are required" });
    }

    const lecture = await Lecture.create({
      name,
      subject,
      subjectCode,
      schedule,
      semester,
      academicYear,
      room,
      faculty: req.user._id,
    });

    res.status(201).json({ success: true, message: "Lecture created", lecture });
  } catch (err) {
    next(err);
  }
};

// ── Get Single Lecture ────────────────────────────────────────────
exports.getLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate("faculty", "name email department")
      .populate("students", "name email rollNo");

    if (!lecture || !lecture.isActive) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    if (
      req.user.role === "student" &&
      !lecture.students.some((s) => s._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: "Not enrolled in this lecture" });
    }

    res.json({ success: true, lecture });
  } catch (err) {
    next(err);
  }
};

// ── Update Lecture ────────────────────────────────────────────────
exports.updateLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate("students", "name email rollNo");

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }
    res.json({ success: true, message: "Lecture updated", lecture });
  } catch (err) {
    next(err);
  }
};

// ── Delete Lecture ────────────────────────────────────────────────
exports.deleteLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }
    res.json({ success: true, message: "Lecture removed" });
  } catch (err) {
    next(err);
  }
};

// ── Add Student to Lecture ────────────────────────────────────────
// Accepts: studentId (ObjectId) OR rollNo OR email
exports.addStudent = async (req, res, next) => {
  try {
    const { studentId, rollNo, email } = req.body;

    // Must provide at least one identifier
    if (!studentId && !rollNo && !email) {
      return res.status(400).json({
        success: false,
        message: "Provide studentId, rollNo, or email to find the student",
      });
    }

    // Find the student by any identifier
    let student = null;

    if (studentId) {
      student = await User.findOne({ _id: studentId, role: "student", isActive: true });
    }

    if (!student && rollNo) {
      student = await User.findOne({
        rollNo: rollNo.trim(),
        role: "student",
        isActive: true,
      });
    }

    if (!student && email) {
      student = await User.findOne({
        email: email.toLowerCase().trim(),
        role: "student",
        isActive: true,
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found. Make sure the student has registered an account on AttendEase with this Roll No / Email.",
      });
    }

    // Check faculty owns this lecture
    const lecture = await Lecture.findOne({
      _id: req.params.id,
      faculty: req.user._id,
      isActive: true,
    });

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    // Check already added
    if (lecture.students.some((id) => id.toString() === student._id.toString())) {
      return res.status(409).json({
        success: false,
        message: `${student.name} is already enrolled in this lecture`,
      });
    }

    // Add student
    lecture.students.push(student._id);
    await lecture.save();

    // Auto-create ABSENT record for today (default = absent)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Attendance.findOneAndUpdate(
      { lecture: lecture._id, student: student._id, date: today },
      {
        faculty: req.user._id,
        status: "absent",
        markedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Return updated lecture with populated students
    const updatedLecture = await Lecture.findById(lecture._id).populate(
      "students",
      "name email rollNo"
    );

    res.json({
      success: true,
      message: `${student.name} added successfully! Default attendance set to Absent.`,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
      },
      lecture: updatedLecture,
    });
  } catch (err) {
    next(err);
  }
};

// ── Remove Student from Lecture ───────────────────────────────────
exports.removeStudent = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      { $pull: { students: req.params.studentId } },
      { new: true }
    ).populate("students", "name email rollNo");

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }
    res.json({ success: true, message: "Student removed from lecture", lecture });
  } catch (err) {
    next(err);
  }
};