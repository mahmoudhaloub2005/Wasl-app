import { useState } from "react";
import "./NewPassword.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import imag from "../../assets/icons/image.png";

const NewPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password === "" || formData.confirmPassword === "") {
      setError("يرجى إدخال كلمة المرور وتأكيدها");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setError("");

    console.log("كلمة المرور الجديدة:", formData.password);

    // هون بعدين بتحط كود إرسال كلمة المرور للـ API
  };

  return (
    <section className="page">
      <div className="container">
        <form className="card" onSubmit={handleSubmit}>
          <img className="icon1" src={imag} alt="logo" />

          <h2 className="hh">إنشاء كلمة مرور جديدة</h2>

          <p className="subtitle">
            يرجى إدخال كلمة المرور الجديدة وتأكيدها لتأمين حسابك.
          </p>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="كلمة المرور الجديدة"
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="input-box">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="تأكيد كلمة المرور"
            />

            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="send-btn">
            تحديث كلمة المرور
          </button>

          <a href="#" className="back">
            ➜ العودة لتسجيل الدخول
          </a>
        </form>
      </div>
    </section>
  );
};

export default NewPassword;