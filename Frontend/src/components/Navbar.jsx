import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";
import toast from "react-hot-toast";

const FACULTY_LINKS = [
  { to: "/faculty/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/faculty/lectures", icon: "📚", label: "My Lectures" },
  { to: "/faculty/analytics", icon: "📊", label: "Analytics" },
];

const STUDENT_LINKS = [
  { to: "/student/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/student/attendance", icon: "📋", label: "My Attendance" },
  { to: "/student/analytics", icon: "📊", label: "Analytics" },
];

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "faculty" ? FACULTY_LINKS : STUDENT_LINKS;

  const handleLogout = () => {
    logout();
    toast.success("Logged out. See you soon!");
    navigate("/", { replace: true });
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <h5>🎓 AttendEase</h5>
        <span>{user?.role === "faculty" ? "Faculty Portal" : "Student Portal"}</span>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, flexShrink: 0 }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="user-name">{user?.name}</div>
            <div className="user-meta">
              {user?.role === "student" ? `Roll: ${user?.rollNo || "N/A"}` : user?.department || "Faculty"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to} to={link.to}
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="btn w-100 py-2 fw-semibold"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: "0.88rem" }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}