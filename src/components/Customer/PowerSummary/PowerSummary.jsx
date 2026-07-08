import "./PowerSummary.css";

function PowerSummary({ subscription = null }) {
  if (!subscription) {
    return (
      <section className="power-summary">
        <div className="summary-card">
          <h2>اشتراكي الحالي</h2>
          <p>لا يوجد اشتراك نشط حالياً</p>
        </div>
      </section>
    );
  }

  return (
    <section className="power-summary">
      <div className="summary-card">
        <h2>اشتراكي الحالي</h2>

        {subscription.generatorName && (
          <div className="summary-item">
            <span>اسم المولد</span>
            <h4>{subscription.generatorName}</h4>
          </div>
        )}

        {subscription.ampere && (
          <div className="summary-item">
            <span>عدد الأمبيرات</span>
            <h4>{subscription.ampere}</h4>
          </div>
        )}

        {subscription.invoice?.currentBill && (
          <div className="summary-item">
            <span>قيمة الفاتورة</span>
            <h4>{subscription.invoice.currentBill}</h4>
          </div>
        )}
      </div>
    </section>
  );
}

export default PowerSummary;
