import { useCallback, useEffect, useState } from "react";

import {
  getProviderProfile,
  normalizeProviderProfile,
  saveProviderProfile,
} from "../services/providerProfileService";
import { getStoredUser } from "../utils/authStorage";

function getErrorMessage(error, fallback = "تعذر تحميل بيانات المزود.") {
  return error?.displayMessage || error?.message || fallback;
}

export function useProviderProfile() {
  const [profile, setProfile] = useState(() => normalizeProviderProfile(getStoredUser() || {}));
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadErrorMessage("");
      const nextProfile = await getProviderProfile();
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      setLoadErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshProfile().catch(() => {});
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshProfile]);

  const saveProfile = useCallback(
    async (values, options = {}) => {
      if (isUpdating) return profile;

      setIsUpdating(true);
      setUpdateErrorMessage("");

      try {
        const updatedProfile = await saveProviderProfile(values, options);
        const refreshedProfile = await refreshProfile().catch(() => updatedProfile);
        setProfile(refreshedProfile);
        return refreshedProfile;
      } catch (error) {
        const message = getErrorMessage(error, "تعذر حفظ بيانات المزود.");
        setUpdateErrorMessage(message);
        throw new Error(message, { cause: error });
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, profile, refreshProfile]
  );

  const clearUpdateError = useCallback(() => {
    setUpdateErrorMessage("");
  }, []);

  return {
    clearUpdateError,
    errorMessage: loadErrorMessage,
    isLoading,
    isUpdating,
    profile,
    refreshProfile,
    saveProfile,
    updateErrorMessage: updateErrorMessage || loadErrorMessage,
  };
}

export default useProviderProfile;


