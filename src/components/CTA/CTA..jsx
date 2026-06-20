import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CTA.css";

function CTA() {
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState("");

  const handleSignup = () => {
    setLastAction("signup");
    navigate("/choose-account");
  };

  const handleContact = () => {
    setLastAction("support");
    navigate("/contact-us");
  };

  return (
    <section className="cta" data-action={lastAction}>
      <div className="cta-box">
        <h2>هل أنت مستعد لتفعيل اشتراكك؟</h2>

        <p>
          انضم إلى آلاف المستخدمين الذين يديرون طاقتهم بكفاءة عالية عبر منصة وصل.
        </p>

        <div className="cta-buttons">
          <button className="signup-btn" type="button" onClick={handleSignup}>
            سجل حسابك الآن
          </button>

          <button className="contact-btn" type="button" onClick={handleContact}>
            تواصل مع الدعم
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;