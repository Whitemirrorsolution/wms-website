import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const expireAt = localStorage.getItem("adminTokenExpire");

  const currentTime = new Date().getTime();
  const isExpired = !expireAt || currentTime > parseInt(expireAt);

  if (!token || isExpired) {
    // Clear expired/stale token
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpire");
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;

