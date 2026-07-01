import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../../../services/authService";
import "./Login.css";
import images from "../../../assets/images/images.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrorMessage("");
  };

  const handleLogin = async () => {
    if (formData.email.trim() === "") {
      setErrorMessage("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    if (formData.password.trim() === "") {
      setErrorMessage("الرجاء إدخال كلمة المرور");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await loginUser(formData.email, formData.password);

      console.log("Login Response:", data);

      const token =
        data.token ||
        data.access_token ||
        data.data?.token ||
        data.user?.token;

      if (!token) {
        setErrorMessage("تم تسجيل الدخول لكن لم يصل التوكن من الخادم");
        return;
      }

      const user =
        data.user ||
        data.data?.user ||
        data.customer ||
        data.provider ||
        data.data;

      const storage = formData.remember ? localStorage : sessionStorage;

      storage.setItem("wasel_token", token);

      if (user) {
        storage.setItem("wasel_user", JSON.stringify(user));
      }

      storage.setItem("wasel_is_logged_in", "true");

      const role =
        user?.role ||
        user?.type ||
        data.role ||
        data.data?.role;

      if (role === "provider") {
        navigate("/provider/home");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "البريد الإلكتروني أو كلمة المرور غير صحيحة";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-info">
          <div className="icon-box">
            <img src={images} alt="وصل" />
          </div>

          <h2>وصل - مستقبل الطاقة المحلية</h2>

          <p>
            منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة
            والربط مع المزودين وإدارة فواتيرك بسهولة.
          </p>
        </div>

        <div className="login-form">
          <h4>مرحباً بك مجدداً</h4>

          <p className="subtitle">
            قم بتسجيل الدخول للوصول إلى حساب المواطن الخاص بك
          </p>

          <label>البريد الإلكتروني</label>

          <div className="input-wrapper">
            <FiUser className="field-icon right-icon" />

            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              placeholder="مثال: example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <label>كلمة المرور</label>

          <div className="input-wrapper">
            <FiLock className="field-icon right-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <Link className="forgot-link" to="/forgot-password">
            نسيت كلمة المرور؟
          </Link>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <div className="remember">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span>تذكرني على هذا الجهاز</span>
          </div>

          <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

          <p className="create-account">
            ليس لديك حساب؟{" "}
            <span onClick={() => navigate("/choose-account")}>
              إنشاء حساب جديد
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;