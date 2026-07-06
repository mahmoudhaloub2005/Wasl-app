import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import "./ForgotPassword.css";

import imag from "../../../assets/icons/image.png";
import icnes from "../../../assets/icons/icons2.svg";
import icnes1 from "../../../assets/icons/icons3.svg";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    const trimmedEmail = email.trim();
    setMessage("");
    setMessageType("");

    if (!trimmedEmail) {
      setMessage("الرجاء إدخال البريد الإلكتروني");
      setMessageType("error");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setMessage("الرجاء إدخال بريد إلكتروني صحيح");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
      setMessage("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      setMessageType("success");

      navigate("/otp", {
        state: {
          email: trimmedEmail,
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

          <label className="email-label">البريد الإلكتروني</label>

          <div className="input-box">
            <FiMail />

            <input
              type="email"
              placeholder="example@wasl.sa"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {message && (
            <p className={`forgot-message ${messageType}`}>{message}</p>
          )}

          <button
            className="send-btn"
            type="button"
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
          </button>

          <Link to="/login" className="back">
            الرجوع لتسجيل الدخول
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
