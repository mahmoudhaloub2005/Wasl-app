import { useState } from "react";
import "./ResetSuccess.css";
import { FiCheckCircle } from "react-icons/fi";
import imag from "../../assets/icons/image.png";

function useResetSuccess() {
  const [supportMessage, setSupportMessage] = useState("");

  const handleLogin = () => {
    console.log("الانتقال إلى صفحة تسجيل الدخول");

    // هون بعدين بتحط الانتقال لصفحة تسجيل الدخول
    // مثال لو بتستخدم react-router-dom:
    // navigate("/login");
  };

  const handleSupport = () => {
    setSupportMessage("سيتم تحويلك إلى الدعم الفني خلال لحظات");

    // هون بعدين بتحط رابط الدعم الفني أو صفحة الدعم
  };

  return {
    supportMessage,
    handleLogin,
    handleSupport,
  };
}

const ResetSuccess = () => {
  const { supportMessage, handleLogin, handleSupport } = useResetSuccess();

  return (
    <div className="reset-page">
      <div className="reset-container">
        <div className="reset-card">
          <img className="icon1" src={imag} alt="logo" />

          <div className="icon-wrapper">
            <FiCheckCircle className="success-icon" />
          </div>

          <h2>تم تغيير كلمة المرور بنجاح</h2>

          <p>
            يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة مرور جديدة.
          </p>

          <button className="login-btn" onClick={handleLogin}>
            تسجيل الدخول الآن
          </button>

          <div className="support-box">
            <p className="pp">تواجه مشكلة ؟</p>

            <button className="back-link" onClick={handleSupport}>
              تواصل مع الدعم الفني
            </button>
          </div>

          {supportMessage && (
            <p className="support-message">{supportMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;