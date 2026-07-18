import {
  getStoredUser,
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitial,
} from "./authStorage";

const FALLBACK_PROVIDER_NAME = "مزود الخدمة";

function getFirstNonEmptyValue(values) {
  return values.find((value) => String(value || "").trim()) || "";
}

export function getProviderDisplayName(user = getStoredUser()) {
  if (!user) {
    return FALLBACK_PROVIDER_NAME;
  }

  const firstName = getFirstNonEmptyValue([
    user?.first_name,
    user?.firstName,
    user?.provider?.first_name,
    user?.provider?.firstName,
  ]);
  const lastName = getFirstNonEmptyValue([
    user?.last_name,
    user?.lastName,
    user?.provider?.last_name,
    user?.provider?.lastName,
  ]);
  const fullName = getFirstNonEmptyValue([
    user?.full_name,
    user?.fullName,
    user?.name,
    user?.username,
    user?.provider_name,
    user?.providerName,
    user?.company_name,
    user?.companyName,
    user?.provider?.full_name,
    user?.provider?.fullName,
    user?.provider?.name,
    user?.provider?.username,
    [firstName, lastName].filter(Boolean).join(" "),
    getUserDisplayName(user),
  ]);

  return String(fullName || FALLBACK_PROVIDER_NAME).trim();
}

export function getProviderFirstName(user = getStoredUser()) {
  const firstName = getFirstNonEmptyValue([
    user?.first_name,
    user?.firstName,
    user?.provider?.first_name,
    user?.provider?.firstName,
  ]);

  if (firstName) return String(firstName).trim();

  const [namePart] = getProviderDisplayName(user).split(/\s+/);
  return namePart || FALLBACK_PROVIDER_NAME;
}

export function getProviderProfile(user = getStoredUser()) {
  const displayName = getProviderDisplayName(user);
  const firstName = getProviderFirstName(user);

  return {
    displayName,
    firstName,
    email: user?.email || user?.provider?.email || "",
    avatarUrl: getUserAvatarUrl(user),
    initial: getUserInitial(user, displayName),
  };
}
