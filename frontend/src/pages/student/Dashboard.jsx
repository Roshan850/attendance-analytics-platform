import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { attendanceAPI, lectureAPI } from "../../utils/api";
import { getAttendanceColor, getAttendanceBadge } from "../../utils/helpers";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      attendanceAPI.getStudentAttendance(user._id),
      lectureAPI.getAll(),
    ]).then(([attRes, lecRes]) => {
      setData(attRes.data);
      setLectures(lecRes.data.lectures);
    }).finally(() => setLoading(false));
  }, [user._id]);

  if (loading) return <Loader />;

  const totalPresent = data?.lectureStats?.reduce((s, l) => s + l.present, 0) || 0;
  const totalClasses = data?.lectureStats?.reduce((s, l) => s + l.total, 0) || 0;
  const overallPct = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h4>👋 Hello, {user?.name?.split(" ")[0]}!</h4>
        <p>Roll No: <strong>{user?.rollNo || "N/A"}</strong> · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { title: "Overall Attendance", value: `${overallPct}%`, icon: "📊", color: getAttendanceColor(overallPct) },
          { title: "Classes Attended", value: totalPresent, icon: "✅", color: "var(--success)" },
          { title: "Classes Missed", value: totalClasses - totalPresent, icon: "❌", color: "var(--danger)" },
          { title: "Enrolled Subjects", value: lectures.length, icon: "📚", color: "var(--primary)" },
        ].map((s, i) => <div key={i} className="col-6 col-md-3"><StatCard {...s} /></div>)}
      </div>

      {/* Warning */}
      {overallPct < 75 && totalClasses > 0 && (
        <div className="alert alert-warning mb-4">
          ⚠️ <strong>Your overall attendance is {overallPct}%.</strong> Minimum required is typically 75%. Attend more classes!
        </div>
      )}

      {/* Per-Lecture Summary */}
      <div className="card-clean">
        <div className="card-clean-header">
          <h6>📚 Subject-wise Attendance</h6>
          <Link to="/student/attendance" className="btn btn-sm btn-outline-primary">View Details</Link>
        </div>
        <div className="card-clean-body p-0">
          {data?.lectureStats?.length === 0 ? (
            <div className="text-center py-5 text-muted"><p>No attendance records yet.</p></div>
          ) : (
            <div className="table-responsive">
              <table className="att-table">
                <thead><tr><th>Subject</th><th>Total</th><th>Present</th><th>Absent</th><th>%</th><th>Status</th></tr></thead>
                <tbody>
                  {data?.lectureStats?.map((s, i) => {
                    const badge = getAttendanceBadge(s.percentage);
                    return (
                      <tr key={i}>
                        <td><div className="fw-semibold">{s.lectureName}</div><small className="text-muted">{s.subject}</small></td>
                        <td>{s.total}</td>
                        <td className="text-success fw-bold">{s.present}</td>
                        <td className="text-danger fw-bold">{s.absent}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress-wrap" style={{ width: 80 }}>
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
          )}
        </div>
      </div>
    </div>
  );
}