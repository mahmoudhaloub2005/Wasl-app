import ProviderReviewCard from "./ProviderReviewCard";

function ReviewSkeleton() {
  return (
    <article className="provider-review-card provider-review-card--loading">
      <span />
      <span />
      <span />
      <span />
    </article>
  );
}

function ProviderReviewsList({
  isLoading,
  onDeleteReply,
  onEditReply,
  onReply,
  pendingActionKey,
  reviews,
}) {
  if (isLoading) {
    return (
      <div className="provider-reviews-list" aria-label="جار تحميل التقييمات">
        {Array.from({ length: 2 }, (_, index) => (
          <ReviewSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <section className="provider-ratings-empty">
        <h2>لا توجد بيانات حالياً</h2>
        <p>ستظهر البيانات هنا عند توفرها.</p>
      </section>
    );
  }

  return (
    <div className="provider-reviews-list">
      {reviews.map((review) => (
        <ProviderReviewCard
          isSubmitting={
            pendingActionKey === `review-reply-${review.id}` ||
            pendingActionKey === `review-delete-${review.id}`
          }
          key={review.id}
          review={review}
          onDeleteReply={onDeleteReply}
          onEditReply={onEditReply}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

export default ProviderReviewsList;
