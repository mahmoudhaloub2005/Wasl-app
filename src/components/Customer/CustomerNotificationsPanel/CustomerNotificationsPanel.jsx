import "./CustomerNotificationsPanel.css";

import newNotifications from "../../../assets/customer/icons/new-notifications.svg";

function CustomerNotificationsPanel({
  notifications = [],
  loading = false,
  errorMessage = "",
  onMarkAsRead,
  onShowAllNotifications,
}) {
  const hasNotifications = notifications.length > 0;
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <section className="customer-notifications-panel" dir="rtl">
      <div className="notifications-panel-header">
        <h2>التنبيهات</h2>
        <span className="notifications-count">{unreadCount}</span>
      </div>

      <div className="notifications-list">
        {loading ? (
          <article className="notification-card notification-blue">
            <span className="notification-side-dot"></span>

            <div className="notification-content">
              <h3>جاري تحميل التنبيهات...</h3>
              <p>نحضّر آخر الإشعارات من الخادم.</p>
              <small>الآن</small>
            </div>

            <img src={newNotifications} alt="تحميل التنبيهات" />
          </article>
        ) : errorMessage ? (
          <article className="notification-card notification-orange">
            <span className="notification-side-dot"></span>

            <div className="notification-content">
              <h3>تعذر تحميل التنبيهات</h3>
              <p>{errorMessage}</p>
              <small>الآن</small>
            </div>

            <img src={newNotifications} alt="تعذر تحميل التنبيهات" />
          </article>
        ) : hasNotifications ? (
          notifications.map((notification) => (
            <button
              type="button"
              className={`notification-card ${notification.colorClass} ${
                notification.isRead ? "read" : "unread"
              }`}
              key={notification.id}
              onClick={() => onMarkAsRead?.(notification)}
            >
              <span className="notification-side-dot"></span>

              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.description}</p>
                <small>{notification.time}</small>
              </div>

              <img src={notification.icon} alt={notification.iconAlt} />
            </button>
          ))
        ) : (
          <article className="notification-card notification-gray">
            <span className="notification-side-dot"></span>

            <div className="notification-content">
              <h3>لا توجد تنبيهات حالياً</h3>
              <p>سنخبرك هنا عند صدور فاتورة أو وجود تحديث جديد.</p>
              <small>الآن</small>
            </div>

            <img src={newNotifications} alt="لا توجد تنبيهات" />
          </article>
        )}
      </div>

      {!loading && hasNotifications && (
        <button
          className="show-all-notifications"
          type="button"
          onClick={onShowAllNotifications}
        >
          مشاهدة كافة التنبيهات
        </button>
      )}
    </section>
  );
}

export default CustomerNotificationsPanel;
