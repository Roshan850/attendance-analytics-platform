export default function StatCard({ title, value, icon, color = "var(--primary)", subtitle }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="stat-value" style={{ color }}>{value}</div>
          <div className="stat-label">{title}</div>
          {subtitle && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{subtitle}</div>}
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  );
}