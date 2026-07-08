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

function normalizeUserIdentifier(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value).trim().toLowerCase();
}

export function getStoredUserIdentifiers(user = getStoredUser()) {
  const identifiers = [
    user?.id,
    user?._id,
    user?.uuid,
    user?.user_id,
    user?.userId,
    user?.customer_id,
    user?.customerId,
    user?.email,
    user?.phone,
    user?.mobile,
  ]
    .map(normalizeUserIdentifier)
    .filter(Boolean);

  return [...new Set(identifiers)];
}

export function getStoredUserIdentifier(user = getStoredUser()) {
  return getStoredUserIdentifiers(user)[0] || "";
}

export function getScopedStorageKey(baseKey, user = getStoredUser()) {
  const userIdentifier = getStoredUserIdentifier(user);

  if (!userIdentifier) return "";

  return `${baseKey}_${encodeURIComponent(userIdentifier)}`;
}

function normalizeAvatarSource(value) {
  if (!value) return "";

  if (typeof value === "object") {
    return normalizeAvatarSource(
      value.url ||
        value.src ||
        value.path ||
        value.avatar_url ||
        value.avatarUrl ||
        value.profile_image ||
        value.profileImage
    );
  }

  const source = String(value).trim();

  if (!source) return "";

  if (/^(data:|blob:|https?:\/\/)/i.test(source)) {
    return source;
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_URL ||
    "https://wasel-api-production-0719.up.railway.app/api";
  const assetBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

  if (source.startsWith("/")) {
    return `${assetBaseUrl}${source}`;
  }

  if (/^(storage|uploads|avatars|profile-images|profile_images)\//i.test(source)) {
    return `${assetBaseUrl}/${source}`;
  }

  return source;
}

export function getUserAvatarUrl(user = getStoredUser()) {
  return normalizeAvatarSource(
    user?.avatar_url ||
      user?.avatarUrl ||
      user?.avatar ||
      user?.profile_image_url ||
      user?.profileImageUrl ||
      user?.profile_image ||
      user?.profileImage ||
      user?.image_url ||
      user?.imageUrl ||
      user?.image ||
      user?.photo ||
      user?.picture ||
      user?.profile?.avatar_url ||
      user?.profile?.avatarUrl ||
      user?.profile?.avatar ||
      user?.profile?.profile_image ||
      user?.profile?.profileImage
  );
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

export function getUserInitial(user = getStoredUser(), fallbackName = "") {
  const displayName = String(fallbackName || getUserDisplayName(user)).trim();
  const [firstCharacter] = Array.from(displayName);

  return firstCharacter || "?";
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
  localStorage.removeItem("customer_latest_subscription");
  localStorage.removeItem("wasel_profile_avatar");
  localStorage.removeItem("profileImage");
  localStorage.removeItem("avatar");
  localStorage.removeItem("userImage");
  localStorage.removeItem("wasel_token");
  localStorage.removeItem("wasel_is_logged_in");
  localStorage.removeItem("wasel_user");
  localStorage.removeItem("wasel_user_role");
  sessionStorage.removeItem("wasel_profile_avatar");
  sessionStorage.removeItem("profileImage");
  sessionStorage.removeItem("avatar");
  sessionStorage.removeItem("userImage");
  sessionStorage.removeItem("wasel_token");
  sessionStorage.removeItem("wasel_is_logged_in");
  sessionStorage.removeItem("wasel_user");
  sessionStorage.removeItem("wasel_user_role");
}
