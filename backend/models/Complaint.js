const mongoose = require("mongoose");

/**
 * Complaint Schema for storing civic complaints.
 * Includes AI analysis fields populated after analysis.
 */
const complaintSchema = new mongoose.Schema(
  {
    // Submitted by user (can differ from logged-in user)
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    // AI Analysis fields - populated after AI analysis
    aiAnalysis: {
      priority: { type: String, default: null },
      department: { type: String, default: null },
      summary: { type: String, default: null },
      responseMessage: { type: String, default: null },
    },
    // Reference to the user who submitted the complaint
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient search queries
complaintSchema.index({ location: "text", title: "text", description: "text" });

module.exports = mongoose.model("Complaint", complaintSchema);
