import "./ReviewsSection.css";
import userImage from "../../assets/images/user.jpg";

function ReviewsSection() {
  return (
    <section className="reviews-section">
      <h2>آراء المشتركين</h2>

      <div className="review-card">
        <img src={userImage} alt="user" />

        <div>
          <h4>محمد أحمد</h4>
          <span>⭐⭐⭐⭐⭐</span>
          <p>خدمة ممتازة واستجابة سريعة.</p>
        </div>
      </div>

      <div className="review-card">
        <img src={userImage} alt="user" />

        <div>
          <h4>أحمد خالد</h4>
          <span>⭐⭐⭐⭐</span>
          <p>الأسعار مناسبة والدعم ممتاز.</p>
        </div>
      </div>

    </section>
  );
}

export default ReviewsSection;