import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

import CapacityProgressBar from "./CapacityProgressBar";
import { formatCapacity, formatNumber } from "./capacityUtils";

function GeneratorCapacityDetailsModal({ onClose, record }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!record) return undefined;

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onClose, record]);

  if (!record) return null;

  const details = [
    { label: "اسم المولد", value: record.name },
    { label: "المنطقة", value: record.area },
    { label: "الحمل الحالي", value: formatCapacity(record.currentLoad) },
    { label: "السعة القصوى", value: formatCapacity(record.maximumCapacity) },
    { label: "السعة المتاحة", value: formatCapacity(record.availableCapacity) },
    { label: "نسبة الاستهلاك", value: `${record.percentage}%` },
    { label: "المشتركين النشطين", value: formatNumber(record.activeSubscribers) },
    { label: "الحالة", value: record.statusLabel },
  ];

  return (
    <div className="capacity-modal-backdrop" role="presentation">
      <section
        className="capacity-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capacity-modal-title"
        dir="rtl"
      >
        <button
          type="button"
          className="capacity-modal__close"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="إغلاق التفاصيل"
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="capacity-modal-title">تفاصيل سعة المولد</h2>
        <p>{record.name}</p>

        <CapacityProgressBar
          percentage={record.percentage}
          status={record.status}
          statusLabel={record.statusLabel}
        />

        <dl className="capacity-modal__details">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>

        <button type="button" className="capacity-modal__button" onClick={onClose}>
          إغلاق
        </button>
      </section>
    </div>
  );
}

export default GeneratorCapacityDetailsModal;
