export default function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border" style={{ color: "var(--primary)", width: 40, height: 40 }} />
      <p className="text-muted mt-3 small">{text}</p>
    </div>
  );
}

export function TableLoader({ cols = 5, rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <div style={{ height: 16, background: "#f1f5f9", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}