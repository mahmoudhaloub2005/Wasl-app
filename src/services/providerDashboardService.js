import api from "./api";
import { getProviderFinancialRecords } from "./providerFinanceService";
import { getProviderGenerators } from "./providerGeneratorsService";
import { getProviderSubscribers } from "./providerSubscriptionsService";
import { getFirstValue, toNumber, unwrapItem, unwrapList } from "./apiResponse";

function toDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthRange(offset = 0, date = new Date()) {
  return {
    start: new Date(date.getFullYear(), date.getMonth() + offset, 1),
    end: new Date(date.getFullYear(), date.getMonth() + offset + 1, 1),
  };
}

function isDateInRange(value, range) {
  const date = toDate(value);
  return Boolean(date && date >= range.start && date < range.end);
}

function calculatePercentageChange(currentValue, previousValue) {
  if (!previousValue && !currentValue) return null;
  if (!previousValue) return 100;
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function getReportObject(data) {
  const item = unwrapItem(data, ["report", "summary"]);
  return Array.isArray(item) ? item[0] || {} : item || {};
}

function formatActivityDate(value) {
  const date = toDate(value);
  if (!date) return "غير محدد";

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRecordDate(record = {}) {
  return (
    record.dueDate ||
    record.paidAt ||
    record.createdAt ||
    record.raw?.created_at ||
    record.raw?.createdAt ||
    record.raw?.paid_at ||
    record.raw?.paidAt
  );
}

function sortByNewest(firstItem, secondItem) {
  const firstDate = toDate(firstItem.createdAt || firstItem.metaDate)?.getTime() || 0;
  const secondDate = toDate(secondItem.createdAt || secondItem.metaDate)?.getTime() || 0;
  return secondDate - firstDate;
}

function buildActivity({ id, iconKey, metaDate, path, title, tone }) {
  return {
    id,
    iconKey,
    meta: formatActivityDate(metaDate),
    metaDate,
    path,
    title,
    tone,
  };
}

export async function getProviderReports() {
  const response = await api.get("/provider/reports");
  return response.data;
}

export async function getProviderDashboardSummary() {
  const [reportsResult, recordsResult, subscribersResult] = await Promise.allSettled([
    getProviderReports(),
    getProviderFinancialRecords(),
    getProviderSubscribers(),
  ]);
  const report = reportsResult.status === "fulfilled" ? getReportObject(reportsResult.value) : {};
  const records = recordsResult.status === "fulfilled" ? recordsResult.value : [];
  const subscribers = subscribersResult.status === "fulfilled" ? subscribersResult.value : [];

  if (
    reportsResult.status === "rejected" &&
    recordsResult.status === "rejected" &&
    subscribersResult.status === "rejected"
  ) {
    throw reportsResult.reason;
  }

  const currentMonthRange = monthRange(0);
  const previousMonthRange = monthRange(-1);
  const monthlyIncomeFromReport = toNumber(
    getFirstValue(report, [
      "monthlyIncome",
      "monthly_income",
      "monthlyRevenue",
      "monthly_revenue",
      "revenue",
      "total_revenue",
      "totalRevenue",
    ]),
    null
  );
  const monthlyIncome =
    monthlyIncomeFromReport ??
    records
      .filter((record) => record.status === "paid" && isDateInRange(getRecordDate(record), currentMonthRange))
      .reduce((total, record) => total + Number(record.amount || 0), 0);
  const previousMonthlyIncome = records
    .filter((record) => record.status === "paid" && isDateInRange(getRecordDate(record), previousMonthRange))
    .reduce((total, record) => total + Number(record.amount || 0), 0);
  const pendingSubscriptions = subscribers.filter((subscriber) => subscriber.status === "pending");
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === "active");
  const newSubscribers = activeSubscribers.filter((subscriber) =>
    isDateInRange(subscriber.acceptedAt || subscriber.subscribedAt || subscriber.requestedAt, currentMonthRange)
  );

  return {
    monthlyIncome,
    monthlyIncomeChange: calculatePercentageChange(monthlyIncome, previousMonthlyIncome),
    activeSubscribers: toNumber(
      getFirstValue(report, ["activeSubscribers", "active_subscribers"]),
      activeSubscribers.length
    ),
    newSubscribers: toNumber(
      getFirstValue(report, ["newSubscribers", "new_subscribers"]),
      newSubscribers.length
    ),
    newSubscriptionRequests: toNumber(
      getFirstValue(report, ["newSubscriptionRequests", "new_subscription_requests", "pendingSubscriptions", "pending_subscriptions"]),
      pendingSubscriptions.length
    ),
    hasUrgentSubscriptionRequests: pendingSubscriptions.some((subscription) => subscription.priority === "urgent"),
  };
}

export async function getProviderWorkingHours(period = "weekly") {
  const reportsData = await getProviderReports();
  const report = getReportObject(reportsData);
  const nestedPoints =
    report?.workingHours?.[period] ||
    report?.working_hours?.[period] ||
    report?.hours?.[period] ||
    [];
  const listPoints = unwrapList(reportsData, ["workingHours", "working_hours", "hours", period]);
  const pointsSource = Array.isArray(nestedPoints) && nestedPoints.length ? nestedPoints : listPoints;

  return {
    period,
    description: period === "monthly" ? "تحليل الأداء للشهر الحالي" : "تحليل الأداء للأسبوع الحالي",
    points: pointsSource.map((item, index) => ({
      id: String(getFirstValue(item, ["id", "key"], `${period}-${index}`)),
      label: String(getFirstValue(item, ["label", "day", "name"], index + 1)),
      value: toNumber(getFirstValue(item, ["value", "hours", "percentage", "percent"])),
    })),
  };
}

export async function getProviderGeneratorsUsage() {
  const generators = await getProviderGenerators();

  return generators.map((generator, index) => {
    const capacity = Number(generator.capacity || generator.powerKW || 0);
    const currentLoad = Number(generator.currentLoad || 0);
    const percentage = capacity > 0
      ? Math.round((currentLoad / capacity) * 100)
      : Number(generator.usagePercentage || 0);

    return {
      id: generator.id || `generator-${index}`,
      name: generator.name || `مولد ${index + 1}`,
      percentage,
      currentLoad,
      capacity,
      unit: generator.unit || "KW",
    };
  });
}

export async function getProviderActivities() {
  const [subscribersResult, generatorsResult, recordsResult] = await Promise.allSettled([
    getProviderSubscribers(),
    getProviderGenerators(),
    getProviderFinancialRecords(),
  ]);
  const subscribers = subscribersResult.status === "fulfilled" ? subscribersResult.value : [];
  const generators = generatorsResult.status === "fulfilled" ? generatorsResult.value : [];
  const records = recordsResult.status === "fulfilled" ? recordsResult.value : [];

  return [
    ...subscribers.map((subscriber) =>
      buildActivity({
        id: `subscriber-${subscriber.id}`,
        iconKey: subscriber.status === "pending" ? "alert" : "users",
        metaDate: subscriber.requestedAt || subscriber.acceptedAt,
        path: "/provider/subscriptions",
        title: subscriber.status === "pending" ? `طلب اشتراك من ${subscriber.customerName}` : `مشترك نشط: ${subscriber.customerName}`,
        tone: subscriber.status === "pending" ? "orange" : "green",
      })
    ),
    ...generators.map((generator) =>
      buildActivity({
        id: `generator-${generator.id}`,
        iconKey: generator.status === "maintenance" ? "tool" : "check",
        metaDate: generator.updatedAt || generator.createdAt,
        path: "/provider/generators",
        title: `حالة ${generator.name}: ${generator.statusLabel}`,
        tone: generator.status === "maintenance" ? "orange" : "green",
      })
    ),
    ...records.slice(0, 8).map((record) =>
      buildActivity({
        id: `finance-${record.id}`,
        iconKey: record.status === "paid" ? "check" : "alert",
        metaDate: getRecordDate(record),
        path: record.path || "/provider/finance",
        title: `${record.statusLabel} - ${record.customerName}`,
        tone: record.status === "paid" ? "green" : "orange",
      })
    ),
  ]
    .filter((activity) => activity.id)
    .sort(sortByNewest)
    .slice(0, 12);
}

export async function getProviderNotifications() {
  const response = await api.get("/notifications/my");
  return unwrapList(response.data, ["notifications"]);
}

export const providerDashboardService = {
  getProviderActivities,
  getProviderDashboardSummary,
  getProviderGeneratorsUsage,
  getProviderNotifications,
  getProviderReports,
  getProviderWorkingHours,
};

export default providerDashboardService;
