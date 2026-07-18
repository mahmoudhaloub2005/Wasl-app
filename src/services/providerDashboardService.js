import { getProviderDemoRecords } from "./providerDemoStore";
import { getCurrentProviderAccountKey } from "./providerAccount";

const SERVICE_DELAY_MS = 280;

function delay(duration = SERVICE_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getCurrentMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { start, end };
}

function getPreviousMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);

  return { start, end };
}

function isDateInRange(value, range) {
  if (!value) return false;

  const date = new Date(value);
  return date >= range.start && date < range.end;
}

function sumPaymentsForRange(payments, range) {
  return payments
    .filter((payment) => payment.status === "paid" && isDateInRange(payment.paidAt, range))
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);
}

function calculatePercentageChange(currentValue, previousValue) {
  if (!previousValue && !currentValue) return null;
  if (!previousValue) return 100;

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function getRecords() {
  return getProviderDemoRecords(getCurrentProviderAccountKey());
}

function getPendingSubscriptions(records) {
  const directRequests = records.subscriptionRequests || [];
  const legacyPendingSubscriptions = (records.subscriptions || []).filter(
    (subscription) => subscription.status === "pending"
  );

  return [...directRequests, ...legacyPendingSubscriptions];
}

export async function getProviderDashboardSummary() {
  await delay();

  const records = getRecords();
  const currentMonthRange = getCurrentMonthRange();
  const previousMonthRange = getPreviousMonthRange();
  const monthlyIncome = sumPaymentsForRange(records.payments, currentMonthRange);
  const previousMonthlyIncome = sumPaymentsForRange(
    records.payments,
    previousMonthRange
  );
  const pendingSubscriptions = getPendingSubscriptions(records);
  const activeSubscribers = (records.subscriptions || []).filter(
    (subscription) => subscription.status === "active"
  );
  const newSubscribers = activeSubscribers.filter((subscription) =>
    isDateInRange(subscription.createdAt, currentMonthRange)
  );

  return {
    monthlyIncome,
    monthlyIncomeChange: calculatePercentageChange(
      monthlyIncome,
      previousMonthlyIncome
    ),
    activeSubscribers: activeSubscribers.length,
    newSubscribers: newSubscribers.length,
    newSubscriptionRequests: pendingSubscriptions.length,
    hasUrgentSubscriptionRequests: pendingSubscriptions.some(
      (subscription) => subscription.priority === "urgent"
    ),
  };
}

export async function getProviderWorkingHours(period = "weekly") {
  await delay(220);

  const records = getRecords();
  const matchingPoints = records.workingHours.filter(
    (item) => item.period === period
  );

  return {
    period,
    description:
      period === "monthly"
        ? "تحليل الأداء للشهر الحالي"
        : "تحليل الأداء للأسبوع الحالي",
    points: cloneData(matchingPoints),
  };
}

export async function getProviderGeneratorsUsage() {
  await delay();

  const records = getRecords();

  return cloneData(
    records.generators.map((generator) => {
      const currentLoad = Number(
        generator.currentLoad ||
          generator.current_load ||
          generator.currentAmpere ||
          generator.current_ampere ||
          generator.load ||
          0
      );
      const capacity = Number(
        generator.loadCapacity ||
          generator.load_capacity ||
          generator.capacityAmps ||
          generator.capacity_amps ||
          generator.ampereCapacity ||
          generator.ampere_capacity ||
          generator.maxLoad ||
          generator.max_load ||
          generator.capacity ||
          0
      );
      const percentage = capacity > 0 ? Math.round((currentLoad / capacity) * 100) : 0;

      return {
        id: generator.id || generator.generatorId || generator.generator_id,
        name: generator.name || generator.generatorName || generator.generator_name,
        percentage,
        currentLoad,
        capacity,
        unit: generator.unit || "أمبير",
      };
    })
  );
}

export async function getProviderActivities() {
  await delay();

  const records = getRecords();

  return cloneData(
    records.activities
      .slice()
      .sort((firstActivity, secondActivity) => {
        const firstDate = new Date(firstActivity.createdAt || 0).getTime();
        const secondDate = new Date(secondActivity.createdAt || 0).getTime();

        return secondDate - firstDate;
      })
  );
}

export async function getProviderNotifications() {
  await delay(180);

  const records = getRecords();

  return cloneData(
    records.notifications
      .slice()
      .sort((firstNotification, secondNotification) => {
        const firstDate = new Date(firstNotification.createdAt || 0).getTime();
        const secondDate = new Date(secondNotification.createdAt || 0).getTime();

        return secondDate - firstDate;
      })
  );
}

export const providerDashboardService = {
  getProviderDashboardSummary,
  getProviderWorkingHours,
  getProviderGeneratorsUsage,
  getProviderActivities,
  getProviderNotifications,
};

export default providerDashboardService;
