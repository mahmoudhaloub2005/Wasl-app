import api from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.data?.reviews)) return data.data.reviews;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.subscriptions)) return data.subscriptions;
  if (Array.isArray(data?.data?.subscriptions)) return data.data.subscriptions;

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

function getApiMessage(error, fallback = "حدث خطأ غير متوقع") {
  const data = error?.response?.data;

  if (data?.message) return data.message;

  const errors = data?.errors;

  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstValue = errors[firstKey];

    if (Array.isArray(firstValue)) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  return fallback;
}

function createUnavailableOperationError(message = "هذه العملية غير متاحة حالياً") {
  const error = new Error(message);
  error.displayMessage = message;
  error.isUnsupported = true;
  return error;
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
  const subscription = review.subscription || {};

  const provider =
    review.provider ||
    subscription.provider ||
    review.user ||
    subscription.user ||
    {};

  const generator =
    review.generator ||
    subscription.generator ||
    subscription.generator_info ||
    {};

  const providerName =
    getFirstValue(review, [
      "provider_name",
      "providerName",
      "facility_name",
      "facilityName",
    ]) ||
    getFirstValue(provider, [
      "name",
      "full_name",
      "fullName",
      "provider_name",
      "providerName",
      "facility_name",
      "facilityName",
    ]) ||
    getFirstValue(generator, [
      "name",
      "generator_name",
      "generatorName",
    ]) ||
    "المولد";

  const providerId =
    getFirstValue(review, ["provider_id", "providerId"]) ||
    getFirstValue(provider, ["id", "_id", "uuid", "provider_id", "providerId"]);

  const generatorId =
    getFirstValue(review, ["generator_id", "generatorId"]) ||
    getFirstValue(generator, ["id", "_id", "uuid"]);

  const targetId =
    getFirstValue(review, ["target_id", "targetId"]) || providerId || generatorId;

  return {
    id:
      getFirstValue(review, ["id", "_id", "uuid"]) ||
      `local-${Date.now()}-${Math.random()}`,

    subscriptionId: getFirstValue(review, [
      "subscription_id",
      "subscriptionId",
    ]),

    targetId,
    providerId,
    generatorId,

    provider: providerName,

    date:
      formatDate(getFirstValue(review, ["date", "created_at", "createdAt"])) ||
      formatDate(new Date()),

    iconType: "power",

    rating:
      Number(getFirstValue(review, ["rating", "rate", "stars", "score"], 5)) ||
      5,

    text: getFirstValue(review, ["text", "comment", "review", "body"], ""),
  };
}

export function normalizeReviewSubscription(subscription = {}) {
  const provider =
    subscription.provider ||
    subscription.user ||
    subscription.provider_info ||
    {};

  const generator =
    subscription.generator ||
    subscription.generator_info ||
    subscription.provider_generator ||
    {};

  const subscriptionId = getFirstValue(subscription, [
    "id",
    "_id",
    "uuid",
    "subscription_id",
    "subscriptionId",
  ]);

  const providerId =
    getFirstValue(subscription, [
      "provider_id",
      "providerId",
      "provider_user_id",
      "providerUserId",
      "user_id",
      "userId",
    ]) ||
    getFirstValue(provider, [
      "id",
      "_id",
      "uuid",
      "provider_id",
      "providerId",
      "user_id",
      "userId",
    ]) ||
    getFirstValue(generator, [
      "provider_id",
      "providerId",
      "user_id",
      "userId",
      "owner_id",
      "ownerId",
    ]);

  const generatorId =
    getFirstValue(subscription, ["generator_id", "generatorId"]) ||
    getFirstValue(generator, ["id", "_id", "uuid"]);

  const name =
    getFirstValue(subscription, [
      "generator_name",
      "generatorName",
      "provider_name",
      "providerName",
      "facility_name",
      "facilityName",
      "name",
    ]) ||
    getFirstValue(generator, [
      "name",
      "generator_name",
      "generatorName",
      "title",
    ]) ||
    getFirstValue(provider, [
      "name",
      "full_name",
      "fullName",
      "facility_name",
      "facilityName",
    ]) ||
    `اشتراك رقم ${subscriptionId}`;

  return {
    id: subscriptionId,
    subscriptionId,
    providerId,
    generatorId,
    targetId: providerId || generatorId,
    provider: name,
    raw: subscription,
  };
}

/*
  ممنوع نستدعي:
  GET /reviews/my
  GET /reviews

  لأنهم عندك بيرجعوا 404 و 405.
*/
export async function getReviews() {
  throw createUnavailableOperationError(
    "قائمة التقييمات غير متاحة من الخادم حالياً."
  );
}

export async function getMyReviews() {
  throw createUnavailableOperationError(
    "قائمة تقييمات العميل غير موثقة في واجهة Wasel API الحالية."
  );
}

export async function getReviewableSubscriptions(params = {}) {
  const response = await api.get("/subscriptions/my", { params });

  return unwrapList(response.data)
    .map(normalizeReviewSubscription)
    .filter((item) => item.subscriptionId);
}

export async function createReview(data = {}) {
  const providerId =
    data.provider_id ||
    data.providerId ||
    data.target_id ||
    data.targetId;

  const generatorId = data.generator_id || data.generatorId;

  const rate = Number(data.rate ?? data.rating ?? data.stars);

  const comment = String(
    data.comment ?? data.text ?? data.review ?? data.body ?? ""
  ).trim();

  if (!rate || rate < 1 || rate > 5) {
    throw createUnavailableOperationError("اختر تقييم من 1 إلى 5 نجوم.");
  }

  if (!comment) {
    throw createUnavailableOperationError("اكتب نص التقييم أولاً.");
  }

  if (!providerId && !generatorId) {
    throw createUnavailableOperationError(
      "لا يمكن إضافة التقييم لأن رقم المزود غير موجود."
    );
  }

  /*
    الحل الأساسي:
    الباك رفض target_type = generator
    لذلك نستخدم target_type = provider
  */
  const payload = {
    target_type: "provider",
    target_id: providerId || generatorId,
    rate,
    comment,
  };


  try {
    const response = await api.post("/reviews", payload);
    return normalizeReview(unwrapItem(response.data));
  } catch (error) {
    error.displayMessage = getApiMessage(
      error,
      "فشل إرسال التقييم. تأكد من اختيار الاشتراك الصحيح."
    );

    throw error;
  }
}

export async function updateReview() {
  throw createUnavailableOperationError("تعديل التقييم غير متاح حالياً من الخادم.");
}

export async function deleteReview() {
  throw createUnavailableOperationError("حذف التقييم غير متاح حالياً من الخادم.");
}

