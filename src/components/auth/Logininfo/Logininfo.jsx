import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerCustomer } from "../../../services/authService";
import "./Logininfo.css";
import images from "../../../assets/images/images.png";

function getAuthPayload(data) {
  const token =
    data?.token ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.access_token ||
    data?.user?.token;

  const user =
    data?.user ||
    data?.data?.user ||
    data?.customer ||
    data?.data?.customer ||
    data?.data ||
    null;

  return { token, user };
}

function saveCustomerSession({ token, user }) {
  if (!token) return false;

  localStorage.setItem("wasel_token", token);
  localStorage.setItem("wasel_is_logged_in", "true");
  localStorage.setItem("wasel_user_role", "customer");

  if (user) {
    localStorage.setItem("wasel_user", JSON.stringify(user));
  }

  return true;
}

function Logininfo() {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccessMessage("");
  };

  const loginAfterRegister = async () => {
    const loginData = await loginUser(formData.email, formData.password);
    const authPayload = getAuthPayload(loginData);

    if (!saveCustomerSession(authPayload)) {
      throw new Error("لم يصل التوكن من الخادم بعد تسجيل الدخول");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    if (!formData.terms) {
      setError("يجب الموافقة على الشروط والأحكام");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    if (!firstName || !lastName) {
      setError("يرجى كتابة الاسم الكامل من كلمتين على الأقل");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await registerCustomer({
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
      });

      if (data?.errors) {
        const firstError = data.errors
          ? Object.values(data.errors)[0]?.[0]
          : null;

        setError(firstError || data.message || "حدث خطأ أثناء إنشاء الحساب");
        return;
      }

      const authPayload = getAuthPayload(data);
      const hasRegisterToken = saveCustomerSession(authPayload);

      if (!hasRegisterToken) {
        await loginAfterRegister();
      }

      setSuccessMessage(
        "تم إنشاء الحساب بنجاح، سيتم تحويلك خلال لحظات إلى صفحة العميل."
      );

      window.setTimeout(() => {
        navigate("/customer", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Register Error:", err);
      const firstError = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0]?.[0]
        : null;

      setError(
        firstError ||
          err.response?.data?.message ||
          err.message ||
          "تم إنشاء الحساب لكن لم نستطع تسجيل الدخول تلقائياً، جرّب تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
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
            <Link to="/privacy"> سياسة الخصوصية </Link>
            الخاصة بمنصة وصل.
          </label>
        </div>

        {error && <p className="form-status-message form-status-error">{error}</p>}

        {successMessage && (
          <p className="form-status-message form-status-success">
            {successMessage}
          </p>
        )}

        <button type="submit" className="signups-btn" disabled={loading}>
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حسابي"}
        </button>

        <p className="login-link">
          لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </form>

      <div className="login-info">
        <div className="icon-box">
          <img src={images} alt="وصل" />
        </div>

        <h2>وصل - مستقبل الطاقة المحلية</h2>

        <p>
          منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة والربط مع المزودين
          وإدارة فواتيرك بسهولة.
        </p>
      </div>
    </div>
  );
}

export default Logininfo;
