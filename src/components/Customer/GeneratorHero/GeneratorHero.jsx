import "./GeneratorHero.css";

function GeneratorHero() {
  return (
    <section className="generator-hero" dir="rtl">
      <div className="generator-hero-content">
        <span className="generator-hero-badge">مولدات موثوقة</span>

        <h1>ابحث عن مزود الكهرباء المناسب لك</h1>

        <p>
          اختر المولد الأقرب لمنطقتك، وتعرّف على تفاصيل الاشتراك والخدمات المتاحة بسهولة.
        </p>
      </div>

      <div className="generator-hero-image">
        <div
          style={{
            width: "100%",
            minHeight: "280px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #00288E, #0b6bd3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "48px",
          }}
        >
          ⚡
        </div>
      </div>
    </section>
  );
}

export default GeneratorHero;
