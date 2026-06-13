import "./ResetSuccess.css";
import { FiCheckCircle } from "react-icons/fi";

const ResetSuccess = () => {
  return (
    <div className="reset-page">
      <div className="reset-container">

        <div className="reset-card">
          <div className="icon-wrapper">
            <FiCheckCircle className="success-icon" />
          </div>

          <h2>تم تغيير كلمة المرور بنجاح</h2>

          <p>
يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة مرور جديدة.          </p>

          <button className="login-btn">
            تسجيل الدخول الآن
          </button>
<p>تواجه مشكلة ؟</p>
          <a href="/login" className="back-link">
تواصل مع الدعم الفني           </a>
        </div>

      </div>
    </div>
  );
};

export default ResetSuccess;