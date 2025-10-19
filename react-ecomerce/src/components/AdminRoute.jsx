import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Kalau masih loading, jangan render apapun atau tampilkan spinner
  if (loading) return null; //pr load ada logo gitu 

  // jika blm login direct ke login
  if (!user) return <Navigate to="/login" replace />;

  // jika login bukan admin direct ke home 
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
