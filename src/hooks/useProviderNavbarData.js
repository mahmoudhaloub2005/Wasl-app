import { useEffect, useState } from "react";

import useProviderNotifications from "./useProviderNotifications";
import { AUTH_USER_UPDATED_EVENT } from "../utils/authStorage";
import { getProviderProfile } from "../utils/providerUserProfile";

export function useProviderNavbarData() {
  const [providerProfile, setProviderProfile] = useState(() => getProviderProfile());
  const { notifications, unreadCount } = useProviderNotifications();

  useEffect(() => {
    function refreshProviderProfile() {
      setProviderProfile(getProviderProfile());
    }

    window.addEventListener(AUTH_USER_UPDATED_EVENT, refreshProviderProfile);
    window.addEventListener("storage", refreshProviderProfile);

    return () => {
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, refreshProviderProfile);
      window.removeEventListener("storage", refreshProviderProfile);
    };
  }, []);

  return {
    notifications,
    providerProfile,
    unreadNotificationsCount: unreadCount,
  };
}

export default useProviderNavbarData;
