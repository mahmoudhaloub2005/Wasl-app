import { useState } from "react";
import "./ProviderRegister.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function useProviderRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    facilityName: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.facilityName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setMessage("يرجى تعبئة جميع الحقول");
      return;
    }

    if (!formData.terms) {
      setMessage("يجب الموافقة على الشروط والأحكام وسياسة الخصوصية");
      return;
    }

    setMessage("");

    console.log("بيانات التسجيل:", formData);

    // هون بعدين بتحط الانتقال للخطوة الثانية أو إرسال البيانات للـ API
  };

  return {
    formData,
    showPassword,
    message,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
}

const ProviderRegister = () => {
  const {
    formData,
    showPassword,
    message,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useProviderRegister();

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
          <span>بيانات المولد</span>
        </div>

        <div className="line"></div>

        <div className="step">
          <div className="circle">3</div>
          <span>تأكيد الحساب</span>
        </div>
      </div>

      {/* Card */}
      <form className="provider-card" onSubmit={handleSubmit}>
        <h2>تسجيل مزود الخدمة</h2>

        <p className="desc">
          املأ هذا في بضع دقائق لإنشاء حسابك الأساسي للانضمام إلى شبكتنا.
        </p>

        <div className="row">
          <div className="input-group">
            <label>الاسم الكامل</label>

            <div className="input">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
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
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="05XXXXXXXX"
              />
              <FiPhone />
            </div>
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>

            <div className="input password">
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <FiLock />
            </div>
          </div>
        </div>

        <div className="check">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />

          <span>
            أوافق على
            <a href="#"> الشروط والأحكام </a>
            وسياسة الخصوصية.
          </span>
        </div>

        {message && <p className="register-error">{message}</p>}

        <button type="submit" className="next-btn1">
          الخطوة التالية : بيانات المولد
        </button>

        <p className="login-text">
          لديك حساب بالفعل؟
          <a href="#"> تسجيل الدخول</a>
        </p>
      </form>
    </div>
  );
};

export default ProviderRegister;