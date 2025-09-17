import axios from "axios";

// Detect subdomain from browser
const hostnameParts = window.location.hostname.split('.');
let subdomain = null;

// Localhost subdomains: company1.localhost:5173
if (hostnameParts.includes("localhost")) {
  if (hostnameParts.length === 2) {
    subdomain = hostnameParts[0]; // company1
  }
} else if (hostnameParts.length > 2) {
  // Production: company1.galearninghub.in
  subdomain = hostnameParts[0];
}

// Construct baseURL dynamically
let baseURL = import.meta.env.VITE_BACKEND_URL; // default for localhost

if (subdomain && !window.location.hostname.includes("localhost")) {
  // Production subdomain
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN; // galearninghub.in
  baseURL = `https://${subdomain}.${baseDomain}/api`;
}

const api = axios.create({ baseURL });

// Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
