import { useEffect, useState } from "react";
import "./Features.css";
import { FaBell, FaBolt, FaShieldAlt, FaUsers } from "react-icons/fa";

function Features() {
  const [activeCard, setActiveCard] = useState(() => {
    const savedCard = localStorage.getItem("activeFeatureCard");

    if (savedCard !== null) {
      return Number(savedCard);
    }

    return 0;
  });

  useEffect(() => {
    localStorage.setItem("activeFeatureCard", activeCard);
  }, [activeCard]);

  const featuresData = [
    {
      icon: FaBolt,
      title: "مراقبة الاستهلاك",
      description: "تابع استهلاكك للطاقة لحظة بلحظة من أي مكان.",
    },
    {
      icon: FaShieldAlt,
      title: "دفع إلكتروني آمن",
      description:
        "ادفع فواتيرك بسهولة وأمان باستخدام وسائل الدفع المختلفة.",
    },
    {
      icon: FaBell,
      title: "تنبيهات فورية",
      description: "استقبل إشعارات مباشرة حول الفواتير والانقطاعات.",
    },
    {
      icon: FaUsers,
      title: "مجتمع المزودين",
      description: "تواصل مع مزودي الطاقة واستكشف الخدمات المتاحة.",
    },
  ];

  const handleCardClick = (index) => {
    setActiveCard(index);
  };

  return (
    <section className="features">
      <h2>لماذا تختار منصة وصل؟</h2>

      <p className="features-subtitle">
        نحن نقدم تجربة متكاملة لإدارة خدمات الطاقة بكفاءة وسهولة.
      </p>

      <div className="features-grid">
        {featuresData.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <button
              type="button"
              key={index}
              className={`feature-card1 ${activeCard === index ? "active" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <Icon />

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Features;
