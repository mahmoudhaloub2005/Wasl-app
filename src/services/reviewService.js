import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.data?.reviews)) return data.data.reviews;
  if (Array.isArray(data?.items)) return data.items;
  if (data?.review) return [data.review];
  if (data?.data?.review) return [data.data.review];
  if (data?.data && typeof data.data === "object") return [data.data];

  return [];
}

function unwrapItem(data) {
  return data?.data?.review || data?.review || data?.data || data;
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

export function normalizeReview(review = {}) {
  const provider = review.provider || review.generator || review.user || {};
  const providerName = getFirstValue(
    provider,
    ["name", "full_name", "fullName", "generator_name"],
    ""
  );

  return {
    id: getFirstValue(review, ["id", "_id", "uuid"]),
    targetId:
      getFirstValue(review, ["target_id", "targetId", "provider_id", "providerId"]) ||
      getFirstValue(provider, ["id", "_id", "uuid"]),
    provider:
      getFirstValue(review, ["provider_name", "providerName", "generator_name", "generatorName"]) ||
      providerName ||
      "مزود الخدمة",
    date:
      formatDate(getFirstValue(review, ["date", "created_at", "createdAt"])) ||
      "غير محدد",
    iconType: String(providerName).toLowerCase().includes("city") ? "city" : "power",
    rating:
      Number(getFirstValue(review, ["rating", "rate", "stars", "score"], 5)) ||
      5,
    text: getFirstValue(review, ["text", "comment", "review", "body"], ""),
  };
}

export async function createReview(data) {
  const response = await api.post("/reviews", {
    target_type: "provider",
    ...data,
  });
  return normalizeReview(unwrapItem(response.data));
}

export async function updateReview(id, data) {
  const response = await api.put(`/reviews/${id}`, {
    target_type: "provider",
    ...data,
  });
  return normalizeReview(unwrapItem(response.data));
}

export async function deleteReview(id) {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
}
