import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { FiMail } from "react-icons/fi";

import imag from "../../assets/icons/image.png";
import icnes from "../../assets/icons/icons2.svg";
import icnes1 from "../../assets/icons/icons3.svg";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    setMessage("");

    if (email.trim() === "") {
      setMessage("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    if (!email.includes("@")) {
      setMessage("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setMessage("تم إرسال رمز التحقق إلى بريدك الإلكتروني");

      navigate("/otp", {
        state: {
          email: email,
          flow: "reset-password",
        },
      });
    }, 1000);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <img className="icon1" src={imag} alt="" />

          <h2>استعادة كلمة المرور</h2>

          <p className="subtitle">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>

          <label className="email-label">البريد الالكتروني</label>

          <div className="input-box">
            <FiMail />

            <input
              type="email"
              placeholder="example@wasl.sa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="forgot-message">{message}</p>}

          <button
            className="send-btn"
            type="button"
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>

          <Link to="/login" className="back">
            ➜ العودة لتسجيل الدخول
          </Link>
        </div>
      </div>

      <div className="footers">
        <p className="p1">
          <img className="p1" src={icnes1} alt="" />
          نظام مشفر بالكامل

          <img className="p1" src={icnes} alt="" />
          الدعم الفني 24/7
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;