import api from "./api";
import {
  getScopedStorageKey,
  getStoredToken,
  getStoredUserIdentifiers,
} from "../utils/authStorage";

const GET_MY_SUBSCRIPTIONS_ENDPOINT = "/subscriptions/my";
const SUBSCRIPTIONS_ENDPOINT = "/subscriptions";
const LOCAL_SUBSCRIPTION_KEY = "customer_latest_subscription";

function logSubscriptionDebug(label, details) {
  if (import.meta.env.DEV) {
    console.log(label, details);
  }
}

function logSubscriptionError(label, error) {
  if (import.meta.env.DEV) {
    console.error(label, {
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    });
  }
}

function unwrapList(data) {
  const listCandidates = [
    data,
    data?.data,
    data?.subscriptions,
    data?.data?.subscriptions,
    data?.subscriptions?.data,
    data?.data?.subscriptions?.data,
    data?.items,
    data?.data?.items,
    data?.results,
    data?.data?.results,
    data?.data?.data,
  ];

  const list = listCandidates.find(Array.isArray);

  if (list) return list;
  if (data?.subscription) return [data.subscription];
  if (data?.data?.subscription) return [data.data.subscription];
  if (data?.data && isSubscriptionLike(data.data)) return [data.data];
  if (isSubscriptionLike(data)) return [data];

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

function getLocalSubscriptionStorageKey() {
  return getScopedStorageKey(LOCAL_SUBSCRIPTION_KEY);
}

function isLocalSubscriptionOwnedByCurrentUser(subscription, storageKey) {
  return !subscription?.localOwnerKey || subscription.localOwnerKey === storageKey;
}

export function getLocalCustomerSubscription() {
  const storageKey = getLocalSubscriptionStorageKey();

  if (!storageKey) return null;

  try {
    const value = localStorage.getItem(storageKey);
    const subscription = value ? JSON.parse(value) : null;

    if (!isLocalSubscriptionOwnedByCurrentUser(subscription, storageKey)) {
      return null;
    }

    return subscription;
  } catch (error) {
    console.error("Failed to read local subscription:", error);
    return null;
  }
}

export function saveLocalCustomerSubscription(subscription) {
  const storageKey = getLocalSubscriptionStorageKey();

  if (!storageKey || !subscription) return;

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...subscription,
        localOwnerKey: storageKey,
      })
    );
  } catch (error) {
    console.error("Failed to save local subscription:", error);
  }
}

export function clearLocalCustomerSubscription() {
  const storageKey = getLocalSubscriptionStorageKey();

  if (!storageKey) return;

  localStorage.removeItem(storageKey);
}

function getSubscriptionOwnerIdentifiers(subscription = {}) {
  const ownerValues = [
    getNestedValue({ subscription }, ["subscription.user_id"]),
    getNestedValue({ subscription }, ["subscription.userId"]),
    getNestedValue({ subscription }, ["subscription.customer_id"]),
    getNestedValue({ subscription }, ["subscription.customerId"]),
    getNestedValue({ subscription }, ["subscription.consumer_id"]),
    getNestedValue({ subscription }, ["subscription.consumerId"]),
    getNestedValue({ subscription }, ["subscription.client_id"]),
    getNestedValue({ subscription }, ["subscription.clientId"]),
    getNestedValue({ subscription }, ["subscription.subscriber_id"]),
    getNestedValue({ subscription }, ["subscription.subscriberId"]),
    getNestedValue({ subscription }, ["subscription.user.id"]),
    getNestedValue({ subscription }, ["subscription.user._id"]),
    getNestedValue({ subscription }, ["subscription.user.uuid"]),
    getNestedValue({ subscription }, ["subscription.user.email"]),
    getNestedValue({ subscription }, ["subscription.user.phone"]),
    getNestedValue({ subscription }, ["subscription.customer.id"]),
    getNestedValue({ subscription }, ["subscription.customer._id"]),
    getNestedValue({ subscription }, ["subscription.customer.uuid"]),
    getNestedValue({ subscription }, ["subscription.customer.email"]),
    getNestedValue({ subscription }, ["subscription.customer.phone"]),
    getNestedValue({ subscription }, ["subscription.owner.id"]),
    getNestedValue({ subscription }, ["subscription.owner.email"]),
  ];

  return ownerValues
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function belongsToCurrentUser(subscription, currentUserIdentifiers) {
  if (!currentUserIdentifiers.length) return false;

  const ownerIdentifiers = getSubscriptionOwnerIdentifiers(subscription);

  if (!ownerIdentifiers.length) return false;

  return ownerIdentifiers.some((identifier) =>
    currentUserIdentifiers.includes(identifier)
  );
}

function canUseSubscriptionForCurrentUser(
  subscription,
  currentUserIdentifiers,
  { requireCurrentUserOwner = false } = {}
) {
  const ownerIdentifiers = getSubscriptionOwnerIdentifiers(subscription);

  if (!ownerIdentifiers.length) {
    return !requireCurrentUserOwner;
  }

  return belongsToCurrentUser(subscription, currentUserIdentifiers);
}

function normalizeSubscriptionList(data, { requireCurrentUserOwner = false } = {}) {
  const currentUserIdentifiers = getStoredUserIdentifiers();

  return unwrapList(data)
    .filter(isSubscriptionLike)
    .filter(
      (subscription) =>
        canUseSubscriptionForCurrentUser(subscription, currentUserIdentifiers, {
          requireCurrentUserOwner,
        })
    )
    .map(normalizeSubscription);
}

function isSubscriptionLike(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "id",
    "_id",
    "uuid",
    "subscription_id",
    "subscriptionId",
    "subscription_number",
    "subscriptionNumber",
    "generator",
    "generator_id",
    "generatorId",
    "ampere",
    "amperes",
    "ampere_value",
    "ampereValue",
    "capacity",
    "subscription_capacity",
    "status",
    "state",
  ].some((key) => value[key] !== undefined && value[key] !== null);
}

function toNumber(value, fallback = null) {
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

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "";

  const text = String(value);
  return /شيكل|₪/.test(text) ? text : `${text} شيكل`;
}

function formatAmpere(value) {
  if (value === undefined || value === null || value === "") return "";

  const text = String(value);
  return /أمبير|amp/i.test(text) ? text : `${text} أمبير`;
}

function normalizePaymentPlanText(value) {
  const key = normalizeStatusKey(value);

  if (!key) return "";
  if (key.includes("biweekly") || key.includes("كل أسبوعين")) {
    return "كل أسبوعين";
  }
  if (key.includes("monthly") || key.includes("شهري")) {
    return "شهرياً";
  }

  return String(value);
}

function normalizeGeneratorType(value) {
  const key = normalizeStatusKey(value);

  if (!key) return "";
  if (key.includes("diesel")) return "ديزل";
  if (key.includes("gasoline") || key.includes("petrol")) return "بنزين";
  if (key.includes("gas")) return "غاز";

  return String(value);
}

function normalizeStatusKey(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function isCancelledStatus(status) {
  const value = normalizeStatusKey(status);
  return (
    value.includes("cancel") ||
    value.includes("inactive") ||
    value.includes("ملغ")
  );
}

function isRejectedStatus(status) {
  const value = normalizeStatusKey(status);
  return (
    value.includes("rejected") ||
    value.includes("refused") ||
    value.includes("denied") ||
    value.includes("مرفوض")
  );
}

function isPendingStatus(status) {
  const value = normalizeStatusKey(status);
  return (
    value.includes("pending") ||
    value.includes("waiting") ||
    value.includes("under review") ||
    value.includes("review") ||
    value.includes("قيد") ||
    value.includes("انتظار") ||
    value.includes("مراجعة")
  );
}

function isActiveStatus(status) {
  const value = normalizeStatusKey(status);
  return (
    value.includes("active") ||
    value.includes("approved") ||
    value.includes("enabled") ||
    value.includes("نشط") ||
    value.includes("مفعل")
  );
}

function normalizeStatus(status) {
  if (isRejectedStatus(status)) return "طلب اشتراك مرفوض";
  if (isCancelledStatus(status)) return "اشتراك ملغى";
  if (isPendingStatus(status)) return "طلب اشتراك قيد المراجعة";
  if (isActiveStatus(status)) return "اشتراك نشط";
  return status ? String(status) : "";
}

function normalizeStatusLabel(status) {
  if (isRejectedStatus(status)) return "مرفوض";
  if (isCancelledStatus(status)) return "ملغي";
  if (isPendingStatus(status)) return "قيد المراجعة";
  if (isActiveStatus(status)) return "نشط";
  return status ? String(status) : "";
}

function flattenErrorMessages(value, messages = []) {
  if (!value || messages.length > 12) {
    return messages;
  }

  if (typeof value === "string") {
    messages.push(value);
    return messages;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenErrorMessages(item, messages));
    return messages;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) => flattenErrorMessages(item, messages));
  }

  return messages;
}

function getDuplicateSubscriptionMessage(error) {
  const responseText = flattenErrorMessages(error.response?.data)
    .join(" ")
    .toLowerCase();

  const isDuplicate =
    responseText.includes("already") ||
    responseText.includes("duplicate") ||
    responseText.includes("exist") ||
    responseText.includes("subscribed") ||
    responseText.includes("اشتراك قائم") ||
    responseText.includes("مشترك") ||
    responseText.includes("سابق") ||
    responseText.includes("موجود");

  if (!isDuplicate) return "";

  const isPendingRequest =
    responseText.includes("pending") ||
    responseText.includes("waiting") ||
    responseText.includes("review") ||
    responseText.includes("request") ||
    responseText.includes("طلب") ||
    responseText.includes("قيد") ||
    responseText.includes("انتظار") ||
    responseText.includes("مراجعة");

  return isPendingRequest
    ? "لديك طلب اشتراك سابق لهذا المولد"
    : "أنت مشترك بالفعل في هذا المولد";
}

function withDisplayMessage(error, displayMessage) {
  if (displayMessage) {
    error.displayMessage = displayMessage;
  }

  return error;
}

function createUnavailableOperationError(
  message = "هذه العملية غير متاحة حالياً"
) {
  const error = new Error(message);
  error.displayMessage = message;
  return error;
}

function normalizeProgressSteps(subscription) {
  const steps = getFirstValue(subscription, [
    "progress_steps",
    "progressSteps",
    "steps",
    "journey",
  ]);

  if (!Array.isArray(steps)) return [];

  return steps.map((step, index) => ({
    id: getFirstValue(step, ["id", "_id", "uuid"], index + 1),
    title: getFirstValue(step, ["title", "name", "label"]),
    date:
      formatDate(getFirstValue(step, ["date", "created_at", "createdAt"])) ||
      getFirstValue(step, ["dateLabel", "date_label"]),
    type: getFirstValue(
      step,
      ["type", "status"],
      index === steps.length - 1 ? "active" : "done"
    ),
  }));
}

export function normalizeSubscription(subscription = {}) {
  const generator = subscription.generator || {};
  const invoice = subscription.invoice || {};
  const rawStatus = getFirstValue(subscription, ["status", "state"]);
  const ampereRaw = getFirstValue(subscription, [
    "amperes",
    "ampere",
    "ampere_value",
    "ampereValue",
    "capacity",
    "subscription_capacity",
  ]);
  const pricePerAmpere = getFirstValue(subscription, [
    "price_per_ampere",
    "pricePerAmpere",
    "ampere_price",
    "amperePrice",
    "price",
  ]);
  const subscriptionPrice = getFirstValue(subscription, [
    "monthly_cost",
    "monthlyCost",
    "total_amount",
    "totalAmount",
    "amount",
    "price",
    "cost",
  ]);
  const currentAmpRaw = getFirstValue(subscription, [
    "current_amp",
    "currentAmp",
    "used_ampere",
    "usedAmpere",
    "consumed_ampere",
    "consumedAmpere",
  ]);
  const maxAmpRaw = getFirstValue(subscription, [
    "max_amp",
    "maxAmp",
    "max_ampere",
    "maxAmpere",
    "capacity",
    "subscription_capacity",
  ]);
  const currentBill = getNestedValue(
    { subscription },
    [
      "subscription.invoice.current_bill",
      "subscription.invoice.currentBill",
      "subscription.invoice.amount",
      "subscription.invoice.total_amount",
      "subscription.invoice.totalAmount",
      "subscription.current_bill",
      "subscription.currentBill",
      "subscription.bill_amount",
      "subscription.billAmount",
    ]
  );
  const usagePercent = getNestedValue(
    { subscription },
    [
      "subscription.invoice.usage_percent",
      "subscription.invoice.usagePercent",
      "subscription.usage_percent",
      "subscription.usagePercent",
    ]
  );
  const lastPayment = getNestedValue(
    { subscription },
    [
      "subscription.invoice.last_payment",
      "subscription.invoice.lastPayment",
      "subscription.last_payment",
      "subscription.lastPayment",
    ]
  );
  const paidBills = getNestedValue(
    { subscription },
    [
      "subscription.invoice.paid_bills",
      "subscription.invoice.paidBills",
      "subscription.paid_bills",
      "subscription.paidBills",
    ]
  );
  const ampereValue = toNumber(ampereRaw);
  const currentAmp = toNumber(currentAmpRaw);
  const maxAmp = toNumber(maxAmpRaw, ampereValue);
  const isCancelled = isCancelledStatus(rawStatus);
  const isRejected = isRejectedStatus(rawStatus);
  const isPending = isPendingStatus(rawStatus);
  const isActive = isActiveStatus(rawStatus);

  return {
    id: getFirstValue(subscription, ["id", "_id", "uuid"]),
    generatorId: getNestedValue(
      { subscription, generator },
      [
        "subscription.generator_id",
        "subscription.generatorId",
        "generator.id",
        "generator._id",
        "generator.uuid",
      ],
      null
    ),
    generatorName: getNestedValue(
      { subscription, generator },
      [
        "generator.name",
        "generator.title",
        "generator.generator_name",
        "generator.generatorName",
        "subscription.generator_name",
        "subscription.generatorName",
      ]
    ),
    generatorType: normalizeGeneratorType(
      getNestedValue(
        { subscription, generator },
        [
          "generator.generator_type",
          "generator.generatorType",
          "generator.type",
          "subscription.generator_type",
          "subscription.generatorType",
          "subscription.type",
        ]
      )
    ),
    location: getNestedValue(
      { subscription, generator },
      [
        "generator.area",
        "generator.location",
        "generator.address",
        "generator.city",
        "generator.region",
        "subscription.location",
        "subscription.area",
        "subscription.address",
      ]
    ),
    description: getNestedValue(
      { subscription, generator },
      ["generator.description", "generator.shortDescription", "subscription.description"]
    ),
    rawStatus,
    status: normalizeStatus(rawStatus),
    statusLabel: normalizeStatusLabel(rawStatus),
    statusText: getNestedValue(
      { subscription, generator },
      [
        "generator.status_text",
        "generator.statusText",
        "subscription.status_text",
        "subscription.statusText",
      ]
    ),
    isCancelled,
    isRejected,
    isPending,
    isActive,
    ampereValue,
    ampere: formatAmpere(ampereRaw),
    currentAmp,
    maxAmp,
    ampPrice: pricePerAmpere,
    pricePerAmpereValue: toNumber(pricePerAmpere, ""),
    monthlyCost: toNumber(subscriptionPrice || currentBill || invoice.amount, ""),
    currency: "شيكل",
    paymentPlan: getFirstValue(subscription, ["payment_plan", "paymentPlan"]),
    paymentPlanText:
      getFirstValue(subscription, ["payment_plan_text", "paymentPlanText"]) ||
      normalizePaymentPlanText(
        getFirstValue(subscription, ["payment_plan", "paymentPlan"])
      ),
    requestDate: formatDate(
      getFirstValue(subscription, [
        "requested_at",
        "requestedAt",
        "request_date",
        "requestDate",
        "created_at",
        "createdAt",
      ])
    ),
    startDate: formatDate(
      getFirstValue(subscription, [
        "start_date",
        "startDate",
        "activated_at",
        "activatedAt",
        "created_at",
        "createdAt",
      ])
    ),
    subscriptionNumber: getFirstValue(subscription, [
      "subscription_number",
      "subscriptionNumber",
      "request_number",
      "requestNumber",
      "number",
      "code",
    ]),
    pricePerAmpere: formatCurrency(pricePerAmpere),
    priceText: formatCurrency(subscriptionPrice || currentBill || invoice.amount),
    invoice: {
      currentBill: formatCurrency(currentBill),
      usagePercent: usagePercent === "" ? "" : toNumber(usagePercent, ""),
      lastPayment: formatCurrency(lastPayment),
      paidBills:
        paidBills === ""
          ? ""
          : /فاتورة/.test(String(paidBills))
            ? String(paidBills)
            : `${paidBills} فاتورة`,
    },
    progressSteps: normalizeProgressSteps(subscription),
  };
}

function getCurrentActiveSubscription(subscriptions) {
  return (
    subscriptions.find(
      (subscription) => !subscription.isCancelled && subscription.isActive
    ) || null
  );
}

function getVisibleSubscription(subscriptions) {
  return (
    subscriptions.find((subscription) => subscription.isActive) ||
    subscriptions.find((subscription) => subscription.isPending) ||
    subscriptions.find((subscription) => subscription.isRejected) ||
    null
  );
}

export function isSameGeneratorId(left, right) {
  if (left === undefined || left === null || right === undefined || right === null) {
    return false;
  }

  return String(left) === String(right);
}

function getSubscriptionForGenerator(subscriptions, generatorId) {
  return (
    subscriptions.find(
      (subscription) =>
        isSameGeneratorId(subscription.generatorId, generatorId) &&
        (subscription.isPending || subscription.isActive)
    ) || null
  );
}

export async function getSubscriptions(params = {}) {
  const response = await api.get(SUBSCRIPTIONS_ENDPOINT, { params });
  return normalizeSubscriptionList(response.data);
}

export async function getMySubscriptions(params = {}) {
  try {
    logSubscriptionDebug("get subscriptions request", {
      endpoint: GET_MY_SUBSCRIPTIONS_ENDPOINT,
      hasToken: Boolean(getStoredToken()),
      params,
    });

    const response = await api.get(GET_MY_SUBSCRIPTIONS_ENDPOINT, { params });

    logSubscriptionDebug("get subscriptions response", {
      endpoint: GET_MY_SUBSCRIPTIONS_ENDPOINT,
      status: response.status,
      data: response.data,
    });

    return normalizeSubscriptionList(response.data);
  } catch (error) {
    logSubscriptionError("get subscriptions error response", error);

    if (error.response?.status === 404 || error.response?.status === 405) {
      logSubscriptionDebug("get subscriptions fallback request", {
        endpoint: SUBSCRIPTIONS_ENDPOINT,
        hasToken: Boolean(getStoredToken()),
        params,
      });

      const fallbackResponse = await api.get(SUBSCRIPTIONS_ENDPOINT, { params });

      logSubscriptionDebug("get subscriptions response", {
        endpoint: SUBSCRIPTIONS_ENDPOINT,
        status: fallbackResponse.status,
        data: fallbackResponse.data,
      });

      return normalizeSubscriptionList(fallbackResponse.data, {
        requireCurrentUserOwner: true,
      });
    }

    throw error;
  }
}

export async function getCurrentSubscription(params = {}) {
  const subscriptions = await getMySubscriptions(params);
  return getCurrentActiveSubscription(subscriptions);
}

export async function getCustomerSubscriptionForDisplay(params = {}) {
  const subscriptions = await getMySubscriptions(params);
  return getVisibleSubscription(subscriptions);
}

export async function getMySubscriptionForGenerator(generatorId, params = {}) {
  const subscriptions = await getMySubscriptions(params);
  return getSubscriptionForGenerator(subscriptions, generatorId);
}

export async function getSubscriptionDetails(id) {
  throw createUnavailableOperationError(
    "تفاصيل الاشتراك الفردية غير متاحة حالياً من الخادم."
  );
}

export async function createSubscription(data) {
  const payload = {
    generator_id: data.generator_id,
    amperes: data.amperes ?? data.ampere ?? data.ampereValue,
    payment_plan: data.payment_plan ?? data.paymentPlan,
  };

  if (data.monthly_cost !== undefined) {
    payload.monthly_cost = data.monthly_cost;
  }

  try {
    logSubscriptionDebug("create subscription request", {
      endpoint: SUBSCRIPTIONS_ENDPOINT,
      hasToken: Boolean(getStoredToken()),
      payload,
    });

    const response = await api.post(SUBSCRIPTIONS_ENDPOINT, payload);

    logSubscriptionDebug("create subscription response", {
      endpoint: SUBSCRIPTIONS_ENDPOINT,
      status: response.status,
      data: response.data,
    });

    const subscription = unwrapItem(response.data);
    return isSubscriptionLike(subscription)
      ? normalizeSubscription(subscription)
      : response.data;
  } catch (error) {
    logSubscriptionError("create subscription error response", error);
    throw withDisplayMessage(error, getDuplicateSubscriptionMessage(error));
  }
}

export async function updateSubscription(id, data) {
  throw createUnavailableOperationError(
    "تعديل الاشتراك غير متاح حالياً من الخادم."
  );
}

export async function deleteSubscription(id) {
  const response = await api.delete(`${SUBSCRIPTIONS_ENDPOINT}/${id}`);
  return response.data;
}
