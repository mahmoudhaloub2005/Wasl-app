import { useNavigate } from "react-router-dom";
import "./ProviderModal.css";
import providerImage from "../../../assets/images/img.svg";

function ProviderModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleRegisterProvider = () => {
    navigate("/provider-register");
  };

  return (
    <div className="provider-overlay">
      <div className="provider-modal">
        <button
          type="button"
          className="close-button"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="provider-info">
          <span className="provider-label">فرصة للمزودين</span>

          <h2>
            ابدأ رحلة التحول الرقمي
            <br />
            لمولدك
          </h2>

          <p className="provider-description">
            نظام متكامل لإدارة المشتركين،
            التحصيل الآلي ومراقبة الأحمال
            بكل سهولة.
          </p>

          <div className="provider-feature">
            <span className="feature-icon">✓</span>
            <span>تحصيل مالي آلي بنسبة دقة 98٪</span>
          </div>

          <div className="provider-feature">
            <span className="feature-icon">✓</span>
            <span>دعم فني متخصص على مدار الساعة</span>
          </div>

          <button
            type="button"
            className="provider-btn"
            onClick={handleRegisterProvider}
          >
            سجل كمزود طاقة الآن
          </button>

          <p className="trial-text">تجربة مجانية لمدة 30 يوماً</p>
        </div>

        <div className="provider-image-section">
          <div className="provider-placeholder">
            <img src={providerImage} alt="Provider" />
          </div>

          <p>
            انضم إلى شبكة تضم أكثر من 500 مزود طاقة معتمد في غزة
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProviderModal;