import api from "./api";

const REVIEW_STORAGE_KEY = "provider_ratings_reviews";
const COMPLAINT_STORAGE_KEY = "provider_ratings_complaints";
const LOCAL_ID_PREFIXES = ["local-", "demo-"];

const REVIEW_ENDPOINTS = [
  "/provider/reviews",
  "/provider/ratings",
  "/reviews/provider",
];

const REVIEW_SUMMARY_ENDPOINTS = [
  "/provider/reviews/summary",
  "/provider/ratings/summary",
  "/reviews/provider/summary",
];

const COMPLAINT_ENDPOINTS = [
  "/provider/complaints",
  "/complaints/provider",
  "/complaints",
];

const seedReviews = [
  {
    id: "demo-review-1",
    customerName: "أحمد علي",
    customerAvatar: "",
    rating: 5,
    comment:
      "الخدمة كانت ممتازة جدا والمزود كان ملتزم بالوقت المحدد. الأسعار واضحة ولا توجد رسوم خفية. شكرا لكم على الشفافية والاحترافية في التعامل.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    providerReply: null,
  },
  {
    id: "demo-review-2",
    customerName: "سارة محمود",
    customerAvatar: "",
    rating: 4,
    comment:
      "جودة جيدة ولكن كان هناك تأخير بسيط في وقت الاستجابة الأولي. بشكل عام التجربة مرضية وسأقوم بالاشتراك مرة أخرى.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    providerReply: {
      text: "نشكرك سارة على ملاحظاتك، ونعتذر عن التأخير البسيط. نسعى دائما لتحسين سرعة استجابتنا في المرات القادمة.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "demo-review-3",
    customerName: "خالد حسن",
    customerAvatar: "",
    rating: 5,
    comment:
      "فريق محترف، والمتابعة بعد التركيب كانت ممتازة. وصلتني كل المعلومات المطلوبة بدون تعقيد.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    providerReply: null,
  },
  {
    id: "demo-review-4",
    customerName: "منى أبو عيد",
    customerAvatar: "",
    rating: 3,
    comment:
      "الخدمة مقبولة، لكن أحتاج إلى توضيح أفضل حول مواعيد الصيانة الشهرية.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    providerReply: {
      text: "شكرا لك منى. سنرسل جدول الصيانة القادم عبر الإشعارات ونرحب بأي استفسار إضافي.",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

const seedRatingSummary = {
  averageRating: 4.8,
  totalRatings: 1248,
  distribution: [
    { rating: 5, count: 998 },
    { rating: 4, count: 150 },
    { rating: 3, count: 62 },
    { rating: 2, count: 25 },
    { rating: 1, count: 13 },
  ],
};

const seedComplaints = [
  {
    id: "demo-complaint-1",
    customerName: "ليان ناصر",
    title: "تأخر في إعادة التيار",
    description:
      "تم فصل التيار أكثر من مرة خلال المساء، وتأخر الرد على طلب الدعم لمدة أطول من المعتاد.",
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: "open",
    relatedItem: "مولد الحي الشرقي - اشتراك 32 أمبير",
    providerResponse: null,
  },
  {
    id: "demo-complaint-2",
    customerName: "محمود خليل",
    title: "استفسار حول قراءة العداد",
    description:
      "قراءة العداد في الفاتورة الأخيرة لا تطابق القراءة الموجودة لدي، أرجو المراجعة.",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in_progress",
    relatedItem: "اشتراك شهري - مولد السوق",
    providerResponse: {
      text: "تم تحويل الطلب إلى فريق الفوترة لمراجعة القراءة ومطابقتها مع سجل العداد.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "demo-complaint-3",
    customerName: "ريم عثمان",
    title: "تم حل مشكلة الفاتورة",
    description:
      "تم إرسال شكوى حول رسوم إضافية غير واضحة، وتم التواصل معي وتوضيح التفاصيل.",
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: "closed",
    relatedItem: "فاتورة شهر حزيران",
    providerResponse: {
      text: "تمت مراجعة الفاتورة وتصحيح الملاحظة. نشكرك على تعاونك.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

function hasBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function readStorage(key, fallback) {
  if (!hasBrowserStorage()) return cloneData(fallback);

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : cloneData(fallback);
  } catch {
    return cloneData(fallback);
  }
}

function writeStorage(key, value) {
  if (!hasBrowserStorage()) return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getLocalReviews() {
  return readStorage(REVIEW_STORAGE_KEY, seedReviews).map(normalizeReview);
}

function saveLocalReviews(reviews) {
  writeStorage(REVIEW_STORAGE_KEY, reviews);
}

function getLocalComplaints() {
  return readStorage(COMPLAINT_STORAGE_KEY, seedComplaints).map(normalizeComplaint);
}

function saveLocalComplaints(complaints) {
  writeStorage(COMPLAINT_STORAGE_KEY, complaints);
}

function isLocalId(id) {
  return LOCAL_ID_PREFIXES.some((prefix) => String(id || "").startsWith(prefix));
}

function unwrapList(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  return [];
}

function unwrapItem(data, key) {
  return data?.data?.[key] || data?.[key] || data?.data || data;
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

function normalizeReply(reply = null) {
  if (!reply) return null;

  if (typeof reply === "string") {
    return {
      text: reply,
      createdAt: new Date().toISOString(),
    };
  }

  const text = getFirstValue(reply, [
    "text",
    "reply",
    "response",
    "message",
    "body",
    "comment",
  ]);

  if (!text) return null;

  return {
    text,
    createdAt:
      getFirstValue(reply, [
        "createdAt",
        "created_at",
        "repliedAt",
        "replied_at",
        "updatedAt",
        "updated_at",
      ]) || new Date().toISOString(),
  };
}

function normalizeRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) return 0;

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function getCustomerFromReview(review = {}) {
  return (
    review.customer ||
    review.user ||
    review.client ||
    review.reviewer ||
    review.subscription?.customer ||
    {}
  );
}

export function normalizeReview(review = {}) {
  const customer = getCustomerFromReview(review);

  return {
    id:
      getFirstValue(review, ["id", "_id", "uuid"]) ||
      `local-review-${Date.now()}`,
    customerName:
      getFirstValue(review, ["customerName", "customer_name", "userName"]) ||
      getFirstValue(customer, ["name", "full_name", "fullName"], "عميل"),
    customerAvatar:
      getFirstValue(review, ["customerAvatar", "customer_avatar", "avatar"]) ||
      getFirstValue(customer, ["avatar", "image", "photo", "profile_image"]),
    rating: normalizeRating(
      getFirstValue(review, ["rating", "rate", "stars", "score"], 5)
    ),
    comment: getFirstValue(
      review,
      ["comment", "text", "review", "body", "message"],
      ""
    ),
    createdAt:
      getFirstValue(review, ["createdAt", "created_at", "date"]) ||
      new Date().toISOString(),
    providerReply: normalizeReply(
      review.providerReply ||
        review.provider_reply ||
        review.reply ||
        review.response ||
        review.provider_response
    ),
  };
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("closed") ||
    value.includes("resolved") ||
    value.includes("solved") ||
    value.includes("مغلقة") ||
    value.includes("تم الحل")
  ) {
    return "closed";
  }

  if (
    value.includes("progress") ||
    value.includes("review") ||
    value.includes("processing") ||
    value.includes("قيد")
  ) {
    return "in_progress";
  }

  return "open";
}

export function normalizeComplaint(complaint = {}) {
  const customer = complaint.customer || complaint.user || complaint.client || {};

  return {
    id:
      getFirstValue(complaint, ["id", "_id", "uuid"]) ||
      `local-complaint-${Date.now()}`,
    customerName:
      getFirstValue(complaint, ["customerName", "customer_name", "userName"]) ||
      getFirstValue(customer, ["name", "full_name", "fullName"], "عميل"),
    title: getFirstValue(complaint, ["title", "subject"], "شكوى"),
    description: getFirstValue(
      complaint,
      ["description", "details", "message", "body"],
      ""
    ),
    submittedAt:
      getFirstValue(complaint, ["submittedAt", "submitted_at", "createdAt", "created_at", "date"]) ||
      new Date().toISOString(),
    status: normalizeStatus(getFirstValue(complaint, ["status", "state"])),
    relatedItem:
      getFirstValue(complaint, [
        "relatedItem",
        "related_item",
        "generatorName",
        "generator_name",
        "subscriptionName",
        "subscription_name",
      ]) || getFirstValue(complaint.generator, ["name", "generator_name"], ""),
    providerResponse: normalizeReply(
      complaint.providerResponse ||
        complaint.provider_response ||
        complaint.response ||
        complaint.reply
    ),
  };
}

function isMissingEndpointError(error) {
  return [404, 405, 501].includes(Number(error?.response?.status));
}

function getApiMessage(error, fallback) {
  const data = error?.response?.data;

  if (data?.message) return data.message;

  if (data?.errors && typeof data.errors === "object") {
    const firstValue = data.errors[Object.keys(data.errors)[0]];
    if (Array.isArray(firstValue)) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  return error?.displayMessage || error?.message || fallback;
}

function createDisplayError(error, fallback) {
  error.displayMessage = getApiMessage(error, fallback);
  return error;
}

async function requestFirstAvailable(endpoints, requestFactory) {
  let missingEndpointError = null;

  for (const endpoint of endpoints) {
    try {
      return await requestFactory(endpoint);
    } catch (error) {
      if (!isMissingEndpointError(error)) {
        throw error;
      }

      missingEndpointError = error;
    }
  }

  throw missingEndpointError || new Error("Endpoint unavailable");
}

function normalizeSummary(summary = {}, reviews = []) {
  const totalFromSummary = Number(
    getFirstValue(summary, ["totalRatings", "total_ratings", "total", "count"], 0)
  );
  const averageFromSummary = Number(
    getFirstValue(summary, ["averageRating", "average_rating", "avg", "rating"], 0)
  );
  const distributionSource =
    summary.distribution ||
    summary.ratingDistribution ||
    summary.rating_distribution ||
    summary.counts;

  if (totalFromSummary && distributionSource) {
    const distribution = Array.isArray(distributionSource)
      ? distributionSource.map((item) => ({
          rating: Number(item.rating || item.stars || item.score),
          count: Number(item.count || item.total || item.value || 0),
        }))
      : Object.entries(distributionSource).map(([rating, count]) => ({
          rating: Number(rating),
          count: Number(count),
        }));

    return {
      averageRating: averageFromSummary || calculateSummaryFromReviews(reviews).averageRating,
      totalRatings: totalFromSummary,
      distribution,
    };
  }

  if (totalFromSummary && averageFromSummary) {
    return {
      averageRating: averageFromSummary,
      totalRatings: totalFromSummary,
      distribution: calculateDistributionFromReviews(reviews),
    };
  }

  return calculateSummaryFromReviews(reviews);
}

function calculateDistributionFromReviews(reviews = []) {
  const counts = new Map([
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
  ]);

  reviews.forEach((review) => {
    const rating = normalizeRating(review.rating);
    counts.set(rating, (counts.get(rating) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([rating, count]) => ({
    rating,
    count,
  }));
}

function calculateSummaryFromReviews(reviews = []) {
  const totalRatings = reviews.length;
  const ratingTotal = reviews.reduce(
    (total, review) => total + normalizeRating(review.rating),
    0
  );

  return {
    averageRating: totalRatings ? Number((ratingTotal / totalRatings).toFixed(1)) : 0,
    totalRatings,
    distribution: calculateDistributionFromReviews(reviews),
  };
}

export async function getProviderReviews() {
  try {
    const response = await requestFirstAvailable(REVIEW_ENDPOINTS, (endpoint) =>
      api.get(endpoint)
    );

    return unwrapList(response.data, ["reviews", "ratings"]).map(normalizeReview);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      return getLocalReviews();
    }

    throw createDisplayError(
      error,
      "تعذر تحميل التقييمات، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function getProviderRatingSummary(reviews = []) {
  try {
    const response = await requestFirstAvailable(REVIEW_SUMMARY_ENDPOINTS, (endpoint) =>
      api.get(endpoint)
    );

    return normalizeSummary(unwrapItem(response.data, "summary"), reviews);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      return reviews.length && !reviews.some((review) => isLocalId(review.id))
        ? normalizeSummary({}, reviews)
        : normalizeSummary(seedRatingSummary, reviews);
    }

    throw createDisplayError(
      error,
      "تعذر تحميل ملخص التقييمات، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function replyToReview(reviewId, reply) {
  const cleanReply = String(reply || "").trim();

  if (!cleanReply) {
    throw new Error("يرجى كتابة الرد قبل الإرسال.");
  }

  if (isLocalId(reviewId)) {
    const reviews = getLocalReviews();
    const nextReply = {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };

    const nextReviews = reviews.map((review) =>
      String(review.id) === String(reviewId)
        ? { ...review, providerReply: nextReply }
        : review
    );

    saveLocalReviews(nextReviews);
    return nextReply;
  }

  try {
    const response = await requestFirstAvailable(
      [`/provider/reviews/${reviewId}/reply`, `/reviews/${reviewId}/reply`],
      (endpoint) => api.post(endpoint, { reply: cleanReply, response: cleanReply })
    );

    return normalizeReply(unwrapItem(response.data, "reply")) || {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    throw createDisplayError(error, "فشل إرسال الرد، يرجى المحاولة مرة أخرى.");
  }
}

export async function updateReviewReply(reviewId, reply) {
  const cleanReply = String(reply || "").trim();

  if (!cleanReply) {
    throw new Error("يرجى كتابة الرد قبل الإرسال.");
  }

  if (isLocalId(reviewId)) {
    const reviews = getLocalReviews();
    const nextReply = {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };

    const nextReviews = reviews.map((review) =>
      String(review.id) === String(reviewId)
        ? { ...review, providerReply: nextReply }
        : review
    );

    saveLocalReviews(nextReviews);
    return nextReply;
  }

  try {
    const response = await requestFirstAvailable(
      [`/provider/reviews/${reviewId}/reply`, `/reviews/${reviewId}/reply`],
      (endpoint) => api.put(endpoint, { reply: cleanReply, response: cleanReply })
    );

    return normalizeReply(unwrapItem(response.data, "reply")) || {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    throw createDisplayError(error, "فشل تعديل الرد، يرجى المحاولة مرة أخرى.");
  }
}

export async function deleteReviewReply(reviewId) {
  if (isLocalId(reviewId)) {
    const reviews = getLocalReviews();
    const nextReviews = reviews.map((review) =>
      String(review.id) === String(reviewId)
        ? { ...review, providerReply: null }
        : review
    );

    saveLocalReviews(nextReviews);
    return true;
  }

  try {
    await requestFirstAvailable(
      [`/provider/reviews/${reviewId}/reply`, `/reviews/${reviewId}/reply`],
      (endpoint) => api.delete(endpoint)
    );

    return true;
  } catch (error) {
    throw createDisplayError(error, "فشل حذف الرد، يرجى المحاولة مرة أخرى.");
  }
}

export async function getProviderComplaints() {
  try {
    const response = await requestFirstAvailable(COMPLAINT_ENDPOINTS, (endpoint) =>
      api.get(endpoint)
    );

    return unwrapList(response.data, ["complaints"]).map(normalizeComplaint);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      return getLocalComplaints();
    }

    throw createDisplayError(
      error,
      "تعذر تحميل الشكاوى، يرجى المحاولة مرة أخرى."
    );
  }
}

export async function replyToComplaint(complaintId, reply) {
  const cleanReply = String(reply || "").trim();

  if (!cleanReply) {
    throw new Error("يرجى كتابة الرد قبل الإرسال.");
  }

  if (isLocalId(complaintId)) {
    const complaints = getLocalComplaints();
    const nextResponse = {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };
    const nextComplaints = complaints.map((complaint) =>
      String(complaint.id) === String(complaintId)
        ? { ...complaint, providerResponse: nextResponse }
        : complaint
    );

    saveLocalComplaints(nextComplaints);
    return nextResponse;
  }

  try {
    const response = await requestFirstAvailable(
      [
        `/provider/complaints/${complaintId}/reply`,
        `/complaints/${complaintId}/reply`,
      ],
      (endpoint) => api.post(endpoint, { reply: cleanReply, response: cleanReply })
    );

    return normalizeReply(unwrapItem(response.data, "reply")) || {
      text: cleanReply,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    throw createDisplayError(error, "فشل إرسال الرد، يرجى المحاولة مرة أخرى.");
  }
}

export async function updateComplaintStatus(complaintId, status) {
  const nextStatus = normalizeStatus(status);

  if (isLocalId(complaintId)) {
    const complaints = getLocalComplaints();
    const nextComplaints = complaints.map((complaint) =>
      String(complaint.id) === String(complaintId)
        ? { ...complaint, status: nextStatus }
        : complaint
    );

    saveLocalComplaints(nextComplaints);
    return nextStatus;
  }

  try {
    const response = await requestFirstAvailable(
      [`/provider/complaints/${complaintId}`, `/complaints/${complaintId}`],
      (endpoint) => api.patch(endpoint, { status: nextStatus })
    );

    return normalizeComplaint(unwrapItem(response.data, "complaint")).status;
  } catch (error) {
    throw createDisplayError(error, "فشل تحديث حالة الشكوى، يرجى المحاولة مرة أخرى.");
  }
}

export const providerReviewService = {
  getProviderReviews,
  getProviderRatingSummary,
  replyToReview,
  updateReviewReply,
  deleteReviewReply,
  getProviderComplaints,
  replyToComplaint,
  updateComplaintStatus,
};

export default providerReviewService;
