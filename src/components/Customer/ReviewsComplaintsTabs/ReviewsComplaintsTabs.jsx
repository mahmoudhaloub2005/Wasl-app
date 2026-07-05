import { NavLink } from "react-router-dom";
import "./ReviewsComplaintsTabs.css";

function ReviewsComplaintsTabs() {
  return (
    <div className="reviews-complaints-tabs">
      <NavLink
        to="/customer/reviews"
        className={({ isActive }) =>
          isActive
            ? "reviews-complaints-tab active"
            : "reviews-complaints-tab"
        }
      >
        التقييمات
      </NavLink>

      <NavLink
        to="/customer/complaints"
        className={({ isActive }) =>
          isActive
            ? "reviews-complaints-tab active"
            : "reviews-complaints-tab"
        }
      >
        الشكاوى
      </NavLink>
    </div>
  );
}

export default ReviewsComplaintsTabs;