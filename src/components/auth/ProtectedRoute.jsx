import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUserRole } from "../../utils/authStorage";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = getStoredToken();
  const role = getStoredUserRole();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
