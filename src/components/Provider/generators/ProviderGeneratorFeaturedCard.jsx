import {
  FiActivity,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiTool,
  FiZap,
} from "react-icons/fi";

import ProviderGeneratorImage from "./ProviderGeneratorImage";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatDateAge(value) {
  if (!value) return "";

  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) return "";

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));

  if (days === 0) return "اليوم";
  if (days === 1) return "منذ يوم";
  return `منذ ${days} يوم`;
}

function ProviderGeneratorFeaturedCard({
  generator,
  onActivate,
  onDelete,
  onEdit,
  onMaintenance,
  pendingActionKey,
}) {
  const usageWidth = `${Math.max(0, Math.min(100, generator.usagePercentage))}%`;
  const isMaintenance = generator.status === "maintenance";
  const statusActionKey = isMaintenance
    ? `activate-${generator.id}`
    : `maintenance-${generator.id}`;
  const isActionPending = pendingActionKey === statusActionKey;
  const isDeletePending = pendingActionKey === `delete-${generator.id}`;

  return (
    <article
      className={`provider-generator-featured provider-generator-featured--${generator.statusTone}`}
    >
      <div className="provider-generator-featured__media">
        <ProviderGeneratorImage
          imageUrl={generator.imageUrl}
          name={generator.name}
        />
        <span
          className={`provider-generator-featured__badge provider-generator-featured__badge--${generator.statusTone}`}
        >
          {generator.statusLabel}
        </span>
      </div>

      <div className="provider-generator-featured__content">
        <div className="provider-generator-featured__title-row">
          <h2>
            <bdi dir="auto">{generator.name}</bdi>
            {generator.code && <span>({generator.code})</span>}
          </h2>

          <div className="provider-generator-featured__actions">
            <button
              type="button"
              onClick={() => onEdit(generator)}
              aria-label="تعديل المولد"
            >
              <FiEdit2 aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(generator)}
              aria-label="حذف المولد"
              disabled={Boolean(pendingActionKey)}
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="provider-generator-featured__meta">
          {generator.capacityKva > 0 && (
            <span>
              <FiZap aria-hidden="true" />
              القدرة: {formatNumber(generator.capacityKva)} kVA
            </span>
          )}
          {isMaintenance ? (
            generator.lastMaintenanceAt && (
              <span>
                <FiActivity aria-hidden="true" />
                آخر صيانة: {formatDateAge(generator.lastMaintenanceAt)}
              </span>
            )
          ) : (
            <span>
              <FiActivity aria-hidden="true" />
              الاستهلاك: {formatNumber(generator.usagePercentage)}%
            </span>
          )}
        </div>

        {isMaintenance ? (
          <div className="provider-generator-featured__maintenance">
            <strong>سبب العطل / ملاحظات الصيانة</strong>
            <p>
              {generator.maintenanceNote ||
                "لا توجد ملاحظات صيانة مسجلة لهذا المولد."}
            </p>
          </div>
        ) : (
          <div className="provider-generator-featured__usage">
            <div>
              <strong>
                {formatNumber(generator.currentLoad)}/
                {formatNumber(generator.loadCapacity)} {generator.unit}
              </strong>
              <span>حمل الاستهلاك الحالي</span>
            </div>
            <span className="provider-generator-featured__track">
              <i style={{ width: usageWidth }} />
            </span>
          </div>
        )}

        <div className="provider-generator-featured__status-actions">
          {isMaintenance ? (
            <button
              type="button"
              className="provider-generator-featured__activate"
              onClick={() => onActivate(generator.id)}
              disabled={Boolean(pendingActionKey)}
            >
              <FiCheckCircle aria-hidden="true" />
              {isActionPending ? "جار التفعيل..." : "تفعيل"}
            </button>
          ) : (
            <button
              type="button"
              className="provider-generator-featured__maintenance-action"
              onClick={() => onMaintenance(generator.id)}
              disabled={Boolean(pendingActionKey)}
            >
              <FiTool aria-hidden="true" />
              {isActionPending ? "جار التحديث..." : "صيانة"}
            </button>
          )}

          {isDeletePending && (
            <span className="provider-generator-featured__pending">
              جار الحذف...
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProviderGeneratorFeaturedCard;
