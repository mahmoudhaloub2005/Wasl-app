import api from "./api";
import { getCurrentProviderAccountKey } from "./providerAccount";
import { getProviderDemoRecords } from "./providerDemoStore";

const TEMPORARY_RECORDS_PREFIX = "wasel_provider_financial_records";
const TEMPORARY_EXPENSES_PREFIX = "wasel_provider_financial_expenses";

function getScopedKey(prefix, accountKey = getCurrentProviderAccountKey()) {
  return `${prefix}_${encodeURIComponent(accountKey)}`;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDate(value) {
  const date = new Date(value || "");

  return Number.isNaN(date.getTime()) ? null : date;
}

function getCurrentMonthRange(date = new Date()) {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
  };
}

function getPreviousMonthRange(date = new Date()) {
  return {
    start: new Date(date.getFullYear(), date.getMonth() - 1, 1),
    end: new Date(date.getFullYear(), date.getMonth(), 1),
  };
}

function getCurrentWeekRange(date = new Date()) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function getPreviousWeekRange(date = new Date()) {
  const currentWeek = getCurrentWeekRange(date);
  const end = new Date(currentWeek.start);
  end.setMilliseconds(-1);

  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function isDateInRange(value, range) {
  const date = toDate(value);

  if (!date) return false;

  return date >= range.start && date < range.end;
}

function calculatePercentageChange(currentValue, previousValue) {
  if (!previousValue && !currentValue) return null;
  if (!previousValue) return 100;

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function normalizeStatus(value, dueDate) {
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  if (
    status.includes("paid") ||
    status.includes("settled") ||
    status.includes("completed") ||
    status.includes("ظ…ط¯ظپظˆط¹ط©") ||
    status.includes("ظ…ط¯ظپظˆط¹")
  ) {
    return "paid";
  }

  if (
    status.includes("pending") ||
    status.includes("waiting") ||
    status.includes("review") ||
    status.includes("ظ‚ظٹط¯") ||
    status.includes("ط§ظ†طھط¸ط§ط±")
  ) {
    return "pending";
  }

  if (
    status.includes("overdue") ||
    status.includes("late") ||
    status.includes("ظ…طھط£ط®ط±ط©")
  ) {
    return "overdue";
  }

  if (
    status.includes("draft") ||
    status.includes("ظ…ط³ظˆط¯ط©") ||
    status.includes("unissued")
  ) {
    return "draft";
  }

  const dueDateValue = toDate(dueDate);

  if (dueDateValue && dueDateValue < new Date()) return "overdue";

  return "draft";
}

function getStatusLabel(status) {
  if (status === "paid") return "ظ…ط¯ظپظˆط¹ط©";
  if (status === "pending") return "ظ‚ظٹط¯ ط§ظ„ط§ظ†طھط¸ط§ط±";
  if (status === "overdue") return "ظ…طھط£ط®ط±ط©";

  return "ظ…ط³ظˆط¯ط©";
}

function getCustomerName(record = {}) {
  return String(
    getFirstValue(
      record,
      [
        "customerName",
        "customer_name",
        "subscriberName",
        "subscriber_name",
        "clientName",
        "client_name",
        "name",
      ],
      getFirstValue(
        record.customer || record.subscriber || record.client,
        ["full_name", "fullName", "name"],
        "ظ…ط´طھط±ظƒ"
      )
    )
  ).trim();
}

function buildInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => Array.from(part)[0]).join(" ") || "طں";
}

function getRecordDate(record = {}) {
  return (
    getFirstValue(record, [
      "dueDate",
      "due_date",
      "deadline",
      "paidAt",
      "paid_at",
      "paymentDate",
      "payment_date",
      "issuedAt",
      "issued_at",
      "createdAt",
      "created_at",
      "date",
    ]) || new Date().toISOString()
  );
}

function normalizeFinancialRecord(record = {}, index = 0) {
  const customerName = getCustomerName(record);
  const dueDate = getRecordDate(record);
  const status = normalizeStatus(
    getFirstValue(record, ["status", "state", "paymentStatus", "payment_status"]),
    dueDate
  );
  const id = String(
    getFirstValue(record, [
      "id",
      "_id",
      "uuid",
      "invoiceId",
      "invoice_id",
      "paymentId",
      "payment_id",
      "subscriptionId",
      "subscription_id",
    ]) || `financial-record-${index}`
  );

  return {
    id,
    amount: toNumber(
      getFirstValue(record, ["amount", "total", "totalAmount", "total_amount", "monthlyCost"])
    ),
    customerName,
    dueDate,
    initials: record.initials || buildInitials(customerName),
    path: record.path || `/provider/finance/invoices/${id}`,
    sourceType: record.sourceType || record.type || "invoice",
    status,
    statusLabel: getStatusLabel(status),
  };
}

function readTemporaryList(prefix) {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(getScopedKey(prefix));

  if (!storedValue) return [];

  try {
    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function unwrapList(data) {
  const candidates = [
    data,
    data?.data,
    data?.records,
    data?.data?.records,
    data?.invoices,
    data?.data?.invoices,
    data?.payments,
    data?.data?.payments,
    data?.items,
    data?.data?.items,
    data?.results,
    data?.data?.results,
  ];

  return candidates.find(Array.isArray) || [];
}

function shouldUseProviderFinanceApi() {
  return import.meta.env.VITE_PROVIDER_FINANCE_API === "true";
}

function isApiUnavailable(error) {
  return (
    error?.response?.status === 404 ||
    error?.response?.status === 405 ||
    error?.code === "ERR_NETWORK"
  );
}

async function getOptionalProviderFinanceApiList(path) {
  if (!shouldUseProviderFinanceApi()) return null;

  try {
    const response = await api.get(path);
    return unwrapList(response.data);
  } catch (error) {
    if (isApiUnavailable(error)) return null;
    throw error;
  }
}

function getGeneratorId(generator = {}) {
  return String(
    getFirstValue(generator, [
      "id",
      "_id",
      "uuid",
      "generatorId",
      "generator_id",
      "code",
    ])
  );
}

function getSubscriptionGeneratorId(subscription = {}) {
  return String(
    getFirstValue(subscription, [
      "generatorId",
      "generator_id",
      "providerGeneratorId",
      "provider_generator_id",
    ])
  );
}

function getGeneratorCapacity(generator = {}) {
  return toNumber(
    getFirstValue(generator, [
      "loadCapacity",
      "load_capacity",
      "capacityAmps",
      "capacity_amps",
      "ampereCapacity",
      "ampere_capacity",
      "maxLoad",
      "max_load",
      "capacity",
    ])
  );
}

function getGeneratorCurrentLoad(generator = {}) {
  return toNumber(
    getFirstValue(generator, [
      "currentLoad",
      "current_load",
      "currentAmpere",
      "current_ampere",
      "load",
      "usageValue",
      "usage_value",
    ])
  );
}

function getGeneratorName(generator = {}, index = 0) {
  return String(
    getFirstValue(
      generator,
      ["name", "generatorName", "generator_name", "title", "label", "code"],
      `ظ…ظˆظ„ط¯ ${index + 1}`
    )
  );
}

function getGeneratorPrice(generator = {}) {
  return toNumber(
    getFirstValue(generator, [
      "pricePerAmpere",
      "price_per_ampere",
      "amperePrice",
      "ampere_price",
      "price",
    ])
  );
}

function findGeneratorForSubscription(subscription, generators) {
  const subscriptionGeneratorId = getSubscriptionGeneratorId(subscription);

  if (subscriptionGeneratorId) {
    return generators.find(
      (generator) => getGeneratorId(generator) === subscriptionGeneratorId
    );
  }

  return generators.length === 1 ? generators[0] : null;
}

function buildSubscriptionRecord(subscription, index, generators) {
  const matchingGenerator = findGeneratorForSubscription(subscription, generators);
  const ampere = toNumber(
    getFirstValue(subscription, ["ampere", "amperes", "requestedAmpere", "requested_ampere"])
  );
  const invoice = subscription.invoice || {};
  const amount =
    toNumber(
      getFirstValue(subscription, ["monthlyCost", "monthly_cost", "price", "amount"])
    ) ||
    toNumber(getFirstValue(invoice, ["amount", "total", "totalAmount", "total_amount"])) ||
    ampere * getGeneratorPrice(matchingGenerator);

  if (!amount) return null;

  return normalizeFinancialRecord(
    {
      ...subscription,
      amount,
      dueDate:
        getFirstValue(invoice, ["dueDate", "due_date", "deadline"]) ||
        getFirstValue(subscription, ["dueDate", "due_date", "deadline"]) ||
        new Date().toISOString(),
      id:
        getFirstValue(invoice, ["id", "_id", "invoiceId", "invoice_id"]) ||
        getFirstValue(subscription, ["id", "_id", "subscriptionId", "subscription_id"]) ||
        `subscription-invoice-${index}`,
      path: `/provider/finance/invoices/${
        getFirstValue(invoice, ["id", "_id", "invoiceId", "invoice_id"]) ||
        getFirstValue(subscription, ["id", "_id", "subscriptionId", "subscription_id"]) ||
        `subscription-invoice-${index}`
      }`,
      sourceType: "invoice",
      status:
        getFirstValue(invoice, ["status", "state", "paymentStatus", "payment_status"]) ||
        "draft",
    },
    index
  );
}

function buildPaymentRecord(payment, index) {
  return normalizeFinancialRecord(
    {
      ...payment,
      id:
        getFirstValue(payment, ["id", "_id", "uuid", "paymentId", "payment_id"]) ||
        `payment-${index}`,
      path: `/provider/finance/payments/${
        getFirstValue(payment, ["id", "_id", "uuid", "paymentId", "payment_id"]) ||
        `payment-${index}`
      }`,
      sourceType: "payment",
    },
    index
  );
}

function getTemporaryRecords() {
  const providerRecords = getProviderDemoRecords(getCurrentProviderAccountKey());
  const generators = providerRecords.generators || [];
  const subscriptionRecords = (providerRecords.subscriptions || [])
    .map((subscription, index) =>
      buildSubscriptionRecord(subscription, index, generators)
    )
    .filter(Boolean);
  const paymentRecords = (providerRecords.payments || []).map(buildPaymentRecord);
  const storedRecords = readTemporaryList(TEMPORARY_RECORDS_PREFIX).map(
    normalizeFinancialRecord
  );
  const recordsById = new Map();

  [...storedRecords, ...subscriptionRecords, ...paymentRecords].forEach((record) => {
    recordsById.set(record.id, record);
  });

  return [...recordsById.values()].sort((firstRecord, secondRecord) => {
    const firstDate = toDate(firstRecord.dueDate)?.getTime() || 0;
    const secondDate = toDate(secondRecord.dueDate)?.getTime() || 0;

    return secondDate - firstDate;
  });
}

function getTemporaryExpenses() {
  const providerRecords = getProviderDemoRecords(getCurrentProviderAccountKey());

  return [
    ...(providerRecords.expenses || []),
    ...readTemporaryList(TEMPORARY_EXPENSES_PREFIX),
  ].map((expense, index) => ({
    id: expense.id || `expense-${index}`,
    amount: toNumber(getFirstValue(expense, ["amount", "total", "cost"])),
    date: getFirstValue(expense, ["date", "createdAt", "created_at"], new Date().toISOString()),
  }));
}

function sumRecordsForRange(records, range, status = "paid") {
  return records
    .filter((record) => record.status === status && isDateInRange(record.dueDate, range))
    .reduce((total, record) => total + Number(record.amount || 0), 0);
}

function sumExpensesForRange(expenses, range) {
  return expenses
    .filter((expense) => isDateInRange(expense.date, range))
    .reduce((total, expense) => total + Number(expense.amount || 0), 0);
}

function buildFinancialSummary(records, expenses) {
  const currentMonthRange = getCurrentMonthRange();
  const previousMonthRange = getPreviousMonthRange();
  const currentWeekRange = getCurrentWeekRange();
  const previousWeekRange = getPreviousWeekRange();
  const monthlyRevenue = sumRecordsForRange(records, currentMonthRange);
  const previousMonthlyRevenue = sumRecordsForRange(records, previousMonthRange);
  const weeklyRevenue = sumRecordsForRange(records, currentWeekRange);
  const previousWeeklyRevenue = sumRecordsForRange(records, previousWeekRange);
  const monthlyExpenses = sumExpensesForRange(expenses, currentMonthRange);
  const previousMonthlyExpenses = sumExpensesForRange(expenses, previousMonthRange);
  const netProfit = Math.max(0, monthlyRevenue - monthlyExpenses);
  const previousNetProfit = Math.max(
    0,
    previousMonthlyRevenue - previousMonthlyExpenses
  );

  return {
    hasFinancialData: records.length > 0,
    monthlyRevenue,
    monthlyRevenueChange: calculatePercentageChange(
      monthlyRevenue,
      previousMonthlyRevenue
    ),
    weeklyRevenue,
    weeklyRevenueChange: calculatePercentageChange(
      weeklyRevenue,
      previousWeeklyRevenue
    ),
    netProfit,
    netProfitChange: calculatePercentageChange(netProfit, previousNetProfit),
    pendingPaymentsCount: records.filter((record) => record.status === "pending")
      .length,
  };
}

function buildCapacityItems() {
  const providerRecords = getProviderDemoRecords(getCurrentProviderAccountKey());
  const generators = providerRecords.generators || [];
  const activeSubscriptions = (providerRecords.subscriptions || []).filter(
    (subscription) => subscription.status === "active"
  );

  return generators.map((generator, index) => {
    const generatorId = getGeneratorId(generator);
    const matchingSubscriptions = activeSubscriptions.filter((subscription) => {
      const subscriptionGeneratorId = getSubscriptionGeneratorId(subscription);

      if (!subscriptionGeneratorId && generators.length === 1) return true;

      return subscriptionGeneratorId === generatorId;
    });
    const consumedFromSubscriptions = matchingSubscriptions.reduce(
      (total, subscription) =>
        total +
        toNumber(
          getFirstValue(subscription, [
            "ampere",
            "amperes",
            "requestedAmpere",
            "requested_ampere",
          ])
        ),
      0
    );
    const capacity = getGeneratorCapacity(generator);
    const consumed = consumedFromSubscriptions || getGeneratorCurrentLoad(generator);
    const rawPercentage = capacity > 0 ? Math.round((consumed / capacity) * 100) : 0;
    const percentage = Math.max(0, Math.min(100, rawPercentage));
    const tone = percentage >= 90 ? "critical" : percentage >= 70 ? "warning" : "normal";

    return {
      id: generatorId || `generator-capacity-${index}`,
      capacity,
      consumed,
      name: getGeneratorName(generator, index),
      percentage,
      tone,
    };
  });
}

// TODO: Replace the temporary store fallback with provider finance endpoints once
// backend routes for provider invoices, payments, expenses, and reports are ready.
export async function getProviderFinancialRecords() {
  const apiRecords = await getOptionalProviderFinanceApiList(
    "/provider/finance/records"
  );

  if (apiRecords) {
    return cloneData(apiRecords.map(normalizeFinancialRecord));
  }

  return cloneData(getTemporaryRecords());
}

export async function getProviderPayments() {
  const apiPayments = await getOptionalProviderFinanceApiList(
    "/provider/finance/payments"
  );

  if (apiPayments) {
    return cloneData(apiPayments.map(buildPaymentRecord));
  }

  return cloneData(
    getTemporaryRecords().filter((record) => record.sourceType === "payment")
  );
}

export async function getProviderInvoices() {
  const error = new Error("Provider invoices endpoint is not available in the current backend contract.");
  error.code = "PROVIDER_INVOICES_ENDPOINT_MISSING";
  throw error;
}

export async function getProviderFinancialSummary() {
  const records = await getProviderFinancialRecords();

  return cloneData(buildFinancialSummary(records, getTemporaryExpenses()));
}

export async function getProviderGeneratorCapacity() {
  const apiCapacity = await getOptionalProviderFinanceApiList(
    "/provider/finance/generator-capacity"
  );

  if (apiCapacity) {
    return cloneData(apiCapacity);
  }

  return cloneData(buildCapacityItems());
}

export async function getMonthlyFinancialReport() {
  const [summary, records] = await Promise.all([
    getProviderFinancialSummary(),
    getProviderFinancialRecords(),
  ]);
  const monthKey = new Intl.DateTimeFormat("en-CA", {
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date())
    .replace("/", "-");
  const csvRows = [
    ["ط§ظ„ط¨ظ†ط¯", "ط§ظ„ظ‚ظٹظ…ط©"],
    ["ط§ظ„ط¥ظٹط±ط§ط¯ ط§ظ„ط´ظ‡ط±ظٹ", summary.monthlyRevenue],
    ["ط§ظ„ط¥ظٹط±ط§ط¯ ط§ظ„ط£ط³ط¨ظˆط¹ظٹ", summary.weeklyRevenue],
    ["طµط§ظپظٹ ط§ظ„ط£ط±ط¨ط§ط­", summary.netProfit],
    [],
    ["ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„", "ط§ظ„ظ…ط¨ظ„ط؛", "طھط§ط±ظٹط® ط§ظ„ط§ط³طھط­ظ‚ط§ظ‚", "ط§ظ„ط­ط§ظ„ط©"],
    ...records.map((record) => [
      record.customerName,
      record.amount,
      record.dueDate,
      record.statusLabel,
    ]),
  ];
  const csvContent = csvRows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")
    )
    .join("\n");

  return {
    blob: new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8",
    }),
    fileName: `wasl-provider-finance-${monthKey}.csv`,
  };
}

export const providerFinanceService = {
  getMonthlyFinancialReport,
  getProviderFinancialRecords,
  getProviderFinancialSummary,
  getProviderGeneratorCapacity,
  getProviderInvoices,
  getProviderPayments,
};

export default providerFinanceService;

