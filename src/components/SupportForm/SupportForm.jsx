import "./SupportForm.css";

function SupportForm() {
  return (
    <section className="support">

      {/* عنوان الصفحة */}
      <h1 className="support-title">
        كيف يمكننا مساعدتك اليوم؟
      </h1>

      {/* وصف بسيط */}
      <p className="support-description">
        فريق الدعم الفني في منصة وصل متاح على مدار الساعة لضمان استمرارية خدماتك وتوفير حلول تقنية سريعة.
      </p>

      {/* الكارد الرئيسية للفورم */}
      <div className="support-card">

        <h2>راسلنا مباشرة</h2>

        {/* صف الاسم + الإيميل */}
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

        {/* نوع المشكلة */}
        <div className="input-group">
          <label>نوع المشكلة</label>
          <input type="text" placeholder="مشكلتك تقنية أم التطبيق" />
        </div>

        {/* تفاصيل الرسالة */}
        <div className="input-group">
          <label>تفاصيل الرسالة</label>
          <textarea placeholder="كيف يمكننا مساعدتك؟" />
        </div>

        {/* زر الإرسال */}
        <button className="send-btn">
          تواصل معنا
        </button>

      </div>
    </section>
  );
}

export default SupportForm;