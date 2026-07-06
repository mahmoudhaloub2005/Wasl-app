import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../../../components/Customer/CustomerNavbar/CustomerNavbar";
import WelcomeSection from "../../../components/Customer/WelcomeSection/WelcomeSection";
import CurrentSubscriptionCard from "../../../components/Customer/CurrentSubscriptionCard/CurrentSubscriptionCard";
import CustomerNotificationsPanel from "../../../components/Customer/CustomerNotificationsPanel/CustomerNotificationsPanel";
import CustomerMiniStats from "../../../components/Customer/CustomerMiniStats/CustomerMiniStats";
import OffersSection from "../../../components/Customer/OffersSection/OffersSection";
import Footer from "../../../components/layout/Footer/Footer";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../../../services/notificationService";
import { getUserDisplayName } from "../../../utils/authStorage";

import "./CustomerHome.css";

function CustomerHome() {
  const navigate = useNavigate();
  const currentGeneratorId = "nour";
  const userName = getUserDisplayName();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        const data = await getMyNotifications();

        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);

        if (isMounted) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditSubscription = () => {
    navigate(`/customer/subscriptions/${currentGeneratorId}`);
  };

  const handleViewSubscriptionDetails = () => {
    navigate(`/customer/generator-details/${currentGeneratorId}`);
  };

  const handleShowAllNotifications = () => {
    console.log("فتح صفحة كافة التنبيهات");
  };

  const handleMarkNotificationAsRead = async (notification) => {
    if (!notification?.id || notification.isRead) return;

    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );

    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id ? { ...item, isRead: false } : item
        )
      );
    }
  };

  const handleViewAllOffers = () => {
    navigate("/customer/offers/2");
  };

  const handleViewOfferDetails = (offerId) => {
    navigate(`/customer/offers/${offerId}`);
  };

  return (
    <div className="customer-home-page" dir="rtl">
      <CustomerNavbar />

      <main className="customer-home-container">
        <WelcomeSection userName={userName} />

        <div className="customer-dashboard-layout">
          <aside className="customer-dashboard-left">
            <CustomerNotificationsPanel
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onShowAllNotifications={handleShowAllNotifications}
            />

            <CustomerMiniStats />
          </aside>

          <section className="customer-dashboard-right">
            <CurrentSubscriptionCard
              onEditSubscription={handleEditSubscription}
              onViewDetails={handleViewSubscriptionDetails}
            />

            <OffersSection
              onViewAllOffers={handleViewAllOffers}
              onViewOfferDetails={handleViewOfferDetails}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerHome;
