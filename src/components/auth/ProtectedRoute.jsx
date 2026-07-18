import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUserRole,
} from "../../utils/authStorage";

const DEV_PROVIDER_USER = {
  id: "dev-provider",
  name: "مزود خدمة تجريبي",
  role: "provider",
};

function isProviderAuthBypassEnabled(allowedRoles, pathname) {
  return (
    import.meta.env.DEV === true &&
    import.meta.env.VITE_PROVIDER_AUTH_BYPASS === "true" &&
    pathname.startsWith("/provider") &&
    allowedRoles?.includes("provider")
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isDevProviderAuthBypassEnabled = isProviderAuthBypassEnabled(
    allowedRoles,
    location.pathname
  );
  const [status, setStatus] = useState(
    isDevProviderAuthBypassEnabled ? "authenticated" : "checking"
  );
  const [role, setRole] = useState(
    isDevProviderAuthBypassEnabled ? DEV_PROVIDER_USER.role : getStoredUserRole()
  );

  useEffect(() => {
    let isMounted = true;

    if (isDevProviderAuthBypassEnabled) {
      // TODO: Remove development auth bypass when backend is available
      localStorage.setItem("wasel_is_logged_in", "true");
      localStorage.setItem("wasel_user_role", DEV_PROVIDER_USER.role);
      localStorage.setItem("wasel_user", JSON.stringify(DEV_PROVIDER_USER));

      if (isMounted) {
        setRole(DEV_PROVIDER_USER.role);
        setStatus("authenticated");
      }

      return () => {
        isMounted = false;
      };
    }

    const token = getStoredToken();

    if (!token) {
      clearAuthStorage();
      const timeoutId = window.setTimeout(() => {
        if (isMounted) {
          setStatus("unauthenticated");
        }
      }, 0);

      return () => {
        isMounted = false;
        window.clearTimeout(timeoutId);
      };
    }

    async function verifyToken() {
      try {
        const data = await getCurrentUser();
        const user =
          data.user ||
          data.customer ||
          data.provider ||
          data.data?.user ||
          data.data?.customer ||
          data.data ||
          data;
        const nextRole = String(
          user?.role ||
            user?.type ||
            data.role ||
            data.type ||
            getStoredUserRole() ||
            ""
        ).toLowerCase();

        if (nextRole) {
          localStorage.setItem("wasel_user_role", nextRole);
        }

        if (user) {
          localStorage.setItem("wasel_user", JSON.stringify(user));
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
  }, [isDevProviderAuthBypassEnabled]);

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
