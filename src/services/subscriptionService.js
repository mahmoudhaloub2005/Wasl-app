import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.subscriptions)) return data.subscriptions;
  if (Array.isArray(data?.data?.subscriptions)) return data.data.subscriptions;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.subscription) return [data.subscription];
  if (data?.data?.subscription) return [data.data.subscription];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.subscription || data?.subscription || data?.data || data;
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

function getNestedValue(source, paths, fallback = "") {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce((current, key) => current?.[key], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizeSubscription(subscription = {}) {
  const generator = subscription.generator || {};
  const ampereValue = toNumber(
    getFirstValue(subscription, [
      "ampere",
      "ampere_value",
      "ampereValue",
      "capacity",
      "subscription_capacity",
    ]),
    5
  );
  const pricePerAmpere = getFirstValue(subscription, [
    "price_per_ampere",
    "pricePerAmpere",
    "ampere_price",
    "amperePrice",
    "price",
  ]);
  const status = String(
    getFirstValue(subscription, ["status", "state"], "active")
  ).toLowerCase();
  const isCancelled =
    status.includes("cancel") ||
    status.includes("ملغ") ||
    status.includes("inactive");

  return {
    id: getFirstValue(subscription, ["id", "_id", "uuid"]),
    generatorId: getNestedValue(
      { subscription, generator },
      ["subscription.generator_id", "subscription.generatorId", "generator.id"],
      null
    ),
    generatorName: getNestedValue(
      { subscription, generator },
      [
        "generator.name",
        "generator.generator_name",
        "subscription.generator_name",
        "subscription.generatorName",
      ],
      "مولدات الحي المركزية"
    ),
    description: getNestedValue(
      { subscription, generator },
      ["generator.description", "generator.shortDescription", "subscription.description"],
      "مزود طاقة موثوق لمنطقتكم"
    ),
    status: isCancelled ? "اشتراك ملغى" : "اشتراك نشط",
    isCancelled,
    ampereValue,
    ampere: `${ampereValue} أمبير`,
    paymentPlan: getFirstValue(subscription, ["payment_plan", "paymentPlan"], "monthly"),
    startDate:
      formatDate(
        getFirstValue(subscription, ["start_date", "startDate", "created_at"])
      ) || "غير محدد",
    subscriptionNumber:
      getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"]) ||
      `#WSL-${String(getFirstValue(subscription, ["id", "_id"], "0000")).slice(-4)}`,
    pricePerAmpere: pricePerAmpere ? `${pricePerAmpere} شيكل` : "75 شيكل",
    invoice: {
      currentBill: String(
        getFirstValue(subscription, ["current_bill", "currentBill", "bill_amount"], pricePerAmpere || 75)
      ),
      usagePercent: Math.min(
        toNumber(getFirstValue(subscription, ["usage_percent", "usagePercent"], ampereValue * 10)),
        100
      ),
      lastPayment: String(
        getFirstValue(subscription, ["last_payment", "lastPayment"], "0 شيكل")
      ),
      paidBills: String(
        getFirstValue(subscription, ["paid_bills", "paidBills"], "0 فاتورة")
      ),
    },
  };
}

export async function getSubscriptions(params = {}) {
  const response = await api.get("/subscriptions", { params });
  return unwrapList(response.data).map(normalizeSubscription);
}

export async function getMySubscriptions(params = {}) {
  const response = await api.get("/subscriptions/my", { params });
  return unwrapList(response.data).map(normalizeSubscription);
}

export async function getSubscriptionDetails(id) {
  const response = await api.get(`/subscriptions/${id}`);
  return normalizeSubscription(unwrapItem(response.data));
}

export async function createSubscription(data) {
  const response = await api.post("/subscriptions", data);
  return response.data;
}

export async function updateSubscription(id, data) {
  const response = await api.put(`/subscriptions/${id}`, data);
  return normalizeSubscription(unwrapItem(response.data));
}

export async function deleteSubscription(id) {
  const response = await api.delete(`/subscriptions/${id}`);
  return response.data;
}
