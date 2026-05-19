import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaintsAPI } from "../api/api";
import {
  FiUser, FiMail, FiFileText, FiAlignLeft, FiTag, FiMapPin, FiSend, FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Road & Infrastructure",
  "Street Lighting",
  "Drainage",
  "Garbage Collection",
  "Noise Pollution",
  "Parks & Recreation",
  "General",
];

export default function ComplaintForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, title, description, category, location } = form;
    if (!name || !email || !title || !description || !category || !location) {
      return toast.error("Please fill in all required fields");
    }
    if (description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters");
    }
    setLoading(true);
    try {
      await complaintsAPI.create(form);
      setSubmitted(true);
      toast.success("Complaint submitted successfully!");
      setTimeout(() => navigate("/complaints"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-emerald-500/30">
            <FiCheckCircle className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complaint Submitted!</h2>
          <p className="text-slate-400 text-sm">
            Your complaint has been received and will be reviewed shortly. Redirecting to complaints list…
          </p>
          <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 animate-[shrink_2.5s_linear]" style={{ animation: "progress 2.5s linear forwards" }} />
          </div>
        </div>
        <style>{`@keyframes progress { from { width: 100% } to { width: 0 } }`}</style>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title">Submit a Complaint</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Fill in the form below to register your civic complaint. All fields are required.
        </p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cf-name" className="form-label">
                <FiUser className="inline mr-1.5 text-blue-400" />Full Name
              </label>
              <input
                id="cf-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="cf-email" className="form-label">
                <FiMail className="inline mr-1.5 text-blue-400" />Email Address
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@gmail.com"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="cf-title" className="form-label">
              <FiFileText className="inline mr-1.5 text-blue-400" />Complaint Title
            </label>
            <input
              id="cf-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Water Leakage Issue near Market"
              className="form-input"
              required
            />
          </div>

          {/* Category & Location row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cf-category" className="form-label">
                <FiTag className="inline mr-1.5 text-violet-400" />Category
              </label>
              <select
                id="cf-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-800">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cf-location" className="form-label">
                <FiMapPin className="inline mr-1.5 text-violet-400" />Location
              </label>
              <input
                id="cf-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Ghaziabad, Sector 10"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cf-description" className="form-label">
              <FiAlignLeft className="inline mr-1.5 text-blue-400" />Description
            </label>
            <textarea
              id="cf-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the issue in detail (minimum 10 characters)..."
              className="form-input resize-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {form.description.length} characters
            </p>
          </div>

          {/* Submit button */}
          <button
            id="complaint-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <FiSend className="w-4 h-4" />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
