import "./ResetSuccess.css";
import { FiCheckCircle } from "react-icons/fi";
import imag from "../../assets/icons/image.png";

const ResetSuccess = () => {
  return (
    <div className="reset-page">
      <div className="reset-container">

        <div className="reset-card">
                    <img className="icon1" src={imag} alt="" />
          
          <div className="icon-wrapper">
            <FiCheckCircle className="success-icon" />
          </div>

          <h2>تم تغيير كلمة المرور بنجاح</h2>

          <p>
يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة مرور جديدة.          </p>

          <button className="login-btn">
            تسجيل الدخول الآن
       </button>
       <div className="class">
        <p className="pp">تواجه مشكلة ؟</p>
          <a href="/login" className="back-link">
تواصل مع الدعم الفني           </a>
        </div>   

        </div>

      </div>
    </div>
  );
};

export default ResetSuccess;