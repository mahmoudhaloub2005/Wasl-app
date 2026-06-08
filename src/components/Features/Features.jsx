import { useState } from "react";
import "./Features.css";
import {
  FaBolt,
  FaBell,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

function Features() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="features">
      <h2>لماذا تختار منصة وصل؟</h2>

      <p className="features-subtitle">
        نحن نقدم تجربة متكاملة لإدارة خدمات الطاقة بكفاءة وسهولة.
      </p>

      <div className="features-grid">
        <div
          className={`feature-card ${activeCard === 0 ? "active" : ""}`}
          onClick={() => setActiveCard(0)}
        >
          <FaBolt />
          <h3>مراقبة الاستهلاك</h3>
          <p>
            تابع استهلاكك للطاقة لحظة بلحظة من أي مكان.
          </p>
        </div>

        <div
          className={`feature-card ${activeCard === 1 ? "active" : ""}`}
          onClick={() => setActiveCard(1)}
        >
          <FaShieldAlt />
          <h3>دفع إلكتروني آمن</h3>
          <p>
            ادفع فواتيرك بسهولة وأمان باستخدام وسائل الدفع المختلفة.
          </p>
        </div>

        <div
          className={`feature-card ${activeCard === 2 ? "active" : ""}`}
          onClick={() => setActiveCard(2)}
        >
          <FaBell />
          <h3>تنبيهات فورية</h3>
          <p>
            استقبل إشعارات مباشرة حول الفواتير والانقطاعات.
          </p>
        </div>

        <div
          className={`feature-card ${activeCard === 3 ? "active" : ""}`}
          onClick={() => setActiveCard(3)}
        >
          <FaUsers />
          <h3>مجتمع المزودين</h3>
          <p>
            تواصل مع مزودي الطاقة واستكشف الخدمات المتاحة.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;