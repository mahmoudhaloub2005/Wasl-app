import "./Login.css";
import images from "../../assets/images/images.png"
function Login() {
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
            placeholder="0501234567"
          />

          <div className="password-row">
            <label>كلمة المرور</label>
            <a href="#">نسيت كلمة المرور؟</a>
          </div>

          <input
            type="password"
            placeholder="********"
          />

          <div className="remember">
            <input type="checkbox" />
            <span>تذكرني على هذا الجهاز</span>
          </div>

          <button>
            تسجيل الدخول
          </button>

          <p className="create-account">
            ليس لديك حساب؟ <span>إنشاء حساب جديد</span>
          </p>
        </div>

      </div>
    </section>
  );
}

export default Login;