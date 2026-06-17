import "./CTA.css";
function CTA() {
  return (
    <section className="cta">
      <div className="cta-box">
        <h2>هل أنت مستعد لتفعيل اشتراكك؟</h2>

        <p>
          انضم إلى آلاف المستخدمين الذين يديرون طاقتهم بكفاءة عالية عبر منصة وصل.
        </p>

        <div className="cta-buttons">
          <button className="signup-btn">
            سجل حسابك الآن
          </button>

          <button className="contact-btn">
            تواصل مع الدعم
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;