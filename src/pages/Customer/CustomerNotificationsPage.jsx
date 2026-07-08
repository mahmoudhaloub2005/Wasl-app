import { useEffect, useState } from "react";

import CustomerNavbar from "../../components/Customer/CustomerNavbar/CustomerNavbar";
import CustomerNotificationsPanel from "../../components/Customer/CustomerNotificationsPanel/CustomerNotificationsPanel";
import Footer from "../../components/layout/Footer/Footer";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";
import "./CustomerNotificationsPage.css";

function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getMyNotifications();

        if (isMounted) {
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);

        if (isMounted) {
          setNotifications([]);
          setErrorMessage(
            error.response?.status === 404 || error.response?.status === 405
              ? ""
              : "تعذر تحميل التنبيهات من الخادم."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <>
      <CustomerNavbar />

      <main className="customer-notifications-page" dir="rtl">
        <div className="customer-notifications-container">
          <div className="customer-notifications-title">
            <h1>الإشعارات</h1>
            <p>تابع تحديثات الفواتير والمدفوعات والتنبيهات المهمة.</p>
          </div>

          <CustomerNotificationsPanel
            notifications={notifications}
            loading={loading}
            errorMessage={errorMessage}
            onMarkAsRead={handleMarkNotificationAsRead}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CustomerNotificationsPage;
