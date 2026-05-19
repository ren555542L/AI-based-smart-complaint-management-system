import {
  FiAlertTriangle, FiZap, FiFileText, FiMessageSquare,
  FiCpu, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { useState } from "react";

/**
 * AIAnalysisResult - Displays the AI analysis result for a complaint.
 * Props: analysis { priority, department, summary, responseMessage }
 */
export default function AIAnalysisResult({ analysis }) {
  const [expanded, setExpanded] = useState(true);

  if (!analysis || !analysis.priority) return null;

  const priorityClass = {
    High: "priority-high",
    Medium: "priority-medium",
    Low: "priority-low",
  }[analysis.priority] || "priority-low";

  const priorityGlow = {
    High: "shadow-red-500/20 border-red-500/30",
    Medium: "shadow-amber-500/20 border-amber-500/30",
    Low: "shadow-emerald-500/20 border-emerald-500/30",
  }[analysis.priority] || "";

  return (
    <div className={`glass-card border shadow-lg ${priorityGlow} animate-fade-in`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiCpu className="text-white text-base" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Analysis Result</p>
            <p className="text-slate-400 text-xs">OpenRouter powered analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={priorityClass}>
            <FiAlertTriangle className="w-3 h-3" />
            {analysis.priority} Priority
          </span>
          {expanded ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-4 animate-slide-up">
          {/* Department & Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FiZap className="text-blue-400" /> Department
              </p>
              <p className="text-blue-400 font-semibold">{analysis.department}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FiAlertTriangle className="text-amber-400" /> Priority
              </p>
              <span className={priorityClass}>{analysis.priority}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FiFileText className="text-violet-400" /> AI Summary
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Response Message */}
          <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FiMessageSquare /> Auto-Generated Response
            </p>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{analysis.responseMessage}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
