import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronDownOutline } from "react-icons/io5";
import CustomerActionSuccessModal from "../Shared/CustomerActionSuccessModal";
import { getApiErrorMessage } from "../../../utils/apiError";

function hasMatchingValue(leftValue, rightValue) {
  return leftValue && rightValue && String(leftValue) === String(rightValue);
}

function matchesEditingReviewTarget(provider, editingReview) {
  if (!editingReview) return false;

  const providerValues = [
    provider.id,
    provider.targetId,
    provider.providerId,
    provider.generatorId,
    provider.subscriptionId,
  ];

  const reviewValues = [
    editingReview.targetId,
    editingReview.providerId,
    editingReview.generatorId,
    editingReview.subscriptionId,
  ];

  return providerValues.some((providerValue) =>
    reviewValues.some((reviewValue) => hasMatchingValue(providerValue, reviewValue))
  );
}

function AddReviewForm({
  editingReview,
  providerOptions = [],
  onAddReview,
  onUpdateReview,
  onCancelEdit,
}) {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultProviderId = providerOptions[0]?.id || "";
  const selectedProvider = providerOptions.find(
    (provider) => String(provider.id) === String(providerId)
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (editingReview) {
        const matchingProvider = providerOptions.find(
          (provider) =>
            matchesEditingReviewTarget(provider, editingReview) ||
            provider.name === editingReview.provider
        );

        setProviderId(matchingProvider?.id || defaultProviderId);
        setRating(editingReview.rating);
        setReviewText(editingReview.text);
        setErrorMessage("");
        return;
      }

      setProviderId(defaultProviderId);
      setRating(5);
      setReviewText("");
      setErrorMessage("");
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [editingReview, defaultProviderId, providerOptions]);

  const resetForm = () => {
    setProviderId(defaultProviderId);
    setRating(5);
    setReviewText("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reviewText.trim()) {
      setErrorMessage("يرجى كتابة رأيك قبل إرسال التقييم.");
      return;
    }

    if (!providerId) {
      setErrorMessage("يرجى اختيار المولد قبل إرسال التقييم.");
      return;
    }

    const reviewData = {
      targetId: selectedProvider?.targetId || providerId,
      providerId: selectedProvider?.providerId || "",
      generatorId: selectedProvider?.generatorId || "",
      subscriptionId: selectedProvider?.subscriptionId || "",
      provider: selectedProvider?.name || "",
      rating,
      text: reviewText,
      iconType: selectedProvider?.iconType || "power",
    };

    try {
      setIsSubmitting(true);

      if (editingReview) {
        await onUpdateReview?.(reviewData);
      } else {
        await onAddReview?.(reviewData);
      }

      resetForm();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إرسال التقييم للخادم. حاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <>
      <aside className="add-review-card">
        <h2>{editingReview ? "تعديل التقييم" : "أضف تقييماً"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="review-form-group">
            <label htmlFor="provider">اختر المولد</label>

            <div className="review-select-wrapper">
              <select
                id="provider"
                value={providerId}
                onChange={(event) => {
                  setProviderId(event.target.value);
                  setErrorMessage("");
                }}
                className="review-provider-select"
                disabled={!providerOptions.length}
              >
                {!providerOptions.length && (
                  <option value="">لا توجد مولدات متاحة</option>
                )}

                {providerOptions.map((provider) => (
                  <option value={provider.id} key={provider.id}>
                    {provider.name}
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

          <button
            type="submit"
            className="send-review-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "جاري الإرسال..."
              : editingReview
                ? "حفظ التعديل"
                : "إرسال التقييم"}
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

      {showSuccessModal && (
        <CustomerActionSuccessModal
          title={
            editingReview
              ? "تم تحديث التقييم بنجاح"
              : "تم إرسال التقييم بنجاح"
          }
          description="شكراً لمشاركتك رأيك، يساعدنا تقييمك على تحسين جودة الخدمة."
          onClose={() => setShowSuccessModal(false)}
          onSupport={() => navigate("/contact-us")}
        />
      )}
    </>
  );
}

export default AddReviewForm;

