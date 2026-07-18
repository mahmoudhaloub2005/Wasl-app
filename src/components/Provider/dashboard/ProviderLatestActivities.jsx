import ProviderActivityItem from "./ProviderActivityItem";
import ProviderEmptyState from "./ProviderEmptyState";

function ProviderLatestActivities({
  activities,
  isLoading,
  showAll,
  onToggleShowAll,
  onNavigate,
}) {
  return (
    <article className="provider-dashboard-panel provider-latest-activities">
      <div className="provider-dashboard-panel__header">
        <button
          type="button"
          className="provider-latest-activities__toggle"
          disabled={isLoading || !activities.length}
          onClick={onToggleShowAll}
        >
          {showAll ? "أقل" : "الكل"}
        </button>
        <h2>آخر النشاطات</h2>
      </div>

      <div
        className={`provider-latest-activities__timeline ${
          !isLoading && !activities.length
            ? "provider-latest-activities__timeline--empty"
            : ""
        }`.trim()}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              className="provider-activity-item provider-activity-item--loading"
              key={index}
            >
              <span />
              <strong />
            </div>
          ))
        ) : activities.length ? (
          activities.map((activity) => (
          <ProviderActivityItem
            activity={activity}
            key={activity.id}
            onNavigate={onNavigate}
          />
          ))
        ) : (
          <ProviderEmptyState message="لا توجد نشاطات مسجلة حالياً" />
        )}
      </div>
    </article>
  );
}

export default ProviderLatestActivities;
