import api from "./api";
import fallbackGeneratorImage from "../assets/customer/images/generator-nour.png";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.generators)) return data.generators;
  if (Array.isArray(data?.data?.generators)) return data.data.generators;
  if (Array.isArray(data?.items)) return data.items;

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

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeGenerator(generator = {}) {
  const provider = generator.provider || generator.owner || generator.user || {};
  const price = getFirstValue(generator, [
    "price",
    "price_per_ampere",
    "pricePerAmpere",
    "monthly_price",
    "price_KW",
    "generator_price",
  ]);
  const priceValue = toNumber(price);
  const capacity = getFirstValue(generator, [
    "capacity",
    "available_capacity",
    "availableCapacity",
    "load",
    "ampere",
    "powerKW",
    "generator_powerKW",
  ]);
  const statusValue = String(
    getFirstValue(generator, ["status", "state"], "working")
  ).toLowerCase();
  const statusType =
    statusValue.includes("maintenance") || statusValue.includes("صيانة")
      ? "maintenance"
      : "working";

  return {
    id: getFirstValue(generator, ["id", "_id", "uuid", "slug"]),
    image: getFirstValue(
      generator,
      ["image", "image_url", "imageUrl", "photo", "photo_url"],
      fallbackGeneratorImage
    ),
    name: getFirstValue(
      generator,
      ["name", "title", "generator_name", "type", "generator_type"],
      "مولد"
    ),
    status: getFirstValue(
      generator,
      ["status_label", "statusLabel", "status_text", "statusText"],
      statusType === "maintenance" ? "تحت الصيانة" : "يعمل الآن"
    ),
    statusType,
    location: getFirstValue(generator, [
      "location",
      "area",
      "address",
      "city",
      "region",
      "gps",
      "generator_gps",
    ]),
    price: price ? String(price) : "0",
    priceValue,
    priceText: getFirstValue(
      generator,
      ["price_text", "priceText", "formatted_price", "formattedPrice"],
      priceValue ? `د.ع ${priceValue.toLocaleString("en-US")}` : "د.ع 0"
    ),
    currency: getFirstValue(
      generator,
      ["currency", "price_currency"],
      "د.ع / شهر"
    ),
    capacity: capacity ? `${capacity} KW` : "0 KW",
    rating: getFirstValue(generator, ["rating", "avg_rating", "averageRating"], "0"),
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
      id: getNestedValue(
        { provider, generator },
        [
          "provider.id",
          "provider._id",
          "provider.uuid",
          "generator.provider_id",
          "generator.providerId",
          "generator.user_id",
          "generator.owner_id",
        ],
        ""
      ),
      name: getNestedValue(
        { provider, generator },
        [
          "provider.name",
          "provider.full_name",
          "provider.fullName",
          "provider.username",
          "provider.user.name",
          "provider.user.full_name",
          "provider.owner.name",
          "generator.provider_name",
          "generator.providerName",
          "generator.owner_name",
          "generator.user_name",
        ],
        getFirstValue(
          generator,
          ["provider_name", "providerName", "owner_name", "user_name", "name"],
          "مزود الخدمة"
        )
      ),
      address: getNestedValue(
        { provider, generator },
        ["provider.address", "provider.location", "generator.provider_address"],
        getFirstValue(generator, ["location", "area", "address"])
      ),
      phone: getNestedValue(
        { provider, generator },
        ["provider.phone", "provider.mobile", "generator.provider_phone"],
        ""
      ),
    },
    terms:
      generator.terms ||
      generator.subscription_terms ||
      generator.subscriptionTerms ||
      [
        "يتم دفع رسوم الاشتراك في بداية الشهر.",
        "يجب الالتزام بالسعة المتفق عليها.",
        "تتم متابعة الأعطال من قبل فريق الصيانة.",
      ],
    review: {
      userName: getNestedValue(generator, ["review.userName", "review.user_name"], "لا توجد مراجعات بعد"),
      date: getNestedValue(generator, ["review.date"], ""),
      text: getNestedValue(generator, ["review.text", "review.comment"], "لم يقم أي مشترك بإضافة رأي حتى الآن."),
    },
  };
}

export async function getGenerators(params = {}) {
  const response = await api.get("/generators", { params });
  return unwrapList(response.data).map(normalizeGenerator);
}

export async function searchGenerators(query) {
  const response = await api.get("/generators/search", {
    params: { q: query },
  });

  return unwrapList(response.data).map(normalizeGenerator);
}

export async function getGeneratorDetails(id) {
  const response = await api.get(`/generators/${id}`);
  return normalizeGenerator(unwrapItem(response.data));
}

export async function compareGenerators(ids) {
  const response = await api.get("/generators/compare", {
    params: { "ids[]": ids },
  });

  return unwrapList(response.data).map(normalizeGenerator);
}
