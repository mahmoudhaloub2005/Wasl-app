import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import "./ProviderSubscriptions.css";

const pendingRequestsSeed = [
  {
    id: 1,
    name: "أحمد محمد",
    initials: "أ م",
    ampere: 5,
    waitTime: "منذ ساعتين",
    city: "دير البلح",
    street: "شارع السلام",
    phone: "0770 123 4567",
  },
  {
    id: 2,
    name: "سارة خالد",
    initials: "س خ",
    ampere: 10,
    waitTime: "منذ 5 ساعات",
    city: "دير البلح",
    street: "شارع السلام",
    phone: "0781 987 6543",
  },
  {
    id: 3,
    name: "علي حسين",
    initials: "ع ح",
    ampere: 3,
    waitTime: "اليوم",
    city: "دير البلح",
    street: "شارع السلام",
    phone: "0750 333 2221",
  },
];

const currentSubscribersSeed = [
  {
    id: 10,
    name: "محمد ناصر",
    initials: "م ن",
    ampere: 8,
    waitTime: "مشترك نشط",
    city: "دير البلح",
    street: "شارع السوق",
    phone: "0599 120 331",
  },
  {
    id: 11,
    name: "ريم عادل",
    initials: "ر ع",
    ampere: 6,
    waitTime: "مشترك نشط",
    city: "دير البلح",
    street: "شارع المدارس",
    phone: "0598 771 024",
  },
];

function SubscriptionCard({ request, mode, onAccept, onReject }) {
  return (
    <article className="provider-subscription-card">
      <div className="provider-subscription-card__top">
        <span className="provider-subscription-card__ampere">
          {request.ampere} أمبير
        </span>

        <div className="provider-subscription-card__identity">
          <div>
            <h2>{request.name}</h2>
            <p>
              <FiCalendar />
              {request.waitTime}
            </p>
          </div>
          <span className="provider-subscription-card__avatar">
            {request.initials}
          </span>
        </div>
      </div>

      <div className="provider-subscription-card__details">
        <p>
          <FiMapPin />
          <span>{request.city}</span>
          <strong>-</strong>
          <span>{request.street}</span>
        </p>
        <p>
          <FiPhone />
          <span>{request.phone}</span>
        </p>
      </div>

      {mode === "pending" ? (
        <div className="provider-subscription-card__actions">
          <button
            type="button"
            className="provider-subscription-card__accept"
            onClick={() => onAccept(request.id)}
          >
            قبول الطلب
          </button>
          <button
            type="button"
            className="provider-subscription-card__reject"
            onClick={() => onReject(request.id)}
          >
            رفض
          </button>
        </div>
      ) : (
        <div className="provider-subscription-card__actions">
          <button type="button" className="provider-subscription-card__accept">
            عرض التفاصيل
          </button>
          <button type="button" className="provider-subscription-card__reject">
            تعديل
          </button>
        </div>
      )}
    </article>
  );
}

function ProviderSubscriptions() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingRequests, setPendingRequests] = useState(pendingRequestsSeed);
  const [currentSubscribers, setCurrentSubscribers] = useState(
    currentSubscribersSeed
  );

  const visibleCards = useMemo(
    () => (activeTab === "pending" ? pendingRequests : currentSubscribers),
    [activeTab, pendingRequests, currentSubscribers]
  );

  function acceptRequest(id) {
    const acceptedRequest = pendingRequests.find((request) => request.id === id);

    if (!acceptedRequest) {
      return;
    }

    setPendingRequests((requests) =>
      requests.filter((request) => request.id !== id)
    );
    setCurrentSubscribers((subscribers) => [
      {
        ...acceptedRequest,
        waitTime: "مشترك نشط",
      },
      ...subscribers,
    ]);
  }

  function rejectRequest(id) {
    setPendingRequests((requests) =>
      requests.filter((request) => request.id !== id)
    );
  }

  return (
    <div className="provider-subscriptions-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-subscriptions">
        <section className="provider-subscriptions__heading">
          <h1>إدارة المشتركين</h1>

          <div className="provider-subscriptions__tabs" role="tablist">
            <button
              type="button"
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              <FiUserPlus />
              طلب جديد
            </button>
            <button
              type="button"
              className={activeTab === "current" ? "active" : ""}
              onClick={() => setActiveTab("current")}
            >
              <FiUsers />
              المشتركون الحاليون
            </button>
          </div>
        </section>

        <section className="provider-subscriptions__cards">
          {visibleCards.length ? (
            visibleCards.map((request) => (
              <SubscriptionCard
                key={request.id}
                request={request}
                mode={activeTab}
                onAccept={acceptRequest}
                onReject={rejectRequest}
              />
            ))
          ) : (
            <div className="provider-subscriptions__empty">
              لا توجد طلبات لعرضها حالياً
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProviderSubscriptions;
