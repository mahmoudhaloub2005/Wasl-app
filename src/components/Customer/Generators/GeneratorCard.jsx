import { Link } from "react-router-dom";

function GeneratorCard({
  id,
  image,
  name,
  area,
  price,
  load,
  rating,
  status,
  statusType,
}) {
  const stars = Array.from(
    { length: 5 },
    (_, index) => index < Math.round(Number(rating) || 0)
  );

  return (
    <article className="customer-generator-card">
      <div className="customer-generator-image">
        <img src={image} alt={name} />

        <span className={`customer-generator-status ${statusType}`}>
          {status}
        </span>
      </div>

      <div className="customer-generator-body">
        <h3>{name}</h3>

        <p>{area}</p>

        <div className="customer-generator-info">
          <div>
            <span>السعر لكل أمبير</span>
            <strong>{price}</strong>
          </div>

          <span className="customer-info-divider"></span>

          <div>
            <span>الحمل المتاح</span>
            <strong>{load}</strong>
          </div>
        </div>

        <div className="customer-generator-footer">
          <div className="customer-generator-stars">
            {stars.map((isActive, index) => (
              <span key={index} className={isActive ? "filled" : ""}>
                ★
              </span>
            ))}
          </div>

          <Link
            to={`/customer/generator-details/${id}`}
            className="customer-generator-details-link"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

export default GeneratorCard;
