import { getRatingLabel } from "./providerRatingsFormatters";

function RatingDistribution({ distribution = [] }) {
  return (
    <div className="rating-distribution">
      <h2>تفاصيل التقييمات</h2>

      <div className="rating-distribution__rows">
        {distribution.map((item) => (
          <div className="rating-distribution__row" key={item.rating}>
            <span className="rating-distribution__label">
              {getRatingLabel(item.rating)}
            </span>
            <div className="rating-distribution__track" aria-hidden="true">
              <span style={{ width: `${item.percentage || 0}%` }} />
            </div>
            <bdi className="rating-distribution__percentage">
              {item.percentage || 0}%
            </bdi>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingDistribution;
