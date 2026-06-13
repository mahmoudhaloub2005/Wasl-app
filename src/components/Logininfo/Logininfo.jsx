import "./Logininfo.css";
import images from "../../assets/images/images.png";

function Logininfo() {
  return (
    <div className="login-container">
      <div className="signup-form">
        <h2>انضم كمشترك جديد</h2>

        <p className="subtitle">
          ابدأ بمراقبة استهلاكك للطاقة وإدارة فواتيرك بكل سهولة.
        </p>

        <div className="form-group">
          <label>الاسم الكامل</label>
          <input type="text" placeholder="أدخل اسمك الثلاثي" />
        </div>

        <div className="row">
          <div className="form-group">
            <label>الإيميل</label>
            <input type="email" placeholder="**@**.com" />
          </div>

          <div className="form-group">
            <label>الهاتف</label>
            <input type="text" placeholder="05********" />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" placeholder="********" />
          </div>

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input type="password" placeholder="********" />
          </div>
        </div>

       <div className="terms">
  <input type="checkbox" id="terms" />

  <label htmlFor="terms">
    أوافق على
    <a href="/"> الشروط والأحكام </a>
    و
    <a href="/"> سياسة الخصوصية </a>
    الخاصة بمنصة وصل.
  </label>
</div>

        <button className="signups-btn">
           إنشاء حسابي
        </button>

        <p className="login-link">
          لديك حساب بالفعل؟ <a href="/">تسجيل الدخول</a>
        </p>
        
      </div>
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