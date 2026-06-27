

import "./GeneratorHero.css";
import generatorImage from "../../assets/images/generator-cover.jpg";

function GeneratorHero() {
  return (
    <section className="generator-hero">

      <div className="generator-image">
        <img src={generatorImage} alt="Generator" />
      </div>

      <div className="subscription-card">

        <h2>مولد الرشيد الذكي</h2>

        <p>دير البلح - شارع السوق</p>

        <div className="info-box">
          <span>السعر لكل أمبير</span>
          <h3>₪18,500</h3>
        </div>

        <div className="info-box">
          <span>القدرة المتاحة</span>
          <h3>450 أمبير</h3>
        </div>

        <button>
          اشترك الآن
        </button>

      </div>

    </section>
  );
}

export default GeneratorHero;
