import {
  IoFlashOutline,
  IoBusinessOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";

function ReviewsList({ reviews, onEditReview, onDeleteReview }) {
  const getReviewIcon = (iconType) => {
    if (iconType === "city") {
      return <IoBusinessOutline />;
    }

    return <IoFlashOutline />;
  };

  if (reviews.length === 0) {
    return (
      <div className="reviews-empty-state">
        <h3>لا توجد تقييمات حالياً</h3>
        <p>عند إضافة تقييم جديد سيظهر هنا.</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <article className="review-card" key={review.id}>
          <div className="review-card-header">
            <div className="review-provider-info">
              <span className="review-provider-icon">
                {getReviewIcon(review.iconType)}
              </span>

              <div>
                <h3>{review.provider}</h3>
                <p>{review.date}</p>
              </div>
            </div>

            <div className="review-actions">
              <button
                type="button"
                className="review-action-button edit"
                onClick={() => onEditReview?.(review)}
              >
                <IoCreateOutline />
                تعديل
              </button>

              <button
                type="button"
                className="review-action-button delete"
                onClick={() => onDeleteReview?.(review.id)}
              >
                <IoTrashOutline />
                حذف
              </button>
            </div>
          </div>

          <div className="review-rating">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={index < review.rating ? "active" : ""}
              >
                ★
              </span>
            ))}
          </div>

          <p className="review-text">{review.text}</p>
        </article>
      ))}
    </div>
  );
}

export default ReviewsList;