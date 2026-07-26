import { useEffect, useState } from "react";
import "./CustomerReviews.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import AddReviewForm from "./AddReviewForm";
import ReviewsList from "./ReviewsList";
import {
  createReview,
  getMyReviews,
  getReviewableSubscriptions,
} from "../../../services/reviewService";

const REVIEW_LIST_UNAVAILABLE_MESSAGE =
  "قائمة تقييمات العميل غير متاحة من الخادم حالياً.";

function getReviewTargetName(option, fallbackName) {
  return (
    option.name ||
    option.provider ||
    option.generatorName ||
    option.generatorType ||
    option.provider?.name ||
    fallbackName
  );
}

function getIconType(displayName) {
  return String(displayName).toLowerCase().includes("city") ? "city" : "power";
}

function buildSubscriptionOptions(subscriptions = []) {
  return subscriptions
    .filter(
      (subscription) =>
        subscription.targetId || subscription.providerId || subscription.generatorId
    )
    .map((subscription, index) => {
      const displayName = getReviewTargetName(
        subscription,
        `اشتراك رقم ${index + 1}`
      );

      return {
        id: String(
          subscription.subscriptionId ||
            subscription.targetId ||
            subscription.providerId ||
            subscription.generatorId
        ),
        subscriptionId: subscription.subscriptionId,
        providerId: subscription.providerId,
        generatorId: subscription.generatorId,
        targetId:
          subscription.targetId ||
          subscription.providerId ||
          subscription.generatorId,
        name: displayName,
        iconType: getIconType(displayName),
      };
    });
}

async function loadReviewTargetOptions() {
  const subscriptions = await getReviewableSubscriptions();
  return buildSubscriptionOptions(subscriptions);
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

        const [targetOptionsResult, reviewsResult] = await Promise.allSettled([
          loadReviewTargetOptions(),
          getMyReviews(),
        ]);

        if (isMounted) {
          const nextMessages = [];

          if (targetOptionsResult.status === "fulfilled") {
            const nextProviderOptions = targetOptionsResult.value;
            setProviderOptions(nextProviderOptions);

            if (!nextProviderOptions.length) {
              nextMessages.push("لا توجد اشتراكات متاحة للتقييم حالياً.");
            }
          } else {
            console.error(
              "Failed to load provider options:",
              targetOptionsResult.reason
            );

            setProviderOptions([]);

            if (
              targetOptionsResult.reason?.response?.status !== 404 &&
              targetOptionsResult.reason?.response?.status !== 405
            ) {
              nextMessages.push("تعذر تحميل قائمة الاشتراكات القابلة للتقييم من الخادم.");
            }
          }

          if (reviewsResult.status === "fulfilled") {
            const serverReviews = Array.isArray(reviewsResult.value)
              ? reviewsResult.value
              : [];

            setReviews(serverReviews);
          } else {
            console.error("Failed to load reviews:", reviewsResult.reason);

            setReviews([]);
            nextMessages.push(
              reviewsResult.reason?.displayMessage ||
                REVIEW_LIST_UNAVAILABLE_MESSAGE
            );
          }

          setMessage(nextMessages.join(" "));
        }
      } catch (error) {
        console.error("Failed to load reviews page:", error);

        if (isMounted) {
          setMessage("تعذر تحميل البيانات من الخادم.");
          setProviderOptions([]);
          setReviews([]);
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

    try {
      const createdReview = await createReview({
        provider_id: newReviewData.providerId,
        target_id: newReviewData.targetId,
        generator_id: newReviewData.generatorId,
        rating: newReviewData.rating,
        comment: newReviewData.text,
      });

      const temporaryConfirmedReview = {
        id: createdReview.id || `submitted-review-${Date.now()}`,
        ...createdReview,
        provider: createdReview.provider || newReviewData.provider || "المولد",
        targetId: createdReview.targetId || newReviewData.targetId,
        providerId: createdReview.providerId || newReviewData.providerId,
        generatorId: createdReview.generatorId || newReviewData.generatorId,
        subscriptionId:
          createdReview.subscriptionId || newReviewData.subscriptionId,
        date: createdReview.date || getTodayDate(),
        iconType: newReviewData.iconType || "power",
        rating: createdReview.rating || newReviewData.rating,
        text: createdReview.text || newReviewData.text,
        isTemporary: true,
      };

      setReviews((prevReviews) => [temporaryConfirmedReview, ...prevReviews]);

      setMessage(
        "تم إرسال التقييم للخادم. سيظهر هنا مؤقتاً حتى تتوفر واجهة لاسترجاع تقييمات العميل."
      );
    } catch (error) {
      console.error("Failed to create review:", error);
      setMessage(error.displayMessage || "تعذر إرسال التقييم للخادم حالياً.");
    }
  };

  const handleStartEditReview = (review) => {
    setEditingReview(review);
    setMessage("");
  };

  const handleUpdateReview = async () => {
    setEditingReview(null);
    setMessage("تعديل التقييم غير متاح من الخادم حالياً.");
  };

  const handleDeleteReview = async () => {
    setMessage("حذف التقييم غير متاح من الخادم حالياً.");
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
                emptyMessage={REVIEW_LIST_UNAVAILABLE_MESSAGE}
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