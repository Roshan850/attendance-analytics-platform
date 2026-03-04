const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  register, login, getMe, updateProfile, changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ── Validation Rules ──────────────────────────────────────────────
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 characters"),
  body("role").isIn(["student", "faculty"]).withMessage("Role must be student or faculty"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
];

// ── Routes ────────────────────────────────────────────────────────
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;