

// استيراد useState
import { useState } from "react";

// استيراد ملف التنسيق
import "./ServiceModal.css";

function ServiceModal() {

  // متغير لمعرفة هل المودال مفتوحة أم لا
  const [isOpen, setIsOpen] = useState(true);

  // إذا أغلقت المودال لا نعرض أي شيء
  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        {/* زر الإغلاق */}

        <button

          className="close-btn"

          onClick={() => setIsOpen(false)}

        >

          ✕

        </button>

        <h2>

          اتفاقية الخدمة

        </h2>

        <div className="modal-content">

          <h3>

            1. مقدمة وتعريفات

          </h3>

          <p>

            تنظم هذه الاتفاقية استخدام منصة وصل والخدمات المقدمة من خلالها.

          </p>

          <h3>

            2. حساب المستخدم

          </h3>

          <p>

            يلتزم المستخدم بتقديم معلومات صحيحة والمحافظة على بيانات حسابه.

          </p>

          <h3>

            3. وصف الخدمات

          </h3>

          <p>

            توفر المنصة إدارة اشتراكات الطاقة وربط المستخدم بالمزودين.

          </p>

          <h3>

            4. الرسوم والفواتير

          </h3>

          <p>

            يتم احتساب الرسوم حسب الاشتراك والاستهلاك الشهري.

          </p>

          <h3>

            5. حدود المسؤولية

          </h3>

          <p>

            تعمل المنصة على توفير الخدمة بأعلى جودة ممكنة مع مراعاة الظروف التقنية.

          </p>

        </div>

        <button

          className="agree-btn"

          onClick={() => setIsOpen(false)}

        >

          أوافق على الشروط

        </button>

      </div>

    </div>

  );

}

export default ServiceModal;

