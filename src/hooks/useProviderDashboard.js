import { useCallback, useEffect, useMemo, useState } from "react";

import {
  providerDashboardCopy,
  providerQuickActions,
  providerStatCardsConfig,
  providerWorkingHourPeriods,
} from "../data/providerDashboardData";
import providerDashboardService from "../services/providerDashboardService";
import { AUTH_USER_UPDATED_EVENT } from "../utils/authStorage";
import { getProviderProfile } from "../utils/providerUserProfile";
import useProviderNotifications from "./useProviderNotifications";

const INITIAL_ACTIVITY_LIMIT = 3;

const emptySummary = {
  activeSubscribers: 0,
  hasUrgentSubscriptionRequests: false,
  monthlyIncome: 0,
  monthlyIncomeChange: null,
  newSubscribers: 0,
  newSubscriptionRequests: 0,
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

function getErrorMessage(error, fallback = providerDashboardCopy.errorMessage) {
  return error?.displayMessage || error?.message || fallback;
}

export function useProviderDashboard() {
  const [activeChartPeriod, setActiveChartPeriod] = useState("weekly");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [summary, setSummary] = useState(emptySummary);
  const [activitiesData, setActivitiesData] = useState([]);
  const [generatorsUsageData, setGeneratorsUsageData] = useState([]);
  const [workingHours, setWorkingHours] = useState({ period: "weekly", points: [] });
  const [providerProfile, setProviderProfile] = useState(() => getProviderProfile());
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [isWorkingHoursLoading, setIsWorkingHoursLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [workingHoursErrorMessage, setWorkingHoursErrorMessage] = useState("");
  const { notifications, unreadCount: unreadNotificationsCount } = useProviderNotifications();

  const refreshDashboard = useCallback(async () => {
    setIsDashboardLoading(true);
    setErrorMessage("");

    try {
      const [nextSummary, nextActivities, nextGeneratorsUsage] = await Promise.all([
        providerDashboardService.getProviderDashboardSummary(),
        providerDashboardService.getProviderActivities(),
        providerDashboardService.getProviderGeneratorsUsage(),
      ]);

      setSummary(nextSummary);
      setActivitiesData(nextActivities);
      setGeneratorsUsageData(nextGeneratorsUsage);
    } catch (error) {
      setSummary(emptySummary);
      setActivitiesData([]);
      setGeneratorsUsageData([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshDashboard]);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkingHours() {
      try {
        setIsWorkingHoursLoading(true);
        setWorkingHoursErrorMessage("");
        const nextWorkingHours =
          await providerDashboardService.getProviderWorkingHours(activeChartPeriod);

        if (isMounted) {
          setWorkingHours(nextWorkingHours);
        }
      } catch (error) {
        if (isMounted) {
          setWorkingHours({ period: activeChartPeriod, points: [] });
          setWorkingHoursErrorMessage(
            getErrorMessage(error, "تعذر تحميل ساعات العمل من الخادم.")
          );
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
  }, [activeChartPeriod]);

  useEffect(() => {
    function refreshProviderProfile() {
      setProviderProfile(getProviderProfile());
      refreshDashboard();
    }

    window.addEventListener(AUTH_USER_UPDATED_EVENT, refreshProviderProfile);
    window.addEventListener("storage", refreshProviderProfile);

    return () => {
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, refreshProviderProfile);
      window.removeEventListener("storage", refreshProviderProfile);
    };
  }, [refreshDashboard]);

  const stats = useMemo(() => buildSummaryCards(summary), [summary]);

  const activities = useMemo(
    () => buildActivities(activitiesData),
    [activitiesData]
  );

  const visibleActivities = useMemo(() => {
    if (showAllActivities) return activities;
    return activities.slice(0, INITIAL_ACTIVITY_LIMIT);
  }, [activities, showAllActivities]);

  const generatorsUsage = useMemo(
    () => buildGeneratorsUsage(generatorsUsageData),
    [generatorsUsageData]
  );

  return {
    activeChartPeriod,
    activities: visibleActivities,
    chartPeriods: providerWorkingHourPeriods,
    dashboardCopy: providerDashboardCopy,
    errorMessage,
    generatorsUsage,
    isDashboardLoading,
    isWorkingHoursLoading,
    notifications,
    providerProfile,
    quickActions: providerQuickActions,
    refreshDashboard,
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


