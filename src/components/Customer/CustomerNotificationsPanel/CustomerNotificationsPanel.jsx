import "./CustomerNotificationsPanel.css";

import newNotifications from "../../../assets/customer/icons/new-notifications.svg";
import unpaidBill from "../../../assets/customer/icons/unpaid-bill.svg";
import paidBill from "../../../assets/customer/icons/paid-bill.svg";

const defaultNotifications = [
  {
    id: 1,
    title: "صدرت فاتورة شهر تموز",
    description: "تم إصدار فاتورتك الجديدة بمبلغ",
    time: "منذ ساعتين",
    icon: newNotifications,
    iconAlt: "تنبيه جديد",
    colorClass: "notification-blue",
  },
  {
    id: 2,
    title: "صيانة مجدولة",
    description: "تنبيه: صيانة دورية للمولد غداً من...",
    time: "منذ 5 ساعات",
    icon: unpaidBill,
    iconAlt: "صيانة مجدولة",
    colorClass: "notification-orange",
  },
  {
    id: 3,
    title: "تم استلام الدفعة",
    description: "شكراً لك، تم تأكيد استلام دفعتك...",
    time: "أمس، 10:30 صباحاً",
    icon: paidBill,
    iconAlt: "تم استلام الدفعة",
    colorClass: "notification-gray",
  },
];

function CustomerNotificationsPanel({
  notifications = defaultNotifications,
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
        {hasNotifications ? (
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

      {hasNotifications && (
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
