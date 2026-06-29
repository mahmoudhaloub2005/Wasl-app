import { useState } from "react";
import { Link } from "react-router-dom";
import "./Logininfo.css";
import images from "../../../assets/images/images.png";
function Logininfo() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      setSuccessMessage("");
      return;
    }

    if (!formData.terms) {
      setError("يجب الموافقة على الشروط والأحكام");
      setSuccessMessage("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      setSuccessMessage("");
      return;
    }

    setError("");
    setSuccessMessage("تم إنشاء الحساب بنجاح");

    console.log("بيانات التسجيل:", formData);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    });
  };

  return (
    <div className="login-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>انضم كمشترك جديد</h2>

        <p className="subtitle">
          ابدأ بمراقبة استهلاكك للطاقة وإدارة فواتيرك بكل سهولة.
        </p>

        <div className="form-group">
          <label>الاسم الكامل</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="أدخل اسمك الثلاثي"
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>الإيميل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="**@**.com"
            />
          </div>

          <div className="form-group">
            <label>الهاتف</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="05********"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
            />
          </div>

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
            />
          </div>
        </div>

        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />

          <label htmlFor="terms">
            أوافق على
            <Link to="/terms"> الشروط والأحكام </Link>
            و
            <Link to="/terms"> سياسة الخصوصية </Link>
            الخاصة بمنصة وصل.
          </label>
        </div>

        {error && (
          <p className="form-status-message form-status-error">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="form-status-message form-status-success">
            {successMessage}
          </p>
        )}

        <button type="submit" className="signups-btn">
          إنشاء حسابي
        </button>

        <p className="login-link">
          لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </form>

      <div className="login-info">
        <div className="icon-box">
          <img src={images} alt="logo" />
        </div>

        <h2>وصل - مستقبل الطاقة المحلية</h2>

        <p>
          منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة
          والربط مع المزودين وإدارة فواتيرك بسهولة.
        </p>
      </div>
    </div>
  );
}

export default Logininfo;