import { FiBarChart2, FiClock, FiDollarSign, FiEye, FiX } from "react-icons/fi";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "غير محدد";

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function AdvertisementAnalyticsModal({ advertisement, onClose }) {
  if (!advertisement) return null;

  return (
    <div className="advertisement-modal-backdrop" role="presentation">
      <section
        className="advertisement-analytics-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advertisement-analytics-title"
      >
        <button
          type="button"
          className="advertisement-modal-close"
          onClick={onClose}
          aria-label="إغلاق تحليلات الإعلان"
        >
          <FiX aria-hidden="true" />
        </button>

        <span className="advertisement-analytics-modal__icon" aria-hidden="true">
          <FiBarChart2 />
        </span>
        <h2 id="advertisement-analytics-title">
          تحليلات <bdi dir="auto">{advertisement.title}</bdi>
        </h2>

        <div className="advertisement-analytics-modal__grid">
          <div>
            <FiEye aria-hidden="true" />
            <span>المشاهدات</span>
            <strong>{formatNumber(advertisement.views)}</strong>
          </div>
          <div>
            <FiDollarSign aria-hidden="true" />
            <span>السعر</span>
            <strong>{formatNumber(advertisement.price)} شيكل</strong>
          </div>
          <div>
            <FiClock aria-hidden="true" />
            <span>تاريخ النشر</span>
            <strong>{formatDate(advertisement.createdAt)}</strong>
          </div>
        </div>

        <button
          type="button"
          className="advertisement-analytics-modal__action"
          onClick={onClose}
        >
          تم
        </button>
      </section>
    </div>
  );
}

export default AdvertisementAnalyticsModal;
