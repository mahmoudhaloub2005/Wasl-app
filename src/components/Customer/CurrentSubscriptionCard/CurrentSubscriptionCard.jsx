import "./CurrentSubscriptionCard.css";

import generatorPower from "../../../assets/customer/icons/generator-power.svg";
import billsCard from "../../../assets/icons/icons1.svg";

function CurrentSubscriptionCard({
  subscription = null,
  loading = false,
  onEditSubscription,
  onViewDetails,
}) {
  if (loading) {
    return (
      <section className="current-subscription-card" dir="rtl">
        <p className="subscription-action-message">جاري تحميل الاشتراك...</p>
      </section>
    );
  }

  if (!subscription) {
    return (
      <section className="current-subscription-card" dir="rtl">
        <p className="subscription-action-message">لا يوجد اشتراك حالياً</p>

        <div className="subscription-actions">
          <button
            className="view-details-btn"
            type="button"
            onClick={onViewDetails}
          >
            استعرض المولدات
          </button>
        </div>
      </section>
    );
  }

  const isActiveSubscription = Boolean(subscription.isActive);
  const isPendingSubscription = Boolean(subscription.isPending);
  const isRejectedSubscription = Boolean(subscription.isRejected);
  const isCancelledSubscription = Boolean(subscription.isCancelled);
  const hasUsage =
    isActiveSubscription &&
    subscription.currentAmp !== null &&
    subscription.currentAmp !== undefined &&
    subscription.maxAmp !== null &&
    subscription.maxAmp !== undefined &&
    subscription.maxAmp > 0;
  const usagePercentage = hasUsage
    ? Math.min((subscription.currentAmp / subscription.maxAmp) * 100, 100)
    : 0;
  const hasPrice =
    isActiveSubscription &&
    Boolean(subscription.pricePerAmpere || subscription.ampPrice);
  const title = isPendingSubscription
    ? "لديك طلب اشتراك قيد المراجعة"
    : isRejectedSubscription
      ? "طلب الاشتراك مرفوض"
      : isCancelledSubscription
        ? "الاشتراك ملغى"
        : subscription.generatorName
          ? `مشترك في: ${subscription.generatorName}`
          : "اشتراكك الحالي";
  const pendingDetails = [
    subscription.generatorName ? `المولد: ${subscription.generatorName}` : "",
    subscription.ampere ? `الأمبير المطلوب: ${subscription.ampere}` : "",
  ].filter(Boolean);
  const subtitle =
    isPendingSubscription && pendingDetails.length > 0
      ? pendingDetails.join(" - ")
      : !isActiveSubscription && subscription.generatorName
        ? `المولد: ${subscription.generatorName}`
      : subscription.location || subscription.description;
  const statusLabel = !isActiveSubscription
    ? subscription.status
    : subscription.statusText;
  const statusPrefix = !isActiveSubscription ? "حالة الاشتراك" : "حالة المولد";
  const statusClass = isPendingSubscription
    ? "pending"
    : isRejectedSubscription || isCancelledSubscription
      ? "cancelled"
      : "";

  return (
    <section className="current-subscription-card" dir="rtl">
      <div className="subscription-card-header">
        <div className="subscription-main-info">
          <div className="subscription-icon-box">
            <img src={generatorPower} alt="مولد" />
          </div>

          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {statusLabel && (
          <div className={`subscription-status ${statusClass}`}>
            <span></span>
            {statusPrefix}: {statusLabel}
          </div>
        )}
      </div>

      {(hasUsage || hasPrice) && (
        <div className="subscription-details-grid">
          {hasUsage && (
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
          )}

          {hasPrice && (
            <div className="price-box">
              <div>
                <span>سعر الأمبير</span>
                <strong>
                  {subscription.pricePerAmpere ||
                    `${subscription.ampPrice} ${subscription.currency || ""}`}
                </strong>
              </div>

              <img src={billsCard} alt="سعر الأمبير" />
            </div>
          )}
        </div>
      )}

      <div className="subscription-actions">
        {isActiveSubscription && (
          <button
            className="edit-subscription-btn"
            type="button"
            onClick={onEditSubscription}
          >
            تعديل الاشتراك
          </button>
        )}

        <button
          className="view-details-btn"
          type="button"
          onClick={onViewDetails}
        >
          {isPendingSubscription ? "عرض طلب الاشتراك" : "عرض التفاصيل"}
        </button>
      </div>
    </section>
  );
}

export default CurrentSubscriptionCard;
