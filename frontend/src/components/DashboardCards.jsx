import { FiFileText, FiClock, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";

/**
 * DashboardCards - Displays complaint statistics in stat cards.
 * Props: stats { total, pending, inProgress, resolved, rejected }
 */
export default function DashboardCards({ stats }) {
  const cards = [
    {
      label: "Total Complaints",
      value: stats?.total ?? 0,
      icon: <FiFileText className="w-6 h-6" />,
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: <FiClock className="w-6 h-6" />,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: <FiRefreshCw className="w-6 h-6" />,
      gradient: "from-sky-500 to-blue-600",
      glow: "shadow-sky-500/30",
      bg: "bg-sky-500/10",
      text: "text-sky-400",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: <FiCheckCircle className="w-6 h-6" />,
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      icon: <FiXCircle className="w-6 h-6" />,
      gradient: "from-red-500 to-rose-600",
      glow: "shadow-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon, gradient, glow, bg, text }) => (
        <div
          key={label}
          className={`stat-card group hover:shadow-lg hover:${glow} transition-all duration-300`}
        >
          <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <p className={`text-3xl font-bold ${text} mt-1`}>{value}</p>
          <p className="text-slate-400 text-xs font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
