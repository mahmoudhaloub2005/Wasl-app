import "./OffersSection.css";

import solarOffer from "/src/assets/customer/images/solar-offer.png";
import summerOffer from "/src/assets/customer/images/summer-offer.png";

const defaultOffers = [
  {
    id: 1,
    title: "باقة الصيف الموفرة",
    description:
      "وفر في فواتيرك الصيفية مع عرضنا الجديد للمشتركين فوق 10 أمبير.",
    image: summerOffer,
    imageAlt: "باقة الصيف الموفرة",
    badgeText: "خصم 20%",
    badgeColorClass: "orange",
    isActive: true,
  },
  {
    id: 2,
    title: "نظام الطاقة الشمسية",
    description:
      "يمكنك الآن تقسيط أنظمة الطاقة الشمسية المنزلية بالتعاون مع مزودينا.",
    image: solarOffer,
    imageAlt: "نظام الطاقة الشمسية",
    badgeText: "جديد",
    badgeColorClass: "blue",
    isActive: true,
  },
];

function OffersSection({
  offers = defaultOffers,
  onViewAllOffers,
  onViewOfferDetails,
}) {
  const activeOffers = offers.filter((offer) => offer.isActive);

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <section className="offers-section" dir="rtl">
      <div className="offers-section-header">
        <h2>العروض والإعلانات</h2>
        <button type="button" onClick={onViewAllOffers}>
          عرض الكل
        </button>
      </div>

      <div className="offers-cards">
        {activeOffers.map((offer) => (
          <article className="offer-card" key={offer.id}>
            <div className="offer-image-wrapper">
              <img src={offer.image} alt={offer.imageAlt} />
              <span className={`offer-badge ${offer.badgeColorClass}`}>
                {offer.badgeText}
              </span>
            </div>

            <div className="offer-card-body">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>

              <button
                type="button"
                onClick={() => onViewOfferDetails?.(offer.id)}
              >
                عرض التفاصيل
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
