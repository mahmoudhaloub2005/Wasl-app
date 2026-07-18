import { FaStar } from "react-icons/fa";

import RatingDistribution from "./RatingDistribution";
import { formatCompactNumber } from "./providerRatingsFormatters";

function RatingsSummary({ isLoading, summary }) {
  if (isLoading) {
    return (
      <section className="ratings-summary" aria-label="ملخص التقييمات">
        <article className="ratings-summary-card ratings-summary-card--wide ratings-summary-card--loading">
          <span />
          <span />
          <span />
          <span />
        </article>
        <article className="ratings-summary-card ratings-summary-card--score ratings-summary-card--loading">
          <span />
          <span />
          <span />
        </article>
      </section>
    );
  }

  return (
    <section className="ratings-summary" aria-label="ملخص التقييمات">
      <article className="ratings-summary-card ratings-summary-card--wide">
        <RatingDistribution distribution={summary.distribution} />
      </article>

      <article className="ratings-summary-card ratings-summary-card--score">
        <strong>{summary.averageRating.toFixed(1)}</strong>
        <div className="ratings-summary__stars" aria-label={`${summary.averageRating.toFixed(1)} من 5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} aria-hidden="true" />
          ))}
        </div>
        <p>
          بناء على <bdi>{formatCompactNumber(summary.totalRatings)}</bdi> تقييم
        </p>
      </article>
    </section>
  );
}

export default RatingsSummary;
