const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

/**
 * Generate a JWT token for a given user ID.
 * Token expires in 7 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in user profile
 * @access  Protected
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, login, getMe };
