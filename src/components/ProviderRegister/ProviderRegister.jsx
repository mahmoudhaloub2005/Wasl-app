import "./ProviderRegister.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
} from "react-icons/fi";

const ProviderRegister = () => {
  return (
    <div className="provider-page">

      {/* Progress */}
      <div className="steps">

        <div className="step active">
          <div className="circle">1</div>
          <span>المعلومات الشخصية</span>
        </div>

        <div className="line"></div>

        <div className="step">
          <div className="circle">2</div>
          <span>تفاصيل المورد</span>
        </div>

        <div className="line"></div>

        <div className="step">
          <div className="circle">3</div>
          <span>الوثائق</span>
        </div>

      </div>

      {/* Card */}

      <div className="provider-card">

        <h2>تسجيل مزود الخدمة</h2>

        <p className="desc">
          املأ هذا في بضع دقائق لإنشاء حسابك الأساسية للانضمام إلى شبكتنا.
        </p>

        <div className="row">

          <div className="input-group">
            <label>الاسم الكامل</label>

            <div className="input">
              <input
                type="text"
                placeholder="أدخل اسمك الكامل"
              />
              <FiUser />
            </div>

          </div>

          <div className="input-group">

            <label>اسم المنشأة</label>

            <div className="input">
              <input
                type="text"
                placeholder="اسم المنشأة"
              />
              <FiUser />
            </div>

          </div>

        </div>

        <div className="input-group full">

          <label>البريد الإلكتروني</label>

          <div className="input">

            <input
              type="email"
              placeholder="example@domain.com"
            />

            <FiMail />

          </div>

        </div>

        <div className="row">

          <div className="input-group">

            <label>رقم الهاتف</label>

            <div className="input">

              <input
                type="text"
                placeholder="05XXXXXXXX"
              />

              <FiPhone />

            </div>

          </div>

          <div className="input-group">

            <label>كلمة المرور</label>

            <div className="input password">

              <FiEye />

              <input
                type="password"
                placeholder="••••••••"
              />

              <FiLock />

            </div>

          </div>

        </div>

        <div className="check">

          <input type="checkbox" />

          <span>

            أوافق على

            <a href="#"> الشروط والأحكام </a>

            وسياسة الخصوصية.

          </span>

        </div>

        <button className="next-btn1">

          الخطوة التالية : تفاصيل المورد

        </button>

        <p className="login-text">

          لديك حساب بالفعل؟

          <a href="#"> تسجيل الدخول</a>

        </p>

      </div>

    </div>
  );
};

export default ProviderRegister;