import { useNavigate } from "react-router-dom";
import "./PrivacyModal.css";

function PrivacyModal() {
  const navigate = useNavigate();

  return (
    <div className="privacy-overlay" dir="rtl">
      <div className="privacy-modal">
        <div className="privacy-header">
          <button
            type="button"
            className="privacy-close"
            onClick={() => navigate("/")}
          >
            ×
          </button>

          <h1>سياسة الخصوصية</h1>
        </div>

        <div className="privacy-content">
          <div className="privacy-item">
            <div className="privacy-title">
              <span>▣</span>
              <h3>البيانات التي نجمعها</h3>
            </div>

            <p>
              نجمع المعلومات الضرورية فقط لتقديم خدماتنا بفعالية وأمان، بما في
              ذلك معلومات الحساب، بيانات الاستهلاك، الموقع الجغرافي، وبيانات
              الدفع المشفرة.
            </p>
          </div>

          <div className="privacy-item">
            <div className="privacy-title">
              <span>🛡</span>
              <h3>أمن المعلومات</h3>
            </div>

            <p>
              نستخدم بروتوكولات تشفير متقدمة لحماية بياناتك من الوصول غير
              المصرح به. خصوصيتك هي أولويتنا القصوى.
            </p>
          </div>

          <div className="privacy-item">
            <div className="privacy-title">
              <span>⌁</span>
              <h3>كيفية الاستخدام</h3>
            </div>

            <p>
              نستخدم بياناتك لتحسين جودة التوزيع الكهربائي، وتوقع الأحمال
              الزائدة، وتسهيل عمليات الفوترة الشفافة.
            </p>
          </div>

          <div className="privacy-item">
            <div className="privacy-title">
              <span>⚖</span>
              <h3>حقوقك القانونية</h3>
            </div>

            <p>
              لك الحق الكامل في طلب نسخة من بياناتك، أو طلب تعديلها، أو حذف
              الحساب بشكل نهائي في أي وقت.
            </p>
          </div>
        </div>

        <div className="privacy-footer">
          <button
            type="button"
            className="privacy-contact-btn"
            onClick={() => navigate("/contact-us")}
          >
            تواصل معنا
            <span>✉</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal;