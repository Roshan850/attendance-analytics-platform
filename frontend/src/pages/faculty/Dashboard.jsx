import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { lectureAPI } from "../../utils/api";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lectureAPI.getAll()
      .then((res) => setLectures(res.data.lectures))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = [...new Set(lectures.flatMap((l) => l.students?.map((s) => s._id || s)))].length;

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <h4>👋 Welcome, {user?.name?.split(" ")[0]}!</h4>
        <p>Faculty Dashboard — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total Lectures", value: lectures.length, icon: "📚", color: "var(--primary)" },
          { title: "Total Students", value: totalStudents, icon: "👥", color: "var(--secondary)" },
          { title: "Active Today", value: new Date().toLocaleDateString("en-IN", { weekday: "short" }), icon: "📅", color: "var(--success)" },
          { title: "Department", value: user?.department || "N/A", icon: "🏛️", color: "var(--warning)" },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3"><StatCard {...s} /></div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card-clean">
            <div className="card-clean-header">
              <h6>⚡ Quick Actions</h6>
            </div>
            <div className="card-clean-body d-flex gap-3 flex-wrap">
              <Link to="/faculty/lectures" className="btn btn-lg fw-semibold px-4" style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}>
                + Create Lecture
              </Link>
              <Link to="/faculty/analytics" className="btn btn-lg fw-semibold px-4 btn-outline-secondary">
                📊 View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures List */}
      <div className="card-clean">
        <div className="card-clean-header">
          <h6>📚 My Lectures</h6>
          <Link to="/faculty/lectures" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <div className="card-clean-body p-0">
          {lectures.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: "3rem" }}>📭</div>
              <p className="mt-2">No lectures yet. Create your first one!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="att-table">
                <thead>
                  <tr><th>Lecture Name</th><th>Subject</th><th>Students</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {lectures.slice(0, 5).map((l) => (
                    <tr key={l._id}>
                      <td className="fw-semibold">{l.name}</td>
                      <td><span className="badge bg-primary bg-opacity-10 text-primary">{l.subject}</span></td>
                      <td><span className="badge bg-secondary">{l.students?.length || 0}</span></td>
                      <td>
                        <Link to={`/faculty/lectures/${l._id}/attendance`} className="btn btn-sm btn-present">
                          Mark Attendance
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}