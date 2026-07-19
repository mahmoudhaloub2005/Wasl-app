import { useMemo, useState } from "react";

const COMPLAINTS_PAGE_SIZE = 3;
const EMPTY_REVIEWS = [];
const EMPTY_COMPLAINTS = [];

const initialAdvancedFilters = {
  status: "all",
  priority: "all",
  dateFrom: "",
  dateTo: "",
  customerName: "",
  subscriberNumber: "",
  ticketNumber: "",
};

function normalizeRatingValue(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) return 0;

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function calculateSummary(reviews = []) {
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

async function noopUnavailableAction() {
  return false;
}

export function useProviderRatings({
  initialReviews = EMPTY_REVIEWS,
  initialComplaints = EMPTY_COMPLAINTS,
} = {}) {
  const [reviewSort, setReviewSort] = useState("newest");
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [complaintSearchTerm, setComplaintSearchTermState] = useState("");
  const [advancedComplaintFilters, setAdvancedComplaintFilters] = useState(
    initialAdvancedFilters
  );
  const [complaintPage, setComplaintPageState] = useState(1);
  const [reviews] = useState(() => [...initialReviews]);
  const [complaints] = useState(() => [...initialComplaints]);
  const [successMessage, setSuccessMessage] = useState("");

  const ratingSummary = useMemo(() => calculateSummary(reviews), [reviews]);

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

  return {
    advancedComplaintFilters,
    complaintFilter,
    complaintPage: safeComplaintPage,
    complaintSearchTerm,
    complaintStatusCounts,
    complaints: paginatedComplaints,
    complaintsError: "",
    complaintsForExport: filteredComplaints,
    complaintsLoading: false,
    hasActiveAdvancedFilters: hasActiveAdvancedFilters(advancedComplaintFilters),
    pendingActionKey: "",
    ratingSummary,
    ratingsError: "",
    ratingsLoading: false,
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
    onComplaintReply: noopUnavailableAction,
    onComplaintSearchChange: setComplaintSearchTerm,
    onComplaintStatusChange: noopUnavailableAction,
    onDeleteReviewReply: noopUnavailableAction,
    onEditReviewReply: noopUnavailableAction,
    onReplyToReview: noopUnavailableAction,
  };
}

export default useProviderRatings;
