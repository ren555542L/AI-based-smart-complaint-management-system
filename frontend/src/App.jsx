import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintList from "./pages/ComplaintList";

/**
 * ProtectedRoute - Redirects to /login if user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * GuestRoute - Redirects to /dashboard if already logged in.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><ComplaintList /></ProtectedRoute>} />
          <Route path="/complaints/new" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <p className="text-6xl font-bold text-white/10">404</p>
              <p className="text-white font-semibold text-xl">Page not found</p>
              <a href="/" className="btn-primary text-sm">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
