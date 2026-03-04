import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { lectureAPI, attendanceAPI } from "../../utils/api";
import { getErrorMsg, getAttendanceBadge } from "../../utils/helpers";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const PIE_COLORS = ["#10b981", "#ef4444"];

export default function FacultyAnalytics() {
  const [lectures, setLectures] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    lectureAPI.getAll().then((res) => {
      setLectures(res.data.lectures);
      if (res.data.lectures[0]) setSelectedId(res.data.lectures[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    attendanceAPI.getAnalytics(selectedId)
      .then((res) => setAnalytics(res.data))
      .catch((err) => toast.error(getErrorMsg(err)))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const lowAttendance = analytics?.studentStats?.filter((s) => s.percentage < 75) || [];
  const pieData = analytics ? [
    { name: "Present", value: analytics.overall.present },
    { name: "Absent", value: analytics.overall.absent },
  ] : [];

  const TABS = ["overview", "students", "trends"];

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div><h4>📊 Analytics Dashboard</h4><p>Detailed attendance reports and insights</p></div>
        <select className="form-select" style={{ width: "auto", minWidth: 220 }}
          value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select Lecture...</option>
          {lectures.map((l) => <option key={l._id} value={l._id}>{l.name} — {l.subject}</option>)}
        </select>
      </div>

      {!selectedId ? (
        <div className="text-center py-5 text-muted"><p>Select a lecture to view analytics</p></div>
      ) : loading ? <Loader /> : analytics ? (
        <>
          {/* Alert */}
          {lowAttendance.length > 0 && (
            <div className="alert alert-warning mb-4">
              ⚠️ <strong>{lowAttendance.length} student(s) below 75%:</strong>
              <span className="ms-2">{lowAttendance.map((s) => s.student?.name).join(", ")}</span>
            </div>
          )}

          {/* Stats */}
          <div className="row g-3 mb-4">
            {[
              { title: "Total Classes", value: analytics.overall.total, icon: "📅", color: "var(--primary)" },
              { title: "Avg Attendance", value: `${analytics.overall.percentage}%`, icon: "📊", color: analytics.overall.percentage >= 75 ? "var(--success)" : "var(--warning)" },
              { title: "Students", value: analytics.lecture.studentCount, icon: "👥", color: "var(--secondary)" },
              { title: "Below 75%", value: lowAttendance.length, icon: "⚠️", color: "var(--danger)" },
            ].map((s, i) => <div key={i} className="col-6 col-md-3"><StatCard {...s} /></div>)}
          </div>

          {/* Tabs */}
          <div className="d-flex gap-1 mb-4">
            {TABS.map((t) => (
              <button key={t} className={`btn btn-sm px-3 fw-semibold ${activeTab === t ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card-clean">
                  <div className="card-clean-header"><h6>🥧 Present vs Absent</h6></div>
                  <div className="card-clean-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card-clean">
                  <div className="card-clean-header"><h6>📊 Monthly Summary</h6></div>
                  <div className="card-clean-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={analytics.monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="#10b981" name="Present" radius={[3,3,0,0]} />
                        <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="card-clean">
              <div className="card-clean-header"><h6>👥 Per-Student Summary</h6></div>
              <div className="table-responsive">
                <table className="att-table">
                  <thead>
                    <tr><th>#</th><th>Student</th><th>Roll</th><th>Total</th><th>Present</th><th>Absent</th><th>Percentage</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {analytics.studentStats.map((s, i) => {
                      const badge = getAttendanceBadge(s.percentage);
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">{s.student?.name}</td>
                          <td>{s.student?.rollNo || "—"}</td>
                          <td>{s.total}</td>
                          <td className="text-success fw-bold">{s.present}</td>
                          <td className="text-danger fw-bold">{s.absent}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 140 }}>
                              <div className="progress-wrap flex-fill">
                                <div className="progress-bar-fill" style={{ width: `${s.percentage}%` }} />
                              </div>
                              <span className="fw-bold small">{s.percentage}%</span>
                            </div>
                          </td>
                          <td><span className={badge.class}>{badge.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="card-clean">
              <div className="card-clean-header"><h6>📈 Daily Trend — Last 30 Days</h6></div>
              <div className="card-clean-body">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={analytics.dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} dot={false} name="Present" />
                    <Line yAxisId="left" type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={false} name="Absent" />
                    <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2} dot={false} name="Percentage" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}