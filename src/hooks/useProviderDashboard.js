import { useCallback, useEffect, useMemo, useState } from "react";

import providerDashboardService from "../services/providerDashboardService";
import { subscribeProviderDemoStore } from "../services/providerDemoStore";
import {
  providerDashboardCopy,
  providerQuickActions,
  providerStatCardsConfig,
  providerWorkingHourPeriods,
} from "../data/providerDashboardData";
import { getProviderProfile } from "../utils/providerUserProfile";

const INITIAL_ACTIVITY_LIMIT = 3;

const initialDashboardState = {
  summary: null,
  activities: [],
  generatorsUsage: [],
  notifications: [],
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatSignedNumber(value, suffix = "") {
  if (value === null || value === undefined) return "";

  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";
  return `${sign}${formatNumber(numericValue)}${suffix}`;
}

function buildSummaryCards(summary) {
  if (!summary) return [];

  const values = {
    monthlyIncome: formatNumber(summary.monthlyIncome),
    activeSubscribers: formatNumber(summary.activeSubscribers),
    newSubscriptionRequests: formatNumber(summary.newSubscriptionRequests),
    monthlyIncomeChangeLabel:
      summary.monthlyIncomeChange === null
        ? ""
        : formatSignedNumber(summary.monthlyIncomeChange, "%"),
    newSubscribersLabel:
      summary.newSubscribers > 0
        ? `${formatSignedNumber(summary.newSubscribers)} جديد`
        : "",
    newSubscriptionRequestsLabel: summary.hasUrgentSubscriptionRequests
      ? "عاجل"
      : "",
  };

  return providerStatCardsConfig.map((card) => ({
    ...card,
    value: values[card.valueKey],
    badge: values[card.badgeKey],
  }));
}

function buildActivities(activities) {
  return activities.map((activity) => ({
    ...activity,
    path: activity.path || `/provider/activities/${activity.id}`,
  }));
}

function buildGeneratorsUsage(generators) {
  return generators.map((generator) => ({
    ...generator,
    path: generator.path || `/provider/generators/${generator.id}`,
  }));
}

function getUnreadNotificationsCount(notifications) {
  return notifications.filter((notification) => !notification.isRead).length;
}

function getErrorMessage(error) {
  return error?.message || providerDashboardCopy.errorMessage;
}

export function useProviderDashboard(
  dashboardService = providerDashboardService
) {
  const [activeChartPeriod, setActiveChartPeriod] = useState("weekly");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialDashboardState);
  const [workingHours, setWorkingHours] = useState(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [isWorkingHoursLoading, setIsWorkingHoursLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [workingHoursErrorMessage, setWorkingHoursErrorMessage] = useState("");
  const [providerProfile] = useState(() => getProviderProfile());
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    return subscribeProviderDemoStore(() => {
      setStoreVersion((currentVersion) => currentVersion + 1);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsDashboardLoading(true);
        setErrorMessage("");

        const [summary, activities, generatorsUsage, notifications] =
          await Promise.all([
            dashboardService.getProviderDashboardSummary(),
            dashboardService.getProviderActivities(),
            dashboardService.getProviderGeneratorsUsage(),
            dashboardService.getProviderNotifications(),
          ]);

        if (isMounted) {
          setDashboardData({
            summary,
            activities,
            generatorsUsage,
            notifications,
          });
        }
      } catch (error) {
        if (isMounted) {
          setDashboardData(initialDashboardState);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [dashboardService, storeVersion]);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkingHours() {
      try {
        setIsWorkingHoursLoading(true);
        setWorkingHoursErrorMessage("");

        const nextWorkingHours =
          await dashboardService.getProviderWorkingHours(activeChartPeriod);

        if (isMounted) {
          setWorkingHours(nextWorkingHours);
        }
      } catch (error) {
        if (isMounted) {
          setWorkingHours(null);
          setWorkingHoursErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsWorkingHoursLoading(false);
        }
      }
    }

    loadWorkingHours();

    return () => {
      isMounted = false;
    };
  }, [activeChartPeriod, dashboardService]);

  const stats = useMemo(
    () => buildSummaryCards(dashboardData.summary),
    [dashboardData.summary]
  );

  const activities = useMemo(
    () => buildActivities(dashboardData.activities),
    [dashboardData.activities]
  );

  const visibleActivities = useMemo(() => {
    if (showAllActivities) return activities;
    return activities.slice(0, INITIAL_ACTIVITY_LIMIT);
  }, [activities, showAllActivities]);

  const generatorsUsage = useMemo(
    () => buildGeneratorsUsage(dashboardData.generatorsUsage),
    [dashboardData.generatorsUsage]
  );

  const unreadNotificationsCount = useMemo(
    () => getUnreadNotificationsCount(dashboardData.notifications),
    [dashboardData.notifications]
  );

  const addFrontendNotification = useCallback((notification) => {
    setDashboardData((currentData) => ({
      ...currentData,
      notifications: [notification, ...currentData.notifications],
    }));
  }, []);

  return {
    activeChartPeriod,
    addFrontendNotification,
    activities: visibleActivities,
    chartPeriods: providerWorkingHourPeriods,
    dashboardCopy: providerDashboardCopy,
    errorMessage,
    generatorsUsage,
    isDashboardLoading,
    isWorkingHoursLoading,
    notifications: dashboardData.notifications,
    providerProfile,
    quickActions: providerQuickActions,
    setActiveChartPeriod,
    setShowAllActivities,
    showAllActivities,
    stats,
    unreadNotificationsCount,
    workingHours,
    workingHoursErrorMessage,
  };
}

export default useProviderDashboard;
