import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor: Attach Token ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on login/register endpoints
      const url = error.config?.url || "";
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Typed API helpers ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const lectureAPI = {
  getAll: () => api.get("/lectures"),
  getOne: (id) => api.get(`/lectures/${id}`),
  create: (data) => api.post("/lectures", data),
  update: (id, data) => api.put(`/lectures/${id}`, data),
  delete: (id) => api.delete(`/lectures/${id}`),
  addStudent: (id, data) => api.post(`/lectures/${id}/students`, data),
  removeStudent: (id, studentId) => api.delete(`/lectures/${id}/students/${studentId}`),
};

export const attendanceAPI = {
  mark: (data) => api.post("/attendance/mark", data),
  updateRecord: (id, data) => api.put(`/attendance/${id}`, data),
  getLectureAttendance: (lectureId, params) => api.get(`/attendance/lecture/${lectureId}`, { params }),
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getAnalytics: (lectureId) => api.get(`/attendance/analytics/lecture/${lectureId}`),
};

export const studentAPI = {
  search: (params) => api.get("/students", { params }),
  getOne: (id) => api.get(`/students/${id}`),
};