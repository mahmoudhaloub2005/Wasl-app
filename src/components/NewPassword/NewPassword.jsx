import { useState } from "react";
import "./NewPassword.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import imag from "../../assets/icons/image.png";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="page">
      <div className="container">

        <div className="card">

          {/* أيقونة */}
          <img className="icon1" src={imag} alt="" />

          {/* العنوان */}
          <h2 className="hh">إنشاء كلمة مرور جديدة</h2>

          {/* الوصف */}
          <p className="subtitle">
            يرجى إدخال كلمة المرور الجديدة وتأكيدها لتأمين حسابك.
          </p>

          {/* password */}
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور الجديدة"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* confirm */}
          <div className="input-box">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* button */}
          <button className="send-btn">تحديث كلمة المرور</button>

          {/* back */}
          <a href="#" className="back">
            ➜ العودة لتسجيل الدخول
          </a>

        </div>

      </div>
    </section>
  );
};

export default NewPassword;