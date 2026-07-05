import { useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

function AddReviewForm({
  editingReview,
  onAddReview,
  onUpdateReview,
  onCancelEdit,
}) {
  const [provider, setProvider] = useState("سولار ستريم للحلول");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const providers = [
    "سولار ستريم للحلول",
    "سيتي جريد للطاقة",
    "مولد النور",
    "مولد الأمان",
  ];

  useEffect(() => {
    if (editingReview) {
      setProvider(editingReview.provider);
      setRating(editingReview.rating);
      setReviewText(editingReview.text);
      setErrorMessage("");
      return;
    }

    setProvider("سولار ستريم للحلول");
    setRating(5);
    setReviewText("");
    setErrorMessage("");
  }, [editingReview]);

  const getIconType = (providerName) => {
    if (providerName === "سيتي جريد للطاقة") {
      return "city";
    }

    return "power";
  };

  const resetForm = () => {
    setProvider("سولار ستريم للحلول");
    setRating(5);
    setReviewText("");
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!reviewText.trim()) {
      setErrorMessage("يرجى كتابة رأيك قبل إرسال التقييم.");
      return;
    }

    const reviewData = {
      provider,
      rating,
      text: reviewText,
      iconType: getIconType(provider),
    };

    if (editingReview) {
      onUpdateReview?.(reviewData);
    } else {
      onAddReview?.(reviewData);
    }

    resetForm();
  };

  const handleCancelEdit = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <aside className="add-review-card">
      <h2>{editingReview ? "تعديل التقييم" : "أضف تقييماً"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="review-form-group">
          <label htmlFor="provider">اختر المزود</label>

          <div className="review-select-wrapper">
            <select
              id="provider"
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
              className="review-provider-select"
            >
              {providers.map((providerName) => (
                <option value={providerName} key={providerName}>
                  {providerName}
                </option>
              ))}
            </select>

            <IoChevronDownOutline className="review-select-arrow" />
          </div>
        </div>

        <div className="review-form-group">
          <label>التقييم</label>

          <div className="review-form-stars">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;

              return (
                <button
                  type="button"
                  key={starValue}
                  className={
                    starValue <= rating
                      ? "review-star-button active"
                      : "review-star-button"
                  }
                  onClick={() => setRating(starValue)}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div className="review-form-group">
          <label htmlFor="reviewText">رأيك</label>

          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(event) => {
              setReviewText(event.target.value);
              setErrorMessage("");
            }}
            placeholder="كيف كانت تجربتك؟"
          />
        </div>

        {errorMessage && <p className="review-form-error">{errorMessage}</p>}

        <button type="submit" className="send-review-button">
          {editingReview ? "حفظ التعديل" : "إرسال التقييم"}
        </button>

        {editingReview && (
          <button
            type="button"
            className="cancel-edit-review-button"
            onClick={handleCancelEdit}
          >
            إلغاء التعديل
          </button>
        )}
      </form>
    </aside>
  );
}

export default AddReviewForm;