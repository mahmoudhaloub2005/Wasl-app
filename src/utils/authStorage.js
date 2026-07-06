export function getStoredToken() {
  return (
    localStorage.getItem("wasel_token") ||
    sessionStorage.getItem("wasel_token")
  );
}

export function getStoredUserRole() {
  return (
    localStorage.getItem("wasel_user_role") ||
    sessionStorage.getItem("wasel_user_role")
  );
}

export function getStoredUser() {
  const storedUser =
    localStorage.getItem("wasel_user") || sessionStorage.getItem("wasel_user");

  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    return (
      parsedUser?.user ||
      parsedUser?.customer ||
      parsedUser?.provider ||
      parsedUser?.data?.user ||
      parsedUser?.data?.customer ||
      parsedUser
    );
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
}

export function getUserDisplayName(user = getStoredUser()) {
  const firstName = user?.first_name || user?.firstName;
  const lastName = user?.last_name || user?.lastName;
  const fullName =
    user?.full_name ||
    user?.fullName ||
    user?.name ||
    [firstName, lastName].filter(Boolean).join(" ");

  return String(fullName || firstName || "مستخدم").trim();
}

export function getUserProfile(user = getStoredUser()) {
  return {
    fullName: getUserDisplayName(user),
    email: user?.email || "",
    phone: user?.phone || user?.mobile || "",
    address: user?.address || user?.area?.name || user?.area || "",
  };
}

export function clearAuthStorage() {
  localStorage.removeItem("wasel_token");
  localStorage.removeItem("wasel_is_logged_in");
  localStorage.removeItem("wasel_user");
  localStorage.removeItem("wasel_user_role");
  sessionStorage.removeItem("wasel_token");
  sessionStorage.removeItem("wasel_is_logged_in");
  sessionStorage.removeItem("wasel_user");
  sessionStorage.removeItem("wasel_user_role");
}
