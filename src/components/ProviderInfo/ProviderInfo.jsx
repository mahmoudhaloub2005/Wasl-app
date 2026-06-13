import "./ProviderInfo.css";
import images from "../../assets/images/images.png"
import icons from "../../assets/icons/icons.svg"
import icons1 from "../../assets/icons/icons1.svg"
const ProviderInfo = () => {
  return (
    <div className="provider-signup1">

      {/* الفورم */}
      <div className="signup-card1">

        <h2>إكمال معلومات المزود</h2>

        <p>
          الرجاء إدخال البيانات المطلوبة لإنشاء حساب شركتك
        </p>

        <div className="input-row1">

          <div className="input-box1">
            <label>اسم الشركة</label>
            <input type="text" placeholder="أدخل اسم الشركة" />
          </div>

        </div>

        <div className="input-row1">

          <div className="input-box1">
            <label>اسم المستخدم</label>
            <input type="text" placeholder="اسم المستخدم" />
          </div>

          <div className="input-box1">
            <label>البريد الإلكتروني</label>
            <input type="email" placeholder="example@company.com" />
          </div>

        </div>

        <div className="input-row1">

          <div className="input-box full1">
            <label>رقم الهاتف</label>
            <input type="text" placeholder="+964 7XX XXX XXXX" />
          </div>

        </div>

        <div className="input-row1">

          <div className="input-box1">
            <label>تأكيد كلمة المرور</label>
            <input type="password" placeholder="********" />
          </div>

          <div className="input-box1">
            <label>كلمة المرور</label>
            <input type="password" placeholder="********" />
          </div>

        </div>

        <div className="checkbox1">

          <input type="checkbox" />

          <span>
            أوافق على شروط الاستخدام وسياسة الخصوصية
          </span>

        </div>

        <button className="signup-btn1">
          إنشاء حسابي
        </button>

        <p className="login-text1">
          لديك حساب بالفعل؟ <a href="#">تسجيل الدخول</a>
        </p>

      </div>
 {/* القسم الأزرق */}
        <div className="login-info1">

          <div className="icon-box1">
            <img src={images} alt="logo1" />
          </div>

          <h2>وصل - مستقبل الطاقة المحلية</h2>

          <p>
            منصة وصل توفر لك تحكماً كاملاً في استهلاك الطاقة
            والربط مع المزودين وإدارة الفواتير بسهولة.
          </p>

          <div className="feature-card">
            <div className="feature-wrapper">
 <div className="feature-icon">  <img src={icons} alt="الايقون" /> </div>
            
           <h4> تقارير الطاقة</h4>
            <span>راقب استهلاك المشتركين بدقة</span>
            </div>

           
           
          </div>
          <div className="feature-card">
            <div className="feature-wrapper ">
            <div className="feature-icon"> <img src={icons1} alt="الايقون"></img>  </div>
            <h4> تحصيل آلي</h4>
            <span>إدارة المدفوعات والفواتير</span>
          </div>
          </div>
          

        </div>
    </div>
  );
};

export default ProviderInfo;