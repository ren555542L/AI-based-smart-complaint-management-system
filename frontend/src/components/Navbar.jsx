import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome, FiList, FiPlusCircle, FiLogOut, FiLogIn, FiUser, FiCpu,
} from "react-icons/fi";
import toast from "react-hot-toast";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/complaints", label: "Complaints", icon: <FiList /> },
  { to: "/complaints/new", label: "Submit", icon: <FiPlusCircle /> },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-200">
              <FiCpu className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-base leading-tight">AI Complaint</p>
              <p className="text-blue-400 text-xs leading-tight">Management System</p>
            </div>
          </Link>

          {/* Nav Links - center */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <FiUser className="text-blue-400" />
                  <span className="text-slate-300 font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/30 transition-all duration-200"
                >
                  <FiLogOut />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                  <FiLogIn />
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {isAuthenticated && (
          <div className="md:hidden flex gap-1 pb-3">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
