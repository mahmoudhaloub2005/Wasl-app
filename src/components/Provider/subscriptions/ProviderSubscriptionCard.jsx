import { FiCalendar, FiMapPin, FiPhone } from "react-icons/fi";

function formatRelativeTime(value) {
  if (!value) return "وقت غير محدد";

  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) return "وقت غير محدد";

  const diffMs = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقائق`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعات`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return days === 1 ? "منذ يوم" : `منذ ${days} أيام`;
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmpereLabel(value) {
  const numericValue = Number(value || 0);

  if (!numericValue) return "غير محدد";

  return `${new Intl.NumberFormat("ar").format(numericValue)} أمبير`;
}

function getSubscriberTimeLabel(subscriber, mode) {
  if (mode === "current") {
    return subscriber.acceptedAt
      ? `مشترك منذ ${formatRelativeTime(subscriber.acceptedAt).replace("منذ ", "")}`
      : "مشترك نشط";
  }

  return formatRelativeTime(subscriber.requestedAt);
}

function ProviderSubscriptionCard({
  mode,
  onAccept,
  onReject,
  pendingActionKey,
  subscriber,
}) {
  const actionDisabled = Boolean(pendingActionKey);
  const isAccepting = pendingActionKey === `accept-${subscriber.id}`;
  const isRejecting = pendingActionKey === `reject-${subscriber.id}`;
  const locationParts = [subscriber.city, subscriber.street].filter(Boolean);

  return (
    <article className="provider-subscription-card">
      <div className="provider-subscription-card__top">
        <span className="provider-subscription-card__ampere">
          {formatAmpereLabel(subscriber.ampere)}
        </span>

        <div className="provider-subscription-card__identity">
          <div>
            <h2>
              <bdi dir="auto">{subscriber.customerName}</bdi>
            </h2>
            <p>
              <FiCalendar aria-hidden="true" />
              <span>{getSubscriberTimeLabel(subscriber, mode)}</span>
            </p>
          </div>
          <span className="provider-subscription-card__avatar">
            <bdi dir="auto">{subscriber.initials}</bdi>
          </span>
        </div>
      </div>

      <div className="provider-subscription-card__details">
        <p>
          <FiMapPin aria-hidden="true" />
          {locationParts.length ? (
            locationParts.map((part, index) => (
              <span key={`${part}-${index}`}>
                <bdi dir="auto">{part}</bdi>
                {index < locationParts.length - 1 ? " - " : ""}
              </span>
            ))
          ) : (
            <span>لم يتم تحديد العنوان</span>
          )}
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

      {mode === "pending" ? (
        <div className="provider-subscription-card__actions">
          <button
            type="button"
            className="provider-subscription-card__accept"
            disabled={actionDisabled}
            onClick={() => onAccept(subscriber.id)}
          >
            {isAccepting ? "جار القبول..." : "قبول الطلب"}
          </button>
          <button
            type="button"
            className="provider-subscription-card__reject"
            disabled={actionDisabled}
            onClick={() => onReject(subscriber.id)}
          >
            {isRejecting ? "جار الرفض..." : "رفض"}
          </button>
        </div>
      ) : (
        <div className="provider-subscription-card__status">
          <span>مشترك نشط</span>
        </div>
      )}
    </article>
  );
}

export default ProviderSubscriptionCard;
