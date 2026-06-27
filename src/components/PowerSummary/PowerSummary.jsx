
PowerSummary.jsx

import "./PowerSummary.css";

function PowerSummary() {
  return (
    <section className="power-summary">

      <div className="summary-card">

        <h2>اشتراكي الحالي</h2>

        <div className="summary-item">
          <span>اسم المولد</span>
          <h4>مولد الرشيد الذكي</h4>
        </div>

        <div className="summary-item">
          <span>عدد الأمبيرات</span>
          <h4>5 أمبير</h4>
        </div>

        <div className="summary-item">
          <span>قيمة الفاتورة</span>
          <h4>₪95</h4>
        </div>

      </div>

    </section>
  );
}

export default PowerSummary;