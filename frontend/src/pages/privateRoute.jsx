import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuthenticated");
  const expireAt = localStorage.getItem("adminTokenExpireAt");

  const currentTime = new Date().getTime();
  const isExpired = !expireAt || currentTime > parseInt(expireAt);

  if (!isAuthenticated || isExpired) {
    // clear expired values
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminTokenExpireAt");
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute;

