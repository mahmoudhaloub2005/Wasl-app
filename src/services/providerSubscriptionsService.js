import api from "./api";
import {
  createServiceError,
  getFirstValue,
  getNestedValue,
  sanitizeText,
  toNumber,
  unwrapList,
} from "./apiResponse";

const PROVIDER_SUBSCRIBERS_ENDPOINT = "/provider/subscribers";

function normalizeId(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
}

function buildInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => Array.from(part)[0]).join(" ") || "؟";
}

function normalizeStatus(value) {
  const status = String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ");

  if (status.includes("pending") || status.includes("waiting") || status.includes("review") || status.includes("قيد")) {
    return "pending";
  }

  if (status.includes("reject") || status.includes("declined") || status.includes("مرفوض")) {
    return "rejected";
  }

  if (status.includes("cancel") || status.includes("inactive") || status.includes("ملغ")) {
    return "cancelled";
  }

  return "active";
}

function getSubscription(record = {}) {
  return record.subscription || record.currentSubscription || record.current_subscription || record;
}

function getCustomer(record = {}) {
  return record.customer || record.subscriber || record.user || record.client || record.consumer || {};
}

function getSubscriptionId(record = {}) {
  const subscription = getSubscription(record);

  return normalizeId(
    getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"]) ||
      getFirstValue(record, ["subscription_id", "subscriptionId", "id", "_id", "uuid"])
  );
}

function getCustomerName(record = {}) {
  const customer = getCustomer(record);

  return sanitizeText(
    getFirstValue(record, ["customerName", "customer_name", "subscriberName", "subscriber_name", "name"]) ||
      getFirstValue(customer, ["full_name", "fullName", "name", "first_name"]),
    "مشترك"
  );
}

export function normalizeSubscriptionRecord(record = {}) {
  const subscription = getSubscription(record);
  const customer = getCustomer(record);
  const customerName = getCustomerName(record);
  const status = normalizeStatus(
    getFirstValue(subscription, ["status", "state"]) || getFirstValue(record, ["status", "state"])
  );
  const city = sanitizeText(
    getNestedValue({ record, subscription, customer }, [
      "record.city",
      "record.area.name",
      "subscription.area.name",
      "subscription.generator.area",
      "customer.city",
      "customer.area.name",
      "customer.address.city",
    ])
  );
  const street = sanitizeText(
    getNestedValue({ record, subscription, customer }, [
      "record.street",
      "record.address",
      "subscription.address",
      "customer.street",
      "customer.address.street",
    ])
  );

  return {
    id: getSubscriptionId(record),
    raw: record,
    subscription,
    subscriptionId: getSubscriptionId(record),
    subscriptionNumber: sanitizeText(
      getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"])
    ),
    customerName,
    name: customerName,
    initials: buildInitials(customerName),
    ampere: toNumber(
      getFirstValue(subscription, ["ampere", "amperes", "requested_ampere", "requestedAmpere", "capacity"])
    ),
    phone: sanitizeText(
      getFirstValue(record, ["phone", "mobile"]) || getFirstValue(customer, ["phone", "mobile", "phone_number"])
    ),
    city,
    street,
    status,
    requestedAt:
      getFirstValue(subscription, ["requested_at", "requestedAt", "created_at", "createdAt"]) ||
      getFirstValue(record, ["requested_at", "requestedAt", "created_at", "createdAt"]),
    acceptedAt:
      getFirstValue(subscription, ["accepted_at", "acceptedAt", "approved_at", "approvedAt"]) ||
      getFirstValue(record, ["accepted_at", "acceptedAt", "approved_at", "approvedAt"]),
    subscribedAt:
      getFirstValue(subscription, ["accepted_at", "acceptedAt", "approved_at", "approvedAt", "created_at", "createdAt"]) ||
      getFirstValue(record, ["accepted_at", "acceptedAt", "created_at", "createdAt"]),
    priority: sanitizeText(getFirstValue(record, ["priority"], "normal"), "normal"),
  };
}

function sortByNewest(firstRecord, secondRecord) {
  const firstDate = new Date(firstRecord.requestedAt || firstRecord.acceptedAt || 0).getTime();
  const secondDate = new Date(secondRecord.requestedAt || secondRecord.acceptedAt || 0).getTime();
  return secondDate - firstDate;
}

export async function getProviderSubscribers() {
  const response = await api.get(PROVIDER_SUBSCRIBERS_ENDPOINT);

  return unwrapList(response.data, ["subscribers", "subscriptions", "requests"])
    .map(normalizeSubscriptionRecord)
    .filter((subscriber) => subscriber.id)
    .sort(sortByNewest);
}

export async function getProviderSubscriptionRequests() {
  const subscribers = await getProviderSubscribers();
  return subscribers.filter((subscriber) => subscriber.status === "pending");
}

export async function getProviderSubscriptions() {
  const subscribers = await getProviderSubscribers();
  return subscribers.filter((subscriber) => subscriber.status === "active");
}

export async function acceptProviderSubscriptionRequest(requestId) {
  try {
    const response = await api.put(`/subscriptions/${requestId}/approve`);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "تعذر قبول طلب الاشتراك.");
  }
}

export async function rejectProviderSubscriptionRequest(requestId) {
  try {
    const response = await api.put(`/subscriptions/${requestId}/reject`);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "تعذر رفض طلب الاشتراك.");
  }
}

export const providerSubscriptionsService = {
  acceptProviderSubscriptionRequest,
  getProviderSubscribers,
  getProviderSubscriptionRequests,
  getProviderSubscriptions,
  rejectProviderSubscriptionRequest,
};

export default providerSubscriptionsService;
