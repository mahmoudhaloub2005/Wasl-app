import { useCallback, useState } from "react";

import { normalizeProviderProfile } from "../services/providerProfileService";
import { getStoredUser } from "../utils/authStorage";

export function useProviderProfile() {
  const [profile] = useState(() => normalizeProviderProfile(getStoredUser()));
  const retry = useCallback(() => false, []);

  return {
    errorMessage: "",
    isLoading: false,
    profile,
    retry,
  };
}

export default useProviderProfile;