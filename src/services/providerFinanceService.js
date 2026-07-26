import { getProviderGenerators } from "./providerGeneratorsService";
import { getProviderInvoices as fetchProviderInvoices } from "./providerInvoicesService";
import { getProviderPaymentRequests } from "./providerPaymentsService";
import { getProviderSubscriptions } from "./providerSubscriptionsService";
import { getFirstValue, sanitizeText, toNumber } from "./apiResponse";

function toDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeStatus(value, dueDate) {
  const status = String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ");

  if (status.includes("approved") || status.includes("paid") || status.includes("settled") || status.includes("completed")) {
    return "paid";
  }

  if (status.includes("pending") || status.includes("review") || status.includes("waiting")) {
    return "pending";
  }

  if (status.includes("overdue") || status.includes("late")) {
    return "overdue";
  }

  const dueDateValue = toDate(dueDate);
  if (dueDateValue && dueDateValue < new Date()) return "overdue";

  return "draft";
}

function getStatusLabel(status) {
  if (status === "paid") return "مدفوعة";
  if (status === "pending") return "قيد الانتظار";
  if (status === "overdue") return "متأخرة";
  return "مسودة";
}

function buildInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => Array.from(part)[0]).join(" ") || "؟";
}

export function normalizeFinancialRecord(record = {}, index = 0) {
  const raw = record.raw || record;
  const isPayment = record.sourceType === "payment" || raw.payment_id || raw.receipt_image;
  const id = String(
    record.id ||
      getFirstValue(raw, ["id", "_id", "uuid", "invoice_id", "invoiceId", "payment_id", "paymentId"]) ||
      `financial-record-${index}`
  );
  const dueDate = record.dueDate || getFirstValue(raw, ["due_date", "dueDate", "deadline", "created_at", "createdAt"]);
  const status = normalizeStatus(record.status || getFirstValue(raw, ["status", "state", "payment_status", "paymentStatus"]), dueDate);
  const customerName = sanitizeText(record.customerName || getFirstValue(raw, ["customerName", "customer_name", "subscriberName", "subscriber_name"]), "مشترك");

  return {
    id,
    amount: toNumber(record.amount || getFirstValue(raw, ["amount", "total", "total_amount", "totalAmount"])),
    customerName,
    dueDate,
    initials: record.initials || buildInitials(customerName),
    invoiceNumber: record.invoiceNumber || getFirstValue(raw, ["invoice_number", "invoiceNumber", "number", "code"]),
    path: record.path || `/provider/finance/${isPayment ? "payments" : "invoices"}/${encodeURIComponent(id)}`,
    sourceType: isPayment ? "payment" : "invoice",
    status,
    statusLabel: getStatusLabel(status),
    raw,
  };
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

function isDateInRange(value, range) {
  const date = toDate(value);
  if (!date) return false;
  return date >= range.start && date < range.end;
}

function sumRecordsForRange(records, range, status = "paid") {
  return records
    .filter((record) => record.status === status && isDateInRange(record.dueDate, range))
    .reduce((total, record) => total + Number(record.amount || 0), 0);
}

function calculatePercentageChange(currentValue, previousValue) {
  if (!previousValue && !currentValue) return null;
  if (!previousValue) return 100;
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function buildFinancialSummary(records) {
  const currentMonthRange = getCurrentMonthRange();
  const previousMonthRange = getPreviousMonthRange();
  const currentWeekRange = getCurrentWeekRange();
  const previousWeekRange = {
    start: new Date(currentWeekRange.start.getTime() - 7 * 24 * 60 * 60 * 1000),
    end: currentWeekRange.start,
  };
  const monthlyRevenue = sumRecordsForRange(records, currentMonthRange);
  const previousMonthlyRevenue = sumRecordsForRange(records, previousMonthRange);
  const weeklyRevenue = sumRecordsForRange(records, currentWeekRange);
  const previousWeeklyRevenue = sumRecordsForRange(records, previousWeekRange);

  return {
    hasFinancialData: records.length > 0,
    monthlyRevenue,
    monthlyRevenueChange: calculatePercentageChange(monthlyRevenue, previousMonthlyRevenue),
    weeklyRevenue,
    weeklyRevenueChange: calculatePercentageChange(weeklyRevenue, previousWeeklyRevenue),
    netProfit: monthlyRevenue,
    netProfitChange: calculatePercentageChange(monthlyRevenue, previousMonthlyRevenue),
    pendingPaymentsCount: records.filter((record) => record.status === "pending" && record.sourceType === "payment").length,
  };
}

export async function getProviderFinancialRecords() {
  const [invoices, payments] = await Promise.all([
    fetchProviderInvoices(),
    getProviderPaymentRequests().catch(() => []),
  ]);

  return [
    ...invoices.map((invoice, index) => normalizeFinancialRecord(invoice, index)),
    ...payments.map((payment, index) => normalizeFinancialRecord({ ...payment, sourceType: "payment" }, index)),
  ].sort((firstRecord, secondRecord) => {
    const firstDate = toDate(firstRecord.dueDate)?.getTime() || 0;
    const secondDate = toDate(secondRecord.dueDate)?.getTime() || 0;
    return secondDate - firstDate;
  });
}

export async function getProviderPayments() {
  return getProviderPaymentRequests();
}

export async function getProviderInvoicesForFinance() {
  return fetchProviderInvoices();
}

export async function getProviderFinancialSummary() {
  const records = await getProviderFinancialRecords();
  return buildFinancialSummary(records);
}

function getGeneratorId(generator = {}) {
  return String(generator.id || generator.generatorId || generator.generator_id || "");
}

function getSubscriptionGeneratorId(subscription = {}) {
  const raw = subscription.raw || subscription;
  return String(
    getFirstValue(raw, ["generator_id", "generatorId"]) ||
      getFirstValue(raw.subscription || {}, ["generator_id", "generatorId"]) ||
      getFirstValue(raw.generator || {}, ["id", "_id", "uuid"])
  );
}

function getCapacityStatusMeta(percentage) {
  if (percentage >= 95) return { status: "critical", statusLabel: "حرج", tone: "critical" };
  if (percentage >= 80) return { status: "high", statusLabel: "مرتفع", tone: "high" };
  if (percentage >= 50) return { status: "medium", statusLabel: "متوسط", tone: "medium" };
  return { status: "normal", statusLabel: "طبيعي", tone: "normal" };
}

export async function getProviderGeneratorCapacity() {
  const [generators, subscriptions] = await Promise.all([
    getProviderGenerators(),
    getProviderSubscriptions(),
  ]);

  return generators.map((generator, index) => {
    const generatorId = getGeneratorId(generator);
    const matchingSubscriptions = subscriptions.filter((subscription) => {
      const subscriptionGeneratorId = getSubscriptionGeneratorId(subscription);
      if (!subscriptionGeneratorId && generators.length === 1) return true;
      return subscriptionGeneratorId === generatorId;
    });
    const consumed = matchingSubscriptions.reduce((total, subscription) => total + toNumber(subscription.ampere), 0);
    const capacity = toNumber(generator.powerKW || generator.capacityKva || generator.capacity);
    const percentage = capacity > 0 ? Math.max(0, Math.min(100, Math.round((consumed / capacity) * 100))) : 0;
    const availableCapacity = Math.max(0, capacity - consumed);

    return {
      id: generatorId || `generator-capacity-${index}`,
      activeSubscribers: matchingSubscriptions.length,
      area: generator.locationName || generator.location || "غير محددة",
      availableCapacity,
      capacity,
      consumed,
      currentLoad: consumed,
      generatorId,
      isActive: generator.status === "active",
      maximumCapacity: capacity,
      name: generator.name || `مولد ${index + 1}`,
      percentage,
      ...getCapacityStatusMeta(percentage),
    };
  });
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
    ["البند", "القيمة"],
    ["الإيراد الشهري", summary.monthlyRevenue],
    ["الإيراد الأسبوعي", summary.weeklyRevenue],
    ["صافي الأرباح", summary.netProfit],
    [],
    ["اسم العميل", "المبلغ", "تاريخ الاستحقاق", "الحالة"],
    ...records.map((record) => [record.customerName, record.amount, record.dueDate, record.statusLabel]),
  ];
  const csvContent = csvRows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  return {
    blob: new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8" }),
    fileName: `wasl-provider-finance-${monthKey}.csv`,
  };
}

export const providerFinanceService = {
  getMonthlyFinancialReport,
  getProviderFinancialRecords,
  getProviderFinancialSummary,
  getProviderGeneratorCapacity,
  getProviderInvoices: getProviderInvoicesForFinance,
  getProviderPayments,
};

export default providerFinanceService;

