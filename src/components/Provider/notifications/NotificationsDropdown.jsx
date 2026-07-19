function NotificationsDropdown({ notifications, unreadCount, onViewAll }) {
  return (
    <div
      className="provider-navbar__dropdown provider-navbar__dropdown--notifications"
      aria-label="الإشعارات"
    >
      <strong>الإشعارات</strong>
      {unreadCount > 0 ? (
        <p>لديك {unreadCount} إشعارات تحتاج إلى متابعة.</p>
      ) : (
        <p>لا توجد إشعارات جديدة حالياً.</p>
      )}
      {notifications.slice(0, 2).map((notification) => (
        <div
          className="provider-navbar__notification-preview"
          key={notification.id}
        >
          <span>{notification.title}</span>
          <small>{notification.description || notification.body}</small>
        </div>
      ))}
      <button type="button" onClick={onViewAll}>
        عرض الإشعارات
      </button>
    </div>
  );
}

export default NotificationsDropdown;
