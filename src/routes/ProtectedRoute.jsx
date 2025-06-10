// ProtectedRoute.jsx placeholder
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Helper to check if the token is valid
const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Wrapper component for protected routes
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/student/login" replace />;
};

export default ProtectedRoute;
