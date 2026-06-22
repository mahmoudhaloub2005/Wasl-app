import "./ProviderModal.css";

function ProviderModal() {
  return (
    <div className="provider-overlay">

      <div className="provider-modal">


        <button className="close-button">

          ×

        </button>


        <div className="provider-image-section">

         
          <div className="provider-placeholder">

           <img
              src={providerImage}
              alt="Provider"
            />

          </div>

          <p>

            انضم إلى شبكة تضم أكثر من
            مزود طاقة معتمد في غزة

          </p>

        </div>

        <div className="provider-info">

          <span className="provider-label">

            فرصة للمزودين

          </span>

          <h2>

            ابدأ رحلة التحول الرقمي
            لمولدك

          </h2>

          <p className="provider-description">

            نظام متكامل لإدارة المشتركين،
            التحصيل الآلي ومراقبة الأحمال
            بكل سهولة.

          </p>

          <div className="provider-feature">

            ✅ تحصيل مالي آلي بنسبة دقة 98٪

          </div>

          <div className="provider-feature">

            ✅ دعم فني متخصص على مدار الساعة

          </div>

          <button className="provider-btn">

            سجل كمزود طاقة الآن

          </button>

          <p className="trial-text">

            تجربة مجانية لمدة 30 يوماً

          </p>

        </div>

      </div>

    </div>
  );
}

export default ProviderModal;