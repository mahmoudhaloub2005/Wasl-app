import { getCurrentProviderAccountKey } from "./providerAccount";
import {
  getProviderDemoRecords,
  updateProviderDemoRecords,
} from "./providerDemoStore";

const SERVICE_DELAY_MS = 260;

function delay(duration = SERVICE_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeId(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
}

function getRecordId(record) {
  const directId = normalizeId(
    record?.id ||
      record?.requestId ||
      record?.request_id ||
      record?.subscriptionId ||
      record?.subscription_id ||
      record?.customerId ||
      record?.customer_id ||
      record?.phone
  );

  if (directId) return directId;

  return normalizeId(
    [
      record?.customerName,
      record?.subscriberName,
      record?.name,
      record?.customer?.name,
      record?.subscriber?.name,
      record?.phone,
      record?.requestedAt || record?.requested_at || record?.createdAt,
    ]
      .filter(Boolean)
      .join("-")
  );
}

function matchesRecordId(record, id) {
  const targetId = normalizeId(id);

  if (!targetId) return false;

  return [
    getRecordId(record),
    record?.id,
    record?.requestId,
    record?.request_id,
    record?.subscriptionId,
    record?.subscription_id,
    record?.customerId,
    record?.customer_id,
    record?.phone,
  ].some((value) => normalizeId(value) === targetId);
}

function getFirstNonEmptyValue(values) {
  return values.find((value) => String(value || "").trim()) || "";
}

function getCustomerName(record) {
  return String(
    getFirstNonEmptyValue([
      record?.customerName,
      record?.subscriberName,
      record?.name,
      record?.customer?.full_name,
      record?.customer?.fullName,
      record?.customer?.name,
      record?.subscriber?.full_name,
      record?.subscriber?.fullName,
      record?.subscriber?.name,
    ]) || "مشترك"
  ).trim();
}

function buildInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => Array.from(part)[0]).join(" ") || "?";
}

function normalizeSubscriptionRecord(record, fallbackStatus) {
  const customerName = getCustomerName(record);
  const city = getFirstNonEmptyValue([
    record?.city,
    record?.area?.name,
    typeof record?.area === "string" ? record.area : "",
    record?.location?.city,
    record?.address?.city,
  ]);
  const street = getFirstNonEmptyValue([
    record?.street,
    record?.addressLine,
    record?.address_line,
    record?.location?.street,
    record?.address?.street,
  ]);

  return {
    id: getRecordId(record),
    customerName,
    initials: record?.initials || buildInitials(customerName),
    ampere: Number(record?.ampere || record?.requestedAmpere || record?.requested_ampere || 0),
    phone:
      record?.phone ||
      record?.mobile ||
      record?.customer?.phone ||
      record?.subscriber?.phone ||
      "",
    city,
    street,
    status: record?.status || fallbackStatus,
    requestedAt:
      record?.requestedAt ||
      record?.requested_at ||
      record?.createdAt ||
      record?.created_at ||
      "",
    acceptedAt: record?.acceptedAt || record?.accepted_at || "",
    priority: record?.priority || "normal",
  };
}

function sortByNewest(firstRecord, secondRecord) {
  const firstDate = new Date(
    firstRecord.requestedAt || firstRecord.acceptedAt || firstRecord.createdAt || 0
  ).getTime();
  const secondDate = new Date(
    secondRecord.requestedAt || secondRecord.acceptedAt || secondRecord.createdAt || 0
  ).getTime();

  return secondDate - firstDate;
}

function getRequestRecords(records) {
  const directRequests = records.subscriptionRequests || [];
  const legacyPendingSubscriptions = (records.subscriptions || []).filter(
    (subscription) => subscription.status === "pending"
  );
  const uniqueRequests = new Map();

  [...directRequests, ...legacyPendingSubscriptions].forEach((request) => {
    const id = getRecordId(request);
    uniqueRequests.set(id || `request-${uniqueRequests.size}`, request);
  });

  return [...uniqueRequests.values()];
}

function buildSubscriptionActivity(action, request, createdAt) {
  const customerName = getCustomerName(request);
  const isAccepted = action === "accepted";

  return {
    id: `subscription-${action}-${getRecordId(request) || Date.now()}-${createdAt}`,
    type: `subscription-${action}`,
    title: isAccepted ? "تم قبول طلب اشتراك" : "تم رفض طلب اشتراك",
    meta: `المشترك: ${customerName}`,
    iconKey: isAccepted ? "users" : "alert",
    tone: isAccepted ? "orange" : "red",
    path: "/provider/subscriptions",
    createdAt,
  };
}

function getRecords() {
  return getProviderDemoRecords(getCurrentProviderAccountKey());
}

export async function getProviderSubscriptionRequests() {
  await delay();

  return cloneData(
    getRequestRecords(getRecords())
      .map((request) => normalizeSubscriptionRecord(request, "pending"))
      .sort(sortByNewest)
  );
}

export async function getProviderSubscriptions() {
  await delay();

  return cloneData(
    (getRecords().subscriptions || [])
      .filter((subscription) => subscription.status === "active")
      .map((subscription) => normalizeSubscriptionRecord(subscription, "active"))
      .sort(sortByNewest)
  );
}

export async function acceptProviderSubscriptionRequest(requestId) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const pendingRequests = getRequestRecords(records);
  const acceptedRequest = pendingRequests.find((request) =>
    matchesRecordId(request, requestId)
  );

  if (!acceptedRequest) {
    throw new Error("تعذر العثور على طلب الاشتراك.");
  }

  const acceptedAt = new Date().toISOString();
  const normalizedRequest = normalizeSubscriptionRecord(acceptedRequest, "active");
  const nextSubscription = {
    ...acceptedRequest,
    id: acceptedRequest.subscriptionId || `subscription-${normalizedRequest.id || Date.now()}`,
    requestId: normalizedRequest.id,
    customerName: normalizedRequest.customerName,
    initials: normalizedRequest.initials,
    ampere: normalizedRequest.ampere,
    phone: normalizedRequest.phone,
    city: normalizedRequest.city,
    street: normalizedRequest.street,
    status: "active",
    createdAt: acceptedAt,
    acceptedAt,
  };

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    subscriptionRequests: (currentRecords.subscriptionRequests || []).filter(
      (request) => !matchesRecordId(request, requestId)
    ),
    subscriptions: [
      nextSubscription,
      ...(currentRecords.subscriptions || []).filter(
        (subscription) => !matchesRecordId(subscription, requestId)
      ),
    ],
    activities: [
      buildSubscriptionActivity("accepted", acceptedRequest, acceptedAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return cloneData(normalizeSubscriptionRecord(nextSubscription, "active"));
}

export async function rejectProviderSubscriptionRequest(requestId) {
  await delay(220);

  const accountKey = getCurrentProviderAccountKey();
  const records = getProviderDemoRecords(accountKey);
  const pendingRequests = getRequestRecords(records);
  const rejectedRequest = pendingRequests.find((request) =>
    matchesRecordId(request, requestId)
  );

  if (!rejectedRequest) {
    throw new Error("تعذر العثور على طلب الاشتراك.");
  }

  const rejectedAt = new Date().toISOString();

  updateProviderDemoRecords(accountKey, (currentRecords) => ({
    subscriptionRequests: (currentRecords.subscriptionRequests || []).filter(
      (request) => !matchesRecordId(request, requestId)
    ),
    subscriptions: (currentRecords.subscriptions || []).filter(
      (subscription) =>
        subscription.status !== "pending" || !matchesRecordId(subscription, requestId)
    ),
    activities: [
      buildSubscriptionActivity("rejected", rejectedRequest, rejectedAt),
      ...(currentRecords.activities || []),
    ],
  }));

  return { id: normalizeId(requestId), status: "rejected" };
}

export const providerSubscriptionsService = {
  getProviderSubscriptionRequests,
  getProviderSubscriptions,
  acceptProviderSubscriptionRequest,
  rejectProviderSubscriptionRequest,
};

export default providerSubscriptionsService;
