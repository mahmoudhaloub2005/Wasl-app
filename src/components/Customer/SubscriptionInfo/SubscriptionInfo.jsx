
import "./SubscriptionInfo.css";

function SubscriptionInfo() {
  return (
    <section className="subscription-info">

      <h2>تفاصيل الاشتراك</h2>

      <div className="info-grid">

        <div>
          <span>رقم الاشتراك</span>
          <h4>#45892</h4>
        </div>

        <div>
          <span>تاريخ البدء</span>
          <h4>01/06/2026</h4>
        </div>

        <div>
          <span>الحالة</span>
          <h4>نشط</h4>
        </div>

        <div>
          <span>آخر دفعة</span>
          <h4>₪95</h4>
        </div>

      </div>

      <button className="cancel-btn">
        إلغاء الاشتراك
      </button>

    </section>
  );
}

export default SubscriptionInfo;
