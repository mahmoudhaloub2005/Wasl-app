import { useState, useRef, useEffect } from "react";
import "./OtpPage.css";
import imag from "../../assets/icons/image.png"

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(120); // 2 minutes
  const inputsRef = useRef([]);

  // ⏱️ Countdown
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

    // move next
    if (value && index < 5) {
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
    alert("OTP Entered: " + code);
  };

  const formatTime = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, "0");
    const s = String(timer % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const resend = () => {
    setTimer(120);
    setOtp(new Array(6).fill(""));
    inputsRef.current[0].focus();
  };

  return (
    <div className="otp-page">

      

      {/* Card */}
      <div className="otp-container">
        <div className="otp-card">
            <img className="icon1" src={imag} alt="" />

          <h2>التحقق من البريد الإلكتروني</h2>
          <div className="p2">
            <p>
              تم إرسال رمز التحقق إلى بريدك: <a href="">user@example.com</a>
            </p>
          </div>
          <p>أدخل رمز التحقق المكون من 6 أرقام</p>

          {/* OTP Inputs */}
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

          <button className="verify-btn" onClick={handleVerify}>
            تأكيد الرمز
          </button>

          {/* Timer */}
          <div className="resend">
            {timer > 0 ? (
              <p>إعادة الإرسال الرمز خلال {formatTime()}</p>
            ) : (
              <a onClick={resend} style={{ cursor: "pointer" }}>
                إعادة إرسال الرمز
              </a>
            )}
          </div>
          <div className="link"> <a href=""> تغيير البريد الإلكتروني </a></div>
        </div>
      </div>
    </div>
  );
}