import api from "./api";
import {
  createServiceError,
  getFirstValue,
  sanitizeText,
  toNumber,
  unwrapList,
} from "./apiResponse";

function createUnsupportedError(message) {
  const error = new Error(message);
  error.displayMessage = message;
  return error;
}

function normalizeRating(value) {
  const rating = toNumber(value, 0);

  if (!rating) return 0;
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

function normalizeReply(reply = null) {
  if (!reply) return null;

  if (typeof reply === "string") {
    return {
      text: reply,
      createdAt: new Date().toISOString(),
    };
  }

  const text = sanitizeText(
    getFirstValue(reply, ["text", "reply", "response", "message", "body", "comment"])
  );

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

export function normalizeReview(review = {}) {
  const customer = getCustomerFromReview(review);
  const createdAt =
    getFirstValue(review, ["createdAt", "created_at", "date"]) ||
    new Date().toISOString();

  return {
    id: String(getFirstValue(review, ["id", "_id", "uuid"])),
    customerName:
      sanitizeText(getFirstValue(review, ["customerName", "customer_name", "userName"])) ||
      sanitizeText(getFirstValue(customer, ["name", "full_name", "fullName"]), "عميل"),
    customerAvatar:
      sanitizeText(getFirstValue(review, ["customerAvatar", "customer_avatar", "avatar"])) ||
      sanitizeText(getFirstValue(customer, ["avatar", "image", "photo", "profile_image"])),
    rating: normalizeRating(getFirstValue(review, ["rating", "rate", "stars", "score"], 0)),
    comment: sanitizeText(getFirstValue(review, ["comment", "text", "review", "body", "message"])),
    createdAt,
    providerReply: normalizeReply(
      review.providerReply ||
        review.provider_reply ||
        review.reply ||
        review.response ||
        review.provider_response
    ),
    raw: review,
  };
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
    if (rating) counts.set(rating, (counts.get(rating) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([rating, count]) => ({
    rating,
    count,
  }));
}

export function calculateSummaryFromReviews(reviews = []) {
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

function normalizeSummary(summary = {}, reviews = []) {
  const fallbackSummary = calculateSummaryFromReviews(reviews);
  const totalRatings = toNumber(
    getFirstValue(summary, ["totalRatings", "total_ratings", "total", "count"]),
    fallbackSummary.totalRatings
  );
  const averageRating = toNumber(
    getFirstValue(summary, ["averageRating", "average_rating", "avg", "rating"]),
    fallbackSummary.averageRating
  );
  const distributionSource =
    summary.distribution ||
    summary.ratingDistribution ||
    summary.rating_distribution ||
    summary.counts;
  const distribution = Array.isArray(distributionSource)
    ? distributionSource.map((item) => ({
        rating: normalizeRating(item.rating || item.stars || item.score),
        count: toNumber(item.count || item.total || item.value),
      }))
    : distributionSource && typeof distributionSource === "object"
      ? Object.entries(distributionSource).map(([rating, count]) => ({
          rating: normalizeRating(rating),
          count: toNumber(count),
        }))
      : fallbackSummary.distribution;

  return {
    averageRating,
    totalRatings,
    distribution,
  };
}

function getSummaryFromResponse(data) {
  return (
    data?.summary ||
    data?.data?.summary ||
    data?.meta ||
    data?.data?.meta ||
    data?.rating_summary ||
    data?.data?.rating_summary ||
    {}
  );
}

let latestProviderReviewsResponse = null;

export async function getProviderReviews() {
  try {
    const response = await api.get("/provider/reviews");
    latestProviderReviewsResponse = response.data;

    return unwrapList(response.data, ["reviews", "ratings"])
      .map(normalizeReview)
      .filter((review) => review.id);
  } catch (error) {
    throw createServiceError(
      error,
      "تعذر تحميل التقييمات من الخادم."
    );
  }
}

export async function getProviderRatingSummary(reviews = []) {
  return normalizeSummary(getSummaryFromResponse(latestProviderReviewsResponse), reviews);
}

export async function replyToReview() {
  throw createUnsupportedError("الرد على التقييمات غير موثق في واجهة Wasel API الحالية.");
}

export async function updateReviewReply() {
  throw createUnsupportedError("تعديل ردود التقييمات غير موثق في واجهة Wasel API الحالية.");
}

export async function deleteReviewReply() {
  throw createUnsupportedError("حذف ردود التقييمات غير موثق في واجهة Wasel API الحالية.");
}

export async function getProviderComplaints() {
  throw createUnsupportedError("قائمة شكاوى المزود غير موثقة في واجهة Wasel API الحالية.");
}

export async function replyToComplaint() {
  throw createUnsupportedError("إدارة شكاوى المزود غير موثقة في واجهة Wasel API الحالية.");
}

export async function updateComplaintStatus() {
  throw createUnsupportedError("تحديث حالة شكاوى المزود غير موثق في واجهة Wasel API الحالية.");
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

