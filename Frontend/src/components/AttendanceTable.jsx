import { useState } from "react";
import { formatDate } from "../utils/helpers";

/**
 * AttendanceTable — The core attendance marking UI
 * Props:
 *   students: [{_id, name, rollNo, email}]
 *   attendance: { [studentId]: { status, recordId } }
 *   onToggle: (studentId) => void
 *   onRemove: (studentId, name) => void  (optional, faculty only)
 *   readOnly: boolean
 *   date: string
 */
export default function AttendanceTable({ students = [], attendance = {}, onToggle, onRemove, readOnly = false, date }) {
  const [filter, setFilter] = useState("");

  const filtered = students.filter((s) =>
    !filter || s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(filter.toLowerCase()) ||
    s.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter((a) => a.status === "present").length;

  if (students.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>👥</div>
        <p className="text-muted">No students enrolled yet.</p>
        {!readOnly && <p className="text-muted small">Add students using the form above.</p>}
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        <input
          type="text" className="form-control" style={{ maxWidth: 280 }}
          placeholder="🔍 Search by name / roll no..."
          value={filter} onChange={(e) => setFilter(e.target.value)}
        />
        <div className="ms-auto d-flex gap-2 align-items-center">
          <span className="text-muted small">
            <strong className="text-success">{presentCount}</strong> present /
            <strong className="text-danger ms-1">{students.length - presentCount}</strong> absent
          </span>
          {date && <span className="badge bg-secondary">{formatDate(date)}</span>}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="att-table">
          <thead>
            <tr>
              <th style={{ width: 45 }}>#</th>
              <th style={{ width: 100 }}>Roll No</th>
              <th>Name</th>
              <th className="d-none d-md-table-cell">Email</th>
              <th style={{ width: 100 }}>Status</th>
              {!readOnly && <th style={{ width: 180 }}>Action</th>}
              {onRemove && <th style={{ width: 60 }}></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, idx) => {
              const att = attendance[student._id] || { status: "absent" };
              const isPresent = att.status === "present";
              return (
                <tr key={student._id}>
                  <td style={{ color: "var(--text-muted)", fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <span className="badge" style={{ background: "#e0e7ff", color: "#3730a3", fontWeight: 600, fontSize: "0.75rem" }}>
                      {student.rollNo || "—"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{student.name}</div>
                  </td>
                  <td className="d-none d-md-table-cell" style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {student.email}
                  </td>
                  <td>
                    <span className={isPresent ? "badge-present" : "badge-absent"}>
                      {isPresent ? "✓ Present" : "✗ Absent"}
                    </span>
                  </td>
                  {!readOnly && (
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className={`btn-present ${isPresent ? "" : "inactive"}`}
                          onClick={() => !isPresent && onToggle?.(student._id)}
                          title="Mark Present"
                        >
                          ✓ Present
                        </button>
                        <button
                          className={`btn-absent ${!isPresent ? "" : "inactive"}`}
                          onClick={() => isPresent && onToggle?.(student._id)}
                          title="Mark Absent"
                        >
                          ✗ Absent
                        </button>
                      </div>
                    </td>
                  )}
                  {onRemove && (
                    <td>
                      <button className="btn btn-sm btn-outline-danger" title="Remove student"
                        onClick={() => onRemove(student._id, student.name)}>
                        🗑
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}