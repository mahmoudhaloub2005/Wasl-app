export const providerInvoiceBackendContract = {
  hasCreateInvoiceEndpoint: false,
  hasSubscriberSearchEndpoint: false,
  hasSubscriptionDetailsEndpoint: false,
};

function createMissingEndpointError(action) {
  const error = new Error(
    `Provider invoice ${action} endpoint is not available in the current backend contract.`
  );
  error.code = "PROVIDER_INVOICE_ENDPOINT_MISSING";
  error.action = action;
  throw error;
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

export function normalizeInvoiceSubscriber(subscriber = {}) {
  const customer = subscriber.customer || subscriber.user || subscriber.subscriber || {};
  const subscription = subscriber.subscription || subscriber.currentSubscription || {};

  return {
    id: String(
      getFirstValue(subscriber, ["id", "_id", "uuid", "subscriber_id", "subscriberId"])
    ),
    name: String(
      getFirstValue(
        subscriber,
        ["name", "full_name", "fullName", "subscriberName", "subscriber_name"],
        getFirstValue(customer, ["name", "full_name", "fullName"], "")
      )
    ).trim(),
    phone: getFirstValue(subscriber, ["phone", "mobile", "phone_number", "phoneNumber"], customer.phone || customer.mobile || ""),
    identityNumber: getFirstValue(subscriber, ["identity_number", "identityNumber", "national_id", "nationalId"], ""),
    subscription,
    subscriptionId: getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"], getFirstValue(subscriber, ["subscription_id", "subscriptionId"], "")),
    subscriptionNumber: getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"], getFirstValue(subscriber, ["subscription_number", "subscriptionNumber"], "")),
    raw: subscriber,
  };
}

export function normalizeInvoiceSubscription(subscription = {}) {
  return {
    id: String(getFirstValue(subscription, ["id", "_id", "uuid", "subscription_id", "subscriptionId"])),
    previousReading: getFirstValue(subscription, ["previous_reading", "previousReading", "last_reading", "lastReading", "meter_reading", "meterReading"], ""),
    readingUnit: getFirstValue(subscription, ["reading_unit", "readingUnit", "unit"], "أمبير"),
    subscriptionNumber: getFirstValue(subscription, ["subscription_number", "subscriptionNumber", "number", "code"], ""),
    raw: subscription,
  };
}

export async function searchProviderInvoiceSubscribers() {
  createMissingEndpointError("subscriber-search");
}

export async function getProviderInvoiceSubscriptionDetails() {
  createMissingEndpointError("subscription-details");
}

export async function createProviderInvoice() {
  createMissingEndpointError("create");
}

export const providerInvoicesService = {
  createProviderInvoice,
  getProviderInvoiceSubscriptionDetails,
  normalizeInvoiceSubscriber,
  normalizeInvoiceSubscription,
  providerInvoiceBackendContract,
  searchProviderInvoiceSubscribers,
};

export default providerInvoicesService;
