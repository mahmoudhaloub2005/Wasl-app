import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import images from "../../../assets/images/images.png";
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = () => {
    if (formData.username === "") {
      alert("الرجاء إدخال رقم الهاتف أو اسم المستخدم");
      return;
    }

    if (formData.password === "") {
      alert("الرجاء إدخال كلمة المرور");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("بيانات تسجيل الدخول:", formData);
      setIsLoading(false);

      navigate("/");
    }, 1000);
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-info">
          <div className="icon-box">
            <img src={images} alt="images" />
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

          <label>رقم الهاتف أو اسم المستخدم</label>
          <input
            type="text"
            name="username"
            placeholder="0501234567"
            value={formData.username}
            onChange={handleChange}
          />

          <div className="password-row">
            <label>كلمة المرور</label>

            <Link to="/forgot-password">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="remember">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span>تذكرني على هذا الجهاز</span>
          </div>

          <button type="button" onClick={handleLogin} disabled={isLoading}>
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