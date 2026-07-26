import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../../../services/authService";
import { setStoredAuthSession } from "../../../utils/authStorage";
import { getApiErrorMessage } from "../../../utils/apiError";
import "./Login.css";
import images from "../../../assets/images/images.png";

function getAuthPayload(data) {
  const token =
    data?.token ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.access_token ||
    data?.user?.token ||
    data?.data?.user?.token;

  const user =
    data?.user ||
    data?.data?.user ||
    data?.customer ||
    data?.data?.customer ||
    data?.provider ||
    data?.data?.provider ||
    data?.data ||
    null;

  const role =
    user?.role ||
    user?.type ||
    user?.accountType ||
    data?.role ||
    data?.type ||
    data?.data?.role ||
    data?.data?.type ||
    "customer";

  return {
    token,
    user,
    role: String(role).toLowerCase(),
  };
}

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
      const { token, user, role } = getAuthPayload(data);

      if (!token) {
        setErrorMessage("تم تسجيل الدخول لكن لم يصل التوكن من الخادم");
        return;
      }

      setStoredAuthSession({
        remember: formData.remember,
        role,
        token,
        user,
      });

      if (role === "provider") {
        navigate("/provider/home");
      } else if (role === "admin") {
        navigate("/admin");
      } else if (
        role === "customer" ||
        role === "client" ||
        role === "user"
      ) {
        navigate("/customer");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        )
      );
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
            قم بتسجيل الدخول للوصول إلى الحساب الخاص بك
          </p>

          <label htmlFor="email">البريد الإلكتروني</label>

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

          <label htmlFor="password">كلمة المرور</label>

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





