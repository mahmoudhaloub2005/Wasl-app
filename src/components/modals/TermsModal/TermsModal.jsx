import { useLocation, useNavigate } from "react-router-dom";
import "./TermsModal.css";

function TermsModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || "/";

  const handleClose = () => {
    navigate(returnTo, { replace: true });
  };

  const handleAccept = () => {
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="terms-overlay">
      <div className="terms-modal" dir="rtl">
        <div className="terms-header">
          <h2>اتفاقية الخدمة</h2>

          <button className="terms-close" type="button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="terms-body">
          <section className="terms-section">
            <h3>1. مقدمة وتعريفات</h3>
            <p>
              تحكم هذه الاتفاقية استخدامك لمنصة وصل، وهي خدمة رقمية تسهل الربط
              بين مزودي طاقة المولدات الكهربائية والمستهلكين. بدخولك إلى
              المنصة أو استخدامها، فإنك توافق على الالتزام بهذه الشروط.
            </p>
          </section>

          <section className="terms-section">
            <h3>2. حساب المستخدم</h3>
            <p>
              لضمان تجربة آمنة، يتوجب على المستخدمين تقديم معلومات دقيقة
              ومحدثة عند إنشاء الحساب. أنت مسؤول بشكل كامل عن الحفاظ على سرية
              بيانات اعتماد دخولك وعن جميع الأنشطة التي تحدث تحت حسابك.
            </p>
          </section>

          <section className="terms-section">
            <h3>3. استخدام المنصة</h3>
            <p>
              يجب استخدام منصة وصل للأغراض المشروعة فقط، ويمنع استخدام الخدمة
              بأي طريقة تؤثر على استقرار المنصة أو حقوق المستخدمين الآخرين.
            </p>
          </section>
        </div>

        <div className="terms-footer">
          <button
            className="terms-accept-btn"
            type="button"
            onClick={handleAccept}
          >
            أوافق على الشروط
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsModal;
