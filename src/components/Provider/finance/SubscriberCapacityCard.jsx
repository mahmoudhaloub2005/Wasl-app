import { FiActivity } from "react-icons/fi";

import GeneratorCapacityItem from "./GeneratorCapacityItem";

function SubscriberCapacityCard({ capacity, isLoading, onNavigate }) {
  return (
    <aside
      className="subscriber-capacity-card"
      aria-labelledby="subscriber-capacity-title"
    >
      <h2 id="subscriber-capacity-title">سعة استهلاك المشتركين</h2>

      {isLoading ? (
        <div className="subscriber-capacity-card__loading">
          {Array.from({ length: 3 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      ) : capacity.length ? (
        <div className="subscriber-capacity-card__list">
          {capacity.map((item) => (
            <GeneratorCapacityItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="subscriber-capacity-card__empty">
          <FiActivity aria-hidden="true" />
          <p>لا توجد مولدات أو اشتراكات نشطة لاحتساب السعة حالياً.</p>
        </div>
      )}

      <button type="button" onClick={() => onNavigate("/provider/finance/capacity")}>
        مشاهدة كافة البيانات
      </button>
    </aside>
  );
}

export default SubscriberCapacityCard;