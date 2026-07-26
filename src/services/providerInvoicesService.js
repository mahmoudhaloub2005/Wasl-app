import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapItem,
  unwrapList,
} from "./apiResponse";
import { getProviderSubscribers } from "./providerSubscriptionsService";

export const providerInvoiceBackendContract = {
  hasCreateInvoiceEndpoint: true,
  hasSubscriberSearchEndpoint: false,
  hasSubscriptionDetailsEndpoint: false,
};

function getSubscription(source = {}) {
  return source.subscription || source.currentSubscription || source.current_subscription || source.raw?.subscription || source;
}

export function normalizeInvoiceSubscriber(subscriber = {}) {
  const subscription = getSubscription(subscriber);
  const raw = subscriber.raw || subscriber;
  const customer = raw.customer || raw.user || raw.subscriber || raw.client || {};
  const id = String(
    getFirstValue(subscriber, ["id", "subscriptionId", "subscription_id"]) ||
      getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"])
  );
  const name = sanitizeText(
    getFirstValue(subscriber, ["name", "customerName", "subscriberName"]) ||
      getFirstValue(customer, ["name", "full_name", "fullName"]),
    "مشترك"
  );

  return {
    id,
    name,
    phone: sanitizeText(getFirstValue(subscriber, ["phone", "mobile"]) || getFirstValue(customer, ["phone", "mobile"])),
    identityNumber: sanitizeText(getFirstValue(raw, ["identity_number", "identityNumber", "national_id", "nationalId"])),
    subscription,
    subscriptionId: String(
      getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"]) || id
    ),
    subscriptionNumber: sanitizeText(
      getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"]) ||
        subscriber.subscriptionNumber
    ),
    raw,
  };
}

export function normalizeInvoiceSubscription(subscription = {}) {
  return {
    id: String(getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"])),
    previousReading: getFirstValue(subscription, ["previous_reading", "previousReading", "last_reading", "lastReading", "meter_reading", "meterReading"], 0),
    readingUnit: getFirstValue(subscription, ["reading_unit", "readingUnit", "unit"], "KW"),
    subscriptionNumber: getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"]),
    raw: subscription,
  };
}

export function normalizeProviderInvoice(invoice = {}, index = 0) {
  const subscription = invoice.subscription || {};
  const customer = invoice.customer || subscription.customer || invoice.user || {};
  const id = String(
    getFirstValue(invoice, ["id", "_id", "uuid", "invoice_id", "invoiceId", "invoice_number", "invoiceNumber"]) ||
      `invoice-${index}`
  );
  const amount = toNumber(getFirstValue(invoice, ["amount", "total", "total_amount", "totalAmount"]));
  const status = String(getFirstValue(invoice, ["status", "state", "payment_status", "paymentStatus"], "draft"))
    .trim()
    .toLowerCase();

  return {
    id,
    amount,
    customerName: sanitizeText(
      getFirstValue(invoice, ["customerName", "customer_name", "subscriberName", "subscriber_name"]) ||
        getFirstValue(customer, ["name", "full_name", "fullName"]),
      "مشترك"
    ),
    currentReading: toNumber(getFirstValue(invoice, ["current_reading", "currentReading"])),
    dueDate: getFirstValue(invoice, ["due_date", "dueDate", "deadline"]),
    invoiceNumber: sanitizeText(getFirstValue(invoice, ["invoice_number", "invoiceNumber", "number", "code"], `#${id}`)),
    previousReading: toNumber(getFirstValue(invoice, ["previous_reading", "previousReading"])),
    subscriptionId: String(
      getFirstValue(invoice, ["subscription_id", "subscriptionId"]) ||
        getFirstValue(subscription, ["id", "_id", "uuid"])
    ),
    status,
    raw: invoice,
  };
}

export async function searchProviderInvoiceSubscribers(query = "") {
  const subscribers = (await getProviderSubscribers()).map(normalizeInvoiceSubscriber);
  const searchValue = String(query || "").trim().toLowerCase();

  if (!searchValue) return subscribers;

  return subscribers.filter((subscriber) =>
    [subscriber.name, subscriber.phone, subscriber.subscriptionNumber, subscriber.subscriptionId]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchValue)
  );
}

export async function getProviderInvoiceSubscriptionDetails(subscriptionId) {
  const subscribers = await getProviderSubscribers();
  const subscriber = subscribers.find((item) => String(item.id) === String(subscriptionId));

  if (!subscriber) {
    const error = new Error("تعذر العثور على الاشتراك المحدد.");
    error.displayMessage = error.message;
    throw error;
  }

  return normalizeInvoiceSubscription(subscriber.subscription || subscriber.raw?.subscription || subscriber.raw || subscriber);
}

export async function getProviderInvoices() {
  const response = await api.get("/provider/invoices");
  return unwrapList(response.data, ["invoices"]).map(normalizeProviderInvoice);
}

export async function createProviderInvoice(payload = {}) {
  const requestPayload = {
    subscription_id: payload.subscription_id || payload.subscriptionId,
    previous_reading: toNumber(payload.previous_reading ?? payload.previousReading),
    current_reading: toNumber(payload.current_reading ?? payload.currentReading),
    due_date: payload.due_date || payload.dueDate,
  };

  try {
    const response = await api.post("/invoices", requestPayload);
    return normalizeProviderInvoice(unwrapItem(response.data, ["invoice"]));
  } catch (error) {
    throw createServiceError(error, "تعذر إصدار الفاتورة.");
  }
}

export const providerInvoicesService = {
  createProviderInvoice,
  getProviderInvoiceSubscriptionDetails,
  getProviderInvoices,
  normalizeInvoiceSubscriber,
  normalizeInvoiceSubscription,
  providerInvoiceBackendContract,
  searchProviderInvoiceSubscribers,
};

export default providerInvoicesService;
