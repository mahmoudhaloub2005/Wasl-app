import { useState } from "react";
import { FiClock, FiImage } from "react-icons/fi";

import AdvertisementRow from "./AdvertisementRow";

const INITIAL_VISIBLE_ADVERTISEMENTS = 4;

function AdvertisementsHistory({
  advertisements,
  onDelete,
  onEdit,
  onOpenAnalytics,
  onToggleStatus,
  pendingActionKey,
}) {
  const [showAll, setShowAll] = useState(false);
  const hasAdvertisements = advertisements.length > 0;
  const visibleAdvertisements = showAll
    ? advertisements
    : advertisements.slice(0, INITIAL_VISIBLE_ADVERTISEMENTS);
  const canToggleShowAll =
    advertisements.length > INITIAL_VISIBLE_ADVERTISEMENTS;

  return (
    <section
      className="advertisements-history-card"
      aria-labelledby="advertisements-history-title"
    >
      <div className="advertisements-history-card__header">
        <button
          type="button"
          onClick={() => setShowAll((currentValue) => !currentValue)}
          disabled={!canToggleShowAll}
        >
          {showAll ? "إخفاء" : "عرض الكل"}
        </button>

        <h2 id="advertisements-history-title">
          <FiClock aria-hidden="true" />
          سجل إعلاناتي
        </h2>
      </div>

      {hasAdvertisements ? (
        <div className="advertisements-history-table" role="table">
          <div className="advertisements-history-table__head" role="row">
            <span role="columnheader">الإعلان</span>
            <span role="columnheader">المشاهدات</span>
            <span role="columnheader">الحالة</span>
            <span role="columnheader">الإجراء</span>
          </div>

          {visibleAdvertisements.map((advertisement) => (
            <AdvertisementRow
              advertisement={advertisement}
              isDeleting={pendingActionKey === `delete-${advertisement.id}`}
              isStatusPending={pendingActionKey === `status-${advertisement.id}`}
              key={advertisement.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onOpenAnalytics={onOpenAnalytics}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="advertisements-history-empty">
          <FiImage aria-hidden="true" />
          <p>لم تنشر أي إعلان بعد. سيظهر إعلانك هنا فور نشره.</p>
        </div>
      )}
    </section>
  );
}

export default AdvertisementsHistory;
