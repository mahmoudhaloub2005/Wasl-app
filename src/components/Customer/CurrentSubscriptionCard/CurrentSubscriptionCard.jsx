import "./CurrentSubscriptionCard.css";

import generatorPower from "../../../assets/customer/icons/generator-power.svg";
import billsCard from "../../../assets/icons/icons1.svg";

const defaultSubscription = {
  generatorName: "مولد النور",
  location: "دير البلح",
  statusText: "يعمل الآن",
  currentAmp: 8,
  maxAmp: 10,
  ampPrice: 55,
  currency: "شيكل",
};

function CurrentSubscriptionCard({
  subscription = defaultSubscription,
  onEditSubscription,
  onViewDetails,
}) {
  const usagePercentage =
    subscription.maxAmp > 0
      ? Math.min((subscription.currentAmp / subscription.maxAmp) * 100, 100)
      : 0;

  return (
    <section className="current-subscription-card" dir="rtl">
      <div className="subscription-card-header">
        <div className="subscription-main-info">
          <div className="subscription-icon-box">
            <img src={generatorPower} alt="مولد" />
          </div>

          <div>
            <h2>مشترك في: {subscription.generatorName}</h2>
            <p>{subscription.location}</p>
          </div>
        </div>

        <div className="subscription-status">
          <span></span>
          حالة المولد: {subscription.statusText}
        </div>
      </div>

      <div className="subscription-details-grid">
        <div className="usage-box">
          <div className="usage-top">
            <span>استهلاك الأمبير الحالي</span>
            <strong>
              {subscription.currentAmp}/{subscription.maxAmp} Amp
            </strong>
          </div>

          <div className="usage-progress">
            <div style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </div>

        <div className="price-box">
          <div>
            <span>سعر الأمبير</span>
            <strong>
              {subscription.ampPrice} {subscription.currency}
            </strong>
          </div>

          <img src={billsCard} alt="سعر الأمبير" />
        </div>
      </div>

      <div className="subscription-actions">
        <button
          className="edit-subscription-btn"
          type="button"
          onClick={onEditSubscription}
        >
          تعديل الاشتراك
        </button>

        <button
          className="view-details-btn"
          type="button"
          onClick={onViewDetails}
        >
          عرض التفاصيل
        </button>
      </div>
    </section>
  );
}

export default CurrentSubscriptionCard;