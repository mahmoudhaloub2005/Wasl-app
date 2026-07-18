import { useSearchParams } from "react-router-dom";

import Footer from "../../components/layout/Footer/Footer";
import ProviderComplaintsList from "../../components/Provider/ratings/ProviderComplaintsList";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import ProviderRatingsHeader from "../../components/Provider/ratings/ProviderRatingsHeader";
import ProviderReviewsList from "../../components/Provider/ratings/ProviderReviewsList";
import RatingsSort from "../../components/Provider/ratings/RatingsSort";
import RatingsSummary from "../../components/Provider/ratings/RatingsSummary";
import RatingsTabs from "../../components/Provider/ratings/RatingsTabs";
import useProviderRatings from "../../hooks/useProviderRatings";
import "./ProviderRatings.css";

function ProviderPageMessage({ children, tone = "success" }) {
  if (!children) return null;

  return (
    <div
      className={`provider-ratings-message provider-ratings-message--${tone}`}
      role="alert"
    >
      {children}
    </div>
  );
}

function ProviderRatings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    advancedComplaintFilters,
    complaintFilter,
    complaintPage,
    complaintSearchTerm,
    complaintStatusCounts,
    complaints,
    complaintsError,
    complaintsForExport,
    complaintsLoading,
    hasActiveAdvancedFilters,
    isComplaintSearchActive,
    pendingActionKey,
    ratingSummary,
    ratingsError,
    ratingsLoading,
    reviewSort,
    reviews,
    setReviewSort,
    setSuccessMessage,
    successMessage,
    totalComplaintPages,
    totalFilteredComplaints,
    onAdvancedComplaintFiltersApply,
    onAdvancedComplaintFiltersReset,
    onComplaintFilterChange,
    onComplaintReply,
    onComplaintSearchChange,
    onComplaintStatusChange,
    onComplaintsRetry,
    onDeleteReviewReply,
    onEditReviewReply,
    onReplyToReview,
    setComplaintPage,
  } = useProviderRatings();

  const activeTab =
    searchParams.get("tab") === "ratings" ? "ratings" : "complaints";
  const activeError = activeTab === "ratings" ? ratingsError : "";

  function handleTabChange(tab) {
    setSuccessMessage("");
    setSearchParams({ tab });
  }

  return (
    <div className="provider-ratings-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-ratings">
        <ProviderRatingsHeader />
        <RatingsTabs activeTab={activeTab} onChange={handleTabChange} />

        <ProviderPageMessage>{successMessage}</ProviderPageMessage>
        <ProviderPageMessage tone="error">{activeError}</ProviderPageMessage>

        {activeTab === "ratings" ? (
          <>
            <RatingsSummary isLoading={ratingsLoading} summary={ratingSummary} />
            <RatingsSort activeSort={reviewSort} onChange={setReviewSort} />
            <ProviderReviewsList
              isLoading={ratingsLoading}
              pendingActionKey={pendingActionKey}
              reviews={ratingsError ? [] : reviews}
              onDeleteReply={onDeleteReviewReply}
              onEditReply={onEditReviewReply}
              onReply={onReplyToReview}
            />
          </>
        ) : (
          <ProviderComplaintsList
            activeFilter={complaintFilter}
            advancedFilters={advancedComplaintFilters}
            complaints={complaintsError ? [] : complaints}
            complaintsForExport={complaintsForExport}
            counts={complaintStatusCounts}
            currentPage={complaintPage}
            errorMessage={complaintsError}
            hasActiveAdvancedFilters={hasActiveAdvancedFilters}
            isLoading={complaintsLoading}
            isSearchActive={isComplaintSearchActive}
            pendingActionKey={pendingActionKey}
            searchTerm={complaintSearchTerm}
            totalPages={totalComplaintPages}
            totalResults={totalFilteredComplaints}
            onAdvancedFiltersApply={onAdvancedComplaintFiltersApply}
            onAdvancedFiltersReset={onAdvancedComplaintFiltersReset}
            onExportSuccess={setSuccessMessage}
            onFilterChange={onComplaintFilterChange}
            onPageChange={setComplaintPage}
            onReply={onComplaintReply}
            onRetry={onComplaintsRetry}
            onSearchChange={onComplaintSearchChange}
            onStatusChange={onComplaintStatusChange}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProviderRatings;
