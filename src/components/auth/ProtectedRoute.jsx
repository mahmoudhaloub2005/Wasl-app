import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUserRole,
} from "../../utils/authStorage";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  const [role, setRole] = useState(getStoredUserRole());

  useEffect(() => {
    let isMounted = true;
    const token = getStoredToken();

    if (!token) {
      clearAuthStorage();
      setStatus("unauthenticated");
      return;
    }

    async function verifyToken() {
      try {
        const data = await getCurrentUser();
        const user = data.user || data.data || data;
        const nextRole = String(
          user?.role || user?.type || data.role || data.type || role || ""
        ).toLowerCase();

        if (nextRole) {
          localStorage.setItem("wasel_user_role", nextRole);
        }

        if (isMounted) {
          setRole(nextRole);
          setStatus("authenticated");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        clearAuthStorage();

        if (isMounted) {
          setStatus("unauthenticated");
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <main dir="rtl" style={{ padding: "48px", textAlign: "center" }}>
        جاري التحقق من الجلسة...
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
