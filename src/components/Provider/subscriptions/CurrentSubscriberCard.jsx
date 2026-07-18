import { FiCalendar, FiPhone } from "react-icons/fi";

function getSubscriberInitials(name) {
  const initials = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join(" ");

  return initials || "؟";
}

function formatRelativeSubscriptionTime(value) {
  if (!value) return "وقت غير محدد";

  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) return "وقت غير محدد";

  const diffMs = Math.max(0, Date.now() - timestamp);
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقائق`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    if (hours === 1) return "منذ ساعة";
    if (hours === 2) return "منذ ساعتين";
    return `منذ ${hours} ساعات`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    if (days === 1) return "منذ يوم";
    if (days === 2) return "منذ يومين";
    return `منذ ${days} أيام`;
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CurrentSubscriberCard({ subscriber, onDelete }) {
  const subscriberName = subscriber.name || "مشترك";

  return (
    <article className="current-subscriber-card">
      <div className="current-subscriber-card__identity">
        <span className="current-subscriber-card__avatar" aria-hidden="true">
          <bdi dir="auto">{getSubscriberInitials(subscriberName)}</bdi>
        </span>

        <div className="current-subscriber-card__info">
          <h2>
            <bdi dir="auto">{subscriberName}</bdi>
          </h2>

          <p>
            <FiCalendar aria-hidden="true" />
            <span>{formatRelativeSubscriptionTime(subscriber.subscribedAt)}</span>
          </p>

          <p>
            <FiPhone aria-hidden="true" />
            {subscriber.phone ? (
              <bdi dir="ltr">{subscriber.phone}</bdi>
            ) : (
              <span>لا يوجد رقم هاتف</span>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="current-subscriber-card__delete"
        onClick={() => onDelete(subscriber)}
        aria-label={`حذف ${subscriberName}`}
      >
        حذف
      </button>
    </article>
  );
}

export default CurrentSubscriberCard;
