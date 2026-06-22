import "./SupportForm.css";

function SupportForm() {
  return (
    <section className="support">

      <h1 className="support-title">
        كيف يمكننا مساعدتك اليوم؟
      </h1>

      <p className="support-description">
        فريق الدعم الفني في منصة وصل متاح على مدار الساعة لضمان استمرارية خدماتك وتوفير حلول تقنية سريعة.
      </p>

      <div className="support-card">

        <h2>راسلنا مباشرة</h2>

        <div className="row">

          <div className="input-group">
            <label>الاسم الكامل</label>
            <input type="text" placeholder="مثال: أحمد محمد" />
          </div>

          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <input type="email" placeholder="example@wassl.energy" />
          </div>

        </div>

        <div className="input-group">
          <label>نوع المشكلة</label>
          <input type="text" placeholder="مشكلتك تقنية أم التطبيق" />
        </div>

        <div className="input-group">
          <label>تفاصيل الرسالة</label>
          <textarea placeholder="كيف يمكننا مساعدتك؟" />
        </div>

        <button className="send-btn">
          تواصل معنا
        </button>

      </div>
    </section>
  );
}

export default SupportForm;