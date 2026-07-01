import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderSuccess.css";
import { FiCheck, FiLogIn } from "react-icons/fi";

function ProviderSuccess() {
  const navigate = useNavigate();
  const [supportMessage, setSupportMessage] = useState("");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSupport = () => {
    setSupportMessage("سيتم تحويلك إلى الدعم الفني خلال لحظات");

    setTimeout(() => {
      navigate("/contact-us");
    }, 800);
  };

  return (
    <main className="provider-success-page">
      <section className="success-card">
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <FiCheck />
          </div>
        </div>

        <h1>تم إنشاء الحساب بنجاح</h1>

        <p className="success-desc">
          لقد تم إعداد حسابك في وصل بنجاح.
          <br />
          يمكنك الآن البدء في إدارة خدمات الطاقة الخاصة بك.
        </p>

        <div className="small-divider"></div>

        <button
          type="button"
          className="login-success-btn"
          onClick={handleLogin}
        >
          <FiLogIn />
          تسجيل الدخول
        </button>

        <p className="support-text">
          هل تواجه مشكلة؟{" "}
          <button type="button" onClick={handleSupport}>
            اتصل بالدعم
          </button>
        </p>

        {supportMessage && (
          <p className="support-message">{supportMessage}</p>
        )}
      </section>
    </main>
  );
}

export default ProviderSuccess;