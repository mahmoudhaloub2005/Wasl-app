import api from "./api";
import placeholderGeneratorImage from "../assets/customer/images/generator-nour.png";

const GENERATOR_TYPE_LABELS = {
  diesel: "ديزل",
  gas: "غاز",
  gasoline: "بنزين",
  petrol: "بنزين",
};

const GENERATOR_STATUS_LABELS = {
  active: "يعمل الآن",
  approved: "يعمل الآن",
  enabled: "يعمل الآن",
  working: "يعمل الآن",
  maintenance: "صيانة",
  inactive: "متوقف",
  pending: "قيد المراجعة",
  waiting: "قيد المراجعة",
  under_review: "قيد المراجعة",
  rejected: "مرفوض",
  cancelled: "ملغي",
};

function unwrapList(data) {
  const listCandidates = [
    data,
    data?.data,
    data?.generators,
    data?.data?.generators,
    data?.items,
    data?.data?.items,
    data?.results,
    data?.data?.results,
    data?.data?.data,
  ];

  const list = listCandidates.find(Array.isArray);

  if (list) return list;
  if (data?.generator) return [data.generator];
  if (data?.data?.generator) return [data.data.generator];
  if (data?.data && isGeneratorLike(data.data)) return [data.data];
  if (isGeneratorLike(data)) return [data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.generator || data?.generator || data?.data || data;
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

function isGeneratorLike(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "id",
    "_id",
    "uuid",
    "slug",
    "name",
    "title",
    "generator_name",
    "generatorName",
    "generator_type",
    "generatorType",
    "provider_id",
    "providerId",
  ].some((key) => value[key] !== undefined && value[key] !== null);
}

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function getMappedLabel(value, labels) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  const lookupKey = rawValue.toLowerCase().replace(/[-\s]+/g, "_");
  return labels[lookupKey] || rawValue;
}

function translateGeneratorType(value) {
  const key = normalizeKey(value);

  if (!key) return "";
  if (key.includes("diesel")) return "ديزل";
  if (key.includes("gasoline") || key.includes("petrol")) return "بنزين";
  if (key.includes("gas")) return "غاز";

  return getMappedLabel(value, GENERATOR_TYPE_LABELS);
}

function translateGeneratorStatus(value) {
  const key = normalizeKey(value);

  if (!key) return "";
  if (key.includes("maintenance")) return "صيانة";
  if (key.includes("inactive")) return "متوقف";
  if (key.includes("pending") || key.includes("waiting") || key.includes("review")) {
    return "قيد المراجعة";
  }
  if (key.includes("active") || key.includes("approved") || key.includes("enabled")) {
    return "يعمل الآن";
  }

  return getMappedLabel(value, GENERATOR_STATUS_LABELS);
}

function isCoordinateText(value) {
  const text = String(value || "").trim();
  return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(text);
}

function formatLocation(value) {
  if (!value) return "";

  if (typeof value === "object") {
    return formatLocation(
      value.name ||
        value.title ||
        value.label ||
        value.city ||
        value.region ||
        value.address
    );
  }

  if (isCoordinateText(value)) return "موقع جغرافي محدد";

  return String(value);
}

function normalizeStatusType(status) {
  const value = normalizeKey(status);

  if (value.includes("maintenance") || value.includes("صيانة")) {
    return "maintenance";
  }

  if (
    value.includes("inactive") ||
    value.includes("pending") ||
    value.includes("review") ||
    value.includes("waiting") ||
    value.includes("متوقف") ||
    value.includes("قيد") ||
    value.includes("انتظار")
  ) {
    return "maintenance";
  }

  return "working";
}

function hasBlockedStatus(value) {
  const status = normalizeKey(value);

  return (
    status.includes("rejected") ||
    status.includes("blocked") ||
    status.includes("مرفوض")
  );
}

function hasUnavailableProviderStatus(value) {
  const status = normalizeKey(value);

  return (
    hasBlockedStatus(value) ||
    status.includes("pending") ||
    status.includes("review") ||
    status.includes("waiting") ||
    status.includes("inactive") ||
    status.includes("قيد") ||
    status.includes("انتظار") ||
    status.includes("غير نشط")
  );
}

function isVisibleGenerator(generator = {}) {
  const provider = generator.provider || generator.owner || generator.user || {};
  const generatorStatus = getFirstValue(generator, ["status", "state"]);

  const providerStatus = getNestedValue(
    { provider, generator },
    [
      "provider.status",
      "provider.state",
      "provider.approval_status",
      "provider.approvalStatus",
      "generator.provider_status",
      "generator.providerStatus",
    ]
  );

  return !hasBlockedStatus(generatorStatus) && !hasUnavailableProviderStatus(providerStatus);
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "";

  const text = String(value);
  return /شيكل|₪|د\.ع|kw|kva|amp/i.test(text) ? text : `${text} شيكل`;
}

function formatCapacity(value) {
  if (value === undefined || value === null || value === "") return "";

  return String(value);
}

function normalizeGenerator(generator = {}) {
  const provider = generator.provider || generator.owner || generator.user || {};

  const providerId = getNestedValue(
    { provider, generator },
    [
      "provider.id",
      "provider._id",
      "provider.uuid",
      "generator.provider_id",
      "generator.providerId",
      "generator.user_id",
      "generator.owner_id",
    ]
  );

  const providerName = getNestedValue(
    { provider, generator },
    [
      "provider.name",
      "provider.full_name",
      "provider.fullName",
      "provider.username",
      "provider.user.name",
      "provider.user.full_name",
      "provider.user.fullName",
      "provider.owner.name",
      "generator.provider_name",
      "generator.providerName",
      "generator.owner_name",
      "generator.user_name",
    ]
  );

  const companyName = getNestedValue(
    { provider, generator },
    [
      "provider.company_name",
      "provider.companyName",
      "provider.facility_name",
      "provider.facilityName",
      "provider.user.company_name",
      "provider.user.companyName",
      "provider.user.facility_name",
      "provider.user.facilityName",
      "provider.owner.company_name",
      "provider.owner.companyName",
      "provider.owner.facility_name",
      "provider.owner.facilityName",
      "generator.company_name",
      "generator.companyName",
      "generator.facility_name",
      "generator.facilityName",
      "generator.provider_company_name",
      "generator.providerCompanyName",
      "generator.provider_facility_name",
      "generator.providerFacilityName",
    ]
  );

  const providerPhone = getNestedValue(
    { provider, generator },
    [
      "provider.phone",
      "provider.mobile",
      "provider.phone_number",
      "provider.phoneNumber",
      "provider.user.phone",
      "provider.user.mobile",
      "generator.provider_phone",
      "generator.providerPhone",
    ]
  );

  const providerEmail = getNestedValue(
    { provider, generator },
    [
      "provider.email",
      "provider.user.email",
      "provider.owner.email",
      "generator.provider_email",
      "generator.providerEmail",
    ]
  );

  const providerOwnArea = getNestedValue(
    { provider, generator },
    [
      "provider.area.name",
      "provider.area",
      "provider.region",
      "provider.city",
      "provider.location",
      "provider.address",
      "generator.provider_area",
      "generator.providerArea",
      "generator.provider_address",
    ]
  );

  const providerArea =
    providerOwnArea ||
    getNestedValue({ generator }, [
      "generator.area",
      "generator.region",
      "generator.city",
    ]);

  const providerAddress = getNestedValue(
    { provider, generator },
    [
      "provider.address",
      "provider.location",
      "provider.area.name",
      "provider.area",
      "generator.provider_address",
      "generator.providerAddress",
      "generator.provider_area",
    ]
  );

  const providerDescription = getNestedValue(
    { provider, generator },
    [
      "provider.description",
      "provider.bio",
      "provider.about",
      "provider.summary",
      "provider.company_description",
      "provider.companyDescription",
      "generator.provider_description",
      "generator.providerDescription",
    ]
  );

  const providerSubscribersCount = getNestedValue(
    { provider, generator },
    [
      "provider.subscribers_count",
      "provider.subscribersCount",
      "provider.customers_count",
      "provider.customersCount",
      "provider.subscriptions_count",
      "provider.subscriptionsCount",
      "generator.provider_subscribers_count",
      "generator.providerSubscribersCount",
      "generator.subscribers_count",
      "generator.subscribersCount",
    ]
  );

  const providerRating = getNestedValue(
    { provider, generator },
    [
      "provider.rating",
      "provider.avg_rating",
      "provider.averageRating",
      "provider.reviews_avg_rating",
      "generator.provider_rating",
      "generator.providerRating",
    ]
  );

  const rawProviderStatus = getNestedValue(
    { provider, generator },
    [
      "provider.status",
      "provider.state",
      "provider.approval_status",
      "provider.approvalStatus",
      "generator.provider_status",
      "generator.providerStatus",
    ]
  );

  const hasProviderRelation = Boolean(
    providerId ||
      companyName ||
      providerName ||
      providerPhone ||
      providerEmail ||
      providerOwnArea ||
      providerAddress ||
      providerDescription ||
      providerSubscribersCount !== "" ||
      providerRating ||
      rawProviderStatus ||
      (provider &&
        typeof provider === "object" &&
        !Array.isArray(provider) &&
        Object.keys(provider).length > 0)
  );

  const price = getFirstValue(generator, [
    "price_per_ampere",
    "pricePerAmpere",
    "ampere_price",
    "amperePrice",
    "price",
    "monthly_price",
    "price_KW",
    "generator_price",
  ]);

  const capacity = getFirstValue(generator, [
    "available_load",
    "availableLoad",
    "available_capacity",
    "availableCapacity",
    "capacity",
    "load",
    "ampere",
    "powerKW",
    "generator_powerKW",
  ]);

  const rawStatus = getFirstValue(generator, ["status", "state"]);

  const statusLabel = getFirstValue(
    generator,
    ["status_label", "statusLabel", "status_text", "statusText"],
    rawStatus
  );

  const rawGeneratorType = getFirstValue(generator, [
    "generator_type",
    "generatorType",
    "type",
  ]);

  const translatedType = translateGeneratorType(rawGeneratorType);

  const rawGeneratorName =
    getFirstValue(generator, [
      "generator_name",
      "generatorName",
      "title",
      "model",
      "brand",
      "name",
    ]) || translatedType;

  const displayName =
    companyName ||
    rawGeneratorName ||
    (translatedType ? `مولد ${translatedType}` : "مولد جديد");

  const statusType = normalizeStatusType(rawStatus);

  const terms =
    generator.terms ||
    generator.subscription_terms ||
    generator.subscriptionTerms ||
    [];

  const review = generator.review || {};

  return {
    id: getFirstValue(generator, ["id", "_id", "uuid", "slug"]),

    image:
      getFirstValue(generator, [
        "image",
        "image_url",
        "imageUrl",
        "photo",
        "photo_url",
      ]) || placeholderGeneratorImage,

    name: displayName,
    generatorName: rawGeneratorName,
    providerCompanyName: companyName,

    isCompanyGenerator: Boolean(companyName),

    generatorType: translatedType,

    status: translateGeneratorStatus(statusLabel),

    statusType,

    location: formatLocation(
      getFirstValue(generator, [
        "area",
        "region",
        "city",
        "address",
        "location",
        "gps",
        "generator_gps",
      ])
    ),

    price: price ? String(price) : "",

    priceValue: toNumber(price),

    priceText: getFirstValue(
      generator,
      ["price_text", "priceText", "formatted_price", "formattedPrice"],
      formatCurrency(price)
    ),

    currency: getFirstValue(generator, ["currency", "price_currency"]),

    capacity: formatCapacity(capacity),

    rating: getFirstValue(generator, ["rating", "avg_rating", "averageRating"]),

    shortDescription: getFirstValue(generator, [
      "short_description",
      "shortDescription",
      "summary",
      "description",
    ]),

    serviceDescription: getFirstValue(generator, [
      "service_description",
      "serviceDescription",
      "description",
      "details",
    ]),

    provider: {
      hasProviderInfo: hasProviderRelation,
      id: providerId,
      name: companyName || providerName || "",
      phone: providerPhone,
      email: providerEmail,
      area: formatLocation(providerArea),
      address: formatLocation(providerAddress),
      description: providerDescription,
      subscribersCount: providerSubscribersCount,
      rating: providerRating,
      status: translateGeneratorStatus(rawProviderStatus || rawStatus),
    },

    terms: Array.isArray(terms) ? terms : [],

    review: {
      userName: getNestedValue({ review, generator }, [
        "review.userName",
        "review.user_name",
        "generator.review_user_name",
      ]),

      date: getNestedValue({ review, generator }, [
        "review.date",
        "generator.review_date",
      ]),

      text: getNestedValue({ review, generator }, [
        "review.text",
        "review.comment",
        "generator.review_text",
      ]),
    },
  };
}

function makeAhliElectricityCard(sourceGenerator) {
  if (!sourceGenerator) return null;

  return {
    ...sourceGenerator,
    name: "شركة الكهرباء الأهلية",
    providerCompanyName: "شركة الكهرباء الأهلية",
    generatorName: sourceGenerator.generatorName || "مولد كهرباء",
    provider: {
      ...sourceGenerator.provider,
      name: "شركة الكهرباء الأهلية",
      hasProviderInfo: true,
    },
    isCompanyGenerator: true,
    isPinnedAhliElectricity: true,
  };
}

function normalizeVisibleGenerators(data) {
  const normalizedGenerators = unwrapList(data)
    .filter(isGeneratorLike)
    .filter(isVisibleGenerator)
    .map(normalizeGenerator)
    .filter((generator) => generator.id);

  const companyGenerators = normalizedGenerators.filter(
    (generator) => generator.isCompanyGenerator
  );

  const ahliFromBackend =
    companyGenerators.find((generator) =>
      String(generator.name || "").includes("شركة الكهرباء الأهلية")
    ) || null;

  const ahliCard = makeAhliElectricityCard(
    ahliFromBackend || normalizedGenerators[0]
  );

  const providerAddedGenerators = companyGenerators.filter((generator) => {
    if (!generator?.id) return false;
    if (ahliCard && String(generator.id) === String(ahliCard.id)) return false;

    return true;
  });

  return [ahliCard, ...providerAddedGenerators].filter(Boolean);
}

export async function getGenerators(params = {}) {
  const response = await api.get("/generators", { params });
  return normalizeVisibleGenerators(response.data);
}

export async function searchGenerators(query) {
  const response = await api.get("/generators/search", {
    params: { q: query },
  });

  return normalizeVisibleGenerators(response.data);
}

export async function getGeneratorDetails(id) {
  const response = await api.get(`/generators/${id}`);
  const generator = unwrapItem(response.data);

  if (!isGeneratorLike(generator) || !isVisibleGenerator(generator)) {
    return null;
  }

  return normalizeGenerator(generator);
}

export async function compareGenerators(ids) {
  const response = await api.get("/generators/compare", {
    params: { "ids[]": ids },
  });

  return normalizeVisibleGenerators(response.data);
}