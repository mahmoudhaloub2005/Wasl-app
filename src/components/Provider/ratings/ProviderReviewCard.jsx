import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

import ProviderReplyForm from "./ProviderReplyForm";
import { formatReviewDate, getInitials } from "./providerRatingsFormatters";

function ReviewStars({ rating }) {
  return (
    <div className="provider-review-card__stars" aria-label={`${rating} من 5`}>
      {Array.from({ length: 5 }, (_, index) =>
        index < rating ? (
          <FaStar key={index} aria-hidden="true" />
        ) : (
          <FaRegStar key={index} aria-hidden="true" />
        )
      )}
    </div>
  );
}

function ProviderReviewCard({
  isSubmitting = false,
  onDeleteReply,
  onEditReply,
  onReply,
  review,
}) {
  const [formMode, setFormMode] = useState("");
  const hasReply = Boolean(review.providerReply?.text);

  async function handleReplySubmit(reply) {
    const succeeded =
      formMode === "edit"
        ? await onEditReply(review.id, reply)
        : await onReply(review.id, reply);

    if (succeeded) {
      setFormMode("");
    }
  }

  function handleDeleteReply() {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا الرد؟"
    );

    if (confirmed) {
      onDeleteReply(review.id);
    }
  }

  return (
    <article className="provider-review-card">
      <header className="provider-review-card__header">
        <div className="provider-review-card__customer">
          {review.customerAvatar ? (
            <img src={review.customerAvatar} alt={review.customerName} />
          ) : (
            <span>{getInitials(review.customerName)}</span>
          )}
          <div>
            <h3>{review.customerName}</h3>
            <time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time>
          </div>
        </div>

        <ReviewStars rating={review.rating} />
      </header>

      <p className="provider-review-card__comment">{review.comment}</p>

      {hasReply && (
        <section className="provider-reply-box" aria-label="رد المزود">
          <div className="provider-reply-box__header">
            <strong>رد المزود</strong>
            <time dateTime={review.providerReply.createdAt}>
              {formatReviewDate(review.providerReply.createdAt)}
            </time>
          </div>
          <p>{review.providerReply.text}</p>
        </section>
      )}

      {formMode && (
        <ProviderReplyForm
          initialValue={formMode === "edit" ? review.providerReply?.text : ""}
          isSubmitting={isSubmitting}
          onCancel={() => setFormMode("")}
          onSubmit={handleReplySubmit}
          submitLabel={formMode === "edit" ? "حفظ التعديل" : "إرسال الرد"}
        />
      )}

      {!formMode && (
        <footer className="provider-review-card__actions">
          {hasReply ? (
            <>
              <button
                type="button"
                className="provider-review-card__link-action"
                disabled={isSubmitting}
                onClick={() => setFormMode("edit")}
              >
                تعديل الرد
              </button>
              <button
                type="button"
                className="provider-review-card__link-action provider-review-card__link-action--danger"
                disabled={isSubmitting}
                onClick={handleDeleteReply}
              >
                حذف
              </button>
            </>
          ) : (
            <button
              type="button"
              className="provider-review-card__reply-button"
              disabled={isSubmitting}
              onClick={() => setFormMode("reply")}
            >
              الرد على العميل
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

export default ProviderReviewCard;
