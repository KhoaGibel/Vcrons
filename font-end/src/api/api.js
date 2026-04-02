import axios from "axios";

// Instance Axios dùng chung cho toàn bộ frontend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────
// Tự động gắn token vào header mỗi lần gọi API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────
// Tự động logout nếu token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ─── PRODUCTS ─────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),  // params: { category, search, page }
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),         // Admin
  update: (id, data) => api.put(`/products/${id}`, data),// Admin
  delete: (id) => api.delete(`/products/${id}`),         // Admin
};

// ─── ORDERS ───────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.patch(`/orders/${id}/cancel`, { cancelReason: reason }),
  // Admin
  getAll: (params) => api.get("/orders", { params }),    // params: { status, page }
  updateStatus: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// ─── USERS ────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
  // Admin
  getAll: (params) => api.get("/users", { params }),
  update: (id, data) => api.put(`/users/${id}`, data),   // Đổi role/status
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;