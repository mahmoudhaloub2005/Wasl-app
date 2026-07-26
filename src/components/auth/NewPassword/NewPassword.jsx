import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NewPassword.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import imag from "../../../assets/icons/image.png";
const NewPassword = () => {
  const navigate = useNavigate();

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

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setError("");
    navigate("/reset-success");
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

            <span
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
            >
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

            <span
              onClick={() => setShowConfirm(!showConfirm)}
              role="button"
              tabIndex={0}
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="send-btn">
            تحديث كلمة المرور
          </button>

          <Link to="/login" className="back">
            ➜ العودة لتسجيل الدخول
          </Link>
        </form>
      </div>
    </section>
  );
};

export default NewPassword;
