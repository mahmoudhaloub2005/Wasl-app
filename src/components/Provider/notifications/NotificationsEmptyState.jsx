import { FiBell } from "react-icons/fi";

function NotificationsEmptyState() {
  return (
    <section className="provider-notifications-empty" aria-live="polite">
      <span className="provider-notifications-empty__icon">
        <FiBell aria-hidden="true" />
      </span>
      <h2>لا توجد إشعارات حالياً</h2>
      <p>ستظهر هنا الإشعارات والتنبيهات الجديدة الخاصة بحسابك.</p>
    </section>
  );
}

export default NotificationsEmptyState;
