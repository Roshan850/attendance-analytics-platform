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
  const [lecture, setLecture] = useState(null);
  const [attendance, setAttendance] = useState({}); // { studentId: { status, recordId } }
  const [date, setDate] = useState(todayString());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // ── Fetch lecture + attendance for date ─────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, aRes] = await Promise.all([
        lectureAPI.getOne(lectureId),
        attendanceAPI.getLectureAttendance(lectureId, { date }),
      ]);

      const lec = lRes.data.lecture;
      setLecture(lec);

      // Build attendance map — default everyone to absent
      const attMap = {};
      lec.students.forEach((s) => { attMap[s._id] = { status: "absent", recordId: null }; });
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

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Toggle present/absent ───────────────────────────────────────
  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId].status === "present" ? "absent" : "present",
      },
    }));
  };

  // ── Mark All ────────────────────────────────────────────────────
  const markAll = (status) => {
    const updated = {};
    lecture.students.forEach((s) => { updated[s._id] = { ...attendance[s._id], status }; });
    setAttendance((prev) => ({ ...prev, ...updated }));
    toast.success(`All marked as ${status}`);
  };

  // ── Save Attendance ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!lecture?.students?.length) return toast.error("No students to save");
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

  // ── Search Students ─────────────────────────────────────────────
  const handleSearch = async (query) => {
    setAddInput(query);
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await studentAPI.search({ search: query });
      setSearchResults(res.data.students);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  // ── Add Student ─────────────────────────────────────────────────
  const handleAddStudent = async (studentId, studentName) => {
    setAdding(true);
    try {
      await lectureAPI.addStudent(lectureId, { studentId });
      toast.success(`${studentName} added!`);
      setAddInput("");
      setSearchResults([]);
      fetchData();
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setAdding(false);
    }
  };

  // ── Remove Student ──────────────────────────────────────────────
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

  if (loading) return <Loader text="Loading lecture..." />;

  const total = lecture?.students?.length || 0;
  const present = Object.values(attendance).filter((a) => a.status === "present").length;
  const pct = total ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <div className="mb-1"><Link to="/faculty/lectures" className="text-muted small">← Back to Lectures</Link></div>
          <h4>📋 Mark Attendance</h4>
          <p>{lecture?.name} · {lecture?.subject}{lecture?.subjectCode ? ` (${lecture.subjectCode})` : ""}</p>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <input type="date" className="form-control" style={{ width: "auto" }}
            value={date} onChange={(e) => setDate(e.target.value)}
            max={todayString()} />
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total", value: total, icon: "👥", color: "var(--primary)" },
          { title: "Present", value: present, icon: "✅", color: "var(--success)" },
          { title: "Absent", value: total - present, icon: "❌", color: "var(--danger)" },
          { title: "Percentage", value: `${pct}%`, icon: "📊", color: pct >= 75 ? "var(--success)" : "var(--warning)" },
        ].map((s, i) => <div key={i} className="col-6 col-md-3"><StatCard {...s} /></div>)}
      </div>

      {/* Add Student */}
      <div className="card-clean mb-4">
        <div className="card-clean-header"><h6>➕ Add Student to Lecture</h6></div>
        <div className="card-clean-body">
          <div className="position-relative" style={{ maxWidth: 480 }}>
            <div className="d-flex gap-2">
              <input type="text" className="form-control"
                placeholder="Search by name, roll number, or email..."
                value={addInput} onChange={(e) => handleSearch(e.target.value)}
                disabled={adding} />
              {searching && <span className="spinner-border spinner-border-sm align-self-center text-muted" />}
            </div>
            <p className="text-muted small mt-1">Student must have a registered account on AttendEase</p>
            {searchResults.length > 0 && (
              <div className="position-absolute w-100 bg-white border rounded-3 shadow" style={{ zIndex: 50, top: "100%" }}>
                {searchResults.map((s) => (
                  <div key={s._id} className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                    style={{ cursor: "pointer" }} onClick={() => handleAddStudent(s._id, s.name)}>
                    <div>
                      <div className="fw-semibold small">{s.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>{s.rollNo || s.email}</div>
                    </div>
                    <button className="btn btn-sm btn-present" disabled={adding}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card-clean">
        <div className="card-clean-header">
          <h6>📋 Student Attendance List</h6>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm btn-present" onClick={() => markAll("present")}>✓ All Present</button>
            <button className="btn btn-sm btn-absent" onClick={() => markAll("absent")}>✗ All Absent</button>
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
          <div className="card-clean-header border-top justify-content-end">
            <button className="btn fw-bold px-5" disabled={saving} onClick={handleSave}
              style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "💾 Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}