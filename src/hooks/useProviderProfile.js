import { useCallback, useEffect, useState } from "react";

import {
  getMyProviderProfile,
  normalizeProviderProfile,
} from "../services/providerProfileService";
import { getApiErrorMessage } from "../utils/apiError";
import { getStoredUser } from "../utils/authStorage";

const PROFILE_ERROR_MESSAGE =
  "تعذر تحميل بيانات المزود، يرجى المحاولة مرة أخرى.";

const defaultProviderProfileService = {
  getMyProviderProfile,
};

function getErrorMessage(error) {
  const apiMessage = getApiErrorMessage(error, PROFILE_ERROR_MESSAGE);

  if (apiMessage === PROFILE_ERROR_MESSAGE) {
    return apiMessage;
  }

  return PROFILE_ERROR_MESSAGE;
}

export function useProviderProfile(
  profileService = defaultProviderProfileService
) {
  const [profile, setProfile] = useState(() =>
    normalizeProviderProfile(getStoredUser())
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextProfile = await profileService.getMyProviderProfile();

      setProfile(nextProfile);
    } catch (error) {
      const fallbackProfile = normalizeProviderProfile(getStoredUser());

      setProfile(fallbackProfile);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [profileService]);

  useEffect(() => {
    let isMounted = true;

    async function loadMountedProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextProfile = await profileService.getMyProviderProfile();

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch (error) {
        if (isMounted) {
          setProfile(normalizeProviderProfile(getStoredUser()));
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMountedProfile();

    return () => {
      isMounted = false;
    };
  }, [profileService]);

  return {
    errorMessage,
    isLoading,
    profile,
    retry: loadProfile,
  };
}

export default useProviderProfile;
