import { useState } from "react";
import "./ProviderSuccess.css";
import { FiCheck, FiLogIn } from "react-icons/fi";

function useProviderSuccess() {
  const [supportMessage, setSupportMessage] = useState("");

  const handleLogin = () => {
    console.log("الانتقال إلى صفحة تسجيل الدخول");

    // هون بعدين بتحط التنقل لصفحة تسجيل الدخول
    // مثال لو بتستخدم react-router-dom:
    // navigate("/login");
  };

  const handleSupport = () => {
    setSupportMessage("سيتم تحويلك إلى الدعم الفني خلال لحظات");

    // هون بعدين بتحط رابط الدعم أو صفحة الدعم الفني
  };

  return {
    supportMessage,
    handleLogin,
    handleSupport,
  };
}

function ProviderSuccess() {
  const { supportMessage, handleLogin, handleSupport } =
    useProviderSuccess();

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
          لقد تم إعداد حسابك في قولت ستريم بنجاح.
          <br />
          يمكنك الآن البدء في إدارة استهلاكك للطاقة.
        </p>

        <div className="small-divider"></div>

        <button className="login-success-btn" onClick={handleLogin}>
          <FiLogIn />
          تسجيل الدخول
        </button>

        <p className="support-text">
          هل تواجه مشكلة؟{" "}
          <button onClick={handleSupport}>اتصل بالدعم</button>
        </p>

        {supportMessage && (
          <p className="support-message">{supportMessage}</p>
        )}
      </section>
    </main>
  );
}

export default ProviderSuccess;