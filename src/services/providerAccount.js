import { getStoredUser, getStoredUserIdentifier } from "../utils/authStorage";

export function getCurrentProviderAccountKey() {
  const user = getStoredUser();

  return (
    getStoredUserIdentifier(user) ||
    user?.provider_id ||
    user?.providerId ||
    user?.email ||
    "anonymous-provider"
  );
}
