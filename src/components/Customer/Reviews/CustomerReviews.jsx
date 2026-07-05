import { useState } from "react";
import "./CustomerReviews.css";

import ReviewsComplaintsTabs from "../ReviewsComplaintsTabs/ReviewsComplaintsTabs";
import AddReviewForm from "./AddReviewForm";
import ReviewsList from "./ReviewsList";

function CustomerReviews() {
  const [editingReview, setEditingReview] = useState(null);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      provider: "سولار ستريم للحلول",
      date: "12 مارس 2024",
      iconType: "power",
      rating: 5,
      text: "خدمة رائعة! عملية الانتقال كانت سلسة والفواتير شفافة للغاية. يمكنني أخيراً تتبع استهلاك الأمبير بدقة من خلال تطبيق وصل. أنصح به بشدة.",
    },
    {
      id: 2,
      provider: "سيتي جريد للطاقة",
      date: "28 فبراير 2024",
      iconType: "city",
      rating: 5,
      text: "التجربة كانت جيدة، لكن وقت الاستجابة للدعم الفني يمكن أن يكون أفضل. ومع ذلك، فإن الأسعار تنافسية.",
    },
  ]);

  const getTodayDate = () => {
    return new Date().toLocaleDateString("ar", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleAddReview = (newReviewData) => {
    const newReview = {
      id: Date.now(),
      provider: newReviewData.provider,
      date: getTodayDate(),
      iconType: newReviewData.iconType,
      rating: newReviewData.rating,
      text: newReviewData.text,
    };

    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const handleStartEditReview = (review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = (updatedReviewData) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === editingReview.id
          ? {
              ...review,
              provider: updatedReviewData.provider,
              iconType: updatedReviewData.iconType,
              rating: updatedReviewData.rating,
              text: updatedReviewData.text,
              date: getTodayDate(),
            }
          : review
      )
    );

    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId) => {
    const isConfirmed = window.confirm("هل أنت متأكد من حذف هذا التقييم؟");

    if (!isConfirmed) {
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

        <div className="customer-reviews-layout">
          <AddReviewForm
            editingReview={editingReview}
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

export default CustomerReviews;AddReviewForm.jsx