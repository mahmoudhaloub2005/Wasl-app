import { useState } from "react";
import "./CTA.css";

function CTA() {
  const [lastAction, setLastAction] = useState("");

  const handleSignup = () => {
    setLastAction("signup");
    console.log("المستخدم ضغط على سجل حسابك الآن");
    alert("سيتم نقلك إلى صفحة اختيار نوع الحساب");
  };

  const handleContact = () => {
    setLastAction("support");
    console.log("المستخدم ضغط على تواصل مع الدعم");
    alert("سيتم فتح صفحة الدعم الفني");
  };

  return (
    <section className="cta" data-action={lastAction}>
      <div className="cta-box">
        <h2>هل أنت مستعد لتفعيل اشتراكك؟</h2>

        <p>
          انضم إلى آلاف المستخدمين الذين يديرون طاقتهم بكفاءة عالية عبر منصة وصل.
        </p>

        <div className="cta-buttons">
          <button className="signup-btn" onClick={handleSignup}>
            سجل حسابك الآن
          </button>

          <button className="contact-btn" onClick={handleContact}>
            تواصل مع الدعم
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;