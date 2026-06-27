import { useNavigate } from "react-router-dom";
import {
  FiDatabase,
  FiShield,
  FiActivity,
  FiTool,
  FiMail,
} from "react-icons/fi";
import "./PrivacyModal.css";

<<<<<<< HEAD
function PrivacyModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleContact = () => {
    navigate("/contact-us");
  };

  return (
    <div className="privacy-overlay">
      <div className="privacy-modal" dir="rtl">
        <div className="privacy-header">
          <h2>سياسة الخصوصية</h2>

          <button className="privacy-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="privacy-body">
          <div className="privacy-section">
            <div className="privacy-section-title">
              <FiDatabase className="privacy-icon" />
              <h3>البيانات التي نجمعها</h3>
            </div>

            <p>
              نجمع المعلومات الضرورية فقط لتقديم خدماتنا بفعالية وأمان، بما في
              ذلك معلومات الحساب، بيانات الاستهلاك، الموقع الجغرافي، وبيانات
              الدفع المشفرة.
            </p>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <FiShield className="privacy-icon" />
              <h3>أمن المعلومات</h3>
            </div>

            <p>
              نستخدم بروتوكولات تشفير متقدمة (AES-256) لحماية بياناتك من الوصول
              غير المصرح به. خصوصيتك هي أولويتنا القصوى.
            </p>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <FiActivity className="privacy-icon" />
              <h3>كيفية الاستخدام</h3>
            </div>

            <p>
              نستخدم بياناتك لتحسين جودة التوزيع الكهربائي، وتوقع الأحمال
              الزائدة، وتسهيل عمليات الفوترة الشفافة.
            </p>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <FiTool className="privacy-icon" />
              <h3>حقوقك القانونية</h3>
            </div>

            <p>
              لك الحق الكامل في طلب نسخة من بياناتك، أو طلب تعديلها، أو حذف
              الحساب بشكل نهائي في أي وقت.
            </p>
          </div>
        </div>

        <div className="privacy-footer">
          <button className="privacy-contact-btn" onClick={handleContact}>
            تواصل معنا
            <FiMail className="mail-icon" />
          </button>
        </div>
      </div>
    </div>
  );
=======
function PrivacyModal({ onClose }) {
    return (
        <div className="privacy-overlay">

            <div className="privacy-modal">

                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>

               
                <h2>سياسة الخصوصية</h2>

                
                <div className="privacy-content">

                   
                    <div className="privacy-item">
                        <div className="privacy-title">
                            <span className="icon">📄</span>
                            <h3>البيانات التي نجمعها</h3>
                        </div>
                        <p>
                            نجمع المعلومات الضرورية فقط لتقديم خدماتنا بأمان وفعالية،
                            ونحرص على أن تكون هذه المعلومات متوافقة مع سياسات الاستخدام،
                            وتحسين تجربة المستخدم.
                        </p>
                    </div>

                  
                    <div className="privacy-item">
                        <div className="privacy-title">
                            <span className="icon">🔒</span>
                            <h3>أمن المعلومات</h3>
                        </div>
                        <p>
                            نستخدم بروتوكولات تشفير متقدمة (AES-256) لحماية بياناتك من
                            الوصول غير المصرح به. خصوصيتك هي أولويتنا القصوى.
                        </p>
                    </div>

                    
                    <div className="privacy-item">
                        <div className="privacy-title">
                            <span className="icon">⚙️</span>
                            <h3>كيفية الاستخدام</h3>
                        </div>
                        <p>
                            نستخدم بياناتك لتحسين جودة الموقع الإلكتروني، وتطوير الخدمات،
                            وتسهيل عمليات الفوترة والمتابعة.
                        </p>
                    </div>

                    <div className="privacy-item">
                        <div className="privacy-title">
                            <span className="icon">⚖️</span>
                            <h3>حقوقك القانونية</h3>
                        </div>
                        <p>لك الحق الكامل في طلب نسخة من بياناتك أو طلب تعديلها أو حذف الحساب بشكل نهائي في أي وقت </p>
                    </div>

                </div>

                <button className="accept-btn">
                    تواصل معنا
                </button>

            </div>
        </div>
    );
>>>>>>> origin/main
}

export default PrivacyModal;