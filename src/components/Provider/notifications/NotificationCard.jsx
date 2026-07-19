import {
  FiBell,
  FiCheck,
  FiCreditCard,
  FiExternalLink,
  FiFileText,
  FiMessageSquare,
  FiTrash2,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const TYPE_ICONS = {
  complaint: FiMessageSquare,
  generator: FiZap,
  invoice: FiFileText,
  payment: FiCreditCard,
  subscriber: FiUsers,
  system: FiBell,
};

const TYPE_LABELS = {
  complaint: "الشكاوى",
  generator: "المولدات",
  invoice: "الفواتير",
  payment: "المدفوعات",
  subscriber: "المشتركين",
  system: "النظام",
};

function formatNotificationDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  const differenceInMilliseconds = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (differenceInMilliseconds < minute) return "الآن";

  if (differenceInMilliseconds < hour) {
    const minutes = Math.max(1, Math.floor(differenceInMilliseconds / minute));
    return `قبل ${minutes} دقيقة`;
  }

  if (differenceInMilliseconds < day) {
    const hours = Math.max(1, Math.floor(differenceInMilliseconds / hour));
    return `قبل ${hours} ساعة`;
  }

  if (differenceInMilliseconds < 7 * day) {
    const days = Math.max(1, Math.floor(differenceInMilliseconds / day));
    return `قبل ${days} يوم`;
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function NotificationCard({
  notification,
  onDelete,
  onMarkAsRead,
  onOpen,
}) {
  const Icon = TYPE_ICONS[notification.type] || FiBell;
  const description =
    notification.description || notification.body || notification.message || "";
  const typeLabel = TYPE_LABELS[notification.type] || TYPE_LABELS.system;

  function markAsRead() {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  }

  function handleCardClick() {
    markAsRead();
  }

  function handleCardKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }

  function handleMarkAsRead(event) {
    event.stopPropagation();
    markAsRead();
  }

  function handleDelete(event) {
    event.stopPropagation();

    if (window.confirm("هل تريد حذف هذا الإشعار؟")) {
      onDelete(notification.id);
    }
  }

  function handleOpen(event) {
    event.stopPropagation();
    markAsRead();
    onOpen(notification);
  }

  return (
    <article
      className={`provider-notification-card ${
        notification.isRead ? "" : "provider-notification-card--unread"
      }`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`${notification.title} ${
        notification.isRead ? "مقروء" : "غير مقروء"
      }`}
    >
      <div className="provider-notification-card__icon">
        <Icon aria-hidden="true" />
      </div>

      <div className="provider-notification-card__content">
        <div className="provider-notification-card__meta">
          <span>{typeLabel}</span>
          <time dateTime={notification.createdAt}>
            {formatNotificationDate(notification.createdAt)}
          </time>
        </div>

        <h2>{notification.title}</h2>
        <p>{description}</p>
      </div>

      {!notification.isRead ? (
        <span
          className="provider-notification-card__unread-dot"
          aria-label="غير مقروء"
        />
      ) : null}

      <div className="provider-notification-card__actions">
        {!notification.isRead ? (
          <button type="button" onClick={handleMarkAsRead}>
            <FiCheck aria-hidden="true" />
            <span>تحديد كمقروء</span>
          </button>
        ) : null}

        {notification.route ? (
          <button type="button" onClick={handleOpen}>
            <FiExternalLink aria-hidden="true" />
            <span>فتح</span>
          </button>
        ) : null}

        <button
          type="button"
          className="provider-notification-card__delete"
          onClick={handleDelete}
        >
          <FiTrash2 aria-hidden="true" />
          <span>حذف</span>
        </button>
      </div>
    </article>
  );
}

export default NotificationCard;
