import {
  FiCheckCircle,
  FiEdit2,
  FiSliders,
  FiTrash2,
  FiTool,
} from "react-icons/fi";

import ProviderGeneratorsEmptyState from "./ProviderGeneratorsEmptyState";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function ProviderGeneratorsTable({
  generators,
  isLoading,
  onActivate,
  onDelete,
  onEdit,
  onMaintenance,
  onOpenDetails,
  pendingActionKey,
}) {
  if (isLoading) {
    return (
      <section className="provider-generators-table provider-generators-table--loading">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="provider-generators-table__row" key={index}>
            <span />
            <strong />
            <p />
            <p />
            <p />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="provider-generators-table" aria-label="بقية المولدات">
      {generators.length ? (
        generators.map((generator) => {
          const isMaintenance = generator.status === "maintenance";
          const statusActionKey = isMaintenance
            ? `activate-${generator.id}`
            : `maintenance-${generator.id}`;

          return (
            <div className="provider-generators-table__row" key={generator.id}>
              <button
                type="button"
                className="provider-generators-table__identity"
                onClick={() => onOpenDetails(generator.id)}
              >
                <span className="provider-generators-table__icon">
                  <FiSliders aria-hidden="true" />
                </span>
                <span>
                  <strong>
                    <bdi dir="auto">{generator.name}</bdi>
                  </strong>
                  {generator.code && <small>المعرف: {generator.code}</small>}
                </span>
              </button>

              <span className="provider-generators-table__capacity">
                القدرة: {formatNumber(generator.capacityKva)} kVA
              </span>

              <span className="provider-generators-table__price">
                <strong>{formatNumber(generator.pricePerAmpere)}</strong>
                شيكل/أمبير
              </span>

              <span
                className={`provider-generators-table__status provider-generators-table__status--${generator.statusTone}`}
              >
                {generator.statusLabel}
              </span>

              <div className="provider-generators-table__actions">
                <button
                  type="button"
                  aria-label="تعديل المولد"
                  onClick={() => onEdit(generator)}
                >
                  <FiEdit2 aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={isMaintenance ? "تفعيل المولد" : "وضع المولد تحت الصيانة"}
                  disabled={Boolean(pendingActionKey)}
                  onClick={() =>
                    isMaintenance
                      ? onActivate(generator.id)
                      : onMaintenance(generator.id)
                  }
                >
                  {pendingActionKey === statusActionKey ? (
                    <FiTool aria-hidden="true" />
                  ) : isMaintenance ? (
                    <FiCheckCircle aria-hidden="true" />
                  ) : (
                    <FiTool aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="حذف المولد"
                  disabled={Boolean(pendingActionKey)}
                  onClick={() => onDelete(generator)}
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <ProviderGeneratorsEmptyState message="لا توجد مولدات إضافية حالياً" />
      )}
    </section>
  );
}

export default ProviderGeneratorsTable;
