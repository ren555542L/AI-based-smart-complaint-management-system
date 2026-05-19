import { useEffect, useState } from "react";
import { complaintsAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import DashboardCards from "../components/DashboardCards";
import ComplaintCard from "../components/ComplaintCard";
import {
  FiCpu, FiList, FiPlusCircle, FiTrendingUp, FiLoader,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await complaintsAPI.getStats();
        setStats(data.data);
      } catch {
        toast.error("Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const { data } = await complaintsAPI.getAll({ limit: 4 });
        setRecent(data.data);
      } catch {
        // silent fail
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  const handleDelete = (id) => setRecent((p) => p.filter((c) => c._id !== id));
  const handleStatusChange = (id, newStatus) =>
    setRecent((p) => p.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative glass-card p-8 mb-8 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FiCpu className="text-white text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Welcome back,</p>
                <h1 className="text-white font-bold text-xl">{user?.name} 👋</h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Manage civic complaints, track statuses, and leverage AI to prioritize and route issues efficiently.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 min-w-[160px]">
            <Link
              to="/complaints/new"
              className="btn-primary flex items-center gap-2 text-sm justify-center"
            >
              <FiPlusCircle className="w-4 h-4" />
              New Complaint
            </Link>
            <Link
              to="/complaints"
              className="btn-secondary flex items-center gap-2 text-sm justify-center"
            >
              <FiList className="w-4 h-4" />
              All Complaints
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-blue-400" />
          <h2 className="text-white font-semibold">Overview</h2>
        </div>
        {loadingStats ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <FiLoader className="text-blue-400 animate-spin" />
            <span className="text-slate-400 text-sm">Loading statistics…</span>
          </div>
        ) : (
          <DashboardCards stats={stats} />
        )}
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiList className="text-blue-400" />
            <h2 className="text-white font-semibold">Recent Complaints</h2>
          </div>
          <Link
            to="/complaints"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {loadingRecent ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <FiLoader className="text-blue-400 animate-spin" />
            <span className="text-slate-400 text-sm">Loading complaints…</span>
          </div>
        ) : recent.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-slate-400 text-sm">No complaints submitted yet.</p>
            <Link to="/complaints/new" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
              <FiPlusCircle className="w-4 h-4" /> Submit First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recent.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
