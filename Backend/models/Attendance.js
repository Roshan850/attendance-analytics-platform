const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: [true, "Lecture reference required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty reference required"],
    },
    // Store date as start-of-day for clean querying
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["present", "absent"],
        message: "Status must be present or absent",
      },
      default: "absent", // DEFAULT IS ABSENT
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      maxlength: 300,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound Unique Index ─────────────────────────────────────────
// One attendance record per student per lecture per day
attendanceSchema.index(
  { lecture: 1, student: 1, date: 1 },
  { unique: true, name: "unique_attendance" }
);

attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ lecture: 1, date: 1 });
attendanceSchema.index({ faculty: 1, date: 1 });

// ── Static: Get Stats for a Student in a Lecture ─────────────────
attendanceSchema.statics.getStudentStats = async function (studentId, lectureId) {
  const result = await this.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
        ...(lectureId && { lecture: new mongoose.Types.ObjectId(lectureId) }),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = { present: 0, absent: 0, total: 0 };
  result.forEach((r) => {
    stats[r._id] = r.count;
    stats.total += r.count;
  });
  stats.percentage = stats.total
    ? Math.round((stats.present / stats.total) * 100)
    : 0;
  return stats;
};

module.exports = mongoose.model("Attendance", attendanceSchema);