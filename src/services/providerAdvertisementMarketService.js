import api from "./api";

export const MARKET_ANALYTICS_ENDPOINTS = {
  currentUser: "/user",
  generators: "/generators",
  subscriptions: "/subscriptions",
};

const NO_ENOUGH_DATA = "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0643\u0627\u0641\u064a\u0629";
const UNAVAILABLE_NOW = "\u063a\u064a\u0631 \u0645\u062a\u0627\u062d \u062d\u0627\u0644\u064a\u0627\u064b";
const COMPLETE_PROFILE_AREA_MESSAGE = "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0645\u0632\u0648\u062f \u0641\u064a \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a \u0644\u0639\u0631\u0636 \u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0627\u0644\u0633\u0648\u0642.";
const EMPTY_MARKET_MESSAGE = "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0633\u0648\u0642 \u0645\u062a\u0627\u062d\u0629 \u0641\u064a \u0645\u0646\u0637\u0642\u062a\u0643 \u062d\u0627\u0644\u064a\u0627\u064b.";
const ERROR_MESSAGE = "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0627\u0644\u0633\u0648\u0642. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.";

function unwrapList(data) {
  const listCandidates = [
    data,
    data?.data,
    data?.items,
    data?.records,
    data?.results,
    data?.generators,
    data?.data?.generators,
    data?.subscriptions,
    data?.data?.subscriptions,
    data?.data?.items,
    data?.data?.records,
  ];

  return listCandidates.find(Array.isArray) || [];
}

function unwrapUser(data) {
  return (
    data?.data?.provider ||
    data?.provider ||
    data?.data?.user ||
    data?.user ||
    data?.data ||
    data ||
    {}
  );
}

function getPathValue(source, path) {
  return path.split(".").reduce((current, key) => current?.[key], source);
}

function sanitizeText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return "";

  const text = String(value).trim();

  if (!text || ["undefined", "null", "NaN", "[object Object]"].includes(text)) {
    return "";
  }

  return text;
}

function getFirstValue(source, paths) {
  for (const path of paths) {
    const value = getPathValue(source, path);
    const cleanValue = sanitizeText(value);

    if (cleanValue) return cleanValue;
  }

  return "";
}

function getAreaFromValue(value) {
  if (!value) return "";

  if (typeof value === "object") {
    return getFirstValue(value, [
      "name",
      "area.name",
      "area",
      "city",
      "region",
      "neighborhood",
      "location.name",
      "location",
      "address",
    ]);
  }

  return sanitizeText(value);
}

function normalizeArea(value) {
  return getAreaFromValue(value)
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[\s,_-]+/g, " ")
    .trim();
}

function areasMatch(recordArea, providerArea) {
  const normalizedRecordArea = normalizeArea(recordArea);
  const normalizedProviderArea = normalizeArea(providerArea);

  if (!normalizedRecordArea || !normalizedProviderArea) return false;

  return (
    normalizedRecordArea === normalizedProviderArea ||
    normalizedRecordArea.includes(normalizedProviderArea) ||
    normalizedProviderArea.includes(normalizedRecordArea)
  );
}

function extractProviderArea(user) {
  return getAreaFromValue(
    getFirstValue({ user }, [
      "user.provider.area.name",
      "user.provider.area",
      "user.provider.city",
      "user.provider.region",
      "user.provider.neighborhood",
      "user.provider.location.name",
      "user.provider.location",
      "user.provider.address",
      "user.area.name",
      "user.area",
      "user.city",
      "user.region",
      "user.neighborhood",
      "user.location.name",
      "user.location",
      "user.address",
      "user.company.area.name",
      "user.company.area",
      "user.company.city",
      "user.company.region",
    ])
  );
}

function normalizeStatus(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function isBlockedRecord(record) {
  const status = normalizeStatus(
    getFirstValue({ record }, [
      "record.status",
      "record.state",
      "record.approval_status",
      "record.approvalStatus",
      "record.provider.status",
      "record.provider.state",
      "record.provider.approval_status",
      "record.provider.approvalStatus",
    ])
  );

  return [
    "inactive",
    "deleted",
    "rejected",
    "refused",
    "disabled",
    "blocked",
    "cancelled",
    "canceled",
    "unavailable",
    "\u0645\u0631\u0641\u0648\u0636",
    "\u0645\u0644\u063a\u0649",
    "\u063a\u064a\u0631 \u0646\u0634\u0637",
  ].some((blockedStatus) => status.includes(blockedStatus));
}

function getGeneratorArea(generator) {
  return getAreaFromValue(
    getFirstValue({ generator }, [
      "generator.provider.area.name",
      "generator.provider.area",
      "generator.provider.city",
      "generator.provider.region",
      "generator.provider.location.name",
      "generator.provider.location",
      "generator.provider.address",
      "generator.provider_area",
      "generator.providerArea",
      "generator.area.name",
      "generator.area",
      "generator.city",
      "generator.region",
      "generator.location.name",
      "generator.location",
      "generator.address",
    ])
  );
}

function getSubscriptionArea(subscription, generatorAreaById) {
  const area = getAreaFromValue(
    getFirstValue({ subscription }, [
      "subscription.generator.area.name",
      "subscription.generator.area",
      "subscription.generator.city",
      "subscription.generator.region",
      "subscription.generator.location.name",
      "subscription.generator.location",
      "subscription.generator.address",
      "subscription.area.name",
      "subscription.area",
      "subscription.city",
      "subscription.region",
      "subscription.location.name",
      "subscription.location",
      "subscription.address",
    ])
  );

  if (area) return area;

  return generatorAreaById.get(getSubscriptionGeneratorId(subscription)) || "";
}

function getGeneratorId(generator) {
  return getFirstValue({ generator }, [
    "generator.id",
    "generator._id",
    "generator.uuid",
    "generator.slug",
  ]);
}

function getSubscriptionGeneratorId(subscription) {
  return getFirstValue({ subscription }, [
    "subscription.generator_id",
    "subscription.generatorId",
    "subscription.generator.id",
    "subscription.generator._id",
    "subscription.generator.uuid",
  ]);
}

function getProviderIdentity(generator) {
  return getFirstValue({ generator }, [
    "generator.provider.id",
    "generator.provider._id",
    "generator.provider.uuid",
    "generator.provider.user.id",
    "generator.provider.user._id",
    "generator.provider_id",
    "generator.providerId",
    "generator.user_id",
    "generator.owner_id",
    "generator.provider.email",
    "generator.provider.phone",
    "generator.provider.company_name",
    "generator.provider.name",
    "generator.provider_name",
    "generator.providerCompanyName",
    "generator.company_name",
  ]);
}

function getGeneratorPrice(generator) {
  const rawPrice = getFirstValue({ generator }, [
    "generator.price_per_ampere",
    "generator.pricePerAmpere",
    "generator.ampere_price",
    "generator.amperePrice",
    "generator.price",
    "generator.monthly_price",
    "generator.generator_price",
  ]);
  const price = Number(String(rawPrice).replace(/[^\d.-]/g, ""));

  return Number.isFinite(price) && price > 0 ? price : null;
}

function getActivityDate(record) {
  const rawDate = getFirstValue({ record }, [
    "record.requested_at",
    "record.requestedAt",
    "record.request_date",
    "record.requestDate",
    "record.created_at",
    "record.createdAt",
    "record.updated_at",
    "record.updatedAt",
    "record.start_date",
    "record.startDate",
  ]);
  const date = new Date(rawDate);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameMonth(date, targetDate) {
  return (
    date &&
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth()
  );
}

function getPreviousMonthDate(now) {
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
}

function formatArabicNumber(value, options = {}) {
  return new Intl.NumberFormat("ar", options).format(value);
}

function formatAveragePrice(prices) {
  if (!prices.length) return NO_ENOUGH_DATA;

  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const roundedAverage = Math.round(average);

  return formatArabicNumber(roundedAverage) + " \u0634\u064a\u0643\u0644";
}

function formatProviderCount(count) {
  if (!Number.isFinite(count) || count < 1) return NO_ENOUGH_DATA;
  if (count === 1) return "\u0645\u0632\u0648\u062f \u0648\u0627\u062d\u062f";
  if (count === 2) return "\u0645\u0632\u0648\u062f\u0627\u0646";
  if (count <= 10) return formatArabicNumber(count) + " \u0645\u0632\u0648\u062f\u0648\u0646";

  return formatArabicNumber(count) + " \u0645\u0632\u0648\u062f";
}

function calculateGrowth(currentMonthActivity, previousMonthActivity) {
  if (previousMonthActivity === 0 && currentMonthActivity === 0) {
    return {
      direction: "flat",
      percentage: 0,
      label: "\u0644\u0627 \u064a\u0648\u062c\u062f \u062a\u063a\u064a\u0631 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    };
  }

  if (previousMonthActivity === 0) {
    return {
      direction: "up",
      percentage: 100,
      label: "\u0646\u0645\u0648 \u0628\u0646\u0633\u0628\u0629 " + formatArabicNumber(100) + "% \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    };
  }

  const percentage = Math.round(
    ((currentMonthActivity - previousMonthActivity) / previousMonthActivity) * 100
  );

  if (percentage > 0) {
    return {
      direction: "up",
      percentage,
      label: "\u0646\u0645\u0648 \u0628\u0646\u0633\u0628\u0629 " + formatArabicNumber(percentage) + "% \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    };
  }

  if (percentage < 0) {
    return {
      direction: "down",
      percentage,
      label: "\u0627\u0646\u062e\u0641\u0627\u0636 \u0628\u0646\u0633\u0628\u0629 " + formatArabicNumber(Math.abs(percentage)) + "% \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    };
  }

  return {
    direction: "flat",
    percentage: 0,
    label: "\u0644\u0627 \u064a\u0648\u062c\u062f \u062a\u063a\u064a\u0631 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
  };
}

function calculateDemandStatus({ activeProvidersCount, currentMonthActivity, hasDatedActivity }) {
  // Demand is derived from current-month subscription/request activity per active provider in the same area.
  if (!hasDatedActivity || activeProvidersCount < 1) return UNAVAILABLE_NOW;
  if (currentMonthActivity === 0) return "\u0645\u0646\u062e\u0641\u0636";

  const activityPerProvider = currentMonthActivity / activeProvidersCount;

  if (activityPerProvider >= 10) return "\u0645\u0631\u062a\u0641\u0639 \u062c\u062f\u0627\u064b";
  if (activityPerProvider >= 4) return "\u0645\u0631\u062a\u0641\u0639";
  if (activityPerProvider >= 1) return "\u0645\u0633\u062a\u0642\u0631";

  return "\u0645\u0646\u062e\u0641\u0636";
}

function makeCards({ averagePriceLabel = NO_ENOUGH_DATA, providersCountLabel = NO_ENOUGH_DATA, demandStatus = UNAVAILABLE_NOW } = {}) {
  return [
    {
      id: "average-price",
      label: "\u0645\u062a\u0648\u0633\u0637 \u0633\u0639\u0631 \u0627\u0644\u0623\u0645\u0628\u064a\u0631",
      value: averagePriceLabel,
      iconKey: "wallet",
      tone: "blue",
    },
    {
      id: "providers-count",
      label: "\u0639\u062f\u062f \u0627\u0644\u0645\u0632\u0648\u062f\u064a\u0646 \u0641\u064a \u0627\u0644\u0645\u0646\u0637\u0642\u0629",
      value: providersCountLabel,
      iconKey: "network",
      tone: "orange",
    },
    {
      id: "demand-status",
      label: "\u062d\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628",
      value: demandStatus,
      iconKey: "bolt",
      tone: "green",
    },
  ];
}

export function getMarketAnalyticsLoadingState() {
  return {
    status: "loading",
    area: "",
    growthDirection: "loading",
    growthLabel: "\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a...",
    cards: makeCards({
      averagePriceLabel: "",
      providersCountLabel: "",
      demandStatus: "",
    }),
  };
}

export function getMarketAnalyticsErrorState(error) {
  const backendMessage = error?.response?.data?.message || error?.response?.data?.error;

  return {
    status: "error",
    area: "",
    stateMessage: backendMessage || ERROR_MESSAGE,
    growthDirection: "unavailable",
    growthLabel: UNAVAILABLE_NOW,
    cards: makeCards(),
  };
}

function getNoAreaState() {
  return {
    status: "no-area",
    area: "",
    stateMessage: COMPLETE_PROFILE_AREA_MESSAGE,
    growthDirection: "unavailable",
    growthLabel: UNAVAILABLE_NOW,
    cards: makeCards(),
  };
}

function getEmptyMarketState(area) {
  return {
    status: "empty",
    area,
    stateMessage: EMPTY_MARKET_MESSAGE,
    growthDirection: "flat",
    growthLabel: "\u0644\u0627 \u064a\u0648\u062c\u062f \u062a\u063a\u064a\u0631 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    cards: makeCards(),
  };
}

export function buildProviderAdvertisementMarketAnalytics({ userData, generatorsData, subscriptionsData, now = new Date() }) {
  const provider = unwrapUser(userData);
  const area = extractProviderArea(provider);

  if (!area) return getNoAreaState();

  const generators = unwrapList(generatorsData);
  const subscriptions = unwrapList(subscriptionsData);
  const generatorAreaById = new Map();

  generators.forEach((generator) => {
    const id = getGeneratorId(generator);
    const generatorArea = getGeneratorArea(generator);

    if (id && generatorArea) generatorAreaById.set(id, generatorArea);
  });

  const areaGenerators = generators.filter(
    (generator) => areasMatch(getGeneratorArea(generator), area) && !isBlockedRecord(generator)
  );
  const areaSubscriptions = subscriptions.filter(
    (subscription) =>
      areasMatch(getSubscriptionArea(subscription, generatorAreaById), area) &&
      !isBlockedRecord(subscription)
  );

  if (!areaGenerators.length && !areaSubscriptions.length) {
    return getEmptyMarketState(area);
  }

  const priceValues = areaGenerators
    .map(getGeneratorPrice)
    .filter((price) => Number.isFinite(price));
  const providerIdentities = new Set(
    areaGenerators
      .map(getProviderIdentity)
      .map((value) => value.toLowerCase())
      .filter(Boolean)
  );
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonth = getPreviousMonthDate(now);
  const datedAreaSubscriptions = areaSubscriptions.filter((subscription) => getActivityDate(subscription));
  const currentMonthActivity = datedAreaSubscriptions.filter((subscription) =>
    isSameMonth(getActivityDate(subscription), currentMonth)
  ).length;
  const previousMonthActivity = datedAreaSubscriptions.filter((subscription) =>
    isSameMonth(getActivityDate(subscription), previousMonth)
  ).length;
  const activeProvidersCount = providerIdentities.size;
  const growth = datedAreaSubscriptions.length
    ? calculateGrowth(currentMonthActivity, previousMonthActivity)
    : {
        direction: "unavailable",
        percentage: null,
        label: UNAVAILABLE_NOW,
      };

  return {
    status: "ready",
    area,
    growthDirection: growth.direction,
    growthPercentage: growth.percentage,
    growthLabel: growth.label,
    currentMonthActivity,
    previousMonthActivity,
    cards: makeCards({
      averagePriceLabel: formatAveragePrice(priceValues),
      providersCountLabel: formatProviderCount(activeProvidersCount),
      demandStatus: calculateDemandStatus({
        activeProvidersCount,
        currentMonthActivity,
        hasDatedActivity: datedAreaSubscriptions.length > 0,
      }),
    }),
  };
}

export async function getProviderAdvertisementMarketAnalytics(options = {}) {
  const { signal } = options;
  const [userResponse, generatorsResponse, subscriptionsResponse] = await Promise.all([
    api.get(MARKET_ANALYTICS_ENDPOINTS.currentUser, { signal }),
    api.get(MARKET_ANALYTICS_ENDPOINTS.generators, { signal }),
    api.get(MARKET_ANALYTICS_ENDPOINTS.subscriptions, { signal }),
  ]);

  return buildProviderAdvertisementMarketAnalytics({
    userData: userResponse.data,
    generatorsData: generatorsResponse.data,
    subscriptionsData: subscriptionsResponse.data,
  });
}

export default getProviderAdvertisementMarketAnalytics;
