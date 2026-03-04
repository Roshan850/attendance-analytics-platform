import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { attendanceAPI, lectureAPI } from "../../utils/api";
import { formatDate, getErrorMsg, getYearOptions, getMonthName } from "../../utils/helpers";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12];

export default function MyAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [lectureStats, setLectureStats] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [filter, setFilter] = useState({ lectureId: "", month: "", year: new Date().getFullYear().toString() });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lectureAPI.getAll().then((res) => setLectures(res.data.lectures));
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.lectureId) params.lectureId = filter.lectureId;
      if (filter.month) params.month = filter.month;
      if (filter.year) params.year = filter.year;
      const res = await attendanceAPI.getStudentAttendance(user._id, params);
      setRecords(res.data.records);
      setLectureStats(res.data.lectureStats);
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  }, [user._id, filter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const overallPct = records.length ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h4>📋 My Attendance</h4>
        <p>View and filter your attendance records</p>
      </div>

      {/* Summary Card */}
      <div className="card-clean mb-4" style={{ borderTop: `3px solid ${overallPct >= 75 ? "var(--success)" : "var(--danger)"}` }}>
        <div className="card-clean-body">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: overallPct >= 75 ? "var(--success)" : "var(--danger)" }}>{overallPct}%</div>
              <div className="text-muted small">Filtered Period</div>
            </div>
            <div className="vr d-none d-md-block" />
            <div className="d-flex gap-4">
              <div><div className="fw-bold text-success">{presentCount}</div><div className="text-muted small">Present</div></div>
              <div><div className="fw-bold text-danger">{records.length - presentCount}</div><div className="text-muted small">Absent</div></div>
              <div><div className="fw-bold">{records.length}</div><div className="text-muted small">Total</div></div>
            </div>
            {overallPct < 75 && records.length > 0 && <div className="alert alert-warning py-2 px-3 mb-0">⚠️ Below 75% threshold</div>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-clean mb-4">
        <div className="card-clean-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Subject</label>
              <select className="form-select" value={filter.lectureId} onChange={(e) => setFilter((p) => ({ ...p, lectureId: e.target.value }))}>
                <option value="">All Subjects</option>
                {lectures.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Month</label>
              <select className="form-select" value={filter.month} onChange={(e) => setFilter((p) => ({ ...p, month: e.target.value }))}>
                <option value="">All Months</option>
                {MONTHS.map((m) => <option key={m} value={m}>{getMonthName(m)}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Year</label>
              <select className="form-select" value={filter.year} onChange={(e) => setFilter((p) => ({ ...p, year: e.target.value }))}>
                {getYearOptions().map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn w-100 btn-outline-secondary"
                onClick={() => setFilter({ lectureId: "", month: "", year: new Date().getFullYear().toString() })}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card-clean">
        <div className="card-clean-header">
          <h6>📅 Attendance Records</h6>
          <span className="badge bg-secondary">{records.length} records</span>
        </div>
        {loading ? <div className="p-3"><Loader /></div> : (
          <div className="table-responsive">
            <table className="att-table">
              <thead><tr><th>Date</th><th>Subject</th><th>Lecture</th><th>Status</th></tr></thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted">No records found for selected filters</td></tr>
                ) : records.map((r, i) => (
                  <tr key={i}>
                    <td>{formatDate(r.date)}</td>
                    <td><span className="fw-semibold">{r.lecture?.subject}</span></td>
                    <td>{r.lecture?.name}</td>
                    <td><span className={r.status === "present" ? "badge-present" : "badge-absent"}>{r.status === "present" ? "✓ Present" : "✗ Absent"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}