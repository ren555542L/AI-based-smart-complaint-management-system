import { useEffect, useState, useCallback } from "react";
import { complaintsAPI } from "../api/api";
import ComplaintCard from "../components/ComplaintCard";
import {
  FiSearch, FiFilter, FiRefreshCw, FiPlusCircle, FiInbox, FiLoader,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
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

const STATUS_FILTERS = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationSearch, setLocationSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (searchInput.trim()) {
        // Search by location
        const res = await complaintsAPI.searchByLocation(searchInput.trim());
        data = res.data.data;
      } else if (categoryFilter !== "All") {
        // Filter by category
        const res = await complaintsAPI.getByCategory(categoryFilter);
        data = res.data.data;
      } else {
        // Get all
        const res = await complaintsAPI.getAll();
        data = res.data.data;
      }
      setComplaints(data);
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [searchInput, categoryFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleDelete = (id) => {
    setComplaints((prev) => prev.filter((c) => c._id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
  };

  // Client-side status filter
  const filtered =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="page-title">All Complaints</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading..." : `${filtered.length} complaint${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <Link to="/complaints/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlusCircle className="w-4 h-4" />
          New Complaint
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* Location Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            id="location-search"
            type="text"
            placeholder="Search by location… (press Enter)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchComplaints()}
            className="form-input pl-10 text-sm"
          />
        </div>

        {/* Category Filter */}
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-input text-sm max-w-[180px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-slate-800">{c}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input text-sm max-w-[160px]"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s} className="bg-slate-800">{s}</option>
          ))}
        </select>

        {/* Refresh */}
        <button
          id="refresh-btn"
          onClick={() => { setSearchInput(""); setCategoryFilter("All"); setStatusFilter("All"); fetchComplaints(); }}
          className="btn-secondary flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Complaint List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <FiLoader className="text-blue-400 text-4xl animate-spin" />
          <p className="text-slate-400 text-sm">Loading complaints…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
            <FiInbox className="text-slate-500 text-2xl" />
          </div>
          <p className="text-white font-semibold">No complaints found</p>
          <p className="text-slate-400 text-sm">Try adjusting your filters or submit a new complaint.</p>
          <Link to="/complaints/new" className="btn-primary text-sm mt-2 flex items-center gap-2">
            <FiPlusCircle className="w-4 h-4" /> Submit Complaint
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
