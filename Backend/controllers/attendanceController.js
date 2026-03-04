const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Lecture = require("../models/Lecture");

// ── Helper: normalize date to start-of-day UTC ────────────────────
const normalizeDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// ── POST /api/attendance/mark ─────────────────────────────────────
// Body: { lectureId, date, records: [{studentId, status}] }
exports.markAttendance = async (req, res, next) => {
  try {
    const { lectureId, date, records } = req.body;

    if (!lectureId || !date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "lectureId, date, and records[] are required",
      });
    }

    const lecture = await Lecture.findOne({ _id: lectureId, faculty: req.user._id });
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    const targetDate = normalizeDate(date);

    const ops = records.map(({ studentId, status }) =>
      Attendance.findOneAndUpdate(
        { lecture: lectureId, student: studentId, date: targetDate },
        { faculty: req.user._id, status: status || "absent", markedAt: new Date() },
        { upsert: true, new: true }
      )
    );

    const results = await Promise.all(ops);
    res.json({
      success: true,
      message: `Attendance saved for ${results.length} student(s)`,
      count: results.length,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/attendance/:id ───────────────────────────────────────
exports.updateRecord = async (req, res, next) => {
  try {
    const record = await Attendance.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      { status: req.body.status, markedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("student", "name rollNo email");

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, message: "Attendance updated", record });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/attendance/lecture/:lectureId ────────────────────────
exports.getLectureAttendance = async (req, res, next) => {
  try {
    const { date, month, year } = req.query;
    const { lectureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ success: false, message: "Invalid lecture ID" });
    }

    const filter = { lecture: lectureId };

    if (date) {
      const d = normalizeDate(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    } else if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    } else if (year) {
      filter.date = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const records = await Attendance.find(filter)
      .populate("student", "name email rollNo")
      .sort({ date: -1 });

    res.json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/attendance/student/:studentId ────────────────────────
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { lectureId, month, year, page = 1, limit = 50 } = req.query;
    const filter = { student: studentId };

    if (lectureId) filter.lecture = lectureId;

    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    } else if (year) {
      filter.date = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .populate("lecture", "name subject subjectCode")
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Attendance.countDocuments(filter),
    ]);

    // Per-lecture stats
    const allRecords = await Attendance.find({
      student: studentId,
      ...(lectureId && { lecture: lectureId }),
    }).populate("lecture", "name subject");

    const statsMap = {};
    allRecords.forEach((r) => {
      const lid = r.lecture?._id?.toString();
      if (!lid) return;
      if (!statsMap[lid]) {
        statsMap[lid] = {
          lectureId: lid,
          lectureName: r.lecture?.name,
          subject: r.lecture?.subject,
          total: 0,
          present: 0,
          absent: 0,
        };
      }
      statsMap[lid].total++;
      statsMap[lid][r.status]++;
    });

    const lectureStats = Object.values(statsMap).map((s) => ({
      ...s,
      percentage: s.total ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({
      success: true,
      count: records.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      records,
      lectureStats,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/attendance/analytics/lecture/:lectureId ──────────────
exports.getLectureAnalytics = async (req, res, next) => {
  try {
    const { lectureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ success: false, message: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findOne({ _id: lectureId, faculty: req.user._id });
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    const records = await Attendance.find({ lecture: lectureId }).populate(
      "student",
      "name rollNo email"
    );

    // Per-student stats
    const studentMap = {};
    records.forEach((r) => {
      const sid = r.student?._id?.toString();
      if (!sid) return;
      if (!studentMap[sid]) {
        studentMap[sid] = { student: r.student, total: 0, present: 0, absent: 0 };
      }
      studentMap[sid].total++;
      studentMap[sid][r.status]++;
    });

    const studentStats = Object.values(studentMap)
      .map((s) => ({
        ...s,
        percentage: s.total ? Math.round((s.present / s.total) * 100) : 0,
      }))
      .sort((a, b) => a.percentage - b.percentage);

    // Daily trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentRecords = records.filter((r) => new Date(r.date) >= thirtyDaysAgo);
    const dailyMap = {};
    recentRecords.forEach((r) => {
      const day = r.date.toISOString().split("T")[0];
      if (!dailyMap[day]) dailyMap[day] = { date: day, present: 0, absent: 0, total: 0 };
      dailyMap[day][r.status]++;
      dailyMap[day].total++;
    });

    const dailyTrend = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        ...d,
        percentage: d.total ? Math.round((d.present / d.total) * 100) : 0,
      }));

    // Monthly summary
    const monthlyMap = {};
    records.forEach((r) => {
      const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, present: 0, absent: 0, total: 0 };
      monthlyMap[key][r.status]++;
      monthlyMap[key].total++;
    });
    const monthlyStats = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const overallPresent = records.filter((r) => r.status === "present").length;
    const overallTotal = records.length;

    res.json({
      success: true,
      lecture: {
        name: lecture.name,
        subject: lecture.subject,
        studentCount: lecture.students.length,
      },
      overall: {
        total: overallTotal,
        present: overallPresent,
        absent: overallTotal - overallPresent,
        percentage: overallTotal
          ? Math.round((overallPresent / overallTotal) * 100)
          : 0,
      },
      studentStats,
      dailyTrend,
      monthlyStats,
    });
  } catch (err) {
    next(err);
  }
};