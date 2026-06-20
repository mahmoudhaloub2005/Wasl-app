import { useState } from "react";
import { FiX } from "react-icons/fi";
import "./TermsModal.css";

function TermsModal() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAgree = () => {
    console.log("تمت الموافقة على الشروط");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="terms-overlay">
      <div className="terms-modal">
        <div className="terms-header">
          <button className="terms-close" onClick={handleClose}>
            <FiX />
          </button>

          <h2>اتفاقية الخدمة</h2>
        </div>

        <div className="terms-body">
          <div className="terms-section">
            <h3>1. مقدمة وتعريفات</h3>
            <p>
              تحكم هذه الاتفاقية استخدامك لمنصة وصل، وهي خدمة رقمية تسهل الربط
              بين مزودي طاقة المولدات الكهربائية والمستهلكين. بدخولك إلى المنصة
              أو استخدامها، فإنك توافق على الالتزام بهذه الشروط.
            </p>
          </div>

          <div className="terms-section">
            <h3>2. حساب المستخدم</h3>
            <p>
              لضمان تجربة آمنة، يتوجب على المستخدمين تقديم معلومات دقيقة ومحدثة
              عند إنشاء الحساب. أنت مسؤول بشكل كامل عن الحفاظ على سرية بيانات
              اعتماد دخولك وعن جميع الأنشطة التي تحدث تحت حسابك.
            </p>
          </div>

          <div className="terms-section">
            <h3>3. وصف الخدمات</h3>
            <p>
              توفر وصل واجهة لإدارة استهلاك الطاقة، ومراقبة العدادات الذكية،
              ودفع الفواتير إلكترونياً. يرجى ملاحظة أن وصل هي وسيط تقني ولا
              تملك المولدات الكهربائية مباشرة.
            </p>
          </div>

          <div className="terms-section">
            <h3>4. الرسوم والفوترة</h3>
            <p>
              يتم احتساب الرسوم بناءً على سعر الأمبير المتفق عليه من قبل المزود
              المحلي، بالإضافة إلى رسوم الخدمة التقنية لمنصة وصل.
            </p>
          </div>

          <div className="terms-section">
            <h3>5. حدود المسؤولية</h3>
            <p>
              تسعى وصل جاهدة لضمان استمرارية عمل المنصة بنسبة توافر عالية،
              ولكنها لا تضمن عدم حدوث أخطاء تقنية ناتجة عن تحديثات النظام أو
              ظروف خارجة عن السيطرة.
            </p>
          </div>
        </div>

        <div className="terms-footer">
          <button onClick={handleAgree}>أوافق على الشروط</button>
        </div>
      </div>
    </div>
  );
}

export default TermsModal;