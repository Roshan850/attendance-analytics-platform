import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Faculty
import FacultyDashboard from "./pages/faculty/Dashboard";
import Lectures from "./pages/faculty/Lectures";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import FacultyAnalytics from "./pages/faculty/Analytics";

// Student
import StudentDashboard from "./pages/student/Dashboard";
import MyAttendance from "./pages/student/MyAttendance";
import StudentAnalytics from "./pages/student/Analytics";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: "8px", fontSize: "0.88rem" },
          success: { iconTheme: { primary: "#10b981", secondary: "white" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Faculty Protected */}
        <Route element={<ProtectedRoute role="faculty" />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/lectures" element={<Lectures />} />
          <Route path="/faculty/lectures/:id/attendance" element={<MarkAttendance />} />
          <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
        </Route>

        {/* Student Protected */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<MyAttendance />} />
          <Route path="/student/analytics" element={<StudentAnalytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
