import { useState } from "react";

import useProviderNotifications from "./useProviderNotifications";
import { getProviderProfile } from "../utils/providerUserProfile";

export function useProviderNavbarData() {
  const [providerProfile] = useState(() => getProviderProfile());
  const { notifications, unreadCount } = useProviderNotifications();

  return {
    notifications,
    providerProfile,
    unreadNotificationsCount: unreadCount,
  };
}

export default useProviderNavbarData;