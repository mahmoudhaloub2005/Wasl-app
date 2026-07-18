import { useEffect, useMemo, useState } from "react";

import providerComplaintService from "../services/providerComplaintService";
import providerReviewService from "../services/providerReviewService";

const DATA_ERROR_MESSAGE =
  "تعذر تحميل البيانات، يرجى المحاولة مرة أخرى.";
const COMPLAINTS_ERROR_MESSAGE =
  "تعذر تحميل الشكاوى، يرجى المحاولة مرة أخرى.";
const COMPLAINTS_PAGE_SIZE = 3;

const initialAdvancedFilters = {
  status: "all",
  priority: "all",
  dateFrom: "",
  dateTo: "",
  customerName: "",
  subscriberNumber: "",
  ticketNumber: "",
};

function getActionErrorMessage(error, fallback) {
  return error?.displayMessage || error?.message || fallback;
}

function normalizeRatingValue(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) return 0;

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function calculateSummary(reviews = [], fallbackSummary = null) {
  if (fallbackSummary?.totalRatings) {
    const totalRatings = Number(fallbackSummary.totalRatings || 0);
    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const match = (fallbackSummary.distribution || []).find(
        (item) => Number(item.rating) === rating
      );
      const count = Number(match?.count || 0);

      return {
        rating,
        count,
        percentage: totalRatings ? Math.round((count / totalRatings) * 100) : 0,
      };
    });

    return {
      averageRating: Number(fallbackSummary.averageRating || 0),
      totalRatings,
      distribution,
    };
  }

  const totalRatings = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter(
      (review) => normalizeRatingValue(review.rating) === rating
    ).length;

    return {
      rating,
      count,
      percentage: totalRatings ? Math.round((count / totalRatings) * 100) : 0,
    };
  });
  const totalScore = reviews.reduce(
    (total, review) => total + normalizeRatingValue(review.rating),
    0
  );

  return {
    averageRating: totalRatings ? Number((totalScore / totalRatings).toFixed(1)) : 0,
    totalRatings,
    distribution,
  };
}

function sortReviewsByOption(reviews, sortOption) {
  return [...reviews].sort((firstReview, secondReview) => {
    if (sortOption === "highest") {
      return (
        normalizeRatingValue(secondReview.rating) -
        normalizeRatingValue(firstReview.rating)
      );
    }

    if (sortOption === "lowest") {
      return (
        normalizeRatingValue(firstReview.rating) -
        normalizeRatingValue(secondReview.rating)
      );
    }

    return (
      new Date(secondReview.createdAt || 0).getTime() -
      new Date(firstReview.createdAt || 0).getTime()
    );
  });
}

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function complaintMatchesSearch(complaint, searchTerm) {
  const searchValue = normalizeSearchValue(searchTerm);

  if (!searchValue) return true;

  return [
    complaint.ticketNumber,
    complaint.customerName,
    complaint.subscriberNumber,
    complaint.title,
    complaint.description,
  ].some((value) => normalizeSearchValue(value).includes(searchValue));
}

function complaintMatchesAdvancedFilters(complaint, filters) {
  const createdAt = complaint.createdAt ? new Date(complaint.createdAt) : null;
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

  if (filters.status !== "all" && complaint.status !== filters.status) {
    return false;
  }

  if (filters.priority !== "all" && complaint.priority !== filters.priority) {
    return false;
  }

  if (
    filters.customerName &&
    !normalizeSearchValue(complaint.customerName).includes(
      normalizeSearchValue(filters.customerName)
    )
  ) {
    return false;
  }

  if (
    filters.subscriberNumber &&
    !normalizeSearchValue(complaint.subscriberNumber).includes(
      normalizeSearchValue(filters.subscriberNumber)
    )
  ) {
    return false;
  }

  if (
    filters.ticketNumber &&
    !normalizeSearchValue(complaint.ticketNumber).includes(
      normalizeSearchValue(filters.ticketNumber)
    )
  ) {
    return false;
  }

  if (createdAt && dateFrom && createdAt < dateFrom) {
    return false;
  }

  if (createdAt && dateTo) {
    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);

    if (createdAt > endOfDay) {
      return false;
    }
  }

  return true;
}

function getComplaintStatusCounts(complaints) {
  return complaints.reduce(
    (counts, complaint) => ({
      ...counts,
      [complaint.status]: (counts[complaint.status] || 0) + 1,
      all: counts.all + 1,
    }),
    { all: 0, pending: 0, under_review: 0, resolved: 0 }
  );
}

function hasActiveAdvancedFilters(filters) {
  return Object.entries(filters).some(([key, value]) => {
    if (key === "status" || key === "priority") {
      return value !== "all";
    }

    return Boolean(String(value || "").trim());
  });
}

export function useProviderRatings({
  complaintService = providerComplaintService,
  reviewService = providerReviewService,
} = {}) {
  const [reviewSort, setReviewSort] = useState("newest");
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [complaintSearchTerm, setComplaintSearchTermState] = useState("");
  const [advancedComplaintFilters, setAdvancedComplaintFilters] = useState(
    initialAdvancedFilters
  );
  const [complaintPage, setComplaintPageState] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fallbackSummary, setFallbackSummary] = useState(null);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState("");
  const [complaintsError, setComplaintsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProviderRatingsPage() {
      setRatingsLoading(true);
      setComplaintsLoading(true);
      setRatingsError("");
      setComplaintsError("");

      const [reviewsResult, complaintsResult] = await Promise.all([
        reviewService.getProviderReviews().then(
          (value) => ({ status: "fulfilled", value }),
          (reason) => ({ status: "rejected", reason })
        ),
        complaintService.getProviderComplaints().then(
          (value) => ({ status: "fulfilled", value }),
          (reason) => ({ status: "rejected", reason })
        ),
      ]);

      if (!isMounted) return;

      if (reviewsResult.status === "fulfilled") {
        setReviews(reviewsResult.value);
      } else {
        setReviews([]);
        setFallbackSummary(null);
        setRatingsError(
          getActionErrorMessage(reviewsResult.reason, DATA_ERROR_MESSAGE)
        );
      }

      if (complaintsResult.status === "fulfilled") {
        setComplaints(complaintsResult.value);
      } else {
        setComplaints([]);
        setComplaintsError(
          getActionErrorMessage(complaintsResult.reason, COMPLAINTS_ERROR_MESSAGE)
        );
      }

      setComplaintsLoading(false);

      if (reviewsResult.status === "fulfilled") {
        try {
          const nextSummary = await reviewService.getProviderRatingSummary(
            reviewsResult.value
          );

          if (isMounted) {
            setFallbackSummary(nextSummary);
          }
        } catch {
          if (isMounted) {
            setFallbackSummary(null);
          }
        }
      }

      if (isMounted) {
        setRatingsLoading(false);
      }
    }

    loadProviderRatingsPage();

    return () => {
      isMounted = false;
    };
  }, [complaintService, reviewService]);

  const ratingSummary = useMemo(
    () => calculateSummary(reviews, fallbackSummary),
    [reviews, fallbackSummary]
  );

  const sortedReviews = useMemo(
    () => sortReviewsByOption(reviews, reviewSort),
    [reviews, reviewSort]
  );

  const complaintBaseResults = useMemo(
    () =>
      complaints.filter(
        (complaint) =>
          complaintMatchesSearch(complaint, complaintSearchTerm) &&
          complaintMatchesAdvancedFilters(complaint, advancedComplaintFilters)
      ),
    [advancedComplaintFilters, complaintSearchTerm, complaints]
  );

  const complaintStatusCounts = useMemo(
    () => getComplaintStatusCounts(complaintBaseResults),
    [complaintBaseResults]
  );

  const filteredComplaints = useMemo(() => {
    if (complaintFilter === "all") return complaintBaseResults;

    return complaintBaseResults.filter(
      (complaint) => complaint.status === complaintFilter
    );
  }, [complaintBaseResults, complaintFilter]);

  const totalComplaintPages = Math.ceil(
    filteredComplaints.length / COMPLAINTS_PAGE_SIZE
  );
  const safeComplaintPage = Math.min(
    Math.max(1, complaintPage),
    Math.max(1, totalComplaintPages)
  );
  const paginatedComplaints = useMemo(() => {
    const startIndex = (safeComplaintPage - 1) * COMPLAINTS_PAGE_SIZE;

    return filteredComplaints.slice(
      startIndex,
      startIndex + COMPLAINTS_PAGE_SIZE
    );
  }, [filteredComplaints, safeComplaintPage]);

  function updateReviewReplyState(reviewId, providerReply) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        String(review.id) === String(reviewId)
          ? { ...review, providerReply }
          : review
      )
    );
  }

  function updateComplaintState(nextComplaint) {
    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        String(complaint.id) === String(nextComplaint.id)
          ? nextComplaint
          : complaint
      )
    );
  }

  function setComplaintSearchTerm(value) {
    setComplaintSearchTermState(value);
    setComplaintPageState(1);
  }

  function changeComplaintFilter(value) {
    setComplaintFilter(value);
    setComplaintPageState(1);
  }

  function applyAdvancedComplaintFilters(filters) {
    setAdvancedComplaintFilters(filters);
    setComplaintPageState(1);
  }

  function resetAdvancedComplaintFilters() {
    setAdvancedComplaintFilters(initialAdvancedFilters);
    setComplaintPageState(1);
  }

  function setComplaintPage(page) {
    setComplaintPageState(page);
  }

  async function retryComplaints() {
    setComplaintsLoading(true);
    setComplaintsError("");

    try {
      const nextComplaints = await complaintService.getProviderComplaints();
      setComplaints(nextComplaints);
    } catch (error) {
      setComplaintsError(
        getActionErrorMessage(error, COMPLAINTS_ERROR_MESSAGE)
      );
    } finally {
      setComplaintsLoading(false);
    }
  }

  async function submitReviewReply(reviewId, reply) {
    setPendingActionKey(`review-reply-${reviewId}`);
    setRatingsError("");
    setSuccessMessage("");

    try {
      const nextReply = await reviewService.replyToReview(reviewId, reply);
      updateReviewReplyState(reviewId, nextReply);
      setSuccessMessage("تم إرسال الرد بنجاح");
      return true;
    } catch (error) {
      setRatingsError(
        getActionErrorMessage(error, "فشل إرسال الرد، يرجى المحاولة مرة أخرى.")
      );
      return false;
    } finally {
      setPendingActionKey("");
    }
  }

  async function editReviewReply(reviewId, reply) {
    setPendingActionKey(`review-reply-${reviewId}`);
    setRatingsError("");
    setSuccessMessage("");

    try {
      const nextReply = await reviewService.updateReviewReply(reviewId, reply);
      updateReviewReplyState(reviewId, nextReply);
      setSuccessMessage("تم تعديل الرد بنجاح");
      return true;
    } catch (error) {
      setRatingsError(
        getActionErrorMessage(error, "فشل تعديل الرد، يرجى المحاولة مرة أخرى.")
      );
      return false;
    } finally {
      setPendingActionKey("");
    }
  }

  async function removeReviewReply(reviewId) {
    setPendingActionKey(`review-delete-${reviewId}`);
    setRatingsError("");
    setSuccessMessage("");

    try {
      await reviewService.deleteReviewReply(reviewId);
      updateReviewReplyState(reviewId, null);
      setSuccessMessage("تم حذف الرد بنجاح");
    } catch (error) {
      setRatingsError(
        getActionErrorMessage(error, "فشل حذف الرد، يرجى المحاولة مرة أخرى.")
      );
    } finally {
      setPendingActionKey("");
    }
  }

  async function submitComplaintReply(complaintId, payload) {
    setPendingActionKey(`complaint-reply-${complaintId}`);
    setComplaintsError("");
    setSuccessMessage("");

    try {
      const nextComplaint = await complaintService.replyToComplaint(
        complaintId,
        payload
      );

      updateComplaintState(nextComplaint);
      setSuccessMessage("تم إرسال الرد بنجاح");
      return true;
    } catch (error) {
      setComplaintsError(
        getActionErrorMessage(error, "فشل إرسال الرد، يرجى المحاولة مرة أخرى.")
      );
      return false;
    } finally {
      setPendingActionKey("");
    }
  }

  async function updateComplaintStatus(complaintId, status) {
    setPendingActionKey(`complaint-status-${complaintId}`);
    setComplaintsError("");
    setSuccessMessage("");

    try {
      const nextComplaint = await complaintService.updateComplaintStatus(
        complaintId,
        status
      );

      updateComplaintState(nextComplaint);
      setSuccessMessage(
        status === "resolved"
          ? "تم حل الشكوى بنجاح"
          : "تم تحديث حالة الشكوى بنجاح"
      );
      return true;
    } catch (error) {
      setComplaintsError(
        getActionErrorMessage(
          error,
          "فشل تحديث حالة الشكوى، يرجى المحاولة مرة أخرى."
        )
      );
      return false;
    } finally {
      setPendingActionKey("");
    }
  }

  return {
    advancedComplaintFilters,
    complaintFilter,
    complaintPage: safeComplaintPage,
    complaintSearchTerm,
    complaintStatusCounts,
    complaints: paginatedComplaints,
    complaintsError,
    complaintsForExport: filteredComplaints,
    complaintsLoading,
    hasActiveAdvancedFilters: hasActiveAdvancedFilters(advancedComplaintFilters),
    isComplaintSearchActive: Boolean(complaintSearchTerm.trim()),
    pendingActionKey,
    ratingSummary,
    ratingsError,
    ratingsLoading,
    reviewSort,
    reviews: sortedReviews,
    setComplaintPage,
    setReviewSort,
    setSuccessMessage,
    successMessage,
    totalComplaintPages,
    totalFilteredComplaints: filteredComplaints.length,
    onAdvancedComplaintFiltersApply: applyAdvancedComplaintFilters,
    onAdvancedComplaintFiltersReset: resetAdvancedComplaintFilters,
    onComplaintFilterChange: changeComplaintFilter,
    onComplaintReply: submitComplaintReply,
    onComplaintSearchChange: setComplaintSearchTerm,
    onComplaintStatusChange: updateComplaintStatus,
    onComplaintsRetry: retryComplaints,
    onDeleteReviewReply: removeReviewReply,
    onEditReviewReply: editReviewReply,
    onReplyToReview: submitReviewReply,
  };
}

export default useProviderRatings;
