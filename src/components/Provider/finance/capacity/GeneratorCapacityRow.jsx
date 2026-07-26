import { FiInfo } from "react-icons/fi";

import CapacityProgressBar from "./CapacityProgressBar";
import { formatCapacity, formatNumber } from "./capacityUtils";

function GeneratorCapacityRow({ record, onDetails }) {
  return (
    <article className="generator-capacity-row">
      <div className="generator-capacity-row__cell generator-capacity-row__identity">
        <span>اسم المولد</span>
        <strong>{record.name}</strong>
      </div>

      <div className="generator-capacity-row__cell">
        <span>المنطقة</span>
        <b>{record.area}</b>
      </div>

      <div className="generator-capacity-row__cell">
        <span>الحمل الحالي</span>
        <b>{formatCapacity(record.currentLoad)}</b>
      </div>

      <div className="generator-capacity-row__cell">
        <span>السعة القصوى</span>
        <b>{formatCapacity(record.maximumCapacity)}</b>
      </div>

      <div className="generator-capacity-row__cell">
        <span>السعة المتاحة</span>
        <b>{formatCapacity(record.availableCapacity)}</b>
      </div>

      <div className="generator-capacity-row__cell generator-capacity-row__subscribers">
        <span>المشتركين النشطين</span>
        <b>{formatNumber(record.activeSubscribers)}</b>
      </div>

      <div className="generator-capacity-row__cell generator-capacity-row__progress">
        <span>نسبة الاستهلاك</span>
        <CapacityProgressBar
          percentage={record.percentage}
          status={record.status}
          statusLabel={record.statusLabel}
        />
      </div>

      <div className="generator-capacity-row__cell generator-capacity-row__status">
        <span>الحالة</span>
        <b className={`capacity-status-badge capacity-status-badge--${record.status}`}>
          {record.statusLabel}
        </b>
      </div>

      <div className="generator-capacity-row__cell generator-capacity-row__action">
        <span>الإجراء</span>
        <button
          type="button"
          onClick={() => onDetails(record)}
          aria-label={`عرض تفاصيل ${record.name}`}
        >
          <FiInfo aria-hidden="true" />
          عرض التفاصيل
        </button>
      </div>
    </article>
  );
}

export default GeneratorCapacityRow;
