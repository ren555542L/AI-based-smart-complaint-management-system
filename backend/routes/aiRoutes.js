const express = require("express");
const router = express.Router();
const { analyzeComplaint } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// @route POST /api/ai/analyze  (Protected)
// @desc  Analyze a complaint using OpenRouter AI
router.post("/analyze", protect, analyzeComplaint);

module.exports = router;
