import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";
import { getErrorMsg } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", rollNo: "", department: "", employeeId: "" });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Fill all required fields");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role };
      if (role === "student" && form.rollNo) payload.rollNo = form.rollNo;
      if (role === "faculty") {
        if (form.department) payload.department = form.department;
        if (form.employeeId) payload.employeeId = form.employeeId;
      }

      const res = await authAPI.register(payload);
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      navigate(`/${res.data.user.role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "form-control form-control-lg";

  return (
    <div className="hero-section" style={{ padding: "1rem" }}>
      <div className="auth-box" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>🎓</div>
          <h4 className="fw-bold mt-2 mb-1" style={{ color: "#4f46e5" }}>Create Account</h4>
          <p className="text-muted small">Join AttendEase today</p>
        </div>

        {/* Role Selector */}
        <div className="d-flex rounded-3 overflow-hidden border mb-4" style={{ border: "1px solid #e2e8f0" }}>
          {["student", "faculty"].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className="btn flex-fill py-2 rounded-0 fw-semibold"
              style={{ background: role === r ? "#4f46e5" : "white", color: role === r ? "white" : "#64748b", fontSize: "0.9rem" }}>
              {r === "student" ? "👨‍🎓 Student" : "👩‍🏫 Faculty"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <input className={inputClass} name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <input className={inputClass} type="email" name="email" placeholder="Email Address *" value={form.email} onChange={handleChange} required />
            </div>

            {role === "student" ? (
              <div className="col-12">
                <input className={inputClass} name="rollNo" placeholder="Roll Number (optional)" value={form.rollNo} onChange={handleChange} />
              </div>
            ) : (
              <>
                <div className="col-md-7">
                  <input className={inputClass} name="department" placeholder="Department" value={form.department} onChange={handleChange} />
                </div>
                <div className="col-md-5">
                  <input className={inputClass} name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} />
                </div>
              </>
            )}

            <div className="col-md-6">
              <input className={inputClass} type="password" name="password" placeholder="Password *" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="col-md-6">
              <input className={inputClass} type="password" name="confirmPassword" placeholder="Confirm Password *" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-lg w-100 fw-bold" disabled={loading}
                style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : "Create Account →"}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-1">Already have an account? <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600 }}>Login</Link></p>
          <Link to="/" className="text-muted small">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}