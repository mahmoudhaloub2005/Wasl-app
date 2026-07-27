import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUserRole,
  setStoredUser,
  setStoredUserRole,
} from "../../utils/authStorage";

function unwrapUser(data) {
  return (
    data?.user ||
    data?.customer ||
    data?.provider ||
    data?.data?.user ||
    data?.data?.customer ||
    data?.data?.provider ||
    data?.data ||
    data ||
    null
  );
}

function getRoleFromResponse(data, user) {
  return String(
    user?.role ||
      user?.type ||
      user?.account_type ||
      user?.accountType ||
      data?.role ||
      data?.type ||
      data?.data?.role ||
      data?.data?.type ||
      getStoredUserRole() ||
      ""
  )
    .trim()
    .toLowerCase();
}

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const [status, setStatus] = useState(() =>
    getStoredToken() ? "checking" : "unauthenticated"
  );

  const [role, setRole] = useState(() =>
    String(getStoredUserRole() || "")
      .trim()
      .toLowerCase()
  );

  // تجاوز الحماية أثناء التطوير المحلي فقط
  const localBypass =
    import.meta.env.DEV &&
    import.meta.env.VITE_BYPASS_AUTH === "true";

  const demoPreviewBypass =
    import.meta.env.VITE_VERCEL_ENV === "preview" &&
    import.meta.env.VITE_VERCEL_GIT_COMMIT_REF === "frontend-demo" &&
    import.meta.env.VITE_DEMO_BYPASS === "true";

  const bypassAuth = localBypass || demoPreviewBypass;

  useEffect(() => {
    // لا نفحص التوكن ولا نتصل بالباك عند تفعيل التجاوز
    if (bypassAuth) {
      return undefined;
    }

    let isMounted = true;
    const token = getStoredToken();

    if (!token) {
      clearAuthStorage();

      if (isMounted) {
        setStatus("unauthenticated");
      }

      return () => {
        isMounted = false;
      };
    }

    async function verifyToken() {
      try {
        const data = await getCurrentUser();
        const user = unwrapUser(data);
        const nextRole = getRoleFromResponse(data, user);

        if (user) {
          setStoredUser(user);
        }

        if (nextRole) {
          setStoredUserRole(nextRole);
        }

        if (isMounted) {
          setRole(nextRole);
          setStatus("authenticated");
        }
      } catch {
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
  }, [bypassAuth]);

  // افتح الصفحة مباشرة عند تفعيل التجاوز
  if (bypassAuth) {
    return children;
  }

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

  if (
    allowedRoles?.length &&
    (!role || !allowedRoles.includes(role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;