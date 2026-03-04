import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { lectureAPI, attendanceAPI, studentAPI } from "../../utils/api";
import { todayString, getErrorMsg } from "../../utils/helpers";
import AttendanceTable from "../../components/AttendanceTable";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

export default function MarkAttendance() {
  const { id: lectureId } = useParams();

  const [lecture, setLecture]       = useState(null);
  const [attendance, setAttendance] = useState({});   // { studentId: { status, recordId } }
  const [date, setDate]             = useState(todayString());
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  // ── Add-student state ──────────────────────────────────────────
  const [addInput, setAddInput]           = useState("");
  const [adding, setAdding]               = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]         = useState(false);
  const [showDrop, setShowDrop]           = useState(false);

  // ── Fetch lecture + attendance for selected date ───────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, aRes] = await Promise.all([
        lectureAPI.getOne(lectureId),
        attendanceAPI.getLectureAttendance(lectureId, { date }),
      ]);

      const lec = lRes.data.lecture;
      setLecture(lec);

      // Default everyone to absent
      const attMap = {};
      lec.students.forEach((s) => {
        attMap[s._id] = { status: "absent", recordId: null };
      });
      // Overwrite with saved records
      aRes.data.records.forEach((r) => {
        attMap[r.student._id] = { status: r.status, recordId: r._id };
      });
      setAttendance(attMap);
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  }, [lectureId, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Toggle present / absent for one student ────────────────────
  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId].status === "present" ? "absent" : "present",
      },
    }));
  };

  // ── Bulk mark all ──────────────────────────────────────────────
  const markAll = (status) => {
    const updated = {};
    lecture.students.forEach((s) => {
      updated[s._id] = { ...attendance[s._id], status };
    });
    setAttendance((prev) => ({ ...prev, ...updated }));
    toast.success(`All marked as ${status}`);
  };

  // ── Save attendance ────────────────────────────────────────────
  const handleSave = async () => {
    if (!lecture?.students?.length) {
      toast.error("No students to save");
      return;
    }
    setSaving(true);
    try {
      const records = lecture.students.map((s) => ({
        studentId: s._id,
        status: attendance[s._id]?.status || "absent",
      }));
      const res = await attendanceAPI.mark({ lectureId, date, records });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setSaving(false);
    }
  };

  // ── Live search as faculty types ───────────────────────────────
  const handleSearchInput = async (value) => {
    setAddInput(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDrop(false);
      return;
    }

    setSearching(true);
    try {
      const res = await studentAPI.search({ search: value.trim() });
      setSearchResults(res.data.students || []);
      setShowDrop(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ── Add student by clicking a search result ────────────────────
  const handleSelectStudent = async (student) => {
    setShowDrop(false);
    setAddInput(student.name);
    await doAddStudent({ studentId: student._id });
  };

  // ── Add student by typing roll / email and pressing button ─────
  const handleAddByInput = async () => {
    const val = addInput.trim();
    if (!val) {
      toast.error("Enter a roll number, email, or name to search");
      return;
    }

    // If a search result is showing, use it
    if (searchResults.length === 1) {
      await doAddStudent({ studentId: searchResults[0]._id });
      return;
    }

    // Otherwise send raw value — backend will try rollNo then email
    if (val.includes("@")) {
      await doAddStudent({ email: val });
    } else {
      await doAddStudent({ rollNo: val });
    }
  };

  // ── Shared add logic ───────────────────────────────────────────
  const doAddStudent = async (payload) => {
    setAdding(true);
    try {
      const res = await lectureAPI.addStudent(lectureId, payload);
      toast.success(res.data.message);
      setAddInput("");
      setSearchResults([]);
      setShowDrop(false);
      fetchData();          // refresh lecture + attendance
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setAdding(false);
    }
  };

  // ── Remove student from lecture ────────────────────────────────
  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Remove ${studentName} from this lecture?`)) return;
    try {
      await lectureAPI.removeStudent(lectureId, studentId);
      toast.success(`${studentName} removed`);
      fetchData();
    } catch (err) {
      toast.error(getErrorMsg(err));
    }
  };

  // ─────────────────────────────────────────────────────────────
  if (loading) return <Loader text="Loading attendance..." />;

  const total    = lecture?.students?.length || 0;
  const present  = Object.values(attendance).filter((a) => a.status === "present").length;
  const pct      = total ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <div className="mb-1">
            <Link to="/faculty/lectures" className="text-muted small">← Back to Lectures</Link>
          </div>
          <h4>📋 Mark Attendance</h4>
          <p>
            {lecture?.name} · {lecture?.subject}
            {lecture?.subjectCode ? ` (${lecture.subjectCode})` : ""}
          </p>
        </div>

        {/* Date picker */}
        <input
          type="date"
          className="form-control"
          style={{ width: "auto" }}
          value={date}
          max={todayString()}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* ── Stats ── */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total",      value: total,             icon: "👥", color: "var(--primary)" },
          { title: "Present",    value: present,           icon: "✅", color: "var(--success)" },
          { title: "Absent",     value: total - present,   icon: "❌", color: "var(--danger)"  },
          { title: "Percentage", value: `${pct}%`,         icon: "📊", color: pct >= 75 ? "var(--success)" : "var(--warning)" },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* ── Add Student ── */}
      <div className="card-clean mb-4">
        <div className="card-clean-header">
          <h6>➕ Add Student to Lecture</h6>
        </div>
        <div className="card-clean-body">

          {/* Search row */}
          <div className="position-relative" style={{ maxWidth: 520 }}>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, roll number, or email..."
                value={addInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddByInput()}
                disabled={adding}
                autoComplete="off"
              />
              {searching && (
                <span
                  className="spinner-border spinner-border-sm text-muted"
                  style={{ alignSelf: "center", flexShrink: 0 }}
                />
              )}
              <button
                className="btn fw-bold px-3"
                style={{ background: "#4f46e5", color: "white", borderRadius: 8, whiteSpace: "nowrap" }}
                onClick={handleAddByInput}
                disabled={adding || !addInput.trim()}
              >
                {adding
                  ? <><span className="spinner-border spinner-border-sm me-1" />Adding...</>
                  : "+ Add"}
              </button>
            </div>

            <p className="text-muted small mt-1 mb-0">
              Student must have a registered account on AttendEase · Default attendance = <strong>Absent</strong>
            </p>

            {/* Search dropdown */}
            {showDrop && searchResults.length > 0 && (
              <div
                className="position-absolute w-100 bg-white border rounded-3 shadow-sm"
                style={{ zIndex: 50, top: "calc(100% - 4px)", maxHeight: 240, overflowY: "auto" }}
              >
                {searchResults.map((s) => (
                  <div
                    key={s._id}
                    className="d-flex justify-content-between align-items-center px-3 py-2"
                    style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
                    onMouseDown={() => handleSelectStudent(s)}   // mouseDown fires before input blur
                  >
                    <div>
                      <div className="fw-semibold" style={{ fontSize: "0.88rem" }}>{s.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {s.rollNo ? `Roll: ${s.rollNo}` : ""} {s.email}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm fw-bold"
                      style={{ background: "#10b981", color: "white", borderRadius: 6, fontSize: "0.78rem" }}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {showDrop && searchResults.length === 0 && !searching && addInput.length >= 2 && (
              <div
                className="position-absolute w-100 bg-white border rounded-3 shadow-sm px-3 py-2"
                style={{ zIndex: 50, top: "calc(100% - 4px)", fontSize: "0.85rem", color: "#64748b" }}
              >
                No students found. Try their roll number or email.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Attendance Table ── */}
      <div className="card-clean">
        <div className="card-clean-header">
          <h6>📋 Student Attendance List</h6>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm btn-present" onClick={() => markAll("present")}>
              ✓ All Present
            </button>
            <button className="btn btn-sm btn-absent" onClick={() => markAll("absent")}>
              ✗ All Absent
            </button>
          </div>
        </div>

        <div className="card-clean-body">
          <AttendanceTable
            students={lecture?.students || []}
            attendance={attendance}
            onToggle={handleToggle}
            onRemove={handleRemoveStudent}
            date={date}
          />
        </div>

        {total > 0 && (
          <div
            className="card-clean-header border-top justify-content-end"
            style={{ borderTop: "1px solid #e2e8f0" }}
          >
            <button
              className="btn fw-bold px-5"
              disabled={saving}
              onClick={handleSave}
              style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}
            >
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                : "💾 Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}