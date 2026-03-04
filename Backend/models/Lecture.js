const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lecture name is required"],
      trim: true,
      maxlength: [150, "Name max 150 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    subjectCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty reference is required"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    schedule: {
      days: [
        {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
      ],
      startTime: { type: String },
      endTime: { type: String },
    },
    semester: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────
lectureSchema.index({ faculty: 1, isActive: 1 });
lectureSchema.index({ students: 1 });

// ── Virtual: Student Count ────────────────────────────────────────
lectureSchema.virtual("studentCount").get(function () {
  return this.students?.length || 0;
});

module.exports = mongoose.model("Lecture", lectureSchema);