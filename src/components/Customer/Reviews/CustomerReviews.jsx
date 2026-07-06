import { useEffect, useState } from "react";
import "./CustomerReviews.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import AddReviewForm from "./AddReviewForm";
import ReviewsList from "./ReviewsList";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../../../services/reviewService";
import { getGenerators } from "../../../services/generatorService";
import { getApiErrorMessage } from "../../../utils/apiError";

const fallbackReviews = [
  {
    id: 1,
    provider: "سولار ستريم للحلول",
    date: "12 مارس 2024",
    iconType: "power",
    rating: 5,
    text: "خدمة رائعة! عملية الانتقال كانت سلسة والفواتير شفافة للغاية.",
  },
  {
    id: 2,
    provider: "سيتي جريد للطاقة",
    date: "28 فبراير 2024",
    iconType: "city",
    rating: 5,
    text: "التجربة كانت جيدة، لكن وقت الاستجابة للدعم الفني يمكن أن يكون أفضل.",
  },
];

function buildProviderOptions(generators = []) {
  const providersMap = new Map();

  generators.forEach((generator) => {
    const providerId = generator.provider?.id;

    if (!providerId) {
      return;
    }

    const key = String(providerId);

    if (!providersMap.has(key)) {
      const displayName =
        generator.name || generator.provider?.name || `مزود الخدمة ${providersMap.size + 1}`;

      providersMap.set(key, {
        id: key,
        name: displayName,
        iconType: String(displayName)
          .toLowerCase()
          .includes("city")
          ? "city"
          : "power",
      });
    }
  });

  return Array.from(providersMap.values());
}

function CustomerReviews() {
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState(fallbackReviews);
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

    async function loadReviewProviders() {
      try {
        setLoading(true);
        setMessage("");

        const generators = await getGenerators();

        if (isMounted) {
          setProviderOptions(buildProviderOptions(generators));
        }
      } catch (error) {
        console.error("Failed to load provider options:", error);

        if (isMounted) {
          setMessage(
            "تعذر تحميل قائمة المزودين من الخادم، حاول مرة أخرى."
          );
          setProviderOptions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviewProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddReview = async (newReviewData) => {
    const createdReview = await createReview({
      target_id: newReviewData.targetId,
      provider_name: newReviewData.provider,
      rate: newReviewData.rating,
      rating: newReviewData.rating,
      comment: newReviewData.text,
    });

    setReviews((prevReviews) => [
      {
        ...createdReview,
        provider: createdReview.provider || newReviewData.provider,
        date: createdReview.date || getTodayDate(),
        iconType: newReviewData.iconType,
        rating: createdReview.rating || newReviewData.rating,
        text: createdReview.text || newReviewData.text,
      },
      ...prevReviews,
    ]);
  };

  const handleStartEditReview = (review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (updatedReviewData) => {
    const updatedReview = editingReview?.id
      ? await updateReview(editingReview.id, {
          target_id: updatedReviewData.targetId,
          provider_name: updatedReviewData.provider,
          rate: updatedReviewData.rating,
          rating: updatedReviewData.rating,
          comment: updatedReviewData.text,
        })
      : updatedReviewData;

    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === editingReview.id
          ? {
              ...review,
              ...updatedReview,
              provider: updatedReview.provider || updatedReviewData.provider,
              iconType: updatedReviewData.iconType,
              rating: updatedReview.rating || updatedReviewData.rating,
              text: updatedReview.text || updatedReviewData.text,
              date: updatedReview.date || getTodayDate(),
            }
          : review
      )
    );

    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    const isConfirmed = window.confirm("هل أنت متأكد من حذف هذا التقييم؟");

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error("Failed to delete review:", error);
      setMessage(
        getApiErrorMessage(error, "تعذر حذف التقييم من الخادم. حاول مرة أخرى.")
      );
      return;
    }

    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );

    if (editingReview?.id === reviewId) {
      setEditingReview(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  return (
    <main className="customer-reviews-page" dir="rtl">
      <div className="customer-reviews-container">
        <ReviewsComplaintsTabs />

        {loading && (
          <p className="subscription-action-message">جاري تحميل التقييمات...</p>
        )}

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

            <ReviewsList
              reviews={reviews}
              onEditReview={handleStartEditReview}
              onDeleteReview={handleDeleteReview}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default CustomerReviews;
