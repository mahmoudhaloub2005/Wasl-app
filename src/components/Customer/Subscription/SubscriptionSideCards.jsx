import { FiRefreshCcw } from "react-icons/fi";

function SubscriptionSideCards({ invoice }) {
  return (
    <aside className="subscription-side-cards">
      <section className="current-bill-card">
        <p>قيمة الفاتورة الحالية</p>

        <div className="bill-price">
          <strong>{invoice.currentBill}</strong>
          <span>₪</span>
        </div>

        <div className="usage-info">
          <span>الاستهلاك الحالي</span>
          <span>{invoice.usagePercent}%</span>
        </div>

        <div className="usage-progress">
          <div style={{ width: `${invoice.usagePercent}%` }} />
        </div>
      </section>

      <section className="payment-summary-card">
        <div className="payment-summary-title">
          <FiRefreshCcw />
          <h3>ملخص الدفع</h3>
        </div>

        <div className="payment-summary-row">
          <span>آخر دفعة</span>
          <strong>{invoice.lastPayment}</strong>
        </div>

        <div className="payment-summary-row">
          <span>الفواتير المسددة</span>
          <strong>{invoice.paidBills}</strong>
        </div>
      </section>
    </aside>
  );
}

export default SubscriptionSideCards;