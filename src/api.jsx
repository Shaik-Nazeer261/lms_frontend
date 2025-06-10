import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Change this if your backend is different
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Request Interceptor to attach Authorization Header
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to refresh the token if expired
api.interceptors.response.use(
  (response) => response, // If response is OK, return it
  async (error) => {
    const originalRequest = error.config;

    // If token is expired and we haven't retried yet
    if (
      error.response?.status === 401 &&
      error.response.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const refreshToken = localStorage.getItem("refresh");

        if (!refreshToken) {
          console.error("No refresh token found. User must log in again.");
          alert("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/"; // Redirect to login
          return Promise.reject(error);
        }

        // Request a new access token
        const { data } = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });

        // Save the new access token
        localStorage.setItem("access", data.access);
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
