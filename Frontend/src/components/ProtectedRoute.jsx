import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="spinner-overlay">
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#4f46e5", width: 40, height: 40 }} />
          <p className="mt-2 text-muted small">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return (
    <>
      {/* Backdrop on mobile when sidebar is open */}
      {sidebarOpen && <div className="overlay d-md-none" onClick={() => setSidebarOpen(false)} />}
      <div className="dashboard-layout">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="main-content">
          <div className="mobile-topbar">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <span style={{ fontWeight: 700 }}>🎓 AttendEase</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>{user.name.split(" ")[0]}</span>
          </div>
          <Outlet />
        </main>
      </div>
    </>
  );
}