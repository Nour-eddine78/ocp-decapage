import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = ["Superadmin", "User"] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No token: Redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }



  // Authorized: Render children
  return children;
};

export default ProtectedRoute;