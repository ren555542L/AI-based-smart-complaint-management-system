const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS - allow requests from frontend URL
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Complaint Management System API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Complaint routes
app.use("/api/complaints", require("./routes/complaintRoutes"));

// AI Analysis routes
app.use("/api/ai", require("./routes/aiRoutes"));

// ─── Error Handling ───────────────────────────────────────────────────────────

// Handle undefined routes (404)
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
