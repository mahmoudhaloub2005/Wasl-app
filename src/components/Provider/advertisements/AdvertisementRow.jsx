import {
  FiBarChart2,
  FiEdit2,
  FiEye,
  FiImage,
  FiPower,
  FiTrash2,
} from "react-icons/fi";

const statusLabels = {
  active: "نشط",
  expired: "منتهي",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatRelativeDate(value) {
  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) return "تاريخ غير محدد";

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));

  if (days === 0) return "اليوم";
  if (days === 1) return "منذ يوم";
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 14) return "منذ أسبوع";

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function AdvertisementRow({
  advertisement,
  isDeleting,
  isStatusPending,
  onDelete,
  onEdit,
  onOpenAnalytics,
  onToggleStatus,
}) {
  const statusTone =
    advertisement.status === "active" ? "active" : "expired";

  return (
    <div className="advertisements-history-row" role="row">
      <div className="advertisements-history-row__ad" role="cell">
        <span className="advertisements-history-row__thumb">
          {advertisement.imageUrl ? (
            <img src={advertisement.imageUrl} alt={advertisement.title} />
          ) : (
            <FiImage aria-hidden="true" />
          )}
        </span>
        <span>
          <strong>{advertisement.title}</strong>
          <small>{formatRelativeDate(advertisement.createdAt)}</small>
        </span>
      </div>

      <div className="advertisements-history-row__views" role="cell">
        <FiEye aria-hidden="true" />
        <strong>{formatNumber(advertisement.views)}</strong>
      </div>

      <div className="advertisements-history-row__status" role="cell">
        <span
          className={`advertisements-history-row__badge advertisements-history-row__badge--${statusTone}`}
        >
          {statusLabels[advertisement.status] || statusLabels.active}
        </span>
      </div>

      <div className="advertisements-history-row__actions" role="cell">
        <button
          type="button"
          onClick={() => onEdit(advertisement)}
          aria-label="تعديل الإعلان"
          title="تعديل الإعلان"
        >
          <FiEdit2 aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onOpenAnalytics(advertisement)}
          aria-label="عرض تحليلات الإعلان"
          title="عرض التحليلات"
        >
          <FiBarChart2 aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onToggleStatus(advertisement.id)}
          disabled={isStatusPending}
          aria-label={
            advertisement.status === "active"
              ? "إنهاء الإعلان"
              : "تنشيط الإعلان"
          }
          title={
            advertisement.status === "active"
              ? "إنهاء الإعلان"
              : "تنشيط الإعلان"
          }
        >
          <FiPower aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(advertisement)}
          disabled={isDeleting}
          aria-label="حذف الإعلان"
          title="حذف الإعلان"
        >
          <FiTrash2 aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default AdvertisementRow;
