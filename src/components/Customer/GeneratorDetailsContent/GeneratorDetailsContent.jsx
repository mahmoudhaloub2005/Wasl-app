import "./GeneratorDetailsContent.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGeneratorById } from "../../../data/generatorsStorage";
import { getGeneratorDetails } from "../../../services/generatorService";

import providerUser from "../../../assets/customer/fgp/icons/provider-user.svg";
import providerLocation from "../../../assets/customer/fgp/icons/provider-location.svg";
import providerPhone from "../../../assets/customer/fgp/icons/provider-phone.svg";
import guaranteeLightning from "../../../assets/customer/fgp/icons/guarantee-lightning.svg";
import sectionDescription from "../../../assets/customer/fgp/icons/section-description.svg";
import support24 from "../../../assets/customer/fgp/icons/support-24.svg";
import maintenanceShield from "../../../assets/customer/fgp/icons/maintenance-shield.svg";
import termsIcon from "../../../assets/customer/fgp/icons/terms-icon.svg";
import checkCircle from "../../../assets/customer/fgp/icons/check-circle.svg";
import reviewsIcon from "../../../assets/customer/fgp/icons/reviews-icon.svg";
import reviewAvatar from "../../../assets/customer/fgp/images/review-avatar.png";

function GeneratorDetailsContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [generator, setGenerator] = useState(() => getGeneratorById(id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadGenerator() {
      try {
        setLoading(true);
        const data = await getGeneratorDetails(id);

        if (isMounted && data?.id) {
          setGenerator(data);
        }
      } catch (error) {
        console.error("Failed to load generator details:", error);

        if (isMounted) {
          setGenerator(getGeneratorById(id));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGenerator();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading && !generator) {
    return (
      <main className="generator-details-content" dir="rtl">
        <div className="generator-details-container">
          <div className="details-empty-state">
            <h2>جاري تحميل بيانات المولد...</h2>
            <p>نحضّر تفاصيل المولد من الخادم.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!generator) {
    return (
      <main className="generator-details-content" dir="rtl">
        <div className="generator-details-container">
          <div className="details-empty-state">
            <h2>لم يتم العثور على المولد</h2>
            <p>قد يكون هذا المولد غير موجود أو لم تتم إضافته بعد.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="generator-details-content" dir="rtl">
      <div className="generator-details-container">
        <aside className="generator-details-sidebar">
          <div className="subscription-card">
            <div className="subscription-price">
              <span>السعر لكل أمبير</span>

              <h2>
                {generator.price}
                <small> {generator.currency}</small>
              </h2>
            </div>

            <div className="subscription-capacity">
              <div className="capacity-text">
                <span>القدرة المتاحة</span>
                <strong>{generator.capacity}</strong>
              </div>

              <div className="capacity-progress">
                <span></span>
              </div>
            </div>

            <button
              className="subscribe-button"
              type="button"
              onClick={() => navigate(`/customer/subscriptions/${id}`)}
            >
              اشترك الآن
            </button>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-info">
              <h3>ضمان 99.9%</h3>
              <p>استمرارية في الخدمة</p>
            </div>

            <div className="guarantee-icon">
              <img src={guaranteeLightning} alt="ضمان" />
            </div>
          </div>

          <div className="provider-card">
            <h3>معلومات المزود</h3>

            <div className="provider-row">
              <img src={providerUser} alt="" />
              <p>{generator.provider.name}</p>
            </div>

            <div className="provider-row">
              <img src={providerLocation} alt="" />
              <p>{generator.provider.address}</p>
            </div>

            <div className="provider-row">
              <img src={providerPhone} alt="" />
              <p>{generator.provider.phone}</p>
            </div>
          </div>
        </aside>

        <section className="generator-details-main">
          <section className="generator-hero">
            <img src={generator.image} alt={generator.name} />

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <div className="hero-location">
                <span className="online-badge">{generator.status}</span>
                <span>{generator.location}</span>
              </div>

              <h1>{generator.name}</h1>

              <p>{generator.shortDescription}</p>
            </div>
          </section>

          <section className="details-block">
            <div className="details-title">
              <img src={sectionDescription} alt="" />
              <h2>وصف الخدمة</h2>
            </div>

            <div className="description-card">
              <p>{generator.serviceDescription}</p>

              <div className="description-features">
                <div className="description-feature">
                  <img src={support24} alt="" />
                  <span>دعم فني 24/7</span>
                </div>

                <div className="description-feature">
                  <img src={maintenanceShield} alt="" />
                  <span>صيانة وقائية أسبوعية</span>
                </div>
              </div>
            </div>
          </section>

          <section className="details-block terms-block">
            <div className="details-title">
              <img src={termsIcon} alt="" />
              <h2>شروط الاشتراك</h2>
            </div>

            <div className="terms-card">
              {generator.terms.map((term, index) => (
                <div className="term-row" key={index}>
                  <img src={checkCircle} alt="" />
                  <p>{term}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="details-block reviews-block">
            <div className="reviews-header">
              <div className="details-title">
                <img src={reviewsIcon} alt="" />
                <h2>آراء المشتركين</h2>
              </div>

              <div className="rating">
                <span>★★★★★</span>
                <strong>{generator.rating}</strong>
              </div>
            </div>

            <div className="review-card">
              <div className="review-person">
                <img src={reviewAvatar} alt={generator.review.userName} />

                <div>
                  <h4>{generator.review.userName}</h4>
                  <p>{generator.review.text}</p>
                </div>
              </div>

              <span className="review-date">{generator.review.date}</span>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default GeneratorDetailsContent;
