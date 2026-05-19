import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMapPin, FiTag, FiTrash2, FiEdit3, FiCpu, FiLoader, FiChevronDown } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import AIAnalysisResult from "./AIAnalysisResult";
import { complaintsAPI, aiAPI } from "../api/api";
import toast from "react-hot-toast";

/**
 * ComplaintCard - Displays a single complaint with actions.
 * Props:
 *   complaint - complaint object
 *   onDelete(id) - callback after deletion
 *   onStatusChange(id, status) - callback after status update
 */
export default function ComplaintCard({ complaint, onDelete, onStatusChange }) {
  const [showAI, setShowAI] = useState(false);
  const [aiData, setAiData] = useState(complaint.aiAnalysis?.priority ? complaint.aiAnalysis : null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const navigate = useNavigate();

  const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await complaintsAPI.delete(complaint._id);
      toast.success("Complaint deleted");
      onDelete && onDelete(complaint._id);
    } catch {
      toast.error("Failed to delete complaint");
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    setShowStatusMenu(false);
    try {
      await complaintsAPI.update(complaint._id, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      onStatusChange && onStatusChange(complaint._id, newStatus);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzingAI(true);
    setShowAI(true);
    try {
      const { data } = await aiAPI.analyze({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
      });
      const analysis = data.data;
      setAiData(analysis);
      // Persist analysis to complaint
      await complaintsAPI.update(complaint._id, { aiAnalysis: analysis });
      toast.success("AI analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
      setShowAI(false);
    } finally {
      setAnalyzingAI(false);
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4 hover:bg-white/10 transition-all duration-300 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{complaint.title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            By <span className="text-slate-300">{complaint.name}</span> · {complaint.email}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
        {complaint.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          <FiMapPin className="text-blue-400 w-3 h-3" />
          {complaint.location}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          <FiTag className="text-violet-400 w-3 h-3" />
          {complaint.category}
        </span>
        <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </span>
      </div>

      {/* AI Analysis Result (collapsible) */}
      {showAI && (
        <div>
          {analyzingAI ? (
            <div className="glass-card p-4 flex items-center gap-3">
              <FiLoader className="text-blue-400 animate-spin" />
              <p className="text-slate-400 text-sm">AI is analyzing the complaint...</p>
            </div>
          ) : (
            aiData && <AIAnalysisResult analysis={aiData} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/10 flex-wrap">
        {/* AI Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={analyzingAI}
          className="flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-lg border border-violet-500/20 transition-all duration-200 disabled:opacity-50"
        >
          {analyzingAI ? <FiLoader className="animate-spin w-3 h-3" /> : <FiCpu className="w-3 h-3" />}
          {aiData ? "Re-analyze" : "AI Analyze"}
        </button>

        {/* Show/Hide existing analysis */}
        {aiData && !analyzingAI && (
          <button
            onClick={() => setShowAI((p) => !p)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-all duration-200"
          >
            <FiChevronDown className={`w-3 h-3 transition-transform ${showAI ? "rotate-180" : ""}`} />
            {showAI ? "Hide" : "View"} Analysis
          </button>
        )}

        {/* Status Update */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowStatusMenu((p) => !p)}
            disabled={updatingStatus}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-200"
          >
            <FiEdit3 className="w-3 h-3" />
            {updatingStatus ? "Updating..." : "Status"}
            <FiChevronDown className="w-3 h-3" />
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 bottom-full mb-1 bg-dark-800 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden min-w-[140px]">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors ${
                    complaint.status === s ? "text-blue-400 font-semibold" : "text-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all duration-200"
        >
          <FiTrash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
