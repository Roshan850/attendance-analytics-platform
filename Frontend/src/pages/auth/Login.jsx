// ── Date Helpers ──────────────────────────────────────────────────
export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const todayString = () => new Date().toISOString().split("T")[0];

export const getMonthName = (monthNum) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(monthNum) - 1] || monthNum;
};

// ── Attendance Helpers ────────────────────────────────────────────
export const calcPercentage = (present, total) =>
  total ? Math.round((present / total) * 100) : 0;

export const getAttendanceColor = (percentage) => {
  if (percentage >= 75) return "var(--success)";
  if (percentage >= 50) return "var(--warning)";
  return "var(--danger)";
};

export const getAttendanceBadge = (percentage) => {
  if (percentage >= 75) return { label: "Good", class: "badge-present" };
  if (percentage >= 50) return { label: "Average", class: "badge-warn" };
  return { label: "Low ⚠️", class: "badge-absent" };
};

// ── Error Message Extractor ───────────────────────────────────────
export const getErrorMsg = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.errors?.[0]?.message) return err.response.data.errors[0].message;
  if (err?.message) return err.message;
  return "Something went wrong. Please try again.";
};

// ── String Helpers ────────────────────────────────────────────────
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const getInitials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "??";

// ── Year options ──────────────────────────────────────────────────
export const getYearOptions = () => {
  const current = new Date().getFullYear();
  return [current - 1, current, current + 1];
};