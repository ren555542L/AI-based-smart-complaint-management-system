const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");

/**
 * @route   POST /api/complaints
 * @desc    Submit a new complaint
 * @access  Protected
 */
const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, title, description, category, location } = req.body;

  try {
    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      submittedBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while creating complaint" });
  }
};

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (with optional pagination)
 * @access  Protected
 */
const getAllComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments();

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: complaints,
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while fetching complaints" });
  }
};

/**
 * @route   GET /api/complaints/:id
 * @desc    Get a single complaint by ID
 * @access  Protected
 */
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @route   PUT /api/complaints/:id
 * @desc    Update complaint status or fields
 * @access  Protected
 */
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    // Allow updating status, and optionally other fields
    const allowedUpdates = ["status", "title", "description", "category", "location", "aiAnalysis"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while updating complaint" });
  }
};

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a complaint by ID
 * @access  Protected
 */
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while deleting complaint" });
  }
};

/**
 * @route   GET /api/complaints/search?location=Ghaziabad
 * @desc    Search complaints by location (case-insensitive)
 * @access  Protected
 */
const searchByLocation = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ success: false, message: "Location query parameter is required" });
  }

  try {
    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during search" });
  }
};

/**
 * @route   GET /api/complaints/category/:category
 * @desc    Filter complaints by category
 * @access  Protected
 */
const getByCategory = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      category: { $regex: req.params.category, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Filter by Category Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while filtering by category" });
  }
};

/**
 * @route   GET /api/complaints/stats
 * @desc    Get complaint statistics for dashboard
 * @access  Protected
 */
const getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const rejected = await Complaint.countDocuments({ status: "Rejected" });

    res.status(200).json({
      success: true,
      data: { total, pending, inProgress, resolved, rejected },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
  getByCategory,
  getStats,
};
