import { Link } from "react-router-dom";

function GeneratorCard({
  id,
  image,
  name,
  generatorName,
  generatorType,
  area,
  price,
  load,
  rating = 0,
  status,
  statusType,
}) {
  const title = name || generatorName || generatorType || "مولد غير محدد";
  const locationText = area || "موقع جغرافي محدد";

  const numericRating = Number(rating) || 0;

  const finalStatusType =
    statusType === "maintenance" ||
    String(status || "").includes("صيانة") ||
    String(status || "").includes("متوقف")
      ? "maintenance"
      : "working";

  return (
    <article className="customer-generator-card">
      <div className="customer-generator-image">
        {image && <img src={image} alt={title} />}

        {status && (
          <span className={`customer-generator-status ${finalStatusType}`}>
            {status}
          </span>
        )}
      </div>

      <div className="customer-generator-body">
        <h3>{title}</h3>

        <p>{locationText}</p>

        <div className="customer-generator-info">
          <div>
            <span>السعر لكل أمبير</span>
            <strong>{price || "غير محدد"}</strong>
          </div>

          <span className="customer-info-divider"></span>

          <div>
            <span>الحمل المتاح</span>
            <strong>{load || "غير محدد"}</strong>
          </div>
        </div>

        <div className="customer-generator-footer">
          <div className="customer-generator-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= numericRating ? "filled" : ""}>
                ★
              </span>
            ))}
          </div>

          <Link
            className="customer-generator-details-link"
            to={`/customer/generator-details/${id}`}
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

export default GeneratorCard;