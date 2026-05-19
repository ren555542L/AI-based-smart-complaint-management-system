import axios from "axios";

/**
 * Axios instance configured for the backend API.
 * In development: Vite proxy handles /api → http://localhost:5000/api
 * In production:  Set VITE_API_URL in frontend .env
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Request interceptor - attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// ─── Complaints API ───────────────────────────────────────────────────────────
export const complaintsAPI = {
  create: (data) => API.post("/complaints", data),
  getAll: (params) => API.get("/complaints", { params }),
  getById: (id) => API.get(`/complaints/${id}`),
  update: (id, data) => API.put(`/complaints/${id}`, data),
  delete: (id) => API.delete(`/complaints/${id}`),
  searchByLocation: (location) => API.get("/complaints/search", { params: { location } }),
  getByCategory: (category) => API.get(`/complaints/category/${category}`),
  getStats: () => API.get("/complaints/stats"),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  analyze: (data) => API.post("/ai/analyze", data),
};

export default API;
