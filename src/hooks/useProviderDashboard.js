import { useCallback, useMemo, useState } from "react";

import {
  providerDashboardCopy,
  providerQuickActions,
  providerStatCardsConfig,
  providerWorkingHourPeriods,
} from "../data/providerDashboardData";
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


export function useProviderDashboard() {
  const [activeChartPeriod, setActiveChartPeriod] = useState("weekly");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    activities: [],
    generatorsUsage: [],
  });
  const [providerProfile] = useState(() => getProviderProfile());
  const {
    addNotification,
    notifications,
    unreadCount: unreadNotificationsCount,
  } = useProviderNotifications();

  const stats = useMemo(() => buildSummaryCards(emptySummary), []);

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


  const addFrontendNotification = useCallback(
    (notification) => {
      addNotification(notification);
    },
    [addNotification]
  );

  return {
    activeChartPeriod,
    addFrontendNotification,
    activities: visibleActivities,
    chartPeriods: providerWorkingHourPeriods,
    dashboardCopy: providerDashboardCopy,
    errorMessage: "",
    generatorsUsage,
    isDashboardLoading: false,
    isWorkingHoursLoading: false,
    notifications,
    providerProfile,
    quickActions: providerQuickActions,
    setActiveChartPeriod,
    setShowAllActivities,
    showAllActivities,
    stats,
    unreadNotificationsCount,
    workingHours: { period: activeChartPeriod, points: [] },
    workingHoursErrorMessage: "",
  };
}

export default useProviderDashboard;