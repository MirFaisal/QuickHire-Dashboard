import axios from "axios";
import store from "../store/store";
import { LOGOUT } from "../store/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (!isLoginRequest && error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      store.dispatch({ type: LOGOUT });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
