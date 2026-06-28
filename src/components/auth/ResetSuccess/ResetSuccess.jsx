import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./ResetSuccess.css";

import imag from "../../../assets/icons/image.png";
function ResetSuccess() {
  const navigate = useNavigate();
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSupport = () => {
    setShowSupportMessage(true);
  };

  return (
    <section className="reset-page">
      <div className="reset-container">
        <div className="reset-card">
          <img className="icon1" src={imag} alt="وصل" />

          <div className="icon-wrapper">
            <FaCheckCircle className="success-icon" />
          </div>

          <h2>تم تغيير كلمة المرور بنجاح</h2>

          <p>
            يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة مرور جديدة.
          </p>

          <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
          >
            تسجيل الدخول الآن
          </button>

          <div className="support-box">
            <span className="pp">تواجه مشكلة؟</span>

            <button
              type="button"
              className="back-link"
              onClick={handleSupport}
            >
              تواصل مع الدعم الفني
            </button>
          </div>

          {showSupportMessage && (
            <div className="support-message">
              سيتم تحويلك إلى الدعم الفني خلال لحظات
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResetSuccess;