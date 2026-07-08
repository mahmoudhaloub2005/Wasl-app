import "./SubscriptionInfo.css";

function SubscriptionInfo({ subscription = null, onCancelSubscription }) {
  if (!subscription) {
    return (
      <section className="subscription-info">
        <h2>تفاصيل الاشتراك</h2>
        <p>لا يوجد اشتراك نشط حالياً</p>
      </section>
    );
  }

  return (
    <section className="subscription-info">
      <h2>تفاصيل الاشتراك</h2>

      <div className="info-grid">
        {subscription.subscriptionNumber && (
          <div>
            <span>رقم الاشتراك</span>
            <h4>{subscription.subscriptionNumber}</h4>
          </div>
        )}

        {subscription.startDate && (
          <div>
            <span>تاريخ البدء</span>
            <h4>{subscription.startDate}</h4>
          </div>
        )}

        {subscription.status && (
          <div>
            <span>الحالة</span>
            <h4>{subscription.status}</h4>
          </div>
        )}

        {subscription.invoice?.lastPayment && (
          <div>
            <span>آخر دفعة</span>
            <h4>{subscription.invoice.lastPayment}</h4>
          </div>
        )}
      </div>

      {onCancelSubscription && (
        <button className="cancel-btn" type="button" onClick={onCancelSubscription}>
          إلغاء الاشتراك
        </button>
      )}
    </section>
  );
}

export default SubscriptionInfo;
