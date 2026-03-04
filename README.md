<div align="center">

<img src="https://img.shields.io/badge/AttendEase-v1.0.0-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik05IDVINy41QTIuNSAyLjUgMCAwIDAgNSA3LjV2MTFBMi41IDIuNSAwIDAgMCA3LjUgMjFoOWEyLjUgMi41IDAgMCAwIDIuNS0yLjVWN0EyLjUgMi41IDAgMCAwIDE2LjUgNEgxNWEzIDMgMCAwIDEtNiAwWk05IDE2bC0yLTItMS0xIDEtMSAxIDEgMy0zIDEgMVoiLz48L3N2Zz4=" alt="AttendEase">

# 🎓 AttendEase

### Production-Ready Student Attendance Management System

*Built with the MERN Stack · JWT Auth · Role-Based Access · Real-Time Analytics*

<br/>

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![MUI](https://img.shields.io/badge/Material_UI-0081CB?style=flat-square&logo=mui&logoColor=white)](https://mui.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://attendance-analytics-platform.onrender.com)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://attendance-analytics-platform.vercel.app)

<br/>

[🚀 Live Demo](https://attendance-analytics-platform.vercel.app) · [🔧 API Docs](#-api-reference) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

<br/>

![AttendEase Dashboard Preview](https://placehold.co/900x480/1e1b4b/818cf8?text=AttendEase+Dashboard+Preview&font=montserrat)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AttendEase** is a full-stack, production-grade attendance management system designed for educational institutions. It provides a seamless experience for both faculty and students with real-time attendance tracking, detailed analytics, and a clean, responsive interface.

Faculty can create lectures, enroll students, mark attendance with a single click, and visualize trends through rich charts. Students get instant access to their attendance records and performance analytics — all in one platform.

> **Live Backend API:** `https://attendance-analytics-platform.onrender.com/api`  
> **Live Frontend:** `https://attendance-analytics-platform.vercel.app`

---

## ✨ Features

### 👩‍🏫 Faculty Portal
| Feature | Description |
|---------|-------------|
| 📚 **Lecture Management** | Create, update, and delete lectures with subject codes, schedules, and room details |
| ➕ **Student Enrollment** | Add students by roll number or email — auto-defaults attendance to **Absent** |
| 📋 **Mark Attendance** | Toggle Present/Absent per student with bulk "Mark All" actions |
| 📅 **Date-Based Records** | Mark or view attendance for any past date |
| 📊 **Analytics Dashboard** | Pie charts, bar charts, daily trend lines, per-student breakdowns |
| ⚠️ **Low Attendance Alerts** | Automatic warnings for students below 75% |
| 🔍 **Student Search** | Live search by name, roll number, or email |

### 👨‍🎓 Student Portal
| Feature | Description |
|---------|-------------|
| 📈 **Attendance Overview** | Overall percentage with color-coded status (Good / Average / Low) |
| 📋 **Subject-wise Records** | Per-subject attendance with progress bars |
| 🔎 **Filter & Search** | Filter by subject, month, year |
| 📊 **Personal Analytics** | Subject-wise bar charts, grade badges, classes-needed calculator |
| ⚡ **75% Tracker** | Calculates exactly how many classes needed to reach 75% |

### 🔐 Security & Architecture
- **JWT Authentication** with configurable expiry
- **Role-based access control** — Faculty/Student with middleware guards
- **Bcrypt password hashing** (cost factor 12)
- **Rate limiting** — 100 req/15min general, 20 req/15min for auth
- **Helmet.js** HTTP security headers
- **CORS** with environment-based origin control
- **Compound unique index** prevents duplicate attendance records

---

## 🛠️ Tech Stack

### Backend
```
Node.js + Express.js    →  REST API server
MongoDB + Mongoose      →  Database & ODM
JWT (jsonwebtoken)      →  Authentication
Bcryptjs                →  Password hashing
Helmet + Rate-limit     →  Security middleware
Morgan                  →  HTTP request logging
Nodemon                 →  Development hot-reload
```

### Frontend
```
React 18 + Vite         →  UI framework & build tool
React Router v6         →  Client-side routing
Axios                   →  HTTP client with interceptors
Bootstrap 5             →  CSS framework
Material UI (MUI)       →  Component library
Recharts                →  Data visualization (charts)
React Hot Toast         →  Notifications
```

### DevOps & Deployment
```
MongoDB Atlas           →  Cloud database (M0 Free tier)
Render.com              →  Backend hosting
Vercel                  →  Frontend hosting + CDN
GitHub                  →  Version control + CI/CD
```

---

## 📁 Project Structure

```
attendance-analytics-platform/
│
├── Backend/                          # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js         # Register, login, profile
│   │   ├── lectureController.js      # CRUD + student enrollment
│   │   ├── attendanceController.js   # Mark, update, analytics
│   │   └── studentController.js      # Search, view students
│   ├── models/
│   │   ├── User.js                   # Student/Faculty model
│   │   ├── Lecture.js                # Lecture model
│   │   └── Attendance.js             # Attendance records
│   ├── routes/
│   │   ├── auth.js                   # /api/auth/*
│   │   ├── lectures.js               # /api/lectures/*
│   │   ├── attendance.js             # /api/attendance/*
│   │   └── students.js               # /api/students/*
│   ├── middleware/
│   │   ├── auth.js                   # JWT verify + role guards
│   │   └── errorHandler.js           # Global error handler
│   ├── server.js                     # Entry point
│   ├── package.json
│   └── .env.example
│
└── Frontend/                         # React + Vite SPA
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Home.jsx           # Landing page
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── faculty/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Lectures.jsx
    │   │   │   ├── MarkAttendance.jsx # Core feature
    │   │   │   └── Analytics.jsx
    │   │   └── student/
    │   │       ├── Dashboard.jsx
    │   │       ├── MyAttendance.jsx
    │   │       └── Analytics.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx             # Sidebar navigation
    │   │   ├── ProtectedRoute.jsx     # Auth + role guard
    │   │   ├── AttendanceTable.jsx    # Core attendance UI
    │   │   ├── StatCard.jsx
    │   │   └── Loader.jsx
    │   └── utils/
    │       ├── api.js                 # Axios instance + interceptors
    │       └── helpers.js            # Utility functions
    ├── index.html
    ├── vite.config.js
    ├── vercel.json
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher
git --version     # any recent version
```

### 1. Clone the Repository

```bash
git clone https://github.com/Roshan850/attendance-analytics-platform.git
cd attendance-analytics-platform
```

### 2. Setup Backend

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values (see Environment Variables section)
# Then start the development server
npm run dev
```

Server runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### 3. Setup Frontend

Open a **new terminal**:

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

App runs at: `http://localhost:5173`

### 4. Quick Test

Register two accounts to test all features:
- **Faculty:** Select "Faculty" tab → fill details → register
- **Student:** Select "Student" tab → fill roll number → register

Then login as faculty, create a lecture, add the student, and mark attendance!

---

## 🔑 Environment Variables

### Backend — `Backend/.env`

```env
# ── Database ──────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/attendance_db?retryWrites=true&w=majority

# ── Authentication ─────────────────────────────────
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d

# ── Server ─────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── CORS ───────────────────────────────────────────
CLIENT_URL=http://localhost:5173
```

### Frontend — `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files to Git.** Both `.env` files are already in `.gitignore`.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |
| `GET` | `/api/auth/me` | Private | Get current user |
| `PUT` | `/api/auth/profile` | Private | Update profile |
| `PUT` | `/api/auth/change-password` | Private | Change password |

### Lectures

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/lectures` | Private | Get all lectures (role-filtered) |
| `POST` | `/api/lectures` | Faculty | Create new lecture |
| `GET` | `/api/lectures/:id` | Private | Get single lecture |
| `PUT` | `/api/lectures/:id` | Faculty | Update lecture |
| `DELETE` | `/api/lectures/:id` | Faculty | Soft delete lecture |
| `POST` | `/api/lectures/:id/students` | Faculty | Add student to lecture |
| `DELETE` | `/api/lectures/:id/students/:studentId` | Faculty | Remove student |

### Attendance

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/attendance/mark` | Faculty | Bulk mark attendance |
| `GET` | `/api/attendance/lecture/:lectureId` | Private | Get lecture attendance (with `?date=`) |
| `GET` | `/api/attendance/student/:studentId` | Private | Get student's attendance |
| `GET` | `/api/attendance/analytics/lecture/:lectureId` | Faculty | Full analytics data |
| `PUT` | `/api/attendance/:id` | Faculty | Update single record |

### Students

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/students` | Faculty | Search students (`?search=`) |
| `GET` | `/api/students/:id` | Faculty | Get student details |

---

## 🌐 Deployment

This project is deployed using **free-tier** services:

| Service | Purpose | URL |
|---------|---------|-----|
| **MongoDB Atlas** (M0 Free) | Cloud Database | `cluster.mongodb.net` |
| **Render** (Free Web Service) | Backend API | `attendance-analytics-platform.onrender.com` |
| **Vercel** (Hobby) | Frontend SPA | `attendance-analytics-platform.vercel.app` |

### Deploy Your Own

#### 1. MongoDB Atlas
1. Create free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create M0 Free cluster → Add database user → Allow all IPs (`0.0.0.0/0`)
3. Copy connection string

#### 2. Deploy Backend to Render
1. Push `Backend/` to GitHub
2. New Web Service on [render.com](https://render.com)
3. Root Directory: `Backend` | Build: `npm install` | Start: `npm start`
4. Add all environment variables from [Environment Variables](#-environment-variables)

#### 3. Deploy Frontend to Vercel
1. Push `Frontend/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Root Directory: `Frontend` | Framework: `Vite`
4. Add: `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Create `vercel.json` in `Frontend/`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📸 Screenshots

<div align="center">

| Faculty Dashboard | Mark Attendance |
|:-----------------:|:---------------:|
| ![Faculty Dashboard](https://placehold.co/420x260/1e1b4b/818cf8?text=Faculty+Dashboard&font=montserrat) | ![Mark Attendance](https://placehold.co/420x260/052e16/34d399?text=Mark+Attendance&font=montserrat) |

| Analytics | Student View |
|:---------:|:------------:|
| ![Analytics](https://placehold.co/420x260/0c4a6e/06b6d4?text=Analytics+%26+Charts&font=montserrat) | ![Student](https://placehold.co/420x260/312e81/a5b4fc?text=Student+Portal&font=montserrat) |

</div>

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name:        String,    // required
  email:       String,    // unique, required
  password:    String,    // bcrypt hashed, select: false
  role:        String,    // enum: ['student', 'faculty']
  rollNo:      String,    // students only
  department:  String,    // faculty only
  employeeId:  String,    // faculty only
  isActive:    Boolean,   // default: true
  lastLogin:   Date,
  timestamps:  true
}
```

### Lecture Model
```javascript
{
  name:         String,   // required
  subject:      String,   // required
  subjectCode:  String,
  faculty:      ObjectId, // ref: User
  students:     [ObjectId], // ref: User[]
  schedule: {
    days:       [String], // ['Mon','Wed','Fri']
    startTime:  String,
    endTime:    String
  },
  semester:     String,
  academicYear: String,
  room:         String,
  isActive:     Boolean,  // default: true
  timestamps:   true
}
```

### Attendance Model
```javascript
{
  lecture:   ObjectId,  // ref: Lecture
  student:   ObjectId,  // ref: User
  faculty:   ObjectId,  // ref: User
  date:      Date,      // required
  status:    String,    // enum: ['present','absent'], default: 'absent'
  markedAt:  Date,
  // Compound unique index:
  // { lecture: 1, student: 1, date: 1 } — prevents duplicates
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and naming conventions
- Add comments for complex logic
- Test all API endpoints before submitting PR
- Update this README if you add new features

---

## 🐛 Known Issues & Roadmap

### Known Issues
- [ ] Render free tier cold start (~30s delay after inactivity)
- [ ] No pagination on analytics page for large datasets

### Upcoming Features
- [ ] 📧 Email notifications for low attendance
- [ ] 📱 PWA support for mobile install
- [ ] 📤 Export attendance to Excel/PDF
- [ ] 🔔 Push notifications
- [ ] 📆 Timetable / schedule view
- [ ] 👨‍💼 Admin panel for institution management
- [ ] 🌐 Multi-language support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2026 Roshan850

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, and distribute without restriction.
```

---

## 🙏 Acknowledgements

- [MongoDB Atlas](https://mongodb.com/atlas) — Free cloud database
- [Render](https://render.com) — Free backend hosting
- [Vercel](https://vercel.com) — Free frontend hosting
- [Recharts](https://recharts.org) — Beautiful React charts
- [Material UI](https://mui.com) — Component library
- [React Hot Toast](https://react-hot-toast.com) — Toast notifications

---

<div align="center">

**Made with ❤️ by [Roshan850](https://github.com/Roshan850)**

⭐ **Star this repo if you found it helpful!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/Roshan850/attendance-analytics-platform?style=social)](https://github.com/Roshan850/attendance-analytics-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Roshan850/attendance-analytics-platform?style=social)](https://github.com/Roshan850/attendance-analytics-platform/network)

</div>
