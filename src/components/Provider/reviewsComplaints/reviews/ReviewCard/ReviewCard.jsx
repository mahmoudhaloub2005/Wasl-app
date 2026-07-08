import "./ReviewCard.css";

function ReviewCard({ review }) {

  return (

    <div className="review-card">

      <div className="review-header">

        <div>

          <h3>{review.name}</h3>

          <span>{review.time}</span>

        </div>

        <div className="review-avatar">

          {review.name.charAt(0)}

        </div>

      </div>

      <div className="review-stars">

        {"★".repeat(review.rating)}

        {"☆".repeat(5 - review.rating)}

      </div>

      <p className="review-text">

        {review.review}

      </p>

      {review.reply ? (

        <div className="provider-reply">

          <h4>رد المزود</h4>

          <p>{review.reply}</p>

        </div>

      ) : (

        <button className="reply-btn">

          الرد على العميل

        </button>

      )}

    </div>

  );

}

export default ReviewCard;
