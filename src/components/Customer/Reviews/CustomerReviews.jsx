import { useEffect, useState } from "react";
import "./CustomerReviews.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import AddReviewForm from "./AddReviewForm";
import ReviewsList from "./ReviewsList";
import { createReview, getMyReviews } from "../../../services/reviewService";
import { getGenerators } from "../../../services/generatorService";

const LOCAL_REVIEWS_KEY = "customer_local_reviews";

function getLocalReviews() {
  try {
    const value = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Failed to read local reviews:", error);
    return [];
  }
}

function saveLocalReviews(reviews) {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save local reviews:", error);
  }
}

function mergeReviews(serverReviews = [], localReviews = []) {
  const map = new Map();

  [...serverReviews, ...localReviews].forEach((review) => {
    if (!review?.id) return;
    map.set(String(review.id), review);
  });

  return Array.from(map.values());
}

function buildGeneratorOptions(generators = []) {
  return generators
    .filter((generator) => generator.id)
    .map((generator, index) => {
      const displayName =
        generator.name ||
        generator.generatorType ||
        generator.provider?.name ||
        `مولد ${index + 1}`;

      return {
        id: String(generator.id),
        name: displayName,
        iconType: String(displayName).toLowerCase().includes("city")
          ? "city"
          : "power",
      };
    });
}

function CustomerReviews() {
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getTodayDate = () =>
    new Date().toLocaleDateString("ar", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  useEffect(() => {
    let isMounted = true;

    async function loadReviewsPageData() {
      try {
        setLoading(true);
        setMessage("");

        const localReviews = getLocalReviews();

        const [generatorsResult, reviewsResult] = await Promise.allSettled([
          getGenerators(),
          getMyReviews(),
        ]);

        if (isMounted) {
          const nextMessages = [];

          if (generatorsResult.status === "fulfilled") {
            setProviderOptions(buildGeneratorOptions(generatorsResult.value));
          } else {
            console.error(
              "Failed to load provider options:",
              generatorsResult.reason
            );

            setProviderOptions([]);

            if (
              generatorsResult.reason?.response?.status !== 404 &&
              generatorsResult.reason?.response?.status !== 405
            ) {
              nextMessages.push("تعذر تحميل قائمة المزودين من الخادم.");
            }
          }

          if (reviewsResult.status === "fulfilled") {
            const serverReviews = Array.isArray(reviewsResult.value)
              ? reviewsResult.value
              : [];

            setReviews(mergeReviews(serverReviews, localReviews));
          } else {
            console.error("Failed to load reviews:", reviewsResult.reason);

            setReviews(localReviews);

            if (
              reviewsResult.reason?.response?.status !== 404 &&
              reviewsResult.reason?.response?.status !== 405
            ) {
              nextMessages.push("تعذر تحميل التقييمات من الخادم.");
            }
          }

          setMessage(nextMessages.join(" "));
        }
      } catch (error) {
        console.error("Failed to load reviews page:", error);

        if (isMounted) {
          setMessage("تعذر تحميل البيانات من الخادم.");
          setProviderOptions([]);
          setReviews(getLocalReviews());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviewsPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddReview = async (newReviewData) => {
    setMessage("");

    const localReview = {
      id: `local-review-${Date.now()}`,
      provider: newReviewData.provider || "المولد",
      targetId: newReviewData.targetId,
      date: getTodayDate(),
      iconType: newReviewData.iconType || "power",
      rating: newReviewData.rating,
      text: newReviewData.text,
    };

    try {
      const createdReview = await createReview({
        generator_id: newReviewData.targetId,
        rating: newReviewData.rating,
        comment: newReviewData.text,
      });

      const finalReview = {
        ...localReview,
        ...createdReview,
        provider: createdReview.provider || newReviewData.provider,
        date: createdReview.date || getTodayDate(),
        iconType: newReviewData.iconType,
        rating: createdReview.rating || newReviewData.rating,
        text: createdReview.text || newReviewData.text,
      };

      setReviews((prevReviews) => {
        const nextReviews = [finalReview, ...prevReviews];
        saveLocalReviews(nextReviews);
        return nextReviews;
      });

      setMessage("تم إضافة التقييم بنجاح.");
    } catch (error) {
      console.error("Failed to create review:", error);

      setReviews((prevReviews) => {
        const nextReviews = [localReview, ...prevReviews];
        saveLocalReviews(nextReviews);
        return nextReviews;
      });

      setMessage(
        error.displayMessage ||
          "تم حفظ التقييم محلياً، لكن تعذر إرساله للخادم حالياً."
      );
    }
  };

  const handleStartEditReview = (review) => {
    setEditingReview(review);
    setMessage("");
  };

  const handleUpdateReview = async (updatedReviewData) => {
    if (!editingReview?.id) {
      setMessage("لا يمكن تعديل التقييم لأن رقم التقييم غير موجود.");
      return;
    }

    const updatedReview = {
      ...editingReview,
      provider: updatedReviewData.provider || editingReview.provider,
      targetId: updatedReviewData.targetId || editingReview.targetId,
      iconType: updatedReviewData.iconType || editingReview.iconType,
      rating: updatedReviewData.rating || editingReview.rating,
      text: updatedReviewData.text || editingReview.text,
      date: editingReview.date || getTodayDate(),
    };

    setReviews((prevReviews) => {
      const nextReviews = prevReviews.map((review) =>
        String(review.id) === String(editingReview.id) ? updatedReview : review
      );

      saveLocalReviews(nextReviews);
      return nextReviews;
    });

    setEditingReview(null);
    setMessage("تم تعديل التقييم بنجاح.");
  };

  const handleDeleteReview = async (reviewOrId) => {
    const reviewId =
      typeof reviewOrId === "object" ? reviewOrId.id : reviewOrId;

    if (!reviewId) {
      setMessage("لا يمكن حذف التقييم لأن رقم التقييم غير موجود.");
      return;
    }

    const confirmed = window.confirm("هل أنت متأكد من حذف هذا التقييم؟");

    if (!confirmed) return;

    setReviews((prevReviews) => {
      const nextReviews = prevReviews.filter(
        (review) => String(review.id) !== String(reviewId)
      );

      saveLocalReviews(nextReviews);
      return nextReviews;
    });

    if (String(editingReview?.id) === String(reviewId)) {
      setEditingReview(null);
    }

    setMessage("تم حذف التقييم بنجاح.");
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setMessage("");
  };

  return (
    <main className="customer-reviews-page" dir="rtl">
      <div className="customer-reviews-container">
        <ReviewsComplaintsTabs />

        {message && <p className="subscription-action-message">{message}</p>}

        <div className="customer-reviews-layout">
          <AddReviewForm
            editingReview={editingReview}
            providerOptions={providerOptions}
            onAddReview={handleAddReview}
            onUpdateReview={handleUpdateReview}
            onCancelEdit={handleCancelEdit}
          />

          <section className="my-reviews-section">
            <div className="reviews-list-top">
              <span>الإجمالي: {reviews.length}</span>
              <h1>تقييماتي</h1>
            </div>

            {loading ? (
              <div className="reviews-empty-state">
                <h3>جاري تحميل التقييمات...</h3>
                <p>نحضّر بياناتك من الخادم.</p>
              </div>
            ) : (
              <ReviewsList
                reviews={reviews}
                onEditReview={handleStartEditReview}
                onDeleteReview={handleDeleteReview}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default CustomerReviews;