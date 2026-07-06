import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBack,
  IoCalendarOutline,
  IoCardOutline,
  IoFlashOutline,
  IoHeadsetOutline,
  IoShieldCheckmarkOutline,
  IoTicketOutline,
  IoWalletOutline,
} from "react-icons/io5";

import solarOffer from "../../../assets/customer/images/solar-offer.png";
import summerOffer from "../../../assets/customer/images/summer-offer.png";
import CustomerActionSuccessModal from "../Shared/CustomerActionSuccessModal";
import "./CustomerOfferDetails.css";

const offers = {
  1: {
    image: summerOffer,
    badge: "عرض محدود لفصل الصيف",
    title: "باقة الصيف الموفرة",
    subtitle:
      "استمتع بصيف مريح مع خصم خاص على اشتراك الكهرباء المنزلي وتقليل ملموس في فواتيرك الشهرية.",
    price: 149,
    capacity: "10 أمبير",
    details:
      "تمنحك باقة الصيف الموفرة سعة كهرباء مناسبة للمنازل مع متابعة فنية مستمرة وخطة دفع مرنة خلال أشهر الصيف.",
  },
  2: {
    image: solarOffer,
    badge: "عرض محدود لفصل الصيف",
    title: "نظام الطاقة الشمسية المستدام: طاقة الصيف الموفرة",
    subtitle:
      "استمتع بصيف مريح وموفر مع تقنيات الطاقة الشمسية الأحدث، قلل اعتمادك على الشبكة التقليدية وساهم في بناء مستقبل أخضر مع توفير ملموس في فواتيرك الشهرية.",
    price: 249,
    capacity: "5 كيلواط",
    details:
      "تتضمن باقة الصيف الموفرة نظاماً متكاملاً بقدرة 5 كيلواط، وهو مثالي للمنازل متوسطة الحجم. النظام مزود بألواح شمسية أحادية البلورة عالية الكفاءة تعمل حتى في درجات الحرارة المرتفعة، مع محول طاقة ذكي يدعم المراقبة عن بعد عبر تطبيق وصل.",
  },
};

const benefits = [
  {
    title: "وفر حتى 20% من فواتيرك",
    text: "تقليل فوري في تكاليف الطاقة بفضل كفاءة الألواح العالية.",
    icon: IoCardOutline,
    color: "blue",
  },
  {
    title: "دعم فني على مدار الساعة",
    text: "فريقنا متاح دائماً لضمان استمرارية الخدمة بكفاءة.",
    icon: IoHeadsetOutline,
    color: "green",
  },
  {
    title: "تقسيط مريح",
    text: "خطط سداد مرنة تصل إلى 24 شهراً بدون فوائد إضافية.",
    icon: IoWalletOutline,
    color: "orange",
  },
  {
    title: "ضمان لمدة 10 سنوات",
    text: "راحة بال تامة مع ضمان شامل على كافة المكونات والتركيب.",
    icon: IoShieldCheckmarkOutline,
    color: "blue",
  },
];

function CustomerOfferDetails() {
  const navigate = useNavigate();
  const { offerId = "2" } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const offer = offers[offerId] || offers[2];

  const handleSubscribe = () => {
    setShowSuccess(true);
  };

  return (
    <main className="customer-offer-details" dir="rtl">
      <section className="offer-details-container">
        <section
          className="offer-details-hero"
          style={{ backgroundImage: `url(${offer.image})` }}
        >
          <button
            className="offer-back-button"
            type="button"
            aria-label="رجوع"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack />
          </button>

          <div className="offer-hero-content">
            <span>{offer.badge}</span>
            <h1>{offer.title}</h1>
            <p>{offer.subtitle}</p>
          </div>
        </section>

        <section className="offer-details-grid">
          <aside className="offer-price-card">
            <span className="available-badge">متوفر حالياً</span>

            <div className="offer-price">
              <span>السعر يبدأ من</span>
              <strong>{offer.price}</strong>
              <em>ش / شهر</em>
            </div>

            <ul>
              <li>
                <IoCalendarOutline />
                مدة العقد: 24 شهر
              </li>
              <li>
                <IoFlashOutline />
                القدرة: {offer.capacity}
              </li>
              <li>
                <IoTicketOutline />
                تركيب مجاني خلال 48 ساعة
              </li>
            </ul>

            <button
              className="offer-subscribe-button"
              type="button"
              onClick={handleSubscribe}
            >
              اشترك الآن
            </button>

            <button
              className="offer-contact-button"
              type="button"
              onClick={() => navigate("/contact-us")}
            >
              تواصل معنا للاستفسار
            </button>

            <p className="offer-small-note">
              * تخضع الشروط والأحكام لسياسة المزود. العرض ساري حتى نهاية شهر
              أغسطس.
            </p>
          </aside>

          <section className="offer-benefits-card">
            <h2>لماذا تختار هذا العرض؟</h2>

            <div className="offer-benefits-grid">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article className="offer-benefit-item" key={benefit.title}>
                    <span className={`benefit-icon ${benefit.color}`}>
                      <Icon />
                    </span>
                    <div>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <section className="offer-tech-details">
          <h2>تفاصيل تقنية</h2>
          <p>{offer.details}</p>
          <blockquote>
            "نهدف من خلال هذا العرض إلى تمكين المواطنين من امتلاك حلول طاقة
            نظيفة بأقل التكاليف وبأعلى معايير الجودة العالمية."
          </blockquote>
        </section>
      </section>

      {showSuccess && (
        <CustomerActionSuccessModal
          title="تم إرسال طلب الاشتراك بنجاح"
          description="تم استلام طلبك، وسيتم التواصل معك من قبل مزود الخدمة في أقرب وقت."
          onClose={() => setShowSuccess(false)}
          onSupport={() => navigate("/contact-us")}
        />
      )}
    </main>
  );
}

export default CustomerOfferDetails;
