import { useState } from "react";
import { FiLock, FiInfo } from "react-icons/fi";
import security from "../../assets/icons/security.svg";
import images from "../../assets/images/images.png";
import icons from "../../assets/icons/icons.svg";
import icons1 from "../../assets/icons/icons1.svg";
import "./ProviderSignup.css";

function useProviderSignup() {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAccessCode(e.target.value);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!accessCode) {
      setMessage("يرجى إدخال رمز وصول المزود");
      return;
    }

    if (accessCode.length !== 8) {
      setMessage("رمز الوصول يجب أن يتكون من 8 خانات");
      return;
    }

    setMessage("");

    console.log("رمز وصول المزود:", accessCode);

    // هون بعدين بتحط كود التحقق من الرمز أو الانتقال للصفحة التالية
  };

  return {
    accessCode,
    message,
    handleChange,
    handleSubmit,
  };
}

function ProviderSignupForm() {
  const { accessCode, message, handleChange, handleSubmit } =
    useProviderSignup();

  return (
    <section className="provider-signup">
      <div className="provider-wrapper">
        {/* الفورم */}
        <form className="signup-card" onSubmit={handleSubmit}>
          <h2>تسجيل مزود خدمة جديد</h2>

          <p className="subtitle1">
            يرجى إدخال بياناتك لإنشاء حساب المؤسسة الخاص بك.
          </p>

          <label>رمز وصول المزود</label>

          <div className="input-box">
            <input
              type="text"
              value={accessCode}
              onChange={handleChange}
              maxLength="8"
              placeholder="أدخل رمز الوصول المكون من 8 خانات"
            />
            <FiLock />
          </div>

          <div className="note">
            <FiInfo />
            <span>تحصل على هذا الرمز من إدارة منصة وصل مباشرة.</span>
          </div>

          {message && <p className="signup-error">{message}</p>}

          <button type="submit" className="continue-btn">
            متابعة
          </button>

          <a href="/login" className="back-login">
            ➜ العودة لتسجيل الدخول
          </a>

          <div className="security">
            <span>WASSL SECURITY</span>
          </div>

          <div className="security-footer">
            <img src={security} alt="security" />
            <span>نظام مشفر وآمن بالكامل لمزودي الخدمات</span>
          </div>
        </form>

        {/* القسم الأزرق */}
        <div className="login-info1">
          <div className="icon-box1">
            <img src={images} alt="logo1" />
          </div>

          <h2>وصل - مستقبل الطاقة المحلية</h2>

          <p>
            منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة والربط مع المزودين
            وإدارة الفواتير بسهولة.
          </p>

          <div className="feature-card">
            <div className="feature-wrapper">
              <div className="feature-icon">
                <img src={icons} alt="الايقون" />
              </div>

              <h4>تقارير الطاقة</h4>
              <span>راقب استهلاك المشتركين بدقة</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-wrapper">
              <div className="feature-icon">
                <img src={icons1} alt="الايقون" />
              </div>

              <h4>تحصيل آلي</h4>
              <span>إدارة المدفوعات والفواتير</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProviderSignupForm;