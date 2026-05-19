import { FiClock, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";

/**
 * StatusBadge - Renders a styled badge for complaint status.
 * Props: status ("Pending" | "In Progress" | "Resolved" | "Rejected")
 */
export default function StatusBadge({ status }) {
  const config = {
    Pending: {
      className: "badge-pending",
      icon: <FiClock className="w-3 h-3" />,
    },
    "In Progress": {
      className: "badge-progress",
      icon: <FiRefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />,
    },
    Resolved: {
      className: "badge-resolved",
      icon: <FiCheckCircle className="w-3 h-3" />,
    },
    Rejected: {
      className: "badge-rejected",
      icon: <FiXCircle className="w-3 h-3" />,
    },
  };

  const { className, icon } = config[status] || config["Pending"];

  return (
    <span className={className}>
      {icon}
      {status}
    </span>
  );
}
