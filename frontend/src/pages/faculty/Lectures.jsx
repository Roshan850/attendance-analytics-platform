import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { lectureAPI } from "../../utils/api";
import { getErrorMsg } from "../../utils/helpers";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", subjectCode: "", semester: "", academicYear: "", room: "", scheduleDays: [], startTime: "", endTime: "" });

  const fetchLectures = () => {
    setLoading(true);
    lectureAPI.getAll()
      .then((res) => setLectures(res.data.lectures))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLectures(); }, []);

  const handleToggleDay = (day) => {
    setForm((p) => ({
      ...p,
      scheduleDays: p.scheduleDays.includes(day)
        ? p.scheduleDays.filter((d) => d !== day)
        : [...p.scheduleDays, day],
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subject) return toast.error("Name and subject are required");
    setSaving(true);
    try {
      const payload = {
        name: form.name, subject: form.subject, subjectCode: form.subjectCode,
        semester: form.semester, academicYear: form.academicYear, room: form.room,
        schedule: { days: form.scheduleDays, startTime: form.startTime, endTime: form.endTime },
      };
      const res = await lectureAPI.create(payload);
      toast.success("Lecture created!");
      setLectures((p) => [res.data.lecture, ...p]);
      setShowForm(false);
      setForm({ name: "", subject: "", subjectCode: "", semester: "", academicYear: "", room: "", scheduleDays: [], startTime: "", endTime: "" });
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove lecture "${name}"?`)) return;
    try {
      await lectureAPI.delete(id);
      setLectures((p) => p.filter((l) => l._id !== id));
      toast.success("Lecture removed");
    } catch (err) {
      toast.error(getErrorMsg(err));
    }
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h4>📚 My Lectures</h4>
          <p>Manage your lectures and enrolled students</p>
        </div>
        <button className="btn fw-semibold px-4" style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}
          onClick={() => setShowForm((p) => !p)}>
          {showForm ? "✕ Cancel" : "+ Create Lecture"}
        </button>
      </div>

      {/* Create Lecture Form */}
      {showForm && (
        <div className="card-clean mb-4">
          <div className="card-clean-header"><h6>➕ Create New Lecture</h6></div>
          <div className="card-clean-body">
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Lecture Name *</label>
                  <input className="form-control" placeholder="e.g. Data Structures Lab" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Subject *</label>
                  <input className="form-control" placeholder="e.g. Computer Science" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold small">Code</label>
                  <input className="form-control" placeholder="CS101" value={form.subjectCode} onChange={(e) => setForm((p) => ({ ...p, subjectCode: e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small">Semester</label>
                  <input className="form-control" placeholder="Semester 3" value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small">Academic Year</label>
                  <input className="form-control" placeholder="2024-25" value={form.academicYear} onChange={(e) => setForm((p) => ({ ...p, academicYear: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold small">Room</label>
                  <input className="form-control" placeholder="A101" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold small">Start Time</label>
                  <input className="form-control" type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold small">End Time</label>
                  <input className="form-control" type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small">Schedule Days</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {DAYS.map((day) => (
                      <button key={day} type="button"
                        className={`btn btn-sm ${form.scheduleDays.includes(day) ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => handleToggleDay(day)}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn fw-semibold px-5" disabled={saving}
                    style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "✓ Create Lecture"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lectures Grid */}
      {loading ? <Loader /> : lectures.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem" }}>📭</div>
          <p className="text-muted mt-2">No lectures yet. Create your first one!</p>
        </div>
      ) : (
        <div className="row g-3">
          {lectures.map((l) => (
            <div key={l._id} className="col-md-6 col-lg-4">
              <div className="card-clean h-100">
                <div className="card-clean-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge" style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "0.75rem" }}>
                      {l.subjectCode || l.subject}
                    </span>
                    <span className="badge bg-secondary">{l.students?.length || 0} students</span>
                  </div>
                  <h6 className="fw-bold mb-1">{l.name}</h6>
                  <p className="text-muted small mb-2">{l.subject}{l.semester ? ` • ${l.semester}` : ""}</p>
                  {l.schedule?.days?.length > 0 && (
                    <div className="d-flex gap-1 mb-3 flex-wrap">
                      {l.schedule.days.map((d) => <span key={d} className="badge bg-light text-dark" style={{ fontSize: "0.7rem" }}>{d}</span>)}
                      {l.schedule.startTime && <span className="badge bg-light text-dark" style={{ fontSize: "0.7rem" }}>{l.schedule.startTime}–{l.schedule.endTime}</span>}
                    </div>
                  )}
                  <div className="d-flex gap-2 flex-wrap">
                    <Link to={`/faculty/lectures/${l._id}/attendance`} className="btn btn-sm flex-fill fw-semibold btn-present">
                      📋 Mark Attendance
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(l._id, l.name)}>🗑</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}