import { Link } from "react-router-dom";

function GeneratorCard({
  id,
  generatorId,
  _id,
  uuid,
  image,
  name,
  area,
  price,
  load,
  rating,
  status,
  statusType,
}) {
  const realGeneratorId = id || generatorId || _id || uuid;

  const displayName = name || "";

  const stars = Array.from(
    { length: 5 },
    (_, index) => index < Math.round(Number(rating) || 0)
  );

  const generatorState = {
    id: realGeneratorId,
    image,
    name,
    area,
    price,
    load,
    rating,
    status,
    statusType,
  };

  return (
    <article className="customer-generator-card">
      <div className="customer-generator-image">
        {image && <img src={image} alt={displayName} />}

        {status && (
          <span className={`customer-generator-status ${statusType || ""}`}>
            {status}
          </span>
        )}
      </div>

      <div className="customer-generator-body">
        <h3>{displayName}</h3>

        {area && <p>{area}</p>}

        {(price || load) && (
          <div className="customer-generator-info">
            {price && (
              <div>
                <span>السعر لكل أمبير</span>
                <strong>{price}</strong>
              </div>
            )}

            {price && load && <span className="customer-info-divider"></span>}

            {load && (
              <div>
                <span>الحمل المتاح</span>
                <strong>{load}</strong>
              </div>
            )}
          </div>
        )}

        <div className="customer-generator-footer">
          <div className="customer-generator-stars">
            {stars.map((isActive, index) => (
              <span key={index} className={isActive ? "filled" : ""}>
                ★
              </span>
            ))}
          </div>

          {realGeneratorId ? (
            <Link
              to={`/customer/generator-details/${realGeneratorId}`}
              state={{ generator: generatorState }}
              className="customer-generator-details-link"
            >
              عرض التفاصيل
            </Link>
          ) : (
            <button
              type="button"
              className="customer-generator-details-link"
              disabled
            >
              عرض التفاصيل
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default GeneratorCard;
