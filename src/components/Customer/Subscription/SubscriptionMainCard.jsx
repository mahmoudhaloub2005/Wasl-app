import { IoCloseCircleOutline } from "react-icons/io5";

function SubscriptionMainCard({ subscription }) {
  return (
    <section className="subscription-main-card">
      <div className="subscription-price-box">
        <span>السعر للأمبير</span>
        <strong>{subscription.pricePerAmpere}</strong>
      </div>

      <div className="subscription-main-header">
<span className="customer-subscription-status">{subscription.status}</span>
        <div>
          <h1>{subscription.generatorName}</h1>
          <p>{subscription.description}</p>
        </div>
      </div>

      <div className="subscription-divider" />

      <div className="subscription-details-row">
        <div>
          <span>كمية الاشتراك</span>
          <strong>{subscription.ampere}</strong>
        </div>

        <div>
          <span>تاريخ البدء</span>
          <strong>{subscription.startDate}</strong>
        </div>

        <div>
          <span>رقم الاشتراك</span>
          <strong>{subscription.subscriptionNumber}</strong>
        </div>
      </div>

      <button className="cancel-subscription-button" type="button">
        <IoCloseCircleOutline />
        إلغاء الاشتراك
      </button>
    </section>
  );
}

export default SubscriptionMainCard;