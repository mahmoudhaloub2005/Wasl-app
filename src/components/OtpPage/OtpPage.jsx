import { useState, useRef, useEffect } from "react";
import "./OtpPage.css";
import imag from "../../assets/icons/image.png";

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length < 6) {
      setError("يرجى إدخال رمز التحقق كاملًا");
      return;
    }

    setError("");

    console.log("رمز التحقق:", code);

    // هون بعدين بتحط كود التحقق من الـ API
    alert("OTP Entered: " + code);
  };

  const formatTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const resend = () => {
    setTimer(120);
    setOtp(new Array(6).fill(""));
    setError("");

    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 0);

    // هون بعدين بتحط كود إعادة إرسال الرمز من الـ API
    console.log("تم إعادة إرسال الرمز");
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-card">
          <img className="icon1" src={imag} alt="logo" />

          <h2>التحقق من البريد الإلكتروني</h2>

          <div className="p2">
            <p>
              تم إرسال رمز التحقق إلى بريدك:
              <a href="#"> user@example.com</a>
            </p>
          </div>

          <p>أدخل رمز التحقق المكون من 6 أرقام</p>

          <div className="otp-inputs">
            {otp.map((num, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={num}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="verify-btn" onClick={handleVerify}>
            تأكيد الرمز
          </button>

          <div className="resend">
            {timer > 0 ? (
              <p>إعادة إرسال الرمز خلال {formatTime()}</p>
            ) : (
              <button className="resend-btn" onClick={resend}>
                إعادة إرسال الرمز
              </button>
            )}
          </div>

          <div className="link">
            <a href="#">تغيير البريد الإلكتروني</a>
          </div>
        </div>
      </div>
    </div>
  );
}