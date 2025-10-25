import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isHomeRoute = location.pathname === "/";
    if (!isAdminRoute && !isHomeRoute) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
