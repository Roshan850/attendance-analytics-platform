import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { attendanceAPI } from "../../utils/api";
import { getAttendanceColor, getAttendanceBadge } from "../../utils/helpers";
import Loader from "../../components/Loader";

const BAR_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StudentAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceAPI.getStudentAttendance(user._id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [user._id]);

  if (loading) return <Loader />;

  const totalPresent = data?.lectureStats?.reduce((s, l) => s + l.present, 0) || 0;
  const totalClasses = data?.lectureStats?.reduce((s, l) => s + l.total, 0) || 0;
  const overallPct = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;

  const barData = data?.lectureStats?.map((s) => ({
    name: s.lectureName?.substring(0, 15) || "Subject",
    percentage: s.percentage,
    present: s.present,
    absent: s.absent,
  })) || [];

  return (
    <div>
      <div className="page-header">
        <h4>📊 My Analytics</h4>
        <p>Your attendance performance at a glance</p>
      </div>

      {/* Overall Gauge */}
      <div className="row g-4 mb-4">
        <div className="col-md-5">
          <div className="card-clean text-center">
            <div className="card-clean-body">
              <h6 className="fw-bold mb-3">Overall Attendance</h6>
              <div style={{ fontSize: "4rem", fontWeight: 900, color: getAttendanceColor(overallPct), lineHeight: 1 }}>
                {overallPct}%
              </div>
              <div className="mt-2">
                <span className={getAttendanceBadge(overallPct).class}>{getAttendanceBadge(overallPct).label}</span>
              </div>
              <div className="mt-3 d-flex justify-content-center gap-4">
                <div><div className="fw-bold text-success">{totalPresent}</div><div className="text-muted small">Present</div></div>
                <div><div className="fw-bold text-danger">{totalClasses - totalPresent}</div><div className="text-muted small">Absent</div></div>
                <div><div className="fw-bold">{totalClasses}</div><div className="text-muted small">Total</div></div>
              </div>
              {overallPct < 75 && totalClasses > 0 && (
                <div className="alert alert-warning mt-3 py-2 small">
                  You need <strong>{Math.ceil((0.75 * totalClasses - totalPresent) / 0.25)}</strong> more classes to reach 75%
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-clean">
            <div className="card-clean-header"><h6>📊 Subject-wise Attendance %</h6></div>
            <div className="card-clean-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="percentage" radius={[4,4,0,0]}>
                    {barData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="card-clean">
        <div className="card-clean-header"><h6>📋 Subject Breakdown</h6></div>
        <div className="card-clean-body p-0">
          <div className="table-responsive">
            <table className="att-table">
              <thead><tr><th>Subject</th><th>Total</th><th>Present</th><th>Absent</th><th>Attendance</th><th>Grade</th></tr></thead>
              <tbody>
                {data?.lectureStats?.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">No data available</td></tr>
                ) : data?.lectureStats?.map((s, i) => {
                  const badge = getAttendanceBadge(s.percentage);
                  return (
                    <tr key={i}>
                      <td><div className="fw-semibold">{s.lectureName}</div><small className="text-muted">{s.subject}</small></td>
                      <td>{s.total}</td>
                      <td className="text-success fw-bold">{s.present}</td>
                      <td className="text-danger fw-bold">{s.absent}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress-wrap" style={{ width: 100 }}>
                            <div className="progress-bar-fill" style={{ width: `${s.percentage}%` }} />
                          </div>
                          <strong>{s.percentage}%</strong>
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
      </div>
    </div>
  );
}