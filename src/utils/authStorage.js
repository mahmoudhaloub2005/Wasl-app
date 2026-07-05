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
