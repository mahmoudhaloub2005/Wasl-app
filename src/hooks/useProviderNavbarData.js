import { useEffect, useMemo, useState } from "react";

import providerDashboardService from "../services/providerDashboardService";
import { getProviderProfile } from "../utils/providerUserProfile";

function getUnreadNotificationsCount(notifications) {
  return notifications.filter((notification) => !notification.isRead).length;
}

export function useProviderNavbarData(
  dashboardService = providerDashboardService
) {
  const [providerProfile] = useState(() => getProviderProfile());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        const nextNotifications =
          await dashboardService.getProviderNotifications();

        if (isMounted) {
          setNotifications(nextNotifications);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [dashboardService]);

  const unreadNotificationsCount = useMemo(
    () => getUnreadNotificationsCount(notifications),
    [notifications]
  );

  return {
    notifications,
    providerProfile,
    unreadNotificationsCount,
  };
}

export default useProviderNavbarData;
