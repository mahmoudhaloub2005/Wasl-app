import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBell,
  FiCheck,
  FiChevronLeft,
  FiClipboard,
  FiCreditCard,
  FiDollarSign,
  FiPlus,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import "./ProviderHome.css";

const summaryCards = [
  {
    id: "income",
    label: "إجمالي الدخل هذا الشهر",
    value: "12,450",
    unit: "شيكل",
    badge: "+12.5%",
    icon: FiCreditCard,
    tone: "blue",
  },
  {
    id: "active-subscribers",
    label: "المشتركون النشطون",
    value: "842",
    unit: "مشترك",
    badge: "+45 جديد",
    icon: FiUsers,
    tone: "orange",
  },
  {
    id: "new-requests",
    label: "طلبات اشتراك جديدة",
    value: "18",
    unit: "طلب",
    badge: "عاجل",
    icon: FiClipboard,
    tone: "green",
  },
];

const quickActions = [
  {
    id: "notification",
    title: "ارسال إشعار",
    icon: FiBell,
    path: "/provider/notifications/new",
    tone: "orange",
  },
  {
    id: "payments",
    title: "طلبات التحقق من الدفع",
    icon: FiClipboard,
    path: "/provider/financial/payment-verifications",
    tone: "blue",
  },
  {
    id: "ad",
    title: "إضافة إعلان",
    icon: FiBell,
    path: "/provider/ads/new",
    tone: "orange",
  },
];

const workHours = [
  { day: "الأحد", value: 45 },
  { day: "الأثنين", value: 82 },
  { day: "الثلاثاء", value: 66 },
  { day: "الأربعاء", value: 88 },
  { day: "الخميس", value: 54 },
  { day: "الجمعة", value: 36 },
  { day: "السبت", value: 44 },
];

const activities = [
  {
    id: 1,
    title: "تم دفع فاتورة #F-2240",
    meta: "قبل 10 دقائق، المشترك: علي هادي",
    icon: FiCheck,
    tone: "blue",
  },
  {
    id: 2,
    title: "طلب اشتراك جديد",
    meta: "قبل ساعة، مجمع الزهور السكني",
    icon: FiUsers,
    tone: "orange",
  },
  {
    id: 3,
    title: "تنبيه انخفاض وقود",
    meta: "قبل 3 ساعات، مولد رقم 4",
    icon: FiAlertTriangle,
    tone: "red",
  },
];

const generatorLoads = [
  {
    id: "g1",
    name: "مولد الحي الصناعي - G1",
    percent: 75,
    usage: "الاستهلاك الحالي: 340/450 أمبير",
  },
  {
    id: "g5",
    name: "مولد المنصور - G5",
    percent: 42,
    usage: "الاستهلاك الحالي: 190/450 أمبير",
  },
];

function ProviderHome() {
  const navigate = useNavigate();

  function goTo(path) {
    navigate(path);
  }

  return (
    <div className="provider-home" dir="rtl">
      <ProviderNavbar />

      <main className="provider-home__container">
        <section className="provider-home__hero">
          <div className="provider-home__welcome">
            <h1>مرحباً بك، أحمد</h1>
            <p>نظرة عامة على أداء شبكة الطاقة اليوم</p>
          </div>

          <button
            type="button"
            className="provider-home__add-generator"
            onClick={() => goTo("/provider/generators/new")}
          >
            <FiPlus />
            اضافة مولد جديد
          </button>
        </section>

        <section className="provider-home__summary" aria-label="ملخص الأداء">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                type="button"
                className="provider-home-summary-card"
                key={card.id}
                onClick={() =>
                  goTo(
                    card.id === "new-requests"
                      ? "/provider/subscriptions"
                      : card.id === "income"
                        ? "/provider/financial"
                        : "/provider/subscriptions?tab=current"
                  )
                }
              >
                <span
                  className={`provider-home-summary-card__icon provider-home-summary-card__icon--${card.tone}`}
                >
                  <Icon />
                </span>
                <span
                  className={`provider-home-summary-card__badge provider-home-summary-card__badge--${card.tone}`}
                >
                  {card.badge}
                </span>
                <span className="provider-home-summary-card__label">
                  {card.label}
                </span>
                <strong>
                  {card.value}
                  <small>{card.unit}</small>
                </strong>
              </button>
            );
          })}
        </section>

        <section className="provider-home__dashboard">
          <aside className="provider-home__left-column">
            <article className="provider-home-panel provider-home-actions">
              <h2>إجراءات سريعة</h2>

              <div className="provider-home-actions__list">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      type="button"
                      className="provider-home-action"
                      key={action.id}
                      onClick={() => goTo(action.path)}
                    >
                      <FiChevronLeft className="provider-home-action__arrow" />
                      <span>{action.title}</span>
                      <span
                        className={`provider-home-action__icon provider-home-action__icon--${action.tone}`}
                      >
                        <Icon />
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>

            <article className="provider-home-panel provider-home-activities">
              <div className="provider-home-panel__topline">
                <h2>آخر النشاطات</h2>
                <button type="button" onClick={() => goTo("/provider/activities")}>
                  الكل
                </button>
              </div>

              <div className="provider-home-activities__timeline">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <button
                      type="button"
                      className="provider-home-activity"
                      key={activity.id}
                      onClick={() => goTo(`/provider/activities/${activity.id}`)}
                    >
                      <span
                        className={`provider-home-activity__icon provider-home-activity__icon--${activity.tone}`}
                      >
                        <Icon />
                      </span>
                      <span>
                        <strong>{activity.title}</strong>
                        <small>{activity.meta}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          </aside>

          <section className="provider-home__main-column">
            <article className="provider-home-panel provider-home-chart">
              <div className="provider-home-panel__topline provider-home-chart__header">
                <div>
                  <h2>ساعات عمل المولدات</h2>
                  <p>تحليل الأداء للأسبوع الحالي</p>
                </div>

                <div className="provider-home-chart__toggle">
                  <button type="button" className="active">
                    أسبوعي
                  </button>
                  <button type="button">شهري</button>
                </div>
              </div>

              <div className="provider-home-chart__bars" aria-label="رسم ساعات عمل المولدات">
                {workHours.map((item) => (
                  <div className="provider-home-chart__bar-item" key={item.day}>
                    <div className="provider-home-chart__bar">
                      <span style={{ height: `${item.value}%` }} />
                    </div>
                    <strong>{item.day}</strong>
                  </div>
                ))}
              </div>
            </article>

            <section className="provider-home-loads">
              {generatorLoads.map((generator) => (
                <button
                  type="button"
                  className="provider-home-load-card"
                  key={generator.id}
                  onClick={() => goTo(`/provider/generators/${generator.id}`)}
                >
                  <div>
                    <h3>{generator.name}</h3>
                    <strong>{generator.percent}%</strong>
                  </div>
                  <span>
                    <i style={{ width: `${generator.percent}%` }} />
                  </span>
                  <p>{generator.usage}</p>
                </button>
              ))}
            </section>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProviderHome;
