<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import "./ProviderModal.css";
import img from "../../assets/images/img.svg";

function ProviderModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/provider-register");
  };

  return (
    <div className="provider-modal-overlay">
      <div className="provider-modal-card">

        <button className="provider-modal-close" onClick={handleClose}>
          ×
        </button>

        <div className="provider-modal-content" dir="rtl">
          <div className="provider-modal-badge">
            <span>⚡</span>
            فرصة للمزودين
          </div>

          <h2 className="provider-modal-title">
            ابدأ رحلة التحول الرقمي لمولدك
          </h2>

          <p className="provider-modal-description">
            نظام متكامل لإدارة المشتركين، التحصيل الآلي، ومراقبة الأحمال بكل سهولة.
          </p>

          <div className="provider-modal-features">
            <div className="provider-modal-feature">
              <span className="check-icon">✓</span>
              <p>تحصيل مالي آلي بنسبة دقة 98%</p>
            </div>

            <div className="provider-modal-feature">
              <span className="check-icon">✓</span>
              <p>دعم فني متخصص على مدار الساعة.</p>
            </div>
          </div>

          <button className="provider-modal-btn" onClick={handleRegister}>
            سجل كمزود الآن
          </button>
        </div>

        <div className="provider-modal-image-box">
          <img src={img} alt="Provider" />

          <div className="provider-modal-image-layer"></div>

          <p className="provider-modal-image-text" dir="rtl">
            انضم إلى شبكة تضم أكثر من 500 مزود طاقة معتمد في غزة.
          </p>
        </div>

      </div>
=======
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

>>>>>>> origin/main
    </div>
  );
}

export default ProviderModal;