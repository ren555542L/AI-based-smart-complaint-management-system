const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
  getByCategory,
  getStats,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

// Validation rules for creating a complaint
const complaintValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
];

// IMPORTANT: Specific routes must come BEFORE parameterized routes (:id)

// @route GET /api/complaints/stats
router.get("/stats", protect, getStats);

// @route GET /api/complaints/search?location=Ghaziabad
router.get("/search", protect, searchByLocation);

// @route GET /api/complaints/category/:category
router.get("/category/:category", protect, getByCategory);

// @route POST /api/complaints
router.post("/", protect, complaintValidation, createComplaint);

// @route GET /api/complaints
router.get("/", protect, getAllComplaints);

// @route GET /api/complaints/:id
router.get("/:id", protect, getComplaintById);

// @route PUT /api/complaints/:id
router.put("/:id", protect, updateComplaint);

// @route DELETE /api/complaints/:id
router.delete("/:id", protect, deleteComplaint);

module.exports = router;
