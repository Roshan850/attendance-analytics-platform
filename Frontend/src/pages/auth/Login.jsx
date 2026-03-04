import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";
import { getErrorMsg } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      navigate(`/${res.data.user.role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section">
      <div className="auth-box">
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>🎓</div>
          <h4 className="fw-bold mt-2 mb-1" style={{ color: "#4f46e5" }}>Welcome Back</h4>
          <p className="text-muted small">Login to your AttendEase account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email Address</label>
            <input
              type="email" name="email" className="form-control form-control-lg"
              placeholder="your@email.com" value={form.email} onChange={handleChange}
              disabled={loading} required autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <input
                type={showPass ? "text" : "password"} name="password"
                className="form-control form-control-lg" placeholder="Your password"
                value={form.password} onChange={handleChange} disabled={loading} required
              />
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => setShowPass((p) => !p)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-lg w-100 fw-bold" disabled={loading}
            style={{ background: "#4f46e5", color: "white", borderRadius: 8 }}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Logging in...</>
            ) : "Login →"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small mb-2">
            Don't have an account? <Link to="/register" style={{ color: "#4f46e5", fontWeight: 600 }}>Register here</Link>
          </p>
          <Link to="/" className="text-muted small">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}