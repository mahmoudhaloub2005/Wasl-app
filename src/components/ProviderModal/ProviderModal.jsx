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
    </div>
  );
}

export default ProviderModal;