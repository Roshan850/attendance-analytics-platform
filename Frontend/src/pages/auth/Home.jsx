import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const features = [
  { icon: "📋", title: "Smart Attendance", desc: "Mark with one click. Default absent, easily switch to present." },
  { icon: "📊", title: "Rich Analytics", desc: "Charts, trends, per-student stats and monthly summaries." },
  { icon: "🔐", title: "Dual Roles", desc: "Separate portals for faculty and students with role-based access." },
  { icon: "📱", title: "Fully Responsive", desc: "Works perfectly on mobile, tablet, and desktop." },
];

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return (
    <div className="hero-section">
      <div style={{ maxWidth: 800, width: "100%", position: "relative", zIndex: 1 }}>
        <div className="text-center text-white mb-4">
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🎓</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, letterSpacing: "-2px", margin: "0 0 0.75rem" }}>
            AttendEase
          </h1>
          <p style={{ fontSize: "1.15rem", opacity: 0.85, maxWidth: 520, margin: "0 auto 2rem" }}>
            Production-grade student attendance management for modern institutions.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg px-5 fw-bold" style={{ color: "#4f46e5", borderRadius: 10 }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-lg px-5 fw-semibold" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 10 }}>
              Login
            </Link>
          </div>
        </div>

        <div className="row g-3 mt-2">
          {features.map((f, i) => (
            <div key={i} className="col-6 col-md-3">
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "1.25rem", backdropFilter: "blur(8px)", height: "100%" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                <h6 style={{ color: "white", fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.9rem" }}>{f.title}</h6>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-4" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
          MERN Stack · JWT Auth · MongoDB Atlas · Recharts Analytics
        </p>
      </div>
    </div>
  );
}