const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Validation rules for signup
const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// @route POST /api/auth/signup
router.post("/signup", signupValidation, signup);

// @route POST /api/auth/login
router.post("/login", loginValidation, login);

// @route GET /api/auth/me  (Protected)
router.get("/me", protect, getMe);

module.exports = router;
