import "./PrivacyModal.css";

function PrivacyModal() {

  return (

    <div className="privacy-overlay">

      <div className="privacy-modal">

    

        <button className="close-btn">

          ✕

        </button>

       

        <h2>

          سياسة الخصوصية

        </h2>


        <div className="privacy-content">

          <h3>

            1. المعلومات التي نقوم بجمعها

          </h3>

          <p>

            نقوم بجمع البيانات اللازمة لتقديم خدمات منصة وصل وتحسين تجربة المستخدم.

          </p>

          <h3>

            2. كيفية استخدام البيانات

          </h3>

          <p>

            يتم استخدام المعلومات لإدارة الاشتراكات وتحسين الخدمات والتواصل مع المستخدمين.

          </p>

          <h3>

            3. حماية البيانات

          </h3>

          <p>

            نلتزم بتطبيق إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به.

          </p>

          <h3>

            4. مشاركة المعلومات

          </h3>

          <p>

            لا يتم مشاركة بيانات المستخدم مع أي جهة خارجية إلا في الحالات التي يفرضها القانون.

          </p>

          <h3>

            5. حقوق المستخدم

          </h3>

          <p>

            يمكنك طلب تعديل أو حذف بياناتك الشخصية وفقاً لسياسة المنصة.

          </p>

        </div>


        <button className="accept-btn">

          تم

        </button>

      </div>

    </div>

  );

}

export default PrivacyModal;

