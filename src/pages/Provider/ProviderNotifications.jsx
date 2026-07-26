import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import NotificationCard from "../../components/Provider/notifications/NotificationCard";
import NotificationsEmptyState from "../../components/Provider/notifications/NotificationsEmptyState";
import NotificationsFilters from "../../components/Provider/notifications/NotificationsFilters";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import useProviderNotifications from "../../hooks/useProviderNotifications";
import "./ProviderNotifications.css";

function matchesActiveTab(notification, activeTab) {
  if (activeTab === "unread") return !notification.isRead;
  if (activeTab === "read") return notification.isRead;
  return true;
}

function matchesType(notification, typeFilter) {
  return typeFilter === "all" || notification.type === typeFilter;
}

function matchesSearch(notification, searchTerm) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) return true;

  const searchableText = [
    notification.title,
    notification.description,
    notification.body,
    notification.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearchTerm);
}

function ProviderNotifications() {
  const navigate = useNavigate();
  const {
    errorMessage,
    hasUnreadNotifications,
    markAllAsRead,
    isLoading,
    markAsRead,
    notifications,
  } = useProviderNotifications();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          matchesActiveTab(notification, activeTab) &&
          matchesType(notification, typeFilter) &&
          matchesSearch(notification, searchTerm)
      ),
    [activeTab, notifications, searchTerm, typeFilter]
  );

  function openNotification(notification) {
    if (!notification.route) return;

    navigate(notification.route);
  }

  return (
    <div className="provider-notifications-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-notifications">
        <header className="provider-notifications-header">
          <div>
            <h1>الإشعارات</h1>
            <p>تابع جميع التنبيهات والتحديثات الخاصة بحسابك</p>
          </div>

          <button
            type="button"
            className="provider-notifications-header__action"
            onClick={markAllAsRead}
            disabled={!hasUnreadNotifications}
          >
            <FiCheckCircle aria-hidden="true" />
            <span>تحديد الكل كمقروء</span>
          </button>
        </header>

        <NotificationsFilters
          activeTab={activeTab}
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          onSearchChange={setSearchTerm}
          onTabChange={setActiveTab}
          onTypeChange={setTypeFilter}
        />

        {errorMessage ? (
          <p className="subscription-action-message" role="alert">{errorMessage}</p>
        ) : null}

        {isLoading ? (
          <p className="subscription-action-message" role="status">جاري تحميل الإشعارات...</p>
        ) : null}

        <section className="provider-notifications-list" aria-live="polite">
          {!isLoading && filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onOpen={openNotification}
              />
            ))
          ) : !isLoading ? (
            <NotificationsEmptyState />
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProviderNotifications;


